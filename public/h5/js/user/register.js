/**
 * Created by zjg on 2020/1/30.
 */
$(function () {
    //点击注册按钮事件
    $('#btn_register').on('tap',function () {
        var registerObj =  LT.serialize2object($('.form_box').serialize())
        if($("#agree").is(':checked')) {
        //    数据检验
            if(registerObj.username == '') {
                return mui.toast('用户名不能为空')
            }
            if(registerObj.mobile == '') {
                return mui.toast('用户手机号不能为空')
            }
            if(!/^1[3456789]\d{9}$/.test(registerObj.mobile)) {
                return mui.toast('请填写正确的手机格式')
            }
            if(registerObj.password == '') {
                return mui.toast('用户密码不能为空')
            }
            if(registerObj.password != registerObj.rePass) {
                return mui.toast('两次输入的密码不一致')
            }
            if(registerObj.vCode == '') {
                return mui.toast('验证码不能为空')
            }
            if(!/^\d{6}$/.test(registerObj.vCode)){
                return mui.toast('请输入合法验证码');
            }
            LT.ajax('/user/register',registerObj,'post',function () {
                $('.btn_register').html('正在提交...')
            }).then(res=> {
                if(res.success){
                    mui.toast('注册成功！');
                    location.href = LT.LOGIN_URL;
                }else{
                    mui.toast(res.message);
                    $('.btn_register').html('注册');
                }
            })
        }else {
            mui.toast('请先同意服务协议')
        }
    })
//    获取验证码
    $('#code-btn').on('tap',function () {
       var codeBtn = $('#code-btn')
        if(!codeBtn.hasClass('btn_disabled')) {
            LT.ajax('/user/vCode','','get',function () {
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
//    我同意需要考虑特殊情况
})