import { SESSION_COOKIE_NAME } from '@/constant';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return new Response(null, {
    status: 200,
    headers: {
      'Set-Cookie': cookieStore.toString(),
    },
  });
}
