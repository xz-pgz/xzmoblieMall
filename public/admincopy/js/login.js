$(function () {
    /*初始化效验插件*/
    /*
    1.是form表单结构 并且有一个提交按钮
    2.这个插件就是jquery插件 样式和 bootstrap 风格一致
     */
    $('#login').bootstrapValidator({
        feedbackIcons: {
            //校验成功的icon
            valid: 'glyphicon glyphicon-ok',
            //效验失败的icon
            invalid: 'glyphicon glyphicon-remove',
            //正在校验的icon
            validating: 'glyphicon glyphicon-refresh'
        },
    //    需要效验的表单元素
        fields:{
            username:{
                //校验规则 可能会有多个校验规则
                validators:{
                    notEmpty:{
                        message:'请输入用户名'
                    },
                    callback:{
                        message:'用户名错误'
                    }
                }
            },
            password:{
                validators:{
                    notEmpty:{
                        message:'请输入密码'
                    },
                    stringLength: {  //长度限制
                        min: 6,
                        max: 18,
                        message: '密码长度必须在6到18位之间'
                    },
                    callback:{
                        message:'密码错误'
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {//点击提交之后
        e.preventDefault();
        var form = $("#login")
        $.ajax({
            type:'post',
            url:'/employee/employeeLogin',
            data:form.serialize(),
            dataType:'json',
            success:function (res) {
                if(res.success) {
                    location.href = 'index.html';
                }else {
                    //恢复可提交的按钮
                    form.data('bootstrapValidator').disableSubmitButtons(false);
                    /*9.指定某一个表单元素的错误提示*/
                    /* NOT_VALIDATED, VALIDATING, INVALID or VALID */
                    if(res.error == 1000){
                        //用户名错误
                        // form.data('bootstrapValidator') 获取效验组件
                        //updateStatus() 调用更改状态的方法
                        // 效验的元素 icon 状态 使用什么规则
                        form.data('bootstrapValidator').updateStatus('username','INVALID','callback');
                    }else if(res.error == 1001){
                        //密码错误
                        form.data('bootstrapValidator').updateStatus('password','INVALID','callback');
                    }
                }
                console.log(res)
            },
            error:function (err) {
                console.log(err)
            }
        })
    });
})