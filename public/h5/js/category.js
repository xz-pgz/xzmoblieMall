/**
 * Created by zjg on 2020/1/5.
 */
$(function () {
    // 初始话数据 交互
    LT.ajax('/category/queryTopCategory', 'get').then(data=> {
        $('.cate-left ul').html(template('firstCate',data))
        getcateRight({id:$('.cate-left ul li:first-child').attr('data-id')})
    })
    //   事件  以及 业务 注册事件需要用委托
    $('.cate-left ul').on('tap','li',function () {
        if($(this).hasClass('now')) return false
        $(this).addClass('now').siblings().removeClass('now')
        getcateRight({id:$(this).attr('data-id')})
    })
//   搜索事件
    $('.header-right').on('tag',function () {
        if($('.cate-form input').val()) {
            LT.ajax('/product/queryProduct',{proName:$('.cate-form input').val()},'get',function (data) {
                
            })
        }
    })
})
// 封装获取右边数据函数
function getcateRight(data) {
    LT.ajax('/category/querySecondCategory',data,'get').then(data=> {
        $('.cate-right').html(template('secondCate',data))
    })
}


