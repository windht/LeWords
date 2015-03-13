angular.module('controller', [])

.controller('MainCtrl',function($scope,$state){
	$scope.goto=function(state,param) {
		$state.go(state,param);
	}
})

.controller('DashCtrl',function($ionicModal,Word,$state,$ionicSlideBoxDelegate,$timeout,Plans,ColorBase,$scope,Hash){
	$scope.Plans=Plans;
	$scope.planscope=0;
    $scope.selectedscope='';

    $ionicModal.fromTemplateUrl('templates/delete-modal.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.deleteModal = modal;
	    console.log('hihihi')
	  });

	$scope.showCollection=function(index) {
		var copy=Plans.data[index];
		Plans.data.splice(index,1);
		Plans.data.push(copy);
	}

	$scope.delete=function() {
		$scope.deleteModal.show();
	}

	$scope.confirmDelete=function() {
		Plans.data.pop();
		$scope.deleteModal.hide();
	}

	$scope.giveUpDelete=function(){
		$scope.deleteModal.hide();
	}

	$scope.startShuaCi=function(state,param,colortop,colorbottom) {
		$state.go(state,param);
		Word.uicolor.top=colortop;
		Word.uicolor.bottom=colorbottom;
	}

	$scope.save=function(index) {
		$timeout(function(){
			Plans.currentEditEnd=-1;			
		},200)
		$timeout(function(){
			Plans.currentEdit=-1;			
		},400)
		$timeout(function(){
			Plans.currentEditStart=-1;		
			Plans.data[index].scopeSelected=true;	
		},700)
		
	}

	$scope.checkEditTop=function(index) {
		if (Plans.currentEdit==index) {
			return null;
		}		
		else {
			return (index*88+50)+'px';
		}
	}

	$scope.checkEditZ=function(index) {
		if (Plans.currentEdit==index) {
			return null;
		}		
		else {
			return index+5;
		}
	}

	$scope.checkBackGround=function(index,topcolor,bottomcolor) {
		return '-webkit-linear-gradient(top,'+topcolor+','+bottomcolor+')';
	}

	

	$scope.checkTabZ=function() {
		if (Plans.currentEdit==-1) {
			return 5;
		}		
		else {
			return -1;
		}

	}

	$scope.edit=function(index) {
		$timeout(function(){
			Plans.currentEditStart=index;			
		},200)
		$timeout(function(){
			Plans.currentEdit=index;			
		},400)
		$timeout(function(){
			Plans.currentEditEnd=index;			
		},700)
		$timeout(function(){
			
			$ionicSlideBoxDelegate.$getByHandle('plan-scope-select').update();
		},800)
		
	}

	$scope.addPlan=function() {
		var randomInex=Math.floor(Math.random()*ColorBase.length);
		Plans.data.push({
			hash:Hash.plan,
			color:ColorBase[randomInex],
			currentArea:0,
			selectedscope:'',
			scopeSelected:false,
			timeselected:30,
	        autoadjust:false,
	        forgetcurvetrack:false,
	        attendrank:false
		});
		Hash.plan+=1;
		Plans.currentEditStart=Plans.data.length-1;	
		$timeout(function(){
			Plans.currentEdit=Plans.data.length-1;			
		},400)
		$timeout(function(){
			Plans.currentEditEnd=Plans.data.length-1;			
		},700)
		$timeout(function(){
			$ionicSlideBoxDelegate.$getByHandle('plan-scope-select').update();
		},900)	
	}

	$scope.$on('$ionicView.enter',function(){
		
	});
})

.controller('IntroCtrl',function($scope){
	$scope.currentSlide=0;
})

