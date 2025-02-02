'use client';

import Checkbox from '@/components/atoms/Checkbox';

interface CheckboxItem {
  id: number;
  label: string;
}

interface CheckboxListProps {
  items: CheckboxItem[];
  className?: string;
  textClassName?: string;
  selectedTags: number[]; // 선택된 태그 배열
  onChange: (selected: number[]) => void; // 선택된 태그 변경 핸들러
}

export default function CheckboxList({
  items,
  className,
  textClassName,
  selectedTags,
  onChange,
}: CheckboxListProps) {
  // 각 체크박스의 상태를 관리하는 useState 훅
  const handleCheckboxChange = (id: number) => {
    const newSelectedTags = selectedTags.includes(id)
      ? selectedTags.filter((tag) => tag !== id)
      : [...selectedTags, id];

    onChange(newSelectedTags);
  };

  return (
    <div>
      <div className={`flex ${className}`}>
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between mb-2">
            <Checkbox
              checked={selectedTags.includes(item.id)} // 체크 상태
              setChecked={() => handleCheckboxChange(item.id)}
              text={item.label}
              className="data-[checked]:bg-ourGreen"
              textClassName={`${textClassName}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
