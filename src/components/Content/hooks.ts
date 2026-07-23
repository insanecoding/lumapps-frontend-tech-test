import { useQuery } from '@tanstack/react-query';

import type { CharacterResponseBody, ReactionResponseBody } from '../../types';
import transformReactions from './utils/transform-reactions';

export const useReactions = () => {
  return useQuery({
    queryKey: ['reactions'],
    queryFn: async () => {
      const response = await fetch('/api/reactions');
      if (!response.ok) {
        throw new Error(`Failed to load reactions (${response.status})`);
      }
      return (await response.json()) as ReactionResponseBody;
    },
    select: transformReactions,
  });
};

export const useCharacters = (
  page: number,
  pageLimit: number,
  searchTerm: string,
) => {
  return useQuery({
    queryKey: ['characters', page, pageLimit, searchTerm],
    queryFn: async () => {
      const response = await fetch(
        `/api/characters?page=${page}&limit=${pageLimit}&name=${searchTerm}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to load characters (${response.status})`);
      }
      return (await response.json()) as CharacterResponseBody;
    },
  });
};
