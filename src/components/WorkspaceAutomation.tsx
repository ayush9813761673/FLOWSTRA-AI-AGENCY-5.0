import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  Mail, 
  Plus, 
  Send, 
  Clock, 
  Sparkles, 
  Lock, 
  LogOut, 
  RefreshCw, 
  CheckCircle2, 
  CalendarDays,
  UserCheck,
  AlertCircle,
  HelpCircle,
  Loader2
} from "lucide-react";
import { initAuth, googleSignIn, logout } from "../lib/workspaceAuth";
import { User } from "firebase/auth";
import { HyperText } from "./ui/hyper-text";

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  htmlLink: string;
}

interface GmailMessage {
  id: string;
  snippet: string;
  subject: string;
  from: string;
  date: string;
}

export function WorkspaceAutomation() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Gmail & Calendar data states
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [emails, setEmails] = useState<GmailMessage[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Scheduling states
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("10:00");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Email form states
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("Flowstra AI Automation Report");
  const [emailBody, setEmailBody] = useState(
    `<p>Hello,</p>\n<p>This is an automated confirmation that your Flowstra AI Automation setup is active. Our intelligent agent has scanned your workflows and integrated Gmail and Google Calendar successfully!</p>\n<p>Best regards,<br/>The Flowstra Team</p>`
  );
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  
  // Custom focus state
  const [highlightCalendar, setHighlightCalendar] = useState(false);

  // Auth setup
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        setIsLoading(false);
        fetchWorkspaceData(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Set up event listener for scheduling call focus highlights
  useEffect(() => {
    const handleHighlight = () => {
      setHighlightCalendar(true);
      const timer = setTimeout(() => {
        setHighlightCalendar(false);
      }, 3500);
      return () => clearTimeout(timer);
    };
    window.addEventListener("highlight-calendar-scheduler", handleHighlight);
    return () => window.removeEventListener("highlight-calendar-scheduler", handleHighlight);
  }, []);

  // Fetch both Gmail and Calendar data in parallel
  const fetchWorkspaceData = async (accessToken: string) => {
    setIsRefreshing(true);
    setErrorMsg(null);
    try {
      // 1. Fetch upcoming calendar events
      const calUrl = "https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=5&orderBy=startTime&singleEvents=true&timeMin=" + new Date().toISOString();
      const calRes = await fetch(calUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      let fetchedEvents: CalendarEvent[] = [];
      if (calRes.ok) {
        const calData = await calRes.json();
        fetchedEvents = calData.items || [];
      } else {
        console.warn("Failed to fetch calendar events, might need re-auth");
      }

      // 2. Fetch recent Gmail messages
      const gmailListUrl = "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=4";
      const listRes = await fetch(gmailListUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const fetchedEmails: GmailMessage[] = [];
      if (listRes.ok) {
        const listData = await listRes.json();
        const messageSummaries = listData.messages || [];

        // Fetch details for each message to retrieve Subject and From
        await Promise.all(
          messageSummaries.map(async (msg: { id: string }) => {
            const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (detailRes.ok) {
              const detailData = await detailRes.json();
              const headers = detailData.payload?.headers || [];
              const subject = headers.find((h: any) => h.name.toLowerCase() === "subject")?.value || "(No Subject)";
              const from = headers.find((h: any) => h.name.toLowerCase() === "from")?.value || "Unknown";
              const internalDate = new Date(parseInt(detailData.internalDate)).toLocaleDateString();
              
              fetchedEmails.push({
                id: msg.id,
                snippet: detailData.snippet || "",
                subject,
                from,
                date: internalDate,
              });
            }
          })
        );
      } else {
        console.warn("Failed to fetch emails");
      }

      setEvents(fetchedEvents);
      setEmails(fetchedEmails);
    } catch (err: any) {
      console.error("Workspace data fetch error:", err);
      setErrorMsg("Unable to retrieve account data. Please try signing in again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        fetchWorkspaceData(result.accessToken);
      }
    } catch (err: any) {
      console.error("Authentication failed:", err);
      setErrorMsg("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setEvents([]);
      setEmails([]);
      setBookingSuccess(false);
      setEmailSuccess(false);
    } catch (err: any) {
      console.error("Logout error:", err);
      setErrorMsg("Failed to sign out cleanly. Please reload the page.");
    }
  };

  // Helper to schedule a calendar event
  const scheduleEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !bookingDate || !bookingTime) return;

    const eventDate = `${bookingDate}T${bookingTime}:00`;
    const startObj = new Date(eventDate);
    const endObj = new Date(startObj.getTime() + 30 * 60 * 1000); // 30 mins duration

    setIsBooking(true);
    setErrorMsg(null);
    try {
      const calRes = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: "Flowstra AI Strategy Consultation",
          description: "Explore advanced lead gen, pipeline automation, and multi-agent CRM routers with the Flowstra engineering team.",
          start: {
            dateTime: startObj.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: endObj.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          reminders: {
            useDefault: true,
          },
        }),
      });

      if (calRes.ok) {
        setBookingSuccess(true);
        fetchWorkspaceData(token);
        setTimeout(() => setBookingSuccess(false), 5000);
      } else {
        throw new Error("Unable to schedule event");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to schedule the calendar event. Please verify permissions or retry.");
    } finally {
      setIsBooking(false);
    }
  };

  // Helper to send a Gmail message
  const sendEmailMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !emailTo || !emailSubject || !emailBody) return;

    setIsSendingEmail(true);
    setErrorMsg(null);
    try {
      // Form RFC 2822 email format
      const rfcMessage = [
        `To: ${emailTo}`,
        `Subject: ${emailSubject}`,
        "Content-Type: text/html; charset=\"UTF-8\"",
        "MIME-Version: 1.0",
        "",
        emailBody,
      ].join("\n");

      // Base64Url encode
      const base64Raw = btoa(unescape(encodeURIComponent(rfcMessage)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const gmailRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raw: base64Raw,
        }),
      });

      if (gmailRes.ok) {
        setEmailSuccess(true);
        fetchWorkspaceData(token);
        setEmailTo("");
        setTimeout(() => setEmailSuccess(false), 5000);
      } else {
        throw new Error("Unable to send email");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to send email. Please check the recipient address and try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <section id="workspace-integration" className="relative w-full py-24 md:py-32 border-t border-[var(--card-border)] bg-slate-950/20 overflow-hidden">
      {/* Decorative dynamic ambient background glows */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col gap-3 max-w-3xl items-center text-center mx-auto mb-16">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-400 font-mono flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            Interactive Live Sandbox
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            <HyperText text="Connect Your Workspace" className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white inline-block" />
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-slate-400 max-w-2xl mt-1.5 font-medium">
            Experience real-world automation. Connect your actual Google Calendar & Gmail securely via Google OAuth to view events, schedule consultations, and dispatch emails live.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="text-slate-400 text-sm mt-4 font-medium">Synchronizing with Google Identity Securely...</p>
          </div>
        ) : !user ? (
          /* Locked State - Call to Action with Google Button */
          <div className="max-w-xl mx-auto rounded-3xl border border-white/10 bg-zinc-900/40 p-8 md:p-12 text-center backdrop-blur-md shadow-2xl relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500/10 border border-blue-500/20 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">
              <Lock className="h-6 w-6 text-blue-400" />
            </div>

            <h3 className="text-xl font-bold text-white mt-4 mb-3">Authorize Google Workspace Integration</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Log in with your Google Account to safely authorize read/write access to your Google Calendar and Gmail APIs. We only utilize in-memory tokens. No data is stored or saved on any servers.
            </p>

            {errorMsg && (
              <div className="mb-6 flex items-center gap-2 text-xs text-red-400 bg-red-950/20 border border-red-500/20 p-3 rounded-xl justify-center">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex justify-center">
              <button 
                onClick={handleLogin}
                className="inline-flex items-center gap-3.5 px-6 py-4 rounded-xl border border-white/20 bg-white hover:bg-zinc-100 text-slate-900 font-bold text-sm cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5 shrink-0">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                Sign in with Google Account
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mt-6 leading-relaxed">
              Secure authentication provided by Firebase Auth. Google scopes requested: calendar, gmail.readonly, gmail.send.
            </p>
          </div>
        ) : (
          /* Active Logged-In Live Dashboard */
          <div className="space-y-8">
            {/* Header Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "User"} className="h-10 w-10 rounded-full border border-blue-500/20" referrerPolicy="no-referrer" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 font-bold">
                    {user.displayName ? user.displayName[0] : "U"}
                  </div>
                )}
                <div className="text-left">
                  <p className="text-sm font-bold text-white leading-none mb-1 flex items-center gap-1.5">
                    {user.displayName || "Google User"}
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider border border-emerald-500/20">
                      <UserCheck className="h-2.5 w-2.5" />
                      Connected
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => token && fetchWorkspaceData(token)}
                  disabled={isRefreshing}
                  className="flex h-9 items-center justify-center gap-1.5 px-3 rounded-lg border border-white/10 bg-white/5 text-xs text-slate-300 font-medium hover:bg-white/10 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  title="Reload events and email data"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                  <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex h-9 items-center justify-center gap-1.5 px-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-400 font-medium hover:bg-red-500/15 active:scale-95 transition-all cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/20 border border-red-500/20 p-4 rounded-2xl">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Split layout grid: Gmail (Left) & Google Calendar (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* 1. GOOGLE CALENDAR CARD */}
              <div className={`rounded-3xl border p-6 md:p-8 flex flex-col justify-between transition-all duration-700 ${highlightCalendar ? "border-blue-500 ring-4 ring-blue-500/20 bg-blue-950/10 scale-[1.01]" : "border-white/10 bg-zinc-900/20"}`}>
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-white leading-snug">Google Calendar</h3>
                        <p className="text-xs text-slate-400">View and schedule strategy consultations</p>
                      </div>
                    </div>
                  </div>

                  {/* List recent calendar events */}
                  <div className="space-y-3 mb-8">
                    <h4 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest text-left mb-1.5">Upcoming Schedule</h4>
                    {isRefreshing && events.length === 0 ? (
                      <div className="py-8 flex justify-center text-slate-500 text-xs">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading calendar events...
                      </div>
                    ) : events.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/5 bg-white/[0.01] p-6 text-center text-slate-500 text-xs leading-relaxed">
                        <CalendarDays className="h-8 w-8 text-slate-600 mx-auto mb-2 opacity-50" />
                        No upcoming Flowstra sessions found on your primary calendar. Use the scheduler below to book one!
                      </div>
                    ) : (
                      events.map((evt) => {
                        const eventDate = evt.start.dateTime ? new Date(evt.start.dateTime) : evt.start.date ? new Date(evt.start.date) : null;
                        return (
                          <a 
                            href={evt.htmlLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            key={evt.id}
                            className="flex items-center justify-between gap-4 p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-300 group text-left"
                          >
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                                {evt.summary || "(No Title)"}
                              </p>
                              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <Clock className="h-3 w-3" />
                                {eventDate ? eventDate.toLocaleString() : "Date/Time Unknown"}
                              </p>
                            </div>
                            <span className="text-[10px] font-extrabold text-zinc-500 uppercase border border-zinc-800 px-2 py-0.5 rounded-md shrink-0">
                              View
                            </span>
                          </a>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Event Creation Form */}
                <div className="border-t border-white/5 pt-6">
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-widest text-left mb-4 flex items-center gap-1.5">
                    <Plus className="h-3.5 w-3.5 text-blue-400" />
                    <span>Auto-Schedule Strategy Call</span>
                  </h4>

                  {bookingSuccess ? (
                    <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2 animate-bounce" />
                      <p className="text-sm font-bold text-white">Event Confirmed!</p>
                      <p className="text-xs text-emerald-400 mt-1">
                        We scheduled the "Flowstra AI Strategy Consultation" successfully inside your actual Google Calendar.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={scheduleEvent} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left mb-1.5">Date</label>
                          <input 
                            type="date"
                            required
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                            style={{ colorScheme: "dark" }}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left mb-1.5">Time</label>
                          <input 
                            type="time"
                            required
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                            style={{ colorScheme: "dark" }}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isBooking || !bookingDate}
                        className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                      >
                        {isBooking ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                            Booking Strategy Slot...
                          </span>
                        ) : (
                          <>
                            <span>Add Strategy Call to Calendar</span>
                            <Plus className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>


              {/* 2. GMAIL INTEGRATION CARD */}
              <div className="rounded-3xl border border-white/10 bg-zinc-900/20 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-white leading-snug">Gmail</h3>
                        <p className="text-xs text-slate-400">View recent messages & send automated emails</p>
                      </div>
                    </div>
                  </div>

                  {/* List recent emails */}
                  <div className="space-y-3 mb-8">
                    <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest text-left mb-1.5">Recent Mailbox Events</h4>
                    {isRefreshing && emails.length === 0 ? (
                      <div className="py-8 flex justify-center text-slate-500 text-xs">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading recent emails...
                      </div>
                    ) : emails.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/5 bg-white/[0.01] p-6 text-center text-slate-500 text-xs leading-relaxed">
                        <Mail className="h-8 w-8 text-slate-600 mx-auto mb-2 opacity-50" />
                        No recent messages retrieved from Gmail primary inbox.
                      </div>
                    ) : (
                      emails.map((msg) => (
                        <div 
                          key={msg.id}
                          className="p-3 rounded-xl border border-white/5 bg-white/[0.01] text-left"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-bold text-indigo-400 truncate max-w-[70%]">{msg.from}</span>
                            <span className="text-[10px] text-zinc-500 shrink-0">{msg.date}</span>
                          </div>
                          <p className="text-xs font-bold text-white truncate mb-0.5">{msg.subject}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{msg.snippet}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Email Sending Form */}
                <div className="border-t border-white/5 pt-6">
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-widest text-left mb-4 flex items-center gap-1.5">
                    <Send className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Send Automated Report</span>
                  </h4>

                  {emailSuccess ? (
                    <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2 animate-bounce" />
                      <p className="text-sm font-bold text-white">Email Sent!</p>
                      <p className="text-xs text-emerald-400 mt-1">
                        Automated confirmation report was dispatched successfully from your real Gmail address.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={sendEmailMessage} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left mb-1.5">Recipient Email Address</label>
                        <input 
                          type="email"
                          required
                          value={emailTo}
                          onChange={(e) => setEmailTo(e.target.value)}
                          placeholder="e.g. contact@flowstra.org or yourself"
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingEmail || !emailTo}
                        className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-indigo-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                      >
                        {isSendingEmail ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                            Dispatching Email Report...
                          </span>
                        ) : (
                          <>
                            <span>Dispatch Automated Gmail Report</span>
                            <Send className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  );
}
