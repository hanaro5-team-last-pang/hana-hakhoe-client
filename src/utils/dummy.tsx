// 더미 데이터
import { FaChalkboardTeacher } from 'react-icons/fa';
import {
  FaBook,
  FaClipboardList,
  FaGraduationCap,
  FaUsers,
} from 'react-icons/fa6';

export const iconButtonData = [
  {
    icon: <FaBook />,
    label: '디지털 교육',
    count: 38,
    route: '/digital-education',
  },
  {
    icon: <FaGraduationCap />,
    label: '은퇴 설계',
    count: 28,
    route: '/exercise-design',
  },
  {
    icon: <FaChalkboardTeacher />,
    label: '주식 · 투자',
    count: 42,
    route: '/stock-investment',
  },
  {
    icon: <FaClipboardList />,
    label: '대출',
    count: 22,
    route: '/performance-management',
  },
  {
    icon: <FaUsers />,
    label: '상속',
    count: 15,
    route: '/mentoring',
  },
];

export const cardData = [
  {
    id: '1',
    title: '멘토링 프로그램 1',
    imageSrc: '/img_landing.png',
    mentor_name: '멘토 1',
    start_time: '2023-01-20',
    duration: 2,
    participants: 5,
    max_participants: 10,
    category: '디지털 교육',
    badgeClassName: 'bg-green-400',
  },
  {
    id: '2',
    title: '멘토링 프로그램 2',
    imageSrc: '/img_landing.png',
    mentor_name: '멘토 2',
    start_time: '2023-01-21',
    duration: 3,
    participants: 2,
    max_participants: 8,
    category: '은퇴 설계',
    badgeClassName: 'bg-yellow-400',
  },
  {
    id: '3',
    title: '멘토링 프로그램 3',
    imageSrc: '/img_landing.png',
    mentor_name: '멘토 3',
    start_time: '2023-01-22',
    duration: 1,
    participants: 4,
    max_participants: 6,
    category: '주식 투자',
    badgeClassName: 'bg-blue-400',
  },
  {
    id: '4',
    title: '멘토링 프로그램 4',
    imageSrc: '/img_landing.png',
    mentor_name: '멘토 4',
    start_time: '2023-01-23',
    duration: 2,
    participants: 3,
    max_participants: 10,
    category: '상속',
    badgeClassName: 'bg-red-400',
  },
  {
    id: '5',
    title: '멘토링 프로그램 5',
    imageSrc: '/img_landing.png',
    mentor_name: '멘토 5',
    start_time: '2023-01-24',
    duration: 4,
    participants: 1,
    max_participants: 5,
    category: '멘토링',
    badgeClassName: 'bg-purple-400',
  },
  {
    id: '6',
    title: '멘토링 프로그램 6',
    imageSrc: '/img_landing.png',
    mentor_name: '멘토 6',
    start_time: '2023-01-25',
    duration: 3,
    participants: 2,
    max_participants: 8,
    category: '기타',
    badgeClassName: 'bg-pink-400',
  },
];

export const newsData = [
  {
    id: '1',
    title: '뉴스 1',
    description: '1번 설명입니다.',
    imageSrc: '/img_landing.png',
    date: '2023-01-20',
  },
  {
    id: '2',
    title: '뉴스 2',
    description: '2번 설명입니다.',
    imageSrc: '/img_landing.png',
    date: '2023-01-20',
  },
  {
    id: '3',
    title: '뉴스 3',
    description: '3번 설명입니다.',
    imageSrc: '/img_landing.png',
    date: '2023-01-20',
  },
  {
    id: '4',
    title: '뉴스 4',
    description: '4번 설명입니다.',
    imageSrc: '/img_landing.png',
    date: '2023-01-20',
  },
  {
    id: '5',
    title: '뉴스 5',
    description: '5번 설명입니다.',
    imageSrc: '/img_landing.png',
    date: '2023-01-20',
  },
  {
    id: '6',
    title: '뉴스 6',
    description: '6번 설명입니다.',
    imageSrc: '/img_landing.png',
    date: '2023-01-20',
  },
];

