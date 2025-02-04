'use client';

import { handleSearchAction } from '@/app/action';
import Button from '@/components/atoms/Button';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { FormEvent, useRef } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    const inputValue = inputRef.current?.value;
    if (inputValue) {
      router.push(`/mentorings?keyword=${inputValue}`);
    }
  };

  return (
    <form
      className="flex items-center border-b border-gray-700"
      onSubmit={submitSearch}
    >
      <div className="flex-1">
        <input
          type="text"
          name="search"
          placeholder="검색어를 입력하세요"
          ref={inputRef}
          className="w-full outline-none border-none text-sm placeholder-gray-600"
        />
      </div>
      <div>
        <Button type="button" className="flex items-center justify-center">
          <FaSearch className="text-gray-700" />
        </Button>
      </div>
    </form>
  );
}
