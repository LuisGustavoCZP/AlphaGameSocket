import PostgresDB from '../../clients/postgres/index';
import ResponseHandler from '../../utils/response';
import { cripto } from '../../configs';
import { compareSync } from 'bcrypt';
import { Request, Response } from 'express';
import AuthRedis from '../../clients/redis/auth';

class LoginHandler{
  static async init(req:Request, res:Response){
    const body = req.body;
    let row = (await LoginHandler.getUser(body.name) as any);

    if(row.length === 0){
      const response = new ResponseHandler(404, {error:"Usuario não encontrado"});
      response.send(res);
      return
    }

    row = row[0].row.replace(/[()]/g,'').split(',');

    const user = {password:row[0], id:row[1]};
    
    const isAuth = compareSync(body.password, user.password);
    if(!isAuth){
      const response = new ResponseHandler(401, {error:"Senha incorreta"});
      response.send(res);
      return;
    }

    const session = new AuthRedis();
    await session.initSession(user.id);
    const cookie = await session.createCookie();

    const response = new ResponseHandler(200, {data:{username:row[2]}});

    response.setCookie(res, {name:'token', ...cookie}).send(res);
  }

  static async getUser(name:string){
    return await PostgresDB.select('users', {username:name}, ['password', 'id', 'username']);
  }
}

export default LoginHandler;