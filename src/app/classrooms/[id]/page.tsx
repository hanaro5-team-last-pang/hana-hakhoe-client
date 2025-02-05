import {
  EnterClassroomResType,
  StartClassroomResType,
} from '@/app/(main)/mypage/type';
import ChatComponent from '@/app/classrooms/_component/ChatComponent';
import VideoComponent from '@/app/classrooms/_component/VideoComponent';
import { enterClassroom, startClassroom } from '@/app/classrooms/action';
import { IoChevronBackSharp } from 'react-icons/io5';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const { id } = await props.params;
  const cookieStore = await cookies();
  let classroomId: string;
  try {
    classroomId = id;
  } catch (e) {
    console.log(e);
    notFound();
  }

  const roleCookie = cookieStore.get('role');
  if (!roleCookie) {
    notFound();
  }

  const role = roleCookie.value as 'MENTOR' | 'MENTEE';

  const classroomInfo: StartClassroomResType | EnterClassroomResType =
    role === 'MENTEE'
      ? await enterClassroom(classroomId)
      : await startClassroom(classroomId);

  const lectureName = classroomInfo.lectureTitle;

  const mentorKey =
    role === 'MENTEE'
      ? (classroomInfo as EnterClassroomResType)?.mentorId
      : undefined;

  return (
    <>
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
      <div className="relative grid grid-rows-[1fr_12fr] h-full lg:border-r-4 border-gray-300 min-h-0">
        <div className="border-b-4 border-gray-300 flex items-center">
          <Link
            className="p-2 rounded-lg bg-green-700 mx-3"
            href={`/mentorings/${classroomId}`}
          >
            <IoChevronBackSharp className="text-white" />
          </Link>
          <div className="font-bold ">{lectureName}</div>
        </div>
        <VideoComponent classroomId={classroomId} mentorKey={mentorKey} />
      </div>
      <div className="p-4 relative overflow-y-auto">
        <ChatComponent classroomId={classroomId} />
      </div>
    </>
  );
}
