import LinkButton from '@/components/atoms/LinkButton';

export default function LandingImg() {
  return (
    <div className="flex flex-col items-start justify-center text-center">
      <h1 className="text-3xl font-semibold mb-2">
        하나학회에 오신 것을 환영합니다
      </h1>
      <p className="text-lg mb-4">Welcome to Hana Academy!</p>
      <div>
        <LinkButton
          route={'/mentorings'}
          label={'멘토링 참여하기'}
          className={'bg-ourOrange text-white rounded-full hover:bg-orange-500'}
        />
      </div>
    </div>
  );
}
