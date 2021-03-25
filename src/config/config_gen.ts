import { Command } from 'commander';
import * as fs from 'fs';
const program = new Command();
import { encryptor } from '../util/cipher';
import { configPath, defaultConfig, encryptConfigPath } from './constants';

//For operations on config file
program
  .option('-g, --generate', 'Generate config file')
  .option('-d,--decrypt', 'Decrypt config file from encrypted file')
  .option('-e, --encrypt', 'Encrypt config file to encrypted file');

const generate = () => {
  try {
    fs.writeFileSync(
      encryptConfigPath,
      JSON.stringify(defaultConfig, null, '  ')
    );
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
