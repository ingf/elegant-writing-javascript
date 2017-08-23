// Middleware Cascading
import Koa from 'koa'

const app = new Koa()

app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  ctx.set({ 'X-Response-Time': `${ms} ms` })
})

app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log('%s %s - %s ms', ctx.method, ctx.url, ms)
})

app.use(async (ctx, next) => {
  await next()
  ctx.body = 'Hello World'
})

app.on('error', (error, ctx) => {
  console.error('server error: ', error, ctx)
})

app.listen(3000)

// // Koa core
// import Koa from 'koa'

// const app = new Koa()

// app.use(ctx => {
//   ctx.body = 'Hello World'
// })

// app.listen(3000)
