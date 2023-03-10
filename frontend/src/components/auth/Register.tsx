import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { userValidation } from './yup';

import { InputContainer } from '../common/InputContainer';
import { FormInput, IputError, InputButton } from '../common/FormsAboutInput';
import { useResiter, IAuthData } from '../../hooks/useAuth';
import { useValUserName, useValEmail } from '../../hooks/useValUser';
import { DialogModal } from '../common/DialogModal';
import { AxiosError } from 'axios';
import { useModalState } from '../../hooks/useModalState';

interface IRegisterData extends IAuthData {
  username: string;
  confimrPassword: string;
}

export const Register = () => {
  const { isOpen, handleClose, handleOpen } = useModalState();

  const { schema } = userValidation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IRegisterData>({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  //데이터 전달
  const { mutate, isError, isSuccess, error } = useResiter();
  const onSubmit = (data: IRegisterData) => {
    handleOpen();
    const { username, email, password } = data;
    const role = 'USER';
    mutate({ username, email, password, role });
  };

  const [currUsername, currEmail] = useWatch({ control, name: ['username', 'email'] });
  //유저네임 실시간 밸리데이션
  const [usernameError, setUsernameError] = useState(false);
  const { data: valUsername, isLoading: isUserNameLoading } = useValUserName(
    currUsername?.length > 2 ? currUsername : '##',
  );
  const usernameVal = valUsername?.username;
  useEffect(() => {
    usernameVal ? setUsernameError(Boolean(usernameVal)) : setUsernameError(Boolean(usernameVal));
  }, [currUsername, isUserNameLoading]);

  //유저이메일 실시간 밸리데이션
  const [emailError, setEmailError] = useState(false);
  const { data: valEmail, isLoading: isEmailLoading } = useValEmail(currEmail?.length > 2 ? currEmail : '##');
  const eamilVal = valEmail?.email;
  useEffect(() => {
    eamilVal ? setEmailError(Boolean(eamilVal)) : setEmailError(Boolean(eamilVal));
  }, [emailError, isEmailLoading]);

  //에러처리
  const errorMsg = error instanceof AxiosError ? error?.response?.data?.error : null;
  return (
    <div className={className.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={className.form}>
        <p className={className.title}>Do it together!</p>
        <InputContainer inputProp="username" label="이름">
          <Controller
            name="username"
            control={control}
            defaultValue=""
            render={({ field: { name, onChange, value } }) => {
              const errorDisplay = usernameError || errors.username ? 'error' : '';
              return (
                <FormInput
                  id="username"
                  placeholder="2자리 이상, 20자 이하로 입력해주세요."
                  error={errorDisplay}
                  name={name}
                  onChange={onChange}
                  value={value || ''}
                />
              );
            }}
          />
          <IputError>
            {usernameError ? <span>동일한 이름이 존재합니다.</span> : errors.username && errors.username.message}
          </IputError>
        </InputContainer>

        <InputContainer inputProp="email" label="이메일">
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field: { name, onChange, value } }) => {
              const errorDisplay = emailError || errors.email ? 'error' : '';
              return (
                <FormInput
                  id="email"
                  placeholder="이메일을 입력해주세요."
                  error={errorDisplay}
                  name={name}
                  onChange={onChange}
                  value={value || ''}
                />
              );
            }}
          />
          <IputError>
            {emailError ? <span>동일한 이메일이 존재합니다.</span> : errors.email && errors.email.message}
          </IputError>
        </InputContainer>

        <InputContainer inputProp="password" label="비밀번호">
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field: { name, onChange, value } }) => {
              const errorDisplay = errors.password ? 'error' : '';
              return (
                <FormInput
                  type="password"
                  id="password"
                  placeholder="공백을 제외한 특수문자, 알파벳, 숫자를 포함한 8자 이상 입력해주세요."
                  error={errorDisplay}
                  name={name}
                  onChange={onChange}
                  value={value || ''}
                />
              );
            }}
          />
          <IputError>{errors.password && errors.password.message}</IputError>
        </InputContainer>

        <InputContainer inputProp="confimrPassword" label="비밀번호 확인">
          <Controller
            name="confimrPassword"
            control={control}
            defaultValue=""
            render={({ field: { name, onChange, value } }) => {
              const errorDisplay = errors.confimrPassword ? 'error' : '';
              return (
                <FormInput
                  type="password"
                  id="confimrPassword"
                  placeholder="동일한 비밀번호를 입력해주세요."
                  error={errorDisplay}
                  name={name}
                  onChange={onChange}
                  value={value || ''}
                />
              );
            }}
          />
          <IputError>{errors.confimrPassword && errors.confimrPassword.message}</IputError>
        </InputContainer>
        <InputButton value="가입하기" />
      </form>
      <>
        {isError && isOpen ? <DialogModal title="오류" message={errorMsg} type="alert" onClose={handleClose} /> : null}
        {isSuccess && isOpen ? (
          <DialogModal title="회원가입" message="회원가입 되었습니다." type="alert" refresh="/" onClose={handleClose} />
        ) : null}
      </>
    </div>
  );
};

const className = {
  container:
    'flex flex-col items-center justify-start w-[580px] h-[590px] max-[600px]:h-[750px] mb-[130px] max-[600px]:mx-[20px] px-6 border-[3px] border-garden1 box-border rounded-xl bg-gardenBG shadow-[0_0_30px_rgba(30, 30, 30, 0.185)]',
  form: 'flex-col w-full px-3',
  title: 'justify-self-start text-center my-14 max-[550px]:my-12 pb-2 text-garden1 font-pacifico text-4xl  ',
};
