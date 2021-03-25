# Memeship

### Automate sending memes from Reddit to your friends on Instagram right from a public Github repo.

Features:
- Choose subreddits for each username (works best with image based subreddits)
- Sleep time (can't have the bot sending memes while you're asleep)
- Encrypted config (don't want friends snooping on this repo to know whose dms you in)

Check project for other upcoming features. 
Meanwhile feel free to open an issue for feature requests.

## Setup

Create your own repo by clicking the **[template link][repo-template-action]**.

Clone the repo and set the following **environment variable** on your machine.  
You can use anything as your secret key but note this down as you'll have to set it on your Github repo later on.

```
SECRET_KEY = 'some_secret_key'
```

Generate a config file by running 
```sh
npm i
npm run config:generate
```

This must have generated a **config.json** at the root of the project.
The file's content must be something like the following. Update the config file accordingly. 
```
{
  "friends": [
    {
      "username": "example",  //username of a friend
      "frequency": 2,         //sends once every 'frequency' hours
      "subreddits": [         //randomly picks a subreddit from this array for this username
        "programmerhumor",
        "memes",
        "dankmemes"
      ]
    },
    ... other users here
  ],
  "startHour": 8,             //send memes only after (24 hour format)  essentially 8AM
  "stopAtHour": 1,            //stop sending memes after (24 hour format) 1AM
  "timezoneOffset": "+0530"   //your timezone in this format (+0800, -0430, etc)
}
```

Once you've updated the config file, run the following command to encrypt it.
```
npm run config:encrypt
```
This should create a config.encrypt file at the root of your project.

Commit and push your changes back to your repo.
```
git commit -am "Updated config"
git push
```
**Note** : Your original config.json is not pushed to the repo so as to prevent your friends from snooping.

We now have to set environment variables on your Github repo.
For this on your repo's page, go to [Settings] -> [Secrets]

Now using [New repository secret] button, set the following repo secrets mentioned in [YOUR_SECRET_NAME: 'value'] format
```
IG_USERNAME: 'your username'
IG_PASSWORD: 'your password'
SECRET_KEY : 'secret key you used on your machine' 
```
**Note** : The secret key given here must match the one used on your machine or the bot wont be able to decrypt your config.encrypt

Aaaaaaaaand you're done!

## Updating config file
Want to update your config file but lost it? 
Take a pull and decrypt your config.encrypt file using 
```
npm run config:decrypt
```

[repo-template-action]: https://github.com/MSandeep96/memeship/generate