.controller('WordCtrl',function(Device,$state,Motto,$filter,$ionicSlideBoxDelegate,$http,$timeout,Device,Word,$scope,$stateParams){
	$scope.scope=$stateParams.type; //获得当前单词表的范围
	$scope.Device=Device;
	$scope.Word=Word;
	$scope.Motto=Motto;
	//三张刷词页面轮流切换，以及四个选项空间。为保证不重渲染所以使用这个方法。
	$scope.threeslide=[{id:0},{id:1},{id:2}];
    $scope.towordchoice=[{id:0},{id:1},{id:2},{id:3}];
    $scope.dayRecordIndex=-1;

	$scope.$on('$ionicView.beforeEnter',function(){ //进入前
		//显示进度条并归零
		$scope.hideMask=false;
		Word.loadProgress=0;
		for (i in Word.worddata[$scope.scope].dayRecords) {
			if (Word.worddata[$scope.scope].dayRecords[i].date==Device.date) {
				$scope.dayRecordIndex=i;
			}
		}
		if ($scope.dayRecordIndex==-1) {
			Word.worddata[$scope.scope].dayRecords.push({
				date:Device.date,
				planWords:[],
				finishCount:0,
				planProgress:[]
			})
			$scope.dayRecordIndex=Word.worddata[$scope.scope].dayRecords.length-1;
		}

		//抓取格言
		var mottoIndex=Math.floor(Math.random()*3)
		$scope.mottoEnglish=Motto[mottoIndex].English;
		$scope.mottoChinese=Motto[mottoIndex].Chinese;

		//创建单词抓取分隔点
		separater=Math.floor(Word.worddata[$scope.scope].total/4);

		//禁用手指滑动
		$ionicSlideBoxDelegate.$getByHandle('mask-slide').enableSlide(false);
		$ionicSlideBoxDelegate.$getByHandle('towords-slide').enableSlide(false);

		//生成第一个和第二个slide的单词
		Word.towords.uiword[0].currentword=Word.worddata[$scope.scope].wordSequence[0];
      	Word.towords.uiword[1].currentword=Word.worddata[$scope.scope].wordSequence[1];
		generate(0);
		generate(1);
	})

	var separater;

	$scope.$on('$ionicView.enter',function(){ //进度条开始跑
		Word.loadProgress = 0.1;
		$timeout(function(){
			Word.loadProgress = 0.2;
		},1000)
		$timeout(function(){
			Word.loadProgress = 0.4;
		},2000)
		$timeout(function(){
			Word.loadProgress = 0.7;
		},2600)
		$timeout(function(){
			Word.loadProgress = 1;
		},3000)
		$timeout(function(){
			Word.loadProgress = 1;
			$ionicSlideBoxDelegate.$getByHandle('mask-slide').slide(1);
		},3200)
	})

	var generate=function(uiindex) {
		// Word.worddata[Word.towords.uiword[0].currentword]
		// 清空已选项和所有选项的数组
        Word.towords.uiword[uiindex].selected=-1;
        Word.towords.uiword[uiindex].choices=[];
        Word.towords.uiword[uiindex].type='recognition';
        Word.towords.uiword[uiindex].direction='positive';
  		//获取当前词
  		// if (Word.worddata[$scope.scope].wordSequence[Word.towords.uiword[uiindex].currentword].wordProgress>1.5){
		if (Word.worddata[$scope.scope].wordSequence[Word.towords.uiword[uiindex].currentword].wordProgress>3 && Math.random()<=0.5) {
			Word.towords.uiword[uiindex].direction='negative';
		}
		if (Word.worddata[$scope.scope].wordSequence[Word.towords.uiword[uiindex].currentword].wordProgress>5 && Math.random()<=0.5) {
			Word.towords.uiword[uiindex].type='recall';
			Word.towords.uiword[uiindex].direction='positive';
		}
		if (Word.worddata[$scope.scope].wordSequence[Word.towords.uiword[uiindex].currentword].wordProgress>7 && Math.random()<=0.5){
			Word.towords.uiword[uiindex].type='recall';
			Word.towords.uiword[uiindex].direction='negative';
		}
  		//
        var currentarea=Math.floor(Word.towords.uiword[uiindex].currentword/separater);
        var random=Math.random();
        var correctplace=Math.floor(Math.random()*4);
        //分段取词
        if (Word.towords.uiword[uiindex].type=='recognition') {
        	for (var i=0;i<4;i++)
	        {
	          if (i!=currentarea) {
	            //四个段内的任意序数
	            var index=Math.floor((i+random)*separater);
	            Word.towords.uiword[uiindex].choices.push(index);
	          }
	        }
        }
        
        //最好把正确答案随机插入
        Word.towords.uiword[uiindex].choices.splice(correctplace,0,Word.towords.uiword[uiindex].currentword);  
        Word.towords.uiword[uiindex].correctanswer=correctplace;
    }

	$scope.$on('$ionicView.afterLeave',function(){
		//离开时把读取进度归零，便于下次进入
		Word.loadProgress=0;
	})

	$scope.checkWordLength=function(word) { //检查单词长度，调节字体大小
		if (word.length>12) {
			return '12px';
		}
		if (word.length<12 && word.length >= 8) {
			return '25px';
		}
		if (word.length<8) {
			return '40px';
		}
	}

	$scope.flip=function() {
		$scope.flipbool=true;
	};

    $scope.next=function() {
        $scope.flipbool=false;
        $scope.nextcardbool=!$scope.nextcardbool;
    }

    $scope.nextword=function(uiindex) {
        //页面跳转逻辑
        $ionicSlideBoxDelegate.$getByHandle('towords-slide').next();
        //针对特殊的三页面，都是更新的两页面后才会遇到的页面，保证体验。
        if (uiindex==0) {
          Word.towords.uiword[2].currentword=Word.worddata[$scope.scope].wordSequence[1];
          generate(2)
        } 
        else if (uiindex==1) {
          Word.towords.uiword[0].currentword=Word.worddata[$scope.scope].wordSequence[1];
          generate(0)
        }
        else {
          Word.towords.uiword[1].currentword=Word.worddata[$scope.scope].wordSequence[1];
          generate(1)
        }
    }


    $scope.chooseword=function(uiindex,selectedanswer,type) { //选择单词
      
      Word.towords.uiword[uiindex].selected=selectedanswer;
      var answer;

      //分析答案
      if (type=="recognition") {
	      if(selectedanswer==5) {answer='dontknow'}
	      else if(selectedanswer==Word.towords.uiword[uiindex].correctanswer) {answer='correct'}
	      else {answer='wrong'}   
	      
      }

      else if (type="recall") {
      	
        $scope.nextcardbool=!$scope.nextcardbool;
        if (selectedanswer % 2 ==0) {
        	answer='dontknow'
        }
        else {
        	answer='correct'
        }
        
        $timeout(function(){
	    	Word.towords.uiword[uiindex].flip=false;
	    },2000) 
      }

      //伪后端处理，得到回应后翻下一张卡片。
      $http.post('offline/lewords',{answer:answer,scope:$scope.scope}).
      success(function(data) {
      	if (type=="recognition") {
      		$timeout(function(){
		    	$scope.nextword(uiindex);
		    },2000) 
      	}
      	else {
      		$scope.nextword(uiindex);
      	} 	
      })
      .error(function(){
        console.log('ohshit');
      });
    }
})

