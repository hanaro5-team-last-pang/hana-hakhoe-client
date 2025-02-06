'use client';

import { verifyEmail } from '@/app/(auth)/action';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; authToken?: string }>;
}) {
  const params = await searchParams;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const email = params.email;
  const authToken = params.authToken;

  useEffect(() => {
    if (email && authToken) {
      setLoading(true);

      verifyEmail(String(email), String(authToken))
        .then((response) => {
          setLoading(false);
          setMessage(response.message);
          setIsError(response.isError);

          // 인증 성공 시 카운트다운 시작 후 창 닫기
          if (!response.isError) {
            let counter = 3;
            setCountdown(counter);

            const interval = setInterval(() => {
              counter -= 1;
              setCountdown(counter);
              if (counter <= 0) {
                clearInterval(interval);
                window.close();
              }
            }, 1000);
          }
        })
        .catch((error) => {
          setLoading(false);
          setMessage(error.message || '이메일 인증 실패');
          setIsError(true);
        });
    } else {
      setMessage('이메일 또는 인증 토큰이 없습니다.');
      setIsError(true);
    }
  }, [router]);

  return (
    <div className="w-full items-center p-10 text-center">
      <h1>{loading ? '이메일 인증 중...' : message}</h1>
      {loading && <div>로딩 중...</div>}
      {isError && <div style={{ color: 'red' }}>인증 실패: {message}</div>}
      {!isError && !loading && (
        <div>
          <p>
            인증 성공, {countdown !== null ? `${countdown}초 후에` : ''} 창이
            닫힙니다.
          </p>
        </div>
      )}
    </div>
  );
}
