import helpers from '../helpers';

const acceptJson = 'application/json';

describe('Parse accept header', () => {
  it('should parse single accept', () => {
    const result = helpers.parseAccept(acceptJson);
    expect(result).toEqual([acceptJson]);
  });
  it('should parse multiple accept', () => {
    const result = helpers.parseAccept('application/json,text/html');
    expect(result).toEqual([acceptJson, 'text/html']);
  });
  it('should parse multiple accept with quality', () => {
    const result = helpers.parseAccept('application/xhtml+xml;q=0.9,*/*;q=0.7,application/xml;q=0.8,text/html;q=1');
    expect(result).toEqual(
      [
        'text/html',
        'application/xhtml+xml',
        'application/xml',
        '*/*',
      ],
    );
  });
  it('should parse multiple accept with partial quality', () => {
    const result = helpers.parseAccept('text/html,application/xhtml+xml,*/*;q=0.8,application/xml;q=0.9');
    expect(result).toEqual(
      [
        'text/html',
        'application/xhtml+xml',
        'application/xml',
        '*/*',
      ],
    );
  });
});
