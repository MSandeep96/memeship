import axios from 'axios';
import Jimp from 'jimp/es';
import { cache } from '../cache/cache';

export class RedditClient {
  static async getMeme(
    username: string,
    subs: string[]
  ): Promise<{ buffer: Buffer; url: string; type: string }> {
    const sub = subs[Math.floor(Math.random() * subs.length)];
    const subJson = await axios.get(`https://www.reddit.com/r/${sub}/.json`);
    const [, , ...posts] = subJson.data.data.children;
    const pickedPost = posts.find(
      ({ data }) =>
        RedditClient.isValidMemeType(data) &&
        !cache.hasMemeBeenSent(username, data.url)
    ).data;
    console.log(`Picked meme url at ${pickedPost.url} for ${username}`);
    let buffer;
    if (pickedPost.post_hint === 'image') {
      const image = await Jimp.read(pickedPost.url);
      buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
    } else {
      const videoResp = await axios.get(pickedPost.url, {
        responseType: 'arraybuffer',
      });
      buffer = Buffer.from(videoResp.data);
    }
    return {
      buffer,
      url: pickedPost.url,
      type: pickedPost.post_hint,
    };
  }

  static isValidMemeType(post): boolean {
    const idx = post.url.lastIndexOf('.');
    const extension = post.url.slice(idx + 1);
    if (extension !== 'gif' && post.post_hint === 'image') return true;
    return false;
  }
}
