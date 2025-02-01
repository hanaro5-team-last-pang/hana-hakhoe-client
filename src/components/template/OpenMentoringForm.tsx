'use client';

import { openMentoring } from '@/app/(main)/mypage/actions';
import { Badge } from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { category } from '@/utils/dummy';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { startTransition, useActionState } from 'react';
import { useRef, useState } from 'react';

export default function OpenMentoringForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [tag, setTag] = useState<string>('');
  const [tagList, setTagList] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const [state, formAction] = useActionState(openMentoring, {
    value: {
      imageFile: null,
      data: {
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        max_participants: 0,
        category: '',
        tags: [],
      },
    },
    message: '멘토링 등록',
    isError: false,
  });

  const handleAddTag = () => {
    if (tag.trim() && !tagList.includes(tag.trim())) {
      setTagList((prevTags) => [...prevTags, tag.trim()]);
      setTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTagList((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile);
      setImageUrl(fileUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

    if (imageUrl) {
      formData.append('imageFile', imageUrl);
    }

    tagList.forEach((tag) => {
      formData.append('tags[]', tag);
    });

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const max_participants = formData.get('max_participants') as string;
    const date = formData.get('date') as string;
    const start_time = formData.get('start_time') as string;
    const end_time = formData.get('end_time') as string;

    // 유효성 검사
    const today = new Date();
    const selectedDate = new Date(date);
    const selectedStartTime = new Date(`${date}T${start_time}`);
    const selectedEndTime = new Date(`${date}T${end_time}`);

    if (
      !imageUrl ||
      !title ||
      !description ||
      !category ||
      !max_participants ||
      !date ||
      !start_time ||
      !end_time ||
      tagList.length === 0
    ) {
      toast.info('모든 정보를 입력해주세요');
      return;
    }

    if (selectedDate < today) {
      toast.warn('오늘 이후의 날짜를 선택해주세요.');
      return;
    }

    if (selectedStartTime >= selectedEndTime) {
      toast.warn('시작 시간은 끝나는 시간보다 빨라야 합니다.');
      return;
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="w-full p-5 flex items-center"
    >
      <div className="flex flex-col w-full items-center">
        <div className="w-3/4">
          <div className="flex w-full items-center justify-between mb-4 gap-4">
            <div className="w-1/3">
              <label className="block mb-1">카테고리 분류</label>
              <select
                name="category"
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="">선택하세요</option>
                {category.map((cat) => (
                  <option key={cat.id} value={cat.label}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/3">
              <label className="block mb-1">최대 수강 인원</label>
              <select
                name="max_participants"
                className="border border-gray-300 rounded-md p-2 w-full"
                defaultValue={state.value.data.max_participants}
              >
                <option value="">선택하세요</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/3">{''}</div>
          </div>
          <div className="flex justify-between items-center mb-6 w-full gap-4">
            <div className="w-1/3">
              <Input
                name="date"
                label="날짜"
                placeholder={''}
                type="date"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div className="w-1/3">
              <Input
                name="start_time"
                label="시작 시간"
                placeholder={''}
                type="time"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div className="w-1/3">
              <Input
                name="end_time"
                label="끝나는 시간"
                placeholder={''}
                type="time"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
          </div>
          <div className="w-full flex-col">
            <Input
              name="title"
              label="멘토링 정보"
              placeholder="멘토링 제목을 입력하세요"
              className="border border-gray-300 rounded-md p-2 mb-4"
            />
            <textarea
              name="description"
              placeholder="멘토링 내용을 설명해주세요"
              rows={6}
              className="border border-gray-300 w-full rounded-md p-2 mb-4"
            />
          </div>

          {/* 태그 입력 */}
          <div className="flex items-start gap-4 mb-2">
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="멘토링 태그를 추가하세요"
              className="border border-gray-300 rounded-md h-10 p-2 mr-2"
            />
            <Button
              type="button"
              text="추가"
              onClick={handleAddTag}
              className="bg-ourOrange rounded-full text-white h-10 px-4"
            />
          </div>

          {/* 태그 리스트 */}
          <div className="flex flex-wrap mt-1">
            {tagList.map((tag, index) => (
              <div key={index} className="flex items-center">
                <Badge
                  text={`#${tag}`}
                  className="border border-ourOrange text-sm rounded-full mb-1 font-normal"
                />
                <Button
                  type="button"
                  text="x"
                  onClick={() => handleRemoveTag(tag)}
                  className="mr-2 font-semibold"
                />
              </div>
            ))}
          </div>

          {/* 이미지 업로드 */}
          <div className="flex flex-col items-start rounded-2xl border border-gray-400 w-full p-4 my-4">
            <div className="relative mb-2 w-full aspect-[3/2]">
              {image ? (
                <Image
                  src={URL.createObjectURL(image)}
                  alt="멘토 명함"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex justify-center items-center">
                  <span>멘토링 썸네일을 등록해주세요</span>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {/* 제출 버튼 */}
          <div className="w-full wrapper p-2">
            <Button
              type="submit"
              text="멘토링 등록"
              className="bg-ourOrange text-white rounded-full py-2 px-4 mr-3 mb-1 hover:bg-orange-600 transition"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
