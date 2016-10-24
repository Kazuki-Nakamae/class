/*!
 * main.js
 * Copyright 2016 Kazuki Nakamae
 * Licensed under the MIT license
 */

/*各変数、関数の宣言**************************************************************/

/**
* @function requestAnimationFrame
* アニメーション関数
* 毎秒60回ループ関数をcallback関数をよびだす
* 再帰的に使うのが一般的
* @param {function} callback
*/
var requestAnimationFrame
    = window.requestAnimationFrame ||                 // 正式な実装
      window.webkitRequestAnimationFrame ||           // Google Chrome、Safari向け
      window.mozRequestAnimationFrame ||              // Firefox向け
      window.oRequestAnimationFrame ||                // Opera向け
      window.msRequestAnimationFrame ||               // InternetExplore向け
      function (callback, element) { window.setTimeout(callback, 1000 / 60); }; // 未対応ブラウザ向け
/**
* @function onkeydown
* 自己定義リロードイベント関数
* Enterでリロードさせる
* @param {event} e イベント関数
* ※eはキーボード操作で自動的に発生する
*/
document.onkeydown = function (e){
  if(!e) e = window.event; // レガシー
  if(e.keyCode == 13){
    window.location.reload();
  }
};

//canvas要素の取得
var canvasElement = document.getElementById('simulation');
canvasElement.width = canvasElement.clientWidth;
canvasElement.height = canvasElement.clientHeight;

//コンテキストの取得
var context=canvasElement.getContext('2d');       //コンテキストオブジェクト
var backcontext=document.getElementById('simulation').getContext('2d');	//背景コンテキストオブジェクト

//シミュレーション用変数
var time=0; //時間
var xaxisArr = [-400,-300,-200,-100,0,100,200,300,400];　//x軸
var taxisArr = [50,100,200,300,400,500,600,700,800,850];
var meanaxisArr = [50,100,150,200,250,300];
var meansqaxisArr = [25000,50000,75000,100000,125000,150000];
var width = canvasElement.width;   //canvas横幅
var height = canvasElement.height; //canvas縦幅
var trials=3000;

//ランダムウォーク処理を行うクラスのインスタンスを宣言し、初期座標を入力
var RWsimulation = new randomwalker(trials,width/2);
for(var i=trials-1;i>=0;i--){
  RWsimulation.setRW(0,'x',i)
}

/*メインストリームとなる処理関数の定義***********************************************/

