require('dotenv').config();
const express = require('express');
const http = require('http');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');

const appUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT}`;

const app = express();

app.use(jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.API_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
}));

app.get('/', jwtAuthz(['reports:read']), (req, res) => {
  res.send([
    {
      date: new Date(),
      description: 'Pizza for a Coding Dojo session.',
      value: 102,
    },
    {
      date: new Date(),
      description: 'Coffee for a Coding Dojo session.',
      value: 42,
    }
  ]);
});

http.createServer(app).listen(process.env.PORT, () => {
  console.log(`listening on ${appUrl}`);
});
