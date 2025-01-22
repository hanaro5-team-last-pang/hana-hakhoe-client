'use client';

import Tab from '@/components/atoms/Tab';
import { IoIdCardOutline } from 'react-icons/io5';
import { MdOutlineAccountBox } from 'react-icons/md';
import { PiShoppingBagOpen } from 'react-icons/pi';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function HeaderTab() {
  const loginUserRole = 'mentor'; // 로그인 상태 관리는 전역 상태 관리로 이루어질 예정
  const router = useRouter();
  const currentLocation = usePathname();
  const [showTabComponent, setShowTabComponent] = useState(false);

  const handleShowComponent = () => {
    setShowTabComponent((prev) => {
      let newState = prev;
      newState = !newState;
      return newState;
    });
  };

  const tabList = [
    {
      tabTitle: '홈',
      tabOnClickEvent: () => router.push('/'),
      tabListClassName:
        currentLocation === '/' ? 'bg-gray-100 text-hanaGreen px-2' : 'px-2',
    },
    {
      tabTitle: '멘토링',
      tabOnClickEvent: () => router.push('/mentorings'),
      tabListClassName:
        currentLocation === '/mentorings'
          ? 'bg-gray-100 text-hanaGreen px-2'
          : 'px-2',
    },
    {
      tabTitle: '금융 뉴스',
      tabOnClickEvent: () => router.push('/news'),
      tabListClassName:
        currentLocation === '/news'
          ? 'bg-gray-100 text-hanaGreen px-2'
          : 'px-2',
    },
    {
      tabTitle: '마이 페이지',
      tabOnClickEvent: handleShowComponent,
      tabListClassName: currentLocation.startsWith('/mypage')
        ? 'bg-gray-100 text-hanaGreen px-2'
        : 'px-2',
      tabComponent: (
        <div>
          {showTabComponent && (
            <div className="rounded-lg drop-shadow scrollbar-hide border border-gray-200 px-2 bg-white text-black">
              {loginUserRole === 'mentor' && (
                <Link
                  className="flex my-4 items-center"
                  href="/mypage/card-settings"
                >
                  <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2">
                    <IoIdCardOutline />
                  </div>
                  <div className="text-sm px-2">명함 설정</div>
                </Link>
              )}
              <Link
                className="flex my-4 items-center"
                href="/mypage/account-settings"
              >
                <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2">
                  <MdOutlineAccountBox />
                </div>
                <div className="text-sm px-2">계정 설정</div>
              </Link>
              <Link
                className="flex my-4 items-center"
                href="/mypage/mentorings"
              >
                <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2">
                  <PiShoppingBagOpen />
                </div>
                <div className="text-sm px-2">멘토링 기록</div>
              </Link>
            </div>
          )}
        </div>
      ),
    },
  ];

  return <Tab tabList={tabList} />;
}
