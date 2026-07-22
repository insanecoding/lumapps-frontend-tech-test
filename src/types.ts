export interface Character {
  id: number;
  name: string;
  species?: string;
  birthYear?: string;
  description?: string;
  imageUrl?: string;
  affiliations: string[];
}

export interface Reaction {
  id: string;
  content: string;
  characterId: number;
  deleted: boolean;
}

export type Nullable<T> = T | null;

export type CharacterResponseBody = {
  results: Character[];
  total: number;
  page: number;
  limit: number;
  next: Nullable<string>;
  previous: Nullable<string>;
};

export type ReactionResponseBody = {
  reactions: Reaction[];
};
