/**
 * Created by zjg on 2020/1/30.
 */
$(function () {
//    渲染地区组件 选择器
    var cityPicker = new mui.PopPicker({layer:3})
    cityPicker.setData(cityData)
    var addressParams = LT.getUrlParams()
    if(addressParams.addressId) {
        $('.title').text('修改地址')
        LT.ajax('/address/queryAddress','','get').then(res=>{
            for(let i=0;i<res.length;i++) {
                if(res[i].id == addressParams.addressId){
                    $('[name="recipients"]').val(res[i].recipients);
                    $('[name="postcode"]').val(res[i].postCode);
                    $('[name="address"]').val(res[i].address);
                    $('[name="addressDetail"]').val(res[i].addressDetail);
                }
            }
        })
    }
    $('body').on('tap','#address-input',function () {
        cityPicker.show(function (items) {
            if(items[0].text == items[1].text) {
                items[0].text = ''
            }
            $('#address-input').val(items[0].text+items[1].text+(items[2].text||''));
        })
    }).on('tap','.btn_submit',function () {
      var addressData = LT.serialize2object($('.form_box').serialize())
        if(!addressData.recipients) {
            return mui.toast('收货人不能为空')
        }
        if(!addressData.postcode) {
            return mui.toast('邮编不能为空')
        }
        if(!addressData.address) {
            return mui.toast('省市区不能为空')
        }
        if(!addressData.addressDetail) {
            return mui.toast('详细地址不能为空')
        }
        LT.ajax('/address/addAddress',addressData,'post').then(res=> {
            if(res.success) {
                mui.toast('添加成功')
                window.location.href = '/h5/user/address.html'
            }else {
                mui.toast(res.message)
            }
        })
    })
})