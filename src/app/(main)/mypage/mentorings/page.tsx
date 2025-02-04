'use client';

import {
  getMentorings,
  getMentoringForMentee,
  getMentoringHistory,
} from '@/app/(main)/mypage/actions';
import { MentoringTableType } from '@/app/(main)/mypage/type';
import LinkButton from '@/components/atoms/LinkButton';
import MentoringListTable from '@/components/organisms/MentoringListTable';
import { useAuthStore } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

export default function Page() {
  const { auth } = useAuthStore((state) => state);
  const [mentorings, setMentorings] = useState<MentoringTableType[]>([]);
  const [histories, setHistories] = useState<MentoringTableType[]>([]);

  useEffect(() => {
    if (auth?.role) {
      const fetchData = async () => {
        try {
          if (auth.role === 'MENTOR') {
            // 멘토일 경우
            const result = await getMentorings();

            const mentorings = [
              ...result.lectureList.notStarted.map((lecture) => ({
                title: lecture.title,
                start_date: lecture.startTime,
                status: '시작 전',
              })),
              ...result.lectureList.ableToStart.map((lecture) => ({
                title: lecture.title,
                start_date: lecture.startTime,
                status: '진행 중',
              })),
              ...result.lectureList.done.map((lecture) => ({
                title: lecture.title,
                start_date: lecture.startTime,
                status: '완료',
              })),
            ];
            setMentorings(mentorings);
          } else {
            // 멘티일 경우
            const [result_queue, result_history] = await Promise.all([
              getMentoringForMentee(),
              getMentoringHistory(),
            ]);

            const mentorings = result_queue.enrollmentList.map((mentoring) => ({
              title: mentoring.title,
              mentorName: mentoring.mentorName,
              start_date: mentoring.startTime,
              status: '시작 전',
            }));

            const historiesData = result_history.enrollmentList.map(
              (mentoring) => ({
                title: mentoring.title,
                mentorName: mentoring.mentorName,
                start_date: mentoring.startTime,
                status: mentoring.isDone ? '수강 완료' : '취소됨',
              })
            );

            setMentorings(mentorings);
            setHistories(historiesData);
          }
        } catch (error) {
          console.error('Error fetching mentee mentoring list', error);
        }
      };

      fetchData();
    }
  }, [auth?.role]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <div className="text-ourGreen m-2 text-2xl font-bold">
          {auth?.role === 'MENTOR' ? '나의 멘토링 기록' : '멘토링 신청 기록'}
        </div>
        {auth?.role === 'MENTOR' && (
          <LinkButton
            label="멘토링 개설하기"
            route={'/mypage/open-mentoring'}
            className="rounded-full bg-ourGreen text-sm text-white"
          />
        )}
      </div>
      <div className="flex flex-col justify-center mt-3 mb-10 px-2">
        <MentoringListTable mentorings={mentorings} />
        {/* 수강 완료된 히스토리가 있을 경우, 추가로 다른 MentoringListTable 표시 */}
        {histories.length > 0 && (
          <div className="mt-6">
            <div className="text-ourGreen m-2 text-2xl font-bold">
              수강 완료 내역
            </div>
            <MentoringListTable mentorings={histories} />
          </div>
        )}
      </div>
    </div>
  );
}
