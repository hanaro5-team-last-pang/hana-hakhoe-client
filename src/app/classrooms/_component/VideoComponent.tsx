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
  const [otherKeyList] = useState<string[]>([]);
  const [pcListMap] = useState<
    Map<string, LocalPeerConnection | RemotePeerConnection>
  >(new Map<string, LocalPeerConnection | RemotePeerConnection>());
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const currentKey = uuidv4();

  useEffect(() => {
    if (isConnected) {
      publish(ENTER_PUBLISH_URL(classroomId), currentKey);
      subscribeEnter();

      setTimeout(() => {
        otherKeyList.map(async (key) => {
          if (!pcListMap.has(key)) {
            const localPeerConnection = new LocalPeerConnection(key);
            const remotePeerConnection = new RemotePeerConnection(key);

            const iceServers = [{ urls: 'stun:hanahakhoe.shop:3478' }];
            const configuration: RTCConfiguration = { iceServers };

            localPeerConnection.initPeerConnection(configuration);
            remotePeerConnection.initPeerConnection(configuration);

            localPeerConnection.addIceCandidateCallback((text) => {
              publish(TRICKLE_PUBLISH_URL(classroomId), text);
            });

            const videoElement = document.createElement('video');
            videoElement.setAttribute('autoPlay', 'true');
            videoElement.setAttribute('playsInline', 'true');
            videoElement.setAttribute('class', 'remote-video');
            videoElement.style.width = '100%';
            videoElement.style.height = 'auto';

            remotePeerConnection.addRemoteTrack(videoElement);
            console.log(videoElement);

            remoteVideoRefs.current.set(key, videoElement);

            const videoContainer = document.getElementById(
              'remote-video-container'
            );
            if (videoContainer) {
              videoContainer.appendChild(videoElement);
            }

            pcListMap.set(key, remotePeerConnection);

            await createPeerConnection(localPeerConnection);
          }
        });
      }, 1000);
    }
  }, [isConnected]);

  const createPeerConnection = async (
    localPeerConnection: LocalPeerConnection
  ) => {
    localPeerConnection.addLocalTrack(stream!);

    await localPeerConnection.sendOffer((offerText) => {
      publish(SIGNALING_PUBLISH_URL(classroomId), offerText);
    });
  };

  const subscribeEnter = useCallback(() => {
    subscribe(ENTER_SUBSCRIBE_URL(classroomId), (message: IMessage) => {
      const key: string = JSON.parse(message.body);
      if (
        currentKey !== key &&
        otherKeyList.find((mapKey) => mapKey === currentKey) === undefined
      ) {
        otherKeyList.push(key);
      }
    });

    subscribe(
      SIGNALING_SUBSCRIBE_URL(classroomId),
      async (message: IMessage) => {
        const { peerId, description } = JSON.parse(message.body);
        if (pcListMap.has(peerId)) {
          const remotePeerConnection = new RemotePeerConnection(peerId);
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
      const { peerId, description } = JSON.parse(message.body);
      const localPeerConnection = pcListMap.get(peerId) as LocalPeerConnection;
      if (localPeerConnection) {
        await localPeerConnection.receiveAnswerCallback(description);
      }
    });

    subscribe(TRICKLE_SUBSCRIBE_URL(classroomId), async (message: IMessage) => {
      const { peerId, candidate } = JSON.parse(message.body);
      const localPeerConnection = pcListMap.get(peerId) as RemotePeerConnection;
      if (localPeerConnection) {
        await localPeerConnection.receiveIceCandidateCallback(candidate);
      }
    });
  }, [classroomId]);

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
      <div
        id="remote-video-container"
        className="grid grid-cols-2 gap-4 mt-4"
      ></div>
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
