import { createEncryptor } from 'simple-encryptor';

export let encryptor;
try {
  encryptor = createEncryptor(process.env.SECRET_KEY);
} catch (err) {
  console.log('Missing environment variable SECRET_KEY');
  process.exit(1);
}
