/*
后台管理系统的公共js文件
1.进度显示
2.了解jquery 相关的ajax 方法
当 ajax 发送请求 显示进度条
当 ajax 请求中没响应过来 显示进度加载
当 ajax 完成了结束了 进度条要走完 隐藏
 */
/*
 NProgress 插件
 */
NProgress.configure({
    mininum:0.1,
    easing: 'ease', speed: 500,
    trickle: false,
    trickleSpeed: 200,
    showSpinner: false,
})
$(window).ajaxStart(function () {
//    开启进度条
    NProgress.start()
})
$(window).ajaxComplete(function () {
    NProgress.done()
})
/*
侧边栏的显示与隐藏 二级菜单的显示与隐藏
 */
$('[data-menu]').on('click',function () {
    $('.ad_aside').toggle()
    $('.ad_section').toggleClass('menu')
});
$('.ad_aside .menu [href="javascript:;"]').on('click',function () {
    $(".ad_aside .menu li>.child").toggle()
});
$('.ad_aside .menu li').on('click',function () {
    $(this).addClass('now').siblings().removeClass('now')
});
/*
显示模态框 t退出功能
 */
var modalHtml = '<div class="modal fade" id="optionModal">'+
                 '    <div class="modal-dialog modal-sm">'+
                 '        <div class="modal-content">'+
                 '            <div class="modal-header">'+
                 '                <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>'+
                 '                <h4 class="modal-title">温馨提示</h4>'+
                 '            </div>'+
                 '            <div class="modal-body">'+
                 '                <p class="text-danger"><span class="glyphicon glyphicon-info-sign"></span> 您确定要 <strong>退出</strong> 这个用户吗？</p>'+
                 '            </div>'+
                 '            <div class="modal-footer">'+
                 '                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'+
                 '                <button type="button" class="btn btn-primary"><确定></确定></button>'+
                 '            </div>'+
                 '        </div>'+
                 '    </div>'+
                 '</div>';
$('body').append(modalHtml)
$('[data-logout]').on('click',function () {
    var optionModal = $('#optionModal')
    optionModal.modal('show').find('.btn-primary').on('click',function () {
        $.ajax({
            url:'/employee/employeeLogout',
            data:'',
            type:'get',
            dataType:'json',
            success:function (res) {
                if(res.success) {
                    optionModal.modal('hide')
                    window.location.href = '/admincopy/index.html'
                }
            },
            error:function (err) {
                console.log(err)
            }
        })
    })
})
