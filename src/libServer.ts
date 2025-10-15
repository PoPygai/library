
import express from 'express';
import {configuration} from "./config/libConfig.js";
import {errorHandler} from "./errorHandler/errorHandler.js";
import {libRouter} from "./rauters/libRouter.js";
import morgan from "morgan";
import * as fs from "node:fs";
import * as mongoose from "mongoose";
import dotenv from 'dotenv';
import {accountRouter} from "./rauters/accountRouter.js";
import {authenticate, skipRoutes} from "./middleware/authentication.js";
import {authorize, userReqNumberCheck} from "./middleware/authorization.js";
import {Role} from "./utils/libTypes.js";



export const launchServer = () => {
    //================load environments==================
    dotenv.config();
    //=================Mongo Connection===================
    mongoose.connect(process.env.MONGO_DB!).then(() => console.log("Server connected with Mongo"))
        .catch(err => console.log(err))
    //=============Server================================
    const logStream = fs.createWriteStream('./src/access.log',{flags:"a"})
    const app = express();
    app.listen(configuration.port, () => console.log(`Server runs at http://localhost:${configuration.port}`))

    //===============Middleware====================
    app.use(morgan('dev'));
    app.use(morgan('combined', {stream: logStream}));
    app.use(authenticate(configuration.accService));
    app.use(skipRoutes(configuration.skipPaths));
    app.use(authorize(configuration.pathsRoles as Record<string, Role[]>));
    app.use(userReqNumberCheck(configuration.time_window_sec, configuration.request_limit));
    app.use(express.json());

    //===============Router========================
    app.use('/accounts', accountRouter);
    app.use('/api',libRouter);
    //==============ErrorHandler===================
    app.use(errorHandler);

}