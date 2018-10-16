$(function() {
    var letao = new LETAO();
    letao.doLogin();
    letao.doRegister();
})

var LETAO = function() {

}

LETAO.prototype = {
    doLogin: function() {
        var that = this;
        $('.btn-login').on('tap', function() {
            var check = true;
            mui(".mui-input-group input").each(function() {
                //若当前input为空，则alert提醒 
                if (!this.value || this.value.trim() == "") {
                    var label = this.previousElementSibling;
                    mui.alert(label.innerText + "不允许为空");
                    check = false;
                    return false;
                }
            }); //校验通过，继续执行业务逻辑 
            if (check) {
                $.ajax({
                    url: '/user/login',
                    type: 'post',
                    data: {
                        username: $('.username').val(),
                        password: $('.password').val()
                    },
                    success: function(data) {
                        console.log(data);
                        if (data.error) {
                            mui.toast(data.message, { duration: 1000, type: 'div' });
                        } else {
                            //window.history.go(-1); //返回上一页
                            var returnUrl = that.getQueryString('returnUrl');
                            location.href = returnUrl;
                        }
                    }
                })
            }
        })
    },
    doRegister: function() {
        $('.btn-register').on('tap', function() {
            location.href = 'register.html';
        })
    },
    getQueryString: function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        } else {
            return null;
        }
    }
}
