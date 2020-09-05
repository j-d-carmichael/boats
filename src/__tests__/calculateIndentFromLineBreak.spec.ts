import calculateIndentFromLineBreak from '@/calculateIndentFromLineBreak';

describe('calculateIndentFromLineBreak', () => {
  it('check 4 space indent from start of file', () => {
    const str = '    Weathers: type';
    const pointer = calculateIndentFromLineBreak(str, 14);
    expect(pointer).toEqual(4);
  });

  it('check 2 space indent from start of file', () => {
    const str = '  Weathers: type';
    const pointer = calculateIndentFromLineBreak(str, 12);
    expect(pointer).toEqual(2);
  });

  it('check 0 space indent from start of file', () => {
    const str = 'Weathers: type';
    const pointer = calculateIndentFromLineBreak(str, 12);
    expect(pointer).toEqual(0);
  });

  it('check 0 space indent from start of new line', () => {
    const str = `
Weathers: type`;
    const pointer = calculateIndentFromLineBreak(str, 12);
    expect(pointer).toEqual(0);
  });

  it('check 2 space indent from start after new line', () => {
    const str = `
  Weathers: type`;
    const pointer = calculateIndentFromLineBreak(str, 12);
    expect(pointer).toEqual(2);
  });

  it('check 0 space indent not from start of new line', () => {
    const str = `
Weathers: type
Weathers: type`;
    const pointer = calculateIndentFromLineBreak(str, 27);
    expect(pointer).toEqual(0);
  });

  it('check 0 space indent not from start of new line but after a new line', () => {
    const str = `

Weathers: type
Weathers: type`;
    const pointer = calculateIndentFromLineBreak(str, 27);
    expect(pointer).toEqual(0);
  });

  it('check 2 space indent from start of new line', () => {
    const str = `
   Weathers: type`;
    const pointer = calculateIndentFromLineBreak(str, 12);
    expect(pointer).toEqual(2);
  });

  it('check 2 space indent from not start of new line', () => {
    const str = `
    Weathers: type
  Weathers: type`;
    const pointer = calculateIndentFromLineBreak(str, 33);
    expect(pointer).toEqual(2);
  });

  it('check 4 space indent from not start of new line', () => {
    const str = `
    Weathers: type
    Weathers: type`;
    const pointer = calculateIndentFromLineBreak(str, 35);
    expect(pointer).toEqual(4);
  });
  it('check 4 space indent from not start of new line', () => {
    const str = `
    Weathers: type
    Weathers: type
    Weathers: type`;
    const pointer = calculateIndentFromLineBreak(str, 54);
    expect(pointer).toEqual(4);
  });
  it('check 4 space indent from not start of new line', () => {
    const str = `
    Weathers: type
    Weathers: type
      Weathers: type`;
    const pointer = calculateIndentFromLineBreak(str, 56);
    expect(pointer).toEqual(6);
  });
});
