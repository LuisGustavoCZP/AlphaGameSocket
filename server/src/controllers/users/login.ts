import PostgresDB from '../../clients/postgres/index';
import ResponseHandler from '../../utils/response';
import { cripto } from '../../configs';
import { compareSync } from 'bcrypt';
import { Request, Response } from 'express';
import redis from '../../clients/redis';

class LoginHandler{
  static async init(req:Request, res:Response){
    const body = req.body;
    let row = (await LoginHandler.getUser(body.name) as any);

    if(row.length === 0){
      const response = new ResponseHandler(400, {error:"Usuario não encontrado"});
      response.send(res);
      return
    }


    const user = {password:row[0].password, id:row[0].id};
    
    const isAuth = compareSync(body.password, user.password);
    if(!isAuth){
      const response = new ResponseHandler(400, {error:"Senha incorreta"});
      response.send(res);
      return;
    }

    const session = redis.auth;
    const cookie = await session.initSession(user.id);

    const response = new ResponseHandler(200, {data:{username:row[2]}});

    response.setCookie(res, {name:'token', ...cookie}).send(res);
  }

  static async getUser(name:string){
    return await PostgresDB.select('users', {username:name}, ['password', 'id', 'username']);
  }
}

export default LoginHandler;