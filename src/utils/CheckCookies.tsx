import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const checkAuthAndGetCookie = async () => {
  const cookieStore = await cookies();
  const jsessionIdCookie = cookieStore.get('JSESSIONID');

  // 쿠키가 없으면 로그인 페이지로 리디렉션
  if (!jsessionIdCookie) {
    redirect('/login');
  }

  return jsessionIdCookie;
};
