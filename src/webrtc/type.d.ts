export type SignalType = {
  peerId: string;
  remoteId?: string;
  description: RTCSessionDescriptionInit;
};

export type IceCandidateType = {
  peerId: string;
  candidate: RTCIceCandidateInit;
};