export const category = [
  { id: 1, label: '금융 상품' },
  { id: 2, label: '디지털 교육' },
  { id: 3, label: '부동산' },
  { id: 4, label: '투자' },
  { id: 5, label: '상속' },
  { id: 6, label: '은퇴 설계' },
];

export const age_category = [
  { id: 1, label: '10대' },
  { id: 2, label: '20대' },
  { id: 3, label: '30대' },
  { id: 4, label: '40대' },
  { id: 5, label: '50대' },
];

export const commentsData = [
  {
    profileImage: '/img_landing.png',
    userName: '내 꿈은 적금왕',
    lectureName: '하나은행 20년 경력 JII 멘토의 노하우',
    comment:
      '다음 강의가 너무 기대되지는 이번 강이었습니다. 사실 항상 그랬지만 이번 강의는 더더욱 JII 멘토님의 큰 그림을 느낄 수 있는 강의였습니다.',
    createAt: '2024년 11월 12일',
  },
  {
    profileImage: '/img_landing.png',
    userName: '김상현',
    lectureName: 'JJI멘토와 함께하는 은빛 설계',
    comment:
      '현업 개발자로서도 자바를 포함해 영한님의 바이브 또한 배울 수 있어 멘토링을 통해 많은 도움을 받았습니다.',
    createAt: '2024년 11월 10일',
  },
  {
    profileImage: '/img_landing.png',
    userName: '양지은',
    lectureName: 'JJI멘토와 함께하는 은빛 설계',
    comment: '굿',
    createAt: '2024년 11월 10일',
  },
];

export const reviews_percent = [
  { stars: 5, percentage: 90 },
  { stars: 4, percentage: 5 },
  { stars: 3, percentage: 2 },
  { stars: 2, percentage: 2 },
  { stars: 1, percentage: 1 },
];

// 예시 데이터
export const faqData = [
  [
    {
      profileImage: '/img_landing.png',
      userName: '내 꿈은 적금왕',
      comment: '다음 강의가 일정이 궁금합니다?',
      createAt: '2024년 12월 12일',
    },
    {
      profileImage: '/img_landing.png',
      userName: '나는 멘토',
      comment:
        '실시간 강의와 녹화 강의가 혼합되어 진행됩니다. 질문은 실시간으로 가능합니다.',
      createAt: '2024년 12월 15일',
    },
  ],
  [
    {
      profileImage: '/img_landing.png',
      userName: '이영희',
      comment: '수업은 어떤 방식으로 진행되나요?',
      createAt: '2024년 12월 22일',
    },
  ],
  [
    {
      profileImage: '/img_landing.png',
      userName: '박지민',
      comment: '강의 자료는 어떻게 받을 수 있나요?',
      createAt: '2024년 12월 24일',
    },
    {
      profileImage: '/img_landing.png',
      userName: '멘토링 팀',
      comment: '강의 자료는 강의 시작 전에 이메일로 발송됩니다.',
      createAt: '2024년 12월 25일',
    },
  ],
  [
    {
      profileImage: '/img_landing.png',
      userName: '1',
      comment: '다음 강의가 일정이 궁금합니다?',
      createAt: '2024년 12월 12일',
    },
    {
      profileImage: '/img_landing.png',
      userName: '나는 멘토다',
      comment:
        '실시간 강의와 녹화 강의가 혼합되어 진행됩니다. 질문은 실시간으로 가능합니다.',
      createAt: '2024년 12월 15일',
    },
  ],
  [
    {
      profileImage: '/img_landing.png',
      userName: '2',
      comment: '다음 강의가 일정이 궁금합니다?',
      createAt: '2024년 12월 12일',
    },
    {
      profileImage: '/img_landing.png',
      userName: '3',
      comment:
        '실시간 강의와 녹화 강의가 혼합되어 진행됩니다. 질문은 실시간으로 가능합니다.',
      createAt: '2024년 12월 15일',
    },
  ],
];
