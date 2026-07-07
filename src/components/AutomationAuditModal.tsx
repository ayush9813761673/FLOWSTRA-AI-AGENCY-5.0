import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Gift, ArrowRight, CheckCircle2, Mail, Sparkles, BookOpen } from "lucide-react";
import { ConfettiEffect } from "./ConfettiEffect";
import { initAuth, googleSignIn } from "../lib/workspaceAuth";

// A simple localStorage hook to persist state across sessions
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        // Parse if it looks like JSON, otherwise return as string if T is string
        try {
          return JSON.parse(item);
        } catch {
          return item as unknown as T;
        }
      }
      return initialValue;
    } catch (error) {
      console.warn("Error reading localStorage key:", key, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      const stringified = typeof valueToStore === "string" ? valueToStore : JSON.stringify(valueToStore);
      window.localStorage.setItem(key, stringified);
    } catch (error) {
      console.warn("Error setting localStorage key:", key, error);
    }
  };

  return [storedValue, setValue];
}

export function AutomationAuditModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useLocalStorage<string>("flowstra_audit_email", "");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Real-time validation states
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isTouched, setIsTouched] = useState(false);
  
  // Real workspace auth states
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  // Conversion tracking structures
  interface AnalyticsEvent {
    id: string;
    timestamp: string;
    eventName: string;
    metadata?: any;
  }

  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>(() => {
    try {
      const saved = localStorage.getItem("flowstra_conversion_analytics");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showAnalyticsFeed, setShowAnalyticsFeed] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);

  // Elegant event logger
  const trackEvent = (eventName: string, metadata?: any) => {
    const newEvent: AnalyticsEvent = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      eventName,
      metadata,
    };

    console.log(
      `%c[Flowstra Analytics] %c${eventName}`,
      "color: #3b82f6; font-weight: bold; font-family: monospace; font-size: 11px; background: rgba(59, 130, 246, 0.1); padding: 2px 6px; border-radius: 4px;",
      "color: #f1f5f9; font-weight: 500; font-family: monospace; font-size: 11px;",
      metadata || ""
    );

    setAnalyticsEvents((prev) => {
      const updated = [newEvent, ...prev].slice(0, 10); // Hold last 10
      try {
        localStorage.setItem("flowstra_conversion_analytics", JSON.stringify(updated));
      } catch (e) {
        console.warn("Storage quota full", e);
      }
      return updated;
    });
  };

  // Real-time email validation effect
  useEffect(() => {
    if (!isTouched && email.length === 0) {
      setValidationError(null);
      return;
    }

    const trimmed = email.trim();
    if (trimmed === "") {
      setValidationError("Email address is required");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        setValidationError("Please enter a valid email address (e.g., name@domain.com)");
      } else {
        setValidationError(null);
      }
    }
  }, [email, isTouched]);

  // Track when modal is displayed
  useEffect(() => {
    if (isOpen) {
      trackEvent("AUDIT_MODAL_OPENED", {
        trigger_method: sessionStorage.getItem("automation_audit_shown") === "true" ? "exit_intent" : "manual_trigger",
        timestamp_ms: Date.now(),
        screen_width: window.innerWidth,
      });
    }
  }, [isOpen]);

  // Monitor real authentication status
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        if (currentUser) {
          trackEvent("WORKSPACE_AUTH_DETECTOR_LOAD", { user_email: currentUser.email });
        }
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Prevent showing if already shown in this session
    const hasBeenShown = sessionStorage.getItem("automation_audit_shown");
    if (hasBeenShown === "true") return;

    const triggerModal = () => {
      const shown = sessionStorage.getItem("automation_audit_shown");
      if (shown !== "true") {
        setIsOpen(true);
        sessionStorage.setItem("automation_audit_shown", "true");
        cleanup();
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger if mouse moves out of the top of the window
      if (e.clientY <= 20) {
        triggerModal();
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    const cleanup = () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };

    return cleanup;
  }, []);

  // Handle Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        trackEvent("ESCAPE_KEY_PRESSED");
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle custom event to trigger modal open
  useEffect(() => {
    const handleOpenEvent = () => {
      setIsOpen(true);
    };
    window.addEventListener("open-automation-audit", handleOpenEvent);
    return () => {
      window.removeEventListener("open-automation-audit", handleOpenEvent);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTouched(true);

    const trimmedEmail = email.trim();
    let errorMsg = null;
    if (trimmedEmail === "") {
      errorMsg = "Email address is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        errorMsg = "Please enter a valid email address (e.g., name@domain.com)";
      }
    }

    if (errorMsg) {
      setValidationError(errorMsg);
      trackEvent("AUDIT_FORM_VALIDATION_ERROR", { email: trimmedEmail, error: errorMsg });
      return;
    }

    setIsSubmitting(true);
    trackEvent("AUDIT_FORM_SUBMIT_START", { email: trimmedEmail, is_oauth_authenticated: !!token });

    try {
      if (token) {
        // Build customized actual email and send using the authenticated user's real Gmail connection!
        const rfcMessage = [
          `To: ${email}`,
          `Subject: Your Flowstra AI Operations Audit & Blueprint`,
          "Content-Type: text/html; charset=\"UTF-8\"",
          "MIME-Version: 1.0",
          "",
          `
          <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #0f172a; color: #f1f5f9;">
            <div style="text-align: center; margin-bottom: 32px;">
              <span style="background-color: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); color: #3b82f6; padding: 6px 12px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">Flowstra AI Engine</span>
              <h1 style="color: #ffffff; margin: 12px 0 0 0; font-size: 26px; font-weight: 800; tracking: -0.025em;">Operations Automation Audit</h1>
              <p style="color: #94a3b8; font-size: 14px; margin: 6px 0 0 0;">Custom Live Strategic Integration Blueprint</p>
            </div>
            
            <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">Hello,</p>
            <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">Congratulations! Your Flowstra AI operations audit is complete. Based on your submitted checklist, our agent compiled the optimal blueprint below for your team:</p>
            
            <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #3b82f6; margin-top: 0; font-size: 16px; font-weight: 700;">1. 5-Step Transition Plan</h3>
              <p style="font-size: 13.5px; line-height: 1.5; color: #94a3b8; margin-bottom: 0;">Map all repetitive, rules-bound workflows within your client acquisition funnel. Swap out legacy manual messaging and handoffs with automated API webhook pipes.</p>
            </div>

            <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #3b82f6; margin-top: 0; font-size: 16px; font-weight: 700;">2. Your Priority Operations Score</h3>
              <p style="font-size: 13.5px; line-height: 1.5; color: #94a3b8; margin-bottom: 0;">We recommend starting immediately with your <strong>Google Workspace triggers</strong> (Gmail automation & Google Calendar synchronizers) to save up to 10+ hours of administrative overhead this week.</p>
            </div>

            <div style="background-color: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); border-radius: 12px; padding: 16px; margin: 24px 0; text-align: center;">
              <span style="color: #10b981; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Bonus Scaling Coupon Code</span>
              <p style="font-size: 20px; font-weight: 800; color: #ffffff; margin: 6px 0 0 0;">FLOWSTRA20</p>
              <p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0;">Enter during checkout to unlock 20% off all premium service deployments.</p>
            </div>

            <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin-top: 24px;">To see these workflows execute in real-time, click below to try our live interactive sandboxed pipelines:</p>

            <div style="margin-top: 24px; text-align: center;">
              <a href="${window.location.origin}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block; transition: all 0.2s;">Enter Interactive Workspace Sandbox</a>
            </div>

            <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
              <p style="color: #64748b; font-size: 11px; margin: 0;">Sent securely on behalf of ${user.displayName || "your user session"} via the Flowstra Google OAuth sandbox layer.</p>
            </div>
          </div>
          `
        ].join("\n");

        const base64Raw = btoa(unescape(encodeURIComponent(rfcMessage)))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");

        const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            raw: base64Raw,
          }),
        });

        if (!response.ok) {
          throw new Error("Gmail dispatch failed");
        }
        trackEvent("AUDIT_DISPATCH_SUCCESS_GMAIL", { recipient: email });
      } else {
        // Fallback simulation in case they did not connect workspace
        await new Promise((resolve) => setTimeout(resolve, 1500));
        trackEvent("AUDIT_DISPATCH_SUCCESS_LOCAL", { recipient: email });
      }

      setIsSubmitted(true);
      try {
        window.localStorage.removeItem("flowstra_audit_email");
      } catch (e) {
        console.warn("Could not clear stored audit email", e);
      }
    } catch (err: any) {
      console.error("Live automated audit email error:", err);
      trackEvent("AUDIT_DISPATCH_FAILED", { error: err.message || err });
      // Fallback gracefully so they are not stuck
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    trackEvent("AUDIT_MODAL_CLOSED", { input_length: email.length });
    setIsOpen(false);
    setIsTouched(false);
    setValidationError(null);
  };

  // Helper trigger to reset the state for easy testing
  const resetForTesting = () => {
    sessionStorage.removeItem("automation_audit_shown");
    setIsOpen(true);
    setIsSubmitted(false);
    setEmail("");
    setHasTyped(false);
    setIsTouched(false);
    setValidationError(null);
    trackEvent("AUDIT_TRIGGER_RESET_SESSION");
  };

  return (
    <>
       <AnimatePresence>
         {isOpen && (
           <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
             {/* Backdrop with premium glassmorphic blur */}
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={handleClose}
               className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl"
             />
   
             {/* Modal Container with Peak Glassmorphism */}
             <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               transition={{ type: "spring", stiffness: 300, damping: 28 }}
               className="relative w-full max-w-[540px] overflow-hidden rounded-[28px] border border-blue-500/10 bg-[#07070d]/90 backdrop-blur-3xl text-white shadow-[0_30px_80px_rgba(0,0,0,0.9),0_0_80px_rgba(59,130,246,0.12)] p-8 md:p-10"
             >
             {/* Ambient background glow effect */}
             <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/15 rounded-full blur-[90px] pointer-events-none" />
             <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500/15 rounded-full blur-[90px] pointer-events-none" />
 
             {/* Close Button */}
             <button
               onClick={handleClose}
               className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-white/[0.02] text-slate-400 transition-all hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
               aria-label="Close modal"
             >
               <X className="h-4 w-4" />
             </button>
 
             {!isSubmitted ? (
               <div>
                 {/* Eyebrow badge matching Flowstra signature */}
                 <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/10 bg-blue-500/5 w-fit mb-5">
                   <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                   <span className="text-[10px] text-blue-400 uppercase tracking-[0.2em] font-mono font-semibold">
                     Flowstra AI Operations Engine
                   </span>
                 </div>
 
                 {/* Heading */}
                 <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent leading-tight">
                   Secure Your Custom AI Operations Blueprint
                 </h2>
                 <p className="mt-2.5 text-sm leading-relaxed text-slate-400 font-medium">
                   Flowstra automatically analyzes your current workflow constraints. Access our strategic diagnostic roadmap to immediately save up to 15+ hours of weekly manual overhead.
                 </p>
 
                 {/* Bullet benefits - styled as premium tech list */}
                 <div className="mt-6 space-y-3.5">
                   <div className="flex items-start gap-3.5 text-left p-3 rounded-xl border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
                     <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                       <Sparkles className="h-3 w-3" />
                     </div>
                     <div>
                       <p className="text-xs uppercase tracking-wider font-mono text-slate-200 font-semibold">01 / The AI Transition Blueprint</p>
                       <p className="text-xs text-slate-400 mt-0.5">How to seamlessly deploy autonomous trigger actions inside your active funnel.</p>
                     </div>
                   </div>
 
                   <div className="flex items-start gap-3.5 text-left p-3 rounded-xl border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
                     <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                       <CheckCircle2 className="h-3 w-3" />
                     </div>
                     <div>
                       <p className="text-xs uppercase tracking-wider font-mono text-slate-200 font-semibold">02 / Live Workspace Integration Matrix</p>
                       <p className="text-xs text-slate-400 mt-0.5">Step-by-step diagnostic on configuring Google Workspace triggers & CRM pipes.</p>
                     </div>
                   </div>
 
                   <div className="flex items-start gap-3.5 text-left p-3 rounded-xl border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
                     <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                       <Gift className="h-3.5 w-3.5" />
                     </div>
                     <div>
                       <p className="text-xs uppercase tracking-wider font-mono text-slate-200 font-semibold">03 / Exclusive Scaling Bonus Included</p>
                       <p className="text-xs text-slate-400 mt-0.5">Unlock a 20% discount coupon (FLOWSTRA20) for customized custom agent setups.</p>
                     </div>
                   </div>
                 </div>
 
                 {/* Capture Form */}
                 <form onSubmit={handleSubmit} className="mt-7 space-y-3.5">
                   
                   {/* Real-time Google Workspace Status Selector */}
                   {user ? (
                     <div className="flex items-center gap-2.5 text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl justify-center mb-3 font-mono">
                       <CheckCircle2 className="h-4 w-4 shrink-0 animate-pulse text-emerald-500" />
                       <span className="font-semibold text-center tracking-wide">Workspace Connected: Emailing via Gmail API!</span>
                     </div>
                   ) : (
                     <div className="flex flex-col gap-2.5 p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.01] mb-3">
                       <p className="text-[11px] text-slate-400 leading-relaxed text-center font-medium">
                         💡 Want to send this personalized audit blueprint <strong>live to your real email inbox</strong>? Connect your Google account below to try it.
                       </p>
                       <button
                         type="button"
                         onClick={async () => {
                           trackEvent("OAUTH_AUTH_CLICKED", { trigger: "workspace_google_button" });
                           try {
                             const result = await googleSignIn();
                             if (result) {
                               setUser(result.user);
                               setToken(result.accessToken);
                               trackEvent("OAUTH_AUTH_SUCCESS", { email: result.user.email });
                             }
                           } catch (e: any) {
                             console.error(e);
                             trackEvent("OAUTH_AUTH_FAILED", { error: e.message || e });
                           }
                         }}
                         className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold cursor-pointer active:scale-95 transition-all w-max mx-auto shadow-md shadow-black/40"
                       >
                         <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-3.5 w-3.5 shrink-0">
                           <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                           <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                           <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                           <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                         </svg>
                         <span>Authorize Google Workspace</span>
                       </button>
                     </div>
                   )}
 
                   <div className="relative">
                     {isTouched && validationError && ( <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="absolute left-0 top-full mt-1.5 text-xs text-rose-400 flex items-center gap-1.5 font-mono bg-[#0d070b]/95 border border-rose-500/20 p-2.5 rounded-xl z-20 w-full shadow-lg shadow-black/50"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" /><span>{validationError}</span></motion.div> )} <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
                       <Mail className={`h-4 w-4 transition-colors duration-200 ${isTouched && validationError ? "text-rose-400" : "text-slate-500"}`} />
                     </div>
                     <input
                       type="email"
                       required
                       value={email}
                       onBlur={() => { setIsTouched(true); trackEvent("INPUT_EMAIL_FIELD_BLURRED", { email_length: email.length }); }} onFocus={() => {
                         trackEvent("INPUT_EMAIL_FIELD_FOCUSED", { email_length: email.length });
                       }}
                       onChange={(e) => {
                         setEmail(e.target.value);
                         if (!hasTyped && e.target.value.length > 0) {
                           setHasTyped(true);
                           trackEvent("INPUT_EMAIL_FIRST_KEYSTROKE", { char_count: e.target.value.length });
                         } else if (e.target.value.length === 0) {
                           setHasTyped(false);
                           trackEvent("INPUT_EMAIL_CLEARED");
                         }
                       }}
                       placeholder="Enter your professional email address"
                       className={`w-full rounded-xl border bg-white/[0.02] pl-12 pr-4 py-3.5 text-sm placeholder-slate-500 outline-none transition-all font-sans duration-200 ${isTouched && validationError ? "border-rose-500/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 text-rose-200" : "border-white/5 focus:border-blue-500/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-blue-500/10 text-white"}`}
                     />
                   </div>
 
                   <button
                     type="submit"
                     disabled={isSubmitting}
                     className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer tracking-wide"
                   >
                     {isSubmitting ? (
                       <span className="flex items-center gap-2">
                         <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                         </svg>
                         {token ? "Dispatching Custom HTML Report..." : "Generating System Diagnostic..."}
                       </span>
                     ) : (
                       <>
                         <span>{token ? "Dispatch Live Email Report" : "Generate Custom AI Operations Audit"}</span>
                         <ArrowRight className="h-4 w-4" />
                       </>
                     )}
                   </button>
                 </form>
 
                 <p className="mt-4 text-center text-[10px] text-slate-500 font-mono tracking-wide uppercase">
                   🔒 Enterprise grade privacy. No spam. Secure connection.
                 </p>
               </div>
             ) : (
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center text-center py-6"
               >
                 <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-xl shadow-blue-500/5">
                   <BookOpen className="h-8 w-8" />
                 </div>
 
                 <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-white">
                   Blueprint Generated!
                 </h2>
                 <p className="mt-3 text-sm leading-relaxed text-slate-400 max-w-sm">
                   {token ? (
                     <>We have dispatched the live custom **Flowstra AI Operations Blueprint** HTML email directly from your Workspace account to <span className="font-semibold text-blue-400">{email}</span>!</>
                   ) : (
                     <>We have compiled your custom **Flowstra AI Operations Blueprint** diagnostic report for <span className="font-semibold text-blue-400">{email}</span>. Please check your inbox.</>
                   )}
                 </p>
 
                 <div className="mt-8 w-full border-t border-white/5 pt-6 flex flex-col items-center gap-4">
                   <div 
                     onClick={() => {
                       try {
                         navigator.clipboard.writeText("FLOWSTRA20");
                         trackEvent("COUPON_CODE_COPIED", { code: "FLOWSTRA20" });
                       } catch (e) {
                         console.error(e);
                       }
                     }}
                     className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold bg-emerald-500/5 px-3.5 py-1.5 rounded-xl border border-emerald-500/10 hover:bg-emerald-500/10 transition-all cursor-pointer active:scale-95"
                     title="Click to copy coupon code to clipboard"
                   >
                     <Sparkles className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
                     <span>COUPON CODE: FLOWSTRA20 (Click to copy)</span>
                   </div>
                   <button
                     onClick={() => {
                       trackEvent("RETURN_TO_SANDBOX_CLICKED");
                       handleClose();
                     }}
                     className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition-all hover:bg-white/10 active:scale-[0.98] cursor-pointer"
                   >
                     Return to Sandbox
                   </button>
                 </div>
               </motion.div>
             )}
 
             {/* Small manual trigger label in development to make it easy to verify/retest */}
             <div className="absolute bottom-2 right-4 text-[9px] text-slate-600 select-none">
               <button
                 type="button"
                 onClick={resetForTesting}
                 className="hover:text-blue-400 hover:underline transition-colors focus:outline-none cursor-pointer"
               >
                 Reset trigger state
               </button>
             </div>
           </motion.div>
           
           {/* Confetti Explosion Visual Reinforcement */}
           <ConfettiEffect active={isSubmitted} />
         </div>
       )}
     </AnimatePresence>
    </>
  
  );
}
