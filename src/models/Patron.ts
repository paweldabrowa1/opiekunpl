export interface PatronData {
  time: PatronTime;
  type: PatronType;

  payment: PatronPayment;
}

export enum PatronTime {
  FullTime = 'full',
  PartTime = 'part',
  FreeTime = 'free',
  OneTime = 'one'
}

export enum PatronType {
  NotSet = 'not-set',
  Any = 'any',
  Child = 'child',
  Animal = 'animal'
}

export interface PatronPayment {
  type: PatronPaymentType;
  amount: number;
}

export enum PatronPaymentType {
  NotSet = 'not-set',
  PerPatronSession = 'per-patron-session',
  PerHour = 'per-hour',
}

export function TranslatePatronTime(time: PatronTime) {
  if (time === PatronTime.FullTime) return 'Pełen etat';
  if (time === PatronTime.PartTime) return 'Część etatu';
  if (time === PatronTime.FreeTime) return 'Dorywczo';
  if (time === PatronTime.OneTime) return 'Jednorazowa pomoc';
  return '';
}