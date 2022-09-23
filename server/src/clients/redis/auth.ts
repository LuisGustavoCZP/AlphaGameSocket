import Redis from "ioredis";
import { redis, cripto } from "../../configs";
import {v4 as uuid} from 'uuid';

class AuthRedis{
  public redis: Redis;
  private timeExpire = String(60*30);

  constructor(){
    this.redis = new Redis(redis);
  }

  public async createCookie(id : string){
    //const value = sign({sessionId:id}, cripto.secret);
    const expire = this.timeExpire;
    return {value:id, expire};
  }

  public async readCookie(cookie:string){
    //const payload = verify(cookie, cripto.secret);
    return await this.redis.get(`session:${cookie}`);
  }

  public async initSession(userId:string){
    const id = uuid();
    await this.redis.setex(`session:${id}`, this.timeExpire, userId);
    await this.redis.setex(`session-user:${userId}`, this.timeExpire, id);
    return await this.createCookie(id);
  }

  public async expiration (userid:string, expire:boolean)
  {
    const sessionid = this.redis.get(`session-user:${userid}`);
    if(!sessionid) return;
    if(expire)
    {
      this.redis.expire(`session:${sessionid}`, this.timeExpire);
      this.redis.expire(`session-user:${userid}`, this.timeExpire);
    } else {
      this.redis.expire(`session:${sessionid}`, -1);
      this.redis.expire(`session-user:${userid}`, -1);
    }
  }
}

const authRedis = new AuthRedis();

export default authRedis;