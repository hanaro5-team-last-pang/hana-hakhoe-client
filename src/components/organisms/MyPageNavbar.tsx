'use client';

import { useAuthStore } from '@/context/AuthContext';
import clsx from 'clsx';
import { IoIdCardOutline } from 'react-icons/io5';
import { MdOutlineAccountBox } from 'react-icons/md';
import { PiShoppingBagOpen } from 'react-icons/pi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MyPageNavbar() {
  const currentLocation = usePathname();
  const { auth } = useAuthStore((state) => state);

  const loginUserRole = auth?.role;

  return (
    <div className="wrapper scrollbar-hide">
      {loginUserRole === 'mentor' && (
        <Link
          className={clsx(
            'flex my-4 items-center rounded-lg p-2',
            currentLocation === '/mypage/card-settings' &&
              'bg-ourLightGreen shadow-lg'
          )}
          href="/mypage/card-settings"
        >
          <div className="flex items-center justify-center rounded-lg p-2 bg-white">
            <IoIdCardOutline />
          </div>
          <div className="px-2">명함 설정</div>
        </Link>
      )}
      <Link
        className={clsx(
          'flex my-4 items-center rounded-lg p-2',
          (currentLocation === '/mypage/mentorings' ||
            currentLocation === '/mypage/open-mentoring') &&
            'bg-ourLightGreen shadow-lg'
        )}
        href="/mypage/mentorings"
      >
        <div className="flex items-center justify-center rounded-lg p-2 bg-white">
          <PiShoppingBagOpen />
        </div>
        <div className="px-2">멘토링 기록</div>
      </Link>
      <Link
        className={clsx(
          'flex my-4 items-center rounded-lg p-2',
          currentLocation === '/mypage/account-settings' &&
            'bg-ourLightGreen shadow-lg'
        )}
        href="/mypage/account-settings"
      >
        <div className="flex items-center justify-center rounded-lg p-2 bg-white">
          <MdOutlineAccountBox />
        </div>
        <div className="px-2">계정 설정</div>
      </Link>
    </div>
  );
}
