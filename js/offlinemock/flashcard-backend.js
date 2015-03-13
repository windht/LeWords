var bapp = angular.module('mockbackend', ['ngMockE2E']);



bapp.run(function($httpBackend,$cordovaFile,Word){

$httpBackend.whenPOST('offline/routine').respond(function(method, url, data) {
  data.JSON.parse(data);
})

$httpBackend.whenPOST('offline/lewords').respond(function(method, url, data) {
    data=JSON.parse(data);
    var scope=data.scope;
    var everydayAmount=Word.worddata[scope].everydayAmount;
    var result;
    //伪后端。

    //优先进行今日计划，按今日应完成个数的数组进行刷词。（截取数组）

    //1.解析答案 分对与错 或是 斩！

    //2.跳跃！弹词！兴奋值根据（第几次见到）直接由函数得出，－－得到数据后再根据答题正确与否更新（暂未做）

    //3.下降！ 直接根据（第几次见到）得到下降函数，解x增加多少y才减少当前兴奋值的百分之二十？ 而后根据x决定这个词跳转的位置。

    //4.将见到次数加一（同时放入大纪录以及今日纪录），本次纪录达到四，视为今日该单词的任务完成，不跳转，直接放入下一日的头部。
  
    //5.实行跳转，如果超出今日的边界，则直接放于尾部。

    //6.将本次单词出现时的时间戳放入纪录内（大纪录）
    var currentword=Word.worddata[scope].wordSequence[0];
    if (data.answer=="dontknow" || data.answer=="wrong") {
      result=false;
    }
    else if (data.answer=="kill") {
      Word.worddata[scope].wordProgress[currentword]=999;
    }
    else {
      result=true;
    }

    //跳跃!
    var jump=10; //跳跃步长

    Word.worddata[scope].wordActivationLevel[currentword]+=jump; //加上步长

    var timeCho=new Date()
    timeCho=timeCho.getTime();

    // 打点
    Word.worddata[scope].totalRecords[currentword].push({
      result:result,
      plot:Word.worddata[scope].wordActivationLevel[currentword],
      wordCurrentProgress:Word.worddata[scope].wordProgress[currentword],
      time:timeCho
    });
    
    Word.worddata[scope].wordProgress[currentword]+=1; //见到＋1

    // 下落！函数大约为－1024x，－512x，－256x，－2的（10-当前progress）次方
    // 如此，－1024x下降特定值比－512x要少两倍时间，比256少四倍。暂且定义这个跳跃稳衡为5.

    var shiftplace=Math.pow(2,(Word.worddata[scope].wordProgress[currentword]))*5; //跳跃位置

    // 开始移位
    Word.worddata[scope].wordSequence.shift();
    // 千万记得检测边界，由于不会shift任何东西出局，我们直接会以总长度为比较
    var length=Word.worddata[scope].length;

    if (shiftplace>=length) {
      shiftplace=length;
    }

    if (Word.worddata[scope].wordProgress[currentword] >= 11) {
      Word.worddata[scope].wordProgress.splice(currentword,1);
    }

    else {
      Word.worddata[scope].wordSequence.splice(shiftplace,0,currentword);
    }

    var savedata={
      sequence:Word.worddata[scope].wordSequence,
      progress:Word.worddata[scope].wordProgress
    }
    savedata=JSON.stringify(savedata);
    
    // savefile();
    
    return [200, 'cool', {}];
});

$httpBackend.whenGET(/^templates\//).passThrough();
$httpBackend.whenGET(/^wordlists\//).passThrough();
$httpBackend.whenPOST(/^http/).passThrough();
$httpBackend.whenGET(/^flashcard\//).passThrough();
$httpBackend.whenGET(/^quiz\//).passThrough();

  


var savefile=function(path,filename,data){
  $cordovaFile.writeFile(path+filename,data,{append:false}).then(function(){},function(err){});
};

})
