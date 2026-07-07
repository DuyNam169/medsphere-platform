// ============================================================
// en.ts — src/packages/ai/i18n/en.ts
// English translations for ai package only.
// Merged into core i18n via core/i18n/index.ts
// ============================================================

const aiEn = {
  ai: {
    title: 'AI Assistant',
    assistantName: 'Medsphere AI Assistant',
    online: 'Online',

    // --- Welcome / empty state ---
    welcomeTitle: 'How can I help you today?',
    welcomeSubtitle:
      'Describe your symptoms and I can suggest which specialty to consult. This is not a medical diagnosis.',

    // --- Suggested prompts ---
    suggestIcon1: '🤒',
    suggestPrompt1: 'I have a fever and a sore throat, what should I do?',
    suggestIcon2: '🤕',
    suggestPrompt2: 'I have had a headache for 2 days now',
    suggestIcon3: '🤢',
    suggestPrompt3: 'I feel nauseous and have stomach pain',
    suggestIcon4: '😴',
    suggestPrompt4: "I've had trouble sleeping lately",

    // --- Input bar ---
    disclaimer:
      'This assistant only provides general suggestions and does not replace a doctor\u2019s diagnosis.',
    inputPlaceholder: 'Describe your symptoms...',
    attachFileLockedTooltip: 'Sign in to attach a file',
    send: 'Send',

    // --- Message bubble actions ---
    copy: 'Copy',
    helpful: 'Helpful',
    notHelpful: 'Not helpful',
    errorReply: 'Sorry, I ran into a connection issue. Please try again.',

    // --- Chat header ---
    closeSidebar: 'Close sidebar',
    openSidebar: 'Open sidebar',
    shareLockedTooltip: 'Sign in to share this conversation',
    moreLockedTooltip: 'Sign in for more options',

    // --- Sidebar ---
    newChat: 'New chat',
    newChatLockedTooltip: 'Sign in to start a new chat',
    searchConversations: 'Search conversations',
    recent: 'Recent',
    today: 'Today',
    yesterday: 'Yesterday',
    loginLink: 'Sign in',
    loginToSaveHistory: 'Sign in to save your chat history across devices.',
    guestUser: 'Guest',
    guestSyncHint: 'Sign in to sync your history',

    // --- Demo conversation list (locked, shown to logged-out users) ---
    conv1Title: 'Fever and sore throat',
    conv1Preview: 'Suggested specialty: General Internal Medicine...',
    conv2Title: 'Persistent headache',
    conv2Preview: 'Suggested specialty: Neurology...',
    conv3Title: 'Stomach pain after eating',
    conv3Preview: 'Suggested specialty: Gastroenterology...',
    conv4Title: 'Skin rash',
    conv4Preview: 'Suggested specialty: Dermatology...',
    conv5Title: 'Child with a cough',
    conv5Preview: 'Suggested specialty: Pediatrics...',
    conv6Title: 'Joint pain',
    conv6Preview: 'Suggested specialty: Musculoskeletal...',
    conv7Title: 'Trouble sleeping',
    conv7Preview: 'Suggested specialty: Psychology...',
    backToHome: 'Back to home',
    myAccount: 'My account',
    share: 'Share',
    noSavedConversations: 'No saved conversations yet.',
    attach: 'Attach file',
    attachmentsComingSoonNote: 'File/image analysis is coming soon. Please remove attachments before sending.',
    pastedTextName: 'Pasted text',
    copiedToast: 'Copied to clipboard',
    copyFailedToast: 'Copy failed, please try again',
    feedbackHelpfulToast: 'Thanks for the feedback!',
    feedbackNotHelpfulToast: 'Feedback recorded, thank you!',
  },
} as const;

export default aiEn;
export type AiI18nKeys = typeof aiEn;