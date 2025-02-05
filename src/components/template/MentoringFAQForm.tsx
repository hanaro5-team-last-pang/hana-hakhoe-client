'use client';

import { getLectureFaqs, postFaq } from '@/app/(main)/mentorings/actions';
import { FaqResponseType } from '@/app/(main)/mentorings/type';
import Button from '@/components/atoms/Button';
import FAQList from '@/components/organisms/FAQList';
import { useActionState, useEffect, useState } from 'react';

interface Props {
  lectureId: number;
}

export default function MentoringFAQForm(props: Props) {
  const { lectureId } = props;
  const [faq, setFaq] = useState<FaqResponseType[]>([]);
  const [state, formAction] = useActionState(postFaq, {
    value: {
      lectureId,
      content: '',
    },
    message: '',
    isError: false,
  });

  useEffect(() => {
    const loadFaq = async () => {
      const lectureFaqs = await getLectureFaqs(lectureId);
      setFaq(lectureFaqs);
    };
    loadFaq().then();
  }, []);

  return (
    <div className="p-10 w-full">
      <h2 className="text-2xl font-bold mb-4">전체 FAQs</h2>
      <h1 className="mb-4"> 자주 묻는 질문 </h1>
      <div className="px-5"></div>
      <FAQList faqs={faq} />
      <div>
        <h3 className="text-lg font-semibold mb-4">질문 작성하기</h3>
        <div className="mb-2">
          답변이 등록되면 입력하신 이메일로 알려드립니다.
        </div>
        <form action={formAction} className="flex flex-col items-start gap-y-1">
          <textarea
            placeholder="질문을 입력하세요"
            name="content"
            defaultValue={state.value.content}
            className="border border-gray-300 rounded-md w-full p-2"
            rows={3}
          />
          {state.message && (
            <p
              className={`${state.isError ? 'text-red-500' : 'text-green-500'} font-extrabold text-sm`}
            >
              {state.message}
            </p>
          )}
          <Button
            text="질문 등록하기"
            type="submit"
            className="bg-ourOrange text-white rounded-full px-4 py-2"
          />
        </form>
      </div>
    </div>
  );
}
