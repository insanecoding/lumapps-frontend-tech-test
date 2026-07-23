import getInitials from './get-initials';

describe('Get initials function', () => {
  test('Should handle empty input', () => {
    expect(getInitials('')).toEqual('?');
  });

  test('Should handle input only consisting of whitespaces', () => {
    expect(getInitials('      ')).toEqual('?');
  });

  test('Should display one letter for an input of one word', () => {
    expect(getInitials('R2-D2')).toEqual('R');
    expect(getInitials('Chewbacca')).toEqual('C');
  });

  test('Should display two letters for an input of two words', () => {
    expect(getInitials('Han Solo')).toEqual('HS');
  });

  test('Should limit to two letters for an input of three words', () => {
    expect(getInitials('Bail Prestor Organa')).toEqual('BP');
  });

  test('Should handle whitespaces in the middle', () => {
    expect(getInitials('Someone   Else')).toEqual('SE');
  });
});
