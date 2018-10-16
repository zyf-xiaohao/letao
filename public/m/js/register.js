$(function() {
    var letao = new LETAO();
    letao.doRegister();
    letao.getVcode();
})

var LETAO = function() {

}
LETAO.prototype = {
    vcode: '',
    doRegister: function() {
        var that = this;
        $('.btn-register').on('tap', function() {
            var username = $('.username').val();
            var password = $('.password').val();
            var repassword = $('.repassword').val();
            var mobile = $('.mobile').val();
            var vcode = $('.vcode').val();

            var check = true;
            mui(".mui-input-group input").each(function() {
                //若当前input为空，则alert提醒 
                if (!this.value || this.value.trim() == "") {
                    var label = this.previousElementSibling;
                    mui.alert(label.innerText + "不允许为空");
                    check = false;
                    return false;
                }
                if (repassword != password) {
                    mui.toast('两次输入密码不一致', { duration: 1000, type: 'div' });
                    return false;
                }
                //console.log(that.vcode);
                if (vcode != that.vcode) {
                    mui.toast('验证码输入错误', { duration: 1000, type: 'div' });
                    return false;
                }
            }); //校验通过，继续执行业务逻辑 
            if (check) {
                $.ajax({
                    url: '/user/register',
                    type: 'post',
                    data: {
                        username: username,
                        password: password,
                        mobile: mobile,
                        vCode: vcode
                    },
                    success: function(data) {
                        console.log(data);
                        if (data.error) {
                            mui.toast(data.message, { duration: 1000, type: 'div' });
                        } else {
                            location.href = 'login.html?returnUrl=index.html';
                        }
                    }
                })
            }
        })
    },
    getVcode: function() {
        var that = this;
        $('.btn-getvCode').on('tap', function() {
            $.ajax({
                url: '/user/vCode',
                success: function(data) {
                    that.vcode = data.vCode;
                    console.log(data.vCode);
                }
            })
        })
    }
}
