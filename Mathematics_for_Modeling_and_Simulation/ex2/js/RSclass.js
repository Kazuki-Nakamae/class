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
* @param {Number} number number of sample
*/
randomwalker=function(number){
  //argumentsオブジェクトをArrayオブジェクトに変換
  var argumentsArr = (arguments.length === 1?[arguments[0]]:Array.apply(null, arguments));
  try{
    //入力チェック
    if(argumentsArr.some(function(element, index, array){
      return(typeof element === "undefined")
    })||(argumentsArr.length!=1)
    ){
      throw new Error("Input error");
    }
    //引数代入
    this.number =number;
    //walkerの各変数を配列でまとめて宣言、個体の状態はindexにしたがって一致している
    //つまりシードがseedArr[1]の個体のx座標はthis.seedArr[1]となる
    this.xArer=Array(this.name);
    this.seedArr=Array(this.name);
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
      this.xArer[ID]=inputData;
    }else if(inputDataType==="seed"){
      this.seedArr[ID]=inputData;
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
* @method getRW(getDataType)
* getter
* @param {StringGlobalObject} getDataType   取得データの種類
* @param  {Number} ID 識別番号 argument[2]
* @return {StringGlobalObject_or_Number_or_null} returnedData  取得したデータ
*/
randomwalker.prototype.getRW=function(getDataType,ID)  {
  var returnedData=null;
  if(getDataType==="x"){
    returnedData=this.xArer[ID];
  }else if(getDataType==="seed"){
    returnedData=this.seedArr[ID];
  }
  return returnedData;
};
