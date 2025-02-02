import { LectureType } from '@/app/(main)/mentorings/type';
import { Badge } from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import IconBadge from '@/components/atoms/IconBadge';
import dayjs from 'dayjs';
import { BsFillBarChartFill } from 'react-icons/bs';
import { FaClock } from 'react-icons/fa';
import { RiGraduationCapFill } from 'react-icons/ri';
import Image from 'next/image';

interface Props {
  lectureData: LectureType;
}

//삭제 예정
const DEFAULT_IMAGE_URL = '/img_landing.png';

export default function MentoringIntro(props: Props) {
  const {
    category,
    startTime,
    mentorName,
    duration,
    currParticipants,
    maxParticipants,
    title,
    thumbnailImgUrl,
  } = props.lectureData;

  // thumbnailImgUrl이 없으면 기본 이미지 사용
  const imageUrl = thumbnailImgUrl || DEFAULT_IMAGE_URL;

  return (
    <div>
      <div className="w-full bg-black py-5">
        <div className="wrapper flex justify-between items-center">
          <div className="flex-1 flex flex-col">
            <div className="flex md:items-end md:flex-row items-start gap-2 flex-col">
              <Badge
                text={category}
                className="bg-red-500 text-white text-sm rounded-lg mr-3"
              />
              <div className="flex gap-3 sm:flex-row flex-col">
                <IconBadge
                  icon={<FaClock />}
                  text={dayjs(startTime).format('YYYY-MM-DD HH시 mm분')}
                  gapLength="2"
                  iconClassName="text-amber-500"
                  textClassName="text-sm text-gray-400"
                />
                <IconBadge
                  icon={<BsFillBarChartFill />}
                  text={`${duration}시간`}
                  gapLength="2"
                  iconClassName="text-amber-500"
                  textClassName="text-sm text-gray-400"
                />
                <IconBadge
                  icon={<RiGraduationCapFill />}
                  text={`${currParticipants}명/${maxParticipants}명`}
                  gapLength="2"
                  iconClassName="text-amber-500"
                  textClassName="text-sm text-gray-400"
                />
              </div>
            </div>
            <div className="flex flex-col items-start ml-1">
              <div className="text-white text-2xl mt-4 font-bold">{title}</div>
              <div className="text-lg text-gray-400 my-2">{`${mentorName} 멘토님`}</div>
            </div>
            <div className="flex items-start my-2"></div>
          </div>
          {/* 오른쪽 div */}
          <div className="flex flex-col items-center rounded-2xl bg-white border border-gray-400 overflow-hidden relative aspect-[4/3]">
            <div className="relative w-[280px] h-[210px] ">
              <Image
                src={imageUrl}
                alt="멘토 명함"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 right-0 p-2">
                <Button
                  type="submit"
                  text="수강 신청"
                  className="bg-ourOrange text-white rounded-full py-2 px-4 mr-3 mb-1 hover:bg-orange-600 transition"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
