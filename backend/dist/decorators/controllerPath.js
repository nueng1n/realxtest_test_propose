"use strict";
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
exports.controllerPath = void 0;
require("reflect-metadata");
const AppRouter_1 = require("../AppRouter");
const MetadataKeys_1 = require("./MetadataKeys");
function controllerPath(routePrefix, golbalMiddleware) {
    return function (target) {
        const router = AppRouter_1.AppRouter.getInstance();
        Object.getOwnPropertyNames(target.prototype).forEach((key) => {
            const routeHandler = target.prototype[key];
            const path = Reflect.getMetadata(MetadataKeys_1.MetadataKeys.path, target.prototype, key);
            const method = Reflect.getMetadata(MetadataKeys_1.MetadataKeys.method, target.prototype, key);
            const middlewares = [];
            if (golbalMiddleware) {
                middlewares.push(golbalMiddleware);
            }
            const middlewares_ = Reflect.getMetadata(MetadataKeys_1.MetadataKeys.middleware, target.prototype, key) ||
                [];
            middlewares.push(...middlewares_);
            if (path) {
                let modRouteHandler = function (...args) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const [req, res, next] = args;
                            yield routeHandler(req, res, next);
                        }
                        catch (error) {
                            console.error(`method => ${key}`, error);
                            const [req, res, next] = args;
                            res.status(500).json({ error: 'An error occurred' });
                        }
                    });
                };
                router[method](`${routePrefix}${path}`, ...middlewares, modRouteHandler);
            }
        });
    };
}
exports.controllerPath = controllerPath;
