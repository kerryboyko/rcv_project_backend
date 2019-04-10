import { Request, Response, NextFunction } from 'express';
import jwt from 'express-jwt';
export declare const jwtSecret: jwt.SecretCallback;
export declare const checkJwt: jwt.RequestHandler;
export declare const checkScope: any;
export declare const checkRole: (role: string) => (req: Request, res: Response, next: NextFunction) => void | import("express-serve-static-core").Response;
declare const _default: {
    checkScope: any;
    checkJwt: jwt.RequestHandler;
    checkRole: (role: string) => (req: Request, res: Response, next: NextFunction) => void | import("express-serve-static-core").Response;
};
export default _default;
//# sourceMappingURL=auth.d.ts.map