export const BASE_URL = 'http://localhost:8080';
//export const BASE_URL =
//  'http://ec2-54-180-148-79.ap-northeast-2.compute.amazonaws.com';

export const BASE_HEADERS: HeadersInit = {
  'Content-type': 'application/json',
};

// export const STOMP_BROKER_URL = 'ws://ws.hanahakhoe.shop/classroom';
export const STOMP_BROKER_URL = 'ws://localhost:8081/classroom';

export const CHAT_SUBSCRIBE_URL = (classroomId: bigint) =>
  `/topic/chat/${classroomId}`;
export const CHAT_PUBLISH_URL = (classroomId: bigint) =>
  `/app/chat/${classroomId}`;

export const SIGNALING_SUBSCRIBE_URL = (classroomId: bigint) =>
  `/topic/signaling/${classroomId}`;
export const SIGNALING_PUBLISH_URL = (classroomId: bigint) =>
  `/app/signaling/${classroomId}`;

export const ANSWER_SUBSCRIBE_URL = (classroomId: bigint) =>
  `/topic/answer/${classroomId}`;
export const ANSWER_PUBLISH_URL = (classroomId: bigint) =>
  `/app/answer/${classroomId}`;

export const TRICKLE_SUBSCRIBE_URL = (classroomId: bigint) =>
  `/topic/trickle/${classroomId}`;
export const TRICKLE_PUBLISH_URL = (classroomId: bigint) =>
  `/app/trickle/${classroomId}`;

export const ENTER_SUBSCRIBE_URL = (classroomId: bigint) =>
  `/topic/enter/${classroomId}`;
export const ENTER_PUBLISH_URL = (classroomId: bigint) =>
  `/app/enter/${classroomId}`;
