/**
 * Created by zjg on 2020/1/30.
 */
$(function () {
    mui('.mui-scroll-wrapper').scroll({
        scrollY: true, //是否竖向滚动
        scrollX: false, //是否横向滚动
        startX: 0, //初始化时滚动至x
        startY: 0, //初始化时滚动至y
        indicators: false, //是否显示滚动条
        deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
        bounce: true //是否启用回弹
    });
    initData()
    $('body').on('tap','.mui-btn-red',function () {
        var id = $(this).attr('data-id')
        mui.confirm('确定删除该地址？', '温馨提示', ['是', '否'], function(e) {
            if (e.index == 0) {
                LT.ajax('/address/deleteAddress',{id:id},'post').then(res=>{
                    if(res.success){
                        mui.toast('删除成功')
                        initData()
                    }else {
                        mui.toast(res.message)
                    }
                })
            } else {
                mui.toast('删除失败')
            }
        })
    })
})
var initData = function () {
    LT.ajax('/address/queryAddress','','get').then(res=>{
        $('.mui-scroll').html(template('addressTpl',{model:res}))
    })
}