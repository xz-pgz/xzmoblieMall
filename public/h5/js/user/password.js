/**
 * Created by zjg on 2020/1/30.
 */
$(function () {
    $('.btn_updatePass').on('tap',function () {
        var upData = LT.serialize2object($('.form_box').serialize())
        if(upData.oldPassword == '') {
            return mui.toast('请输入原密码')
        }
        if(upData.newPassword == '') {
            return mui.toast('请输入新密码')
        }
        if(upData.reNewPassword == '') {
            return mui.toast('请再次输入新密码')
        }
        if(upData.vCode == ''){
            mui.toast('请输入验证码');
            return false;
        }
        if(!/^\d{6}$/.test(upData.vCode)){
            mui.toast('请输入合法验证码');
            return false;
        }
        if(upData.newPassword != upData.reNewPassword ) {
            return mui.toast('两次密码输入不一致')
        }
        LT.ajax('/user/updatePassword',upData,'post').then(res=> {
            if(res.success) {
                mui.toast('修改成功')
                window.location.href = LT.USER_URL + 'index.html'
            }else {
                mui.toast(res.message)
            }
        })
    })
    //    获取验证码
    $('#updatecode-btn').on('tap',function () {
        var codeBtn = $('#updatecode-btn')
        if(!codeBtn.hasClass('btn_disabled')) {
            LT.ajax('/user/vCodeForUpdatePassword','','get',function () {
                codeBtn.addClass('btn_disabled').html('正在发送...')
            }).then(res=>{
                console.log(res)
                var time = 60
                codeBtn.html(time+'秒后再获取')
                var timer = setInterval(function () {
                    time --
                    codeBtn.html(time+'秒后再获取')
                    if(time<=0) {
                        clearInterval(timer)
                        codeBtn.removeClass('btn_disabled').html('获取认证码');
                    }
                },1000)
            })
        }
    })
})
