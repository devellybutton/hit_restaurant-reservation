import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { DateUtil, PhoneUtil, PriceUtil, GuestCountUtil } from './utilFunction';

/**
 * 미래 날짜 검증
 */
@ValidatorConstraint({ name: 'isFuture', async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;
    const date = new Date(value);
    return DateUtil.isFuture(date);
  }

  defaultMessage(): string {
    return '예약 시간은 현재 시간보다 이후여야 합니다.';
  }
}

/**
 * 예약 시간 범위 검증 (최소 30분, 최대 3시간)
 * 요구사항에 없지만 추가함
 */
@ValidatorConstraint({ name: 'isValidTimeRange', async: false })
export class IsValidTimeRangeConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const object = args.object as any;
    const startTime = new Date(object.startTime);
    const endTime = new Date(value);

    const minutes = DateUtil.getMinutesDifference(startTime, endTime);
    return minutes >= 30 && minutes <= 180;
  }

  defaultMessage(): string {
    return '예약 시간은 최소 30분, 최대 3시간까지 가능합니다.';
  }
}

/**
 * 시간 범위 검증 (00:00~23:59)
 */
@ValidatorConstraint({ name: 'isValidTime', async: false })
export class IsValidTimeConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;
    const date = new Date(value);
    return DateUtil.isValidTimeRange(date);
  }

  defaultMessage(): string {
    return '시간은 00:00~23:59 범위여야 합니다.';
  }
}

/**
 * 한국 전화번호 형식 검증 (9~11자리 숫자)
 */
@ValidatorConstraint({ name: 'isValidPhone', async: false })
export class IsValidPhoneConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;
    return PhoneUtil.isValid(value);
  }

  defaultMessage(): string {
    return '전화번호는 9~11자리 숫자여야 합니다.';
  }
}

/**
 * 적정 가격 범위 검증 (0원 이상)
 */
@ValidatorConstraint({ name: 'isValidPrice', async: false })
export class IsValidPriceConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'number') return false;
    return PriceUtil.isValidPrice(value);
  }

  defaultMessage(): string {
    return '가격은 0원 이상이여야 합니다.';
  }
}

/**
 * 둘 다 입력된 경우, 최소가격이 최대가격보다 작아야 됨
 */
@ValidatorConstraint({ name: 'minLessThanMax', async: false })
export class MinLessThanMaxConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments): boolean {
    const obj = args.object as any;
    if (typeof obj.minPrice === 'number' && typeof obj.maxPrice === 'number') {
      return obj.minPrice <= obj.maxPrice;
    }
    return true; // 둘 다 없거나 하나만 있을 경우는 검증 통과
  }

  defaultMessage(): string {
    return '최소 가격은 최대 가격보다 작거나 같아야 합니다.';
  }
}

/**
 * 인원수 검증 (1명 이상)
 */
@ValidatorConstraint({ name: 'isValidGuestCount', async: false })
export class IsValidGuestCountConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'number') return false;
    return GuestCountUtil.isValidGuestCount(value);
  }

  defaultMessage(): string {
    return '인원수는 1명 이상이여야 합니다.';
  }
}

// 아래는 데코레이터 생성 함수들
export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFutureDateConstraint,
    });
  };
}

export function IsValidTimeRange(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidTimeRangeConstraint,
    });
  };
}

export function IsValidTime(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidTimeConstraint,
    });
  };
}

export function IsKoreanPhone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPhoneConstraint,
    });
  };
}

export function IsValidPrice(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPriceConstraint,
    });
  };
}

export function IsValidGuestCount(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidGuestCountConstraint,
    });
  };
}
