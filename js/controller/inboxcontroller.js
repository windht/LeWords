var bapp = angular.module('bappinboxcontroller', ['bappservice']);

bapp.controller('InboxTodayCtrl',['$timeout','$http','$scope',function($timeout,$http,$scope){
		$scope.currentmail=null;
		$scope.currentpage=1;
		$scope.mails=[{},{},{},{},{},{}];
		$scope.mailitems=[
		{
			"num":1,
			"title":"HTML课程在呼唤你",
			"author":"BuildMind官方团队",
			"content":"你已经三天没有上HTML课程啦~快来把我扔进TODO或者上我！",
			"time":"2:24 p.m",
			"read":false,
			"checked":false
		},{
			"num":2,
			"title":"逗逼课程--2更新",
			"author":"蔡志斌逗逼教学中心",
			"content":"蔡逼说今天会教你们如何设计一个逗逼专用的鞋子",
			"time":"1:43 p.m",
			"read":false,
			"checked":false
		},{
			"num":3,
			"title":"吉他课更新了",
			"author":"BuildMind官方团队",
			"content":"理论课程再次更新！带好你的大脑来吧~",
			"time":"11:00 a.m",
			"read":false,
			"checked":false
		},{
			"num":4,
			"title":"你的密码已经更改",
			"author":"BuildMind官方团队",
			"content":"密码修改成功，请牢记你的新密码",
			"time":"10:00 a.m",
			"read":false,
			"checked":false
		},{
			"num":5,
			"title":"大神讲座第五期",
			"author":"李焘大神培训中心",
			"content":"李焘，何许人？见知乎热点匿名大神榜，榜首，也许就是他。",
			"time":"9:20 a.m",
			"read":false,
			"checked":false
		},{
			"num":6,
			"title":"FlashCard挑战赛来临",
			"author":"FlashCard智能背词研究中心",
			"content":"Flashcard地区争霸赛开启，冠军送CaiPhone6s",
			"time":"8:20 a.m",
			"read":false,
			"checked":false
		},{
			"num":7,
			"title":"乐道平台CEO线下见面会",
			"author":"BuildMind官方团队",
			"content":"乐道品台CEO，陈鹏宇先生，将于20号到达深圳中学校园进行产品介绍、",
			"time":"7:20 a.m",
			"read":false,
			"checked":false
		}
		];
		$scope.totalmail=$scope.mailitems.length;
		$scope.totalpage=Math.ceil($scope.totalmail/5);
		$scope.allchecked=false;
		$scope.$on('$viewContentLoaded', function(){
			$scope.grid.show=[true,false,false,false,false,false,false,false,false]
            $scope.grid.width=[100,'','','','','','','',''];
            $scope.grid.height=[100,'','','','','','','',''];
            $scope.grid.top=[0,'','','','','','','',''];
            $scope.grid.left=[0,'','','','','','','',''];
			$timeout(function() { 
				$('.maillist.routeranimate').addClass('routershow');
				$('.mail-alert.routeranimate').addClass('routershow');
			 	$.each($('.mailitem.routeranimate'), function(index) {
						$timeout(function () {
							return function () {
			 					$('.mailitem.routeranimate').eq(index).addClass('routershow');
							};
						} ($(this).index()), $(this).index()*100);
				});
			 	$.each($('.mailcontent-item.routeranimate'), function(index) {
						$timeout(function () {
							return function () {
			 					$('.mailcontent-item.routeranimate').eq(index).addClass('routershow');
							};
						} ($(this).index()), $(this).index()*200);
				});
			 },800)
        });

        $scope.update=function(currentmail) {
			$scope.totalmail=$scope.mailitems.length;
			$scope.totalpage=Math.ceil($scope.totalmail/5);
			$scope.currentmail=currentmail;
		};

        $scope.checkmail=function(num,page) {
	        if ($scope.currentmail!=num) {
	        	
	        	if ($scope.currentmail==$scope.totalmail-1) {
	        		$scope.currentmail=num-1;
	        		$scope.changemailview(num-1);
	        		console.log($scope.currentmail);
	        		console.log($scope.totalmail);
	        	}
	        	else {
	        		$scope.currentmail=num;
	        		$scope.changemailview(num);
	        		console.log($scope.currentmail);
	        		console.log($scope.totalmail);
	        	}
	        }
        }

        $scope.changemailview=function(num) {
        	if ($('.mailcontent.routeranimate').hasClass('routershow')) {
        		$('.mailcontent.routeranimate').removeClass('routershow');
	        	$timeout(function() { 
						$('.mailcontent.routeranimate').addClass('routershow');
				},400)
	         	$timeout(function() { 
						$scope.mailcontent = $scope.mailitems[num];
				},200);
        	}
        	else {
        		$('.mailcontent.routeranimate').addClass('routershow');
        		$scope.mailcontent = $scope.mailitems[num];
        	}
        }

        $scope.movetopage=function(pagenum) {
			$('.mailitem.routeranimate').removeClass('routershow');
			$timeout(function() { 
				$scope.currentpage=pagenum;
			 	$('.mailitem.routeranimate').addClass('routershow');
			},800)
        }

     	$scope.taskshift =function(type) {
     		$scope.inshifting=true;
     		var msg=$scope.currentmail;
     		var items = $('.mailitem.routeranimate');
        	var sumheight=$('#mailitems').outerHeight(true);
        	var height=sumheight/5;
        	var heightstring='-'+height+'px';
        	var itemspos = msg%5;
			items.eq(itemspos).children('.mailmask').addClass(type);
        	if ($scope.totalmail>1) {
	     		$scope.checkmail(msg+1);
	     	}
	     	else {
	     		$('.mailcontent.routeranimate').removeClass('routershow');
	     	}
     		$timeout(function() { 
					items.eq(itemspos).removeClass('routershow');
					for (var i=itemspos;i<7;i++)
					{
						items.eq(i).addClass('mailshow');
						items.eq(i).animate({marginTop:heightstring},300);
					}
					items.eq(itemspos).children('.mailmask').removeClass(type);
			},400);
     		$timeout(function() { 
				items.eq(itemspos).addClass('routershow');
				items.eq(itemspos).addClass('routershowmask');
				
			},550)
			$timeout(function() { 
				for (var i=itemspos;i<7;i++)
					{	
						
						 items.eq(i).animate({marginTop:0},0);
					}
				$scope.mailitems.splice(msg,1);
				items.eq(itemspos).removeClass('routershowmask');
				$scope.update(msg);
				$scope.inshifting=false;
			},850)
		}
  }]);

bapp.controller('InboxTodoCtrl',['$timeout','$http','$scope',function($timeout,$http,$scope){
		$scope.$on('$viewContentLoaded', function(){
			$timeout(function() { 
			 	$.each($('.routeranimate'), function(index) {
						$timeout(function () {
							return function () {
			 					$('.routeranimate').eq(index).addClass('routershow');
							};
						} ($(this).index()), $(this).index()*100);
				});
			 },800)
        });
  }]);