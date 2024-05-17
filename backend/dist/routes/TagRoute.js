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
const Tag_1 = require("../entity/Tag");
const jwt_1 = require("../util/jwt");
let TagRoute = class TagRoute {
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryBuilder = yield data_source_1.AppDataSource.getRepository(Tag_1.Tag).find();
            res.status(201).send(queryBuilder);
        });
    }
};
__decorate([
    (0, decorators_1.get)('/'),
    (0, decorators_1.middleware)((req, res, next) => {
        console.log("getTag PATH");
        next();
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TagRoute.prototype, "getUser", null);
TagRoute = __decorate([
    (0, decorators_1.controllerPath)('/tag', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
], TagRoute);
