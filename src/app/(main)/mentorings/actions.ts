'use server';

import {
  FaqFormType,
  FaqResponseType,
  LectureListResponse,
  LectureType,
  ReviewPageResponseType,
} from '@/app/(main)/mentorings/type';
import { ProfileResponseType } from '@/app/(main)/mypage/type';
import { ActionResType, BaseResType } from '@/types/hanaHakdang';
import { checkAuthAndGetCookie } from '@/utils/CheckCookies';
import { fetcher } from '@/utils/fetcher';
import { notFound } from 'next/navigation';

//전체 멘토링 조회
export async function getLectureList() {
  const accessJwtCookie = await checkAuthAndGetCookie();

  const res = await fetcher('GET', '/lectures', {
    jwt: accessJwtCookie.value,
  });

  if (!res.ok) {
    notFound();
  }

  const data = (await res.json()) as BaseResType<LectureListResponse>;
  return data.result.lectureList;
}

//키워드 검색
export async function getLectureSearch() {
  const accessJwtCookie = await checkAuthAndGetCookie();

  const res = await fetcher('GET', '/search', {
    jwt: accessJwtCookie.value,
  });

  if (!res.ok) {
    notFound();
  }

  const data = (await res.json()) as BaseResType<LectureListResponse>;
  return data.result.lectureList;
}

//멘토링 상세 정보
export async function getLectureData(lectureId: number) {
  const accessJwtCookie = await checkAuthAndGetCookie();

  const res = await fetcher('GET', `/lectures/${lectureId}`, {
    jwt: accessJwtCookie.value,
  });

  if (!res.ok) {
    notFound();
  }

  const data = (await res.json()) as BaseResType<LectureType>;
  return data.result;
}

//멘토링 상세 - 멘토 소개
export async function getProfileCard(lectureId: number) {
  const accessJwtCookie = await checkAuthAndGetCookie();

  const res = await fetcher('GET', `/profile-card/${lectureId}`, {
    jwt: accessJwtCookie.name,
  });

  if (!res.ok) {
    notFound();
  }

  const data = (await res.json()) as BaseResType<ProfileResponseType>;
  return data.result;
}

export async function getLectureReviews(lectureId: number) {
  // TODO: 추후 삭제 필요

  return {
    averageScore: 4.7,
    count: 14,
    subScores: [
      { score: 5, count: 9 },
      { score: 4, count: 3 },
      { score: 3, count: 2 },
      { score: 2, count: 0 },
      { score: 1, count: 0 },
    ],
    reviews: [
      {
        id: 1,
        lectureId: 1,
        userId: 1,
        profileImageUrl: '/img_landing.png',
        userName: '내 꿈은 적금왕',
        lectureTitle: '하나은행 20년 경력 JII 멘토의 노하우',
        content:
          '다음 강의가 너무 기대되지는 이번 강이었습니다. 사실 항상 그랬지만 이번 강의는 더더욱 JII 멘토님의 큰 그림을 느낄 수 있는 강의였습니다.',
        score: 4,
        createdAt: new Date('2024-11-12'),
      },
      {
        id: 2,
        lectureId: 1,
        userId: 2,
        profileImageUrl: '/img_landing.png',
        userName: '김상현',
        lectureTitle: 'JJI멘토와 함께하는 은빛 설계',
        content:
          '현업 개발자로서도 자바를 포함해 영한님의 바이브 또한 배울 수 있어 멘토링을 통해 많은 도움을 받았습니다.',
        score: 5,
        createdAt: new Date('2024-11-10'),
      },
      {
        id: 3,
        lectureId: 1,
        userId: 3,
        profileImageUrl: '/img_landing.png',
        userName: '양지은',
        lectureTitle: 'JJI멘토와 함께하는 은빛 설계',
        content: '굿',
        score: 3,
        createdAt: new Date('2024-11-10'),
      },
    ],
  };

  const res = await fetcher('GET', `/review/lectures/${lectureId}`);

  if (!res.ok) {
    notFound();
  }

  const result: BaseResType<ReviewPageResponseType> = await res.json();

  return result.result;
}

export async function getLectureFaqs(lectureId: number) {
  // TODO: 추후 삭제 필요

  const dummy: FaqResponseType[] = [
    {
      id: 1,
      profileImageUrl: '/img_landing.png',
      userName: '내 꿈은 적금왕',
      content: '다음 강의가 일정이 궁금합니다?',
      createdAt: new Date('2024-12-12'),
      answers: [],
    },
    {
      id: 2,
      profileImageUrl: '/img_landing.png',
      userName: '나는 멘토',
      content:
        '실시간 강의와 녹화 강의가 혼합되어 진행됩니다. 질문은 실시간으로 가능합니다.',
      createdAt: new Date('2024-12-15'),
      answers: [],
    },
    {
      id: 3,
      profileImageUrl: '/img_landing.png',
      userName: '이영희',
      content: '수업은 어떤 방식으로 진행되나요?',
      createdAt: new Date('2024-12-22'),
      answers: [],
    },
    {
      id: 4,
      profileImageUrl: '/img_landing.png',
      userName: '박지민',
      content: '강의 자료는 어떻게 받을 수 있나요?',
      createdAt: new Date('2024-12-24'),
      answers: [],
    },
    {
      id: 5,
      profileImageUrl: '/img_landing.png',
      userName: '멘토링 팀',
      content: '강의 자료는 강의 시작 전에 이메일로 발송됩니다.',
      createdAt: new Date('2024-12-25'),
      answers: [],
    },
    {
      id: 6,
      profileImageUrl: '/img_landing.png',
      userName: '1',
      content: '다음 강의가 일정이 궁금합니다?',
      createdAt: new Date('2024-12-12'),
      answers: [],
    },
    {
      id: 7,
      profileImageUrl: '/img_landing.png',
      userName: '나는 멘토다',
      content:
        '실시간 강의와 녹화 강의가 혼합되어 진행됩니다. 질문은 실시간으로 가능합니다.',
      createdAt: new Date('2024-12-15'),
      answers: [],
    },
  ];
  return dummy;

  const res = await fetcher('GET', `/faq/${lectureId}`);

  if (!res.ok) {
    notFound();
  }

  const result: BaseResType<FaqResponseType[]> = await res.json();

  return result.result;
}

export async function postFaq(
  prevState: ActionResType<FaqFormType, string>,
  formData: FormData
): Promise<ActionResType<FaqFormType, string>> {
  const question = formData.get('question') as string;

  const dummy: ActionResType<FaqFormType, string> = {
    value: {
      question: question,
    },
    message: '질문이 등록되었습니다.',
    isError: false,
  };
  return dummy;
}
