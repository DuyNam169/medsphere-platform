// ============================================================
// NewsFeed.tsx — src/modules/home/components/NewsFeed.tsx
// Cột giữa: Stories + CreatePost + danh sách Posts
// MARK: Kết nối API thực tế: thay MOCK_POSTS bằng
//   GET /api/feed?page=1&limit=10
//   Response: { posts: PostData[], nextPage: number | null }
// ============================================================

import React from 'react';
// import StoryRow from './StoryRow'; // Tạm ẩn — bỏ comment khi muốn bật lại
import CreatePostCard from './CreatePostCard';
import PostCard, { PostData } from './PostCard';

interface NewsFeedProps {
  onRequireLogin: () => void;
}

// MARK: MOCK DATA — thay bằng API call thực tế
const MOCK_POSTS: PostData[] = [
  {
    id: 1,
    author: 'Sarah Mitchell',
    authorAvatar: '👩‍💼',
    timeAgo: '2 hours ago',
    privacy: 'public',
    content: 'Beautiful sunset at the beach today 🌅 Sometimes you just need to step back and appreciate the little things in life. Who else loves beach sunsets?',
    imageGradient: 'from-orange-300 via-pink-400 to-purple-500',
    likes: 247,
    comments: 34,
    shares: 12,
    topReactions: ['👍', '❤️', '😮'],
  },
  {
    id: 2,
    author: 'David Chen',
    authorAvatar: '👨‍💻',
    timeAgo: '4 hours ago',
    privacy: 'public',
    content: 'Just finished my first marathon! 🏃‍♂️ 42km down. Months of training, early mornings, sore legs — totally worth it. Never thought I\'d be saying this, but I\'m already thinking about the next one 😅',
    imageGradient: 'from-green-400 via-teal-400 to-blue-500',
    likes: 1024,
    comments: 89,
    shares: 43,
    topReactions: ['❤️', '👍', '😂'],
  },
  {
    id: 3,
    author: 'Emma Thompson',
    authorAvatar: '👩‍🍳',
    timeAgo: '6 hours ago',
    privacy: 'public',
    content: 'Made grandma\'s secret lasagna recipe for the first time 🍝 It took all day but it was absolutely worth it. Some recipes are just pure love on a plate. ❤️',
    imageGradient: 'from-yellow-300 via-orange-400 to-red-400',
    likes: 512,
    comments: 67,
    shares: 28,
    topReactions: ['❤️', '😋', '👍'],
  },
  {
    id: 4,
    author: 'Tech News Daily',
    authorAvatar: '📱',
    timeAgo: '8 hours ago',
    privacy: 'public',
    content: '🚀 The future of AI is here! New breakthroughs are happening every single day. What are your thoughts on how AI will shape the next decade?',
    imageGradient: 'from-blue-500 via-indigo-500 to-purple-600',
    likes: 3847,
    comments: 412,
    shares: 256,
    topReactions: ['😮', '👍', '❤️'],
  },
  {
    id: 5,
    author: 'Local Events VN',
    authorAvatar: '🎪',
    timeAgo: '10 hours ago',
    privacy: 'public',
    content: 'Lễ hội âm nhạc cuối tuần này tại Hà Nội! 🎶 Hơn 20 ban nhạc sẽ biểu diễn trực tiếp. Đừng bỏ lỡ nhé! Tag bạn bè của bạn vào đây 👇',
    imageGradient: 'from-fuchsia-400 via-purple-500 to-indigo-600',
    likes: 892,
    comments: 143,
    shares: 201,
    topReactions: ['❤️', '😍', '🎉'],
  },
];

const NewsFeed: React.FC<NewsFeedProps> = ({ onRequireLogin }) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[590px]">
      {/* Stories — tạm ẩn, bật lại bằng cách:
           1. Bỏ comment dòng import StoryRow ở trên
           2. Bỏ comment block này
      <div className="bg-fb-bg-card rounded-xl shadow-sm border border-fb-border p-3">
        <StoryRow onRequireLogin={onRequireLogin} />
      </div>
      */}

      {/* Create Post */}
      <CreatePostCard onRequireLogin={onRequireLogin} />

      {/* Posts */}
      {MOCK_POSTS.map((post) => (
        <PostCard key={post.id} post={post} onRequireLogin={onRequireLogin} />
      ))}
    </div>
  );
};

export default NewsFeed;