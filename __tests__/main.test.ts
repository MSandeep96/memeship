// import { Delays, greeter } from '../src/main';

import axios from 'axios';

describe('flimsy api working check', () => {
  it('gets api response', async () => {
    const resp = await axios.get(
      `https://www.instagram.com/cristiano/channel/?__a=1`
    );
    expect(resp.data?.graphql?.user?.id).toBeDefined();
  });
});
