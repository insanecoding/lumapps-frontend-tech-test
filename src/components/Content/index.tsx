import React from 'react';
import { useSearchParams } from 'react-router';

import {
  Button,
  FlexBox,
  Kind,
  Message,
  Orientation,
  ProgressCircular,
  Size,
} from '@lumx/react';

import { CharacterCard } from './CharacterCard';
import { useCharacters, useReactions } from './hooks';
import PaginationButtons from './PaginationButtons';

import styles from './index.module.scss';

const pageLimit = 4;

// todo: add skeletons instead of a loader?
// todo: use Suspense?
export const Content: React.FC = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? 1);
  const searchTerm = searchParams.get('name') ?? '';

  const { data: reactions, isPending: isReactionsPending } = useReactions();

  const {
    data: characters,
    isFetching: isCharactersFetching,
    isError: isCharactersError,
    refetch: refetchCharacters,
  } = useCharacters(page, pageLimit, searchTerm);

  if (isCharactersError && !isCharactersFetching) {
    return (
      <section className={styles.content} aria-label="Character results">
        <FlexBox
          className={styles.status}
          orientation={Orientation.vertical}
          gap={Size.big}
          hAlign="center"
        >
          <Message kind={Kind.error} hasBackground>
            Could not load characters. Check your connection and try again.
          </Message>
          <Button emphasis="medium" onClick={() => refetchCharacters()}>
            Try again
          </Button>
        </FlexBox>
      </section>
    );
  }

  if (isCharactersFetching || isReactionsPending) {
    return (
      <section
        className={styles.content}
        aria-busy="true"
        aria-label="Character results"
      >
        <div className={styles.status}>
          <ProgressCircular />
          <p className={styles.statusMessage} role="status">
            Loading…
          </p>
        </div>
      </section>
    );
  }

  if (!characters?.results.length) {
    return (
      <section className={styles.content} aria-label="Character results">
        <div className={styles.status}>
          <p className={styles.statusMessage} role="status">
            {`No characters found${searchTerm ? ` for “${searchTerm}”` : ''}`}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.content} aria-label="Character results">
      <ul className={styles.list}>
        {characters.results.map((character) => (
          <li key={character.id} className={styles.listItem}>
            <CharacterCard
              character={character}
              reactions={reactions?.[character.id] ?? []}
            />
          </li>
        ))}
      </ul>
      <PaginationButtons
        totalItems={characters.total}
        pageLimit={characters.limit}
        currentPage={page}
      />
    </section>
  );
};
