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

    registerPageTitle: 'Create your account',
    registerPageSubtitle: 'Join the Medsphere community today.',
    fullName: 'Full name',
    fullNamePlaceholder: 'Enter your full name',
    phone: 'Phone number (optional)',
    phonePlaceholder: 'Enter your phone number',
    confirmPassword: 'Confirm password',
    confirmPasswordPlaceholder: 'Re-enter your password',
    agreeTerms: 'I agree to the Terms of Service and Privacy Policy',
    registering: 'Creating account...',
    registerSuccess: 'Account created successfully!',
    nameRequired: 'Full name is required',
    nameTooLong: 'Full name must be at most 100 characters',
    confirmPasswordRequired: 'Please confirm your password',
    passwordMismatch: 'Passwords do not match',
    phoneInvalid: 'Please enter a valid phone number',
    agreeTermsRequired: 'You must agree to the terms to continue',
    emailAlreadyExists: 'This email is already registered.',
    googleNotReady: 'Google Sign-In is still loading, please try again.',
    passwordWeak: 'Password must be 8+ characters with uppercase, lowercase, number and special character',
    passwordHint: 'At least 8 characters, with uppercase, lowercase, number and special character',
    forgotPasswordTitle: 'Reset your password',
    forgotPasswordSubtitle: 'Enter your email and we will send you a verification code.',
    sendCode: 'Send code',
    sendingCode: 'Sending...',
    enterOtpTitle: 'Enter verification code',
    otpSentMessage: 'We sent a 6-digit code to {{email}}',
    otpLabel: 'Verification code',
    verifyCode: 'Verify code',
    verifyingCode: 'Verifying...',
    otpVerified: 'Code verified',
    resendCode: 'Resend code',
    resendIn: 'Resend in {{s}}s',
    changeEmail: 'Change email',
    otpIncomplete: 'Please enter all 6 digits',
    otpInvalid: 'Incorrect verification code',
    otpExpired: 'This code has expired',
    otpNotVerified: 'Please verify the code first',
    otpResendTooSoon: 'Please wait before requesting a new code',
    otpExpiredRestart: 'Your session expired, please request a new code',
    newPassword: 'New password',
    resetPasswordButton: 'Reset password',
    resettingPassword: 'Resetting...',
    resetPasswordSuccess: 'Password reset successfully!',
    backToLogin: 'Back to sign in',
    loggingOutAllDevices: 'Logging you out of all devices...',
    logoutAllSuccessTitle: 'You have been logged out everywhere',
    logoutAllSuccessMessage: 'All active sessions have been terminated. Please sign in again with a new password if needed.',
    logoutAllErrorTitle: 'Something went wrong',
    logoutAllErrorMessage: 'This link may have expired or already been used.',
    retry: 'Try again',
  },
} as const;

export default authEn;
export type AuthI18nKeys = typeof authEn;