## base-extend-backbone

![](https://travis-ci.org/sapling-team/base-extend-backbone.svg?branch=master)

### How Install 

i recommended useing `npm info` check `base-extend-backbone` version and useing `npm install base-extend-backbone`

    npm install base-extend-backbone

```JavaScript
var base = require('base-extend-backbone');
var BaseModel = base.Model;
var BaseView = base.View;
var BaseRouter = base.Router;
```

### How Use it

`Model`，`Router`，`View`因为涉及业务编程，只支持require方式载入。

推荐构建工具：[webpack](https://webpack.github.io/)

这个项目是基于`backbone`的一个扩展，理论上来说你使用原始的`backbone`来构建你的应用与此扩展并不冲突，如果你想使用此扩展，那么你将拥有一个完整的`生命周期`和便捷的操作`Model`的实例方法。

在此扩展中需要依赖两个`Tag Key`关键字来载入相应的模块

```JavaScript
var tplEng = require('tplEng');
```

`base.View`针对模板渲染部分引入了一个第三方库为[artTemplate](https://github.com/aui/artTemplate)

```JavaScript
var Config = require('config');
```

引入一个配置文件来开启相应的警告信息，完整的`config`：

```JavaScript
var config = {
    scheme: 'alpha',
    env:{
        alpha:{
            'url_prefix':'http://127.0.0.1:8081'
        },
        beta:{
            'url_prefix':'http://beta.com:8081'
        },
        release:{
            'url_prefix':'http://aip.com'
        }
    },
    debug:true
};
module.exports = config;
```

- scheme 定义你请求的环境，`alpha`为初始环境（本地mock），`beta`为测试环境（测试服务器），`release`为生产环境（最终部署）
- debug 如果设置为true，扩展内部将打印相应的警告信息（有助于开发者调试）

这意味着你需要在构建脚本中启用`config`和`tplEng`两个别名分别对应`artTemplate`和`你的config.js`配置文件。

### base.View Life Cycle

![](https://raw.githubusercontent.com/sapling-team/base-extend-backbone/master/img/BaseView%20Life%20Cycle.png)

### base.Router Life Cycle as base.View

![](https://raw.githubusercontent.com/sapling-team/base-extend-backbone/master/img/BaseRouter%20Life%20Cycle%20as%20BaseView.png)

### Fetch Info

- [API文档](https://github.com/sapling-team/base-extend-backbone/blob/master/doc/api.md)
- [Demo 例子](https://github.com/sapling-team/base-extend-backbone/blob/master/doc/fn.md)

@icepy MIT