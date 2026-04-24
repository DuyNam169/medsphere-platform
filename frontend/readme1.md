# README — Medsphere Frontend (v3)

> Cập nhật từ Facebook Homepage Clone v2 → Medsphere v3
> Ghi lại toàn bộ thay đổi đã thực hiện để phục vụ các lần vibe code tiếp theo.

---

## THAY ĐỔI ĐÃ THỰC HIỆN (v2 → v3)

### 1. Hệ thống màu — `src/core/theme/colors.ts`

Đã đổi màu chủ đạo và nền trang:

| Key | Giá trị cũ | Giá trị mới | Ghi chú |
|---|---|---|---|
| `primary` | `#1877F2` | `#1E3A5F` | Navy — màu brand Medsphere |
| `primaryHover` | `#166FE5` | `#162D4A` | Darker navy hover |
| `primaryLight` | `#E7F3FF` | `#E8EDF3` | Light navy tint |
| `primaryText` | `#1877F2` | `#1E3A5F` | |
| `bgPage` | `#F0F2F5` | `#F7F8FA` | Nền sáng hơn, gần trắng |
| `bgInput` | `#F0F2F5` | `#F7F8FA` | Đồng bộ với bgPage |
| `textLink` | `#1877F2` | `#1E3A5F` | |
| `borderFocus` | `#1877F2` | `#1E3A5F` | |
| `reactionLike` | `#1877F2` | `#1E3A5F` | |
| `iconFriends` | `#1877F2` | `#1E3A5F` | |
| `iconGroups` | `#1877F2` | `#1E3A5F` | |
| `btnPrimary` | `#1877F2` | `#1E3A5F` | |
| `btnPrimaryHov` | `#166FE5` | `#162D4A` | |

Tất cả màu khác (badge đỏ, online xanh, sidebar icons, reactions...) giữ nguyên.

---

### 2. Tailwind config — `tailwind.config.js`

File gốc có `theme.extend` **trống hoàn toàn** — không map class `fb-*` nào cả. Đã viết lại hoàn chỉnh:

```js
import { facebookColors } from './src/core/theme/colors.ts';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    // Các class dùng dynamic string trong LeftSidebar — phải safelist
    // để Tailwind không purge khi build
    'bg-fb-icon-profile', 'bg-fb-icon-friends', 'bg-fb-icon-memories',
    'bg-fb-icon-saved',   'bg-fb-icon-groups',  'bg-fb-icon-watch',
    'bg-fb-icon-market',  'bg-fb-icon-events',  'bg-fb-icon-gaming',
    'bg-fb-icon-pages',   'bg-fb-icon-settings',
  ],
  theme: {
    extend: {
      colors: {
        // map toàn bộ facebookColors → class fb-*
        // xem file tailwind.config.js để biết đầy đủ
      },
    },
  },
};
```

Lý do cần `safelist`: `LeftSidebar.tsx` ghép class động kiểu `bgToken: 'bg-fb-icon-friends'`
→ Tailwind không scan được → class bị purge khi build → màu mất.

---

### 3. NavBar — `src/modules/home/components/NavBar.tsx`

Các thay đổi:

**a. Xóa LanguageSwitcher** — sẽ chuyển vào trang Settings sau:
- Xóa `import { LanguageSwitcher }`
- Xóa 2 chỗ dùng `<LanguageSwitcher />` (desktop + mobile drawer)

**b. Đồng bộ màu icon Navy:**
```ts
const NAV_ICON_COLOR = '#1E3A5F';
```
Tất cả icon trong NavBar dùng biến này — Menu, Search, Messenger, Bell, User, và 5 tab giữa. Chỉ badge đỏ giữ nguyên `#E41E3F`.

**c. Căn giữa tuyệt đối nav tabs:**

Vấn đề: sau khi bỏ LanguageSwitcher, cụm icon phải bị lệch → nav tabs lệch theo.

Fix: dùng `absolute left-1/2 -translate-x-1/2` trên `<nav>` thay vì `flex-1 justify-center`:
```tsx
<div className="relative h-14 flex items-center px-2 sm:px-4">
  {/* nav tabs — căn giữa tuyệt đối so với header */}
  <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
    ...
  </nav>
  {/* action buttons — đẩy sang phải */}
  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-auto">
    ...
  </div>
</div>
```

**d. Tab active/inactive:** cả 2 đều Navy, chỉ phân biệt bằng gạch dưới `h-[3px] bg-fb-primary`.

---

### 4. Branding — `index.html`

```html
<html lang="vi">
<title>Medsphere</title>
<meta name="description" content="Medsphere — Kết nối cộng đồng y tế" />
<meta property="og:title" content="Medsphere" />
<meta name="twitter:title" content="Medsphere" />
<link rel="icon" type="image/svg+xml" href="/logo.svg" />
```

Favicon: file `logo.svg` đặt trong `public/logo.svg`.

---

### 5. Logo — assets

Đã thêm 2 file logo vào `src/core/assets/`:

| File | Dùng ở đâu | Kích thước render |
|---|---|---|
| `logo.svg` | NavBar, favicon (public/) | `h-11 w-11` (44px) trong NavBar |
| `full-logo.svg` | Trang login, splash screen | Tùy context |

