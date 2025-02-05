'use client';

import Dropdown from '@/components/atoms/Dropdown';
import { CiBellOn } from 'react-icons/ci';
import { CiCalendarDate } from 'react-icons/ci';
import { PiChalkboardTeacherDuotone } from 'react-icons/pi';

interface AlarmDropdownProps {
  alarmTitle: string[]; // 드롭다운 항목들
  lectureTitle: string;
  lectureTime: string;
  comboboxClassName?: string; // 드롭다운 컴포넌트 전체에 적용될 클래스
  optionClassName?: string; // 각 옵션에 적용될 클래스
}

export default function AlarmDropdown({
  alarmTitle,
  lectureTitle,
  lectureTime,
}: AlarmDropdownProps) {
  const menuItems = alarmTitle.map((title, index) => {
    return title === 'start' ? (
      <div>
        {index !== 0 && <hr className="border-t border-gray-300" />}
        <button
          onClick={() => console.log(1)}
          className="w-full h-full text-left mt-2"
        >
          <div className="drop-shadow text-xs mb-2">멘토링 5분 전입니다.</div>
          <div className="flex text-xs">
            <PiChalkboardTeacherDuotone size="24" />
            <div className="mt-1">멘토링 : {lectureTitle}</div>
          </div>
          <div className="flex text-xs">
            <CiCalendarDate size="24" />
            <div className="mt-1">멘토링 시간 : {lectureTime}</div>
          </div>
        </button>
      </div>
    ) : (
      <div>
        {index !== 0 && <hr className="border-t border-gray-300" />}
        <button
          className="w-full h-full text-left mt-2"
          onClick={() => {
            console.log(2);
          }}
        >
          <div className="drop-shadow text-xs mb-2">
            멘토가 멘토링 내용을 변경하였습니다.
          </div>
          <div className="flex text-xs">
            <PiChalkboardTeacherDuotone size="24" />
            <div className="mt-1">멘토링 : {lectureTitle}</div>
          </div>
        </button>
      </div>
    );
  });
  return (
    <Dropdown
      menuButton={<CiBellOn size={24} />}
      menuItems={menuItems}
      anchor="bottom end"
      menuItemsClassName="bg-white rounded-lg drop-shadow scrollbar-hide border border-gray-200 px-2 z-30"
    />
  );
}
