// ============================================================
// vi.ts — src/packages/ai/i18n/vi.ts
// Vietnamese translations for ai package only.
// ============================================================

const aiVi = {
  ai: {
    title: 'Trợ lý AI',
    assistantName: 'Trợ lý AI Medsphere',
    online: 'Đang hoạt động',

    // --- Welcome / empty state ---
    welcomeTitle: 'Hôm nay tôi có thể giúp gì cho bạn?',
    welcomeSubtitle:
      'Mô tả triệu chứng của bạn, tôi sẽ gợi ý chuyên khoa phù hợp để đi khám. Đây không phải là chẩn đoán y khoa.',

    // --- Suggested prompts ---
    suggestIcon1: '🤒',
    suggestPrompt1: 'Tôi bị sốt và đau họng, tôi nên làm gì?',
    suggestIcon2: '🤕',
    suggestPrompt2: 'Tôi bị đau đầu 2 ngày nay rồi',
    suggestIcon3: '🤢',
    suggestPrompt3: 'Tôi thấy buồn nôn và đau bụng',
    suggestIcon4: '😴',
    suggestPrompt4: 'Gần đây tôi khó ngủ',

    // --- Input bar ---
    disclaimer:
      'Trợ lý này chỉ đưa ra gợi ý tham khảo, không thay thế chẩn đoán của bác sĩ.',
    inputPlaceholder: 'Mô tả triệu chứng của bạn...',
    attachFileLockedTooltip: 'Đăng nhập để đính kèm file',
    send: 'Gửi',

    // --- Message bubble actions ---
    copy: 'Sao chép',
    helpful: 'Hữu ích',
    notHelpful: 'Không hữu ích',
    errorReply: 'Xin lỗi, tôi đang gặp sự cố kết nối. Bạn vui lòng thử lại nhé.',

    // --- Chat header ---
    closeSidebar: 'Đóng thanh bên',
    openSidebar: 'Mở thanh bên',
    shareLockedTooltip: 'Đăng nhập để chia sẻ cuộc trò chuyện này',
    moreLockedTooltip: 'Đăng nhập để xem thêm tùy chọn',

    // --- Sidebar ---
    newChat: 'Trò chuyện mới',
    newChatLockedTooltip: 'Đăng nhập để bắt đầu trò chuyện mới',
    searchConversations: 'Tìm kiếm cuộc trò chuyện',
    recent: 'Gần đây',
    today: 'Hôm nay',
    yesterday: 'Hôm qua',
    loginLink: 'Đăng nhập',
    loginToSaveHistory: 'Đăng nhập để lưu lịch sử trò chuyện trên mọi thiết bị.',
    guestUser: 'Khách',
    guestSyncHint: 'Đăng nhập để đồng bộ lịch sử',

    // --- Demo conversation list (locked, shown to logged-out users) ---
    conv1Title: 'Sốt và đau họng',
    conv1Preview: 'Gợi ý chuyên khoa: Nội tổng quát...',
    conv2Title: 'Đau đầu kéo dài',
    conv2Preview: 'Gợi ý chuyên khoa: Thần kinh...',
    conv3Title: 'Đau bụng sau khi ăn',
    conv3Preview: 'Gợi ý chuyên khoa: Tiêu hóa...',
    conv4Title: 'Nổi mẩn da',
    conv4Preview: 'Gợi ý chuyên khoa: Da liễu...',
    conv5Title: 'Trẻ bị ho',
    conv5Preview: 'Gợi ý chuyên khoa: Nhi khoa...',
    conv6Title: 'Đau khớp',
    conv6Preview: 'Gợi ý chuyên khoa: Cơ xương khớp...',
    conv7Title: 'Khó ngủ',
    conv7Preview: 'Gợi ý chuyên khoa: Tâm lý...',
    backToHome: 'Về trang chủ',
    myAccount: 'Tài khoản của tôi',
    share: 'Chia sẻ',
    noSavedConversations: 'Chưa có cuộc trò chuyện nào được lưu.',
    attach: 'Đính kèm file',
    attachmentsComingSoonNote: 'Tính năng phân tích file/ảnh sắp ra mắt. Vui lòng gỡ file trước khi gửi tin nhắn.',
    pastedTextName: 'Văn bản đã dán',
    copiedToast: 'Đã sao chép vào bộ nhớ tạm',
    copyFailedToast: 'Sao chép thất bại, vui lòng thử lại',
    feedbackHelpfulToast: 'Cảm ơn bạn đã đánh giá!',
    feedbackNotHelpfulToast: 'Đã ghi nhận phản hồi, cảm ơn bạn!',
  },
} as const;

export default aiVi;