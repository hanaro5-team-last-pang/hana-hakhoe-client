'use client';

import { Category } from '@/app/(main)/mentorings/type';
import Checkbox from '@/components/atoms/Checkbox';
import { useRouter, useSearchParams } from 'next/navigation';

interface CheckboxListProps {
  items: Category[];
}

export default function CheckboxList({ items }: CheckboxListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get('category') ?? '';

  const handleCheckboxChange = (category: string) => {
    router.push(`/mentorings?category=${category}`);
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.tag} className="flex items-center justify-between mb-2">
          <Checkbox
            checked={item.tag === category} // 체크 상태
            setChecked={() => handleCheckboxChange(item.tag)}
            text={item.name}
            className="data-[checked]:bg-ourGreen"
            textClassName="text-xs"
          />
        </div>
      ))}
    </div>
  );
}