// 読み込み後のイベントを定義
window.addEventListener('load', function () {
  resizeTo(canvasElement.height, canvasElement.width); //ウィンドウサイズの指定
  drawStart();        //描画開始関数
});
/**
* @function drawStart
* アニメーション開始関数
* 待ち画面を表示させて、イベントリスナーを登録する
*/
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
}
/**
* @function loop
* アニメーションループ関数
* requestAnimationFrame()によって再帰的に繰り返される
* -(初期処理)-計算-描写-データ更新-時間更新-によって構成
* 10000stepsで終了するようにしてある
*/
var loop=function() {
  //初期処理
  if(time==0){
    context.clearRect(0, 0, canvasElement.width, canvasElement.height); //canvasの全領域をクリアー
    //tの座標
    context.save();
    for(var i=xaxisArr.length-1;i>=0;i--){
      context.beginPath();
      context.moveTo(taxisArr[i],height-20);
      context.lineTo(taxisArr[i],height-10);
      context.lineTo(taxisArr[i],height-10);
      context.fill();
      context.textAlign="center";
      context.font="12px 'Times New Roman'";
      context.fillText(taxisArr[i],taxisArr[i],height-1)
    }
    context.font="20px 'Times New Roman'";
    context.fillText("steps",880,height-5)
    context.restore();
    //<x>の座標
    context.save();
    context.strokeStyle="blue"
    context.fillStyle="blue"
    for(var i=xaxisArr.length-1;i>=0;i--){
      context.beginPath();
      context.moveTo(20,height-meanaxisArr[i]);
      context.lineTo(10,height-meanaxisArr[i]);
      context.lineTo(10,height-meanaxisArr[i]);
      context.fill();
      context.textAlign="center";
      context.font="12px 'Times New Roman'";
      context.fillText(meanaxisArr[i],10,height-meanaxisArr[i])
    }
    context.font="20px 'Times New Roman'";
    context.fillText("<x>",20,height-270)
    context.restore();
    //log(<x^2>)の座標
    context.save();
    context.strokeStyle="blue"
    context.fillStyle="green"
    for(var i=xaxisArr.length-1;i>=0;i--){
      context.textAlign="center";
      context.font="12px 'Times New Roman'";
      context.fillText(meansqaxisArr[i],width-25,height-meansqaxisArr[i]/500)
    }
    context.font="20px 'Times New Roman'";
    context.fillText("<x^2>",860,height-270)
    context.restore();
  }


  //the part of Calculation
  var mean=Math.round10(RWsimulation.calcMean(),-2); //<x>
  var sdx=Math.round10(RWsimulation.calcSD(),-2); //S.D. of <x>
  var meansq=Math.round10(RWsimulation.calcMeanSquare(),-2); //<x^2>
  var deltaX=Math.round10(RWsimulation.calcDeltaX(),-1);
  var deltaXXArr=RWsimulation.calcDeltaXX()
  var deltaXX=Math.round10(deltaXXArr[0],-1);
  var ddeltaXX=Math.round10(deltaXXArr[1],-1);
  RWsimulation.updateHist();  //ヒストグラム更新


  //the part of Drawing
  if((time%1)==0){
    context.clearRect(0, 0, width, height/2); //canvasの上半分をクリアー
    context.save();
    context.textAlign="start";
    context.font="20px 'Times New Roman'";
    context.fillText("Steps="+time,5,30)
    context.fillStyle="blue"
    context.fillText("<x>="+mean+" ± "+sdx,5,60)
    context.fillText("Δ<x>="+deltaX,5,90)
    context.fillStyle="green"
    context.fillText("<x^2>="+meansq,5,120)
    context.fillText("Δ<x^2>="+deltaXX,5,150)
    context.fillText("ΔΔ<x^2>="+Math.abs(ddeltaXX).toExponential(1),5,180)
    context.restore();
    //each x
    context.save()
    context.strokeStyle="red"
    context.globalAlpha=0.3;
    for(var i=1499;i>=0;i--){
      context.beginPath()
      context.moveTo(RWsimulation.get('x',i)+width/2, 0)
      context.lineTo(RWsimulation.get('x',i)+width/2, height/2-10)
      context.stroke()
    }
    context.restore()
    //x axis
    context.save()
    for(var i=xaxisArr.length-1;i>=0;i--){
      context.beginPath();
      context.moveTo(xaxisArr[i]+width/2,height/2-20);
      context.lineTo(xaxisArr[i]+1+width/2,height/2-10);
      context.lineTo(xaxisArr[i]-1+width/2,height/2-10);
      context.fill();
      context.textAlign="center";
      context.font="12px 'Times New Roman'";
      context.fillText(xaxisArr[i],xaxisArr[i]+width/2,height/2-1)
    }
    context.restore()
    //histogram
    for(var i=RWsimulation.get('maxX');i>=-RWsimulation.get('maxX');i--){
      context.beginPath()
      context.moveTo(i+width/2, height/2-10-RWsimulation.get('histX')[i])
      context.lineTo(i+width/2, height/2-10)
      context.stroke()
    }
    //The point of mean
    context.beginPath();
    context.moveTo(mean+width/2,height/2-10);
    context.lineTo(mean+10+width/2,height/2-1);
    context.lineTo(mean-10+width/2,height/2-1);
    context.fill();
    //t-<x> plot
    context.save();
    context.strokeStyle="blue"
    context.beginPath();
    context.arc(time*1, height-mean, 0.01, 0, Math.PI*2, false)
    context.stroke();
    context.restore();
    //t-<x^2> plot
    context.save();
    context.strokeStyle="green"
    context.beginPath();
    context.arc(time*1, height-meansq/500, 0.01, 0, Math.PI*2, false)
    context.stroke();
    context.restore();
  }

  //the part of transition
  var controlSeed=1;
  RWsimulation.walk(2/3,time,controlSeed);

  //time proceeding
  time++;

  if(time!=10000) requestAnimationFrame(loop);     //loop関数の呼び出し
}
