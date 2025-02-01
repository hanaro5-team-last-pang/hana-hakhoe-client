'use client';

import { getProfileCard } from '@/app/(main)/mentorings/actions';
import { ProfileResponseType } from '@/app/(main)/mypage/type';
import DefaultSpinner from '@/components/template/DefaultSpinner';
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
          {' '}
          {card.short_introduction}
        </h2>
      </div>
      <div className="flex items-start justify-between p-4 rounded-lg">
        <div className="flex items-center">
          <div className="flex flex-col items-center border p-4 rounded-lg">
            <div className="relative w-32 h-32 rounded-full overflow-hidden">
              {card.profileImageUrl ? (
                <Image
                  src={card.profileImageUrl}
                  alt="멘토 명함"
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <Image
                  src={'/img_landing.png'} // 실제 이미지 URL로 교체
                  alt={'멘토 명함'}
                  layout="fill"
                  objectFit="cover"
                />
              )}
            </div>
            <span className="text-gray-700 mt-2">
              {/* simple_info  key - value 쌍 출력 */}
              {card.simple_info.map((info, index) => (
                <div key={index}>
                  {info.key}: {info.value}
                </div>
              ))}
            </span>
          </div>
        </div>
        <div className="flex-1 ml-4 p-4 border rounded-lg">
          <p className="text-lg font-semibold mb-1"> 자기 소개 </p>
          <h3 className="text-lg text-gray-800">
            {' '}
            {card.detail_info[0]?.value}
          </h3>
        </div>
      </div>
      <div className="my-3 rounded-lg p-4 border mx-3">
        <p className="text-lg font-semibold mb-1"> 경력 </p>
        <h3 className="text-lg text-gray-800">{card.detail_info[1]?.value}</h3>
      </div>
    </div>
  );
}
