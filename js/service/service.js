bappservice = angular.module("service", []);

bappservice.factory('Device',function(){
	return {
		platform:'',
		isOnline:false,
		width:0,
		height:0,
		date:''
	}

})

bappservice.factory('Hash',function(){
	return {
		plan:0
	};
})

bappservice.factory('Plans',function(ColorBase){
	return {
		currentEdit:-1,
		currentEditStart:-1,
		data:[{
			hash:10000,
			color:ColorBase[0],
			currentArea:0,
			selectedscope:'gaozhong3500',
			scopeSelected:true,
			timeselected:60,
	        autoadjust:false,
	        forgetcurvetrack:false,
	        attendrank:true
		}]
	};
})

bappservice.factory('ColorBase',function(){
	return [{
		top:'#2fbc9c',
		bottom:'#2f94bc'
	},
	{
		top:'#995bb6',
		bottom:'#b65b8a'
	},
	{
		top:'#f2c40d',
		bottom:'#f7a352'
	}];
})

bappservice.factory('Motto',function(){
	return [
		{
			English:'Better to light one candle than to curse the darkness.',
			Chinese:'与其诅咒黑暗，不如燃起蜡烛。'
		},
		{
			English:'Four short words sum up what has lifted most successful individuals above the crowd: a little bit more.',
			Chinese:'成功的秘诀就是四个简单的字：多一点点。'
		},
		{
			English:'None is of freedom or of life deserving unless he daily conquers it anew.',
			Chinese:'只有每天再度战胜生活并夺取自由的人，才配享受生活的自由。'
		}
	]
})	

bappservice.factory('ActionSheet',function($ionicActionSheet){
	return {
		show: function() {
		   var hideSheet = $ionicActionSheet.show({
		     buttons: [
		       { text: '检查更新' },
		       { text: '帮助与反馈' },
		       { text: '软件评分'}
		     ],
		     titleText: '菜单',
		     cancelText: '取消',
		     cancel: function() {
		          hideSheet();
		        },
		     buttonClicked: function(index) {
		       return true;
		     }
		   });
		}
	}
})


bappservice.factory('Dateservice',function($filter) {
	var mydate = new Date();

	return mydate;
})

bappservice.factory('UI',function() {

	return {
		menubuttonshow:true
	}
})

bappservice.factory('Quiz',function(){

	return {
		current:0,
		ui: [],
		quizdata:[
			{
				type:'gaokao',
				subject:'math',
				database:[]
			}
		]
	}
})

bappservice.factory('Word',function() {

	return {
		loadProgress:0,
		plan:[],
		uicolor:{
			top:'',
			bottom:''
		},
		towords:{
			uiword:
			[
				{
					type:'',
					direction:'',
					currentword:'',
					selected:-1,
					correctanswer:-1,
					choices:[],
					flip:false
				},
				{
					type:'',
					direction:'',
					currentword:'',
					selected:-1,
					correctanswer:-1,
					choices:[],
					flip:false
				},
				{
					type:'',
					direction:'',
					currentword:'',
					selected:-1,
					correctanswer:-1,
					choices:[],
					flip:false
				}
			]
		},
		worddata:{
			gaozhong3500:{
				//单词数据
				data:[],
				total:5418,
				// 单词刷次顺序与进度以及兴奋值
				wordSequence:[],
				wordProgress:[],
				wordActivationLevel:[],
				// 计划信息，几天完成，每天多少个
				planDay:0,
				everydayAmount:0,

				// 总单词纪录，纪录单词每一次遇到时候的答题结果以及时间戳。
				totalRecords:[],

				// 每日记录，未完成前永远停留在今日的数组内部，全部刷完之后方可开始刷大表
				dayRecords:[
					{
						date:'2015-02-15',
						meetCount:0,
						planWords:[],
						planProgress:[]
					}
				]
			},
			gre:{
				data:[],
				total:3156,
				wordSequence:[],
				wordProgress:[]
			},
			toefl:{
				data:[],
				total:2866,
				wordSequence:[],
				wordProgress:[]
			}
		}
	}
})

bappservice.factory('GridService',function($filter) {
	service.width=new Array(4);
	service.height=new Array(4);
	service.top=new Array(4);
	service.left=new Array(4);
	service.reset=function() {
		service.width=new Array(4);
		service.height=new Array(4);
		service.top=new Array(4);
		service.left=new Array(4);
	}
	return service
})

bappservice.factory('Auth', function($http,$localstorage){

    currentUser=$localstorage.get('username');

    return {
        authorize: function(user, success, error) {
           $http.post('http://www.buildmind.org/mobileauth', user).success(function(user){
                success(user);
            }).error(error);
        },
        isLoggedIn: false,
        register: function(user, success, error) {
            $http.post('http://www.buildmind.org/mobileregister', user).success(function(res) {
                success(res);
            }).error(error);
        },
        login: function(user, success, error) {
            $http.post('http://www.buildmind.org/mobilelogin', user).success(function(user){
                success(user);
            }).error(error);
        },
        logout: function(user,success, error) {
            $http.post('http://www.buildmind.org/logout',user).success(function(){
                success();
            }).error(error);
        },
        user: currentUser,
        nextState:''
    };
});

bappservice.factory('CourseIntService',function() {
	service={};
	service.current=-1;
	service.currentmax=0;


	return service;
})


bappservice.factory('QuizResult',function($filter) {

	emptyarray=new Array(10);
	resultarray=new Array(10);

	function reset() {
		resultarray=emptyarray;
		qscore=0;
	}

	return {
    	qresult: resultarray,
    	qscore:0,
    	reset:reset
	};
})

bappservice.factory('FlashCard',function($filter,$http,$q,$localstorage) {

	var username = $localstorage.get('username');
	var currentword=0;
	var currentscope='gre';
	var currentprogress={common:[0,0],middle:[0,0],hard:[0,0]};
	return {
		currentword:currentword,
		currentprogress:currentprogress,
		getscope: function() {
			var deferred=$q.defer();
			$http({method: 'post', url: 'http://www.buildmind.org/api/flashcard/getscope', data:{username:username}}).
				success(function(data,status) {
					if(status==200) {
						deferred.resolve(data);
					}
				}).
				error(function(data) {
					sweetAlert("哎呀。。", "服务器忙！请重试！", "error");
				});
				return deferred.promise;
		},
		askword: function(listnum,asktype,know) {
			var deferred=$q.defer();
			$http({method: 'post', url: 'http://www.buildmind.org/api/flashcard/nextword', data:{username:username,currentlist:listnum,type:asktype,wordresponse:know}}).
				success(function(data,status) {
					if(status==200) {
						deferred.resolve(data);
					}
				}).
				error(function(data) {
					sweetAlert("哎呀。。", "服务器忙！请重试！", "error");
				});
				return deferred.promise;
		}
	};
})

bappservice.factory('socket',function(socketFactory){
});

bappservice.service( 'HardwareBackButtonManager', function($ionicPlatform){
  this.deregister = undefined;
 
  this.disable = function(){
    this.deregister = $ionicPlatform.registerBackButtonAction(function(e){
	e.preventDefault();
	return false;
    }, 101);
  }
 
  this.enable = function(){
    if( this.deregister !== undefined ){
      this.deregister();
      this.deregister = undefined;
    }
  }
  return this;
})



bappservice.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);