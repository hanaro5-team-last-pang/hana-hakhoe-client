import { SESSION_COOKIE_NAME } from '@/constant';
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

  return Response.json(await res.json());
}