Màu logo: `#1b395a` / `#1a3656` — gần Navy `#1E3A5F`, chấp nhận được.

Dùng trong NavBar:
```tsx
<img src="/src/core/assets/logo.svg" alt="Medsphere" className="h-11 w-11" />
```

Lưu ý favicon: file `logo.svg` có `viewBox="0 0 1380 752"` rất rộng → chữ M trông nhỏ trên tab trình duyệt. Cần crop lại viewBox sát hình M hơn để favicon hiển thị rõ (chưa làm).

---

## VIỆC CẦN LÀM TIẾP (backlog)

- [ ] Crop lại viewBox của `logo.svg` để favicon to và rõ hơn trên tab
- [ ] Đồng bộ màu icon sidebar (Friends, Groups) sang Navy trong `LeftSidebar.tsx`
- [ ] Cập nhật `app.config.ts` → `brandName: 'Medsphere'`
- [ ] Chuyển LanguageSwitcher vào trang Settings
- [ ] Kết nối API thực (hiện đang dùng mock data)
- [ ] Dark mode

---

## HỆ THỐNG MÀU HIỆN TẠI

File duy nhất để đổi màu: `src/core/theme/colors.ts`

```
colors.ts (facebookColors)
    ↓ import
tailwind.config.js (map sang class fb-*)
    ↓ generate
Tailwind classes: bg-fb-primary, text-fb-text, border-fb-border...
    ↓ dùng trong
Tất cả components
```

### Bảng màu chủ đạo hiện tại:

| Token | Hex | Dùng ở đâu |
|---|---|---|
| `bg-fb-primary` | `#1E3A5F` | Active tab, logo text, nút CTA |
| `bg-fb-primary-hover` | `#162D4A` | Hover nút primary |
| `bg-fb-primary-light` | `#E8EDF3` | Background nhạt active state |
| `bg-fb-bg-page` | `#F7F8FA` | Nền trang tổng thể |
| `bg-fb-bg-card` | `#FFFFFF` | Nền card, modal, sidebar |
| `bg-fb-bg-input` | `#F7F8FA` | Search bar, input fields |
| `bg-fb-bg-hover` | `#F2F2F2` | Hover state nhẹ |
| `bg-fb-bg-hover-dark` | `#E4E6EB` | Hover state đậm |
| `bg-fb-bg-pressed` | `#D8DADF` | Pressed/active state |
| `text-fb-text` | `#050505` | Text chính |
| `text-fb-text-secondary` | `#65676B` | Text phụ, placeholder |
| `border-fb-border` | `#E4E6EB` | Border card, divider |
| `bg-fb-icon-bg` | `#E4E6EB` | Nền icon button tròn navbar |
| `bg-fb-badge` | `#E41E3F` | Badge thông báo đỏ |
| `bg-fb-btn-success` | `#42B72A` | Nút tạo tài khoản |
| `bg-fb-online` | `#31A24C` | Chấm online |

---

## CẤU TRÚC THƯ MỤC (cập nhật)

```
src/
├── core/
│   ├── assets/
│   │   ├── icons/                  ← 30 SVG icons
│   │   ├── logo.svg                ← Icon M (Navy, rounded square)
│   │   └── full-logo.svg           ← Wordmark "Medsphere"
│   ├── icons/
│   │   └── SvgIcon.tsx
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── LanguageSwitcher.tsx    ← Tạm ẩn, sẽ dùng ở Settings
│   │   └── index.ts
│   ├── config/
│   │   └── app.config.ts           ← brandName: 'Medsphere'
│   ├── i18n/
│   │   └── locales/
│   │       ├── en.json
│   │       └── vi.json
│   ├── store/
│   │   └── authStore.ts
│   ├── services/
│   │   ├── api.ts
│   │   └── authService.ts
│   └── theme/
│       ├── colors.ts               ← BỘ MÀU TRUNG TÂM
│       └── index.ts
│
├── modules/
│   ├── home/
│   │   ├── pages/
│   │   │   └── HomePage.tsx
│   │   └── components/
│   │       ├── NavBar.tsx          ← Đã cập nhật v3
│   │       ├── LeftSidebar.tsx
│   │       ├── NewsFeed.tsx
│   │       ├── StoryRow.tsx
│   │       ├── CreatePostCard.tsx
│   │       ├── PostCard.tsx
│   │       ├── RightSidebar.tsx
│   │       └── LoginModal.tsx
│   └── user/
│       └── pages/
│           ├── LoginPage.tsx
│           ├── DashboardPage.tsx
│           └── UsersPage.tsx
│
public/
└── logo.svg                        ← Copy từ assets, dùng cho favicon
```

---

## RESPONSIVE — Breakpoints (không đổi)

| Màn hình | Width | Layout |
|---|---|---|
| Mobile | < 768px | 1 cột — Sidebar ẩn, hamburger menu |
| Tablet | 768–1023px | 1 cột — NavBar đầy đủ |
| Desktop nhỏ | 1024–1279px | 2 cột — Icon sidebar (w-16) + feed |
| Desktop lớn | 1280px+ | 3 cột — Full sidebar (w-280) + feed + right sidebar |

---

## CHẠY DỰ ÁN

```bash
npm install
npm run dev
# → http://localhost:5173
```