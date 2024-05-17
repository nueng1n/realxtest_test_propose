import { Request, Response, NextFunction } from 'express';
import { get, controllerPath, middleware, post } from '../decorators';
import { generateToken } from '../util/jwt'
import { checkHashPassword } from '../util/bcr'
import { User } from '../entity/User';
import { AppDataSource } from "../data-source"


@controllerPath('/user')
class UserRoute {

    @post('/login')
    @middleware((req: Request, res: Response, next: NextFunction): void => {
        console.log("login");
        next();
    })
    async login(req: Request, res: Response): Promise<void> {


        let { username, password } = req.body


        const user = await AppDataSource
            .getRepository(User)
            .createQueryBuilder("user")
            .where("user.username = :username", { username: username })
            .addSelect("user.password")
            .getOne()

        if (user) {

            let checkResult = await checkHashPassword(password, user.password)

            if (checkResult) {
                
                const token = generateToken({ username: req.body.username });
                res.json({ message: 'Login successful' , token});
            } else {

                res.status(401).json({ message: 'Incorrect username or password' });
            }


        }


    }

}
