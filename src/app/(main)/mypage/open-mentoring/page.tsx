'use client';

import OpenMentoringForm from '@/components/template/OpenMentoringForm';
import { useAuth } from '@/context/AuthContext';

export default function Page() {
  // TODO: 나중에 전역 관리해야 함

  const { name } = useAuth();

  return (
    <div>
      <p className="text-2xl font-bold p-3 text-center text-ourGreen">
        {name} 멘토님, 멘토링 개설을 시작하세요!
      </p>
      <OpenMentoringForm />
    </div>
  );
}
