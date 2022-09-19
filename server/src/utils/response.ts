import {Response} from 'express';

class ResponseHandler{
  private status:number;
  private body:Object|null;

  public constructor(status:number, msg:Object|null){
    this.status = status;
    this.body = msg;
  }

  public send(res:Response){
    if(!this.body){
      res.sendStatus(this.status);
    }else{
      console.log(this.body);
      return res.status(this.status).json(this.body);
    }
  }

  public setCookie(res:Response, cookie:any){
    res.cookie(cookie.name, cookie.value, { maxAge: Number(cookie.expire)*1000 });
    return this;
  }
}

export default ResponseHandler;