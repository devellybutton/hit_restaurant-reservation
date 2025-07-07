/**
 * 날짜 관련
 */
export class DateUtil {
  /**
   * 날짜가 현재 시간 이후인지 확인
   */
  static isFuture(date: Date): boolean {
    const now = new Date();
    return date > now;
  }

  /**
   * 두 날짜 사이의 분 차이 계산
   */
  static getMinutesDifference(startDate: Date, endDate: Date) {
    return (endDate.getTime() - startDate.getTime()) / (1000 * 60);
  }

  /**
   * 시간이 올바른 범위인지 확인 (00:00 ~ 23:59)
   */
  static isValidTimeRange(date: Date): boolean {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  }
}

/**
 * 전화번호 관련
 */
export class PhoneUtil {
  /**
   * 전화번호 유효성 검사 (11자리 숫자, 010으로 시작)
   */
  static isValid(phone: string): boolean {
    const phoneRegex = /^010\d{8}$/;
    return phoneRegex.test(phone);
  }
}

/**
 * 가격 관련
 */
export class PriceUtil {
  /**
   * 가격 유효성 검사 (0 이상, 최대값은 요구사항에 없음)
   */
  static isValidPrice(price: number): boolean {
    return price >= 0;
  }
}

/**
 * 인원수 관련 유틸리티
 */
export class GuestCountUtil {
  /**
   * 인원수 유효성 검사 (1명 이상, 최대값은 요구사항에 없음)
   */
  static isValidGuestCount(count: number): boolean {
    return count > 0;
  }
}
