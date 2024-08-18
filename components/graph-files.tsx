'use client';

import React, { useEffect } from 'react';
import { FileList } from '@microsoft/mgt-react';
import { Providers } from '@microsoft/mgt-element';
import { initializeGraphToolkit } from '../app/custom-mgt-provider-ts';

interface FilesListProps {
  accessToken: string;
}

const FilesList: React.FC<FilesListProps> = ({ accessToken }) => {
  useEffect(() => {
    if (!Providers.globalProvider) {
      initializeGraphToolkit(accessToken);
    }
  }, [accessToken]);

  return (
    <div>
      <h1>Files List</h1>
      <FileList />
    </div>
  );
};

export default FilesList;