import { NextFunction, Request, Response } from 'express';
import redis from '../clients/redis';
import ResponseHandler from '../utils/response';
import jwt from 'jsonwebtoken';
import { sessionConfig, cripto } from '../configs';
import { error } from 'console';

export async function tokenHandler (req : Request, res : Response, next : NextFunction)
{
    const token = req.cookies["token"] as string;
    if(!token)
    {
        return new ResponseHandler(400, {error:"Não existe cookie"}).send(res);
    }

    const resp : {id:string, username:string} = await new Promise((resolve, reject) => (
        jwt.verify(token, cripto.secret, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded as any);
        })
    ));
    
    //await redis.auth.readCookie(token);
    if(!resp)
    {
        res.clearCookie("token");
        return new ResponseHandler(400, {error:"O cookie é inválido"}).send(res);
    }

    console.log(resp);
    (req as any)["userid"] = resp.id;
    
    next();
}