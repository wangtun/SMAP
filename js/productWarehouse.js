/**
 * Created by liwanchong on 2016/12/15.
 */
var product = angular.module("product", ['dataService', 'nvd3']);
product.filter('showName', function() {
    var showObj = {
        1: 'mif',
        2: 'sqlite',
        3: 'tab',
        4: 'txt',
        5: 'mdb',
        6: 'gdf',
        7: 'shp',
        8: 'tsv'
    };
    return function(x) {
        return showObj[x];
    };
});
product.controller("productController", ['$scope', 'dsEdit','$location', function ($scope, dsEdit,$location) {
    $scope.getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    };
    $scope.ak = App.Temp.accessToken;
    $scope.specid = $scope.getQueryString('specid');
    $scope.specName = $scope.getQueryString('specName');
    $scope.flagId = "";
    $scope.modeid = 10;
    $scope.versionseason = '16WIN';
    $scope.dayFlag = true;
    $scope.monthFlag = false;
    $scope.seasonFlag = true;
    $scope.poiData = [];
    $scope.roadData = [];
    $scope.highSpeed = 0;
    $scope.interHighSpeed = 0;
    $scope.nationalRoad = 0;
    $scope.provincialRoad =0;
    $scope.otherRoad = 0;
    $scope.provinces = [];

    $scope.dayId = '';
    $scope.dayPage = 1;
    $scope.monthPage = 1;
    $scope.seasonPage = 1;
    $scope.pageSize = 10;
    $scope.dayTotal = 1;
    $scope.monthTotal = 1;
    $scope.seasonTotal = 1;
    $scope.description = '';

    //初始化表格数据
    $scope.dayProduceData = [];
    $scope.monthProduceData = [];
    $scope.seasonProduceData = [];

    $scope.bottomFlag = true;
    $scope.options = {
        chart: {
            type: 'pieChart',
            height: 300,
            x: function (d) {
                return d.key;
            },
            y: function (d) {
                return d.y;
            },
            showLabels: false,
            duration: 500,
            labelThreshold: 0.01,
            labelSunbeamLayout: true,
            legend: {
                margin: {
                    top: 5,
                    right: 30,
                    bottom: 5,
                    left: 0
                }
            }
        }
    };
    $scope.chartData = [];
    $scope.param = {
        specid: $scope.specid,
        modeid: $scope.modeid,
        page: 1,
        pageSize: $scope.pageSize,
        versionseason: $scope.versionseason
    };
    dsEdit.getProduct('dayproductlist.json', $scope.param).then(function (data) {
        $scope.dayProduceData = data.dayProductList;
        $scope.dayTotal = data.total;
        $scope.dayPage++;
    });
    dsEdit.getProduct('seasonproductlist.json', $scope.param).then(function (data) {
        $scope.seasonProduceData = data.seasonProductList;
        $scope.seasonPage++;
    });
    $scope.addDayProduct = function () {
        $scope.param.page = $scope.dayPage;
        if($scope.dayPage <= Math.ceil($scope.dayTotal/10)) {
            dsEdit.getProduct('dayproductlist.json', $scope.param).then(function (data) {
                $scope.dayProduceData = $scope.dayProduceData.concat(data.dayProductList);
                $scope.dayPage++;
            });
        }
    };
    $scope.addMonthProduct = function () {
        $scope.param.page = $scope.monthPage;
        if($scope.monthPage <= Math.ceil($scope.monthTotal/10)) {
            dsEdit.getProduct('monthproductlist.json', $scope.param).then(function (data) {
                $scope.monthProduceData = $scope.monthProduceData.concat(data.monthProductList);
                $scope.$scope.monthPage++;
            });
        }
    };
    $scope.addSeasonProduct = function () {
        $scope.param.page = $scope.seasonPage;
        if($scope.seasonPage <= Math.ceil($scope.seasonTotal/10)) {
            dsEdit.getProduct('seasonproductlist.json', $scope.param).then(function (data) {
                $scope.seasonProduceData = $scope.seasonProduceData.concat(data.seasonProductList);
                $scope.$scope.seasonPage++;
            });
        }
    };
    $scope.requestData = function (type) {
        switch (type) {
            case 10:
                dsEdit.getProduct('dayproductlist.json',  $scope.param).then(function (data) {
                    $scope.dayProduceData = data.dayProductList;
                    $scope.dayTotal = data.total;
                    $scope.dayPage++;
                });
                dsEdit.getProduct('seasonproductlist.json',  $scope.param).then(function (data) {
                    $scope.seasonProduceData = data.seasonProductList;
                    $scope.seasonTotal = data.total;
                    $scope.seasonPage++;
                });
                break;
            case 20:
                dsEdit.getProduct('dayproductlist.json',  $scope.param).then(function (data) {
                    $scope.dayProduceData = data.dayProductList;
                    $scope.dayTotal = data.total;
                    $scope.dayPage++;
                });
                dsEdit.getProduct('seasonproductlist.json',  $scope.param).then(function (data) {
                    $scope.seasonProduceData = data.seasonProductList;
                    $scope.seasonTotal = data.total;
                    $scope.seasonPage++;
                });
                break;
            case 30:
                dsEdit.getProduct('monthproductlist.json',  $scope.param).then(function (data) {
                    $scope.monthProduceData = data.monthProductList;
                    $scope.monthTotal = data.total;
                    $scope.monthPage++;
                });
                dsEdit.getProduct('seasonproductlist.json',  $scope.param).then(function (data) {
                    $scope.seasonProduceData = data.seasonProductList;
                    $scope.seasonTotal = data.total;
                    $scope.seasonPage++;
                });
                break;
            case 40:
                dsEdit.getProduct('seasonproductlist.json',  $scope.param).then(function (data) {
                    $scope.seasonProduceData = data.seasonProductList;
                    $scope.seasonTotal = data.total;
                    $scope.seasonPage++;
                });
                break;
        }
    };
    $scope.showStaticInfo = function (item) {
        $scope.flagId = item.product_id;
        $scope.staticParam = {
            specid: 11,
            modeid: $scope.modeid,
            versionseason: $scope.versionseason,
            productID: item.product_id
        };
        dsEdit.getProduct('stat.json',$scope.staticParam).then(function (data) {
            $scope.poiData = data.cnt.POI.split(",");
            $scope.roadData = data.cnt.ROAD.split(",");
            $scope.provinces = data.provinces;
            $scope.highSpeed = data.cnt['ROADSTAT-HW'];
            $scope.interHighSpeed = data.cnt['ROADSTAT-CG'];
            $scope.nationalRoad = data.cnt['ROADSTAT-NR'];
            $scope.provincialRoad =data.cnt['ROADSTAT-SD'];
            $scope.otherRoad = data.cnt['ROADSTAT-OTHER'];
            $scope.description = data.description.PDDES;
            $scope.chartData.length = 0;
            var chartKeys = Object.keys(data.scale);
            for (var i = 0, len =chartKeys.length; i < len; i++) {
                $scope.chartData.push({ key: chartKeys[i], y: data.scale[chartKeys[i]] });
            }
        })
    };
    $scope.modifyModeId = function (type) {
        $scope.modeid = type;
        $scope.param.modeid = type;
        $scope.initialiseData();
        $scope.requestData(type);
    };

    $scope.changVersionSeason = function (type) {
        $scope.versionseason = type;
        $scope.param.versionseason = type;
        $scope.initialiseData();
        $scope.requestData($scope.modeid);
    }
    $scope.initialiseData = function () {
        $scope.param.page = 1;
        $scope.poiData.length = 0;
        $scope.roadData.length = 0;
        $scope.highSpeed = 0;
        $scope.interHighSpeed = 0;
        $scope.nationalRoad = 0;
        $scope.provincialRoad =0;
        $scope.otherRoad = 0;
        $scope.description = '';
        $scope.provinces.length = 0;
        $scope.chartData.length = 0;

        //分页初始化
        $scope.dayPage = 1;
        $scope.monthPage = 1;
        $scope.seasonPage = 1;
        $scope.dayTotal = 1;
        $scope.monthTotal = 1;
        $scope.seasonTotal = 1;

        //表格数据
        $scope.dayProduceData.length = 0;
        $scope.monthProduceData.length = 0;
        $scope.seasonProduceData.length = 0;
    }
    $scope.hideMenu = function (id, info) {
        $scope.specid = id;
        $scope.specName = info;
        $scope.param.specid = id;
        $scope.initialiseData();
        $scope.requestData($scope.modeid);
        $("#produceHouseNav").css('display', 'none');
        $('#produceHouseNavOfSon').css('display', 'none');
        $('.menuWaresGrid').css('display', 'none');
        $('#produce').css('background-color', 'transparent');
    };
    //数据服务菜单
    $scope.showDataServiceMenu = function (type) {
        $scope.dataServiceFlag = false;
        $scope.bottomFlag = (type === 0);
    };
    $scope.hideDataServiceMenu = function () {
        $scope.dataServiceFlag = true;
    };
    //防止冒泡
    $scope.stopPre = function(event){
        event.stopPropagation();
    }
}]);