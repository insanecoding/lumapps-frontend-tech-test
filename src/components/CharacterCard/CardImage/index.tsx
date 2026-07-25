import React, { useMemo } from 'react';
import { AspectRatio, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';

import getInitials from '../../../utils/get-initials';
import type { Character } from '../../../types';

import styles from './index.module.scss';

const CardImage = ({
  name,
  imageUrl,
}: Pick<Character, 'name' | 'imageUrl'>) => {
  const initialsFallback = useMemo(
    () => (
      <div
        className={`${styles.thumbnail} ${styles.initialsShell}`}
        aria-hidden="true"
      >
        <span className={styles.initials} aria-hidden="true">
          {getInitials(name)}
        </span>
      </div>
    ),
    [name],
  );

  // Avoid mounting Thumbnail with src="" (React warns that the browser may re-fetch the page)
  if (!imageUrl) return initialsFallback;

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
};

export default CardImage;
