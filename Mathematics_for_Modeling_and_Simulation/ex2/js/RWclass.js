/*!
 * RSclass.js
 * Copyright 2016 Kazuki Nakamae
 * Licensed under the MIT license
 */
/*[NOTICE]
* Pseud class-base OOP is implecated in this prigram.
* You check "http://www.yunabe.jp/docs/javascript_class_in_google.html"
*/
//function//////////////////////////////////////////////////////////////////////

/**
* @function 擬似クラス継承用プロトタイプチェーン指定
* @param {Function} childCtor  子クラスのコンストラクタ
* @param {Function} parentCtor 親クラスのコンストラクタ
*/
var setInherits=function(childCtor,parentCtor) {
  Object.setPrototypeOf(childCtor.prototype, parentCtor.prototype);
};

//randomwalker_class///////////////////////////////////////////////////////////
/**
* @class Randomwalker
*/
/**
* @namespace Randomwalker
*/
var randomwalker = randomwalker || {};
/**
* @constructor
* @param {Number} trials number of trials
* @param {Number} xmax value of x domain
* 定義域は、[-xmax,xmax]とする。
*/
randomwalker=function(trials,xmax){
  //argumentsオブジェクトをArrayオブジェクトに変換
  var argumentsArr = (arguments.length === 1?[arguments[0]]:Array.apply(null, arguments));
  try{
    //入力チェック
    if(argumentsArr.some(function(element, index, array){
      return(typeof element === "undefined")
    })||(argumentsArr.length!=2)
    ){
      throw new Error("Input error");
    }
    //引数代入
    this.trials =trials;
    //walkerの各変数を配列でまとめて宣言
    this.xArr=Array(this.name);
    //位置の定義域 (-xmax<x<xmax)とする
    this.maxX=xmax;
    //位置のヒストグラム
    this.histX=[];
    //位置二乗のヒストグラム
    this.histXX=[];
    //前呼び出しでの位置平均
    this.prevMean=0;
    //前呼び出しでの位置二乗平均
    this.prevMeansq=0;
    //前呼び出しでの位置二乗平均の変化量
    this.prevMeansqDelta=0;
  }catch(e){
    console.error(e);
  }
};
/**
* @method setRW(inputData,inputDataType,ID)
* setter
* @param  {StringGlobalObject_or_Number} inputData 入力データ
* @param  {StringGlobalObject} inputDataType 入力データの種類
* @param  {Number} ID 識別番号
* @return {Boolean} isSuccess 正しい処理がなされたかどうかを返す。(true:正常終了/false:異常終了)
*/
randomwalker.prototype.setRW=function(inputData,inputDataType,ID)  {
  isSuccess=false;
  try{
    if(inputDataType==="x"){
      this.xArr[ID]=inputData;
    }else{
      throw new Error("Undefined DataType : "+inputDataType);
    }
    isSuccess=true;
  }catch(e){
    console.error(e);
  }finally{
    return isSuccess;
  }
};
/**
* @method get(getDataType,ID)
* getter
* @param {StringGlobalObject} getDataType   取得データの種類 arguments[0]
* @param  {Number} ID 識別番号 arguments[1]
* @return {StringGlobalObject_or_Number_or_null} returnedData  取得したデータ
*/
randomwalker.prototype.get=function()  {
  var returnedData=null;
  if(arguments[0]==="trials"){
    returnedData=this.trials;
  }else if(arguments[0]==="x"){
    returnedData=this.xArr[arguments[1]];
  }else if(arguments[0]==="maxX"){
    returnedData=this.maxX;
  }else if(arguments[0]==="histX"){
    returnedData=this.histX;
  }else if(arguments[0]==="histXX"){
    returnedData=this.histXX;
  }
  return returnedData;
};
/**
* @method calcMean()
* 全体の平均を算出する
* @return {Number_or_null} returnedCalc  計算した平均
*/
randomwalker.prototype.calcMean=function(){
  var returnedCalc=null;
  try{
    var sum=0
    for(var i=this.xArr.length-1;i>=0;i--){
      sum=this.xArr[i]+sum;
    }
    returnedCalc=sum/this.xArr.length;
    if(typeof returnedCalc !== "number"){
      throw new Error("Calculation Error : "+returnedCalc);
    }
  }catch(e){
    console.error(e);
  }finally{
    return(returnedCalc)
  }
};
/**
* @method calcSD()
* 位置の標準偏差を算出する
* @return {Number_or_null} returnedCalc  計算した標準偏差
*/
randomwalker.prototype.calcSD=function(){
  try{
    var returnedCalc=null;
    var mean=this.calcMean();
    var sumsq=0;
    for(var i=this.xArr.length-1;i>=0;i--){
      sumsq+=this.xArr[i]*this.xArr[i]
    }
    returnedCalc=Math.sqrt((sumsq-this.xArr.length*mean*mean)/this.xArr.length);
    if(typeof returnedCalc !== "number") throw new Error("Calculation Error : "+returnedCalc);
  }catch(e){
    console.error(e);
  }finally{
    return(returnedCalc)
  }
};
/**
* @method calcMeanSquare()
* 全体の二乗平均を算出する
* @return {Number_or_null} returnedCalc  計算した二乗平均
*/
randomwalker.prototype.calcMeanSquare=function(){
  try{
    var returnedCalc=null;
    var sum=0
    for(var i=this.xArr.length-1;i>=0;i--){
      sum=this.xArr[i]*this.xArr[i]+sum
    }
    returnedCalc=sum/this.xArr.length;
  }catch(e){
    console.error(e);
  }finally{
    return(returnedCalc)
  }
};
/**
* @method calcSD()
* 位置二乗の標準偏差を算出する
* @return {Number_or_null} returnedCalc  計算した標準偏差
*/
randomwalker.prototype.calcMSSD=function(){
  try{
    var returnedCalc=null;
    var meansquare=this.calcMeanSquare();
    var sumsq=0;
    for(var i=this.xArr.length-1;i>=0;i--){
      sumsq+=this.xArr[i]*this.xArr[i]*this.xArr[i]*this.xArr[i];
    }
    returnedCalc=(sumsq-this.xArr.length*meansquare*meansquare)/this.xArr.length;
    if(typeof returnedCalc !== "number") throw new Error("Calculation Error : "+returnedCalc);
  }catch(e){
    console.error(e);
  }finally{
    return(returnedCalc)
  }
};
/**
* @method calcDeltaX()
* 位置の変化量を計算する
* @return {Number_or_null} returnedCalc  計算した変化量
*/
randomwalker.prototype.calcDeltaX=function(){
  try{
    var returnedCalc=null;
    returnedCalc=this.calcMean()-this.prevMean;
    this.prevMean=this.calcMean();
    if(typeof returnedCalc !== "number") throw new Error("Calculation Error : "+returnedCalc);
  }catch(e){
    console.error(e);
  }finally{
    return(returnedCalc)
  }
};
/**
* @method calcDeltaXX()
* 位置二乗の変化量を計算する
* @return {Array} returnedCalc  計算した位置二乗の変化量;[0]:1次変化量/[1]:2次変化量
*/
randomwalker.prototype.calcDeltaXX=function(){
  var returnedCalcArr=[];
  returnedCalcArr[0]=this.calcMeanSquare()-this.prevMeansq;
  this.prevMeansq=this.calcMeanSquare();
  returnedCalcArr[1]=returnedCalcArr[0]-this.prevMeansqDelta;
  this.prevMeansqDelta=returnedCalcArr[0];
  return(returnedCalcArr)
};
/**
* @method updateHist()
* ヒストグラムを更新する
* this.histX[index],this.histXX[index]は配列ではなく、
* indexに負の値をもつことができる連想配列であることに注意
*/
randomwalker.prototype.updateHist=function(){
  try{
    //位置のヒストグラム
    for(var x=this.maxX;x>=-this.maxX;x--){
      this.histX[x]=0;
    }
    for(var i=this.xArr.length-1;i>=0;i--){
      this.histX[this.xArr[i]]=this.histX[this.xArr[i]]+1
      if(typeof this.histX[this.xArr[i]] !== "number"){
        throw new Error("Calculation Error : "+this.histX[this.xArr[i]]);
      }
    }
    //位置二乗のヒストグラム
    for(var x=this.maxX;x>=-this.maxX;x--){
      this.histXX[x]=0;
    }
    for(var i=this.xArr.length-1;i>=0;i--){
      this.histXX[this.xArr[i]*this.xArr[i]]=this.histXX[this.xArr[i]*this.xArr[i]]+1
      if(typeof this.histXX[this.xArr[i]*this.xArr[i]] !== "number"){
        throw new Error("Calculation Error : "+this.histXX[this.xArr[i]*this.xArr[i]]);
      }
    }
  }catch(e){
    console.error(e);
  }
};
/**
* @method walk(forwardProb)
* ウォークを1進める
* @param  {Number} forwardProb 前に進む確率
* @param  {Number} time ステップ数(シードで結果を固定するために利用)
* @param  {Number} controlSeed 可変シードこの値とステップ数を組み合わせてシードを作成,0は禁止
*/
randomwalker.prototype.walk=function(forwardProb,time,controlSeed){
  for(var i=this.xArr.length-1;i>=0;i--){
    if(i==this.xArr.length-1) Math.seedrandom(i*10000+time+controlSeed);
    var randomNum=Math.random();
    if(randomNum<=forwardProb){
      this.xArr[i]=this.xArr[i]+1
    }else{
      this.xArr[i]=this.xArr[i]-1
    }
  }
};
