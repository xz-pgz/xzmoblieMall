/**
 * Created by zjg on 2020/1/30.
 */
$(function () {
    LT.ajax('/user/queryUserMessage','','get').then(res=> {
        //渲染
        $('.mui-media-body').html(res.username+'<p class="mui-ellipsis">绑定手机:'+res.mobile+'</p>')
    })
//    退出登录
    $('.btn_outLogin').on('tap',function () {
        LT.ajax('/user/logout','','get').then(res=>{
            if(res.success) {
                window.location.href = LT.LOGIN_URL
            }
            console.log(res)
        })
    })
})