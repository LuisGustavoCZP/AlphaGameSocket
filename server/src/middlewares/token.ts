import { NextFunction, Request, Response } from 'express';
import redis from '../clients/redis';
import ResponseHandler from '../utils/response';

export async function tokenHandler (req : Request, res : Response, next : NextFunction)
{
    const token = req.cookies["token"] as string;
    const resp = await redis.auth.readCookie(token);
    if(!resp)
    {
        return new ResponseHandler(400, {error:"Não existe cookie"}).send(res);
    }

    (req as any)["userid"] = JSON.parse(resp).id;
    
    next();
}