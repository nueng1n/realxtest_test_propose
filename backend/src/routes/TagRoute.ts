import { Request, Response, NextFunction } from 'express';
import { get, controllerPath, middleware, post } from '../decorators';
import { AppDataSource } from "../data-source"
import { Tag } from '../entity/Tag';
import { checkToken } from '../util/jwt'


@controllerPath('/tag',async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {

        res.status(401).json({ message: 'Unauthorized: Token not provided' });

    } else {


        let resultCheck = await checkToken(token)
        if (resultCheck) {
            next();
        } else {

            res.sendStatus(403)
        }

    }


})

class TagRoute {

    @get('/')
    @middleware((req: Request, res: Response, next: NextFunction): void => {
        console.log("getTag PATH");
        next();
    })
    async getUser(req: Request, res: Response): Promise<void> {


        let queryBuilder =await  AppDataSource.getRepository(Tag).find()
            

        res.status(201).send(queryBuilder);


    }


}