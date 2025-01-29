'use client';

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
  const { videoRef, changeDevice, stream } = useLocalVideo();
  const { videoDevices, audioDevices } = useMediaDevices();
  const isConnected = useContext(StompIsConnectedContext);
  const publish = useContext(StompPublishContext);
  const subscribe = useContext(StompSubscribeContext);
  const [otherKeyList, setOtherKeyList] = useState<string[]>([]);
  const [pcListMap] = useState<
    Map<
      string,
      { local: LocalPeerConnection | null; remote: RemotePeerConnection | null }
    >
  >(new Map());
  const currentKey = useRef<string>(uuidv4());
  const mentorKey = useRef<string | null>(null);
  const role = useRef<'mentor' | 'mentee' | null>(null);

  useEffect(() => {
    if (isConnected && stream) {
      const storedMentorKey = localStorage.getItem('mentorKey');
      if (!storedMentorKey) {
        role.current = 'mentor';
        localStorage.setItem('mentorKey', currentKey.current);
        mentorKey.current = currentKey.current;
        subscribeEnter();
      } else {
        role.current = 'mentee';
        mentorKey.current = storedMentorKey;
        publish(ENTER_PUBLISH_URL(classroomId), currentKey.current);
        subscribeEnter();
      }
    }
  }, [isConnected, stream]);

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
    videoElement.setAttribute('autoPlay', 'true');
    videoElement.setAttribute('playsInline', 'true');
    videoElement.style.width = '100%';
    videoElement.style.height = 'auto';

    const videoContainer = document.getElementById('remote-video-container');
    if (videoContainer) {
      videoContainer.appendChild(videoElement);
    }

    return videoElement;
  };

  const initializePeerConnection = (key: string, isMentor: boolean) => {
    const iceServers = [{ urls: 'stun:hanahakhoe.shop:3478' }];
    const configuration: RTCConfiguration = { iceServers };

    const peerConnection = isMentor
      ? new RemotePeerConnection(key)
      : new LocalPeerConnection(mentorKey.current!);

    peerConnection.initPeerConnection(configuration);
    peerConnection.addLocalTrack(stream!);
    setupIceCandidateHandling(peerConnection, key);

    return peerConnection;
  };

  const handleMentor = (key: string) => {
    if (!pcListMap.has(key)) {
      const remotePeerConnection = initializePeerConnection(
        key,
        true
      ) as RemotePeerConnection;
      const videoElement = createVideoElement(`video-${key}`);

      remotePeerConnection.addRemoteTrack(videoElement);
      pcListMap.set(key, { local: null, remote: remotePeerConnection });

      setOtherKeyList((prevList) => [...prevList, key]);
    }
  };

  const handleMentee = async () => {
    const localPeerConnection = initializePeerConnection(
      currentKey.current,
      false
    ) as LocalPeerConnection;
    const mentorVideoElement = createVideoElement('mentor-video');

    localPeerConnection.addRemoteTrack(mentorVideoElement);
    pcListMap.set(currentKey.current, {
      local: localPeerConnection,
      remote: null,
    });

    await localPeerConnection.sendOffer((offer) => {
      publish(SIGNALING_PUBLISH_URL(classroomId), offer);
    }, currentKey.current);
  };

  const subscribeEnter = useCallback(() => {
    subscribe(ENTER_SUBSCRIBE_URL(classroomId), async (message: IMessage) => {
      const key: string = JSON.parse(message.body);
      if (role.current === 'mentor') handleMentor(key);
      if (role.current === 'mentee') await handleMentee();
    });

    subscribe(
      SIGNALING_SUBSCRIBE_URL(classroomId),
      async (message: IMessage) => {
        const { peerId, description } = JSON.parse(JSON.parse(message.body));
        const connection = pcListMap.get(peerId);
        const remotePeerConnection = connection ? connection.remote : undefined;

        if (remotePeerConnection && role.current === 'mentor') {
          await remotePeerConnection.receiveOfferCallback(
            description,
            (answerText) => {
              publish(ANSWER_PUBLISH_URL(classroomId), answerText);
            }
          );
        }
      }
    );

    subscribe(ANSWER_SUBSCRIBE_URL(classroomId), async (message: IMessage) => {
      const { peerId, description } = JSON.parse(JSON.parse(message.body));
      const localPeerConnection = pcListMap.get(peerId)?.local;

      if (localPeerConnection && role.current === 'mentee') {
        await localPeerConnection.receiveAnswerCallback(description);
      }
    });

    subscribe(TRICKLE_SUBSCRIBE_URL(classroomId), async (message: IMessage) => {
      const { peerId, candidate } = JSON.parse(JSON.parse(message.body));
      const connection = pcListMap.get(peerId);

      if (connection?.remote && role.current === 'mentor') {
        await connection.remote.receiveIceCandidateCallback(candidate);
      }
      if (connection?.local && role.current === 'mentee') {
        await connection.local.receiveIceCandidateCallback(candidate);
      }
    });
  }, [role, classroomId, stream]);

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

  return (
    <div className="overflow-y-auto flex flex-col scrollbar-hide">
      <div className="flex justify-center">
        <video ref={videoRef} autoPlay />
      </div>
      <div id="remote-video-container"></div>
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
      </div>
    </div>
  );
}
