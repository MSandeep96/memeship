import {igClient} from './ig/ig_client';
import {config} from './config';

(async()=>{
  try{
    await igClient.login();
  }catch(err){
    console.error(err);
    process.exit(1);
  }
})();

config.friends.forEach(async(friend)=>{
  console.log('Sending meme to ' + friend.username);
  const thread = await igClient.getThread(friend.username);
  console.log(`Got thread for ${friend.username}`);
  // const memeBuffer = await RedditClient.getMeme(friend.subreddits);
  // console.log(`Downloaded meme for ${friend.username}`);
  // thread.broadcastPhoto({
  //   file: memeBuffer
  // });
  // console.log(`Successfully sent meme to ${friend.username}`)
});
