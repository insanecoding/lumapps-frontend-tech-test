import React from 'react';
import { useSearchParams } from 'react-router';
import debounce from 'lodash/debounce';
import { FlexBox, Thumbnail, TextField, Theme } from '@lumx/react';
import { mdiMagnify } from '@lumx/icons';

import logo from '../../assets/logo.png';

import styles from './index.module.scss';

export const Header: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // todo: should I search on enter to match their requirement and play safe?
  const handleSearch = debounce((value: string) => {
    setSearchParams((params) => {
      params.set('name', value);
      params.set('page', '1');
      return params;
    });
  }, 300);

  // todo: make it a link leading home when clicking on the header
  return (
    <header className={styles.header}>
      <FlexBox
        className={styles.logo}
        orientation="horizontal"
        vAlign="space-between"
        hAlign="center"
      >
        <Thumbnail
          image={logo}
          className={styles.logo}
          alt="My Static App Logo"
        />

        {/* todo: add a clear button */}
        <TextField
          defaultValue={searchParams.get('name') ?? ''}
          theme={Theme.light}
          icon={mdiMagnify}
          onChange={handleSearch}
          placeholder="Find your character"
          label="Search"
        />
      </FlexBox>
    </header>
  );
};
