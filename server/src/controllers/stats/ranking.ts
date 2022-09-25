import { Request, Response } from 'express';
import rankingService from '../../services/ranking';
import ResponseHandler from '../../utils/response';

export async function rankingController(req : Request, res : Response) 
{
    const userid = (req as any).userid;
    const ranking = await rankingService.load(userid);
    new ResponseHandler(200, {data:ranking}).send(res);
}