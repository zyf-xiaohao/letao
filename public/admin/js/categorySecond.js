$(function() {
    var letao = new LETAO();
    letao.getContent();
    letao.logOut();
    //letao.addCategory();
})

var LETAO = function() {

}
LETAO.prototype = {
    page: 1,
    pageSize: 4,
    getContent: function() {
        var that = this;
        //加载移动端注册用户列表
        $.ajax({
            url: '/category/querySecondCategoryPaging',
            data: {
                page: this.page,
                pageSize: this.pageSize
            },
            success: function(data) {
                //console.log(data);
                var html = template('categorySecTpl', data);
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
                //console.log(page);
                that.page = page;
                that.getContent();
            }
        });
    },
    addCategory: function () {
        var that = this;
        $('.btn-save').on('click',function () {
            var categoryName = $('.category-name').val();
            if(!categoryName.trim() || categoryName.length>5){
                alert('请输入4字以下商品名');
                return false;
            }
            $.ajax({
                url: '/category/updateSecondCategory',
                type: 'post',
                data: {
                    categoryName: categoryName
                },
                success: function (data) {
                    console.log(data);
                    if(data.success){
                        that.getContent();
                    }
                }
            })
        })
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
    }
}
