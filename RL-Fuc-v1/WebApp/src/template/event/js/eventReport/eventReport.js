'use strict';

//初始化图片对象
var images = {
    localIds: [],
    serverId: []
};
var imageArr = [];

//语音上报
var serverVoiceId = "" , localVoiceId = "";

var eventReport = angular.module("eventReport", []);
	//路由配置
	eventReport.config(['$locationProvider', function($locationProvider) {
	     $locationProvider.html5Mode({
            enabled: true,
            requireBase: false//必须配置为false，否则<base href=''>这种格式带base链接的地址才能解析
        });
	}]);
	//控制器
   eventReport.controller('eventReportHomeCtrl',[ '$scope','$location', '$http','$filter', '$timeout', '$interval', function($scope, $location, $http,$filter,$timeout, $interval) {
   		//初始化提示框
   		$scope.eventInit = function(){
   			//dialog默认隐藏
   			$scope.eventDialog = true;
   			//调用治水大类数据接口
			$scope.treatType();  			
   		}
   		
   		//关闭dialog
   		$scope.closePopup = function(){
   			//dialog显示
   			$scope.eventDialog = false;
   		}
   		
		//camera
		$("#imgs img[id^='img']").each(function(index) {
			$(this).bind("click", function() {
				var img = $(this);
				wx.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						var localIds = res.localIds;
						img.attr("src", localIds[0]);
						img.next().show();
						wx.uploadImage({
							localId: localIds[0],
							success: function(res) {
								img.attr("data", res.serverId);
							}
						});
					}
				});
			});
		});
		$("#imgs img[id^='close']").each(function() {
			$(this).bind("click", function() {
				var close = $(this);
				if(close.attr("mfor")) {
					var img = $("#" + close.attr("mfor"));
					img.removeAttr("data");
					img.attr("src", baseUrl + "/theme/default/images/add.png");
					close.hide();
				}
			});
		});
   		
	 	//获取url参数
   		if ($location.search().code) {
		    $scope.keyword = $location.search().code;
   			$http({
			    method: 'get',
			    url: localStorage.getItem("serviceUrl_lineServer") +"wx/common/openid",
			    params:{
			    	code:$scope.keyword
			    }
			}).then(function successCallback(resp) {
				if(resp.data.resCode == 1){
					//获取openid，赋值给隐藏的Input
					$scope.reportpersonid = resp.data.data;
					//调用signatrue
					$scope._signatrue();
				}else{
					weui.alert(resp.data.resMsg)					
				}
	        }).catch(function errorCallback(resp) {
	        });
		}
   		
   		//获取signatrue
   		$scope._signatrue = function(){
   			$http({
			    method: 'get',
			    url: localStorage.getItem("serviceUrl_lineServer") +"wx/common/signature",
			    params:{
			    	url:window.location.href //获取当前完整url
			    }
			}).then(function successCallback(resp) {
				var signature = resp.data.data;
				//验证通过后，初始化wx.config
				window.wx.config({
	                debug: false,
	                appId: signature.appId,
	                timestamp: signature.timestamp,
	                nonceStr: signature.nonceStr,
	                signature: signature.signature,
	                jsApiList: [
	                    'checkJsApi',
	                    'chooseImage',
	                    'previewImage',
	                    'uploadImage',
	                    'downloadImage',
	                    'getNetworkType',
	                    'openLocation',
	                    'getLocation',
	                    'getLocalImgData',
	                    'startRecord',
                        'stopRecord',
                        'uploadVoice',
                        'playVoice'
	                ]
	            });
	        }).catch(function errorCallback(resp) { 
	        });
   		}
   		
   		//治水类别
   		$scope.treatType = function(){
   			$http({
			    method: 'post',
			    url: localStorage.getItem("serviceUrl") + "type"
			}).then(function successCallback(resp) {
				$scope.parents = resp.data.data;
	        }).catch(function errorCallback(resp) { 
	        });
   		}
   		
   		//治水大类选中
		$scope.parentSelectContacter = function(id,index,name){
			$scope.selCont = index;
			$scope.childSelCont = null;
			$scope.parentId = id;
			$http({
			    method: 'post',
			    url: localStorage.getItem("serviceUrl") +"type",
			    params:{  
	             	id:id 
	            } 
			}).then(function (resp) {
				$scope.children = resp.data.data;
		        //正确请求成功时处理
			    }).catch(function (resp) {  
			    //捕捉错误处理
			});
		}
		
		//上报描述
		$scope.countNum = 255;
	    $scope.checkText = function () {
	    	$scope.countNum = 255 - $scope.text.length;
	        if ($scope.text.length > 255) {
	            weui.alert("你好，描述字数控制在255字以内！");
	            $scope.text = $scope.text.substr(0, 255);
	            $scope.countNum = 0;
	        }
	    };
		
		//治水小类选中
		$scope.childSelectContacter = function(id,index,name){
			$scope.childSelCont = index;
			$scope.childtId = id;
		}
		
		 //信息验证
        var nullReg = /\S/;
        var reportpersonReg = /^[^0-9]{2,}$/;
        var reportphoneReg = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
		
		//表单提交
		$scope.submit = function(){
			var layerIndex = layer.open({
	            type: 2,
	            time: 1,
	            shadeClose: false
	        });
	        
	        //图片
	        if(imageArr.length==0){
	        	layer.close(layerIndex);
	            layer.open({
                    content: "请选择或拍摄图片上传",
                    time: 2
                });
	            return;
            }
	        
	        //地址
	        var address = $("#address").val();
	        if (!address) {
	            layer.close(layerIndex);
	            layer.open({
                    content: "请填写污染地点",
                    time: 2
                });
	            return;
	        }
	        
	        //内容
	        var content = $("#content").val();
	        if (!content) {
	            layer.close(layerIndex);
	            layer.open({
                    content: "请填写污染情况",
                    time: 2
                });
	            return;
	        }
	        
	        //是否匿名
	        if (!$scope.isPrivary) {
	        	 
	            var reportperson = $("#reportperson").val();
	            if (!reportperson || !nullReg.test(reportperson) || !reportpersonReg.test(reportperson)) {
	                layer.close(layerIndex);
	                layer.open({
	                    content: "请正确填写联系人",
	                    time: 2
	                });
	                return;
	            }
	
	            var reportphone = $("#reportphone").val();
	            if (!reportphone || !reportphoneReg.test(reportphone)) {
	                layer.close(layerIndex);
	                layer.open({
	                    content: "请正确填写联系电话",
	                    time: 2
	                });
	                return;
	            }
	        }
			
			//组装数据
	        var data = $("#frmReport").serialize();
	        //类型
	        if($scope.parents.length != 0){
	        	data+= "&type="+$scope.childtId;
	        	
	        }else{
	        	data+= "&type="+$scope.parentId;
	        }
			//是否匿名value
	        if ($scope.isPrivary) {
	            data += "&isprivary=1";
	        } else {
	            data += "&isprivary=0"
	        }
	        
	        //basedomain
	        data += "&basedomain="+ localStorage.getItem("serviceUrl_lineServer");
	        //imgUpload
	        data += "&images=" + imageArr;
	        //Voice
	        data += "&voice=" + serverVoiceId;
	      
			$http({
			    method: 'post',
			    url: localStorage.getItem("serviceUrl") +'report/event',
			    data: data,
    			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
			    dataType:"json",
			    async: false,
	            cache: false
			}).then(function (resp) {
		        //正确请求成功时处理
		        layer.close(layerIndex);
                if (resp.data.resCode == 1) {
                	layer.open({
                        content: "上报成功",
                        time: 2,
                        end: function () {
                            wx.closeWindow();
                        }
                    });
                } else {
                	layer.open({
                        content: "上报失败，请重试！",
                        time: 2
                    });
                }
			    }).catch(function (resp) {  
			    //捕捉错误处理
			});	
		}
		
   }])




