import {CookieOptions, Response} from 'express';

export const cookieOptions : CookieOptions = 
{
    sameSite:'none',
    secure:true,
    httpOnly:true
}

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
      return res.status(this.status).json(this.body);
    }
  }

  public setCookie(res:Response, cookie:any)
  {
    //const options = Object.assign({ maxAge: Number(cookie.expire)*1000 }, )
    //console.log(options);
    res.cookie(cookie.name, cookie.value, cookieOptions);
    return this;
  }

  public clearCookie(res:Response, cookieName:string)
  {
    //const options = Object.assign({ maxAge: Number(cookie.expire)*1000 }, )
    //console.log(options);
    res.clearCookie(cookieName, cookieOptions);
    //res.cookie(cookieName, cookie.value, cookieOptions);
    return this;
  }

}

export default ResponseHandler;