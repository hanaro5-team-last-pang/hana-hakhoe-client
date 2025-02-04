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
  const { subscribeEnter, closeClassroom, startScreenStream } =
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
      if (!auth.role) {
        router.push('/login');
      }
    }
  }, [isConnected, stream, auth]);

  return (
    <div className="overflow-y-auto scrollbar-hide">
      <div className="absolute bottom-2 right-2">
        <video
          ref={videoRef}
          autoPlay
          className="rounded-full object-cover w-40 h-40"
        />
      </div>
      {loading ? (
        <>
          <div className="animate-pulse flex items-center justify-center gap-y-1 flex-col h-screen">
            <div className="w-32 h-6 bg-gray-200 rounded"></div>
            <div className="w-32 h-6 bg-gray-200 rounded"></div>
          </div>
        </>
      ) : (
        <>
          {auth!.role === 'MENTOR' ? (
            <div className="flex flex-col h-full">
              <div className="mx-3 mt-2 font-bold">참여자</div>
              <div
                id="remote-video-container"
                className={`grid grid-cols-4 gap-2 px-2 py-1 w-full h-[22%] relative`}
              />
              <div className="mx-3 mt-2 font-bold relative">화면 공유</div>
              <div className="flex-grow grid grid-cols-[1fr,auto] px-2">
                <div className="flex flex-col">
                  <div id="my-screen-video" className="pr-2 py-1 h-4/5 w-4/5" />
                  <div className="flex items-end">
                    <div className="flex gap-2 my-2 rounded-2xl border-2 border-b-4 p-2">
                      <Dropdown
                        menuButton={
                          <span className="rounded-full bg-ourGreen text-white text-sm font-medium px-4 py-2 shadow-md">
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
                        anchor="top"
                        menuItemsClassName="bg-white rounded-lg drop-shadow scrollbar-hide border border-gray-200 px-2 z-30 w-[450px] my-2"
                      />
                      <Dropdown
                        menuButton={
                          <span className="rounded-full bg-ourGreen text-white text-sm font-medium px-4 py-2 shadow-md">
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
                        anchor="top"
                        menuItemsClassName="bg-white rounded-lg drop-shadow scrollbar-hide border border-gray-200 px-2 z-30 w-[450px] my-2"
                      />
                      <Button
                        type="button"
                        text="화면 공유"
                        className="rounded-full bg-ourGreen text-white text-sm font-medium px-4 py-2 shadow-md"
                        onClick={() => startScreenStream()}
                      />
                      <Button
                        type="submit"
                        text="강의 종료"
                        className="rounded-full bg-red-500 text-white text-sm font-medium px-4 py-2 shadow-md"
                        onClick={() => closeClassroom(auth!.userId)}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-end py-2"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-[1fr,auto] h-full">
              <div className="flex flex-col h-full">
                <div className="mx-3 mt-2 font-bold">멘토</div>
                <div
                  id="mentor-video-container"
                  className="p-2 h-[20%] w-full relative"
                />
                <div className="mx-3 font-bold">화면 공유</div>
                <div className="flex-1 items-center justify-between w-full">
                  <div
                    id="mentor-screen-video"
                    className="px-2 py-1 h-[82%] w-4/5"
                  />
                  <div className="mx-3 flex-1 flex items-end gap-2 my-2 rounded-2xl border-2 border-b-4 px-2 py-3 max-w-fit">
                    <Dropdown
                      menuButton={
                        <span className="rounded-full bg-ourGreen text-white whitespace-nowrap text-sm font-medium px-4 py-2 shadow-md">
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
                      anchor="top"
                      menuItemsClassName="bg-white rounded-lg drop-shadow scrollbar-hide border border-gray-200 px-2 z-30 w-[450px] my-2"
                    />

                    <Dropdown
                      menuButton={
                        <span className="rounded-full bg-ourGreen text-white whitespace-nowrap text-sm font-medium px-4 py-2 shadow-md">
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
                      anchor="top"
                      menuItemsClassName="bg-white rounded-lg drop-shadow scrollbar-hide border border-gray-200 px-2 z-30 w-[450px] my-2"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="mx-3 mt-2 font-bold">참가자</div>
                <div
                  id="remote-video-container"
                  className={`grid grid-rows-3 gap-3 px-2 py-1 w-56 relative`}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
