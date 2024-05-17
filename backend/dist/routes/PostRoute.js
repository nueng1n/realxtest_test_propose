"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../decorators");
const data_source_1 = require("../data-source");
const Post_1 = require("../entity/Post");
const jwt_1 = require("../util/jwt");
let PostRoute = class PostRoute {
    getPostPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { currentPage, search, filterTag, orders } = req.body;
            const resultsPerPage = 100;
            const skip = (currentPage - 1) * resultsPerPage;
            let queryBuilder = data_source_1.AppDataSource.getRepository(Post_1.Post)
                .createQueryBuilder("p")
                .leftJoinAndSelect("p.user", "user")
                .leftJoinAndSelect("p.tags", "tag");
            if (search) {
                queryBuilder = queryBuilder
                    .andWhere("(p.post_title LIKE :keyword OR p.post_content LIKE :keyword)", { keyword: `%${search}%` });
            }
            if (filterTag) {
                queryBuilder = queryBuilder
                    .andWhere("tag.tag_name LIKE :tag", { tag: `%${filterTag}%` });
            }
            if (orders && orders.length > 0) {
                orders.forEach((order) => {
                    const { field, order: direction } = order;
                    if (field && (direction === "ASC" || direction === "DESC")) {
                        queryBuilder = queryBuilder.orderBy(`p.${field}`, direction);
                    }
                });
            }
            queryBuilder
                .skip(skip)
                .take(resultsPerPage);
            const getResultPost = yield queryBuilder.getMany();
            const totalPosts = yield queryBuilder.getCount();
            const totalPages = Math.ceil(totalPosts / resultsPerPage);
            res.status(200).send({
                totalPages: totalPages,
                currentPage: currentPage,
                posts: getResultPost
            });
        });
    }
};
__decorate([
    (0, decorators_1.post)('/'),
    (0, decorators_1.middleware)((req, res, next) => {
        console.log("post page posts");
        next();
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostRoute.prototype, "getPostPage", null);
PostRoute = __decorate([
    (0, decorators_1.controllerPath)('/post', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            res.status(401).json({ message: 'Unauthorized: Token not provided' });
        }
        else {
            let resultCheck = yield (0, jwt_1.checkToken)(token);
            if (resultCheck) {
                next();
            }
            else {
                res.sendStatus(403);
            }
        }
    }))
], PostRoute);
