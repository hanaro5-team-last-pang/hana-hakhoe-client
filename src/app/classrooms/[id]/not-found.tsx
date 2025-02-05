import BaseErrorWrapper from '@/components/template/BaseErrorWrapper';
import Link from 'next/link';

export default function NotFound() {
  return (
    <BaseErrorWrapper>
      <div className="flex flex-col items-center space-y-3 mt-3">
        <p className="text-xl">아직 멘토링이 시작되지 않았습니다.</p>
        <Link
          href="/mypage/mentorings"
          className="bg-ourOrange text-white rounded-full py-2 px-4 mr-3 mb-1 hover:bg-orange-600 transition"
        >
          돌아가기
        </Link>
      </div>
    </BaseErrorWrapper>
  );
}
