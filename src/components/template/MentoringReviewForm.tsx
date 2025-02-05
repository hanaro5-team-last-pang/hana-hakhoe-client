'use client';

import { getLectureReviews } from '@/app/(main)/mentorings/actions';
import { ReviewPageResponseType } from '@/app/(main)/mentorings/type';
import Comment from '@/components/molecules/Comment';
import DefaultSpinner from '@/components/template/DefaultSpinner';
import { FaStar } from 'react-icons/fa6';
import { useEffect, useState } from 'react';

interface Props {
  lectureId: number;
}

export default function MentoringReviewForm(props: Props) {
  const { lectureId } = props;
  const [reviewRes, setReviewRes] = useState<ReviewPageResponseType | null>(
    null
  );

  useEffect(() => {
    const loadReviewResponse = async () => {
      const reviewRes = await getLectureReviews(lectureId);
      setReviewRes(reviewRes);
    };
    loadReviewResponse().then();
  }, []);

  if (!reviewRes) {
    return <DefaultSpinner size={12} />;
  }

  return (
    <div className="p-10 w-full">
      <div className="flex items-center gap-3">
        <h2 className="text-3xl font-bold mb-4">{reviewRes.averageScore}</h2>
        <div className="flex flex-col items-start mb-4">
          <div className="flex mb-1">
            {Array.from({ length: 5 }, (_, index) => (
              <FaStar
                key={index}
                className={`h-5 w-5 ${index < reviewRes.averageScore ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-700">
            전체 리뷰 수 {reviewRes.count}개
          </span>
        </div>
      </div>
      <div className="mb-6">
        {reviewRes.subScores.map((subScore, index) => (
          <div key={index} className="flex items-center mb-2 gap-2">
            <div className="flex mr-2">
              {Array.from({ length: subScore.score }, (_, index) => (
                <FaStar key={index} className="h-5 w-5 text-yellow-400" />
              ))}
              {Array.from({ length: 5 - subScore.score }, (_, index) => (
                <FaStar
                  key={index + subScore.score}
                  className="h-5 w-5 text-gray-300"
                />
              ))}
            </div>
            <span className="w-10 mr-2">
              {(isNaN(subScore.count / reviewRes.count)
                ? 0
                : (subScore.count / reviewRes.count) * 100
              ).toFixed(1)}
              %
            </span>
            <div className="flex-1 bg-gray-300 rounded-full h-2 relative">
              <div
                className="absolute top-0 left-0 h-2 bg-yellow-400 rounded-full"
                style={{
                  width: `${((subScore.count / reviewRes.count) * 100).toFixed(1)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-300 pt-4">
        {reviewRes.reviews.map((review, index) => (
          <div key={index}>
            {index > 0 && <div className="border-t border-gray-300 pt-4" />}
            <Comment {...review} />
          </div>
        ))}
      </div>
    </div>
  );
}
