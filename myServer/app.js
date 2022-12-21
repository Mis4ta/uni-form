let express = require("express"); // 加载express框架
let bodyParser = require("body-parser"); // body-parser是用于解析提交的数据
// 实例化express对象
let app = express();
//配置模板引擎body-parser一定要在app.use(router)挂载路由之前
app.use(bodyParser.urlencoded({extended: false, limit: '5mb'}));
app.use(bodyParser.json())


app.listen(8080, function () {
  console.log("服务已经开启，端口为:8080");
});


//设置跨域访问
app.all('*', function(req, res, next){
  res.header('Access-Control-Allow-Origin',  '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method === 'OPTIONS'){
    res.sendStatus(200);
  }else{
    next();
  }
})

//存放数据区域
let  imageUrl = ''

// 头像
app.post("/demo/image", (req, res) => {
 const body = req.body
 imageUrl = body
  res.send({
    status:0 ,
    msg:'请求成功',
    data:body//需要响应给客户端的具体数据
  });
});

//提交后的信息
app.post("/demo/UserInfo", (req, res) => {
  const body = req.body

   res.send({
     status:0 ,
     msg:'请求成功',
     data:{body,image:imageUrl}
   });
 });
