import { Request, Response } from 'express';
import { NameValidator, PasswordValidator, EmailValidator} from '../../validators';
import { hashSync } from 'bcrypt';
import { cripto } from '../../configs';
import ResponseHandler from '../../utils/response';
import PostgresDB from '../../clients/postgres/index';
import { User } from '../../models';
import { v4 as uuid } from 'uuid';
//verificar e limpar o body (1)
//criar instancia de model (2)
//inserir intancia na tabela (3)
//retorna resposta - 400-> 1) // 505->(2)/(3) // 201->(sucess)

class HandlerRegister{
  static init(req:Request, res:Response){
    const body = req.body;
    const sanitizeBody = HandlerRegister.sanitize(body);

    if(typeof sanitizeBody === 'string'){
      const response = new ResponseHandler(400, {error:sanitizeBody.substring(0,sanitizeBody.length-1)});
      response.send(res);
    }else{
      (sanitizeBody as any).id = uuid();
      
      const avatar = (sanitizeBody as any).avatar;
      if(avatar) delete (sanitizeBody as any).avatar;

      PostgresDB.insert('users', sanitizeBody).then(result=>{
        const response = new ResponseHandler(201, {data:{}});
        response.send(res);
      }).catch(()=>{
        const response = new ResponseHandler(503, {error:"service temporarily unavailable"});
        response.send(res);
      });
    }
  }

  static sanitize(body:any){
    const name = new NameValidator(body.name);
    const password = new PasswordValidator(body.password);
    const email = new EmailValidator(body.email);

    const error = name.errors + password.errors + email.errors;
    if(error){
      return error;
    }else{
      const user:User = {
        username:name.data,
        email:email.data,
        password:hashSync(password.data, cripto.saltRounds)
      };
      return user;
    }
  }
}

export default HandlerRegister;