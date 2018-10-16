$(function() {
    var letao = new LETAO();
    letao.getContent();
    letao.logOut();
})

var LETAO = function() {

}
LETAO.prototype = {
    page: 1,
    pageSize: 4,
    getContent: function() {
        var that = this;
        //登陆用户信息加载到页面上
        var userName = this.getQueryString('username');
        $('.user h4').html(userName);

        //加载移动端注册用户列表
        $.ajax({
            url: '/user/queryUser',
            data: {
                page: this.page,
                pageSize: this.pageSize
            },
            success: function(data) {
                console.log(data);
                var html = template('conTpl', data);
                $('.content .table tbody').html(html);
                var totalPages = Math.ceil(data.total / that.pageSize);
                that.doPage(totalPages);
            }
        })
    },
    doPage: function(totalPages) {
        var that = this;
        $("#page").bootstrapPaginator({
            bootstrapMajorVersion: 3, //对应的bootstrap版本
            currentPage: that.page, //当前页数
            numberOfPages: 5, //每次显示页数
            totalPages: totalPages, //总页数
            shouldShowPage: true, //是否显示该按钮
            useBootstrapTooltip: true,
            //点击事件
            onPageClicked: function(event, originalEvent, type, page) {
                console.log(page);
                that.page = page;
                that.getContent();
            }
        });
    },
    logOut: function() {
        $('.login-out').on('click', function() {
            $.ajax({
                url: '/employee/employeeLogout',
                success: function(data) {
                    if (data.success) {
                        location.href = 'login.html';
                    } else {
                        alert('退出失败');
                    }
                }
            })
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
