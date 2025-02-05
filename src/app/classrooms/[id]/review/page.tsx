import MentoringReviewModalForm from '@/components/template/MentoringReviewModalForm';
import { notFound } from 'next/navigation';

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const { id } = await props.params;
  let lectureId: number;

  try {
    lectureId = Number(id);
  } catch (e) {
    console.log(e);
    notFound();
  }

  return (
    <div
      key={lectureId}
      className="fixed inset-0 flex items-center justify-center rounded-md border border-gray-300"
    >
      <MentoringReviewModalForm lectureId={lectureId} />
    </div>
  );
}
