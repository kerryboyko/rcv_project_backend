import { insertDocuments } from './helloWorld';

describe('insertDocuments()', () => {
  it('inserts documents', async () => {
    const result = await insertDocuments(
      { foo: 'foo', bar: 'bar', baz: 'baz' },
      { one: [1, 2, 3, 4] }
    );
    expect(result.result.n).toBe(2);
  });
});
