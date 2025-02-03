'use client';

import LinkButton from '@/components/atoms/LinkButton';
import AlarmDropdown from '@/components/molecules/AlarmDropdown';
import HeaderPageMenu from '@/components/molecules/HeaderPageMenu';
import ProfileDropdown from '@/components/molecules/ProfileDropdown';
import { useAuthStore } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

export default function Header({ children }: Props) {
  const { auth, loading, fetchAuth } = useAuthStore((state) => state);
  const items = ['start', 'modify', 'start'];

  const loginStatus = !!auth;

  return (
    <div className="w-screen fixed bg-inherit z-20">
      <div>
        <div className="wrapper header-skeleton flex justify-between items-center mx-auto">
          <div>
            <Link href="/">
              <Image
                src="/logo_header.png"
                width={128}
                height={26}
                alt="하나학회 로고"
              />
            </Link>
          </div>
          <div className="h-full">{children}</div>
          <div>
            {loading ? (
              <div className="flex animate-pulse gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              </div>
            ) : loginStatus ? (
              <div className="flex gap-2">
                <AlarmDropdown
                  alarmTitle={items}
                  lectureTitle="주식 투자 성공기"
                  lectureTime="2024-01-10 15:00"
                />
                <ProfileDropdown authData={auth} fetchAuth={fetchAuth} />
              </div>
            ) : (
              <LinkButton
                label="로그인"
                route="/login"
                className="bg-ourGreen rounded-2xl text-white text-sm"
              />
            )}
          </div>
        </div>
      </div>
      <HeaderPageMenu />
    </div>
  );
}
