var bapp = angular.module('bappflashcardcontroller', ['bappservice']);

bapp.controller('CardIntroCtrl',function(Word,$ionicModal,FlashCard,$timeout,$http,$scope,$ionicSlideBoxDelegate,$ionicPopover){
		$scope.headinfo.title='卡片';
        $scope.wordplan=Word.plan;
        $scope.subscopes=[
        {name:'语文',state:'gre'},
        {name:'数学'},
        {name:'英语'},
        {name:'物理'}
        ]
        $scope.Word=Word;
        $scope.planscope=0;
        $scope.selectedscope='';
        $scope.plan={
            timeselected:30,
            autoadjust:false,
            forgetcurvetrack:false,
            attendrank:false
        }



        $scope.changecontent=function(index) {
            $ionicSlideBoxDelegate.$getByHandle('cardcontent').slide(index);
        }

        // POPUP

        $scope.changeplanscope=function(index) {
            $scope.planscope=index;
            $ionicSlideBoxDelegate.$getByHandle('plan-scope-select').slide(index);
        }

        $scope.newplan=function() {
            $scope.openModal();
        }

        $scope.planscopechanged=function(index) {
            $scope.planscope=index;
        }

        $scope.selectscope=function(scope) {
            $scope.selectedscope=scope;
        }

        $scope.submitnewplan=function() {
            $scope.closeModal();
            $scope.wordplan.push({
                scope:$scope.selectedscope,
                period:$scope.plan.timeselected,
                periodupdate:$scope.plan.autoadjust,
                forgetcurvetrack:$scope.plan.forgetcurvetrack,
                attendledaorank:$scope.plan.attendrank
            })
            $scope.changestate('flashcard.word',{'planindex':$scope.wordplan.length-1});
        }

        $scope.$on('$ionicView.loaded', function(){
            FlashCard.getscope()
                .then(function(data){
                    $scope.data=data;
                    $scope.commonwidth=$scope.data.currentprogress.common[1]*2;
                    $scope.middlewidth=$scope.data.currentprogress.middle[1]*2;
                    $scope.hardwidth=$scope.data.currentprogress.hard[1]*2;
                },function(data){});
			$timeout(function() { 
                $ionicSlideBoxDelegate.$getByHandle('cardcontent').enableSlide(false);

			},0)
        });

        $scope.$on('$ionicView.beforeEnter', function(){
          $('#menu-button').show();
            $timeout(function(){
                $ionicSlideBoxDelegate.$getByHandle('cardcontent').update();
                $ionicSlideBoxDelegate.$getByHandle('cardscope').update();
            },0);
        });

        $ionicModal.fromTemplateUrl('partials/flashcard/new-plan.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            $scope.modal = modal;
          });
          $scope.openModal = function() {
            $scope.modal.show();
          };
          $scope.closeModal = function() {
            $scope.modal.hide();
          };
          //Cleanup the modal when we're done with it!
          $scope.$on('$destroy', function() {
            $scope.modal.remove();
          });
          // Execute action on hide modal
          $scope.$on('modal.hidden', function() {
            // Execute action
          });
          // Execute action on remove modal
          $scope.$on('modal.removed', function() {
            // Execute action
          });

  });

    bapp.controller('WordCtrl',function($ionicPopup,UI,Word,$scope,$stateParams) {
        $scope.Word=Word;
        $scope.planindex=$stateParams.planindex;
        
        $scope.$on('$ionicView.beforeEnter', function(){
            UI.menubuttonshow=false;
            $('#menu-button').hide();
        });
        $scope.$on('$ionicView.afterLeave', function(){
            UI.menubuttonshow=true;
        });

        $scope.togglePeriodUpdate = function(state) {
           if(state) {
                $ionicPopup.confirm({
                    title: '确认关闭自动追踪吗？',
                    template: '关闭后，你的每日需要完成量将会固定，可能无法更贴近你真实的刷词速度哦。',
                    cancelText: '取消', // String (default: 'Cancel'). The text of the Cancel button.
                    cancelType: 'button-energized', // String (default: 'button-default'). The type of the Cancel button.
                    okText: '确认', // String (default: 'OK'). The text of the OK button.
                    okType: 'button-balanced', // String (default: 'button-positive'). The type of the OK button.           
               }).
               then(function(res) {
                 if(res) {
                   Word.plan[$scope.planindex].periodupdate=false;
                 } else {
                   
                 }
               });          
           }
           else {
               $ionicPopup.confirm({
                    title: '确认开启自动追踪吗？',
                    template: '开启后，你的每日需要完成量将会根据你的实际刷词量调整，可能会对你的原先计划造成冲击哦。',
                    cancelText: '取消', // String (default: 'Cancel'). The text of the Cancel button.
                    cancelType: 'button-energized', // String (default: 'button-default'). The type of the Cancel button.
                    okText: '确认', // String (default: 'OK'). The text of the OK button.
                    okType: 'button-balanced', // String (default: 'button-positive'). The type of the OK button.           
               }).
               then(function(res) {
                 if(res) {
                   Word.plan[$scope.planindex].periodupdate=true;
                 } else {
                   
                 }
               });          
            };
        }

        $scope.toggleForgetCurveTrack = function(state) {
           if(state) {
                $ionicPopup.confirm({
                    title: '确认关闭遗忘曲线追踪吗？',
                    template: '关闭后，你的遗忘曲线数据将会停止纪录。',
                    cancelText: '取消', // String (default: 'Cancel'). The text of the Cancel button.
                    cancelType: 'button-energized', // String (default: 'button-default'). The type of the Cancel button.
                    okText: '确认', // String (default: 'OK'). The text of the OK button.
                    okType: 'button-balanced', // String (default: 'button-positive'). The type of the OK button.           
               }).
               then(function(res) {
                 if(res) {
                   Word.plan[$scope.planindex].forgetcurvetrack=false;
                 } else {
                   
                 }
               });          
           }
           else {
               $ionicPopup.confirm({
                    title: '确认开启遗忘曲线追踪吗？',
                    template: '开启后，你的遗忘曲线数据将会开始记录，如果之前已经有数据，会继续之前的数据绘图。',
                    cancelText: '取消', // String (default: 'Cancel'). The text of the Cancel button.
                    cancelType: 'button-energized', // String (default: 'button-default'). The type of the Cancel button.
                    okText: '确认', // String (default: 'OK'). The text of the OK button.
                    okType: 'button-balanced', // String (default: 'button-positive'). The type of the OK button.           
               }).
               then(function(res) {
                 if(res) {
                   Word.plan[$scope.planindex].forgetcurvetrack=true;
                 } else {
                   
                 }
               });          
            };
        }

        $scope.toggleAttendLedaoRank = function(state) {
           if(state) {
                $ionicPopup.confirm({
                    title: '确认关闭乐道排名吗？',
                    template: '关闭后，你将不会参与乐道排名，做一个与世无争的圣人。',
                    cancelText: '取消', // String (default: 'Cancel'). The text of the Cancel button.
                    cancelType: 'button-energized', // String (default: 'button-default'). The type of the Cancel button.
                    okText: '确认', // String (default: 'OK'). The text of the OK button.
                    okType: 'button-balanced', // String (default: 'button-positive'). The type of the OK button.           
               }).
               then(function(res) {
                 if(res) {
                   Word.plan[$scope.planindex].attendledaorank=false;
                 } else {
                   
                 }
               });          
           }
           else {
               $ionicPopup.confirm({
                    title: '确认开启乐道排名吗？',
                    template: '开启后，你将参与乐道排名，一同与乐道平台上的其他豪杰在榜单上竞争刷词之王。',
                    cancelText: '取消', // String (default: 'Cancel'). The text of the Cancel button.
                    cancelType: 'button-energized', // String (default: 'button-default'). The type of the Cancel button.
                    okText: '确认', // String (default: 'OK'). The text of the OK button.
                    okType: 'button-balanced', // String (default: 'button-positive'). The type of the OK button.           
               }).
               then(function(res) {
                 if(res) {
                   Word.plan[$scope.planindex].attendledaorank=true;
                 } else {
                   
                 }
               });          
            };
        }

    });


  bapp.controller('ToWordCtrl',function($http,Word,UI,$timeout,$scope,$ionicSlideBoxDelegate){
    $scope.threeslide=[{id:0},{id:1},{id:2}];
    $scope.towordchoice=[{id:0},{id:1},{id:2},{id:3},{id:4}];
    $scope.Word=Word;
    var separater=Math.floor(5418/5);
    
   
    var towordinit=function() {
        generate(0);
        generate(1);
    }

    var generate=function(uiindex) {
        Word.towords.uiword[uiindex].selected=-1;
        Word.towords.uiword[uiindex].choices=[];
  
        var currentarea=Math.floor(Word.towords.uiword[uiindex].currentword/separater);
        var random=Math.random();
        var correctplace=Math.floor(Math.random()*5);
        //分段取词，i代表段
        for (var i=0;i<5;i++)
        {
          if (i!=currentarea) {
            //四个段内的任意序数
            var index=Math.floor((i+random)*separater);
            Word.towords.uiword[uiindex].choices.push(index);
          }
        }
        //最好把正确答案随机插入
        Word.towords.uiword[uiindex].choices.splice(correctplace,0,Word.towords.uiword[uiindex].currentword);  
        Word.towords.uiword[uiindex].correctanswer=correctplace;
    }

    
    


    $scope.$on('$ionicView.loaded',function(){

    })

    $scope.$on('$ionicView.beforeEnter', function(){
      UI.menubuttonshow=false;
      $('#menu-button').hide();
      $timeout(function(){
        $ionicSlideBoxDelegate.$getByHandle('towords-slide').update();
      },0)   
    })

    $scope.$on('$ionicView.afterLeave', function(){
        UI.menubuttonshow=true;
    });


    $scope.$on('$ionicView.beforeEnter', function(){
      $ionicSlideBoxDelegate.$getByHandle('towords-slide').enableSlide(false);
      Word.towords.uiword[0].currentword=Word.worddata[0].towordssequence[0];
      Word.towords.uiword[1].currentword=Word.worddata[0].towordssequence[1];
      towordinit();
    })

    $scope.nextword=function(uiindex) {
        //页面跳转逻辑
        $ionicSlideBoxDelegate.$getByHandle('towords-slide').next();
        if (uiindex==0) {
          Word.towords.uiword[2].currentword=Word.worddata[0].towordssequence[1];
          generate(2)
        } 
        else if (uiindex==1) {
          Word.towords.uiword[0].currentword=Word.worddata[0].towordssequence[1];
          generate(0)
        }
        else {
          Word.towords.uiword[1].currentword=Word.worddata[0].towordssequence[1];
          generate(1)
        }
    }

    $scope.chooseword=function(uiindex,selectedanswer) {
      Word.towords.uiword[uiindex].selected=selectedanswer;
      var answer;
      if(selectedanswer==5) {
        answer='dontknow'
      }
      else if(selectedanswer==Word.towords.uiword[uiindex].correctanswer) {
        answer='correct'
      }
      else {
        answer='wrong'
      }
      $http.post('offline/flashcard/towords',{answer:answer,scope:'gaozhong3500'}).
      success(function(data) {
      })
      .error(function(){
        console.log('ohshit');
      });
      $timeout(function(){
        $scope.nextword(uiindex);
      },2000)
    }


  })


	bapp.controller('CardCtrl',['wordlist','FlashCard','$stateParams','$timeout','$http','$scope',function(wordlist,FlashCard,$stateParams,$timeout,$http,$scope){
		$scope.nextcardbool=true;
        $scope.wordlist=[{},{}];
        $scope.wordlength=[
        '',''
        ];
        

		$scope.$on('$ionicView.enter', function(){
            FlashCard.currentwordlevel=$stateParams.listlevel;
            FlashCard.currentwordlist=$stateParams.listnumber;
            FlashCard.askword($stateParams.listnumber,'init')
                .then(function(data){
                    $scope.initdata=data;
                    $scope.wordlist[0]=wordlist.data[data.nextword];
                    $scope.wordlist[1]=wordlist.data[data.nextnextword];
                    if($scope.wordlist[0].word.length<=8) {
                        $scope.wordlength[0]='big';
                    }
                    else if ($scope.wordlist[0].word.length<12){
                        $scope.wordlength[0]='middle';
                    }
                    else {
                        $scope.wordlength[0]='small';
                    }

                    if($scope.wordlist[1].word.length<=8) {
                        $scope.wordlength[1]='big';
                    }
                    else if ($scope.wordlist[1].word.length<12){
                        $scope.wordlength[1]='middle';
                    }
                    else {
                        $scope.wordlength[1]='small';
                    }
                });
        });

        

		$scope.flip=function() {
			$scope.flipbool=true;
		};

        $scope.next=function() {
            $scope.flipbool=false;
            $scope.nextcardbool=!$scope.nextcardbool;
            
        }

		$scope.oddnextcardknow=function() {
			$scope.next();
            FlashCard.wordresponse=true;
            FlashCard.askword($stateParams.listnumber,'next',true)
                .then(function(data){
                    $scope.worddata=data;
                    $scope.wordlist[0]=wordlist.data[data.nextnextword];
                    if($scope.wordlist[0].word.length<=8) {
                        $scope.wordlength[0]='big';
                    }
                    else if ($scope.wordlist[0].word.length<12){
                        $scope.wordlength[0]='middle';
                    }
                    else {
                        $scope.wordlength[0]='small';
                    }
                });
		}

		$scope.oddnextcardunknow=function() {
            $scope.next();
            FlashCard.wordresponse=false;
                        FlashCard.askword($stateParams.listnumber,'next',false)
                .then(function(data){
                    $scope.worddata=data;
                    $scope.wordlist[0]=wordlist.data[data.nextnextword];
                    if($scope.wordlist[0].word.length<=8) {
                        $scope.wordlength[0]='big';
                    }
                    else if ($scope.wordlist[0].word.length<12){
                        $scope.wordlength[0]='middle';
                    }
                    else {
                        $scope.wordlength[0]='small';
                    }
                });
		}

        $scope.evennextcardknow=function() {
            $scope.next();
            FlashCard.wordresponse=true;
                        FlashCard.askword($stateParams.listnumber,'next',true)
                .then(function(data){
                    $scope.worddata=data;
                    $scope.wordlist[1]=wordlist.data[data.nextnextword];
                    if($scope.wordlist[1].word.length<=8) {
                        $scope.wordlengthp[1]='big';
                    }
                    else if ($scope.wordlist[1].word.length<12){
                        $scope.wordlength[1]='middle';
                    }
                    else {
                        $scope.wordlength[1]='small';
                    }
                });
        }

        $scope.evennextcardunknow=function() {
            $scope.next();
            FlashCard.wordresponse=false;
                        FlashCard.askword($stateParams.listnumber,'next',false)
                .then(function(data){
                    $scope.worddata=data;
                    $scope.wordlist[1]=wordlist.data[data.nextnextword];
                    if($scope.wordlist[1].word.length<=8) {
                        $scope.wordlength[1]='big';
                    }
                    else if ($scope.wordlist[1].word.length<12){
                        $scope.wordlength[1]='middle';
                    }
                    else {
                        $scope.wordlength[1]='small';
                    }
                });
        }
  }]); 