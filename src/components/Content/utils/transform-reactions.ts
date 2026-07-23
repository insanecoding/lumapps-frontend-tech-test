import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';

import type { Reaction, ReactionResponseBody } from '../../../types';

type CharacterId = number;
type ReactionsByCharacterId = Record<CharacterId, Reaction[]>;

const transformReactions = (
  data: ReactionResponseBody,
): ReactionsByCharacterId => {
  const notDeleted = data.reactions.filter((reaction) => !reaction.deleted);
  const deduplicatedIds = uniqBy(notDeleted, 'id');
  const grouped = groupBy(deduplicatedIds, 'characterId');

  return Object.fromEntries(
    Object.entries(grouped).map(([key, value]) => [
      key,
      uniqBy(value, 'content'), // deduplicate content
    ]),
  );
};

export default transformReactions;
