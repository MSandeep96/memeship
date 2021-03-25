import { igClient } from './ig/ig_client';
import { RedditClient } from './reddit/reddit_client';
import { cache } from './cache/cache';
import { config } from './config/config';
import { encryptor } from './util/cipher';

const sendMeme = async (friend) => {
  const logUsername = encryptor.encrypt(friend.username);
  if (cache.triggerNo % friend.frequency !== 0) {
    console.log(`Not sending meme to ${logUsername}`);
    return;
  }
  console.log(`Sending meme to ${logUsername}`);
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
    console.log(`Failed to send meme to ${logUsername}`);
  }
};

(async () => {
  try {
    config.init();
    if (!config.isActiveTime(new Date())) {
      console.log('Sleep time. Good night!');
      return;
    }
    await igClient.login();
    cache.init();
    console.log(cache.triggerNo);
    await Promise.all(config.friends.map((friend) => sendMeme(friend)));
    cache.deinit();
  } catch (err) {
    console.error(err);
  }
})();
