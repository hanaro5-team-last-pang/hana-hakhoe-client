export type SignalType = {
  peerId: string;
  remoteId?: string;
  connectionFailureId?: string;
  description: RTCSessionDescriptionInit;
};

export type IceCandidateType = {
  peerId: string;
  candidate: RTCIceCandidateInit;
};
