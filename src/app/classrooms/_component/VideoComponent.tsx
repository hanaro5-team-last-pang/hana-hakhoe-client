'use client';

import Button from '@/components/atoms/Button';
import Dropdown from '@/components/atoms/Dropdown';
import {
  ANSWER_PUBLISH_URL,
  ANSWER_SUBSCRIBE_URL,
  ENTER_PUBLISH_URL,
  ENTER_SUBSCRIBE_URL,
  SIGNALING_PUBLISH_URL,
  SIGNALING_SUBSCRIBE_URL,
  TRICKLE_PUBLISH_URL,
  TRICKLE_SUBSCRIBE_URL,
} from '@/constant';
import {
  StompIsConnectedContext,
  StompPublishContext,
  StompSubscribeContext,
} from '@/context/StompConnectionContext';
import useLocalVideo from '@/hooks/useLocalVideo';
import useMediaDevices from '@/hooks/useMediaDevices';
import LocalPeerConnection from '@/webrtc/LocalPeerConnection';
import RemotePeerConnection from '@/webrtc/RemotePeerConnection';
import { IMessage } from '@stomp/stompjs';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from 'react';

interface Props {
  classroomId: bigint;
}

export default function VideoComponent({ classroomId }: Props) {
  const router = useRouter();
  const { videoRef, changeDevice, stream } = useLocalVideo();
  const { videoDevices, audioDevices } = useMediaDevices();
  const isConnected = useContext(StompIsConnectedContext);
  const publish = useContext(StompPublishContext);
  const subscribe = useContext(StompSubscribeContext);
  const [pcListMap] = useState<
    Map<
      string,
      { local: LocalPeerConnection | null; remote: RemotePeerConnection | null }
    >
  >(new Map());
  const currentKey = useRef<string>(uuidv4());
  const mentorKey = useRef<string | null>(null);
  const [role, setRole] = useState<'mentor' | 'mentee' | null>(null);

  const setupIceCandidateHandling = (
    peerConnection: LocalPeerConnection | RemotePeerConnection,
    key: string
  ) => {
    peerConnection.addIceCandidateCallback((candidate) => {
      publish(TRICKLE_PUBLISH_URL(classroomId), candidate);
    }, key);
  };

  const createVideoElement = (id: string) => {
    const videoElement = document.createElement('video');
    videoElement.id = id;
    videoElement.className = 'w-full h-full rounded-xl object-cover';
    videoElement.setAttribute('autoPlay', 'true');
    videoElement.setAttribute('playsInline', 'true');

    const videoContainer = document.getElementById('remote-video-container');
    if (videoContainer) {
      videoContainer.appendChild(videoElement);
    }

    return videoElement;
  };

  const initializePeerConnection = (key: string, isLocal: boolean) => {
    const iceServers = [{ urls: 'stun:hanahakhoe.shop:3478' }];
    const configuration: RTCConfiguration = { iceServers };

    const peerConnection = isLocal
      ? new RemotePeerConnection(key)
      : new LocalPeerConnection();

    peerConnection.initPeerConnection(configuration);
    peerConnection.addLocalTrack(stream!);
    setupIceCandidateHandling(peerConnection, key);

    return peerConnection;
  };

  const handleLocalPeer = async (uniqueStr?: string, remoteId?: string) => {
    const localPeerConnection = initializePeerConnection(
      uniqueStr ? uniqueStr : currentKey.current,
      false
    ) as LocalPeerConnection;
    const mentorVideoElement = createVideoElement(
      uniqueStr ? uniqueStr : currentKey.current
    );

    localPeerConnection.addRemoteTrack(mentorVideoElement);
    pcListMap.set(uniqueStr ? uniqueStr : currentKey.current, {
      local: localPeerConnection,
      remote: null,
    });

    await localPeerConnection.sendOffer(
      (offer) => {
        publish(SIGNALING_PUBLISH_URL(classroomId), offer);
      },
      uniqueStr ? uniqueStr : currentKey.current,
      remoteId
    );
  };

  const handleRemotePeer = async (key: string) => {
    if (!pcListMap.has(key)) {
      const remotePeerConnection = initializePeerConnection(
        key,
        true
      ) as RemotePeerConnection;
      const videoElement = createVideoElement(key);

      remotePeerConnection.addRemoteTrack(videoElement);
      pcListMap.set(key, { local: null, remote: remotePeerConnection });
    }
  };

  const subscribeEnter = useCallback(() => {
    subscribe(ENTER_SUBSCRIBE_URL(classroomId), async (message: IMessage) => {
      const { type, key } = JSON.parse(message.body);
      if (type === 'Enter') {
        if (key !== currentKey.current) await handleRemotePeer(key);
        else {
          await handleLocalPeer();
        }
      }

      if (type === 'Close' && key !== currentKey.current) {
        pcListMap.forEach(({ local, remote }) => {
          local?.close();
          remote?.close();
        });

        pcListMap.clear();

        router.replace(`/classrooms/${classroomId}/review`);
      }
    });

    subscribe(
      SIGNALING_SUBSCRIBE_URL(classroomId),
      async (message: IMessage) => {
        const { peerId, remoteId, description } = JSON.parse(
          JSON.parse(message.body)
        );
        const connection = pcListMap.get(peerId);

        let remotePeerConnection = connection ? connection.remote : undefined;

        if (remoteId && remoteId !== currentKey.current) {
          return;
        }

        if (remoteId && remoteId === currentKey.current) {
          if (!remotePeerConnection) {
            if (!pcListMap.has(peerId)) {
              remotePeerConnection = initializePeerConnection(
                peerId,
                true
              ) as RemotePeerConnection;
              const videoElement = createVideoElement(`video-${peerId}`);

              remotePeerConnection.addRemoteTrack(videoElement);
              pcListMap.set(peerId, {
                local: null,
                remote: remotePeerConnection,
              });
            }
          }
        }

        if (remotePeerConnection) {
          await remotePeerConnection.receiveOfferCallback(
            description,
            (answerText) => {
              publish(ANSWER_PUBLISH_URL(classroomId), answerText);
            },
            currentKey.current
          );
        }
      }
    );

    subscribe(ANSWER_SUBSCRIBE_URL(classroomId), async (message: IMessage) => {
      const { peerId, remoteId, description } = JSON.parse(
        JSON.parse(message.body)
      );
      const localPeerConnection = pcListMap.get(peerId)?.local;

      if (localPeerConnection) {
        if (
          localPeerConnection.remotePeerId &&
          localPeerConnection.remotePeerId !== remoteId
        ) {
          await handleLocalPeer(uuidv4(), remoteId);
        }
        localPeerConnection.setRemoteId = remoteId;
        if (remoteId === mentorKey.current) {
          moveToMentorContainer(peerId);
        }
        await localPeerConnection.receiveAnswerCallback(description);
      }
    });

    subscribe(TRICKLE_SUBSCRIBE_URL(classroomId), async (message: IMessage) => {
      const { peerId, candidate } = JSON.parse(JSON.parse(message.body));
      const localPeerConnection = pcListMap.get(peerId)?.local;
      const remotePeerConnection = pcListMap.get(peerId)?.remote;

      if (remotePeerConnection) {
        await remotePeerConnection.receiveIceCandidateCallback(candidate);
      }
      if (localPeerConnection) {
        await localPeerConnection.receiveIceCandidateCallback(candidate);
      }
    });
  }, [classroomId, stream]);

  const moveToMentorContainer = (peerId: string) => {
    const videoElement = document.getElementById(peerId);
    const mentorContainer = document.getElementById('mentor-video-container');

    if (videoElement && mentorContainer) {
      mentorContainer.appendChild(videoElement);
      videoElement.className =
        'w-full h-full rounded-xl object-cover border-4 border-yellow-500';
    }
  };

  const startScreenStream = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      pcListMap.forEach((pc) => {
        const videoSender = pc.local
          ? pc.local
              ._pConn!.getSenders()
              .find((sender) => sender.track?.kind === 'video')
          : pc
              .remote!._pConn!.getSenders()
              .find((sender) => sender.track?.kind === 'video');

        if (videoSender) {
          videoSender.replaceTrack(screenStream.getVideoTracks()[0]);
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
      }

      screenStream.getVideoTracks()[0].onended = async () => {
        screenStream.getTracks().forEach((track) => track.stop());

        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        pcListMap.forEach((pc) => {
          const videoSender = pc.local
            ? pc.local
                ._pConn!.getSenders()
                .find((sender) => sender.track?.kind === 'video')
            : pc
                .remote!._pConn!.getSenders()
                .find((sender) => sender.track?.kind === 'video');

          if (videoSender) {
            videoSender.replaceTrack(userStream.getVideoTracks()[0]);
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
        }
      };
    } catch (error) {
      console.error(error);
    }
  };

  const toggleVideo = () => {
    if (videoRef.current!.srcObject) {
      videoRef.current!.srcObject = null;
    } else {
      videoRef.current!.srcObject = stream;
    }
  };

  const videoItems = videoDevices?.map((device, i) => (
    <button
      key={i}
      onClick={() => changeDevice(device)}
      className="w-full text-sm"
    >
      {device.label}
    </button>
  ));

  const audioItems = audioDevices?.map((device, i) => (
    <button
      key={i}
      onClick={() => changeDevice(device)}
      className="w-full text-sm"
    >
      {device.label}
    </button>
  ));

  const closeClassrooms = () => {
    publish(ENTER_PUBLISH_URL(classroomId), {
      type: 'Close',
      key: currentKey.current,
    });

    pcListMap.forEach(({ local, remote }) => {
      local?.close();
      remote?.close();
    });

    pcListMap.clear();
    localStorage.removeItem('mentorKey');
    router.push(`/mentorings/${classroomId}`);
  };

  const getGridSize = () => {
    const peerCount = pcListMap.size; // 현재 연결된 피어 수 계산
    return peerCount > 3
      ? 'grid-cols-3 grid-rows-3'
      : 'grid-cols-2 grid-rows-2';
  };

  useEffect(() => {
    if (isConnected && stream) {
      const storedMentorKey = localStorage.getItem('mentorKey');
      if (!storedMentorKey) {
        setRole('mentor');
        localStorage.setItem('mentorKey', currentKey.current);
        mentorKey.current = currentKey.current;
        subscribeEnter();
      } else {
        setRole('mentee');
        mentorKey.current = storedMentorKey;
        subscribeEnter();
        publish(ENTER_PUBLISH_URL(classroomId), {
          type: 'Enter',
          key: currentKey.current,
        });
      }
    }
  }, [isConnected, stream]);

  return (
    <div className="overflow-y-auto flex flex-col scrollbar-hide">
      {role === 'mentor' ? (
        <div
          id="remote-video-container"
          className={`grid ${getGridSize()} gap-2 p-2 w-4/5 h-4/5`}
        ></div>
      ) : (
        <>
          <div id="mentor-video-container" className="p-2 h-3/5 w-4/5"></div>
          <div
            id="remote-video-container"
            className="h-1/5 grid grid-cols-4 p-2 w-4/5"
          ></div>
        </>
      )}
      <div className="w-full h-1/5"></div>
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
        {role === 'mentor' && (
          <Button
            type="button"
            text="화면 공유"
            className="rounded-full bg-ourOrange text-white text-sm font-medium px-4 py-2 shadow-md"
            onClick={startScreenStream}
          />
        )}
        {role === 'mentor' && (
          <Button
            type="submit"
            text="강의 종료"
            className="rounded-full bg-ourOrange text-white text-sm font-medium px-4 py-2 shadow-md"
            onClick={closeClassrooms}
          />
        )}
      </div>
    </div>
  );
}
