'use client';

import Button from '@/components/atoms/Button';
import Dropdown from '@/components/atoms/Dropdown';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { PiShoppingBagOpen, PiUser, PiArrowSquareOut } from 'react-icons/pi';
import Link from 'next/link';
import { redirect } from 'next/navigation';

function deleteCookie(name: string) {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  console.log(`${name} 쿠키가 삭제되었습니다.`);
  redirect('/login');
}

export default function ProfileDropdown() {
  const { role, name } = useAuth();
  //TODO: 임시 이미지 설정, userImage 받아 와야함
  const userImage = 'https://placehold.co/40x40/orange/white';

  const menuItems = [
    <div>
      <div className="flex items-center mr-10 mt-2">
        <div className="relative text-2xl">
          <HiOutlineUserCircle />
        </div>
        <p className="mx-1 text-sm font-semibold">
          {name} {role === 'mentor' ? '멘토' : '회원'}님
        </p>
      </div>
      <hr className="border-t border-gray-300 mt-3 mb-3" />
    </div>,
    <Link className="flex my-2 items-center" href="/mypage/open-mentoring">
      <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2">
        <PiShoppingBagOpen />
      </div>
      <div className="text-xs px-2">새 강의 만들기</div>
    </Link>,
    <Link
      className="flex my-2 items-center"
      href={
        role === 'mentor' ? '/mypage/card-settings' : '/mypage/account-settings'
      }
    >
      <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2">
        <PiUser />
      </div>
      <div className="text-xs px-2">마이 페이지</div>
    </Link>,
    <Button
      className="flex my-2 items-center"
      type="button"
      onClick={() => deleteCookie('JSESSIONID')}
    >
      <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2">
        <PiArrowSquareOut />
      </div>
      <div className="text-xs px-2">로그아웃</div>
    </Button>,
  ];

  return (
    <Dropdown
      menuButton={
        <img
          className="w-full h-full rounded-full"
          src={userImage}
          alt="Profile Image"
        />
      }
      menuItems={menuItems}
      anchor={'bottom start'}
      menuItemsClassName={
        'bg-white my-2 rounded-lg scrollbar-hide border border-gray-200 p-2 shadow-lg z-30'
      }
    />
  );
}
