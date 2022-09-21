import Redis from "ioredis";
import { redis, cripto } from "../../configs";
import { verify, sign } from 'jsonwebtoken';
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
    return await this.redis.get(cookie);
  }

  public async initSession(userId:string){
    const id = uuid();
    const value = this.setValue(userId);
    await this.redis.setex(id, this.timeExpire, JSON.stringify(value));
    return await this.createCookie(id);
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

const authRedis = new AuthRedis();

export default authRedis;