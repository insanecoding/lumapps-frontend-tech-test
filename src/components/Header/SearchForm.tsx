import React, { useState } from 'react';
import { useSearchParams } from 'react-router';
import { TextField, Theme } from '@lumx/react';
import { mdiMagnify } from '@lumx/icons';

const SearchForm: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlName = (searchParams.get('name') ?? '').trim();
  const [inputValue, setInputValue] = useState(urlName);
  const [prevURLName, setPrevURLName] = useState(urlName);

  // react pattern: reset local state when external source changes
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  // used to update the input value when going back in the browser
  if (prevURLName !== urlName) {
    setPrevURLName(urlName);
    setInputValue(urlName);
  }

  const handleSearch = (raw: string) => {
    setSearchParams((params) => {
      const trimmed = raw.trim();
      params.set('page', '1');

      if (trimmed) {
        params.set('name', trimmed);
      } else {
        params.delete('name');
      }
      return params; // mutating the callback before return is a recommended way in React Router docs
    });
  };

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        handleSearch(inputValue);
      }}
    >
      <TextField
        label="Search"
        clearButtonProps={{
          label: 'Clear',
          'data-testid': 'search-input-clear',
        }}
        value={inputValue}
        onChange={setInputValue}
        onClear={() => handleSearch('')}
        theme={Theme.light}
        icon={mdiMagnify}
        placeholder="Find your character"
        data-testid="search-input"
      />
    </form>
  );
};
export default SearchForm;
