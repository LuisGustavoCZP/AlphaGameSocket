import Redis from "ioredis";
import { redis, cripto } from "../../configs";
import {v4 as uuid} from 'uuid';

class PlayerRedis 
{
  public redis: Redis;

  constructor()
  {
    this.redis = new Redis(redis);
  }

  public async get (userId : string)
  {
    return await this.redis.get(userId);
  }

  public async create (userId:string)
  {
    const id = uuid();
    await this.redis.set(userId, id);
    return id;
  }

  public async delete (userId : string)
  {
    await this.redis.del(userId);
  }
}

const playerRedis = new PlayerRedis();

export default playerRedis;