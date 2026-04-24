# README — Medsphere Frontend (v4)

> Cập nhật từ v3 → v4: Thêm trang AI Chatbot, đổi tab Watch → AI trên NavBar.
> Toàn bộ text dùng i18n. Tất cả icon dùng SvgIcon. Input chat ghim cố định.

---

## THAY ĐỔI ĐÃ THỰC HIỆN (v3 → v4)

### 1. i18n — `en.json` / `vi.json`

Thêm 2 namespace mới:

**`navigation.ai`:**
```json
"navigation": { "ai": "AI" }
```

**`ai.*` — ~40 keys mới.** Bao gồm:
- UI labels: `title`, `newChat`, `searchConversations`, `recent`, `guestUser`...
- Trạng thái: `online`, `disclaimer`, `inputPlaceholder`
- Tooltip lock: `newChatLockedTooltip`, `attachFileLockedTooltip`, `shareLockedTooltip`...
- Mock data: `mockWelcome`, `mockUserMsg`, `mockAiReply`, `mockDemoReply`
- Conversations: `conv1Title`...`conv7Title`, `conv1Preview`...`conv7Preview`
- Suggested prompts: `suggestPrompt1`...`suggestPrompt4`, `suggestIcon1`...`suggestIcon4`

---

### 2. SvgIcon — `src/core/icons/SvgIcon.tsx` — HƯỚNG DẪN SỬA TAY

Thêm 8 icon mới. Thực hiện 2 bước:

**Bước 1** — Thêm vào `IconName` type (sau `'IconSettings'`):
```ts
| 'IconAI'
| 'IconSend'
| 'IconAttach'
| 'IconThumbDown'
| 'IconCopy'
| 'IconChevronLeft'
| 'IconChevronRight'
| 'IconLock'
```

**Bước 2** — Thêm vào object `iconPaths` (sau entry `IconSettings`):
```ts
IconAI: {
  viewBox: '0 0 24 24',
  path: '<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>',
},
IconSend: {
  viewBox: '0 0 24 24',
  path: '<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>',
},
IconAttach: {
  viewBox: '0 0 24 24',
  path: '<path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>',
},
IconThumbDown: {
  viewBox: '0 0 24 24',
  path: '<path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>',
},
IconCopy: {
  viewBox: '0 0 24 24',
  path: '<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>',
},
IconChevronLeft: {
  viewBox: '0 0 24 24',
  path: '<path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/>',
},
IconChevronRight: {
  viewBox: '0 0 24 24',
  path: '<path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>',
},
IconLock: {
  viewBox: '0 0 24 24',
  path: '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>',
},
```

---

### 3. NavBar — `src/modules/home/components/NavBar.tsx`

Không thay đổi so với v4 lần trước (tab AI đã có).

---

### 4. Module AI — Cấu trúc component

```
src/modules/ai/
├── pages/
│   └── AiPage.tsx              ← Layout thuần — chỉ ghép components
├── components/
│   ├── AiSidebar.tsx           ← Sidebar trái
│   ├── AiChatHeader.tsx        ← Header vùng chat
│   ├── AiMessageList.tsx       ← Danh sách tin nhắn + welcome state
│   ├── AiMessageBubble.tsx     ← Từng bubble + copy/like/dislike
│   └── AiInputBar.tsx          ← Input ghim cố định
└── index.ts                    ← export { AiPage }
```

#### Layout AiPage — tại sao input ghim được:
```
<div style="height:100vh, paddingTop:56px" className="flex overflow-hidden">
  <AiSidebar />
  <main className="flex-1 flex flex-col overflow-hidden">
    <AiChatHeader />     ← flex-shrink-0
    <AiMessageList />    ← flex-1 overflow-y-auto  ← CHỈ PHẦN NÀY SCROLL
    <AiInputBar />       ← flex-shrink-0           ← GHIM DƯỚI CÙNG
  </main>
</div>
```
`main` có `overflow-hidden` nên không tự scroll. Chỉ `AiMessageList` scroll bên trong. `AiInputBar` với `flex-shrink-0` không bao giờ bị đẩy ra ngoài viewport.

#### Màu — KHÔNG hardcode hex:
| Element | Class Tailwind |
|---|---|
| AI avatar, New Chat btn, User bubble, Send btn | `bg-fb-primary` |
| Hover New Chat, Send btn | `bg-fb-primary-hover` |
| Active conversation | `bg-fb-primary-light text-fb-primary` |
| AI bubble | `bg-fb-bg-page border-fb-border` |
| Disabled Send btn | `bg-fb-bg-hover-dark` |

#### Icon — KHÔNG dùng inline SVG:
Tất cả icon dùng `<SvgIcon name="..." size={N} color="currentColor" />`
Màu icon kế thừa từ `text-*` class của parent.

---

### 5. Routes — `src/routes/index.tsx`

Không thay đổi.

---

## LOGIC PHÂN QUYỀN

```
Chưa đăng nhập:
  ✅ Vào /ai, gửi tin (mock reply), xem conv #1, copy/like/dislike
  🔒 New chat, xem conv #2-7, search, share, more, attach file → requireLogin()
```

---

## CẤU TRÚC THƯ MỤC (v4)

```
src/
├── core/
│   ├── icons/SvgIcon.tsx       ← +8 icon (sửa tay theo hướng dẫn)
│   └── i18n/locales/
│       ├── en.json             ← +navigation.ai, +ai.* (~40 keys)
│       └── vi.json             ← +navigation.ai, +ai.* (~40 keys)
├── modules/
│   ├── home/components/NavBar.tsx   ← không đổi
│   └── ai/
│       ├── pages/AiPage.tsx
│       ├── components/
│       │   ├── AiSidebar.tsx
│       │   ├── AiChatHeader.tsx
│       │   ├── AiMessageList.tsx
│       │   ├── AiMessageBubble.tsx
│       │   └── AiInputBar.tsx
│       └── index.ts
└── routes/index.tsx            ← không đổi
```

---

## CHECKLIST v4

- [x] i18n — không hardcode text, dùng `t('ai.*')` xuyên suốt
- [x] Icons — chỉ `<SvgIcon name="..."/>`, không có inline `<svg>`
- [x] Màu — Tailwind `bg-fb-*`, `text-fb-*`, không hardcode hex
- [x] Input ghim — layout `flex flex-col overflow-hidden` đúng chuẩn
- [x] Tách component — AiPage chỉ ghép, logic ở từng component
- [x] Responsive — sidebar ẩn mobile
- [x] Phân quyền — chat tự do, lưu trữ/nâng cao → login
- [x] README cập nhật đầy đủ

---

## BACKLOG

- [ ] Kết nối Anthropic API thực
- [ ] Lưu conversation history khi đăng nhập
- [ ] Streaming response (typewriter effect)
- [ ] Upload file/ảnh cho AI phân tích
- [ ] Markdown đầy đủ (react-markdown)
- [ ] Favicon crop viewBox logo.svg
- [ ] Dark mode