import {
  ENTER_PUBLISH_URL,
  ENTER_SUBSCRIBE_URL,
  SIGNALING_PUBLISH_URL,
  SIGNALING_SUBSCRIBE_URL,
  TRICKLE_PUBLISH_URL,
  TRICKLE_SUBSCRIBE_URL,
} from '@/constant';
import {
  StompPublishContext,
  StompSubscribeContext,
} from '@/context/StompConnectionContext';
import LocalPeerConnection from '@/webrtc/LocalPeerConnection';
import RemotePeerConnection from '@/webrtc/RemotePeerConnection';
import { v4 as uuidv4 } from 'uuid';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useState, useContext, useCallback } from 'react';

const usePeerConnections = (
  classroomId: bigint,
  stream: MediaStream,
  router: AppRouterInstance
) => {
  const publish = useContext(StompPublishContext);
  const subscribe = useContext(StompSubscribeContext);
  const [pcListMap] = useState<
    Map<
      string,
      { local: LocalPeerConnection | null; remote: RemotePeerConnection | null }
    >
  >(new Map());

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

    document
      .getElementById('remote-video-container')
      ?.appendChild(videoElement);
    return videoElement;
  };

  const initializePeerConnection = (key: string, isLocal: boolean) => {
    const iceServers = [{ urls: 'stun:hanahakhoe.shop:3478' }];
    const peerConnection = isLocal
      ? new LocalPeerConnection()
      : new RemotePeerConnection(key);
    peerConnection.initPeerConnection({ iceServers });
    peerConnection.addLocalTrack(stream);
    setupIceCandidateHandling(peerConnection, key);
    return peerConnection;
  };

  const handleLocalPeer = async (userId: string, remoteId?: string) => {
    const key = userId;
    const localPeerConnection = initializePeerConnection(
      key,
      true
    ) as LocalPeerConnection;
    localPeerConnection.addRemoteTrack(createVideoElement(key));
    pcListMap.set(key, { local: localPeerConnection, remote: null });

    await localPeerConnection.sendOffer(
      (offer) => publish(SIGNALING_PUBLISH_URL(classroomId), offer),
      key,
      remoteId
    );
  };

  const handleRemotePeer = async (key: string) => {
    if (!pcListMap.has(key)) {
      const remotePeerConnection = initializePeerConnection(
        key,
        false
      ) as RemotePeerConnection;
      remotePeerConnection.addRemoteTrack(createVideoElement(key));
      pcListMap.set(key, { local: null, remote: remotePeerConnection });
    }
  };

  const moveToMentorContainer = (peerId: string) => {
    const videoElement = document.getElementById(peerId);
    const mentorContainer = document.getElementById('mentor-video-container');

    if (videoElement && mentorContainer) {
      mentorContainer.appendChild(videoElement);
      videoElement.className =
        'w-full h-full rounded-xl object-cover border-4 border-yellow-500';
    }
  };

  const subscribeEnter = useCallback(
    (userId: string) => {
      subscribe(ENTER_SUBSCRIBE_URL(classroomId), async (message) => {
        const { type, key } = JSON.parse(message.body);
        if (type === 'Enter')
          key !== userId
            ? await handleRemotePeer(key)
            : await handleLocalPeer(userId);
        if (type === 'Close' && key !== userId) {
          closeClassroom(userId);
          router.replace(`/classrooms/${classroomId}/review`);
        }
      });

      subscribe(SIGNALING_SUBSCRIBE_URL(classroomId), async (message) => {
        const { peerId, remoteId, description } = JSON.parse(
          JSON.parse(message.body)
        );
        if (description.type === 'offer') {
          let remotePeerConnection = pcListMap.get(peerId)?.remote;

          if (remoteId) {
            if (remoteId === userId) {
              if (!remotePeerConnection) {
                if (!pcListMap.has(peerId)) {
                  remotePeerConnection = initializePeerConnection(
                    peerId,
                    false
                  ) as RemotePeerConnection;
                  const videoElement = createVideoElement(`video-${peerId}`);

                  remotePeerConnection.addRemoteTrack(videoElement);
                  pcListMap.set(peerId, {
                    local: null,
                    remote: remotePeerConnection,
                  });
                }
              }
            } else {
              return;
            }
          }

          if (remotePeerConnection) {
            await remotePeerConnection.receiveOfferCallback(
              description,
              (answerText) => {
                publish(SIGNALING_PUBLISH_URL(classroomId), answerText);
              },
              userId!
            );
          } else {
            return;
          }
        } else if (description.type === 'answer') {
          const localPeerConnection = pcListMap.get(peerId)?.local;
          if (!localPeerConnection) {
            return;
          }

          if (localPeerConnection.remotePeerId) {
            if (localPeerConnection.remotePeerId !== remoteId) {
              const newLocalPeerId = uuidv4();
              await handleLocalPeer(newLocalPeerId, remoteId);
            }
            return;
          }

          localPeerConnection.setRemoteId = remoteId;

          if (remoteId === userId) {
            moveToMentorContainer(peerId);
          }

          await localPeerConnection.receiveAnswerCallback(description);
        }
      });

      subscribe(TRICKLE_SUBSCRIBE_URL(classroomId), async (message) => {
        const { peerId, candidate } = JSON.parse(JSON.parse(message.body));
        pcListMap.get(peerId)?.local?.receiveIceCandidateCallback(candidate);
        pcListMap.get(peerId)?.remote?.receiveIceCandidateCallback(candidate);
      });
    },
    [classroomId, stream]
  );

  const startScreenStream = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      pcListMap.forEach(({ local, remote }) => {
        const videoSender =
          local
            ?._pConn!.getSenders()
            .find((sender) => sender.track?.kind === 'video') ||
          remote
            ?._pConn!.getSenders()
            .find((sender) => sender.track?.kind === 'video');
        if (videoSender)
          videoSender.replaceTrack(screenStream.getVideoTracks()[0]);
      });

      screenStream.getVideoTracks()[0].onended = async () => {
        screenStream.getTracks().forEach((track) => track.stop());
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        pcListMap.forEach(({ local, remote }) => {
          const videoSender =
            local
              ?._pConn!.getSenders()
              .find((sender) => sender.track?.kind === 'video') ||
            remote
              ?._pConn!.getSenders()
              .find((sender) => sender.track?.kind === 'video');
          if (videoSender)
            videoSender.replaceTrack(userStream.getVideoTracks()[0]);
        });
      };
    } catch (error) {
      console.error(error);
    }
  };

  const closeClassroom = (userId: string) => {
    publish(ENTER_PUBLISH_URL(classroomId), { type: 'Close', key: userId });
    pcListMap.forEach(({ local, remote }) => {
      local?.close();
      remote?.close();
    });
    pcListMap.clear();
    router.push(`/mentorings/${classroomId}`);
  };

  const getGridSize = () =>
    pcListMap.size > 3 ? 'grid-cols-3 grid-rows-3' : 'grid-cols-2 grid-rows-2';

  return {
    subscribeEnter,
    handleLocalPeer,
    handleRemotePeer,
    closeClassroom,
    startScreenStream,
    getGridSize,
  };
};

export default usePeerConnections;
