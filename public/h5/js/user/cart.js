/**
 * Created by zjg on 2020/1/31.
 */
/*
 TODO:
 1.初始化数据
 2.侧滑 弹出层处理
 3.刷新
 4.价格
 5.全选与反选
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
    mui.init({
        pullRefresh: {
            container: ".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                height: 50,//可选,默认50.触发下拉刷新拖动距离,
                auto: true,//可选,默认false.首次加载自动下拉刷新一次
                contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: function () {
                    let _that = this
                    getCartData(function (res) {
                        $('#cart-box').html(template('cartTemplate',res))
                        Data = res
                        _that.endPulldownToRefresh()
                        _that.refresh(true)
                    })
                }//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    })
    $('body').on('tap','.fa-refresh',function () {
        //主动触发下拉组件
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading()
    }).on('tap','.mui-icon-compose',function () {
        var editID = $(this).attr('data-id')
        for(var i=0;i<Data.data.length;i++) {
            if(Data.data[i].id == editID ) {
                model = Data.data[i]
            }
        }
        var html = template('cartUpdateTpl',{model:model})
        //要把模板字符串中 的换行 解析替换成空格
        mui.confirm(html.replace(/\n/g,''), '编辑商品', ['确定', '取消'], function(e) {
            if (e.index == 0) {
                LT.ajax('/cart/updateCart',{id:editID,size:model.size,num:model.num},'post').then(res=>{
                    if(res.success) {
                        mui.toast('修改成功')
                        getCartData(function (res) {
                            $('#cart-box').html(template('cartTemplate',res))
                        })
                    }else {
                        mui.toast(res.message)
                    }
                })
            } else {
                mui.toast('取消编辑')
            }
        })
    }).on('tap','.btn_size',function () {
        $(this).addClass('now').siblings().removeClass('now')
        model.size = $(this).text()
    }).on('tap','.p_number span',function () {
        var operateNum = parseInt($('#operate-input').val())
        if($(this).hasClass('jian')) {
            if(operateNum <= 0) {
                return mui.toast('已经是最小单位')
            }
            operateNum --
            $('#operate-input').val(operateNum)
            model.num = operateNum
        }
        else {
            if(operateNum >= $('#operate-input').attr('data-max')) {
                return mui.toast('库存不足')
            }
            operateNum ++
            $('#operate-input').val(operateNum)
            model.num = operateNum
        }
    }).on('tap','.mui-icon-trash',function () {
        var deleteId = $(this).attr('data-id')
        mui.confirm('确定删除此条数据？', '温馨提示', ['确定', '取消'], function(e) {
            if (e.index == 0) {
                LT.ajax('/cart/deleteCart',{id:deleteId},'get').then(res=>{
                    if(res.success) {
                        mui.toast('删除成功')
                        getCartData(function (res) {
                            $('#cart-box').html(template('cartTemplate',res))
                        })
                    }else {
                        mui.toast(res.message)
                    }
                })
            } else {
                mui.toast('取消删除')
            }
        })
    }).on('change','.all-checked',function () {
        $('.oddselect').prop('checked',$(this).prop('checked')).trigger('change')
    //    计算金额
    //     var totalMoney = 0
    //     if($(this).prop('checked')) {
    //         for(var i=0;i<Data.data.length;i++){
    //             totalMoney += Data.data[i].num * Data.data[i].price
    //         }
    //     }
    //     $('#cartAmount').html(totalMoney.toFixed(2))
    }).on('change','.oddselect',function (){
    //   先判断全选反选
    //    选中把id 加入数组
        var selectId = $(this).attr('data-id')
        if($(this).prop('checked')) {
            idArr.push(selectId)
        }else {
            for(var i=0;i<idArr.length;i++) {
                if(idArr[i] == selectId) {
                    idArr.splice(i,1)
                }
            }
        }
        var allSelected = idArr.length == $('.oddselect').length?true:false
        $('.all-checked').prop('checked',allSelected)
        var amount=0
        for(var tag=0;tag<idArr.length;tag++) {
           var good = LT.getObjectFromId(Data.data,idArr[tag])
            amount += good.price*good.num;
        }
        $('#cartAmount').html(amount.toFixed(2))
    })
})
var getCartData = function (callback) {
    LT.ajax('/cart/queryCartPaging',{page:1,pageSize:100},'get').then(res=>{
        callback && callback(res)
    })
}
var model = {}
var Data = {}
var idArr = []
