'use client';

import { getProfile, ModifyProfile } from '@/app/(main)/mypage/actions';
import {
  ProfileRequestType,
  ProfileResponseType,
} from '@/app/(main)/mypage/type';
import Button from '@/components/atoms/Button';
import MyCardCareerForm from '@/components/template/MyCardCareerForm';
import MyCardIntroductionForm from '@/components/template/MyCardIntroductionForm';
import MyCardProfileForm from '@/components/template/MyCardProfileForm';
import { DEFAULT_PROFILE_URL } from '@/constant';
import { useAuthStore } from '@/context/AuthContext';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa6';
import { RiPencilFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { startTransition, useActionState, useEffect, useState } from 'react';

export default function Page() {
  const { auth, loading } = useAuthStore((state) => state);
  const mentoName = auth ? auth.name : '';
  const userImage = auth ? auth.profileImage : DEFAULT_PROFILE_URL;
  const [modifyMode, setModifyMode] = useState(false);
  const [profileData, setProfileData] = useState<ProfileResponseType | null>(
    null
  );
  const [, formAction] = useActionState(ModifyProfile, {
    value: {
      shortIntroduction: '',
      simpleInfo: [],
      detailInfo: [],
    },
    message: '명함 수정',
    isError: false,
  });

  // 상태 설정
  const [oneLineIntroduction, setOneLineIntroduction] =
    useState<string>('한 줄 소개를 입력하세요');
  const [newOneLineIntroduction, setNewOneLineIntroduction] =
    useState<string>(oneLineIntroduction);
  const [simpleInfo, setSimpleInfo] = useState<
    { key: string; value: string }[]
  >([]);

  const [introduction, setIntroduction] = useState<string>('');
  const [newIntroduction, setNewIntroduction] = useState<string>(introduction);
  const [career, setCareer] = useState<string>('');
  const [newCareer, setNewCareer] = useState<string>(career);
  const [showNewImage, setShowNewImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

  const handleModifyMode = () => {
    setModifyMode(true);
  };

  const handleCancelNewData = () => {
    setNewOneLineIntroduction(oneLineIntroduction);
    setNewIntroduction(introduction);
    setNewCareer(career);
    setShowNewImage(null);
    setModifyMode(false);
  };

  const handleSubmitNewData = async () => {
    const value: ProfileRequestType = {
      shortIntroduction: newOneLineIntroduction,
      simpleInfo: simpleInfo,
      detailInfo: [
        { key: '소개', value: newIntroduction },
        { key: '이력', value: newCareer },
      ],
    };

    startTransition(async () => {
      try {
        await formAction(value);
        toast.success('명함 수정을 완료했습니다.');
      } catch {
        toast.error('명함 수정에 실패했습니다.');
      }
    });

    // 서버 응답 처리 후 상태 업데이트
    setOneLineIntroduction(newOneLineIntroduction);
    setIntroduction(newIntroduction);
    setCareer(newCareer);
    setModifyMode(false);
  };

  // 프로필 데이터 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getProfile();
      setProfileData(profile);

      if (profile.short_introduction) {
        setOneLineIntroduction(profile.short_introduction);
        setNewOneLineIntroduction(profile.short_introduction);
      }
      if (profile.detail_info) {
        const introductionValue =
          profile.detail_info[0]?.value || '자신의 소개에 대해 입력하세요';
        const careerValue =
          profile.detail_info[1]?.value || '자신의 이력에 대해 입력하세요';

        setNewIntroduction(introductionValue);
        setIntroduction(introductionValue);
        setNewCareer(careerValue);
        setCareer(careerValue);
      }
      if (profile.simple_info) {
        setSimpleInfo(profile.simple_info || []);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="p-4 relative">
      {!modifyMode ? (
        <button
          type="button"
          className="absolute right-0 mx-9 text-ourGreen text-sm"
          onClick={handleModifyMode}
        >
          <RiPencilFill className="text-lg" />
        </button>
      ) : (
        <div className="absolute right-0 flex mx-9 gap-2">
          <Button
            type="button"
            text="취소"
            onClick={handleCancelNewData}
            className="rounded-full bg-white shadow-md text-gray-400 text-sm font-medium px-4 py-2"
          />
          <Button
            type="button"
            text="제출"
            onClick={handleSubmitNewData}
            className="rounded-full bg-ourOrange text-white text-sm font-medium px-4 py-2 shadow-md"
          />
        </div>
      )}
      <div className="text-center text-2xl font-bold text-ourGreen">
        {loading ? (
          <div className="animate-pulse">
            <div className=" h-8 w-10bg-gray-200"></div>
          </div>
        ) : (
          mentoName
        )}{' '}
        멘토
      </div>
      <div className="my-10 mx-5 flex justify-center items-center">
        <div className="text-3xl text-ourGreen">
          <FaQuoteLeft />
        </div>
        {modifyMode ? (
          <input
            className="text-xl w-full px-2 text-center align-middle outline outline-2 outline-blue-400 focus:outline-2 focus:outline-blue-400"
            value={newOneLineIntroduction}
            onChange={(e) => setNewOneLineIntroduction(e.target.value)}
          />
        ) : (
          <div className="text-xl w-full px-2 text-center">
            {oneLineIntroduction}
          </div>
        )}
        <div className="text-3xl text-ourGreen">
          <FaQuoteRight />
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div className="flex justify-center">
          <MyCardProfileForm
            userImage={userImage}
            modifyMode={modifyMode}
            setNewImage={setNewImage}
            showNewImage={showNewImage!}
            setShowNewImage={setShowNewImage}
            simpleInfo={simpleInfo} // simple_info 전달
            setSimpleInfo={setSimpleInfo}
          />
        </div>
        <MyCardIntroductionForm
          modifyMode={modifyMode}
          introduction={introduction}
          newIntroduction={newIntroduction}
          setNewIntroduction={setNewIntroduction}
        />
      </div>

      <MyCardCareerForm
        modifyMode={modifyMode}
        career={career}
        newCareer={newCareer}
        setNewCareer={setNewCareer}
      />
    </div>
  );
}
