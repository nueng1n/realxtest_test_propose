import 'reflect-metadata';
import { AppRouter } from '../AppRouter';
import { Methods } from './Methods';
import { MetadataKeys } from './MetadataKeys';
import { RequestHandler } from 'express';


export function controllerPath(routePrefix: string, golbalMiddleware? : RequestHandler ) {
  
  return function (target: Function) {
    const router = AppRouter.getInstance();
    
    Object.getOwnPropertyNames(target.prototype).forEach((key) => {
      const routeHandler = target.prototype[key];
      const path = Reflect.getMetadata(
        MetadataKeys.path,
        target.prototype,
        key
      );
      const method: Methods = Reflect.getMetadata(
        MetadataKeys.method,
        target.prototype,
        key
      );


      const middlewares = []
      if(golbalMiddleware){
        middlewares.push(golbalMiddleware)
      }

      const middlewares_ =
        Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) ||
        [];

      middlewares.push( ...middlewares_ )

      if (path) {

        let modRouteHandler = async function (...args: any[]) {
          try {
            const [req, res, next] = args;
            await routeHandler(req, res, next)
          } catch (error) {
            console.error(`method => ${key}`, error);
            const [req, res, next] = args;
            res.status(500).json({ error: 'An error occurred' });
          }
        };


        router[method](
          `${routePrefix}${path}`,
          ...middlewares,
          modRouteHandler
        );
      }
    });
  };
}
