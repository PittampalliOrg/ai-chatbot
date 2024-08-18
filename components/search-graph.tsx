'use client';

import React, { useEffect } from 'react';
import { SearchResults } from '@microsoft/mgt-react';
import { Providers } from '@microsoft/mgt-element';
import { initializeGraphToolkit } from '../app/custom-mgt-provider-ts';

interface SearchResultsListProps {
    accessToken: string;
    entityTypes: string[];
    fetchThumbnail: boolean;
    queryString: string;
  }

  const SearchResultsList: React.FC<SearchResultsListProps> = ({accessToken, entityTypes, fetchThumbnail, queryString }) => {
    useEffect(() => {
    if (!Providers.globalProvider) {
      initializeGraphToolkit(accessToken);
    }
  }, [accessToken]);

  return (
    <div>
      <h1>Search Results</h1>
      <SearchResults entityTypes={entityTypes} fetchThumbnail={fetchThumbnail} queryString={queryString} />
    </div>
  );
};

export default SearchResultsList;