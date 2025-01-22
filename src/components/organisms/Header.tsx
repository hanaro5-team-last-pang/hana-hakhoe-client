import LinkButton from '@/components/atoms/LinkButton';
import AlarmDropdown from '@/components/molecules/AlarmDropdown';
import HeaderPageMenu from '@/components/molecules/HeaderPageMenu';
import ProfileDropdown from '@/components/molecules/ProfileDropdown';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

export default function Header({ children }: Props) {
  const loginStatus = true; // 로그인 상태 관리는 전역 상태 관리로 이루어질 예정
  const items = ['start', 'modify', 'start'];
  const userInfo = {
    username: '정중일',
    userAge: 45,
    userImage: 'https://placehold.co/25x25',
    userRole: 'mentor',
  };

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
                alt="하나학당 로고"
              />
            </Link>
          </div>
          <div className="h-full">{children}</div>
          <div>
            {loginStatus ? (
              <div className="flex gap-2">
                <AlarmDropdown
                  alarmTitle={items}
                  lectureTitle="주식 투자 성공기"
                  lectureTime="2024-01-10 15:00"
                />
                <ProfileDropdown userInfo={userInfo} />
              </div>
            ) : (
              <LinkButton
                label="로그인"
                route="/login"
                className="bg-hanaGreen80 rounded-2xl text-white text-sm"
              />
            )}
          </div>
        </div>
      </div>
      <HeaderPageMenu />
    </div>
  );
}
