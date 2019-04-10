import { Request, Response, NextFunction } from 'express';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import expressJwtAuthZ from 'express-jwt-authz';
import config from '../config';

const { AUTH0_AUDIENCE, AUTH0_DOMAIN } = config;

export const jwtSecret = jwksRsa.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
});

export const checkJwt: jwt.RequestHandler = jwt({
  // dynamically provide a signing key based on the kid in the header
  // and the signing keys provided by the JWKS endpoint
  secret: jwtSecret,
  audience: AUTH0_AUDIENCE,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

export const checkScope = expressJwtAuthZ;

// we may need to provide a dynamic checkrole function which
// takes the data from req.params or req.query for role endpoints

export const checkRole = (role: string) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const assignedRoles = req.user['http://localhost:3000/roles'];
  if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
    return next();
  }
  return res.status(401).send('Insufficient Role');
};

export default { checkScope, checkJwt, checkRole };
