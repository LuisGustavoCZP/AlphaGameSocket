import { Request, Response } from 'express';
import historyService from '../../services/history';
import ResponseHandler from '../../utils/response';

export async function historyController(req : Request, res : Response) 
{
    const userid = (req as any).userid;
    const history = await historyService.load(userid);
    new ResponseHandler(200, {data:history}).send(res);
}