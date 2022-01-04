export interface LivingEntity {
  name: {
    first: string;
    second?: string;
  }

  gender: Gender;

  birthDate: Date;
  description: string;
}

export enum Gender {
  Male = 'male',
  Female = 'female'
}