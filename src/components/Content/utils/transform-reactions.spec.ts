import transformReactions from './transform-reactions';

describe('transformReactions', () => {
  test('Should return an empty map when there are no reactions', () => {
    expect(transformReactions({ reactions: [] })).toEqual({});
  });

  test('Should drop deleted reactions', () => {
    expect(
      transformReactions({
        reactions: [
          { id: '1', content: '⭐', characterId: 1, deleted: false },
          { id: '2', content: '💙', characterId: 1, deleted: true },
        ],
      }),
    ).toEqual({
      1: [{ id: '1', content: '⭐', characterId: 1, deleted: false }],
    });
  });

  test('Should group reactions by characterId', () => {
    expect(
      transformReactions({
        reactions: [
          { id: '1', content: '⭐', characterId: 1, deleted: false },
          { id: '2', content: '💙', characterId: 3, deleted: false },
          { id: '3', content: '⚡', characterId: 3, deleted: false },
        ],
      }),
    ).toEqual({
      1: [{ id: '1', content: '⭐', characterId: 1, deleted: false }],
      3: [
        { id: '2', content: '💙', characterId: 3, deleted: false },
        { id: '3', content: '⚡', characterId: 3, deleted: false },
      ],
    });
  });

  test('Should keep the first reaction when ids are duplicated', () => {
    expect(
      transformReactions({
        reactions: [
          { id: '401', content: '😈', characterId: 4, deleted: false },
          { id: '401', content: '💎', characterId: 4, deleted: false },
        ],
      }),
    ).toEqual({
      4: [{ id: '401', content: '😈', characterId: 4, deleted: false }],
    });
  });

  test('Should keep a single chip when the same emoji appears twice for a character', () => {
    expect(
      transformReactions({
        reactions: [
          { id: '9904', content: '💎', characterId: 1, deleted: false },
          { id: '104', content: '💎', characterId: 1, deleted: false },
          { id: '102', content: '⭐', characterId: 1, deleted: false },
        ],
      }),
    ).toEqual({
      1: [
        { id: '9904', content: '💎', characterId: 1, deleted: false },
        { id: '102', content: '⭐', characterId: 1, deleted: false },
      ],
    });
  });

  test('Should match Han Solo design shape after full normalization', () => {
    expect(
      transformReactions({
        reactions: [
          { id: '9904', content: '�', characterId: 1, deleted: false },
          { id: '104', content: '�', characterId: 1, deleted: false },
          { id: '102', content: '⭐', characterId: 1, deleted: false },
          { id: '103', content: '�', characterId: 1, deleted: true },
          { id: '105', content: '�', characterId: 1, deleted: false },
          { id: '106', content: '�', characterId: 1, deleted: true },
        ],
      }),
    ).toEqual({
      1: [
        { id: '9904', content: '�', characterId: 1, deleted: false },
        { id: '102', content: '⭐', characterId: 1, deleted: false },
      ],
    });
  });
});
