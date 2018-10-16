$(function() {
    var letao = new LETAO();
    letao.getContent();
    letao.logout();
});
var LETAO = function() {

}

LETAO.prototype = {
    getContent: function() {
        $.ajax({
            url: '/user/queryUserMessage',
            success: function(data) {
                //console.log(data);
                $('.userName').html(data.username);
                $('.mobile').html(data.mobile);
            }
        })
    },
    logout: function() {
        $('.btn-exit').on('tap', function() {
            $.ajax({
                url: '/user/logout',
                success: function(data) {
                    if (data.success) {
                        location.href = 'login.html?returnUrl=user.html';
                    }
                }
            })
        })
    }
}
