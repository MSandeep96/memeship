import { igClient } from './ig/ig_client';
import { RedditClient } from './reddit/reddit_client';
import { cache } from './cache/cache';
import { config } from './config';
import { encryptor } from './util/cipher';

const sendMeme = async (friend) => {
  const logUsername = encryptor.encrypt(friend.username);
  console.log('Sending meme to ' + logUsername);
  try {
    const thread = await igClient.getThread(friend.username);
    console.log(`Got thread for ${logUsername}`);
    const { buffer, url, type } = await RedditClient.getMeme(
      friend.username,
      logUsername,
      friend.subreddits
    );
    console.log(`Downloaded meme for ${logUsername}`);
    if (type === 'image') {
      await thread.broadcastPhoto({
        file: buffer,
      });
    } else {
      await thread.broadcastVideo({
        video: buffer,
      });
    }
    console.log(`Successfully sent meme to ${logUsername}`);
    cache.addMemeSent(friend.username, url);
  } catch (err) {
    console.log(err);
    console.log(`Sending meme to ${logUsername} failed`);
  }
};

(async () => {
  try {
    await igClient.login();
    cache.init();
    await Promise.all(config.friends.map((friend) => sendMeme(friend)));
    cache.deinit();
  } catch (err) {
    console.error(err);
  }
})();
