import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaBody from 'koa-bodyparser';
import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa';

// import './db'

// import schema from './schema/schema'
// import schema from "./schema1"
import schema from './schema/schema2.js';

const app = new Koa();
const router = new KoaRouter();
const PORT = 3000;

app.use(koaBody());

router.all('/graphql', graphqlKoa({ schema }));
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(PORT, () => {
  const port = server.address().port;
  console.log('GraphQL listening at http://localhost:%s/graphiql', port);
});
