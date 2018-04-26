# superCounter
银行超级智能柜

注：electron打包教程和超柜结构图请访问https://github.com/leowang199303/electron-.git

一：业务实现

.超级智能柜（下称超柜）为一款银行网点自主银行业务的桌面应用，客户可实现自助开卡，购买金融产品，修改卡信息等常规银行网点窗口业务。

.可对接设备，调取指纹仪，摄像头，读卡，退卡设备，实现柜员授权验证，拍照功能。

.减少由于银行网点客户的过多造成柜台窗口压力过大的情况出现。




二：技术支持

.基于AngularJS 1x 实现的单页面应用

.使用Electron打包的桌面应用




三：项目结构

项目页面结构分为上，中，下三部分。

代码结构在tpl中，其中header为上，footer为下，中间content切换内容。


. assets   --资源目录（包含插件）

. css      --样式目录

. fonts

. images   --图片目录

. js       --js文件

. json     --数据目录（主要为接口数据）

. tpl      --HTML目录（共享板块）包括 定时器，footer,header等

. views    --HTML目录（项目页面）



四：重点文件以及配置

1 index.html为启动文件，项目根目录在此列

2 js/controller/tssDevice 目录下得文件为外设调用封装接口，如读卡，退卡以及键盘相机

3 js/service/comservice 文件为ajax封装服务，调用时，可使用common_service

4 js/controller/TSSDeviceTools.js 为外设得调用方法封装，内置对象可查找具体方法得具体参数，暴露出来调用得方法为window.TSSDeviceTools

5  js/main.js 为项目路由配置文件。项目环境下IP地址在此文件总修改。参数为首行 ipAdre



