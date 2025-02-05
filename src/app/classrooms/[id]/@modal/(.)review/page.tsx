import MentoringReviewModalForm from '@/components/template/MentoringReviewModalForm';
import PageModal from '@/components/template/PageModal';
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
    <PageModal url={`/mentorings/${lectureId}`}>
      <MentoringReviewModalForm lectureId={lectureId} />
    </PageModal>
  );
}
