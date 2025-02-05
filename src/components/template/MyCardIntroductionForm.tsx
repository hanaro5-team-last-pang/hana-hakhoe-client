interface IntroductionProps {
  modifyMode: boolean;
  introduction: string;
  newIntroduction: string;
  setNewIntroduction: (newIntroduction: string) => void;
}

export default function MyCardIntroductionForm({
  modifyMode,
  introduction,
  newIntroduction,
  setNewIntroduction,
}: IntroductionProps) {
  return (
    <div className="rounded-lg bg-gray-100 px-8 py-5">
      <div className="text-xl font-semibold">소개</div>
      {!modifyMode ? (
        <textarea
          className="text-md my-3 text-gray-700 w-full h-3/4 bg-inherit focus:outline-none resize-none"
          value={introduction}
          readOnly
        />
      ) : (
        <textarea
          className="text-md bg-inherit text-gray-700 px-2 my-3 w-full h-3/4 outline outline-2 outline-blue-400 focus:outline-blue-400 focus:outline-2"
          value={newIntroduction}
          placeholder="멘토님에 대한 소개를 해주세요"
          onChange={(e) => setNewIntroduction(e.target.value)}
        />
      )}
    </div>
  );
}
