'use client';

import { changeProfileForm } from '@/app/action';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { useAuthStore } from '@/context/AuthContext';
import { AiFillEye } from 'react-icons/ai';
import { toast } from 'react-toastify';
import Image from 'next/image';
import {
  ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';

export default function Page() {
  const { auth, loading, fetchAuth } = useAuthStore((state) => state);
  const [hide, setHide] = useState(false);
  const birthDateRef = useRef('2024년 10월 10일');
  const [showNewImage, setShowNewImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [state, formAction] = useActionState(changeProfileForm, {
    value: {
      newImage: newImage,
      currentPassword: '',
      newPassword: '',
      newConfirmedPassword: '',
    },
    message: '',
    isError: false,
  });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setShowNewImage(reader.result as string);
        setNewImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const onToggleHide = () => {
    setHide((prev) => {
      let newHide = prev;
      newHide = !newHide;
      return newHide;
    });
  };

  useEffect(() => {
    if (state.isError && state.message) {
      toast.warning(state.message);
    } else if (!state.isError && state.message) {
      toast.info(state.message);
      fetchAuth();
    }
  }, [state]);

  return (
    <form
      className="flex flex-col justify-center items-center"
      action={formAction}
    >
      <div className="text-xl font-bold my-4">프로필 변경</div>
      <div className="relative w-64 h-64 my-4">
        <label htmlFor="profile-image-upload" className="cursor-pointer">
          {loading || !auth ? (
            <div className="animate-pulse w-full h-full">
              <div className="w-full h-full bg-gray-200 rounded-full"></div>
            </div>
          ) : (
            <Image
              className="rounded-full object-cover"
              src={showNewImage ?? auth.profileImage}
              alt="Profile Image"
              fill
            />
          )}
        </label>
        <input
          id="profile-image-upload"
          name="profile-image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      {loading || !auth ? (
        <div className="animate-pulse flex items-center gap-y-1 flex-col">
          <div className="w-11 h-6 bg-gray-200 rounded"></div>
          <div className="w-32 h-6 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <>
          <div>{auth.name}</div>
          <div>{birthDateRef.current}</div>
        </>
      )}
      <hr className="border-t border-gray-300" />
      <div className="my-6 grid grid-rows-3 gap-3 w-96">
        <Input
          name="currentPassword"
          label="현재 비밀번호"
          placeholder="현재 비밀번호를 입력하세요."
          defaultValue={state.value.currentPassword ?? undefined}
          type={hide ? 'text' : 'password'}
          className="my-2 text-gray-400 bg-white"
        >
          <AiFillEye className="cursor-pointer" onClick={onToggleHide} />
        </Input>
        <Input
          name="newPassword"
          label="새 비밀번호"
          placeholder="새 비밀번호를 입력하세요."
          defaultValue={state.value.newPassword ?? undefined}
          type={hide ? 'text' : 'password'}
          className="my-2 text-gray-400 bg-white"
        >
          <AiFillEye className="cursor-pointer" onClick={onToggleHide} />
        </Input>
        <Input
          name="newConfirmedPassword"
          label="새 비밀번호 확인"
          placeholder="새 비밀번호를 다시 한 번 입력하세요."
          defaultValue={state.value.newConfirmedPassword ?? undefined}
          type={hide ? 'text' : 'password'}
          className="my-2 text-gray-400 bg-white"
        >
          <AiFillEye className="cursor-pointer" onClick={onToggleHide} />
        </Input>
        <Button
          type="submit"
          text="제출"
          className="w-full h-full bg-hanaGreen80 px-4 py-2 rounded-xl flex justify-center items-center gap-2 transition text-white"
        />
      </div>
    </form>
  );
}
