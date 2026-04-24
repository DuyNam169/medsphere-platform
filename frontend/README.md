# 📘 README — Facebook Homepage Clone (v2)

> Phiên bản 2: Responsive đầy đủ + Color Token System thống nhất.

---

## 🎨 HỆ THỐNG MÀU — Cách đổi theme chỉ 1 lần

### File duy nhất cần sửa: `src/core/theme/colors.ts`

```
src/core/theme/
├── colors.ts   ← ✅ SỬA MÀU Ở ĐÂY — áp dụng toàn bộ app
└── index.ts    ← Re-export
```

File `colors.ts` chứa object `facebookColors` với tất cả màu được đặt tên rõ ràng:

```ts
export const facebookColors = {
  primary:       '#1877F2',  // ← Đổi màu brand tại đây
  primaryHover:  '#166FE5',
  primaryLight:  '#E7F3FF',

  bgPage:        '#F0F2F5',  // nền trang
  bgCard:        '#FFFFFF',  // nền card
  bgInput:       '#F0F2F5',  // nền input/search
  bgHover:       '#F2F2F2',  // hover state
  bgHoverDark:   '#E4E6EB',  // hover đậm hơn
  bgPressed:     '#D8DADF',  // pressed state

  textPrimary:   '#050505',  // text chính
  textSecondary: '#65676B',  // text phụ
  textLink:      '#1877F2',  // links

  border:        '#E4E6EB',  // border card, divider
  borderInput:   '#CED0D4',  // border input

  badgeBg:       '#E41E3F',  // badge đỏ thông báo
  online:        '#31A24C',  // chấm xanh online

  btnPrimary:    '#1877F2',  // nút đăng nhập
  btnSuccess:    '#42B72A',  // nút tạo tài khoản

  // Sidebar icon backgrounds — đổi màu icon từng mục ở đây
  iconFriends:   '#1877F2',
  iconMemories:  '#E4626F',
  iconSaved:     '#6247AA',
  iconGroups:    '#1877F2',
  iconMarket:    '#00A400',
  iconGaming:    '#7C5CBF',
  // ...xem đầy đủ trong file
};
```

### Cách hoạt động — Flow màu:
```
colors.ts (facebookColors)
    ↓ import
tailwind.config.js (map sang class fb-*)
    ↓ generate
Tailwind classes: bg-fb-primary, text-fb-text, border-fb-border...
    ↓ dùng trong
Tất cả components (NavBar, PostCard, LeftSidebar, ...)
```

### Ví dụ đổi màu brand sang xanh lá:
```ts
// colors.ts — chỉ sửa 1 dòng:
primary: '#16A34A',  // green-600
// → NavBar active tab, logo text, buttons, links đều đổi ngay
```

### Danh sách Tailwind tokens fb-* đầy đủ:
| Token class | Màu hiện tại | Dùng ở đâu |
|---|---|---|
| `bg-fb-primary` / `text-fb-primary` | #1877F2 | Active tab, logo, nút CTA |
| `bg-fb-primary-hover` | #166FE5 | Hover trên nút primary |
| `bg-fb-primary-light` | #E7F3FF | Background nhạt active state |
| `bg-fb-bg-page` | #F0F2F5 | Nền trang tổng thể |
| `bg-fb-bg-card` | #FFFFFF | Nền card, modal, sidebar |
| `bg-fb-bg-input` | #F0F2F5 | Search bar, input fields |
| `bg-fb-bg-hover` | #F2F2F2 | Hover state nhẹ |
| `bg-fb-bg-hover-dark` | #E4E6EB | Hover state đậm |
| `bg-fb-bg-pressed` | #D8DADF | Pressed/active state |
| `text-fb-text` | #050505 | Text chính |
| `text-fb-text-secondary` | #65676B | Text phụ, placeholder |
| `text-fb-text-link` | #1877F2 | Links |
| `border-fb-border` | #E4E6EB | Border card, divider |
| `border-fb-border-input` | #CED0D4 | Border input |
| `bg-fb-icon-bg` | #E4E6EB | Nền icon button tròn |
| `bg-fb-badge` | #E41E3F | Badge thông báo đỏ |
| `bg-fb-btn-primary` | #1877F2 | Nút đăng nhập |
| `bg-fb-btn-success` | #42B72A | Nút tạo tài khoản |
| `bg-fb-btn-neutral` | #E4E6EB | Nút thứ cấp |
| `bg-fb-online` | #31A24C | Chấm online |
| `bg-fb-icon-friends` | #1877F2 | Icon sidebar Friends |
| `bg-fb-icon-memories` | #E4626F | Icon sidebar Memories |
| `bg-fb-icon-saved` | #6247AA | Icon sidebar Saved |
| `bg-fb-icon-market` | #00A400 | Icon sidebar Marketplace |
| `bg-fb-icon-gaming` | #7C5CBF | Icon sidebar Gaming |

---

## 📱 RESPONSIVE — Breakpoints

