'use client';

import BaseErrorWrapper from '@/components/template/BaseErrorWrapper';
import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <BaseErrorWrapper>
      <div className="flex flex-col items-center space-y-3 mt-3">
        <p className="text-xl">강의실에 입장할 수 없습니다.</p>
        <Link
          href="/mentorings"
          className="bg-ourOrange text-white rounded-full py-2 px-4 mr-3 mb-1 hover:bg-orange-600 transition"
        >
          돌아가기
        </Link>
      </div>
    </BaseErrorWrapper>
  );
}
