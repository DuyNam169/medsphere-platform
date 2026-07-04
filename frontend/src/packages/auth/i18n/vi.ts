// ============================================================
// vi.ts — src/packages/auth/i18n/vi.ts
// Vietnamese translations for auth package only.
// ============================================================

const authVi = {
  auth: {
    // --- Page meta ---
    pageTitle: 'Đăng nhập Medsphere',
    pageSubtitle: 'Cộng đồng y tế của bạn, tất cả trong một nơi.',

    // --- Form labels ---
    emailOrPhone: 'Email hoặc số điện thoại',
    password: 'Mật khẩu',
    rememberMe: 'Ghi nhớ đăng nhập',

    // --- Placeholders ---
    emailPlaceholder: 'Nhập email hoặc số điện thoại',
    passwordPlaceholder: 'Nhập mật khẩu',

    // --- Buttons ---
    signIn: 'Đăng nhập',
    signingIn: 'Đang đăng nhập...',
    createAccount: 'Tạo tài khoản mới',
    forgotPassword: 'Quên mật khẩu?',

    // --- Divider ---
    orContinueWith: 'hoặc tiếp tục với',

    // --- Social ---
    continueWithGoogle: 'Tiếp tục với Google',
    continueWithFacebook: 'Tiếp tục với Facebook',

    // --- Validation ---
    emailRequired: 'Vui lòng nhập email hoặc số điện thoại',
    emailInvalid: 'Địa chỉ email không hợp lệ',
    passwordRequired: 'Vui lòng nhập mật khẩu',
    passwordMinLength: 'Mật khẩu phải có ít nhất 6 ký tự',

    // --- Errors ---
    invalidCredentials: 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.',
    accountLocked: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.',
    networkError: 'Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.',
    unknownError: 'Đã có lỗi xảy ra. Vui lòng thử lại.',

    // --- Success ---
    loginSuccess: 'Chào mừng bạn trở lại!',

    // --- Footer ---
    noAccount: 'Chưa có tài khoản?',
    haveAccount: 'Đã có tài khoản?',
    signUp: 'Đăng ký',
    backToHome: 'Về trang chủ',

    // --- Brand copy ---
    brandTagline: 'Kết nối. Chia sẻ. Chữa lành cùng nhau.',
    featureHealth: 'Tin tức & cộng đồng y tế',
    featureAI: 'Trợ lý AI y khoa',
    featureConnect: 'Kết nối với bác sĩ',
  },
} as const;

export default authVi;