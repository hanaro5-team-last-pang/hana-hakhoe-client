import { getNewsData } from '@/app/(main)/news/action';
import CheckboxList from '@/components/molecules/CheckboxList';
import CardView from '@/components/organisms/CardView';
import SearchBar from '@/components/template/SearchBar';
import { category } from '@/utils/dummy';
import dayjs from 'dayjs';

export default async function Page() {
  const newsData = await getNewsData();

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
            </div>
          </div>
        </div>
        <div className="flex flex-col w-1/6">
          <div className="w-full">
            <div className="mb-8">
              <div className="text-sm mb-3 font-semibold"> 카테고리</div>
              <CheckboxList items={category} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
