import MentoringReviewModalForm from '@/components/template/MentoringReviewModalForm';

type Params = Promise<{ id: number }>;

export default async function Page(props: { params: Params }) {
  const { id } = await props.params;

  return (
    <div
      key={id}
      className="fixed inset-0 flex items-center justify-center rounded-md border border-gray-300"
    >
      <MentoringReviewModalForm lectureId={id} />
    </div>
  );
}
