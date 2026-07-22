import React, { useCallback } from 'react';
import { useSearchParams } from 'react-router';

import { CharacterResponseBody, ReactionResponseBody } from '../../types';

import { Button } from '@lumx/react';
import createPagination from './pagination';
import { useQuery } from '@tanstack/react-query';
import { groupBy, uniqBy } from 'lodash';

const pageLimit = 4;

export const Content: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? 1);
  const searchTerm = searchParams.get('name') ?? '';

  const transformReactions = useCallback((data: ReactionResponseBody) => {
    const notDeleted = data.reactions.filter((reaction) => !reaction.deleted);

    const grouped = groupBy(uniqBy(notDeleted, 'id'), 'characterId');

    const entries = Object.entries(grouped).map(([key, value]) => [
      key,
      uniqBy(value, 'content'),
    ]);

    return Object.fromEntries(entries);
  }, []);

  const { data: reactions } = useQuery({
    queryKey: ['reactions'],
    queryFn: async () => {
      const response = await fetch('/api/reactions');
      return (await response.json()) as ReactionResponseBody;
    },
    select: transformReactions,
  });

  const { data: characters } = useQuery({
    queryKey: ['characters', page, pageLimit, searchTerm],
    queryFn: async () => {
      const response = await fetch(
        `/api/characters?page=${page}&limit=${pageLimit}&name=${searchTerm}`,
      );
      return (await response.json()) as CharacterResponseBody;
    },
  });

  if (!characters || !characters.results?.length) return null;

  const totalPages = Math.ceil(characters.total / characters.limit);

  console.log('=== ', reactions);

  return (
    <div>
      {characters.results.map((character) => (
        <div key={character.id}>
          <div>{character.imageUrl}</div>
          <span>{character.name}</span>
          <span>{character.birthYear}</span>
          <span>{character.species}</span>
          <div>{character.description}</div>
          <div>{character.affiliations}</div>
          <div>
            {reactions?.[character.id]?.map((item) => item.content)?.join(' ')}
          </div>
          <br />
        </div>
      ))}

      <Button
        emphasis="medium"
        onClick={() => {
          setSearchParams((params) => {
            params.set('page', `${page - 1}`);
            return params;
          });
        }}
        isDisabled={page === 1}
      >
        {'<'}
      </Button>
      {createPagination(characters.total, characters.limit, page).map(
        (item, index) =>
          item === null ? (
            <span key={`delimiter-${index}`}>...</span>
          ) : (
            <Button
              emphasis="medium"
              key={item}
              isActive={item === page}
              onClick={() => {
                if (item === page) return;

                setSearchParams((params) => {
                  params.set('page', `${item}`);
                  return params;
                });
              }}
            >
              {item}
            </Button>
          ),
      )}
      <Button
        emphasis="medium"
        onClick={() => {
          setSearchParams((params) => {
            params.set('page', `${page + 1}`);
            return params;
          });
        }}
        isDisabled={page === totalPages}
      >
        {'>'}
      </Button>
    </div>
  );
  // return <section className="lumx-spacing-padding-huge" />;
};
