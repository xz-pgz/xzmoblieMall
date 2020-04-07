$(function () {
  // 初始化数据
  $('.search-input').val('')
  $('.lt-history').html(template('historyTemp', { historyData: getHistoryparams() }))
  // 绑定事件
  $('body').on('tap', '.search-btn', function () {
    var keyWord = $('.search-input').val()
    if (!keyWord) {
      mui.toast('请输入关键词')
      return false
    }
    addHistoryparams(keyWord)
    window.location.href = LT.SEARCH_LIST_URL + '?keyWord=' + keyWord
  }).on('tap', '.delrecord', function () {
    localStorage.clear()
    $('.lt-history').html(template('historyTemp', { historyData: getHistoryparams() }))
  }).on('tap', '.history-icon', function () {
    removeHistoryparams($(this).parent().attr('data-key'))
    $('.lt-history').html(template('historyTemp', { historyData: getHistoryparams() }))
  }).on('tap','.history-a',function () {
    window.location.href = LT.SEARCH_LIST_URL + '?keyWord='+$(this).attr('data-key')
  })
})
// 调用方法还是写外层
// 获取
var getHistoryparams = function () {
  return JSON.parse(localStorage.getItem('Urlparam') || '[]')
}
// 增改
var addHistoryparams = function (key) {
  var paramsArr = getHistoryparams()
  console.log(paramsArr)
  for (var i = 0; i < paramsArr.length; i++) {
    if (key == paramsArr[i]) {
      return false
    }
  }
  //最多设置八条
  if(paramsArr.length > 9) {
    paramsArr.splice(0,1)
  }
  paramsArr.push(key)
  localStorage.setItem('Urlparam', JSON.stringify(paramsArr))
}
// 删除
var removeHistoryparams = function (key) {
  var paramsArr_1 = getHistoryparams()
  var index = paramsArr_1.findIndex(function (item) {
    return key == item
  })
  paramsArr_1.splice(index, 1)
  localStorage.setItem('Urlparam', JSON.stringify(paramsArr_1))
}
