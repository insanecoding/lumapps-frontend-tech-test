import React from 'react';
import type { FallbackProps } from 'react-error-boundary';

import { Button, FlexBox, Kind, Message, Orientation, Size } from '@lumx/react';

import styles from './index.module.scss';

export const AppErrorFallback: React.FC<FallbackProps> = ({
  resetErrorBoundary,
}) => {
  return (
    <div className={styles.fallback} role="alert">
      <FlexBox
        orientation={Orientation.vertical}
        gap={Size.big}
        hAlign="center"
      >
        <Message kind={Kind.error} hasBackground>
          Something went wrong. Please reload the page and try again.
        </Message>
        <Button
          emphasis="medium"
          onClick={() => {
            resetErrorBoundary();
          }}
        >
          Try again
        </Button>
      </FlexBox>
    </div>
  );
};
