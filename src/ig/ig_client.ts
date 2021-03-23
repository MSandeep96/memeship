import axios from "axios";
import { AccountRepositoryLoginResponseLogged_in_user, DirectThreadEntity, IgApiClient } from "instagram-private-api";

class IgClient{
  ig: IgApiClient;
  loggedInUser: AccountRepositoryLoginResponseLogged_in_user;
  constructor(){
    this.ig = new IgApiClient();
  }

  login = async ()=>{
    this.ig.state.generateDevice(process.env.IG_USERNAME);
    await this.ig.simulate.preLoginFlow();
    this.loggedInUser = await this.ig.account.login(process.env.IG_USERNAME,process.env.IG_PASSWORD);
    process.nextTick(async ()=> await this.ig.simulate.postLoginFlow());
  }

  getThread = async (username)=>{
    const userResp = await axios.get(`https://www.instagram.com/${username}/?__a=1`);
    const userId = userResp.data.graphql.user.id;
    const userThread = new DirectThreadEntity(this.ig);
    userThread.userIds = [userId];
    return userThread;
  }

}

export const igClient = new IgClient();
