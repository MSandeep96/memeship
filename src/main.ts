import { igClient } from './ig/ig_client';
import { config } from './config';
import { RedditClient } from './reddit/reddit_client';
import { cache } from './cache/cache';

const sendMeme = async (friend) => {
  console.log('Sending meme to ' + friend.username);
  try {
    const thread = await igClient.getThread(friend.username);
    console.log(`Got thread for ${friend.username}`);
    const { buffer, url } = await RedditClient.getMeme(
      friend.username,
      friend.subreddits
    );
    console.log(`Downloaded meme for ${friend.username}`);
    await thread.broadcastPhoto({
      file: buffer,
    });

    console.log(`Successfully sent meme to ${friend.username}`);
    cache.addMemeSent(friend.username, url);
  } catch (err) {
    console.log(err);
    console.log(`Sending meme to ${friend.username} failed`);
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
