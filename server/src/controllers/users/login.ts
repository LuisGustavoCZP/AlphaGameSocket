import PostgresDB from '../../clients/postgres/index';
import ResponseHandler from '../../utils/response';
import { cripto } from '../../configs';
import { compareSync } from 'bcrypt';
import { Request, Response } from 'express';
import AuthRedis from '../../clients/redis/auth';

class LoginHandler{
  static async init(req:Request, res:Response){
    const body = req.body;
    let row = (await LoginHandler.getUser(body.name))[0] as any;
    row = row.row.replace(/[()]/g,'').split(',')

    const user = {password:row[0], id:row[1]};
    
    const isAuth = compareSync(body.password, user.password);
    if(!isAuth){
      const response = new ResponseHandler(401, {error:"Not allowed, password wrong."});
      response.send(res);
    }

    const session = new AuthRedis();
    await session.initSession(user.id);
    const cookie = await session.createCookie();

    // await LoginHandler.log()
    const response = new ResponseHandler(200, null);

    response.setCookie(res, {name:'token', ...cookie}).send(res);
  }

  // static async log(name:string){
  //   const datenow = (new Date()).toLocaleDateString();
  //   await PostgresDB.update('users', {update_at:datenow, logged_at:datenow}, {username:name})
  // }

  static async getUser(name:string){
    return await PostgresDB.select('users', {username:name}, ['password', 'id']);
  }
}

export default LoginHandler;