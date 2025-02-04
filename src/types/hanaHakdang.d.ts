// TODO: zod 활용한 유효성 검사 및 타입 정의 용이화 필요*/
export type ActionResType<V, E> = {
  value: V;
  message: E;
  isError: boolean;
};

export type BaseResType<T> = {
  message: string;
  result: T;
};

export type AuthType = {
  userId: string;
  name: string;
  role: 'MENTOR' | 'MENTEE' | undefined;
  profileImage: string;
  birth: string;
};

export type ChatResponseType = {
  readonly userId: number;
  readonly username: string;
  readonly body: string;
  readonly timestamp: string;
};

export type ChatRequestType = {
  userId: number;
  username: string;
  lectureId: number;
  body: string;
};

export type ReducerAction<T> = {
  type: string;
  data: T;
};

export type ChangeProfileFormType = {
  newImage: File | null;
  currentPassword: string | null;
  newPassword: string | null;
  newConfirmedPassword: string | null;
};

export type ChangeProfileRequestType = {
  imageFile: File | null;
  accountData?: PasswordChangeRequestType;
};

export type PasswordChangeRequestType = {
  currentPassword: string | null;
  newPassword: string | null;
  confirmPassword: string | null;
};

export type SubmitReviewFormType = {
  ratingScore: string;
  review: string;
};

export type CardType = {
  cardColor: string;
  cardTitle: string;
  cardDescription: string;
  cardImageUrl: string;
};

export type AccountType = {
  name: string;
  birth: string;
  profileImage: string;
};

export type Jwt = {
  accessToken: string;
};

type AuthResType = {
  userId: number;
  name: string;
  role: 'MENTOR' | 'MENTEE';
  profileImageUrl?: string;
  birthDate: string;
};
