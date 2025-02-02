'use client';

import OpenMentoringForm from '@/components/template/OpenMentoringForm';
import { useAuthStore } from '@/context/AuthContext';

export default function Page() {
  const auth = useAuthStore((state) => state.auth);

  return (
    <div>
      <p className="text-2xl font-bold p-3 text-center text-ourGreen">
        {auth?.name} 멘토님, 멘토링 개설을 시작하세요!
      </p>
      <OpenMentoringForm />
    </div>
  );
}
