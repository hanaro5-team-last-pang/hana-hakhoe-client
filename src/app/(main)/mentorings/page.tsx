import {
  CategoryList,
  LectureListResponse,
  LectureType,
} from '@/app/(main)/mentorings/type';
import CheckboxList from '@/components/molecules/CheckboxList';
import CardView from '@/components/organisms/CardView';
import MentoringList from '@/components/organisms/MentoringList';
import SearchBar from '@/components/template/SearchBar';
import { BADGE_COLORS } from '@/constant';
import { BaseResType } from '@/types/hanaHakdang';
import { fetcher } from '@/utils/fetcher';
import { getRandomIndex } from '@/utils/getRandomIndex';
import dayjs from 'dayjs';

//TODO: 임시 default image
const DEFAULT_IMAGE_URL = '/img_landing.png';

const LectureToCardData = (lecture: LectureType) => {
  return {
    id: lecture.lectureId,
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

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;

  let category: string = '';
  if (typeof searchParams.category === 'string') {
    category = searchParams.category;
  }
  let page = Number(searchParams.page);
  if (isNaN(page)) {
    page = 0;
  }
  let keyword: string = '';
  if (typeof searchParams.keyword === 'string') {
    keyword = searchParams.keyword;
  }
  const subUrl = keyword
    ? `/search?keyword=${keyword}&page=${page}`
    : category
      ? `/lectures/category?name=${category}&page=${page}`
      : `/lectures?page=${page}`;

  console.log(subUrl);
  const responses = await Promise.all([
    fetcher('GET', subUrl),
    fetcher('GET', '/lectures/categories'),
  ]);

  const searchResult =
    (await responses[0].json()) as BaseResType<LectureListResponse>;
  const cardData = searchResult.result.lectureList.map(LectureToCardData);
  const categoryResult =
    (await responses[1].json()) as BaseResType<CategoryList>;

  return (
    <>
      <div className="wrapper flex w-full my-10 gap-10 items-start">
        <div className="w-5/6">
          <div className="flex flex-col w-full">
            <div className="flex flex-row justify-between mb-6 w-full">
              <h1 className="text-2xl font-bold">전체 멘토링 강의</h1>
              <SearchBar />
            </div>
            {cardData.length === 0 ? (
              <div className="mt-4 flex justify-center">
                <p>멘토링 강의를 찾을 수 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-rows-6 gap-6 gap-y-8 mt-4">
                {cardData.map((card) => {
                  const idx = getRandomIndex(
                    card.category,
                    BADGE_COLORS.length
                  );
                  return (
                    <div key={card.id} className="sm:hidden">
                      <CardView
                        {...card}
                        badgeClassName={BADGE_COLORS[idx]}
                        id={`/mentorings/${card.id}`}
                      />
                    </div>
                  );
                })}
                {cardData.map((card) => {
                  const idx = getRandomIndex(
                    card.category,
                    BADGE_COLORS.length
                  );
                  return (
                    <div key={card.id} className="hidden sm:block">
                      <MentoringList
                        {...card}
                        badgeClassName={BADGE_COLORS[idx]}
                        id={`/mentorings/${card.id}`}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col w-1/6">
          <div className="w-full">
            <div className="mb-8">
              <div className="text-sm mb-3 font-semibold">멘토링 카테고리</div>
              <CheckboxList items={categoryResult.result.categories} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
