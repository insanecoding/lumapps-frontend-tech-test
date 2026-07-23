import React, { useMemo } from 'react';
import { AspectRatio, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';

import getInitials from '../utils/get-initials';
import type { Character } from '../../../types';

import styles from './CardImage.module.scss';

const CardImage = ({
  name,
  imageUrl,
}: Pick<Character, 'name' | 'imageUrl'>) => {
  const initialsFallback = useMemo(
    () => (
      <span className={styles.initials} aria-hidden="true">
        {getInitials(name)}
      </span>
    ),
    [name],
  );

  if (imageUrl) {
    return (
      <Thumbnail
        className={styles.thumbnail}
        image={imageUrl}
        alt=""
        aspectRatio={AspectRatio.square}
        size={Size.xl}
        variant={ThumbnailVariant.rounded}
        // Broken URLs use the same initials treatment as a missing image.
        fallback={initialsFallback}
      />
    );
  }

  return (
    <div
      className={`${styles.thumbnail} ${styles.initialsShell}`}
      aria-hidden="true"
    >
      {initialsFallback}
    </div>
  );
};

export default CardImage;
