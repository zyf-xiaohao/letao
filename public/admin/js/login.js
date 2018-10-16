$(function() {
    var letao = new LETAO();
    letao.doLogin();
})

var LETAO = function() {

}
LETAO.prototype = {
    doLogin: function() {
        $('.btn-login').on('click', function() {
            var userName = $('.userName').val();
            if (!userName.trim()) {
                alert('请输入用户名');
                return false;
            }
            var password = $('.password').val();
            if (!password.trim()) {
                alert('请输入密码');
                return false;
            }
            $.ajax({
                url: '/employee/employeeLogin',
                type: 'post',
                data: {
                    username: userName,
                    password: password
                },
                success: function(data) {
                    console.log(data);
                    if (data.success) {
                        location.href = 'index.html?username=' + userName;
                    } else {
                        alert(data.message);
                    }
                }
            })
        })
    }
}
