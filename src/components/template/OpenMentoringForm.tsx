'use client';

import { getCategory } from '@/app/(main)/mentorings/actions';
import { Category } from '@/app/(main)/mentorings/type';
import { openMentoring } from '@/app/(main)/mypage/actions';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { ActionResType } from '@/types/hanaHakdang';
import { tags } from '@/utils/dummy';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function OpenMentoringForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const maxParticipantsRef = useRef<HTMLSelectElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const selectedTagsRef = useRef<Set<number>>(new Set());

  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
    }
  };

  const handleTagChange = (id: number) => {
    if (selectedTagsRef.current.has(id)) {
      selectedTagsRef.current.delete(id);
    } else {
      selectedTagsRef.current.add(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const today = dayjs().tz('Asia/Seoul');
    const selectedDate = dayjs(dateRef.current?.value);

    const selectedStartTime = dayjs(
      `${dateRef.current?.value} ${startTimeRef.current?.value}`
    ).format('YYYY-MM-DD HH:mm:ss');

    const selectedEndTime = dayjs(
      `${dateRef.current?.value} ${endTimeRef.current?.value}`
    ).format('YYYY-MM-DD HH:mm:ss');

    if (
      !image ||
      !titleRef.current?.value ||
      !descriptionRef.current?.value ||
      !categoryRef.current?.value ||
      !maxParticipantsRef.current?.value ||
      !dateRef.current?.value ||
      !startTimeRef.current?.value ||
      !endTimeRef.current?.value ||
      selectedTagsRef.current.size === 0
    ) {
      toast.info('모든 정보를 입력해주세요');
      return;
    }

    if (selectedDate.isBefore(today, 'day')) {
      toast.warn('오늘 이후의 날짜를 선택해주세요.');
      return;
    }

    if (
      dayjs(selectedStartTime).isAfter(dayjs(selectedEndTime)) ||
      dayjs(selectedStartTime).isSame(dayjs(selectedEndTime))
    ) {
      toast.warn('시작 시간은 끝나는 시간보다 빨라야 합니다.');
      return;
    }

    // FormData 생성
    const formData = new FormData();
    formData.append('imageFile', image);
    formData.append('title', titleRef.current.value);
    formData.append('description', descriptionRef.current.value);
    formData.append('start_time', selectedStartTime);
    formData.append('end_time', selectedEndTime);
    formData.append('max_participants', maxParticipantsRef.current.value);
    formData.append('category', categoryRef.current.value);
    selectedTagsRef.current.forEach((tag) =>
      formData.append('tags', tag.toString())
    );

    const result: ActionResType<string, string> = await openMentoring(formData);
    if (result.isError) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
      router.push('/mypage/mentorings');
    }
  };

  useEffect(() => {
    async function fetchCategories() {
      const data = await getCategory();
      setCategories(data.categories);
    }
    fetchCategories();
  }, []);

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
                ref={categoryRef}
              >
                <option value="">선택하세요</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat.tag}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/3">
              <label className="block mb-1">최대 수강 인원</label>
              <select
                name="max_participants"
                className="border border-gray-300 rounded-md p-2 w-full"
                ref={maxParticipantsRef}
              >
                <option value="">선택하세요</option>
                {[1, 2, 3, 4].map((num) => (
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
                ref={dateRef}
              />
            </div>
            <div className="w-1/3">
              <Input
                name="start_time"
                label="시작 시간"
                placeholder={''}
                type="time"
                className="border border-gray-300 rounded-md p-2 w-full"
                ref={startTimeRef}
              />
            </div>
            <div className="w-1/3">
              <Input
                name="end_time"
                label="끝나는 시간"
                placeholder={''}
                type="time"
                className="border border-gray-300 rounded-md p-2 w-full"
                ref={endTimeRef}
              />
            </div>
          </div>
          <div className="w-full flex-col">
            <Input
              name="title"
              label="멘토링 정보"
              placeholder="멘토링 제목을 입력하세요"
              className="border border-gray-300 rounded-md p-2 mb-4"
              ref={titleRef}
            />
            <textarea
              name="description"
              placeholder="멘토링 내용을 설명해주세요"
              rows={6}
              className="border border-gray-300 w-full rounded-md p-2 mb-4"
              ref={descriptionRef}
            />
          </div>

          {/* 태그 입력 */}
          <h3>태그 선택하기</h3>
          <div className="flex gap-4">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`tag-${tag.id}`}
                  onChange={() => handleTagChange(tag.id)}
                  className="mr-3"
                />
                <label htmlFor={`tag-${tag.id}`} className="cursor-pointer">
                  {tag.label}
                </label>
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
