$(function () {
  // 封装参数成一个对象
  var product = {
    proName: '',
    brandId: '',
    time: '',
    price: '',
    num: '',
    discount: '',
    page: 1,
    pageSize: 10
  }
  // 标识数组 初始化用
  var tagArr = ['time', 'price', 'num', 'discount']
  // 判断是否有参数过来
  if (LT.getUrlParams().keyWord) {
    var keyWord = LT.getUrlParams().keyWord
    $('.search-input').val(keyWord)
    // 初始化接口数据 初始化排序条件
    product.proName = keyWord
    initData(product, function (res) {
      $('.shop-content').html(template('shopList', res))
    })
  }
  // 上拉更新 下拉加载
  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        height: 50,//可选,默认50.触发下拉刷新拖动距离,
        auto: false,//可选,默认false.首次加载自动下拉刷新一次
        contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
        contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
        contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        callback: function () {
          let _that = this
          initData($.extend(product, { page: 1 }), function (res) {
            $('.shop-content').html(template('shopList', res))
            this.setTimeout(() => {
              _that.endPulldownToRefresh()
              _that.refresh(true)
            }, 1000);
          })
        }//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      },
      up: {
        height: 50,//可选.默认50.触发上拉加载拖动距离
        auto: false,//可选,默认false.自动上拉加载一次
        contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
        contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
        callback: function () {
          let _that = this
          product.page++
          initData(product, function (res) {
            if (!res.data.length || res.data.length < 10) {
              this.setTimeout(() => {
                _that.endPullupToRefresh(true)
                return false
              })
            }
            $('.shop-content').append(template('shopList', res))
            this.setTimeout(() => {
              _that.endPullupToRefresh(true)
            }, 1000);
          })
        }//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据
      },
    }
  })
  // 事件整理
  $('body').on('tap', '.search-btn', function () {
    window.location.href = LT.SEARCH_LIST_URL + '?keyWord=' + $('.search-input').val()
  }).on('tap', '.lt-card-item', function () {
    var tag = $(this).find('a').attr('data-tag')
    // 图标改变事件
    if ($(this).hasClass('now')) {
      if ($(this).find('.lt-card-icon').hasClass('fa-angle-down')) {
        $(this).find('.lt-card-icon').removeClass('fa-angle-down').addClass('fa-angle-up')
      } else {
        $(this).find('.lt-card-icon').removeClass('fa-angle-up').addClass('fa-angle-down')
      }
    } else {
      $(this).addClass('now')
    }
    $(this).siblings().removeClass('now')
    $(this).siblings().find('.lt-card-icon').removeClass('fa-angle-up').addClass('fa-angle-down')
    for (let i = 0; i < tagArr.length; i++) {
      product[tagArr[i]] = ''
    }
    product[tag] = $(this).find('.lt-card-icon').hasClass('fa-angle-up') ? 1 : 2
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading()
  }).on('tap','.shop-box',function () {
    window.location.href = LT.SHOPINNER_URL + '?productId=' + $(this).attr('data-id')
  })
})
var initData = function (product, callback) {
  LT.ajax('/product/queryProduct', product, 'get').then(res => {
    callback && callback(res)
  })
}