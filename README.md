## base-extend-backbone

[![Build Status](https://travis-ci.org/sapling-team/base-extend-backbone.svg?branch=master)](https://travis-ci.org/sapling-team/base-extend-backbone)
[![Coverage Status](https://coveralls.io/repos/github/sapling-team/base-extend-backbone/badge.svg?branch=master)](https://coveralls.io/github/sapling-team/base-extend-backbone?branch=master)

### How Install

i recommended using `npm info` check `base-extend-backbone` version and using `npm install base-extend-backbone`

    npm install base-extend-backbone


```JavaScript
var base = require('base-extend-backbone');
var BaseModel = base.Model;
var BaseView = base.View;
var BaseRouter = base.Router;
var ManagedObject = base.ManagedObject;
```

### How Use it

base-extend-backbone只支持require方式载入，所以你必须从npm上下载，并使用构建工具来处理它。

recommended build kit：[webpack](https://webpack.github.io/)

`base-extend-backbone` 是基于`backbone`的一个扩展，理论上来说你使用原始的`backbone`来构建你的应用与此扩展并不冲突，如果你想使用此扩展，那么你将拥有一个完整的`View生命周期`，`基于Router的生命周期`和便捷操作`Model`的实例方法。

在此扩展中需要依赖两个`Tag Key`关键字：

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
    }
};
module.exports = config;
```

- scheme 定义你请求的环境，`alpha`为初始环境（本地mock），`beta`为测试环境（测试服务器），`release`为生产环境（最终部署）

这意味着你需要在构建脚本中启用`config`和`tplEng`两个别名分别对应`artTemplate`和`你的config.js`配置文件。

### base.View Life Cycle

![](https://raw.githubusercontent.com/sapling-team/base-extend-backbone/master/doc/img/BaseView%20Life%20Cycle.png)

### base.Router Life Cycle as base.View

![](https://raw.githubusercontent.com/sapling-team/base-extend-backbone/master/doc/img/BaseRouter%20Life%20Cycle%20as%20BaseView.png)

### Fetch Info

- [API文档](https://github.com/sapling-team/base-extend-backbone/blob/master/doc/api.md)
- [the base-extend-backbone and backbone programming guide](https://github.com/sapling-team/base-extend-backbone/blob/master/doc/guide.md)

@icepy MIT
