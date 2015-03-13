	var bapp = angular.module('bappquizcontroller', ['bappservice','ngCookies']);
	bapp.controller('QuizIntroCtrl',['Dateservice','$rootScope','$timeout','$http','$scope','$ionicSlideBoxDelegate','$ionicTabsDelegate',function(Dateservice,$rootScope,$timeout,$http,$scope,$ionicSlideBoxDelegate,$ionicTabsDelegate){
		// $http.get('/json/mathquiz/samplequiz.json').success(function(data){
  //           $scope.items = data;
  //       });

		$scope.headinfo.title='题目';
		$scope.subject=[
			'语文','数学','英语','物理'
		];
		$scope.currentcontent='chinese-gushi';
		$scope.todaydate=Dateservice.getDate();
		$scope.month=Dateservice.getMonth()+1; 

		$scope.gotopage=function(num) {
			$ionicTabsDelegate.select(num);
			$ionicSlideBoxDelegate.slide(num);
		}


        $scope.$on('$viewContentLoaded', function(){
        	$ionicSlideBoxDelegate.enableSlide(false);
        	$scope.grid.show=[true,false,false,false,false,false,false,false,false]
            $scope.grid.width=[100,'','','','','','','',''];
            $scope.grid.height=[100,'','','','','','','',''];
            $scope.grid.top=[0,'','','','','','','',''];
            $scope.grid.left=[0,'','','','','','','',''];
        	$timeout(function() { 
				$.each($('.routeranimate'), function() {
						$timeout(function (index) {
							return function () {
								$('.routeranimate').eq(index).addClass('routershow');
							};
						} ($(this).index()), $(this).index()*100);
				});
			},800)
        });

  }]); 
	
	bapp.controller('QuizNormCtrl',function($ionicSlideBoxDelegate,Quiz,QuizResult,$filter,$stateParams,$timeout,$interval,$http,$scope){
		$scope.current=0;
		$scope.currentmax=0;
		$scope.quiztimer=0;
		$scope.Quiz=Quiz;

		$scope.convert= function(num){
			return $filter('ChoiceConverter')(num);
		}

		$scope.revert = function(bool){
			if (bool==true) {
				return false;
			}
			else {
				return true;
			}
		}

		$scope.slidetoitem=function(index){
			$ionicSlideBoxDelegate.$getByHandle('quiz-slide').slide(index);
		}

		$scope.move=function(type) {
			if (type=="prev") {
				$scope.current-=1;
			}
			else if (type=="next"){
				if ($scope.current==$scope.currentmax) {$scope.currentmax+=1;};
				$scope.current+=1;
			}
			else {
				$scope.current=type;
			}
		}

		$scope.slideHasChanged=function(index) {
			Quiz.current=index;
		}

		$scope.chooseAnswer=function(parent,index) {
			Quiz.ui[parent].youranswer=$scope.convert(index);
			$ionicSlideBoxDelegate.$getByHandle('quiz-slide').next();
		}

		$scope.seeresult=function() {
			var result=$filter('CheckResult')($scope.items);
			QuizResult.qresult=result.scoresheet;
			QuizResult.qscore=result.score;
			$scope.changestate('quiz.result',{'subject':'math','scope':'bixiu','childscope':'1','testtype':'norm','correct':result.score,'total':10});
			$interval.cancel(stoptime);
		}

        $scope.$on('$ionicView.enter', function(){
        	$ionicSlideBoxDelegate.$getByHandle('quiz-slide').enableSlide();
        	Quiz.ui=Quiz.quizdata[0].database.slice(0,9);
        	$ionicSlideBoxDelegate.$getByHandle('quiz-slide').slide(0);
        	QuizResult.reset();

        	$timeout(function() { 
        		$ionicSlideBoxDelegate.$getByHandle('quiz-slide').update();
				MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
			},0);
			$timeout(function() { 
        		$('#ledao-mask.quiz-mask').hide();
			},800);
        	$timeout(function() { 

				stoptime = $interval(function () {
					$scope.quiztimer+=1;
				},1000);
			},800);

        });

        $scope.$on('$ionicView.leave',function(){
        	$interval.cancel(stoptime);
        	$('#ledao-mask.quiz-mask').show();
        });

  }); 

	bapp.controller('QuizResultCtrl',['QuizResult','$rootScope','$timeout','$http','$scope',function(QuizResult,$rootScope,$timeout,$http,$scope){
		$scope.questionstatus=QuizResult.qresult;
		$scope.resultscore=QuizResult.qscore*10;
        $scope.$on('$viewContentLoaded', function(){
        	$scope.grid.show=[true,false,false,false,false,false,false,false,false]
            $scope.grid.width=[100,'','','','','','','',''];
            $scope.grid.height=[100,'','','','','','','',''];
            $scope.grid.top=[0,'','','','','','','',''];
            $scope.grid.left=[0,'','','','','','','',''];
        	$timeout(function() { 
				$('.routeranimate').addClass('routershow');
			},800)
        });

  }]); 


