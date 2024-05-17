"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
const Post_1 = require("./entity/Post");
const PostTag_1 = require("./entity/PostTag");
const Tag_1 = require("./entity/Tag");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env['POSTGRES_HOST'],
    port: process.env['POSTGRES_PORT'] ? parseInt(process.env['POSTGRES_PORT'], 10) : undefined,
    username: process.env['POSTGRES_USER'],
    password: process.env['POSTGRES_PASSWORD'],
    database: process.env['POSTGRES_DB'],
    synchronize: true,
    logging: false,
    entities: [User_1.User, Post_1.Post, PostTag_1.PostTag, Tag_1.Tag],
    migrations: [],
    subscribers: [],
});
