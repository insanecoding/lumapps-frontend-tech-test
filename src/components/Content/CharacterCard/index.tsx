import React from 'react';
import {
  Chip,
  ColorPalette,
  FlexBox,
  Flag,
  GenericBlock,
  Heading,
  Orientation,
  Size,
  Text,
} from '@lumx/react';

import type { Character, Reaction } from '../../../types';
import CardImage from './CardImage';

import styles from './index.module.scss';

export interface CharacterCardProps {
  character: Character;
  reactions?: Reaction[];
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  reactions = [],
}) => {
  return (
    <article
      className={styles.card}
      aria-labelledby={`character-${character.id}-name`}
    >
      <GenericBlock
        className={styles.layout}
        orientation={Orientation.horizontal}
        gap={Size.big}
        hAlign="top"
        figure={
          <div className={styles.media}>
            <CardImage name={character.name} imageUrl={character.imageUrl} />
          </div>
        }
      >
        <FlexBox orientation={Orientation.vertical} gap={Size.regular}>
          <FlexBox
            orientation={Orientation.horizontal}
            hAlign="center"
            gap={Size.tiny}
            wrap
          >
            <Heading
              as="h2"
              id={`character-${character.id}-name`}
              typography="title"
            >
              {character.name}
            </Heading>
            {character.species && (
              <Flag label={character.species} color={ColorPalette.blue} />
            )}
            {character.birthYear && (
              <Flag label={character.birthYear} color={ColorPalette.green} />
            )}
          </FlexBox>

          {character.description && (
            <Text as="p" typography="body1">
              {character.description}
            </Text>
          )}

          {character.affiliations.length > 0 && (
            <FlexBox
              orientation={Orientation.horizontal}
              hAlign="center"
              gap={Size.tiny}
              wrap
            >
              {character.affiliations.map((affiliation) => (
                <Flag
                  key={affiliation}
                  label={affiliation}
                  color={ColorPalette.yellow}
                />
              ))}
            </FlexBox>
          )}

          {reactions.length > 0 && (
            <FlexBox
              as="ul"
              className={styles.reactions}
              orientation={Orientation.horizontal}
              gap={Size.tiny}
              aria-label={`Reactions for ${character.name}`}
            >
              {reactions.map((reaction) => (
                <li key={reaction.id} className={styles.reaction}>
                  <Chip size={Size.s}>{reaction.content}</Chip>
                </li>
              ))}
            </FlexBox>
          )}
        </FlexBox>
      </GenericBlock>
    </article>
  );
};
