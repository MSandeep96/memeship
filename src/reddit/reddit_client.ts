import axios from 'axios';
import Jimp from 'jimp/es';
import { cache } from '../cache/cache';

export class RedditClient {
  static async getMeme(
    username: string,
    subs: string[]
  ): Promise<{ buffer: Buffer; url: string }> {
    const sub = subs[Math.floor(Math.random() * subs.length)];
    const subJson = await axios.get(`https://www.reddit.com/r/${sub}/.json`);
    const [, , ...posts] = subJson.data.data.children;
    const pickedPost = posts.find(
      (post) =>
        RedditClient.isValidImageType(post.data.url) &&
        !cache.hasMemeBeenSent(username, post.data.url)
    );
    console.log(`Picked image url at ${pickedPost.data.url} for ${username}`);
    const image = await Jimp.read(pickedPost.data.url);
    const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
    return {
      buffer,
      url: pickedPost.data.url,
    };
  }

  static isValidImageType(url: string): boolean {
    const idx = url.lastIndexOf('.');
    const extension = url.slice(idx + 1);
    if (extension !== 'gif') return true;
    return false;
  }
}
