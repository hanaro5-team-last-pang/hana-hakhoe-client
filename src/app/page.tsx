import { getLectureList } from '@/app/(main)/mentorings/actions';
import { LectureType } from '@/app/(main)/mentorings/type';
import IconButton from '@/components/atoms/IconButton';
import LinkButton from '@/components/atoms/LinkButton';
import HeaderTab from '@/components/molecules/HeaderTab';
import LandingText from '@/components/molecules/LandingText';
import MainPageText from '@/components/molecules/MainpageText';
import CardView from '@/components/organisms/CardView';
import Footer from '@/components/organisms/Footer';
import Header from '@/components/organisms/Header';
import { iconButtonData, newsData } from '@/utils/dummy';
import dayjs from 'dayjs';
import landing from 'public/img_landing_3.png';
import banner from 'public/img_main_banner.png';
import Image from 'next/image';

//TODO: 임시 default image
const DEFAULT_IMAGE_URL = '/img_landing.png';

const LectureToCardData = (lecture: LectureType) => {
  return {
    id: lecture.lectureId.toString(),
    title: lecture.title,
    imageSrc: lecture.thumbnailImgUrl || DEFAULT_IMAGE_URL,
    mentor_name: lecture.mentorName,
    start_time: dayjs(lecture.startTime).format('YYYY-MM-DD'),
    duration: lecture.duration,
    participants: lecture.currParticipants,
    max_participants: lecture.maxParticipants,
    category: lecture.category,
    badgeClassName: 'bg-ourOrange',
  };
};

export default async function Home() {
  const result = await getLectureList();
  const cardData = result.map(LectureToCardData);

  return (
    <>
      <Header>
        <HeaderTab />
      </Header>
      <div className="header-skeleton" />
      <div>
        <div className="relative w-full">
          <Image src={landing} alt="랜딩이미지" layout="responsive" />
          <div className="wrapper absolute w-full top-1/2 left-1/5 transform -translate-y-1/2">
            <LandingText />
          </div>
        </div>

        <div className="wrapper flex flex-col w-full my-20 gap-20 items-center">
          <div className="w-full px-4">
            <MainPageText
              title="카테고리"
              description="카테고리별 멘토링 프로그램을 만나보세요"
              buttonRoute="/mentorings"
            />
            {/* 아이콘 버튼 배치 */}
            <div className="grid grid-cols-5 gap-5 mt-4">
              {iconButtonData.slice(0, 5).map((data, index) => (
                <IconButton
                  key={index}
                  icon={data.icon}
                  label={data.label}
                  count={data.count}
                  route={data.route}
                />
              ))}
            </div>
          </div>
          <div className="w-full px-4">
            <MainPageText
              title="멘토링 목록"
              description="진행 예정 멘토링 프로그램을 확인하세요"
              buttonRoute="/mentorings"
            />
            {/* 카드 뷰 배치 */}
            <div className="grid grid-rows-2 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-8 mt-4">
              {cardData.slice(0, 6).map((card) => (
                <CardView
                  key={card.id}
                  {...card}
                  id={`mentorings/${card.id}`}
                />
              ))}
            </div>
          </div>
          {/* 회원가입 배너 */}
          <div className="relative w-full px-4">
            <Image src={banner} alt="배너 이미지" />
            <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
              <LinkButton
                label={'회원가입'}
                className={
                  'rounded-full bg-ourOrange text-white text-sm font-medium items-center'
                }
                route={'/signup'}
              />
            </div>
          </div>
          <div className="w-full px-4">
            <MainPageText
              title="금융 NEWS"
              description="최신 금융 이슈에 대해 알아보세요"
              buttonRoute="/news"
            />
            <div className="grid grid-rows-1 sm:grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              {newsData.slice(0, 3).map((card) => (
                <CardView key={card.id} {...card} id={`news/${card.id}`} />
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
