/**
 * Created by zjg on 2020/1/5.
 */
// 整体对象
window.LT = {}
/*常用地址*/
LT.LOGIN_URL = '/h5/user/login.html';
LT.SEARCH_LIST_URL = '/h5/searchList.html';
LT.CART_URL = '/h5/user/cart.html';
LT.USER_URL = '/h5/user/';
LT.SHOPINNER_URL = '/h5/product.html';
// 封装ajax函数
/**
 * 封装请求方法
 * @param {Object} url  接口请求地址
 * @param {Object} data 接口请求参数（无需请求方式参数，则此项可以为空，否则必须传）
 * @param {Object} type 请求方式参数（可以为空）
 */
// 其实最好就是把参数封装成对象 这样的话 有一些参数可以直接给默认值 也不需要去理会参数的顺序
LT.ajax = function (url, data, type, beforeSend,dataType,) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: url,
      type: type && type ,
      dataType: dataType && dataType || 'json',
      data: data && data || '',
      beforeSend:function(){
        beforeSend && beforeSend();
      },
      success: function (res) {
        if(res && res.error == 400) {
          window.location.href = LT.USER_URL+'login.html'+'?returnUrl='+window.location.href
        }else {
          setTimeout(function () {
            resolve && resolve(res)
          },1000)
        }
      },
      error: function (err) {
        reject && reject(err)||mui.toast('服务器繁忙')
      }
    });
  });
}
// 封装获取当前页面的url 参数 return params
LT.getUrlParams = function () {
  var searchList = window.location.search
  var params = {}
  if (!searchList) {
    return false
  }
  // 去掉？
  searchList = searchList.replace('?', '')
  // 根据&切割
  var keyList = searchList.split('&')
  // 组合成数据对象
  for (var i = 0; i < keyList.length; i++) {
    var keyListItem = keyList[i].split('=')
    // 中文参数解码
    params[keyListItem[0]] = decodeURI(keyListItem[1])
  }
  return params
}
//封装表单序列化 转对象的方法
LT.serialize2object = function (str) {
  var obj = {}
  var arr = str.split('&')
  arr.forEach(function (item,index) {
    obj[arr[index].split('=')[0]] = decodeURI(arr[index].split('=')[1])
  })
  return obj
}
/*
 * 根据数组中对象数据获取索引
 * */
LT.getIndexFromId = function(arr,id){
  var index = null;
  for(var i = 0 ; i < arr.length ; i++){
    var item = arr[i];
    if(item && item.id == id){
      index = i;
      break;
    }
  }
  return index;
};
/*
 * 根据数组中对象数据ID获取索引
 * */
LT.getObjectFromId = function(arr,id){
  var object = null;
  for(var i = 0 ; i < arr.length ; i++){
    var item = arr[i];
    if(item && item.id == id){
      object = item;
      break;
    }
  }
  return object;
};