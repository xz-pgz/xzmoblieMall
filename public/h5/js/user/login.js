/**
 * Created by zjg on 2020/1/30.
 */
$(function () {
    $('#btn-login').on('tap',function () {
        var loginData = LT.serialize2object($('.mui-input-group').serialize())
        LT.ajax('/user/login',loginData,'post').then(res=>{
            if(res.success){
                if(window.location.search) {
                    window.location.href = window.location.search.substr(11)
                }else {
                    window.location.href = LT.USER_URL + 'index.html'
                }
            }else {
                return mui.toast(res.message)
            }
        })
    })
})