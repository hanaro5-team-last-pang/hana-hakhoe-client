'use client';

import { FaqResponseType } from '@/app/(main)/mentorings/type';
import Button from '@/components/atoms/Button';
import Comment from '@/components/molecules/Comment';
import Pagination from '@/components/organisms/Pagination';
import { FaLocationArrow } from 'react-icons/fa6';
import React, { useState } from 'react';

interface FAQListProps {
  faqs: FaqResponseType[];
}

export default function FAQList({ faqs }: FAQListProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const startIndex = currentPage * itemsPerPage;
  const currentFAQs = faqs.slice(startIndex, startIndex + itemsPerPage);

  const toggleAnswer = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div>
      {currentFAQs.map((faqComments, index) => {
        const { userName, content, ImageUrl, createdAt, answers } = faqComments;

        return (
          <div key={index} className="mb-4">
            <div className="my-2 border-t border-gray-300" />
            <div className="flex items-center justify-between">
              <Comment
                profileImageUrl={ImageUrl}
                userName={userName}
                content={content}
                createdAt={createdAt}
              />
              {answers.length > 0 && (
                <Button
                  type="button"
                  className="text-semibold text-sm mr-2 mb-4"
                  onClick={() => toggleAnswer(index)}
                >
                  {openIndexes.includes(index) ? '닫기' : '답변보기'}
                  <FaLocationArrow className="inline-block mr-1" />
                </Button>
              )}
            </div>
            {openIndexes.includes(index) && answers.length > 0 && (
              <div className="ml-20 mt-2">
                <Comment
                  profileImageUrl={answers[0].profileImageUrl}
                  userName={answers[0].userName}
                  content={answers[0].content}
                  createdAt={answers[0].createdAt}
                />
              </div>
            )}
          </div>
        );
      })}
      <Pagination
        currentPage={currentPage}
        totalItems={faqs.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        buttonColor="bg-ourOrange"
      />
    </div>
  );
}
