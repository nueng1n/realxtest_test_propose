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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
const mirgation_1 = require("./mirgation");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const customParser_1 = require("./util/customParser");
const AppRouter_1 = require("./AppRouter");
require("./routes/RouteIndex");
process.on('unhandledRejection', (reason, p) => {
    console.log('\x1b[33m%s\x1b[0m', "Warning unhandledRejection");
    console.log("==> ", p, reason);
});
process.on('uncaughtException', (reason, p) => {
    console.log('\x1b[33m%s\x1b[0m', "Warning uncaughtException");
    console.log("==> ", p, reason);
    process.exit(1);
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(customParser_1.customParser);
app.use(AppRouter_1.AppRouter.getInstance());
data_source_1.AppDataSource.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Database Init");
    //Dont do this in production
    console.log("Start seed operation ... ");
    let usernameToIdMap = yield (0, mirgation_1.LoadDataAndInsertUserHashPassword)('jsonfiles/users.json');
    let result = yield (0, mirgation_1.LoadDataAndInsertPost)('jsonfiles/posts.json', usernameToIdMap);
    // let result=true //for dev
    if (result) {
        console.log("Complete seed operation ... ");
        app.listen(process.env['EXPRESS_PORT'], () => {
            console.log(`Listening on port ${process.env['EXPRESS_PORT']}`);
        });
    }
})).catch(error => console.log(error));