| Màn hình | Width | Layout |
|---|---|---|
| Mobile (xs/sm) | < 768px | 1 cột — Sidebar ẩn, NavBar thu gọn, tab ẩn → hamburger |
| Tablet (md) | 768px–1023px | 1 cột — NavBar hiện đầy đủ, sidebar vẫn ẩn |
| Desktop nhỏ (lg) | 1024px–1279px | 2 cột — Icon sidebar trái (w-16) + feed |
| Desktop lớn (xl+) | 1280px+ | 3 cột — Full sidebar trái (w-280) + feed + sidebar phải |

### NavBar trên mobile:
- Logo + search icon + action buttons
- Tabs Nav ẩn → nút hamburger → dropdown drawer
- LanguageSwitcher ẩn vào drawer

### LeftSidebar:
- `< lg`: ẩn hoàn toàn (`hidden`)
- `lg`: chỉ hiện icon tròn (w-16), tooltip khi hover
- `xl+`: hiện đầy đủ với label text (w-280)

### RightSidebar:
- `< xl`: ẩn hoàn toàn
- `xl+`: hiện đầy đủ (w-280)

---

## 🗂 Cấu trúc thư mục đầy đủ

```
src/
├── core/
│   ├── assets/
│   │   └── icons/                  ← 30 file .svg (định nghĩa visual)
│   │       ├── IconFacebookLogo.svg
│   │       ├── IconHome.svg
│   │       ├── ... (28 icons khác)
│   │       └── index.ts            ← Export registry (nếu dùng vite-plugin-svgr)
│   │
│   ├── icons/
│   │   └── SvgIcon.tsx             ← ✅ DÙNG CÁI NÀY để render icon trong components
│   │                                  (inline paths, không cần plugin)
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── index.ts
│   │
│   ├── config/
│   │   └── app.config.ts           ← brandName, logo, apiUrl, supported languages
│   │
│   ├── i18n/
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en.json             ← 60+ keys (thêm key "home.*")
│   │       └── vi.json             ← 60+ keys tiếng Việt
│   │
│   ├── store/
│   │   └── authStore.ts            ← Zustand: user, token, isAuthenticated
│   │
│   ├── services/
│   │   ├── api.ts                  ← Axios instance (auto attach token)
│   │   └── authService.ts          ← login(), logout(), register()
│   │
│   ├── hooks/
│   │   └── useAuth.ts
│   │
│   ├── layouts/
│   │   ├── MainLayout.tsx          ← Layout dashboard (đã đăng nhập)
│   │   └── AuthLayout.tsx          ← Layout trang login
│   │
│   ├── theme/
│   │   ├── colors.ts               ← 🎨 BỘ MÀU TRUNG TÂM — SỬA Ở ĐÂY
│   │   └── index.ts                ← Re-export facebookColors + colors + theme
│   │
│   └── utils/
│       └── storage.ts
│
├── modules/
│   ├── home/                       ← Module trang chủ Facebook
│   │   ├── pages/
│   │   │   └── HomePage.tsx        ← Layout 3 cột responsive (route "/")
│   │   ├── components/
│   │   │   ├── NavBar.tsx          ← Logo, search, tabs, hamburger (mobile), badges
│   │   │   ├── LeftSidebar.tsx     ← Icon-only (lg) → full (xl), see more/less
│   │   │   ├── NewsFeed.tsx        ← Stories + CreatePost + Posts list
│   │   │   ├── StoryRow.tsx        ← Stories cuộn ngang
│   │   │   ├── CreatePostCard.tsx  ← "Bạn đang nghĩ gì?" + 3 action buttons
│   │   │   ├── PostCard.tsx        ← Bài post: avatar, content, image, reactions
│   │   │   ├── RightSidebar.tsx    ← Contacts online + sponsored ads (xl+)
│   │   │   └── LoginModal.tsx      ← Modal form login/signup
│   │   └── index.ts
│   │
│   └── user/
│       └── pages/
│           ├── LoginPage.tsx
│           ├── DashboardPage.tsx
│           └── UsersPage.tsx
│
├── routes/
│   ├── index.tsx                   ← "/" → HomePage, "/login" → LoginPage
│   └── ProtectedRoute.tsx
│
├── App.tsx
├── main.tsx                        ← import i18n ở đây
└── index.css                       ← Tailwind base + scrollbar-hide + line-clamp
```

---

## 📄 Tác dụng từng file

### `src/core/theme/colors.ts` ⭐
File duy nhất để đổi màu toàn app. Xem phần "HỆ THỐNG MÀU" ở trên.

### `tailwind.config.js`
Map `facebookColors` → Tailwind classes `fb-*`. Không cần sửa khi đổi màu.
```js
// Nếu thêm màu mới vào colors.ts, thêm mapping tương ứng ở đây:
'fb-my-new-color': facebookColors.myNewColor,
```

### `src/core/icons/SvgIcon.tsx`
Component duy nhất để dùng icon. Dùng inline SVG, không cần plugin.
```tsx
<SvgIcon name="IconHome" size={24} color="currentColor" />
// color="currentColor" → icon kế thừa màu text từ parent (dùng text-fb-* class)
```

**Thêm icon mới:**
1. Tạo `src/core/assets/icons/IconTenMoi.svg`
2. Thêm `'IconTenMoi'` vào `IconName` type
3. Thêm SVG path vào `iconPaths` object
4. Dùng `<SvgIcon name="IconTenMoi" />`

