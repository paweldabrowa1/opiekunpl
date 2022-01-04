import { Meta } from '../../../layout/Meta';
import { DecisionBox } from '../../ui/DecisionBox';
import { createProfile, Profile, ProfileType } from '../../../models/Profile';
import { useEffect, useState } from 'react';
import { PatronPaymentType, PatronTime, PatronType, TranslatePatronTime } from '../../../models/Patron';
import FadeIn from 'react-fade-in';
import { FormInput } from '../../ui/form/FormInput';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { FormDatePickerField } from '../../ui/form/FormDatePickerField';
import { FormRadioField } from '../../ui/form/FormRadioField';
import { LocalIcon, LocalSVG } from '../../svg/LocalSVG';
import { Button } from '../../ui/Button';
import { generateUUID } from '../../../utils/UtilFunctions';
import { Gender } from '../../../models/LivingEntity';
import { useUser } from '../../../providers/AuthProvider';
import { Loading } from '../../ui/Loading';
import { useRootStore } from '../../../providers/RootStoreProvider';

enum Step {
  WhoAmI,
  Time,
  BasicForm,
  PostalCode,
  Contacts,
  CreatingProfile,
  CreatingResult
}

interface Form1 {
  firstName: string,
  lastName: string,
  gender: string,
  birthDate: Date
}

interface Form2 {
  postalCode: string,
  city: string,
  street: string,
}

interface Form3 {
  phoneNumber: string,
}

interface Props {
  onFulfill: () => void
}

