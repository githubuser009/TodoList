
//$ionicPlatform.ready(function () {
ionic.Platform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
    }

    if (window.cordova) {
        //console.log("Running in Cordova, will bootstrap AngularJS once 'deviceready' event fires.");
        document.addEventListener('deviceready', onDeviceReady, false);
    } else {
        console.log("Running in browser,Cordova FileSystem invalid, bootstrapping AngularJS now.");
        angularBootstrap();//angular.bootstrap(document.body, ['starter']);
    }
});

// Ionic Starter App

angular.module('starter', ['ionic', 'starter.controllers'])

.run(function ($ionicPlatform, $rootScope) {

    /* 用于 setting 与其它view关联  的公共变量 */
    $rootScope.isShowCompleted = { value: true };
    $rootScope.isMenuSide = { side: "left" };//初始渲染时有两个元素默认为left，还有写在style=""中的transform,使side和menu-toggle的right出现错误
                        
})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.navBar.alignTitle('center');//修正手机中标题显示变成left的问题

    $stateProvider
      .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: 'templates/menu.html',
          controller: 'MenuCtrl'
      })
      .state('app.list', {
          url: '/list',
          views: {
              'menuContent': {
                  templateUrl: 'templates/list.html',
                  controller: 'ListCtrl'
              }
          }
      })
      .state('app.setting', {
          url: '/setting',
          views: {
              'menuContent': {
                  templateUrl: 'templates/setting.html',
                  controller: 'SettingCtrl'
              }
          }
      })
      .state('app.about', {
          url: '/about',
          views: {
              'menuContent': {
                  templateUrl: 'templates/about.html',
                  controller: 'AboutCtrl'
              }
          }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/list');
});


/* 文件读写   globals console,document,window,cordova */
var fileOb;//文件对象
var fileStr;//文件字符串

function onDeviceReady() {

    window.resolveLocalFileSystemURL(window.cordova.file.dataDirectory, function (dir) {
        //console.log("action got main dir", dir);
        dir.getFile("task.json", { create: true }, function (file) {
            //console.log("action got the file", file);
            fileOb = file;
            //console.log("App Ready! fileOb = file, ", fileOb);
        }, fail);
    });

    //window.resolveLocalFileSystemURL()是异步方法，暂使用setTimeout实现以下两个方法顺序执行
    //确保同步执行的方法 参考：promises, a JavaScript feature of the ECMAScript 6 standard. 
    //If your target platform does not support promises, polyfill it with PromiseJs.

    window.setTimeout(readFile, 1000);
    window.setTimeout(angularBootstrap, 2000);
}

function angularBootstrap() {
    //angular.bootstrap(document.body, ["starter"]);//多一层检测似乎更好一些？
    angular.element(document).ready(function () {
        angular.bootstrap(document.body, ["starter"]);
    });
}

function readFile() {
    if (!fileOb) { return console.log("cordova is undefined during development, fileOb = undefined,  readFile fail."); }
    fileOb.file(function (file) {
        var reader = new FileReader();
        reader.onloadend = function (e) {
            fileStr = this.result;
            console.log("Read json data from file, ok!");
        }
        reader.readAsText(file);
    }, fail);
}

function writeFile(items) {
    if (!fileOb) { return console.log("cordova is undefined during development, fileOb=null, save fail, writeFile fail."); }
    //var str = JSON.stringify(items);//angular自动在每个对象中加了一个 "$$hashKey":"object: 123"
    var str = angular.toJson(items);
    fileOb.createWriter(function (fileWriter) {
        //fileWriter.seek(fileWriter.length);
        fileWriter.seek(0);//position置为0，每次从文件开头写入 
        var blob = new Blob([str], { type: 'text/plain' });
        fileWriter.write(blob);
        console.log("Save json data to file, ok!");
    }, fail);
}

function fail(e) {
    console.log("FileSystem Error");
    console.log(e);//console.log prints the element in an HTML-like tree
    console.dir(e);//console.dir prints the element in a JSON-like tree
}