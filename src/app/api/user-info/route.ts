import { SESSION_COOKIE_NAME } from '@/constant';
import { AuthResType, BaseResType } from '@/types/hanaHakdang';
import { fetcher } from '@/utils/fetcher';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    return new Response();
  }

  const res = await fetcher('GET', '/user-info', {
    jwt: sessionCookie.value,
  });

  if (!res.ok) {
    return new Response();
  }

  const data = (await res.json()) as BaseResType<AuthResType>;

  return Response.json(data.result, {
    headers: {
      'Set-Cookie': `role=${data.result.role}; path=/`,
    },
  });
}
