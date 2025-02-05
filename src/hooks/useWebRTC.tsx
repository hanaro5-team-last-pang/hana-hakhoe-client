import { terminateClassroom } from '@/app/classrooms/action';
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
  classroomId: string,
  stream: MediaStream,
  router: AppRouterInstance,
  lectureId: number,
  mentorId?: string
) => {
  const publish = useContext(StompPublishContext);
  const subscribe = useContext(StompSubscribeContext);
  const [pcListMap] = useState<
    Map<
      string,
      { local: LocalPeerConnection | null; remote: RemotePeerConnection | null }
    >
  >(new Map());
  let newUserId: string | null = null;

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
    videoElement.className = 'w-full aspect-[16/9] rounded object-cover';
    videoElement.setAttribute('autoPlay', 'true');
    videoElement.setAttribute('playsInline', 'true');

    document
      .getElementById('remote-video-container')
      ?.appendChild(videoElement);
    return videoElement;
  };

  const createStartScreenVideoElement = (id: string) => {
    const videoElement = document.createElement('video');
    videoElement.id = id;
    videoElement.className = 'w-full aspect-[16/9] rounded object-cover';
    videoElement.setAttribute('autoPlay', 'true');
    videoElement.setAttribute('playsInline', 'true');

    document.getElementById('mentor-screen-video')?.appendChild(videoElement);
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

  const handleLocalPeer = async (
    userId: string,
    remoteId?: string,
    connectionFailureId?: string
  ) => {
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
      remoteId,
      connectionFailureId
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
          pcListMap.forEach(({ local, remote }) => {
            local?.close();
            remote?.close();
          });
          pcListMap.clear();
          router.replace(`/classrooms/${lectureId}/review`);
        }
      });

      subscribe(SIGNALING_SUBSCRIBE_URL(classroomId), async (message) => {
        const { peerId, remoteId, connectionFailureId, description } =
          JSON.parse(JSON.parse(message.body));
        if (description.type === 'offer') {
          let remotePeerConnection = pcListMap.get(peerId)?.remote;

          if (remoteId) {
            if (remoteId === userId || remoteId === newUserId) {
              if (connectionFailureId) {
                pcListMap.get(connectionFailureId)?.remote?.close();
                pcListMap.delete(connectionFailureId);
                const element = document.getElementById(connectionFailureId);
                if (element instanceof HTMLVideoElement && element.parentNode) {
                  element.parentNode.removeChild(element);
                }
              }
              if (!remotePeerConnection) {
                if (!pcListMap.has(peerId)) {
                  remotePeerConnection = initializePeerConnection(
                    peerId,
                    false
                  ) as RemotePeerConnection;

                  if (String(peerId).includes('screen')) {
                    remotePeerConnection.addRemoteTrack(
                      createStartScreenVideoElement(peerId)
                    );
                  } else {
                    remotePeerConnection.addRemoteTrack(
                      createVideoElement(`video-${peerId}`)
                    );
                    newUserId = peerId;
                  }
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
          console.log(localPeerConnection);
          if (!localPeerConnection) {
            return;
          }

          if (localPeerConnection.remotePeerId) {
            if (localPeerConnection.remotePeerId !== remoteId) {
              const newLocalPeerId = uuidv4();
              await handleLocalPeer(newLocalPeerId, remoteId, peerId);
            }
            return;
          }

          localPeerConnection.setRemoteId = remoteId;

          if (mentorId) {
            if (remoteId === mentorId) {
              moveToMentorContainer(peerId);
            }
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
        audio: false,
      });

      const screenPeerIds: string[] = [];

      for (const [key, { remote }] of pcListMap) {
        if (!remote || !remote.remotePeerId) continue;

        const screenPeerId = `${remote.remotePeerId}-screen`;
        if (pcListMap.has(screenPeerId)) continue;

        const iceServers = [{ urls: 'stun:hanahakhoe.shop:3478' }];
        const localPeerConnection = new LocalPeerConnection();
        localPeerConnection.initPeerConnection({ iceServers });
        localPeerConnection.addLocalTrack(screenStream);
        setupIceCandidateHandling(localPeerConnection, screenPeerId);
        const videoElement = document.createElement('video');
        localPeerConnection.addRemoteTrack(videoElement);
        pcListMap.set(screenPeerId, {
          local: localPeerConnection,
          remote: null,
        });

        await localPeerConnection.sendOffer(
          (offer) => publish(SIGNALING_PUBLISH_URL(classroomId), offer),
          screenPeerId,
          remote.remotePeerId
        );

        screenPeerIds.push(screenPeerId);
      }

      const myScreenContainer = document.getElementById('my-screen-video');
      if (myScreenContainer) {
        const myScreenVideo = document.createElement('video');
        myScreenVideo.id = 'my-screen-video-element';
        myScreenVideo.srcObject = screenStream;
        myScreenVideo.autoplay = true;
        myScreenVideo.playsInline = true;
        myScreenVideo.className = 'w-full h-full rounded object-cover';

        myScreenContainer.innerHTML = '';
        myScreenContainer.appendChild(myScreenVideo);
      }

      screenStream.getVideoTracks()[0].onended = () => {
        screenStream.getTracks().forEach((track) => track.stop());

        for (const screenPeerId of screenPeerIds) {
          const videoElement = document.getElementById(screenPeerId);
          videoElement?.remove();

          const peerObj = pcListMap.get(screenPeerId);
          peerObj?.remote?.close();
          pcListMap.delete(screenPeerId);
        }

        const myScreenContainer = document.getElementById('my-screen-video');
        if (myScreenContainer) myScreenContainer.innerHTML = '';
      };
    } catch (error) {
      console.error('Screen sharing failed:', error);
    }
  };

  const closeClassroom = async (userId: string, classroomId: string) => {
    publish(ENTER_PUBLISH_URL(classroomId), { type: 'Close', key: userId });
    pcListMap.forEach(({ local, remote }) => {
      local?.close();
      remote?.close();
    });
    pcListMap.clear();
    await terminateClassroom(classroomId);
    router.replace(`/mentorings`);
  };

  return {
    subscribeEnter,
    handleLocalPeer,
    handleRemotePeer,
    closeClassroom,
    startScreenStream,
  };
};

export default usePeerConnections;
