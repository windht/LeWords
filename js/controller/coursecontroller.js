var bapp = angular.module('bappcoursecontroller', ['bappservice']);

bapp.controller('CourseCtrl',['$timeout','$http','$scope','$ionicSlideBoxDelegate',function($timeout,$http,$scope,$ionicSlideBoxDelegate){
		$scope.headinfo.title='课程';
		$scope.changecontent=function(index) {
            $ionicSlideBoxDelegate.$getByHandle('coursecontent').slide(index);
        }
		$scope.$on('$ionicView.loaded', function(){
			$timeout(function() { 
                $ionicSlideBoxDelegate.$getByHandle('coursecontent').enableSlide(false);
			},0)
        }); 

        $scope.$on('$ionicView.enter', function(){
			$timeout(function() { 
				$ionicSlideBoxDelegate.$getByHandle('coursecontent').update();
				$ionicSlideBoxDelegate.$getByHandle('coursescope').update();
			},0)
        });
  	}]); 
	bapp.controller('CourseIntroCtrl',['$stateParams','$timeout','$http','$scope',function($stateParams,$timeout,$http,$scope){
		$scope.status=[]
		$scope.stroke=10;
		$scope.radius=60;
		$scope.current=20;
        $scope.currentColor =   '#45ccce',
        $scope.bgColor =        '#eaeaea',
		$http.get('partials/course/'+$stateParams.types+'/'+$stateParams.courses+'/intro.json').success(function(data){
            $scope.intro = data;
        });

        $scope.add=function(a) {
        	$('#'+a).toggleClass('completed')
        }

		$scope.checkpre = function(a,b,c) {
			if ($('#'+a).hasClass('completed')) {
				if (b==undefined) {
					return false;
				}
				else if ($('#'+b).hasClass('completed')){
					if (c==undefined) {
						return false;
					}
					else if($('#'+c).hasClass('completed')) {
						return false;
					}
					else {
						return true;
					}
				}
				else {
					return true;
				}
			}
			else {
				return true;
			}
		}

		

  }]); 

	bapp.controller('CourseIntCtrl',['CourseIntService','$stateParams','$timeout','$http','$scope',function(CourseIntService,$stateParams,$timeout,$http,$scope){
		$scope.taskshow=[];
		$scope.volumeon=true;
		$scope.textspeed=100;
		$scope.type=$stateParams.types;
		$scope.course=$stateParams.courses;
		$scope.chapter=$stateParams.chapters;
		$scope.unit=$stateParams.units;
		$scope.onanimation=false;
		$scope.service=CourseIntService;
		$http.get("partials/course/"+$scope.type+"/"+$scope.course+"/chapter-"+$scope.chapter+"/unit-"+$scope.unit +"/coursescript.json").success(function(data){
            $scope.coursesentence = data.coursetext;
            $scope.task=data.task;
            $scope.quiz=data.quiz;
            $scope.max=data.coursetext.length;
            $scope.taskcompletion= new Array(data.task.length); 
        });

       	$scope.togglevolume=function() {
       		if (document.getElementById('course-audio').volume > 0) {
       			document.getElementById('course-audio').volume = 0.0;
       		}
       		else {
       			document.getElementById('course-audio').volume = 1.0;
       		}
       		$scope.volumeon=!$scope.volumeon;
       	}

       	$scope.changetextspeed =function (num) {
       		$scope.textspeed=num;
       	}

        $scope.init=function () {
        	CourseIntService.current+=1;
			$scope.onanimation=true;
        	$scope.courseaudio.attr("src","partials/course/music/guitar/chapter-"+$scope.chapter+"/unit-"+$scope.unit+"/audios/"+CourseIntService.current+".mp3");
			$scope.update();
			$scope.showsentence();
        }

		$scope.update=function() {
			$scope.currentsentence=$scope.coursesentence[CourseIntService.current];
			$scope.courseaudio.attr("src","partials/course/"+$scope.type+"/"+$scope.course+"/chapter-"+$scope.chapter+"/unit-"+$scope.unit+"/audios/"+CourseIntService.current+".mp3");
			// $http.get("/dashboard/partials/course/"+$scope.type+"/"+$scope.course+"/chapter-"+$scope.chapter+"/unit-"+$scope.unit +"/materials/"+($scope.current+1)+".png", {cache:true});
			$scope.courseaudio.load();
		}
		

		$scope.showsentence= function() {
			$('#conversation-content').text("");
			$('#conversation-content').typetype($scope.currentsentence,{callback:function(){$('.conversation-button').addClass('show');$scope.onanimation=false;},t:$scope.textspeed});
		}

		$scope.changepage=function(type) {
			$scope.onanimation=true;
			$('.conversation-button').removeClass('show');
			if (type=="prev") {
				CourseIntService.current-=1;
				document.getElementById('present').contentWindow.jumpto(CourseIntService.current);
				$scope.update();
				$timeout(function() {
					$scope.showsentence();
				},150);
			}
			else if (type=="next"){
				if (CourseIntService.current==CourseIntService.currentmax) {CourseIntService.currentmax+=1;};
				CourseIntService.current+=1;
				document.getElementById('present').contentWindow.jumpto(CourseIntService.current);
				$scope.update();
				$timeout(function() {
					$scope.showsentence();
				},150);
			}
			else {
				document.getElementById('present').contentWindow.jumpto(type);
				$scope.taskcompletion[0]=true;
				CourseIntService.current=type;
				$scope.update();
				$timeout(function() {
					$scope.showsentence();
				},300);
			}
		}

		$scope.$on('$viewContentLoaded', function(){
			$scope.grid.show=[true,true,false,false,false,false,false,false,false]
			$scope.grid.width=[65,35,'','','','','','',''];
			$scope.grid.height=[100,100,'','','','','','',''];
			$scope.grid.top=[0,0,'','','','','','',''];
			$scope.grid.left=[0,65,'','','','','','',''];
			$scope.courseaudio=$("#course-audio");
			$scope.coursepresent=$("#present");

			$timeout(function() { 
				$scope.coursepresent.attr("src","partials/course/music/guitar/chapter-"+$scope.chapter+"/unit-"+$scope.unit+"/html/presentation.html");
			},400)
			$timeout(function() { 
				$('.one-container.routeranimate').addClass('routershow');
				$.each($('.metro.routeranimate'), function(index) {
					$timeout(function () {
						return function () {
							$('.metro.routeranimate').eq(index).addClass('routershow');
						};
					} ($(this).index()), $(this).index()*200);
				});
			},800)
        });

  }]); 

bapp.controller('VideoCtrl',['$timeout','$http','$scope',function($timeout,$http,$scope){
		$scope.item=[true,true,true,true];
		$scope.rollbool=false;

		$scope.$on('$viewContentLoaded', function(){
			initsvg();
			myPlayer = document.getElementById("coursevideo");
			myPlayer.play();
			myPlayer.pause();
			myPlayer.addEventListener("timeupdate", function() {
				if (myPlayer.currentTime > 10 && $scope.item[0]) {
					myPlayer.pause();
					$scope.rollbool=!$scope.rollbool;
					$scope.item[0]=false;
				};

				if (myPlayer.currentTime > 20 && $scope.item[1]) {
					myPlayer.pause();
					$scope.rollbool=!$scope.rollbool;
					$scope.item[1]=false;
				};

				if (myPlayer.currentTime > 30 && $scope.item[2]) {
					myPlayer.pause();
					$scope.rollbool=!$scope.rollbool;
					$scope.item[2]=false;
				};
		    });
        });

        

  }]); 