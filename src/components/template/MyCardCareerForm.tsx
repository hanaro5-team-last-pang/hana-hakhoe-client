interface MyCardCareerProps {
  modifyMode: boolean;
  career: string;
  newCareer: string;
  setNewCareer: (newCareer: string) => void;
}

export default function MyCardCareerForm({
  modifyMode,
  career,
  newCareer,
  setNewCareer,
}: MyCardCareerProps) {
  return (
    <div className="my-6 ml-12 bg-gray-100 rounded-lg px-8 py-5 h-[300px]">
      <div className="text-xl font-semibold">이력</div>
      {!modifyMode ? (
        <textarea
          className="text-md my-3 text-gray-700 w-full h-3/4 bg-inherit focus:outline-none resize-none"
          value={career}
          readOnly
        />
      ) : (
        <textarea
          className="text-md bg-inherit text-gray-700 px-2 my-3 w-full h-3/4 outline outline-2 outline-blue-400 focus:outline-blue-400 focus:outline-2"
          value={newCareer}
          placeholder="멘토님의 경력을 소개해주세요"
          onChange={(e) => setNewCareer(e.target.value)}
        />
      )}
    </div>
  );
}
