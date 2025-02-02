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

/**
 * 탭 메뉴 3 - 리뷰 조회
 * @param lectureId
 */

export async function getLectureReviews(
  lectureId: number
): Promise<BaseResType<ReviewPageResponseType>> {
  const jsessionIdCookie = await checkAuthAndGetCookie();

  const res = await fetch(BASE_URL + `/lectures/reviews/${lectureId}`, {
    method: 'GET',
    headers: {
      Cookie: `${jsessionIdCookie?.name}=${jsessionIdCookie?.value}`,
    },
  });

  if (!res.ok) {
    notFound();
  }

  const result = (await res.json()) as BaseResType<ReviewPageResponseType>;
  return result;
}

/**
 * 탭 메뉴 4 - FAQ 조회, 등록 및 삭제
 * @param lectureId
 */
export async function getLectureFaqs(lectureId: number) {
  const jsessionIdCookie = await checkAuthAndGetCookie();

  const res = await fetch(BASE_URL + `/faq/${lectureId}`, {
    method: 'GET',
    headers: {
      Cookie: `${jsessionIdCookie?.name}=${jsessionIdCookie?.value}`,
    },
  });

  if (!res.ok) {
    notFound();
  }

  const result: BaseResType<FaqResponseType[]> = await res.json();

  return result.result;
}

export async function postFaq(
  state: ActionResType<FaqFormType, string>,
  formData: FormData
): Promise<ActionResType<FaqFormType, string>> {
  const question = formData.get('content') as string;
  const lectureId = formData.get('lectureId') as string;

  const jsessionIdCookie = await checkAuthAndGetCookie();

  const res = await fetch(BASE_URL + `lectures/faq/${lectureId}`, {
    method: 'POST',
    headers: {
      ...BASE_HEADERS,
      Cookie: `${jsessionIdCookie?.name}=${jsessionIdCookie?.value}`,
    },
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
  const jsessionIdCookie = await checkAuthAndGetCookie();

  const res = await fetch(BASE_URL + `/faq/${faqId}`, {
    method: 'DELETE',
    headers: {
      Cookie: `${jsessionIdCookie?.name}=${jsessionIdCookie?.value}`,
    },
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
