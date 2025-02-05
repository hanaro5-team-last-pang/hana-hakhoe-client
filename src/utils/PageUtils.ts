export class PageUtils {
  static findCurrentLocation(location: string) {
    switch (location) {
      case '/mentorings':
        return '홈 > 전체 멘토링 목록';
      case '/news':
        return '홈 > 금융 뉴스';
      case '/mypage':
        return '홈 > 마이 페이지 > 나의 공간';
      case '/mypage/mentorings':
        return '홈 > 마이 페이지 > 멘토링 기록';
      case '/mypage/card-settings':
        return '홈 > 마이 페이지 > 명함 설정';
      case '/mypage/account-settings':
        return '홈 > 마이 페이지 > 계정 설정';
      case '/mypage/open-mentoring':
        return '홈 > 마이 페이지 > 멘토링 기록 > 멘토링 개설하기';
      default:
        return '';
    }
  }
}
