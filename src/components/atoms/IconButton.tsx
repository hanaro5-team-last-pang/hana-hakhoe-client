import { FaChalkboardTeacher } from 'react-icons/fa';
import {
  FaBook,
  FaClipboardList,
  FaGraduationCap,
  FaUsers,
} from 'react-icons/fa6';
import Link from 'next/link';

export const iconData = [
  { icon: <FaBook /> },
  { icon: <FaChalkboardTeacher /> },
  { icon: <FaGraduationCap /> },
  { icon: <FaUsers /> },
  { icon: <FaClipboardList /> },
];

interface IconButtonProps {
  label: string;
  count?: number;
  route: string;
  index: number;
  className?: string;
}

export default function IconButton({
  label,
  route,
  count,
  index,
  className = '',
}: IconButtonProps) {
  const icon = iconData[index]?.icon || null;

  return (
    <Link href={`/mentorings?category=${route}`}>
      <div
        className={`flex flex-col items-center justify-center ${className} pb-[100%] rounded-xl border-gray-200 border-[0.5px] 
        shadow-md transition-transform duration-300 ease-in-out transform hover:-translate-y-2 cursor-pointer`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl mb-3 text-ourOrange">{icon}</div>
          <div className="text-sm font-semibold text-gray-800">{label}</div>
          <div className="text-xs text-gray-600"> {count} Courses </div>
        </div>
      </div>
    </Link>
  );
}
