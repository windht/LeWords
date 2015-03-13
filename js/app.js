// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('LeWords', ['ngCordova','mockbackend','progressButton','ionic','service','filter','controller','angular-progress-arc','angular-svg-round-progress'])

.run(function($filter,$cordovaStatusbar,Device,Word,$ionicPlatform,$state,$localstorage,$http) {
  var introWatched=$localstorage.get('introWatched');
  Device.height=$(window).height();
  Device.width=$(window).width();
  var today=new Date();
  var day=today.getDate();
  var month=today.getMonth() + 1;
  var year=today.getFullYear();
  Device.date=year+'-'+month+'-'+day;

  $http.get('wordlists/gaozhong3500.json').success(function(data){
    Word.worddata.gaozhong3500.data=data.document.item;
    for (var i=0;i<5418;i++){
      if (Math.random()<=0.5) {
        Word.worddata.gaozhong3500.wordSequence.push(i);
      }
      else {
         Word.worddata.gaozhong3500.wordSequence.unshift(i);
      }
      Word.worddata.gaozhong3500.wordProgress.push(0);
      Word.worddata.gaozhong3500.totalRecords.push([]);
      Word.worddata.gaozhong3500.wordActivationLevel.push(0);
    }
  })
  $http.get('wordlists/toefl3000.json').success(function(data){
    Word.worddata.toefl.data=data;
    for (var i=0;i<2866;i++){
      Word.worddata.toefl.wordSequence.push(i);
      Word.worddata.toefl.wordProgress.push(0);
    }
  })
  $http.get('wordlists/yaoniming3000.json').success(function(data){
    Word.worddata.gre.data=data.wordbook.item;
    for (var i=0;i<3156;i++){
      Word.worddata.gre.wordSequence.push(i);
      Word.worddata.gre.wordProgress.push(0);
    }
  })

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    if (introWatched==true) {
      $state.go('dashboard');
    }
    else {
      $state.go('intro');
    }
    $cordovaStatusbar.style(0);
  });
})

.config(function($stateProvider, $urlRouterProvider,$locationProvider) {

    $urlRouterProvider.when('/', '/intro');
    $urlRouterProvider.when('', '/intro');

    $stateProvider
    .state('intro',{
      //特性介绍页面
      url:"/intro",
      views: {
        // 渲染到根目录无名view
        '@': {
          templateUrl: 'templates/intro.html',
          controller: 'IntroCtrl'
        },
      },
      data: {
          access:'all'
      }
    })
    .state('dashboard',{
        //
        url:"/dashboard",
        views: {
          '@': {
            templateUrl: 'templates/dashboard.html',
            controller: 'DashCtrl'
          },
        },
        data: {
            access:'all'
        }
    })
    .state('word',{
        //
        url:"/word/{type}",
        views: {
          '@': {
            templateUrl: 'templates/towords.html',
            controller: 'WordCtrl'
          },
        },
        data: {
            access:'all'
        }
    })

});
