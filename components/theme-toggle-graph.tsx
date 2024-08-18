'use client';

import React, { useEffect } from 'react';
import { ThemeToggle} from '@microsoft/mgt-react';
import { Providers } from '@microsoft/mgt-element';
import { initializeGraphToolkit } from '../app/custom-mgt-provider-ts';

interface ToggleProps {
  accessToken: string;
}

const Toggle: React.FC<ToggleProps> = ({ accessToken }) => {
  useEffect(() => {
    if (!Providers.globalProvider) {
      initializeGraphToolkit(accessToken);
    }
  }, [accessToken]);

  return (
    <div>
      <ThemeToggle/>
    </div>
  );
};

export default Toggle;