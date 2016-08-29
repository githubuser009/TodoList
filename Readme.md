# Readme #

先创建Ionic项目，添加cordova插件，然后替换本项目文件。

cmd：

    ionic start TodoList sidemenu
    
    cd TodoList 
    
    ionic platform add android
    
    cordova plugin add cordova-plugin-file

替换文件后即可。

在浏览器中查看效果：

    ionic serve

创建.apk文件：


    ionic build android

创建的.apk文件文件所在目录：platforms\android\build\outputs\apk\