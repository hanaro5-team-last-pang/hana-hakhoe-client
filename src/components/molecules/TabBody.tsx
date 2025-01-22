'use client';

import Tab from '@/components/atoms/Tab';
import clsx from 'clsx';
import { JSX, useState } from 'react';

interface TabItem {
  tabTitle: string;
  tabOnClickEvent?: () => void;
}

interface TabBodyProps {
  tabList: TabItem[];
  tabPanelList: JSX.Element[];
  activeText?: string;
}

export default function TabBody({
  tabList,
  tabPanelList,
  activeText = 'text-hanaGreen font-bold',
}: TabBodyProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0); // 현재 선택된 탭 인덱스

  // 탭 클릭 핸들러
  const handleTabClick = (index: number) => {
    setSelectedIndex(index);
    if (tabList[index].tabOnClickEvent) {
      tabList[index].tabOnClickEvent();
    }
  };

  return (
    <div className="py-6">
      <Tab
        tabList={tabList.map((item, index) => ({
          ...item,
          tabListClassName: clsx(
            'flex-1 border border-gray-300 text-center py-2',
            {
              'rounded-tl-lg': index === 0, // 첫 번째 탭일때 왼쪽 모서리 라운드
              'rounded-tr-lg': index === tabList.length - 1, // 마지막 탭의 오른쪽 모서리 라운드
              'bg-gray-100': selectedIndex === index, // 선택된 탭 배경색 설정
              [activeText]: selectedIndex === index, // 선택된 탭의 글자색 설정
            }
          ),
          tabOnClickEvent: () => handleTabClick(index),
        }))}
        tabPanelList={tabPanelList.map((item, index) => (
          <div
            className={clsx('border border-gray-300 rounded-b-lg p-4', {
              'bg-gray-100': selectedIndex === index, // 선택된 패널 배경색 설정
            })}
          >
            {item}
          </div>
        ))}
        tabPanelClassName="bg-white rounded-lg shadow-md"
      />
    </div>
  );
}
