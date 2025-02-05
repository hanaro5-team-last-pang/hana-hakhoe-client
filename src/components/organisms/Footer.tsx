import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-200">
      <div className="wrapper grid grid-flow-row md:grid-cols-2 p-5 gap-y-8 gap-x-5">
        <div className="flex flex-col gap-y-3">
          <Link href="/">
            <img className="w-32" src="/logo_header.png" alt="로고" />
          </Link>
          <p className="text-sm text-banlance text-gray-600">
            저희 하나 학회는 누구나 배움의 뜻이 있는 분들에게 비대면 화상
            멘토링을 통해 새로운 비전을 제시하여 배움의 장을 열겠습니다.
          </p>
        </div>
        <div className="flex flex-col">
          <div className="">
            <div className="text-sm grid grid-rows-3 grid-flow-col gap-4 [&>p>strong]:font-semibold">
              <p>
                <strong>찾아 오시는 길</strong>: 서울특별시 성동구 아차산로 111
                2층
              </p>
              <p>
                <strong>대표 전화번호</strong>: 02-6224-5730
              </p>
              <p>
                <strong>서비스 둘러보기</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-gray-300" />
      <div className="py-3">
        <p className="text-center text-gray-400">
          Copyright © 2024 Hana Academy - LAST PANG
        </p>
      </div>
    </footer>
  );
}
