'use client';

import Button from '@/components/atoms/Button';
import Dropdown from '@/components/atoms/Dropdown';
import { ENTER_PUBLISH_URL } from '@/constant';
import { useAuthStore } from '@/context/AuthContext';
import {
  StompIsConnectedContext,
  StompPublishContext,
} from '@/context/StompConnectionContext';
import useLocalVideo from '@/hooks/useLocalVideo';
import useMediaDevices from '@/hooks/useMediaDevices';
import usePeerConnections from '@/hooks/useWebRTC';
import { useRouter } from 'next/navigation';
import React, { useEffect, useContext } from 'react';

interface Props {
  classroomId: bigint;
}

export default function VideoComponent({ classroomId }: Props) {
  const router = useRouter();
  const { auth, loading } = useAuthStore((state) => state);
  const { videoRef, changeDevice, stream } = useLocalVideo();
  const { videoDevices, audioDevices } = useMediaDevices();
  const isConnected = useContext(StompIsConnectedContext);
  const publish = useContext(StompPublishContext);
  const { subscribeEnter, closeClassroom, startScreenStream, getGridSize } =
    usePeerConnections(classroomId, stream!, router);

  useEffect(() => {
    if (isConnected && stream && auth!) {
      if (auth.role === 'MENTOR') {
        subscribeEnter(auth.userId);
      }
      if (auth.role === 'MENTEE') {
        subscribeEnter(auth.userId);
        publish(ENTER_PUBLISH_URL(classroomId), {
          type: 'Enter',
          key: auth!.userId,
        });
      }
    }
  }, [isConnected, stream, auth]);

  return (
    <div className="overflow-y-auto flex flex-col scrollbar-hide">
      {!loading && (
        <>
          {auth!.role === 'MENTOR' ? (
            <div
              id="remote-video-container"
              className={`grid ${getGridSize()} gap-2 p-2 w-4/5 h-4/5`}
            />
          ) : (
            <>
              <div id="mentor-video-container" className="p-2 h-3/5 w-4/5" />
              <div
                id="remote-video-container"
                className="h-1/5 grid grid-cols-4 p-2 w-4/5 gap-2"
              />
            </>
          )}
        </>
      )}
      <video
        ref={videoRef}
        autoPlay
        className="rounded-full object-cover absolute right-2 bottom-2 w-28 h-28"
      />
      <div className="absolute bottom-0 left-2 flex justify-center gap-2 my-2">
        <Dropdown
          menuButton={
            <span className="rounded-full bg-ourOrange text-white text-sm font-medium px-4 py-2 shadow-md">
              비디오 장치
            </span>
          }
          menuItems={videoDevices.map((device, i) => (
            <button
              key={i}
              onClick={() => changeDevice(device)}
              className="w-full text-sm"
            >
              {device.label}
            </button>
          ))}
          anchor="bottom"
          menuItemsClassName="bg-white rounded-lg drop-shadow scrollbar-hide border border-gray-200 px-2 z-30 w-[450px] my-2"
        />
        <Dropdown
          menuButton={
            <span className="rounded-full bg-ourOrange text-white text-sm font-medium px-4 py-2 shadow-md">
              오디오 장치
            </span>
          }
          menuItems={audioDevices.map((device, i) => (
            <button
              key={i}
              onClick={() => changeDevice(device)}
              className="w-full text-sm"
            >
              {device.label}
            </button>
          ))}
          anchor="bottom"
          menuItemsClassName="bg-white rounded-lg drop-shadow scrollbar-hide border border-gray-200 px-2 z-30 w-[450px] my-2"
        />
        {auth?.role === 'MENTOR' && (
          <>
            <Button
              type="button"
              text="화면 공유"
              className="rounded-full bg-ourOrange text-white text-sm font-medium px-4 py-2 shadow-md"
              onClick={startScreenStream}
            />
            <Button
              type="submit"
              text="강의 종료"
              className="rounded-full bg-ourOrange text-white text-sm font-medium px-4 py-2 shadow-md"
              onClick={() => closeClassroom(auth.userId)}
            />
          </>
        )}
      </div>
    </div>
  );
}
