/*!
 * main.js
 * Copyright 2016 Kazuki Nakamae
 * Licensed under the MIT license
 */

/*各変数、関数の宣言**************************************************************/

//アニメーション関数を定義
var requestAnimationFrame
    = window.requestAnimationFrame ||                 // 正式な実装
      window.webkitRequestAnimationFrame ||           // Google Chrome、Safari向け
      window.mozRequestAnimationFrame ||              // Firefox向け
      window.oRequestAnimationFrame ||                // Opera向け
      window.msRequestAnimationFrame ||               // InternetExplore向け
      function (callback, element) { window.setTimeout(callback, 1000 / 60); }; // 未対応ブラウザ向け
//canvas要素の取得
var canvasElement = document.getElementById('simulation');
canvasElement.width = canvasElement.clientWidth;
canvasElement.height = canvasElement.clientHeight;
//コンテキストの取得
var context=canvasElement.getContext('2d');       //コンテキストオブジェクト
var backcontext=document.getElementById('simulation').getContext('2d');	//背景コンテキストオブジェクト
//シミュレーション用変数
var time=0;
var width = canvasElement.width;   //横幅
var height = canvasElement.height; //縦幅
//ランダムウォーク処理を行うクラスのインスタンスを宣言
var RWsimulation = new randomwalker(1500);
for(var i=1500;i>0;i--){
  RWsimulation.setRW(0,'x',i)
}

/*メインストリームとなる処理関数の定義***********************************************/

// 読み込み後のwindowイベントの定義
window.addEventListener('load', function () {
  resizeTo(canvasElement.height, canvasElement.width); //ウィンドウサイズの指定
  drawStart();        //描画開始関数
});
// 描画開始関数の定義
var drawStart=function() {
  //開始待ち
  context.save()
	context.fillStyle = "gray";      //塗りつぶし色を指定
	context.font="34px 'Times New Roman'";
	context.textAlign="center";
	context.fillText("RANDOM WALK SIMULATION",(900)/2,canvasElement.height/2);
  context.restore()
  context.save()
	context.fillStyle = "orange";      //塗りつぶし色を指定
	context.font="20px 'Times New Roman'";
	context.textAlign="center";
	context.fillText("Click Start!",(900)/2,canvasElement.height/2+100);
  context.restore()
	//クリックでloop()に入るイベントを追加
	document.documentElement.addEventListener("click", loop,false);
	//即座にloop()に入るイベントを無効にするイベントを追加
	document.documentElement.addEventListener('click', function() {
		document.documentElement.removeEventListener('click', loop, false);
	}, false);
}
//ループ関数の定義
function loop() {

  //計算
  var average,sum=0
  for(var i=1500;i>0;i--){
    sum=RWsimulation.getRW('x',i)+sum
  }
  average=Math.round10(sum/1500,-2)
  var hist=[]
  for(var i=450;i>-449;i--){
    hist[i]=0;
  }
  for(var i=1500;i>0;i--){
    hist[RWsimulation.getRW('x',i)]=hist[RWsimulation.getRW('x',i)]+1
  }

  //描写
  if((time%1)==0){
    context.clearRect(0, 0, width, height); //canvasの全領域をクリアー
    context.textAlign="start";
    context.fillText("Steps="+time,5,30)
    context.fillText("Average="+average,5,60)
    context.save()
    context.strokeStyle="red"
    context.globalAlpha=0.1
    for(var i=1500;i>0;i--){
      context.beginPath()
      context.moveTo(RWsimulation.getRW('x',i)+width/2, 0)
      context.lineTo(RWsimulation.getRW('x',i)+width/2, height*2/3)
      context.stroke()
    }
    //histogram
    for(var i=450;i>-449;i--){
      context.beginPath()
      context.moveTo(i+width/2, height*2/3-hist[i])
      context.lineTo(i+width/2, height*2/3)
      context.stroke()
      context.restore();
    }
    //average point
    context.beginPath();
    context.moveTo(average+width/2,height*2/3);
    context.lineTo(average+10+width/2,height*2/3+50);
    context.lineTo(average-10+width/2,height*2/3+50);
    context.fill();
  }

  //遷移
  for(var i=1500;i>0;i--){
    var randomNum=Math.random()*3;
    if(randomNum>=1){
      RWsimulation.setRW(RWsimulation.getRW('x',i)+1,'x',i)
    }else{
      RWsimulation.setRW(RWsimulation.getRW('x',i)-1,'x',i)
    }
  }

  //時間経過
  time++;

  if(time!=10000)	requestAnimationFrame(loop);     //loop関数の呼び出し
}
