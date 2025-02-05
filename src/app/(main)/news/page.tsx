import { NewsType } from '@/app/(main)/news/type';
import CardView from '@/components/organisms/CardView';
import Pagination from '@/components/organisms/Pagination';
import { BaseResType } from '@/types/hanaHakdang';
import { fetcher } from '@/utils/fetcher';
import dayjs from 'dayjs';

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const page = Number(searchParams.page) || 0;
  const newsUrlDomain = 'https://www.fetimes.co.kr';

  const data = await fetcher('GET', `/news?page=${page}`);
  const newsRes = (await data.json()) as BaseResType<NewsType>;
  const totalNews = newsRes.result.totalCount;
  const newsData = newsRes.result.newsList;

  //페이지네이션 컴포넌트로 전달될 데이터 개수
  const itemsPerPage = 6;

  return (
    <>
      <div className="wrapper flex w-full my-10 gap-10 items-start">
        <div className="w-5/6">
          <div className="flex flex-col w-full">
            <div className="flex flex-row justify-between mb-6 w-full">
              <h1 className="text-2xl font-bold">최근 금융 동향</h1>
            </div>
            {newsData.length === 0 ? (
              <p className="text-center text-gray-500">
                저장된 뉴스가 없습니다.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-10 gap-y-12 mt-4">
                {newsData.map((card) => (
                  <CardView
                    key={card.id}
                    id={`${newsUrlDomain}${card.newsUrl}`}
                    imageSrc={card.newsThumbnailUrl}
                    title={card.title}
                    description={card.content}
                    date={dayjs(card.createdAt).format('YYYY년 MM월 DD일')}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 페이지네이션 컴포넌트 */}
      <div className="my-10 mb-20">
        <Pagination
          currentPage={page}
          totalItems={totalNews}
          itemsPerPage={itemsPerPage}
          buttonColor="bg-ourOrange"
          subUrl="/news"
        />
      </div>
    </>
  );
}
