import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { encryptor } from './util/cipher';

const configPath = path.join(__dirname, '..', '..', 'config.json');
const encryptConfigPath = path.join(__dirname, '..', '..', 'config.encrypt');
export interface ConfigType {
  friends: {
    username: string;
    frequency: number; // once every 'frequency' hours
    subreddits: string[]; // ['aww','funny']  default ['memes', 'dankmemes']
  }[];
  //0-23 Starts sending memes after this
  startHour: number;
  //0-23 Stops sending memes after this  (same as startHour for always send memez)
  stopAtHour: number;
  // +0530  -0300 offset of your timezone so memes are sent in your timezone regardless of server time
  timezoneOffset: string;
}

export const defaultConfig: ConfigType = {
  friends: [
    {
      username: 'example',
      frequency: 2,
      subreddits: ['programmerhumor', 'memes', 'dankmemes'],
    },
  ],
  startHour: 8,
  stopAtHour: 1,
  timezoneOffset: '+0530',
};

class Config {
  friends: ConfigType['friends'];
  constructor() {
    try {
      if (!fs.existsSync(encryptConfigPath)) {
        throw new Error(
          `Error encrypted config doesn't exist. Please refer readme.md about generating config.`
        );
      }
      const configJSON = fs.readFileSync(encryptConfigPath).toString();
      const config = JSON.parse(encryptor.decrypt(configJSON));
      this.friends = config.friends;
    } catch (err) {
      console.log(err);
      console.log(`Error reading config`);
      process.exit(1);
    }
  }
}

export const config = new Config();

//For operations on config
const program = new Command();

program
  .option('-g, --generate', 'Generate config file')
  .option('-d,--decrypt', 'Decrypt config file from encrypted file')
  .option('-e, --encrypt', 'Encrypt config file to encrypted file');

const generate = () => {
  try {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, '  '));
  } catch (err) {
    console.log(err);
    console.log('Error working with config file');
  }
  console.log('Successfully generated config file');
};

const decrypt = () => {
  try {
    if (!fs.existsSync(encryptConfigPath))
      throw new Error('Encrypted config file does not exist');
    const encryptedConfig = fs.readFileSync(encryptConfigPath).toString();
    let config = encryptor.decrypt(encryptedConfig);
    config = JSON.parse(config);
    fs.writeFileSync(configPath, JSON.stringify(config, null, '  '));
  } catch (err) {
    console.log(err);
    console.log('Error decrypting encrypted config file');
  }
};

const encrypt = () => {
  try {
    if (!fs.existsSync(configPath))
      throw new Error('Config file does not exist');
    const config = fs.readFileSync(configPath).toString();
    const encryptedConfig = encryptor.encrypt(config).toString();
    fs.writeFileSync(encryptConfigPath, encryptedConfig);
  } catch (err) {
    console.log(err);
    console.log('Error encrypting config file');
  }
};

program.parse(process.argv);
const options = program.opts();
if (options.generate) {
  generate();
} else if (options.encrypt) {
  encrypt();
} else if (options.decrypt) {
  decrypt();
}
