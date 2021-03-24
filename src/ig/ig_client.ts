import axios from 'axios';
import {
  AccountRepositoryLoginResponseLogged_in_user,
  DirectThreadEntity,
  IgApiClient,
} from 'instagram-private-api';
import { cache } from '../cache/cache';
import { encryptor } from '../util/cipher';
import * as path from 'path';
import * as fs from 'fs';

const sessionFile = path.join(__dirname, '..', '..', '..', 'xyz.encrypt');
class IgClient {
  ig: IgApiClient;
  loggedInUser: AccountRepositoryLoginResponseLogged_in_user;
  constructor() {
    this.ig = new IgApiClient();
  }

  login = async () => {
    this.ig.state.generateDevice(process.env.IG_USERNAME);
    //store session
    this.ig.request.end$.subscribe(async () => {
      const serialized = await this.ig.state.serialize();
      delete serialized.constants;
      const sessionData = encryptor.encrypt(JSON.stringify(serialized));
      fs.writeFileSync(sessionFile, sessionData);
    });
    //restore session
    if (fs.existsSync(sessionFile)) {
      const encSessionData = fs.readFileSync(sessionFile).toString();
      const sessionData = encryptor.decrypt(encSessionData);
      await this.ig.state.deserialize(sessionData);
    }
    this.loggedInUser = await this.ig.account.login(
      process.env.IG_USERNAME,
      process.env.IG_PASSWORD
    );
  };

  getThread = async (username) => {
    let userId = cache.getUserIdMapping(username);
    if (!userId) {
      const userResp = await axios.get(
        `https://www.instagram.com/${username}/channel/?__a=1`
      );
      userId = userResp.data.graphql.user.id;
      cache.addUserIdMapping(username, userId);
    }
    const userThread = new DirectThreadEntity(this.ig);
    userThread.userIds = [userId];
    return userThread;
  };
}

export const igClient = new IgClient();
