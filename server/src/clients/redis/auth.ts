import Redis from "ioredis";
import { redis, cripto } from "../../configs";
import { verify, sign } from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid';

class AuthRedis{
  public redis: Redis;
  public sessionId = uuidv4();
  private timeExpire = String(60*30);

  constructor(){
    this.redis = new Redis(redis);
  }

  public async createCookie(){
    const value = await sign({sessionId:this.sessionId}, cripto.secret);
    const expire = this.timeExpire;
    return {value, expire};
  }

  public async readCookie(cookie:string){
    const payload = verify(cookie, cripto.secret);
    return payload;
  }

  public async initSession(userId:string){
    const value = this.setValue(userId);
    await this.redis.setex(this.sessionId, this.timeExpire, JSON.stringify(value));
  }

  public setValue(userId:string){
    return {
      id:userId
    }
  }

  public refreshSession(id:string, expire:boolean){
    if(expire){
      this.redis.expire(id, this.timeExpire);
    }else{
      this.redis.expire(id, -1);
    }
  }
}

export default AuthRedis;