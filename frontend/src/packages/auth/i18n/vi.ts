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

    registerPageTitle: 'Tạo tài khoản Medsphere',
    registerPageSubtitle: 'Tham gia cộng đồng Medsphere ngay hôm nay.',
    fullName: 'Họ và tên',
    fullNamePlaceholder: 'Nhập họ và tên của bạn',
    phone: 'Số điện thoại (không bắt buộc)',
    phonePlaceholder: 'Nhập số điện thoại',
    confirmPassword: 'Xác nhận mật khẩu',
    confirmPasswordPlaceholder: 'Nhập lại mật khẩu',
    agreeTerms: 'Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật',
    registering: 'Đang tạo tài khoản...',
    registerSuccess: 'Tạo tài khoản thành công!',
    nameRequired: 'Vui lòng nhập họ và tên',
    nameTooLong: 'Họ và tên tối đa 100 ký tự',
    confirmPasswordRequired: 'Vui lòng xác nhận mật khẩu',
    passwordMismatch: 'Mật khẩu xác nhận không khớp',
    phoneInvalid: 'Số điện thoại không hợp lệ',
    agreeTermsRequired: 'Bạn cần đồng ý điều khoản để tiếp tục',
    emailAlreadyExists: 'Email này đã được sử dụng.',
    googleNotReady: 'Đăng nhập Google đang tải, vui lòng thử lại.',
    passwordWeak: 'Mật khẩu phải có tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
    passwordHint: 'Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
    forgotPasswordTitle: 'Đặt lại mật khẩu',
    forgotPasswordSubtitle: 'Nhập email của bạn, chúng tôi sẽ gửi mã xác nhận.',
    sendCode: 'Gửi mã',
    sendingCode: 'Đang gửi...',
    enterOtpTitle: 'Nhập mã xác nhận',
    otpSentMessage: 'Chúng tôi đã gửi mã 6 số đến {{email}}',
    otpLabel: 'Mã xác nhận',
    verifyCode: 'Xác nhận mã',
    verifyingCode: 'Đang xác nhận...',
    otpVerified: 'Mã đã được xác nhận',
    resendCode: 'Gửi lại mã',
    resendIn: 'Gửi lại sau {{s}}s',
    changeEmail: 'Đổi email',
    otpIncomplete: 'Vui lòng nhập đủ 6 số',
    otpInvalid: 'Mã xác nhận không đúng',
    otpExpired: 'Mã xác nhận đã hết hạn',
    otpNotVerified: 'Vui lòng xác nhận mã trước',
    otpResendTooSoon: 'Vui lòng chờ một chút trước khi gửi lại mã',
    otpExpiredRestart: 'Phiên đã hết hạn, vui lòng lấy mã mới',
    newPassword: 'Mật khẩu mới',
    resetPasswordButton: 'Đặt lại mật khẩu',
    resettingPassword: 'Đang đặt lại...',
    resetPasswordSuccess: 'Đặt lại mật khẩu thành công!',
    backToLogin: 'Quay lại đăng nhập',
    loggingOutAllDevices: 'Đang đăng xuất khỏi tất cả thiết bị...',
    logoutAllSuccessTitle: 'Đã đăng xuất khỏi tất cả thiết bị',
    logoutAllSuccessMessage: 'Tất cả phiên đăng nhập đã được chấm dứt. Vui lòng đăng nhập lại, đổi mật khẩu nếu cần.',
    logoutAllErrorTitle: 'Đã có lỗi xảy ra',
    logoutAllErrorMessage: 'Liên kết này có thể đã hết hạn hoặc đã được sử dụng.',
    retry: 'Thử lại',
  },
} as const;

export default authVi;