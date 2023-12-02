import { Request, Response } from 'express'

export type ControllerFN = (req: Request, res: Response) => Promise<any> | any