import { useCallback, useEffect, useRef, useState } from 'react';

export default function useLocalVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [curConstraints, setConstraints] = useState<MediaStreamConstraints>({
    video: true,
    audio: true,
  });

  const changeStream = async () => {
    const newStream = await navigator.mediaDevices.getUserMedia(curConstraints);
    setStream(newStream); // 상태 업데이트
  };

  const changeDevice = useCallback((device: MediaDeviceInfo) => {
    if (device.kind === 'audioinput') {
      setConstraints((prevState) => ({
        ...prevState,
        audio: {
          deviceId: device.deviceId,
        },
      }));
    } else if (device.kind === 'videoinput') {
      setConstraints((prevState) => ({
        ...prevState,
        video: {
          deviceId: device.deviceId,
        },
      }));
    }
  }, []);

  const playVideo = () => {
    if (!videoRef.current) {
      throw new Error('비디오를 찾을 수 없습니다.');
    }
    if (stream) {
      videoRef.current.muted = true;
      videoRef.current.srcObject = stream;
    }
  };

  useEffect(() => {
    changeStream();
  }, [curConstraints]);

  useEffect(() => {
    playVideo();
  }, [stream]);

  return {
    videoRef,
    stream,
    constraints: curConstraints,
    setConstraints,
    changeDevice,
  };
}
