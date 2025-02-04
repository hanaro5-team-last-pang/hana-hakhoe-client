'use client';

import Button from '@/components/atoms/Button';
import Dropdown from '@/components/atoms/Dropdown';
import { AuthType } from '@/types/hanaHakdang';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { PiShoppingBagOpen, PiUser, PiArrowSquareOut } from 'react-icons/pi';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback } from 'react';

interface Props {
  authData: AuthType;
  fetchAuth: () => void;
}

export default function ProfileDropdown({ authData, fetchAuth }: Props) {
  const { name, role, profileImage } = authData;
  //TODO: 임시 이미지 설정, userImage 받아 와야함

  const logOut = useCallback(async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });
    fetchAuth();
    location.reload();
  }, []);

  return (
    <Dropdown
      menuButton={
        <div className="relative h-10 w-10 rounded-full">
          <Image
            style={{ borderRadius: '100%' }}
            fill
            src={profileImage}
            alt="Profile Image"
          />
        </div>
      }
      menuItems={[]}
      anchor={'bottom start'}
      menuItemsClassName={
        'bg-white my-2 rounded-lg scrollbar-hide border border-gray-200 p-2 shadow-lg z-30'
      }
    >
      <div>
        <div className="flex items-center mr-10 mt-2">
          <div className="relative text-2xl">
            <HiOutlineUserCircle />
          </div>
          <p className="mx-1 text-sm font-semibold">
            {name} {role === 'MENTOR' ? '멘토' : '회원'}님
          </p>
        </div>
        <hr className="border-t border-gray-300 mt-3 mb-3" />
      </div>
      {role === 'MENTOR' && (
        <Link className="flex my-2 items-center" href="/mypage/open-mentoring">
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2">
            <PiShoppingBagOpen />
          </div>
          <div className="text-xs px-2">새 강의 만들기</div>
        </Link>
      )}
      <Link
        className="flex my-2 items-center"
        href={
          role === 'MENTOR'
            ? '/mypage/card-settings'
            : '/mypage/account-settings'
        }
      >
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2">
          <PiUser />
        </div>
        <div className="text-xs px-2">마이 페이지</div>
      </Link>
      <Button className="flex my-2 items-center" type="button" onClick={logOut}>
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2">
          <PiArrowSquareOut />
        </div>
        <div className="text-xs px-2">로그아웃</div>
      </Button>
    </Dropdown>
  );
}
