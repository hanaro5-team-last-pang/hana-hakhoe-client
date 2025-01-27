import ChatComponent from '@/app/classrooms/_component/ChatComponent';
import VideoComponent from '@/app/classrooms/_component/VideoComponent';
import StompConnectionProvider from '@/provider/StompConnectionProvider';
import { IoChevronBackSharp } from 'react-icons/io5';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const { id } = await props.params;
  let classroomId: bigint;
  try {
    classroomId = BigInt(id);
  } catch (e) {
    console.log(e);
    notFound();
  }

  const classroomTitle = '양지은의 주식 투자 시작';

  return (
    <StompConnectionProvider>
      <div className="h-screen p-2 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-[1fr_15fr_7fr] rounded-lg border-4 border-gray-300">
          <div className="hidden lg:block">
            <div className="flex justify-center border-r-4 border-gray-300 h-full">
              <div className="relative w-10 h-20 my-2">
                <Image
                  src="/verticalLogo.png"
                  alt="세로 로고"
                  className="object-contain"
                  fill
                />
              </div>
            </div>
          </div>
          <div className="relative grid grid-rows-[1fr_12fr] h-full border-r-4 border-gray-300 min-h-0">
            <div className="border-b-4 border-gray-300 flex items-center">
              <Link
                className="p-2 rounded-lg bg-green-700 mx-3"
                href={`/mentorings/${classroomId}`}
              >
                <IoChevronBackSharp className="text-white" />
              </Link>
              <div className="font-bold ">{classroomTitle}</div>
            </div>
            <VideoComponent classroomId={classroomId} />
          </div>
          <div className="p-4 hidden lg:block relative overflow-y-auto">
            <ChatComponent classroomId={classroomId} />
          </div>
        </div>
      </div>
    </StompConnectionProvider>
  );
}
