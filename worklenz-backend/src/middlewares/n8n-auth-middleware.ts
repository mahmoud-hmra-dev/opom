import {NextFunction, Request, Response} from "express";
import {IWorkLenzResponse} from "../interfaces/worklenz-response";

export default (fn: (_req: Request, _res: Response, next: NextFunction) => Promise<IWorkLenzResponse | void>)

: (req: Request, res: Response, next: NextFunction) => void => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers["authorization"];
    if (token === "mahmoudhmra") {
      void fn(req, res, next);
    } else {
      res.status(401).send({error: "Unauthorized"});
    }
  };


};
