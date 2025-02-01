'use client';

import { menteeSignUp, sendEmail } from '@/app/(auth)/action';
import Button from '@/components/atoms/Button';
import IconBadge from '@/components/atoms/IconBadge';
import Input from '@/components/atoms/Input';
import { AiFillEye } from 'react-icons/ai';
import { MdArrowOutward } from 'react-icons/md';
import Link from 'next/link';
import { useActionState, useState, useRef } from 'react';

export default function MenteeSignUpForm() {
  //멘티 회원가입 폼 액션
  const [state, formAction] = useActionState(menteeSignUp, {
    value: {
      email: '',
      name: '',
      password: '',
      confirmedPassword: '',
      birth: '',
    },
    message: '멘티 회원가입 이전',
    isError: false,
  });

  // 이메일 인증에 필요한 value
  const emailRef = useRef<HTMLInputElement>(null);
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [hide, setHide] = useState(false);

  const onToggleHide = () => {
    setHide((prev) => {
      let newHide = prev;
      newHide = !newHide;
      return newHide;
    });
  };

  const handleSendEmail = async () => {
    if (emailRef.current) {
      const email = emailRef.current.value;
      const response = await sendEmail(email);
      setResponseMessage(response.message);
      if (response.isError) {
        setResponseMessage('유효한 이메일을 입력하세요');
      }
    }
  };

  return (
    <form
      className="my-4 grid grid-cols-1 gap-3 h-[375px] overflow-y-auto scrollbar-hide"
      action={formAction}
    >
      <Input
        name="name"
        label="이름"
        placeholder="이름을 입력해주세요."
        defaultValue={state.value.name}
        className="my-2 text-gray-400"
        labelClassName="font-bold"
      />
      <Input
        name="email"
        label="이메일"
        placeholder="이메일 주소를 입력하세요."
        defaultValue={state.value.email}
        className="my-2 text-gray-400 bg-white h-[42px]"
        labelClassName="font-bold"
        ref={emailRef}
      >
        <Button
          type="button"
          text="인증"
          onClick={handleSendEmail}
          className="bg-ourGreen text-xs px-4 py-2 rounded-xl whitespace-nowrap text-white"
        />
      </Input>
      <div>
        {/* 응답 메시지  : Toast로 바꾸기*/}
        {responseMessage && <p className="text-hanaGreen">{responseMessage}</p>}
      </div>
      <Input
        name="password"
        label="비밀번호"
        placeholder="비밀번호를 입력하세요."
        defaultValue={state.value.password}
        type={hide ? 'text' : 'password'}
        className="my-2 text-gray-400 bg-white"
        labelClassName="font-bold"
      >
        <AiFillEye className="cursor-pointer" onClick={onToggleHide} />
      </Input>
      <Input
        name="confirmedPassword"
        label="비밀번호 확인"
        placeholder="비밀번호를 다시 한 번 입력하세요."
        defaultValue={state.value.confirmedPassword}
        type={hide ? 'text' : 'password'}
        className="my-2 text-gray-400 bg-white"
        labelClassName="font-bold"
      >
        <AiFillEye className="cursor-pointer" onClick={onToggleHide} />
      </Input>
      <Input
        name="birth"
        label="생년월일"
        placeholder=""
        defaultValue={state.value.birth}
        type="date"
        className="my-2 text-gray-400"
        labelClassName="font-bold"
      />
      <Button
        type="submit"
        text="회원가입"
        className="w-full h-full bg-ourGreen mt-2 px-4 py-2 rounded-xl flex justify-center items-center gap-2 transition text-white font-bold"
      />
      <div className="flex justify-center gap-2 my-2">
        <div className="text-xs text-gray-600">
          이미 하나학회의 회원이신가요?
        </div>
        <Link href="/login">
          <IconBadge
            reverse={true}
            icon={<MdArrowOutward />}
            text="로그인"
            gapLength="1"
            textClassName="text-xs text-ourGreen"
            iconClassName="text-sm text-ourGreen"
          />
        </Link>
      </div>
    </form>
  );
}
