import { createEncryptor } from 'simple-encryptor';

if (!process.env.SECRET_KEY) {
  console.log('Missing environment variable SECRET_KEY');
  process.exit(1);
}
export const encryptor = createEncryptor(process.env.SECRET_KEY);
