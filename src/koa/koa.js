
const Koa = require ('koa')
const KoaRouter = require ('koa-router')
const fs = require ('fs')
const koaStaticCache = require ('koa-static-cache')
const BodyParser = require('koa-bodyparser')
const cors = require('cors')
const path = require('path')
const Swig = require ('koa-swig')
const co = require ('co')
const koaBody = require('koa-body')


const app = new Koa()
const router = new KoaRouter()
let file = path.join(__dirname, '../data.json'); //文件路径，__dirname为当前运行js文件的目录
    //var file = 'f:\\nodejs\\data\\test.json'; //也可以用这种方式指定路径

let todoData = JSON.parse(fs.readFileSync(file))
// app.context.render = co.wrap(Swig({
//     root: __dirname + '/viewa',
//     autoescape: true,
//     cache: false,
//     ext: 'html'
// }))

/**
 * @Desc:获取TODO列表
 * @param {type} 
 * @Author: yungkin
 * @return: 
 * @Create: 2019-11-18 20:19:01
 */
router.get('/todolist', async (ctx) => {
    
    ctx.body = {
        code: 100,
        data: todoData
    }
})
/**
 * @Desc: 添加TODO
 * @param {URL，data} 
 * @Author: yungkin
 * @return: 
 * @Create: 2019-11-18 20:20:37
 */
router.post('/addlist', async (ctx) => {
    let len = todoData.list.length
    // console.log(ctx.request.body)
    let body = JSON.parse(ctx.request.body)
    let lid = 0
    if(len>0){
        lid = todoData.list[len-1].id
    }
    
    let formData = {
        id: ++lid,
        title:  body.data.title,
        content: body.data.content,
        checkImportant: body.data.checkImportant,
        time: body.data.time,
        checked: body.data.checked
      }
        
    //   if(!formData.title || !formData.content){
    //       ctx.body = await ctx.render('message',{
    //           mes: "标题或内容不能为空",
    //           href: 'javascript:history.back()'
    //       })
    //       return
    //   }
    //   console.log(formData)
      todoData.list.push(formData)
      ctx.body = {
        code: 100,
        data: todoData
        }
    fs.writeFileSync(file, JSON.stringify(todoData))
})
/**
 * @Desc: 编辑TODO
 * @param {type} 
 * @Author: yungkin
 * @return: 
 * @Create: 2019-11-18 20:22:20
 */
router.post('/editlist/:id', async (ctx) => {
    let body = JSON.parse(ctx.request.body)
    let id = ctx.params.id
    
    if(!id){
        ctx.body = {
            code: -100,
            data: "请传入ID"
        }
        return;
    }
    // //find
    let todo = todoData.list.find(task => task.id == id)
        // todo.checked = !todo.checked
        todo = body.data
    // todoData.list.forEach( task => {
    //     if(task.id == id){
    //         task.checked = !task.checked
    //     }
    // })
   
    ctx.body = {
        code: 100,
        data: todo
    }
    fs.writeFileSync(file, JSON.stringify(todoData))
    // ctx.response.redirect('/')
})
/**
 * @Desc: 删除TODO
 * @param {type} 
 * @Author: yungkin
 * @return: 
 * @Create: 2019-11-18 20:22:34
 */
router.post('/deletelist', async (ctx) => {
    let body = JSON.parse(ctx.request.body)
    let id = body.data.id
    if(!id){
        ctx.body = {
            code: -100,
            data: "请传入ID"
        }
        return;
    }
    todoData.list = todoData.list.filter( task => task.id != id)
    ctx.body = {
        code: 100
    }
    fs.writeFileSync(file, JSON.stringify(todoData))
})

app.use(koaBody());
// 将公共逻辑方法放到中间件中处理
app.use(async (ctx, next)=> {
 
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    ctx.set('Access-Control-Allow-Credentials',true)
    ctx.set('Access-Control-Allow-Methods','GET, POST,OPTIONS, DELETE, PUT');
       
    ctx.set('Access-Control-Allow-Headers', 'Authorization,x-requested-with,Origin,Content-Type,Accept');
    ctx.set( 'Content-Type','application/json;charset=utf-8');
    // ctx.body = `Request Body: ${JSON.stringify(ctx.request.body)}`
    if(ctx.request.method === 'OPTIONS') {
        ctx.response.status = 204;
        } 
       await next();
})

app.use( router.routes())
// app.use((ctx,next) => {
//     router.routes()
//     next()
// })
// app.use((ctx,next)=> {
//     BodyParser()
//     next()
// })
// app.use((ctx,next)=> {
//     koaStaticCache('./public',{
//         Prefix: '/public',
//         Gzip: true
//     })
//     next()
// })

// app.use( 
//      cors({
//         origin: function (ctx) {
//           return 'http://localhost:3000'
//         },
//         credentials: true,
//         allowMethods: ['GET', 'POST','OPTIONS', 'DELETE', 'PUT'],
//         allowHeaders: ['cache-control','Content-Type','hash-referer','x-requested-with','Origin','Accept']
//       })
// )

app.listen(3100)