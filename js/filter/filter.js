bappfilter=angular.module('filter', []);

bappfilter.filter('Timer', function() {  
    return function(input) {
    	var min=Math.floor(input/60);
    	var sec=input % 60;
    	if (sec<10) {
    		sec="0"+sec;
    	}
    	if (min<10) {
    		min="0"+min;
    	}
    	input=min+":"+sec;
    	
        return input;
    };  
});  

bappfilter.filter('RandomPicker', function() {  
    return function(input) {
        var arr= new Array(10);
        var result= new Array(10);
        for (i=0;i<10;i++) {
             arr[i]=Math.floor(10*(i+Math.random()));
             result[i]=input[arr[i]];
        }
        return result;
    };  
}); 

bappfilter.filter('ChoiceConverter', function() {  
    return function(input) {
        if (input==0) {return 'A'};
        if (input==1) {return 'B'};
        if (input==2) {return 'C'};
        if (input==3) {return 'D'};
    };  
}); 

bappfilter.filter('Wordplanscope', function() {  
    return function(input) {
        if (input=="gaofen2400") {return '高分冲刺2400'}
        if (input=="gaozhong3500") {return '高中3500'} 
        return input;
    };  
}); 

bappfilter.filter('StringCapitalize', function() {  
    return function(input) {
        input=_.string.capitalize(input);
        return input;
    };  
}); 

bappfilter.filter('StringUnCapitalize',function(){
    return function(input) {
        input=input.toLowerCase();
        return input;
    }
})
            

bappfilter.filter('CheckResult', function() {  
    return function(input) {
        var scoresheet=new Array(10);
        var score=0;
        for (i=0;i<10;i++) {
            if(input[i].CorrectAnswer===input[i].youranswer) {
                scoresheet[i]=true;
                score+=1;
            }
            else {
                scoresheet[i]=false;
            }
        }
        return {'scoresheet':scoresheet,'score':score};
    };  
}); 