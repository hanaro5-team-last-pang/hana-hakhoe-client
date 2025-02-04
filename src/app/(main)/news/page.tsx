import { getNewsData } from '@/app/(main)/news/action';
import CardView from '@/components/organisms/CardView';
import SearchBar from '@/components/template/SearchBar';
import dayjs from 'dayjs';

export default async function Page() {
  const newsData = await getNewsData();
  const newsUrlDomain = 'https://www.fetimes.co.kr';

  return (
    <>
      <div className="wrapper flex w-full my-10 gap-10 items-start">
        <div className="w-5/6">
          <div className="flex flex-col w-full">
            <div className="flex flex-row justify-between mb-6 w-full">
              <h1 className="text-2xl font-bold">최근 금융 동향</h1>
              <SearchBar />
            </div>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-10 gap-y-12 mt-4">
              {newsData.map((card) => (
                <CardView
                  key={card.id}
                  {...card}
                  imageSrc={card.newsThumbnailUrl}
                  description={card.content}
                  date={dayjs(card.createdAt).format('YYYY년 MM월 DD일')}
                  id={card.newsUrl}
                />
              ))}
            {/* 뉴스 데이터가 없을 경우 메시지 표시 */}
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
        <div className="flex flex-col w-1/6">
          <div className="w-full">
            <div className="mb-8">
              <div className="text-sm mb-3 font-semibold"> 카테고리</div>
              {/*<CheckboxList*/}
              {/*  items={category}*/}
              {/*  textClassName="text-sm"*/}
              {/*  selectedTags={selectedCategoryTags}*/}
              {/*  onChange={handleCategoryChange}*/}
              {/*/>*/}
            </div>
            <div>
              <div className="text-sm mb-3 font-semibold">연령 카테고리</div>
              {/*<CheckboxList*/}
              {/*  items={age_category}*/}
              {/*  textClassName="text-sm"*/}
              {/*  selectedTags={selectedAgeCategoryTags}*/}
              {/*  onChange={handleAgeCategoryChange}*/}
              {/*/>*/}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
