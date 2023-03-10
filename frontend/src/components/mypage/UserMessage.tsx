import React from 'react';
import { TextType } from '../common/theme';
import { MyPageMessageLayout } from '../layout/MyPageLayout';
import useUserData from '../../hooks/useUser';
import { MessageSkeleton } from '../loadings/MessageSkeleton';

export const UserMessage = () => {
  const {
    userQuery: { isLoading, data: userData },
  } = useUserData();

  return (
    <>
      {isLoading && <MessageSkeleton />}

      <MyPageMessageLayout>
        {userData && (
          <>
            <span className={TextType.messageText}>{userData.username}</span>님, 상위 60%의
            <span className={TextType.messageText}> Earth Guardian</span>
            이군요!
            <br></br> 현재까지 <span className={TextType.messageText}>60마리</span>의 아델리펭귄을 구하셨어요.
          </>
        )}
      </MyPageMessageLayout>
    </>
  );
};