### `src/modules/home/pages/HomePage.tsx`
Layout chính. Responsive offsets:
```
pt-14           → offset navbar (56px)
lg:pl-16        → icon sidebar width (64px)
xl:pl-[280px]   → full sidebar width
xl:pr-[280px]   → right sidebar width
```

### `src/modules/home/components/NavBar.tsx`
- Desktop: logo + search bar + 5 tabs + action buttons
- Tablet: logo + search icon + tabs + action buttons
- Mobile: logo + search icon + hamburger + action buttons → dropdown drawer

### `src/modules/home/components/LeftSidebar.tsx`
- `hidden`: < 1024px
- `w-16` icon-only: 1024–1279px
- `w-[280px]` full: 1280px+

### `src/modules/home/components/PostCard.tsx`
- Image: responsive height (200→280→340px theo breakpoint)
- Action buttons: icon + text (text ẩn trên xs)
- Reaction popup: hover (desktop), tap (mobile)

---

## 🔌 Kết nối API

### 1. Cấu hình URL
```bash
# .env
VITE_API_URL=https://your-backend.com/api
```

### 2. News Feed
```ts
// src/modules/home/components/NewsFeed.tsx
// Xóa MOCK_POSTS, thay bằng:
import { api } from '../../../core/services/api';
const [posts, setPosts] = useState<PostData[]>([]);
useEffect(() => {
  api.get('/feed?page=1&limit=10').then(r => setPosts(r.data.posts));
}, []);
// POST body: { page, limit }
// Response: { posts: PostData[], nextPage: number|null }
```

### 3. Stories
```ts
// src/modules/home/components/StoryRow.tsx
useEffect(() => {
  api.get('/stories/feed').then(r => setStories(r.data.stories));
}, []);
// Response: { stories: { id, user, avatarUrl, storyImageUrl, hasNew }[] }
```

### 4. Login (trong LoginModal)
```ts
import { authService } from '../../../core/services/authService';
import { useAuthStore } from '../../../core/store/authStore';
const { login } = useAuthStore();
// Trong handleLogin():
const result = await authService.login({ email, password });
// authService.login → POST /api/auth/login → { user: User, token: string }
login(result.user, result.token);
onClose();
navigate('/dashboard');
```

### 5. Contacts online
```ts
// src/modules/home/components/RightSidebar.tsx
useEffect(() => {
  api.get('/friends/online').then(r => setContacts(r.data));
}, []);
// Response: { id, name, avatarUrl, online }[]
```

### 6. Sponsored
```ts
api.get('/ads/sponsored?placement=home_sidebar').then(r => setSponsored(r.data));
```

---

## ➕ Phát triển tiếp

### Thêm trang mới
1. Tạo `src/modules/TENMODULE/pages/TenPage.tsx`
2. Tạo `src/modules/TENMODULE/index.ts` → export TenPage
3. `src/routes/index.tsx` → thêm `<Route path="/path" element={<TenPage />} />`
4. Thêm i18n keys vào `en.json` và `vi.json`

### Thêm icon mới
1. Tạo SVG file trong `src/core/assets/icons/`
2. Thêm vào `IconName` type trong `SvgIcon.tsx`
3. Thêm vào `iconPaths` object trong `SvgIcon.tsx`

### Thêm ngôn ngữ mới
1. Tạo `src/core/i18n/locales/XX.json` (copy en.json)
2. `src/core/i18n/index.ts` → import + thêm vào resources
3. `app.config.ts` → thêm vào supportedLanguages

### Thêm màu mới
1. Thêm vào `facebookColors` trong `colors.ts`
2. Thêm mapping vào `tailwind.config.js`
3. Dùng class `bg-fb-ten-mau-moi` hoặc `text-fb-ten-mau-moi`

### Dark mode (tương lai)
Thêm CSS variables vào `index.css`:
```css
:root { --fb-bg-page: #F0F2F5; --fb-text: #050505; }
[data-theme="dark"] { --fb-bg-page: #18191A; --fb-text: #E4E6EB; }
```
Đổi tailwind.config.js dùng `var(--fb-bg-page)` thay vì giá trị hex cứng.

---

## 🚀 Chạy dự án

```bash
npm install
npm run dev
# → http://localhost:5173 — trang chủ Facebook hiện ngay
```

---

## ✅ Checklist v2

- [x] **Color token system** — 1 file `colors.ts` điều khiển toàn bộ màu
- [x] **Tailwind fb-* tokens** — map từ colors.ts, dùng trong mọi component
- [x] **Responsive NavBar** — hamburger + drawer trên mobile
- [x] **Responsive LeftSidebar** — ẩn / icon-only / full theo breakpoint
- [x] **Responsive PostCard** — text size, image height, action buttons
- [x] **Responsive HomePage** — layout offset đúng ở mọi breakpoint
- [x] **Không zoom vỡ** — min-width 320px, text-size-adjust 100%
- [x] **Icons đồng bộ màu** — dùng `color="currentColor"` + Tailwind text class
- [x] **README cập nhật** — color token guide, responsive table, API guide
