import { LectureListResponse } from '@/app/(main)/mentorings/type';
import { NewsType } from '@/app/(main)/news/type';
import IconButton from '@/components/atoms/IconButton';
import LinkButton from '@/components/atoms/LinkButton';
import HeaderTab from '@/components/molecules/HeaderTab';
import LandingText from '@/components/molecules/LandingText';
import MainPageText from '@/components/molecules/MainpageText';
import CardView from '@/components/organisms/CardView';
import Footer from '@/components/organisms/Footer';
import Header from '@/components/organisms/Header';
import { BaseResType } from '@/types/hanaHakdang';
import { iconButtonData } from '@/utils/dummy';
import { fetcher } from '@/utils/fetcher';
import landing from 'public/img_landing_3.png';
import banner from 'public/img_main_banner.png';
import Image from 'next/image';

const newsUrlDomain = 'https://www.fetimes.co.kr';

export default async function Home() {
  const [newsRes, lecturesRes] = await Promise.all([
    fetcher('GET', '/news'),
    fetcher('GET', '/lectures'),
  ]);

  const newsData = (await newsRes.json()) as BaseResType<NewsType[]>;
  const lecturesData =
    (await lecturesRes.json()) as BaseResType<LectureListResponse>;

  return (
    <>
      <Header>
        <HeaderTab />
      </Header>
      <div className="header-skeleton" />
      <div>
        <div className="flex w-full justify-center bg-gradient-to-r from-[#FFF5BE] to-[#BDFFE9]">
          <div
            style={{ backgroundImage: `url(${landing.src})` }}
            className="w-full max-w-screen-xl aspect-video bg-center bg-cover flex items-center"
          >
            <div className="ml-12">
              <LandingText />
            </div>
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
            {lecturesData.result.lectureList.length === 0 ? (
              <div className="mt-4 flex justify-center">
                <p className="my-10">예정된 멘토링이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-rows-2 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-8 mt-4">
                {lecturesData.result.lectureList.map((lecture) => (
                  <CardView
                    key={lecture.lectureId}
                    title={lecture.title}
                    imageSrc={lecture.thumbnailImgUrl}
                    start_time={lecture.startTime}
                    participants={lecture.currParticipants}
                    max_participants={lecture.maxParticipants}
                    category={lecture.category}
                    duration={lecture.duration}
                    description={lecture.description}
                    mentor_name={lecture.mentorName}
                    id={`mentorings/${lecture.lectureId}`}
                  />
                ))}
              </div>
            )}
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
              {newsData.result.slice(0, 3).map((news) => (
                <CardView
                  key={news.id}
                  imageSrc={news.newsThumbnailUrl}
                  title={news.title}
                  id={newsUrlDomain + news.newsUrl}
                />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
