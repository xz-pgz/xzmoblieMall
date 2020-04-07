/**
 * Created by zjg on 2020/1/29.
 */
$(function () {
//上拉刷新
    mui.init({
        pullRefresh : {
            container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down : {
                height: 50,//可选,默认50.触发下拉刷新拖动距离,
                contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                auto: true,//可选,默认false.首次加载自动上拉刷新一次
                callback :function () {
                    let _that = this
                    getData( res => {
                        $("#content-box").html(template('detail',{model:res}));
                        $('.p_number input').val(0);
                        /*结束刷新状态*/
                        _that.endPulldownToRefresh();
                        //渲染完成 初始化轮播图
                        mui('.mui-slider').slider({ interval:3000});
                        //初始化 区域滚动
                        mui('.mui-scroll-wrapper').scroll({indicators:false});
                        $(".loading").hide()
                    })
                }
            }
        }
    });
// 事件绑定 最好用代理
    $('body').on('tap','.btn_size',function () {
        $(this).addClass('now').siblings().removeClass('now')
    }).on('tap','.p_number .jian',function () {
        let inputNum = parseInt($('.p_number input').val());
        if(inputNum == 0) {
            return mui.toast('已经是最小单位')
        }
        inputNum --
        $('.p_number input').val(inputNum);
    }).on('tap','.p_number .jia',function () {
        let inputNum = parseInt($('.p_number input').val());
        if(inputNum >= $('.p_number input').attr('data-max')) {
            return mui.toast('库存不足')
        }
        inputNum ++
        $('.p_number input').val(inputNum)
    }).on('tap','.btn_addCart',function () {
    //    规格验证
        var shopSize = $('.btn_size.now').text()
        if(!shopSize) {
            return mui.toast('请选择尺码')
        }
        var inputNum = $('.p_number input').val()
        if(inputNum<=0) {
            return mui.toast('至少选择一件商品')
        }
        //加入购物车
        LT.ajax('/cart/addCart',{productId:LT.getUrlParams().productId,size:shopSize,num:inputNum},'post').then(res=>{
            mui.confirm('添加成功，去购物车看看？', '温馨提示', ['是', '否'], function(e) {
                if (e.index == 0) {
                    location.href = LT.CART_URL;
                } else {
                    mui.toast('添加失败')
                }
            })
            console.log(res)
        })
    }).on('tap','.btn_pay',function () {
        return mui.toast('支付未实现')
    })
})
var getData = function (callback) {
    LT.ajax('/product/queryProductDetail',{id:LT.getUrlParams().productId},'get').then(res=> {
        callback && callback(res)
    })
}