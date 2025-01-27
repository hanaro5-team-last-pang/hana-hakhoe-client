'use client';

import useLocalVideo from '@/hooks/useLocalVideo';
import useMediaDevices from '@/hooks/useMediaDevices';
import Dropdown from '@/components/atoms/Dropdown';
import Link from 'next/link';
interface Props {
  classroomId: bigint;
}

export default function VideoComponent({ classroomId }: Props) {
  const userRole = 'mentor';
  const { videoRef, changeDevice, stream } = useLocalVideo();
  const { videoDevices, audioDevices } = useMediaDevices();

  const toggleVideo = () => {
    if (videoRef.current!.srcObject) {
      videoRef.current!.srcObject = null;
    } else {
      videoRef.current!.srcObject = stream;
    }
  };

  const videoItems = videoDevices?.map((device, i) => {
    return (
      <button
        key={i}
        onClick={() => changeDevice(device)}
        className="w-full text-sm"
      >
        {device.label}
      </button>
    );
  });

  const audioItems = audioDevices?.map((device, i) => {
    return (
      <button
        key={i}
        onClick={() => changeDevice(device)}
        className="w-full text-sm"
      >
        {device.label}
      </button>
    );
  });

  return (
    <div className="overflow-y-auto flex flex-col scrollbar-hide">
      <div className="flex justify-center">
        <video ref={videoRef} autoPlay />
      </div>
      <div className="flex justify-center gap-2 my-2">
        <Dropdown
          menuButton={
            <span className="rounded-full bg-ourOrange text-white text-sm font-medium px-4 py-2 shadow-md">
              비디오 장치
            </span>
          }
          menuItems={videoItems}
          anchor="bottom"
          menuItemsClassName="bg-white rounded-lg drop-shadow scrollbar-hide border border-gray-200 px-2 z-30 w-[450px] my-2"
        />
        <button
          className="rounded-full bg-ourOrange text-white text-sm font-medium px-4 py-2 shadow-md"
          onClick={toggleVideo}
        >
          {videoRef.current?.srcObject ? '비디오 종료' : '비디오 시작'}
        </button>
        <Dropdown
          menuButton={
            <span className="rounded-full bg-ourOrange text-white text-sm font-medium px-4 py-2 shadow-md">
              오디오 장치
            </span>
          }
          menuItems={audioItems}
          anchor="bottom"
          menuItemsClassName="bg-white rounded-lg drop-shadow scrollbar-hide border border-gray-200 px-2 z-30 w-[450px] my-2"
        />
        <Link
          href={`/classrooms/${classroomId}/review`}
          className="rounded-full bg-ourOrange text-white text-sm font-medium px-4 py-2 shadow-md"
        >
          모달 폼 불러오기
        </Link>
      </div>
    </div>
  );
}
