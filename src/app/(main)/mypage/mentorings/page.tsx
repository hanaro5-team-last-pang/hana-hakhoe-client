import { getMentorings } from '@/app/(main)/mypage/actions';
import { MentoringTableType } from '@/app/(main)/mypage/type';
import { getMyAuthData } from '@/app/action';
import LinkButton from '@/components/atoms/LinkButton';
import MentoringListTable from '@/components/organisms/MentoringListTable';

export default async function Page() {
  const result = await getMentorings();
  const auth = await getMyAuthData();

  const mentorings: MentoringTableType[] = [];

  result.lectureList.notStarted.forEach((lecture) => {
    mentorings.push({
      title: lecture.title,
      start_date: lecture.startTime,
      status: '시작 전',
    });
  });

  result.lectureList.ableToStart.forEach((lecture) => {
    mentorings.push({
      title: lecture.title,
      start_date: lecture.startTime,
      status: '진행 중',
    });
  });

  result.lectureList.done.forEach((lecture) => {
    mentorings.push({
      title: lecture.title,
      start_date: lecture.startTime,
      status: '완료',
    });
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <div className="text-ourGreen m-2 text-2xl font-bold">
          최근 멘토링 기록
        </div>
        {auth.role === 'MENTOR' && ( // 역할이 멘토일 경우 버튼 표시
          <LinkButton
            label="멘토링 개설하기"
            route={'/mypage/open-mentoring'}
            className="rounded-full bg-ourGreen text-sm text-white"
          />
        )}
      </div>
      <div className="flex justify-center mt-3 mb-10 px-2">
        <MentoringListTable mentorings={mentorings} />
      </div>
    </div>
  );
}