export const CreateProfilePage = (props: Props) => {
  const user = useUser();
  const store = useRootStore();

  const [creatingResult, setCreatingResult] = useState<boolean>(false);
  const [step, setStep] = useState<Step>(Step.WhoAmI);
  const [profileType, setProfileType] = useState<ProfileType>(ProfileType.Nanny);
  const [patronTime, setPatronTime] = useState<PatronTime>(PatronTime.FreeTime);
  const [form1, setForm1] = useState<Form1>({} as Form1);
  const [form2, setForm2] = useState<Form2>({} as Form2);
  const [, setForm3] = useState<Form3>({} as Form3);
  const [avatar, setAvatar] = useState<String>('');

  useEffect(() => {
    if (step !== Step.PostalCode || avatar) {
      return;
    }

    generateAvatar();
  }, [step])

  async function generateAvatar() {
    const uiavatars = require("ui-avatars");

    const avatarURL = uiavatars.generateAvatar({
      uppercase: true,
      name: `${form1.firstName} ${form1.lastName}`.replaceAll(" ", "+"),
      background: "random",
      length: 2,
      bold: true,
      rounded: true,
      size: 512,
      // format: 'svg'
    });

    console.log("AVATAR start generating");

    (await fetch(avatarURL)).arrayBuffer().then(ab => {
      const blob = new Blob([ab], {type: "image/png"});
      // var img = URL.createObjectURL(blob);

      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function() {
        var base64data = reader.result;
        setAvatar(base64data as string);
        console.log("AVATAR GENERATED");
      }
    });
  }

  function FillProfileData(form3: Form3): Profile {
    return {
      profile_id: generateUUID(),
      auth_id: user.user.sub as string,
      birthDate: form1.birthDate,
      description: '',
      email: user.email as string,
      gender: form1.gender as Gender,
      name: {
        first: form1.firstName,
        second: form1.lastName
      },
      phoneNumber: form3.phoneNumber,
      avatar: avatar as string,
      type: profileType,
      registerDate: new Date(),
      patron: {
        payment: {
          amount: 0,
          type: PatronPaymentType.NotSet
        },
        time: patronTime,
        type: PatronType.NotSet
      },
      localization: {
        countryCode: 'PL',
        city: form2.city,
        street: form2.street,
        postalCode: form2.postalCode
      },
      available: true
    };
  }

  return (
    <div className='antialiased w-full text-gray-700'>
      <Meta
        title='Formularz nowej osoby'
        description='...'
      />

      <div className='text-center my-10'>
        <FadeIn>
          <h1 className='text-3xl'>Witaj, przybyszu!</h1>
          <h2 className='text-lg mb-20'>Odkryliśmy że jesteś tutaj nowy! Powiedz nam coś więcej o sobie :D</h2>
        </FadeIn>
        {step === Step.WhoAmI && (() => {
          function Decision(type: ProfileType) {
            return () => {
              setProfileType(type);
              setStep(Step.Time);
            };
          }

          return <FadeIn delay={300}>
            <h2 className='text-lg font-bold'>
              1) W jakim celu przybywasz?
            </h2>
            <div className='flex flex-wrap justify-center gap-4 my-4'>
              <DecisionBox onClick={Decision(ProfileType.Member)}>
                Poszukuje opiekuna
              </DecisionBox>
              <DecisionBox onClick={Decision(ProfileType.Nanny)}>
                Zaopiekuje się
              </DecisionBox>
            </div>
          </FadeIn>;
        })()}

        {step === Step.Time && (() => {
          function Decision(time: PatronTime) {
            return () => {
              setPatronTime(time);
              setStep(Step.BasicForm);
            };
          }

          return <FadeIn>
            <h2 className='text-lg font-bold'>
              {profileType === ProfileType.Member && '2) Szukam opiekuna na...'}
              {profileType === ProfileType.Nanny && '2) Zostane opiekunem na...'}
            </h2>
            <div className='flex flex-wrap justify-center gap-4 my-4'>
              <DecisionBox
                onClick={Decision(PatronTime.FullTime)}>{TranslatePatronTime(PatronTime.FullTime)}</DecisionBox>
              <DecisionBox
                onClick={Decision(PatronTime.PartTime)}>{TranslatePatronTime(PatronTime.PartTime)}</DecisionBox>
              <DecisionBox
                onClick={Decision(PatronTime.FreeTime)}>{TranslatePatronTime(PatronTime.FreeTime)}</DecisionBox>
              <DecisionBox
                onClick={Decision(PatronTime.OneTime)}>{TranslatePatronTime(PatronTime.OneTime)}</DecisionBox>
            </div>
          </FadeIn>;
        })()}

        {step === Step.BasicForm && (() => {
          const Schema = Yup.object().shape({
            firstName: Yup.string()
              .min(2, 'Za krotkie!')
              .max(50, 'Za długie!')
              .required('Wymagane'),
            lastName: Yup.string()
              .min(2, 'Za krotkie!')
              .max(50, 'Za długie!')
              .required('Wymagane'),
            gender: Yup.string()
              .required('Wymagane'),
            birthDate: Yup.string()
              .required('Wymagane')
            // email: Yup.string().email('Invalid email').required('Required')
          });

          return <FadeIn>
            <h2 className='text-lg font-bold mb-4'>
              3) Coś więcej o tobie
            </h2>
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                gender: '',
                birthDate: ''
              }}
              validationSchema={Schema}
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  setForm1(values as unknown as Form1);
                  setStep(Step.PostalCode);
                  setSubmitting(false);
                }, 400);
              }}
            >
              {({ values, handleChange }) => (
                <Form>

                  <FormInput
                    name='firstName'
                    placeholder='Imię'
                    onChange={handleChange}
                    autoFocus />

                  <FormInput
                    name='lastName'
                    placeholder='Nazwisko'
                    onChange={handleChange} />

                  <div id='gender-radio-group'>
                    <h3 className='font-bold mt-6'>
                      Płeć
                    </h3>
                  </div>
                  <div role='group' aria-labelledby='gender-radio-group' className='flex justify-center'>
                    <FormRadioField value={'male'} name={'gender'}>
                      Mężczyzna
                    </FormRadioField>
                    <FormRadioField value={'female'} name={'gender'}>
                      Kobieta
                    </FormRadioField>
                  </div>

                  <div className='flex justify-center'>
                    {/*Picked: {values.gender}*/}
                    {values.gender && values.gender === 'male' &&
                    <LocalSVG icon={LocalIcon.Male} size={10} />}
                    {values.gender && values.gender === 'female' &&
                    <LocalSVG icon={LocalIcon.Female} size={10} />}
                  </div>

                  {/*<Field name='email' type='email' />*/}
                  {/*{errors.email && touched.email ? <div>{errors.email}</div> : null}*/}
                  <div className='mt-6' />
                  <div className='flex justify-center'>
                    <FormDatePickerField name='birthDate' placeholderText='Data urodzenia' />
                  </div>
                  <Button type='submit'>Zatwierdź</Button>
                </Form>
              )}
            </Formik>
          </FadeIn>;
        })()}

        {step === Step.PostalCode && (() => {
          const postalCodeRegExp = new RegExp(`\\d{2}-\\d{3}`);

          const Schema = Yup.object().shape({
            postalCode: Yup.string()
              .matches(postalCodeRegExp, 'Wzór kodu pocztowego: XX-XXX')
              .required('Wymagane'),
            city: Yup.string()
              .required('Wymagane'),
            street: Yup.string()
              .required('Wymagane')
          });

          return <FadeIn>
            <h2 className='text-lg font-bold mb-4'>
              4) Gdzie mieszkasz?
            </h2>

            <Formik
              initialValues={{
                postalCode: '',
                city: '',
                street: ''
              }}
              validationSchema={Schema}
              validateOnBlur={false}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  setForm2(values as unknown as Form2);
                  setStep(Step.Contacts);
                  setSubmitting(false);
                }, 400);
              }}
            >
              {({ values, handleChange }) => (
                <Form>
                  <FormInput
                    name='postalCode'
                    placeholder='Wpisz kod pocztowy'
                    onChange={handleChange}
                    autoFocus />
                  {values.postalCode.match(postalCodeRegExp) && <div>
                    <FormInput
                      name='city'
                      placeholder='Podaj Miasto'
                      onChange={handleChange}
                      autoFocus />
                    <FormInput
                      name='street'
                      placeholder='Podaj ulice'
                      onChange={handleChange}
                    />
                  </div>}
                  <Button type='submit'>Zatwierdź</Button>
                </Form>
              )}
            </Formik>
          </FadeIn>;
        })()}

        {step === Step.Contacts && (() => {
          const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

          const Schema = Yup.object().shape({
            phoneNumber: Yup.string()
              .matches(phoneRegExp, 'Podaj poprawny numer telefonu')
              .required('Wymagane')
          });

          return <FadeIn>
            <h2 className='text-lg font-bold mb-4'>
              5) Ostatnie detale...
            </h2>

            <Formik
              initialValues={{
                phoneNumber: ''
              }}
              validationSchema={Schema}
              validateOnBlur={false}
              onSubmit={(values, { setSubmitting }) => {
                setForm3(values as unknown as Form3);
                setSubmitting(false);

                async function create() {
                  const profile = FillProfileData(values as Form3);
                  const result = await createProfile(profile);
                  setTimeout(async () => {
                    setStep(Step.CreatingResult);
                    setCreatingResult(result);
                    setTimeout(async () => {
                      if (result) {
                        store.profileStore.profile = profile;
                        props.onFulfill();
                      }
                    }, 500);
                  }, 500);
                }

                setTimeout(() => {
                  setStep(Step.CreatingProfile);
                  create();
                }, 400);
              }}
            >
              {({ handleChange }) => (
                <Form>
                  <FormInput
                    name='phoneNumber'
                    placeholder='Numer telefonu'
                    onChange={handleChange}
                    autoFocus />
                  <Button type='submit'>Zatwierdź</Button>
                </Form>
              )}
            </Formik>
          </FadeIn>;
        })()}

        {step === Step.CreatingProfile && (() => {
          return <FadeIn>
            <Loading>Uzupełnianie danych konta...</Loading>
          </FadeIn>;
        })()}

        {step === Step.CreatingResult && (() => {
          return <FadeIn>
            <Loading>
              {creatingResult && 'Pomyślnie uzupełniono dane...'}
              {!creatingResult && 'Coś poszło nie tak sprawdź konsolke....'}
            </Loading>
          </FadeIn>;
        })()}
      </div>
    </div>
  );
};

//https://eu.ui-avatars.com/api/?size=512

/*

        {step === Step.Time && {}}


import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required')
});



        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            picked: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={values => {
            // same shape as initial values
            console.log(values);
          }}
        >
          {({ errors, touched, values }) => (
            <Form>
              <div id='my-radio-group'>Picked</div>
              <div role='group' aria-labelledby='my-radio-group'>
                <label>
                  <Field type='radio' name='picked' value='One' />
                  One
                </label>
                <label>
                  <Field type='radio' name='picked' value='Two' />
                  Two
                </label>
                <div>Picked: {values.picked}</div>
              </div>

              <Field name='firstName' />
              {errors.firstName && touched.firstName ? (
                <div>{errors.firstName}</div>
              ) : null}
              <Field name='lastName' />
              {errors.lastName && touched.lastName ? (
                <div>{errors.lastName}</div>
              ) : null}
              <Field name='email' type='email' />
              {errors.email && touched.email ? <div>{errors.email}</div> : null}
              <button type='submit'>Submit</button>
            </Form>
          )}
        </Formik>
 */