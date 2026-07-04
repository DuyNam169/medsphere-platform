// ============================================================
// HomePage.tsx — Layout 3 cột, fully responsive
//
// Breakpoints:
//   < lg  (< 1024px): 1 cột, navbar + feed chiếm toàn màn hình
//   lg    (1024px+):  2 cột — icon sidebar trái + feed
//   xl    (1280px+):  3 cột — full sidebar trái + feed + sidebar phải
// ============================================================
import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import LeftSidebar from '../components/LeftSidebar';
import NewsFeed from '../components/NewsFeed';
import RightSidebar from '../components/RightSidebar';
import LoginModal from '../components/LoginModal';

const HomePage: React.FC = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const handleRequireLogin = () => setLoginModalOpen(true);

  return (
    <div className="min-h-screen bg-fb-bg-page">
      <NavBar onRequireLogin={handleRequireLogin} />

      {/*
        pt-14 = navbar height offset
        lg:pl-16 = icon sidebar width
        xl:pl-[280px] = full sidebar width
        xl:pr-[280px] = right sidebar width
      */}
      <div className="pt-14 lg:pl-16 xl:pl-[280px] xl:pr-[280px] min-h-screen">
        {/* Left sidebar — fixed, outside flow */}
        <LeftSidebar onRequireLogin={handleRequireLogin} />

        {/* Center feed */}
        <main className="flex justify-center px-0 sm:px-4 py-4">
          <div className="w-full max-w-[590px]">
            <NewsFeed onRequireLogin={handleRequireLogin} />
          </div>
        </main>

        {/* Right sidebar — fixed, outside flow */}
        <RightSidebar onRequireLogin={handleRequireLogin} />
      </div>

      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </div>
  );
};

export default HomePage;
