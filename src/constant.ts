export const BASE_URL = 'http://localhost:8080';
// // export const BASE_URL =
//   'http://ec2-54-180-148-79.ap-northeast-2.compute.amazonaws.com';

export const BASE_HEADERS: HeadersInit = {
  'Content-type': 'application/json',
};

export const DEFAULT_PROFILE_URL = 'https://www.gravatar.com/avatar';

export const STOMP_BROKER_URL = 'ws://ws.hanahakhoe.shop/classroom';
// export const STOMP_BROKER_URL = 'ws://localhost:8081/classroom';

export const SESSION_COOKIE_NAME = 'access';

export const CHAT_SUBSCRIBE_URL = (classroomId: string) =>
  `/topic/chat/${classroomId}`;
export const CHAT_PUBLISH_URL = (classroomId: string) =>
  `/app/chat/${classroomId}`;

export const SIGNALING_SUBSCRIBE_URL = (classroomId: string) =>
  `/topic/signaling/${classroomId}`;
export const SIGNALING_PUBLISH_URL = (classroomId: string) =>
  `/app/signaling/${classroomId}`;

export const ANSWER_SUBSCRIBE_URL = (classroomId: string) =>
  `/topic/answer/${classroomId}`;
export const ANSWER_PUBLISH_URL = (classroomId: string) =>
  `/app/answer/${classroomId}`;

export const TRICKLE_SUBSCRIBE_URL = (classroomId: string) =>
  `/topic/trickle/${classroomId}`;
export const TRICKLE_PUBLISH_URL = (classroomId: string) =>
  `/app/trickle/${classroomId}`;

export const ENTER_SUBSCRIBE_URL = (classroomId: string) =>
  `/topic/enter/${classroomId}`;
export const ENTER_PUBLISH_URL = (classroomId: string) =>
  `/app/enter/${classroomId}`;

export const BADGE_COLORS = [
  'bg-green-400',
  'bg-yellow-400',
  'bg-blue-400',
  'bg-red-400',
  'bg-purple-400',
  'bg-pink-400',
];
