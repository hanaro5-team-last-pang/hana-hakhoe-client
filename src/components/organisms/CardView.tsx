import { Badge } from '@/components/atoms/Badge';
import IconBadge from '@/components/atoms/IconBadge';
import { FaRegCalendar, FaRegClock } from 'react-icons/fa6';
import { IoPerson } from 'react-icons/io5';
import Image from 'next/image';
import Link from 'next/link';

interface CardViewProps {
  id: string;
  title: string;
  imageSrc: string;
  //멘토링 목록의 prop
  mentor_name?: string;
  start_time?: string;
  duration?: number;
  participants?: number;
  max_participants?: number;
  category?: string;
  badgeClassName?: string;
  //금융뉴스카드의 prop
  date?: string;
  description?: string;
}

export default function CardView({
  id,
  title,
  imageSrc,
  mentor_name,
  start_time,
  duration,
  participants,
  max_participants,
  category,
  badgeClassName,
  date,
  description,
}: CardViewProps) {
  //뉴스 카드는 새창에서 열기 설정
  const isExternalLink = id.startsWith('http://') || id.startsWith('https://');

  return (
    <Link
      href={id}
      target={isExternalLink ? '_blank' : undefined}
      rel={isExternalLink ? 'noopener noreferrer' : undefined}
    >
      <div
        className="flex flex-col rounded-2xl overflow-hidden border-gray-200 border-[0.5px] shadow-md w-full
      transition-transform duration-300 ease-in-out transform hover:-translate-y-3 hover:shadow-lg cursor-pointer"
      >
        <div className="relative text-white flex items-center justify-center">
          <div>
            {category && (
              <Badge
                text={category}
                className={`rounded-lg absolute top-3 left-3 z-10 ${badgeClassName}`}
              />
            )}
          </div>
          <div className="relative w-full aspect-[3/2]">
            <Image
              src={imageSrc}
              alt={''}
              style={{ objectFit: 'cover' }}
              layout="fill"
            />
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="text-xl font-bold mb-1">{title}</div>

          {mentor_name && (
            <div className="text-gray-700 mb-2">{mentor_name} 멘토</div>
          )}
          {date && (
            <div className="flex items-center mb-1">
              <IconBadge
                icon={
                  <FaRegCalendar className="text-ourGreen text-lg font-bold" />
                }
                text={date}
                gapLength="2"
                textClassName="text-gray-700 text-sm"
              />
            </div>
          )}

          {description && (
            <div className="text-gray-700 line-clamp-4 overflow-hidden overflow-ellipsis">
              {description}
            </div>
          )}

          {start_time && (
            <div className="flex items-center mb-1">
              <IconBadge
                icon={
                  <FaRegCalendar className="text-ourGreen text-lg font-bold" />
                }
                text={start_time}
                gapLength="2"
                textClassName="text-gray-700 mr-3 text-sm"
              />
              {duration !== undefined && (
                <IconBadge
                  icon={
                    <FaRegClock className="text-ourGreen text-lg font-bold" />
                  }
                  text={`${duration}시간`}
                  gapLength="2"
                  textClassName="text-gray-700 mr-3 text-sm"
                />
              )}
              {participants !== undefined && max_participants !== undefined && (
                <IconBadge
                  icon={
                    <IoPerson className="text-ourGreen text-lg font-bold" />
                  }
                  text={`${participants}/${max_participants}`}
                  gapLength="2"
                  textClassName="text-gray-700 mr-3 text-sm"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
