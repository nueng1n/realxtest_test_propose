import { Request, Response, NextFunction } from 'express';
import { get, controllerPath, middleware, post } from '../decorators';
import { AppDataSource } from "../data-source"
import { Post } from '../entity/Post';
import { checkToken } from '../util/jwt'

@controllerPath('/post', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
class PostRoute {


    @post('/')
    @middleware((req: Request, res: Response, next: NextFunction): void => {
        console.log("post page posts");
        next();
    })
    async getPostPage(req: Request, res: Response): Promise<void> {
        type OrderByDirection = "ASC" | "DESC";
        interface Order {
            field: string;
            order: OrderByDirection;
        }

        let { currentPage, search, filterTag, orders } = req.body;
        const resultsPerPage = 100;
        const skip = (currentPage - 1) * resultsPerPage;

        let queryBuilder = AppDataSource.getRepository(Post)
            .createQueryBuilder("p")
            .leftJoinAndSelect("p.user", "user")
            .leftJoinAndSelect("p.tags", "tag")


        if (search) {
            queryBuilder = queryBuilder
                .andWhere("(p.post_title LIKE :keyword OR p.post_content LIKE :keyword)", { keyword: `%${search}%` });
        }

        if (filterTag) {
            queryBuilder = queryBuilder
                .andWhere("tag.tag_name LIKE :tag", { tag: `%${filterTag}%` });
        }

        if (orders && orders.length > 0) {
            orders.forEach((order: Order) => {
                const { field, order: direction } = order;
                if (field && (direction === "ASC" || direction === "DESC")) {
                    queryBuilder = queryBuilder.orderBy(`p.${field}`, direction as OrderByDirection);
                }
            });
        }

        queryBuilder
            .skip(skip)
            .take(resultsPerPage);

        const getResultPost = await queryBuilder.getMany();
        const totalPosts = await queryBuilder.getCount();
        const totalPages = Math.ceil(totalPosts / resultsPerPage);

        res.status(200).send({
            totalPages: totalPages,
            currentPage: currentPage,
            posts: getResultPost
        });
    }




}