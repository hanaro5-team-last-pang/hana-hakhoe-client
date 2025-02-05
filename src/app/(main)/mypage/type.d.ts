export type MentoringResponseType = {
  lectureList: {
    notStarted: lectureValueType[];
    ableToStart: lectureValueType[];
    done: lectureValueType[];
  };
};

type lectureValueType = {
  lectureId: number;
  classroomId: string;
  title: string;
  isCanceled: boolean;
  isDone: boolean;
  ableToStart: boolean;
  startTime: string;
  endTime: string;
};

export type MenteeMentoringResType = {
  totalCount: number;
  enrollmentList: MenteeMentoringType[];
};

export type StartClassroomResType = {
  password: string;
  lectureId: number;
  lectureTitle: string;
};

export type EnterClassroomResType = {
  password: string;
  mentorId: string;
  lectureId: number;
  lectureTitle: string;
};

export type MenteeMentoringType = {
  classroomId: string;
  lectureId: number;
  enrollmentId: number;
  mentorId: number;
  mentorName: string;
  title: string;
  startTime: string;
  endTime: string;
  isEnrollmentCanceled: boolean;
  isDone: boolean;
  isLectureCanceled: boolean;
  possibleToEnter: boolean;
};

export type MentoringTableType = {
  title: string;
  mentorName?: string;
  start_date: string;
  status: string;
  classroomId: string;
};

export type openMentoringFormType = {
  imageFile: File;
  data: {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    maxParticipants: number;
    category: string;
    tags: number[];
  };
};

export type InfoType = {
  key: string;
  value: string;
};

export type ProfileResponseType = {
  mentor_name: string;
  profileImageUrl: string;
  short_introduction: string;
  simple_info: InfoType[];
  detail_info?: InfoType[];
};

export type ProfileRequestType = {
  shortIntroduction: string;
  simpleInfo: InfoType[];
  detailInfo: InfoType[];
};
