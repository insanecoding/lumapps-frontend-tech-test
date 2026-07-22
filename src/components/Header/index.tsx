import React from 'react';

import debounce from 'lodash/debounce';

import { FlexBox, Thumbnail, TextField, Theme } from '@lumx/react';
import { mdiMagnify } from '@lumx/icons';

import styles from './Header.module.scss';
import logo from '../../assets/logo.png';
import { useSearchParams } from 'react-router';

export const Header: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // todo: protect from race conditions: e.g when searching for `query` and `quer` arrived after `query`? or can Tanstack Query protect from that?
  const handleSearch = debounce((value: string) => {
    setSearchParams((params) => {
      params.set('name', value);
      params.set('page', '1');
      return params;
    });
  }, 300);

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
