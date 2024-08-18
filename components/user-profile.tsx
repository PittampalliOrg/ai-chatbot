'use client';

import React, { useEffect } from 'react';
import { Person } from '@microsoft/mgt-react';
import { Providers } from '@microsoft/mgt-element';
import { initializeGraphToolkit } from '../app/custom-mgt-provider-ts';

interface UserProfileProps {
  accessToken: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ accessToken }) => {
  useEffect(() => {
    if (!Providers.globalProvider) {
      initializeGraphToolkit(accessToken);
    }
  }, [accessToken]);

  return (
    <div>
      <h1>User Profile</h1>
      <Person personQuery="me" view="threelines" />
    </div>
  );
};

export default UserProfile;