var bapp = angular.module('buildmind.mobile.event', []);

bapp.run(function(ActionSheet,$ionicActionSheet,Device,$cordovaFile,$cordovaDevice,Word,$http,$httpBackend,$ionicPlatform, Auth,$localstorage,$state,$cordovaNetwork,$cordovaToast,$rootScope,$cordovaKeyboard,$cordovaStatusbar) {
	$ionicPlatform.ready(function() {
		$ionicPlatform.on('offline',function(){
			Device.isOnline=false;
		});
		$ionicPlatform.on('online',function(){
			Device.isOnline=true;
		});
		$ionicPlatform.on('menubutton',function(){
	  		ActionSheet.show();
		});

	})
})
