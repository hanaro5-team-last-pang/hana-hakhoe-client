'use client';

import { postLectureReviews } from '@/app/(main)/mentorings/actions';
import Button from '@/components/atoms/Button';
import Carousel from '@/components/molecules/Carousel';
import { CardType } from '@/types/hanaHakdang';
import { Rating } from 'react-simple-star-rating';
import { useActionState, useState } from 'react';

export default function MentoringReviewModalForm({
  lectureId,
}: {
  lectureId: number;
}) {
  const [score, setScore] = useState(0);
  const [state, formAction] = useActionState(postLectureReviews, {
    value: {
      lectureId: lectureId,
      score: 0,
      content: '',
    },
    message: '후기 제출 전 폼',
    isError: false,
  });

  const items: CardType[] = [
    {
      cardTitle: '369 정기예금',
      cardColor: 'bg-cardBlue',
      cardDescription: '3개월마다 중도 해지 혜택',
      cardImageUrl: '/apple.png',
    },
    {
      cardTitle: '트래블로그 여행 적금',
      cardColor: 'bg-cardGray',
      cardDescription: '여행 준비의 시작',
      cardImageUrl: '/coffee.png',
    },
  ];

  const handleRating = (rate: number) => {
    setScore(rate);
  };

  return (
    <form action={formAction}>
      <input type="hidden" name="lectureId" value={lectureId} />
      <input type="hidden" name="score" value={score} />
      <div>
        <div className="text-center font-bold">멘토링에 대해</div>
        <div className="text-center font-bold">후기를 남겨주세요!</div>
        <div className="flex justify-center w-full">
          <div className="w-full">
            <div className="my-2 flex justify-center">
              <Rating
                onClick={handleRating}
                initialValue={score}
                transition
                allowFraction
                size={40}
                SVGclassName="inline-flex"
              />
            </div>
            <textarea
              name="content"
              defaultValue={state.value.content}
              className="w-full font-bold px-2 py-6 rounded-lg drop-shadow-lg text-gray-400 focus:outline-none resize-none text-left placeholder:text-center placeholder:text-gray-400 scrollbar-hide"
              placeholder={`멘토링 후기를 남겨주시면\n품질이 올라갑니다.`}
            ></textarea>
            <div className="flex justify-center my-1">
              <Button
                type="submit"
                className="bg-ourGreen rounded-lg text-white px-4 py-2 font-bold"
                text="제출"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="font-bold text-center my-2">
          오늘 멘토링과 관련된 금융 상품을 추천드려요
        </div>
        <Carousel cards={items} />
      </div>
    </form>
  );
}
