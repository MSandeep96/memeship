import { igClient } from './ig/ig_client';
import { config } from './config';
import { RedditClient } from './reddit/reddit_client';
import { cache } from './cache/cache';

(async () => {
  try {
    console.log('prelog');
    await igClient.login();
    console.log('postlog');
    sendMemes();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

cache.init();

const sendMemes = () => {
  console.log('here');
  config.friends.map(async (friend) => {
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
  });
};

process.stdin.resume(); //so the program will not close instantly

function exitHandler(options, exitCode) {
  if (options.cleanup) cache.deinit();
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
