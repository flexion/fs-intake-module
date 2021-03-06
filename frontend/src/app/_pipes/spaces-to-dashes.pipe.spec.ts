import { SpacesToDashesPipe } from './spaces-to-dashes.pipe';

describe('SpacesToDashesPipe', () => {
  let pipe: SpacesToDashesPipe;

  beforeEach(() => {
    pipe = new SpacesToDashesPipe();
  });

  it('transforms spaces to dashes', () => {
    const value: any = 'test value';
    expect(pipe.transform(value)).toEqual('test-value');
  });
});
