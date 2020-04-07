$(function () {
    //解决 template 访问不到外部参数的问题
    template.helper('getJquery',function () {
        return jQuery
    })
    var render = function () {
        getSecondCateData(function (res) {
        //    模板渲染
            console.log(res)
            $('tbody').html(template('secondTab',res))
        //   初始化分页组件
            $('.pagination').bootstrapPaginator({
                bootstrapMajorVersion:3,
                currentPage:res.page,
                totalPages:Math.ceil(res.total/res.size),
                //点击事件
                onPageClicked:function (event, originalEvent, type,page) {
                    configData.page = page,
                    render()
                }
            })
        })
    }
    render()
    getFirstCateData(function (res) {
    //    显示功能
    //    一个对应id
        $('.dropdown-menu').html(template('selectForm',res)).on('click','li',function () {
            var categoryHtml = $(this).find("a").html()
            var categoryId = $(this).find("a").attr('data-id')
            $(".category-span").html(categoryHtml)
            $("[name='categoryId']").val(categoryId)
            $('#addform').data('bootstrapValidator').updateStatus('categoryId','VALID')
        })
    })
    picLoad()
/*
1.默认第一页展示
2.分页展示
3.点击添加分类弹窗
4.点击确认按钮 提交（一级分类id 二级分类名称 二级分类logo）
 */
    $('#addform').bootstrapValidator({
        //默认效验的表单 默认不去效验隐藏的
        excluded:[],
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
            categoryId:{
                //校验规则 可能会有多个校验规则
                validators:{
                    notEmpty:{
                        message:'必须选择一个选项'
                    }
                }
            },
            brandName:{
                validators:{
                    notEmpty:{
                        message:'请输入分类名称'
                    }
                }
            },
            brandLogo:{
                validators:{
                    notEmpty:{
                        message:'请上传一张图片'
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {//点击提交之后
        e.preventDefault();
        var form = $("#addCategory #addform")
        $.ajax({
            type:'post',
            url:'/category/addSecondCategory',
            data:form.serialize(),
            dataType:'json',
            success:function (res) {
                if(res.success) {
                    $("#addCategory").modal('hide')
                    configData.page = 1
                    render()
                    /*重置表单数据和校验样式*/
                    form[0].reset();
                    form.data('bootstrapValidator').resetForm();
                    $(".category-span").html('请选择');
                    form.find('img').attr('src','images/none.png');
                }else {
                    console.log(res)
                }
            },
            error:function (err) {
                console.log(err)
            }
        })
    });
})
//分页配置
var configData = {
    page:1,
    pageSize:5
}
var getSecondCateData = function (callback) {
    $.ajax({
        url:'/category/querySecondCategoryPaging',
        type:'get',
        dataType:'json',
        data:configData,
        success:function (res) {
            callback && callback(res)
        },
        error:function (err) {
            console.log(err)
        }
    })
}
var getFirstCateData = function (callback) {
    $.ajax({
        url:'/category/queryTopCategoryPaging',
        type:'get',
        dataType:'json',
        data:{
            page:1,
            pageSize:1000
        },
        success:function (res) {
            callback && callback(res)
        },
        error:function (err) {
            console.log(err)
        }
    })
}
//初始化上传插件
var picLoad = function () {
    $('#fileupload').fileupload({
        url:'/category/addSecondCategoryPic',
        dataType: 'json',
        done: function (e, data) {
            $('#picUpload').attr('src',data.result.picAddr)
            $("[name='brandLogo']").val(data.result.picAddr)
            $('#addform').data('bootstrapValidator').updateStatus('brandLogo','VALID')
        }
    })
}