import { BASE_HEADERS, BASE_URL, SESSION_COOKIE_NAME } from '@/constant';
import { AuthType, BaseResType } from '@/types/hanaHakdang';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    return new Response();
  }

  const accessToken = sessionCookie.value;

  const res = await fetch(BASE_URL + '/user-info', {
    method: 'GET',
    headers: {
      ...BASE_HEADERS,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = (await res.json()) as BaseResType<AuthType>;

  return Response.json(data.result);
}
