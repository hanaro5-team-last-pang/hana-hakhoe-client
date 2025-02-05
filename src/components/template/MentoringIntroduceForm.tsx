'use client';

import { getProfileCard } from '@/app/(main)/mentorings/actions';
import { ProfileResponseType } from '@/app/(main)/mypage/type';
import DefaultSpinner from '@/components/template/DefaultSpinner';
import { DEFAULT_PROFILE_URL } from '@/constant';
import sha256 from 'crypto-js/sha256';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Props {
  lectureId: number;
}

export default function MentoringIntroduceForm(props: Props) {
  const { lectureId } = props;
  const [card, setCard] = useState<ProfileResponseType | null>(null);

  useEffect(() => {
    const loadCard = async () => {
      const profileCard = await getProfileCard(lectureId);
      setCard(profileCard);
    };
    loadCard().then();
  }, []);

  if (!card) {
    return <DefaultSpinner size={12} />;
  }
  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-center text-2xl font-bold mb-4">
        {card.mentor_name} 멘토
      </h1>
      <div>
        <h2 className="w-full text-center text-gray-700 text-lg my-4">
          {card.shortIntroduction}
        </h2>
      </div>

      <div className="w-full flex flex-col items-center p-4 rounded-lg">
        <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4">
          {card.profileImageUrl ? (
            <Image
              src={card.profileImageUrl}
              alt="멘토 명함"
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <Image
              src={`${DEFAULT_PROFILE_URL}/${sha256(card.mentor_name)}?s=32&d=identicon&r=PG`}
              alt={'멘토 명함'}
              layout="fill"
              objectFit="cover"
            />
          )}
        </div>

        <div className="w-full flex flex-col items-start p-4 border rounded-lg mb-4">
          <p className="text-lg font-semibold mb-1">자기 소개</p>
          {card.detailInfo && card.detailInfo[0].value ? (
            <h3 className="text-lg text-gray-800 whitespace-pre-line">
              {card.detailInfo[0].value}
            </h3>
          ) : (
            <p className="text-sm"> 등록된 소개가 없습니다. </p>
          )}
        </div>

        <div className="w-full flex flex-col items-start p-4 border rounded-lg">
          <p className="text-lg font-semibold mb-1">경력</p>
          {card.detailInfo && card.detailInfo[1]?.value ? (
            <h3 className="text-lg text-gray-800 whitespace-pre-line">
              {card.detailInfo[1].value}
            </h3>
          ) : (
            <p className="text-sm"> 등록된 내용이 없습니다. </p>
          )}
        </div>
      </div>
    </div>
  );
}
