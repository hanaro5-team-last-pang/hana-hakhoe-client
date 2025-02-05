import TabBody from '@/components/molecules/TabBody';
import { Meta, StoryObj } from '@storybook/react';

// 메타 데이터 설정
const meta: Meta<typeof TabBody> = {
  title: 'Components/Molecules/TabBody',
  component: TabBody,
  tags: ['autodocs'],
};

export default meta;

const Template: StoryObj<typeof TabBody> = {
  render: (args) => <TabBody {...args} />,
};

export const Default: StoryObj<typeof TabBody> = {
  ...Template,
  args: {
    tabList: [
      {
        tabTitle: '교육생',
        tabOnClickEvent: () => console.log('교육생 탭 클릭됨'),
      },
      {
        tabTitle: '멘토',
        tabOnClickEvent: () => console.log('멘토 탭 클릭됨'),
      },
    ],
    tabPanelList: [
      <div>교육생 회원가입 폼이 여기에 들어갑니다.</div>,
      <div>멘토 회원가입 폼이 들어갑니다.</div>,
    ],
  },
};

export const MentoringMenuTab: StoryObj<typeof TabBody> = {
  ...Template,
  args: {
    tabList: [
      {
        tabTitle: '멘토링 설명',
        tabOnClickEvent: () => console.log('멘토링 설명 탭 클릭됨'),
      },
      {
        tabTitle: '멘토 소개',
        tabOnClickEvent: () => console.log('멘토 소개 탭 클릭됨'),
      },
      {
        tabTitle: '멘토링 리뷰',
        tabOnClickEvent: () => console.log('멘토링 리뷰 탭 클릭됨'),
      },
      {
        tabTitle: 'FAQs',
        tabOnClickEvent: () => console.log('FAQs 탭 클릭됨'),
      },
    ],
    tabPanelList: [
      <div>멘토링에 대한 상세한 설명이 여기에 들어갑니다.</div>,
      <div>멘토 소개 내용이 여기에 들어갑니다.</div>,
      <div>멘토링 리뷰가 여기에 들어갑니다.</div>,
      <div>자주 묻는 질문이 여기에 들어갑니다.</div>,
    ],
    activeText: 'text-ourOrange font-bold',
  },
};
