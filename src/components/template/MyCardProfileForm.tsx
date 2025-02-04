'use client';

import { IoTrashOutline } from 'react-icons/io5';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ProfileImageProps {
  modifyMode: boolean;
  userImage: string;
  showNewImage: string;
  setShowNewImage: (showNewImage: string) => void;
  setNewImage: (newImage: File) => void;
  simpleInfo: { key: string; value: string }[]; // simple_info 추가
  setSimpleInfo: (simpleInfo: { key: string; value: string }[]) => void;
}

export default function MyCardProfileForm({
  modifyMode,
  userImage,
  showNewImage,
  setShowNewImage,
  setNewImage,
  simpleInfo,
  setSimpleInfo,
}: ProfileImageProps) {
  const [profileFormData, setProfileFormData] = useState<
    { key: string; value: string }[]
  >([]);
  const [newProfileFormData, setNewProfileFormData] = useState({
    key: '예시: 나이',
    value: '46',
  });
  const [formAddMode, setFormAddMode] = useState(false);

  useEffect(() => {
    setProfileFormData(simpleInfo);
  }, [simpleInfo]);

  const handleAddFormMode = () => {
    setFormAddMode(true);
  };

  const addFormData = () => {
    if (newProfileFormData.key && newProfileFormData.value) {
      const updatedProfileFormData = [...profileFormData, newProfileFormData];
      setProfileFormData(updatedProfileFormData);
      setSimpleInfo(updatedProfileFormData);
      setNewProfileFormData({ key: '예시: 나이', value: '46' });
    }
    setFormAddMode(false);
  };
  const deleteProfileFormData = (id: number) => {
    const updatedProfileFormData = [...profileFormData];
    updatedProfileFormData.splice(id, 1);
    setProfileFormData(updatedProfileFormData);
  };

  const cancelAddFormData = () => {
    setFormAddMode(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="flex flex-col items-center">
      {!modifyMode ? (
        <div className="relative w-64 h-64 my-4">
          <Image
            className="rounded-full object-cover"
            src={showNewImage || userImage}
            alt="Profile Image"
            fill
          />
        </div>
      ) : (
        <div className="relative w-64 h-64 my-4">
          <label htmlFor="profile-image-upload" className="cursor-pointer">
            <Image
              className="rounded-full object-cover"
              src={showNewImage || userImage}
              alt="Profile Image"
              fill
            />
          </label>
          <input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      )}
      {formAddMode ? (
        <div>
          {profileFormData.map((items, index) => {
            return (
              <div className="grid grid-cols-2 gap-2 my-2" key={index}>
                <div className="text-gray-400 text-center">{items.key}</div>
                <div className="text-black text-center">{items.value}</div>
              </div>
            );
          })}
          <div className="grid grid-cols-2 gap-2 my-2">
            <input
              className="text-gray-400 text-center w-32"
              value={newProfileFormData.key}
              onChange={(e) =>
                setNewProfileFormData({
                  key: e.target.value,
                  value: newProfileFormData.value,
                })
              }
            />
            <input
              className="text-black text-center w-32"
              value={newProfileFormData.value}
              onChange={(e) =>
                setNewProfileFormData({
                  key: newProfileFormData.key,
                  value: e.target.value,
                })
              }
            />
          </div>
          <div className="flex px-3 my-3 gap-2">
            <button
              className="w-full bg-ourLightGreen text-gray-400 rounded-lg"
              onClick={cancelAddFormData}
            >
              취소
            </button>
            <button
              className="w-full bg-ourLightGreen text-gray-400 rounded-lg"
              onClick={addFormData}
            >
              제출
            </button>
          </div>
        </div>
      ) : (
        <div>
          {profileFormData.map((items, index) => (
            <div className="grid grid-cols-2 gap-2 my-2" key={index}>
              <div className="text-gray-400 text-center">{items.key}</div>
              <div className="flex justify-center gap-2">
                <div className="text-black text-center">{items.value}</div>
                {modifyMode && ( // modifyMode일 때만 삭제 버튼 보이기
                  <button onClick={() => deleteProfileFormData(index)}>
                    <IoTrashOutline className="font-light" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {modifyMode && ( // modifyMode일 때만 추가 버튼 보이기
            <div className="px-3 my-3">
              <button
                className="w-full bg-ourLightGreen text-gray-400 rounded-lg"
                onClick={handleAddFormMode}
              >
                +
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
