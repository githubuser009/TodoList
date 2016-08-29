angular.module('starter.controllers', [])

.controller('MenuCtrl', function ($scope, $rootScope) {

    //关联 setting 的变量
    $scope.leftOrRight = $rootScope.isMenuSide;

})

.controller('ListCtrl', function ($scope, $ionicModal, $ionicListDelegate, $rootScope) {

    //关联 setting 的变量
    $scope.isShowCompleted = $rootScope.isShowCompleted;

    //读取task.json，初始化$scope.items (cordova will be a 404 during development)
    $scope.items = [];
    var idFlag = 0;

    //console.log("ListCtrl readFile fail. error: ", e);
    //文件系统问题读取文件失败，或初次打开文件为空，造成读取值为undefined错误
    if (fileOb && fileStr) {
        $scope.items = angular.fromJson(fileStr);//文件格式是一个 object array （ [{},{}] ）
        idFlag = $scope.items.length;
    }
    else if (fileOb && !fileStr) {
        $scope.items = [{ "id": 0, "text": "按此滑动可打开编辑菜单", "priority": 2, "completed": false }];
    }
    else {
        $scope.items = [{ "id": 0, "text": "可能无法读写数据，文件系统不兼容", "priority": 2, "completed": false }];
    }

    $ionicModal.fromTemplateUrl('templates/add.html', {
        scope: $scope,
        focusFirstInput: true
    }).then(function (modal) {
        $scope.addModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/edit.html', {
        scope: $scope,
        focusFirstInput: true
    }).then(function (modal) {
        $scope.editModal = modal;
    });

    $scope.selectedItem = {};//editModal
    $scope.openModal = function (modal, item) {
        modal.show();
        if (item) { //editModal
            $scope.selectedItem = item;
            //document.querySelector("select").selectedIndex  = item.priority-1;
            document.querySelector("select").value = item.priority;
            /* angularjs select的特点，暂未解决新item第一次修改时优先级显示不正常的问题。
			*/
        }
    };
    $scope.closeModal = function (modal) {
        modal.hide();
        $ionicListDelegate.closeOptionButtons();//editModal 关闭划开的ion-option-button菜单
    };

    $scope.addItem = function (u) {
        if (u.text == '' || u.text == null) return;
        $scope.items.push({ id: idFlag, text: u.text, priority: parseInt(u.priority), completed: false });
        idFlag++;
        document.querySelector("input").value = "";//再次打开后遗留上次的值，需重置。取消操作中未重置。
        document.querySelector("select").value = "2";
        $scope.closeModal($scope.addModal);
        $scope.save();
    };

    $scope.editItem = function (sItem) {
        $scope.items[sItem.id] = sItem;//selectedItem重新赋值回items
        $scope.closeModal($scope.editModal);
        $scope.save();
    };

    $scope.completedItem = function (item) {
        item.completed = item.completed ? false : true; //使已完成和未完成可互相切换
        $scope.save();
    };

    $scope.deleteItem = function (item) {
        $scope.items.splice($scope.items.indexOf(item), 1);
        //重排序id
        for (var i = 0; i < $scope.items.length; i++) {
            $scope.items[i].id = i;
        }
        idFlag = $scope.items.length;
        $scope.save();
    };

    $scope.save = function () {
        writeFile($scope.items);
    };

})

.controller('SettingCtrl', function ($scope, $state, $rootScope) {

    // 设置 是否显示 已完成任务
    $scope.showCompleted = { checked: true };
    $scope.showCompletedChange = function () {
        $rootScope.isShowCompleted.value = $scope.showCompleted.checked;
    };

})

.controller('AboutCtrl', function ($http, $scope, $state) {
    $http.get("js/info.json").success(function (response) {
        var info = angular.fromJson(response.info);
        $scope.version = info.version;
        $scope.publishtime = info.publishtime;
        $scope.github = info.github;
        $scope.email = info.email;
        $scope.weixin = info.weixin;
        $scope.weixinurl = info.weixinurl;
        $scope.weixinimg = info.weixinimg;
        $scope.description = info.description;
        console.log("读取info.json成功！")
    }).error(function () { console.log("读取info.json失败！") });
});

