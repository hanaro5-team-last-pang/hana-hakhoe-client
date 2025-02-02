export type MentoringResponseType = {
  lectureList: {
    notStarted: lectureValueType[];
    ableToStart: lectureValueType[];
    done: lectureValueType[];
  };
};

type lectureValueType = {
  lectureId: number;
  title: string;
  isCanceled: boolean;
  isDone: boolean;
  ableToStart: boolean;
  startTime: string;
  endTime: string;
};

export type MentoringTableType = {
  title: string;
  start_date: string;
  status: string;
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
  detail_info: InfoType[];
};

export type ProfileRequestType = {
  shortIntroduction: string;
  simpleInfo: InfoType[];
  detailInfo: InfoType[];
};
