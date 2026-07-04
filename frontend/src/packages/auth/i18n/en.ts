// ============================================================
// en.ts — src/packages/auth/i18n/en.ts
// English translations for auth package only.
// Merged into core i18n via auth package's index.ts
// ============================================================

const authEn = {
  auth: {
    // --- Page meta ---
    pageTitle: 'Sign in to Medsphere',
    pageSubtitle: 'Your medical community, all in one place.',

    // --- Form labels ---
    emailOrPhone: 'Email or phone number',
    password: 'Password',
    rememberMe: 'Remember me',

    // --- Placeholders ---
    emailPlaceholder: 'Enter your email or phone',
    passwordPlaceholder: 'Enter your password',

    // --- Buttons ---
    signIn: 'Sign in',
    signingIn: 'Signing in...',
    createAccount: 'Create new account',
    forgotPassword: 'Forgot password?',

    // --- Divider ---
    orContinueWith: 'or continue with',

    // --- Social ---
    continueWithGoogle: 'Continue with Google',
    continueWithFacebook: 'Continue with Facebook',

    // --- Validation ---
    emailRequired: 'Email or phone is required',
    emailInvalid: 'Please enter a valid email address',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 6 characters',

    // --- Errors ---
    invalidCredentials: 'Incorrect email or password. Please try again.',
    accountLocked: 'Your account has been locked. Please contact support.',
    networkError: 'Connection error. Please check your internet and try again.',
    unknownError: 'Something went wrong. Please try again.',

    // --- Success ---
    loginSuccess: 'Welcome back!',

    // --- Footer ---
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    signUp: 'Sign up',
    backToHome: 'Back to home',

    // --- Brand copy ---
    brandTagline: 'Connect. Share. Heal together.',
    featureHealth: 'Health news & community',
    featureAI: 'AI medical assistant',
    featureConnect: 'Connect with doctors',
  },
} as const;

export default authEn;
export type AuthI18nKeys = typeof authEn;