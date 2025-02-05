'use server';

import {
  FaqFormType,
  FaqResponseType,
  LectureType,
  ReviewPageResponseType,
} from '@/app/(main)/mentorings/type';
import { ProfileResponseType } from '@/app/(main)/mypage/type';
import { ActionResType, BaseResType } from '@/types/hanaHakdang';
import { checkAuthAndGetCookie } from '@/utils/CheckCookies';
import { fetcher } from '@/utils/fetcher';
import { notFound } from 'next/navigation';

//멘토링 상세 정보
export async function getLectureData(lectureId: number) {
  const res = await fetcher('GET', `/lectures/${lectureId}`);

  if (!res.ok) {
    notFound();
  }
  const data = (await res.json()) as BaseResType<LectureType>;
  return data.result;
}

//멘토링 상세 - 멘토 소개
export async function getProfileCard(lectureId: number) {
  const res = await fetcher('GET', `/profile-card/${lectureId}`);

  if (!res.ok) {
    notFound();
  }
  const data = (await res.json()) as BaseResType<ProfileResponseType>;
  return data.result;
}

/**
 * 탭 메뉴 3 - 리뷰 조회
 * @param lectureId
 */

export async function getLectureReviews(
  lectureId: number
): Promise<ReviewPageResponseType> {
  const res = await fetcher('GET', `/lectures/reviews/${lectureId}`);

  if (!res.ok) {
    notFound();
  }
  const data = (await res.json()) as BaseResType<ReviewPageResponseType>;
  return data.result;
}

/**
 * 탭 메뉴 4 - FAQ 조회, 등록 및 삭제
 * @param lectureId
 */
export async function getLectureFaqs(lectureId: number) {
  const res = await fetcher('GET', `/faq/${lectureId}`);

  if (!res.ok) {
    notFound();
  }
  const result = (await res.json()) as BaseResType<FaqResponseType[]>;
  return result.result;
}

export async function postFaq(
  state: ActionResType<FaqFormType, string>,
  formData: FormData
): Promise<ActionResType<FaqFormType, string>> {
  const question = formData.get('content') as string;
  const lectureId = formData.get('lectureId') as string;

  const accessJwtCookie = await checkAuthAndGetCookie();

  const res = await fetcher('GET', `lectures/faq/${lectureId}`, {
    jwt: accessJwtCookie.value,
    body: JSON.stringify({ content: question }),
  });

  if (!res.ok) {
    notFound();
  }

  const result = await res.json();

  return result.result;
}

export async function deleteFaq(
  faqId: number
): Promise<ActionResType<FaqFormType, string>> {
  const accessJwtCookie = await checkAuthAndGetCookie();

  const res = await fetcher('GET', `/faq/${faqId}`, {
    jwt: accessJwtCookie.name,
  });

  if (!res.ok) {
    notFound();
  }
  const result = await res.json();
  return result.result;
}

/**
 * FAQ에 대한 답변 등록, 삭제 api
 */

/**
 * category 리스트 가져오기
 */
export async function getCategory() {
  const res = await fetcher('GET', '/lectures/categories');
  const data = await res.json();

  if (!res.ok) {
    return data.message;
  }
  return data.result;
}
