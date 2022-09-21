import { Request, Response } from 'express';
import postgres from '../../clients/postgres';
import ResponseHandler from '../../utils/response';

export async function getUserHandler (req : Request, res : Response)
{
    const userid = (req as any).userid;
    console.log("O id do usuario é", userid);
    const data = await postgres.select("users", {id:parseInt(userid)}, ["id", "username"]);

    console.log(data);
    new ResponseHandler(200, {data}).send(res);
}