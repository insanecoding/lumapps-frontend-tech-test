import React from 'react';
import { Link } from 'react-router-dom';
import { FlexBox, Thumbnail } from '@lumx/react';

import logo from '../../assets/logo.png';
import SearchForm from './SearchForm';

import styles from './index.module.scss';

const Header: React.FC = () => {
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
          alt="Star Wars characters home"
          linkAs={Link}
          linkProps={
            { to: '/' } as React.AnchorHTMLAttributes<HTMLAnchorElement>
          }
        />
        <SearchForm />
      </FlexBox>
    </header>
  );
};

export default Header;
