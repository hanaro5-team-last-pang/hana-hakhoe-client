'use server';

import {
  ActionResType,
  BaseResType,
  SubmitReviewFormType,
  AuthType,
  ChangeProfileFormType,
} from '@/types/hanaHakdang';
import { checkAuthAndGetCookie } from '@/utils/CheckCookies';
import { fetcher } from '@/utils/fetcher';

//검색 서버액션 예시
export async function handleSearchAction(formData: FormData) {
  const searchTerm = formData.get('search')?.toString() || '';
  console.log('Searching for:', searchTerm);
}

export async function changeProfileForm(
  prevState: ActionResType<ChangeProfileFormType, string>,
  formData: FormData
): Promise<ActionResType<ChangeProfileFormType, string>> {
  const accessJwtCookie = await checkAuthAndGetCookie();
  const formObj: ChangeProfileFormType = {
    newImage: formData.get('profile-image-upload') as File | null,
    currentPassword: formData.get('currentPassword') as string | null,
    newPassword: formData.get('newPassword') as string | null,
    newConfirmedPassword: formData.get('newConfirmedPassword') as string | null,
  };

  const reqFormData = new FormData();
  if (formObj.newImage) {
    reqFormData.append('imageFile', formObj.newImage);
  }
  if (
    formObj.currentPassword &&
    formObj.newPassword &&
    formObj.newConfirmedPassword
  ) {
    reqFormData.append(
      'accountData',
      new Blob(
        [
          JSON.stringify({
            currentPassword: formObj.currentPassword,
            newPassword: formObj.newPassword,
            confirmPassword: formObj.newConfirmedPassword,
          }),
        ],
        { type: 'application/json' }
      )
    );
  }

  const res = await fetcher('PATCH', '/account', {
    body: reqFormData,
    jwt: accessJwtCookie.value,
    header: {},
  });

  if (!res.ok) {
    return {
      value: {
        ...formObj,
        newImage: null,
      },
      message: '잘못된 요청입니다.',
      isError: true,
    };
  }

  const data = (await res.json()) as BaseResType<ChangeProfileFormType>;

  return {
    value: prevState.value,
    message: data.message,
    isError: false,
  };
}

export async function submitReview(
  prevState: ActionResType<SubmitReviewFormType, string>,
  formData: FormData
): Promise<ActionResType<SubmitReviewFormType, string>> {
  const value = Object.fromEntries(formData) as SubmitReviewFormType;
  const message = '후기 제출 액션';

  return {
    value: value,
    message: message,
    isError: false,
  };
}

export async function getMyAuthData(): Promise<AuthType> {
  const accessJwtCookie = await checkAuthAndGetCookie();

  const res = await fetcher('GET', '/user-info', {
    jwt: accessJwtCookie.value,
  });

  const data = (await res.json()) as BaseResType<AuthType>;
  if (!res.ok) {
    console.log(`Failed to fetch user info: ${data.message}`);
  }

  return data.result;
}
