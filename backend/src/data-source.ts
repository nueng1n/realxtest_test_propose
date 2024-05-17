import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Post } from "./entity/Post"
import { PostTag } from "./entity/PostTag"
import { Tag } from "./entity/Tag"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env['POSTGRES_HOST'],
    port: process.env['POSTGRES_PORT'] ? parseInt(process.env['POSTGRES_PORT'], 10) : undefined,
    username: process.env['POSTGRES_USER'],
    password: process.env['POSTGRES_PASSWORD'],
    database: process.env['POSTGRES_DB'],
    synchronize: true,
    logging: false,
    entities: [User, Post ,PostTag , Tag ],
    migrations: [],
    subscribers: [],
})
