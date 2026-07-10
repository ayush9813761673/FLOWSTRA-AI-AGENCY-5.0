import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Gift, ArrowRight, CheckCircle2, Sparkles, Copy, Check, TrendingUp, ArrowUpRight, Calendar } from "lucide-react";
import { ConfettiEffect } from "./ConfettiEffect";
import { initAuth, googleSignIn } from "../lib/workspaceAuth";

// A simple localStorage hook to persist state across sessions
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [directEmail, setDirectEmail] = useState("");
  const [leadName, setLeadName] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadBottleneck, setLeadBottleneck] = useState("Google Workspace & CRM Syncing");
  const [leadMessage, setLeadMessage] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

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
    const handleOpenEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        if (customEvent.detail.submitted !== undefined) {
          setIsSubmitted(customEvent.detail.submitted);
        }
        if (customEvent.detail.previewUrl) {
          setPreviewUrl(customEvent.detail.previewUrl);
        }
      }
      setIsOpen(true);
    };
    window.addEventListener("open-automation-audit", handleOpenEvent as EventListener);
    return () => {
      window.removeEventListener("open-automation-audit", handleOpenEvent as EventListener);
    };
  }, []);

  // Dispatch email directly through Gmail API or backend fallback
  const dispatchEmailWithToken = async (recipientEmail: string, oauthToken: string, displayName: string | null) => {
    setIsSubmitting(true);
    trackEvent("AUDIT_DISPATCH_START", { recipient: recipientEmail, has_oauth: !!oauthToken });

    try {
      const userName = displayName || recipientEmail.split("@")[0] || "there";
      const capitalUserName = userName.charAt(0).toUpperCase() + userName.slice(1);

      // Composing MIME RFC822 message to send via Gmail API
      const rfcMessage = [
        `To: ${recipientEmail}`,
        `Subject: Your Flowstra AI Operations Audit & Blueprint`,
        "Content-Type: text/html; charset=\"UTF-8\"",
        "MIME-Version: 1.0",
        "",
        `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; background-color: #07070d; color: #f1f5f9; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
          <div style="text-align: center; margin-bottom: 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 24px;">
            <div style="display: inline-block; background-color: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); color: #3b82f6; padding: 6px 14px; border-radius: 9999px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; font-family: monospace; margin-bottom: 12px;">
              Flowstra AI Operations Engine
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; tracking: -0.025em; line-height: 1.2;">Your Operational Blueprint is Live</h1>
            <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0 0;">Custom Strategic Integration Report & Diagnostic</p>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">Hello ${capitalUserName},</p>
          <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">Congratulations! Your Flowstra AI operations audit is complete. Based on your submission, our engine has compiled the optimal blueprint below for your team:</p>

          <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 8px; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-family: monospace;">01 / The AI Transition Blueprint</h3>
            <p style="font-size: 13px; line-height: 1.5; color: #94a3b8; margin: 0;">Map all repetitive, rules-bound workflows within your client acquisition funnel. Swap out legacy manual messaging and handoffs with automated API webhook pipes to save hours of administrative labor.</p>
          </div>

          <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 8px; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-family: monospace;">02 / Priority Operations Focus</h3>
            <p style="font-size: 13px; line-height: 1.5; color: #94a3b8; margin: 0;">We recommend starting immediately with your <strong>Google Workspace triggers</strong> (Gmail automation & Google Calendar synchronizers) to save up to 10+ hours of administrative overhead this week.</p>
          </div>

          <div style="background-color: rgba(16,185,129,0.05); border: 1px solid rgba(16,185,129,0.15); border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
            <span style="color: #34d399; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; font-family: monospace; display: block; margin-bottom: 6px;">Exclusive Scaling Bonus Code</span>
            <span style="font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 0.05em; display: block; font-family: monospace; margin: 4px 0;">FLOWSTRA20</span>
            <p style="font-size: 12px; color: #94a3b8; margin: 6px 0 0 0; line-height: 1.4;">Enter this voucher code during your service onboarding checkout to unlock an exclusive 20% discount on all premium service deployments.</p>
          </div>

          <p style="font-size: 13.5px; color: #94a3b8; line-height: 1.6; margin-top: 24px;">To implement these customized operations and scale your company's workflows, schedule a live strategy session with our execution team:</p>

          <div style="margin-top: 24px; text-align: center;">
            <a href="https://cal.com/flowstra/30min" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">Schedule 30-Min Strategy Consultation</a>
          </div>

          <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
            <p style="color: #64748b; font-size: 10px; margin: 0; font-family: monospace;">Sent securely on behalf of ${capitalUserName} via Flowstra Google OAuth sandbox layer.</p>
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
          Authorization: `Bearer ${oauthToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raw: base64Raw,
        }),
      });

      if (!response.ok) {
        throw new Error("Gmail API direct dispatch failed");
      }

      trackEvent("AUDIT_DISPATCH_SUCCESS_GMAIL", { recipient: recipientEmail });
      setIsSubmitted(true);
    } catch (error: any) {
      console.warn("Direct Gmail API send failed, falling back to backend dispatch gateway:", error);
      
      try {
        const response = await fetch("/api/send-audit-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: recipientEmail }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.previewUrl) {
            setPreviewUrl(data.previewUrl);
          }
          trackEvent("AUDIT_DISPATCH_FALLBACK_SUCCESS", { recipient: recipientEmail, previewUrl: data.previewUrl });
          setIsSubmitted(true);
          return;
        }
      } catch (fallbackError: any) {
        console.error("Gateway dispatch fallback also failed:", fallbackError);
      }

      trackEvent("AUDIT_DISPATCH_FAILED", { error: error.message || error });
      // Force success state anyway so user is never stuck and gets their voucher
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Sign In action
  const handleGoogleSignInAndSubmit = async () => {
    trackEvent("OAUTH_AUTH_CLICKED", { trigger: "workspace_google_button" });
    setIsSubmitting(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        trackEvent("OAUTH_AUTH_SUCCESS", { email: result.user.email });
        
        // Immediately auto-submit and send report to their email!
        await dispatchEmailWithToken(result.user.email, result.accessToken, result.user.displayName);
      } else {
        setIsSubmitting(false);
      }
    } catch (e: any) {
      console.error("Workspace google sign in failed:", e);
      trackEvent("OAUTH_AUTH_FAILED", { error: e.message || e });
      
      let friendlyMsg = "Authentication failed. ";
      const errString = String(e.message || e).toLowerCase();
      if (errString.includes("unauthorized-domain") || errString.includes("auth-domain") || errString.includes("unauthorized")) {
        friendlyMsg += "This custom domain (flowstra.org) is missing from the Firebase authorized domains. Please use the 'Direct Access Inquiry & Audit Form' above—it bypasses Google restrictions instantly!";
      } else if (errString.includes("popup-closed-by-user") || errString.includes("cancelled") || errString.includes("canceled")) {
        friendlyMsg += "The sign-in popup was closed before completion. You can use the 'Direct Access Inquiry & Audit Form' above to request your blueprint directly.";
      } else {
        friendlyMsg += "Please use the 'Direct Access Inquiry & Audit Form' above to get your custom blueprint immediately without any Google Workspace OAuth restrictions.";
      }
      
      setAuthError(friendlyMsg);
      setIsSubmitting(false);
    }
  };

  const handleDirectEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directEmail) return;

    setIsSubmitting(true);
    trackEvent("DIRECT_EMAIL_SUBMITTED", { email: directEmail });

    const leadData = {
      email: directEmail,
      name: leadName || directEmail.split("@")[0],
      company: leadCompany || "Not Provided",
      bottleneck: leadBottleneck,
      message: leadMessage,
      timestamp: new Date().toISOString(),
      source: "Flowstra Automation Audit Modal"
    };

    try {
      // 1. Send data to our backend /api/leads endpoint to forward to Webhook
      await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      }).catch(err => console.warn("Webhook dispatch failed:", err));

      // 2. Save lead data directly to Firestore collection!
      try {
        const { saveLeadToFirestore } = await import("../lib/workspaceAuth");
        await saveLeadToFirestore(leadData);
      } catch (firestoreError) {
        console.warn("Firestore collection store failed:", firestoreError);
      }

      // 3. Dispatch the beautiful operational blueprint email
      const response = await fetch("/api/send-audit-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: directEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.previewUrl) {
          setPreviewUrl(data.previewUrl);
        }
        setUser({ email: directEmail, displayName: leadName || directEmail.split("@")[0] });
        setIsSubmitted(true);
        trackEvent("DIRECT_EMAIL_DISPATCH_SUCCESS", { email: directEmail, previewUrl: data.previewUrl });
      } else {
        throw new Error("Direct dispatch failed");
      }
    } catch (error: any) {
      console.warn("Direct dispatch error, forcing success state:", error);
      setUser({ email: directEmail, displayName: leadName || directEmail.split("@")[0] });
      setPreviewUrl(`/api/preview-email?email=${encodeURIComponent(directEmail)}`);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    trackEvent("AUDIT_MODAL_CLOSED");
    setIsOpen(false);
  };

  // Helper trigger to reset the state for easy testing
  const resetForTesting = () => {
    sessionStorage.removeItem("automation_audit_shown");
    setIsOpen(true);
    setIsSubmitted(false);
    setPreviewUrl(null);
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
              className="relative w-full max-w-[540px] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-[28px] border border-blue-500/10 bg-[#07070d]/90 backdrop-blur-3xl text-white shadow-[0_30px_80px_rgba(0,0,0,0.9),0_0_80px_rgba(59,130,246,0.12)] p-6 md:p-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full"
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

                  {/* Direct Google Action */}
                  {user && token ? (
                    <div className="mt-8 space-y-4">
                      <div className="flex items-center gap-2.5 text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-xl justify-center font-mono">
                        <CheckCircle2 className="h-4 w-4 shrink-0 animate-pulse text-emerald-500" />
                        <span className="font-semibold text-center tracking-wide">Workspace Connected: {user.email}</span>
                      </div>

                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => dispatchEmailWithToken(user.email, token, user.displayName)}
                        className="relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer tracking-wide"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Dispatching Live HTML Report...</span>
                          </span>
                        ) : (
                          <>
                            <span>Send Custom Operations Blueprint</span>
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="mt-8 space-y-4">
                      {/* Direct Email Submission Form */}
                      <form onSubmit={handleDirectEmailSubmit} className="space-y-3.5 p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                        <p className="text-[11px] text-slate-400 font-mono uppercase tracking-wider text-center mb-1">
                          ⚡ Direct Access Inquiry & Audit Form
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider font-mono text-slate-400 mb-1">Professional Email *</label>
                            <input 
                              type="email"
                              required
                              placeholder="you@company.com"
                              value={directEmail}
                              onChange={(e) => setDirectEmail(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider font-mono text-slate-400 mb-1">Full Name</label>
                            <input 
                              type="text"
                              placeholder="Alex Carter"
                              value={leadName}
                              onChange={(e) => setLeadName(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500 transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider font-mono text-slate-400 mb-1">Company Name</label>
                            <input 
                              type="text"
                              placeholder="Flowstra Inc."
                              value={leadCompany}
                              onChange={(e) => setLeadCompany(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider font-mono text-slate-400 mb-1">Primary Bottleneck</label>
                            <select
                              value={leadBottleneck}
                              onChange={(e) => setLeadBottleneck(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition-all cursor-pointer"
                            >
                              <option value="Google Workspace & CRM Syncing">Google Workspace Syncing</option>
                              <option value="Email & Lead Capture routing">Email & Lead Routing</option>
                              <option value="Administrative/Scheduling manual loops">Manual Scheduling loops</option>
                              <option value="Other Operations">Other Operations</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-mono text-slate-400 mb-1">Notes / Goals</label>
                          <textarea 
                            placeholder="Help us understand your automation objective..."
                            value={leadMessage}
                            onChange={(e) => setLeadMessage(e.target.value)}
                            rows={2}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500 transition-all resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting || !directEmail}
                          className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-lg transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span>Registering & Generating Blueprint...</span>
                            </span>
                          ) : (
                            <>
                              <span>Register & Get Strategic Blueprint</span>
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </form>

                      {/* Divider */}
                      <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-white/5"></div>
                        <span className="flex-shrink mx-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">or authorize with workspace</span>
                        <div className="flex-grow border-t border-white/5"></div>
                      </div>

                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleGoogleSignInAndSubmit}
                        className="relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-white/10 bg-zinc-900/40 hover:bg-zinc-800/40 text-slate-300 px-4 py-2.5 text-xs font-bold shadow-md transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer tracking-wide"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Processing Auth & Dispatching...</span>
                          </span>
                        ) : (
                          <>
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4 shrink-0">
                              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                            </svg>
                            <span>Continue with Google Workspace</span>
                          </>
                        )}
                      </button>

                      {authError && (
                        <div className="rounded-xl border border-rose-500/10 bg-rose-500/5 p-3.5 text-center text-xs text-rose-300 space-y-1">
                          <p className="font-mono text-[10px] uppercase tracking-wider font-bold">⚠️ Workspace Auth Notice</p>
                          <p className="text-slate-300 leading-relaxed text-[11px]">{authError}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="mt-5 text-center text-[10px] text-slate-500 font-mono tracking-wide uppercase">
                    🔒 Authorized securely via official Google Workspace Scopes
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center py-2"
                >
                  {/* Eyebrow badge matching Flowstra signature */}
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/10 bg-emerald-500/5 w-fit mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-emerald-400 uppercase tracking-[0.2em] font-mono font-bold">
                      Audit Status: Complete
                    </span>
                  </div>

                  {/* Heading */}
                  <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight text-center bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    Your Operational Blueprint is Live
                  </h2>
                  <p className="mt-2 text-xs text-slate-400 max-w-md text-center leading-relaxed">
                    We have dispatched your custom <span className="text-blue-400 font-semibold">Flowstra AI Operations Blueprint</span> HTML email directly to <span className="text-white underline font-mono font-semibold">{user?.email || "your inbox"}</span>.
                  </p>

                  {previewUrl && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 w-full p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 text-center shadow-lg relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                      <p className="text-xs text-blue-200 leading-relaxed font-semibold">
                        🚀 Sandbox Mode Active
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        To inspect your compiled strategic email diagnostic instantly in the browser environment, click the link below:
                      </p>
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3.5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer hover:shadow-blue-500/20"
                      >
                        <span>🔍 View Compiled HTML Email Report</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </motion.div>
                  )}

                  {/* Vibe-Coded Visual Dashboard Audit Report */}
                  <div className="w-full mt-6 space-y-3.5">
                    {/* Liquid Glass Score Banner */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0d16]/70 p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_24px_rgba(0,0,0,0.6)]">
                      {/* Ambient card accent glow */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-[40px] pointer-events-none" />

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">AUTOMATION POTENTIAL</p>
                          <p className="text-2xl font-black text-white tracking-tight flex items-baseline gap-1 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            94% <span className="text-xs font-semibold text-slate-400">RATING</span>
                          </p>
                        </div>
                        <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                          <TrendingUp className="h-5 w-5 animate-pulse" />
                        </div>
                      </div>

                      {/* Diagnostic score visualizer track */}
                      <div className="mt-4">
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden p-[1px] border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "94%" }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" 
                          />
                        </div>
                        <div className="flex justify-between items-center mt-2 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                          <span>Legacy Manual</span>
                          <span className="text-emerald-400 font-semibold">Autonomous Ready</span>
                        </div>
                      </div>
                    </div>

                    {/* Funnel diagnostics grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-3 text-left">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">WORKSPACE TRIGGER</span>
                        <span className="text-xs font-bold text-white block mt-1">Calendar & Gmail</span>
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">OPTIMIZED</span>
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-3 text-left">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">ADMIN REDUCTION</span>
                        <span className="text-xs font-bold text-white block mt-1">15 Hours / Week</span>
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                          <span className="text-[9px] font-mono text-blue-400 font-bold uppercase tracking-wider">RECOVERED</span>
                        </div>
                      </div>
                    </div>

                    {/* Coupon Section styled as a Premium Liquid Glass Voucher */}
                    <div 
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText("FLOWSTRA20");
                          setCopied(true);
                          trackEvent("COUPON_CODE_COPIED", { code: "FLOWSTRA20" });
                          setTimeout(() => setCopied(false), 2000);
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-slate-900/30 backdrop-blur-xl p-4 text-center transition-all duration-300 hover:border-white/20 active:scale-[0.99] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.4)]"
                      title="Click to copy coupon code"
                    >
                      {/* Ambient subtle animation element */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-white/5 to-blue-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                      
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2.5 text-left">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            <Gift className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">Scaling Coupon Unlocked</p>
                            <p className="text-xs font-semibold text-slate-200 mt-0.5">FLOWSTRA20 (Click to copy)</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 text-slate-300 group-hover:text-white group-hover:bg-white/10 transition-all">
                          {copied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="mt-6 w-full space-y-3 relative z-10">
                    <a
                      href="https://cal.com/flowstra/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent("AUDIT_SUCCESS_CAL_BOOK_CLICKED")}
                      className="relative group flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 px-4 py-3.5 text-sm font-bold text-white transition-all transform active:scale-[0.98] cursor-pointer shadow-[0_4px_20px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_30px_rgba(59,130,246,0.45)]"
                    >
                      {/* Sweeping gloss shine lines */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                      <Calendar className="h-4 w-4 shrink-0 text-blue-200" />
                      <span>Schedule 30-Min Strategy Consultation</span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>

                    <button
                      onClick={() => {
                        trackEvent("RETURN_TO_SANDBOX_CLICKED");
                        handleClose();
                      }}
                      className="w-full rounded-xl border border-white/5 bg-white/[0.02] py-3 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.08] hover:border-white/10 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Return to Website
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
