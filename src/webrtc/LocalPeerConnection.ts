import { IceCandidateType, SignalType } from '@/webrtc/type';

/**
 * 로컬 피어 연결 클래스
 * @author magae1
 */
export default class LocalPeerConnection {
  private _remotePeerId: string | undefined;
  public _pConn: RTCPeerConnection | null = null;

  public initPeerConnection(config?: RTCConfiguration) {
    this._pConn = new RTCPeerConnection(config);
  }

  public async receiveAnswerCallback(answer: RTCSessionDescriptionInit) {
    if (!this._pConn) {
      throw new Error('로컬 연결을 찾을 수 없습니다.');
    }
    await this._pConn.setRemoteDescription(new RTCSessionDescription(answer));
  }

  public async sendOffer(sendFn: (text: string) => void, localPeerId: string) {
    if (!this._pConn) {
      throw new Error('로컬 연결을 찾을 수 없습니다.');
    }
    try {
      const offer = await this._pConn.createOffer();
      await this._pConn.setLocalDescription(offer);
      const offerSignal: SignalType = {
        peerId: localPeerId,
        description: offer,
      };
      sendFn(JSON.stringify(offerSignal));
    } catch (error) {
      console.error('Offer 생성 또는 전송 중 오류 발생:', error);
      throw error;
    }
  }

  public addIceCandidateCallback(
    sendFn: (text: string) => void,
    localPeerId: string
  ) {
    if (!this._pConn) {
      throw new Error('로컬 연결을 찾을 수 없습니다.');
    }
    this._pConn.addEventListener('icecandidate', (e) => {
      if (e.candidate) {
        const iceCandidate: IceCandidateType = {
          peerId: localPeerId,
          candidate: e.candidate,
        };
        sendFn(JSON.stringify(iceCandidate));
      }
    });
  }

  public async receiveIceCandidateCallback(candidate: RTCIceCandidate) {
    if (!this._pConn) {
      throw new Error('원격 연결을 찾을 수 없습니다.');
    }
    await this._pConn.addIceCandidate(candidate);
  }

  public addLocalTrack(localStream: MediaStream) {
    localStream.getTracks().forEach((track) => {
      this._pConn?.addTrack(track, localStream);
    });
  }

  public addRemoteTrack(videoElement: HTMLVideoElement) {
    if (!this._pConn) {
      throw new Error('원격 연결을 찾을 수 없습니다');
    }

    this._pConn.addEventListener('track', async (e) => {
      if (!videoElement.srcObject) {
        videoElement.srcObject = e.streams[0];
        await videoElement.play();
      }
    });
  }

  public close() {
    this._pConn?.close();
    this._pConn = null;
  }

  set setRemoteId(remotePeerId: string) {
    this._remotePeerId = remotePeerId;
  }

  get remotePeerId() {
    return this._remotePeerId;
  }
}
