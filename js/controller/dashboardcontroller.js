var bapp = angular.module('bappdashboardcontroller', ['bappservice','ionic']);

bapp.controller('DashboardCtrl',function(Word,UI,$state,Dateservice,$rootScope,$timeout,$http,$scope,$ionicSlideBoxDelegate,$ionicTabsDelegate){
		$scope.todaydate=Dateservice.getDate();
		$scope.year=Dateservice.getFullYear();
		$scope.month=Dateservice.getMonth()+1;
		$scope.Word=Word;  
		$scope.today=[
			{
				content:'快来刷拓词！',
				state:'flashcard.towords',
				param:{},
				progress:0
			},
			{
				content:'数学高考题准备好了！',
				state:'quiz.norm',
				param:{},
				progress:40
			}
		];

		$scope.todos=[
			'study','play','sleep'
		]

		$scope.recos=[
			'guitar','piano','cook'
		]

		$scope.refreshtoday=function() {
			$timeout(function(){
				$scope.$broadcast('scroll.refreshComplete');
			},100)
		}
		$scope.gotopage=function(num) {
			$ionicTabsDelegate.select(num);
			$ionicSlideBoxDelegate.slide(num);
		}

		$scope.do=function (state,param) {
			$state.transitionTo(state,param);
		}


		$scope.$on('$ionicView.loaded', function(){
			$scope.headinfo.title='个人面版';
			$timeout(function(){
				$ionicTabsDelegate.select(1);
				$ionicSlideBoxDelegate.$getByHandle('dashbaord-slide').enableSlide(false);
				$ionicSlideBoxDelegate.$getByHandle('dashbaord-slide').slide(1,0);
			},0);
        });

        $scope.$on('$ionicView.enter', function(){
			$timeout(function(){
				$ionicSlideBoxDelegate.$getByHandle('dashbaord-slide').update();
			},0);
        });

        $scope.$on('$ionicView.beforeEnter', function(){
            UI.menubuttonshow=false;
            $('#menu-button').show();
        });


        
  });			