export type Language =
  | "en"
  | "es"
  | "fr"
  | "zh"
  | "hi"
  | "ar"
  | "bn"
  | "pt"
  | "ru"
  | "ur"
  | "id"
  | "de"
  | "ja"
  | "ne";

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  shortLabel: string;
  country: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English", shortLabel: "EN", country: "USA", flag: "🇺🇸" },
  { code: "zh", label: "Chinese", nativeLabel: "中文 (简体)", shortLabel: "ZH", country: "CHINA", flag: "🇨🇳" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", shortLabel: "HI", country: "INDIA", flag: "🇮🇳" },
  { code: "es", label: "Spanish", nativeLabel: "Español", shortLabel: "ES", country: "SPAIN", flag: "🇪🇸" },
  { code: "fr", label: "French", nativeLabel: "Français", shortLabel: "FR", country: "FRANCE", flag: "🇫🇷" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", shortLabel: "AR", country: "SAUDI ARABIA", flag: "🇸🇦" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা", shortLabel: "BN", country: "BANGLADESH", flag: "🇧🇩" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português", shortLabel: "PT", country: "BRAZIL", flag: "🇧🇷" },
  { code: "ru", label: "Russian", nativeLabel: "Русский", shortLabel: "RU", country: "RUSSIA", flag: "🇷🇺" },
  { code: "ur", label: "Urdu", nativeLabel: "اردو", shortLabel: "UR", country: "PAKISTAN", flag: "🇵🇰" },
  { code: "id", label: "Indonesian", nativeLabel: "Bahasa Indonesia", shortLabel: "ID", country: "INDONESIA", flag: "🇮🇩" },
  { code: "de", label: "German", nativeLabel: "Deutsch", shortLabel: "DE", country: "GERMANY", flag: "🇩🇪" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語", shortLabel: "JA", country: "JAPAN", flag: "🇯🇵" },
  { code: "ne", label: "Nepali", nativeLabel: "नेपाली", shortLabel: "NE", country: "NEPAL", flag: "🇳🇵" },
];

export interface Translations {
  nav: {
    clients: string;
    team: string;
    pricing: string;
    bookCall: string;
    workspace: string;
  };
  common: {
    language: string;
    switchLanguage: string;
    verified: string;
    learnMore: string;
    details: string;
    loadingLanguage: string;
  };
  hero: {
    tagline1: string;
    tagline2: string;
  };
  trustedBy: {
    title: string;
  };
  counters: {
    liveBadge: string;
    automationsDeployed: string;
    hoursSaved: string;
    activeApi: string;
    estimatedRoi: string;
    syncNotice: string;
    hrs: string;
  };
  testimonials: {
    badge: string;
    title: string;
    description: string;
    verifiedBadge: string;
    thomasRole: string;
    thomasQuote: string;
    thomasResult: string;
    viewReviewDms: string;
    videoCaseStudy: string;
    verifiedProofTitle: string;
    verifiedProofSubtitle: string;
    closeModal: string;
  };
  tools: {
    badge: string;
    title: string;
    description: string;
  };
  features: {
    badge: string;
    title: string;
    description: string;
    tab1Title: string;
    tab1Subtitle: string;
    tab2Title: string;
    tab2Subtitle: string;
    tab3Title: string;
    tab3Subtitle: string;
    tasksComplete: string;
    estRemaining: string;
    completedIn: string;
    inProgress: string;
    pending: string;
  };
  team: {
    badge: string;
    title: string;
    description: string;
    ayushRole: string;
    ayushBio: string;
    sanjibRole: string;
    sanjibBio: string;
    prasmitRole: string;
    prasmitBio: string;
    keyAchievements: string;
    viewMore: string;
    viewLess: string;
  };
  calculator: {
    badge: string;
    title: string;
    description: string;
    numbersTitle: string;
    leadsPerMonth: string;
    avgDealValue: string;
    currentCloseRate: string;
    currentRevenue: string;
    revenueLeaking: string;
    projectedWithFlowstra: string;
    projectedRoiMilestones: string;
    recovered6mo: string;
    recovered12mo: string;
    currentTrajectory: string;
    withFlowstra: string;
    cumulative: string;
    monthlyRunRate: string;
    netValueSaved: string;
    ctaBtn: string;
    ctaSubtext: string;
  };
  workspace: {
    badge: string;
    title: string;
    description: string;
    authTitle: string;
    authDesc: string;
    allAuthorized: string;
    unlockBtn: string;
    emailPlaceholder: string;
    orLogin: string;
    continueGoogle: string;
    scopesDisclaimer: string;
    connectedBadge: string;
    refresh: string;
    refreshing: string;
    disconnect: string;
    calTitle: string;
    calDesc: string;
    upcomingSchedule: string;
    noEvents: string;
    autoScheduleTitle: string;
    dateLabel: string;
    timeLabel: string;
    addSlotBtn: string;
    bookingSlot: string;
    eventConfirmed: string;
    eventConfirmedDesc: string;
    gmailTitle: string;
    gmailDesc: string;
    recentMailbox: string;
    noEmails: string;
    sendReportTitle: string;
    recipientLabel: string;
    subjectLabel: string;
    messageLabel: string;
    sendBtn: string;
    sendingBtn: string;
    emailSent: string;
    emailSentDesc: string;
  };
  pricing: {
    badge: string;
    title: string;
    description: string;
    emailPlaceholder: string;
    joinWaitlist: string;
    joining: string;
    successTitle: string;
    successDesc: string;
  };
  finalCta: {
    badge: string;
    title: string;
    description: string;
    benefit1: string;
    benefit2: string;
    benefit3: string;
    bookCal: string;
    scheduleDirect: string;
    orMail: string;
    noCardNeeded: string;
  };
  footer: {
    brandDesc: string;
    solutions: string;
    helpfulLinks: string;
    contact: string;
    crmAutomation: string;
    leadQualification: string;
    outboundLogic: string;
    pipelineRouting: string;
    bookCall: string;
    outcomes: string;
    directSupport: string;
    directWhatsApp: string;
    privacyPolicy: string;
    termsOfService: string;
    allRightsReserved: string;
  };
  auditModal: {
    badge: string;
    title: string;
    description: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    connectedStatus: string;
    sendBtn: string;
    dispatchingBtn: string;
    directFormTitle: string;
    emailLabel: string;
    nameLabel: string;
    companyLabel: string;
    bottleneckLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    submitBtn: string;
    generatingBtn: string;
    orAuthorize: string;
    continueGoogle: string;
    authNotice: string;
    secureNotice: string;
    completeStatus: string;
    completeTitle: string;
    completeDesc: string;
    sandboxModeActive: string;
    sandboxDesc: string;
    viewReportBtn: string;
    automationPotential: string;
    rating: string;
    legacyManual: string;
    autonomousReady: string;
    workspaceTrigger: string;
    calendarGmail: string;
    optimized: string;
    adminReduction: string;
    hoursPerWeek: string;
    recovered: string;
    couponTitle: string;
    couponSubtitle: string;
    clickToCopy: string;
    copied: string;
    scheduleStrategyBtn: string;
  };
  dock: {
    clients: string;
    team: string;
    pricing: string;
    support: string;
    audit: string;
    clientsTooltip: string;
    teamTooltip: string;
    pricingTooltip: string;
    supportTooltip: string;
    auditTooltip: string;
  };
}
