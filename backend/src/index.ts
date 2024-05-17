import { AppDataSource } from "./data-source"
import { LoadDataAndInsertUserHashPassword, LoadDataAndInsertPost } from "./mirgation"
import express from 'express';
import cors from 'cors';
import { customParser } from "./util/customParser";
import { AppRouter } from './AppRouter'
import './routes/RouteIndex'

process.on('unhandledRejection', (reason, p) => {
    console.log('\x1b[33m%s\x1b[0m', "Warning unhandledRejection");

    console.log("==> ", p, reason)

});
process.on('uncaughtException', (reason, p) => {
    console.log('\x1b[33m%s\x1b[0m', "Warning uncaughtException");
    console.log("==> ", p, reason)
    process.exit(1)
});

const app = express();
app.use(cors());
app.use(customParser)
app.use(AppRouter.getInstance());

AppDataSource.initialize().then(async () => {

    console.log("Database Init");
    

    //Dont do this in production
    console.log("Start seed operation ... ");
    let usernameToIdMap = await LoadDataAndInsertUserHashPassword('jsonfiles/users.json')
    let result = await LoadDataAndInsertPost('jsonfiles/posts.json', usernameToIdMap)

    // let result=true //for dev
    if (result) {

        console.log("Complete seed operation ... ");

        app.listen(process.env['EXPRESS_PORT'], () => {
            console.log(`Listening on port ${process.env['EXPRESS_PORT']}`);
        });
    }





}).catch(error => console.log(error))

