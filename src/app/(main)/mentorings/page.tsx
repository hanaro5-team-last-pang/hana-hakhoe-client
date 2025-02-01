import { getLectureList } from '@/app/(main)/mentorings/actions';
import { LectureType } from '@/app/(main)/mentorings/type';
import CheckboxList from '@/components/molecules/CheckboxList';
import CardView from '@/components/organisms/CardView';
import MentoringList from '@/components/organisms/MentoringList';
import SearchBar from '@/components/template/SearchBar';
import { age_category, category } from '@/utils/dummy';
import dayjs from 'dayjs';

//TODO: 임시 default image
const DEFAULT_IMAGE_URL = '/img_landing.png';

const LectureToCardData = (lecture: LectureType) => {
  return {
    id: lecture.lectureId.toString(),
    title: lecture.title,
    imageSrc: lecture.thumbnailImgUrl || DEFAULT_IMAGE_URL,
    mentor_name: lecture.mentorName,
    start_time: dayjs(lecture.startTime).format('YYYY-MM-DD HH시 mm분'),
    duration: lecture.duration,
    participants: lecture.currParticipants,
    max_participants: lecture.maxParticipants,
    category: lecture.category,
    badgeClassName: 'bg-ourGreen',
  };
};

export default async function Page() {
  const result = await getLectureList();
  const cardData = result.map(LectureToCardData);

  return (
    <>
      <div className="wrapper flex w-full my-10 gap-10 items-start">
        <div className="w-5/6">
          <div className="flex flex-col w-full">
            <div className="flex flex-row justify-between mb-6 w-full">
              <h1 className="text-2xl font-bold">전체 멘토링 강의</h1>
              <SearchBar />
            </div>
            <div className="grid grid-rows-6 gap-6 gap-y-8 mt-4">
              {cardData.map((card) => (
                <div key={card.id} className="sm:hidden">
                  <CardView {...card} id={`/mentorings/${card.id}`} />
                </div>
              ))}
              {cardData.map((card) => (
                <div key={card.id} className="hidden sm:block">
                  <MentoringList {...card} id={`/mentorings/${card.id}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col w-1/6">
          <div className="w-full">
            <div className="mb-8">
              <div className="text-sm mb-3 font-semibold">멘토링 카테고리</div>
              <CheckboxList items={category} />
            </div>
            <div>
              <div className="text-sm mb-3 font-semibold">연령 카테고리</div>
              <CheckboxList items={age_category} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
