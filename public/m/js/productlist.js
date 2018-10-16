$(function() {
    var letao = new LETAO();
    letao.search = letao.getQueryString('search');
    letao.getProContent(function(data) {
        //console.log(data);
        var html = template('productlistTpl', data);
        //console.log(html);
        $('#productlist .content .mui-row').html(html);
    });
    letao.initPulldownupRefresh();
    letao.sortProContent();
    letao.searchProContent();
})

var LETAO = function() {

}

LETAO.prototype = {
    search: '',
    page: 1,
    pageSize: 2,
    price: null,
    num: null,
    getQueryString: function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        } else {
            return null;
        }
    },
    getProContent: function(callback) {
        $('#preloader_4').show();
        $.ajax({
            url: '/product/queryProduct',
            data: {
                proName: this.search,
                page: this.page,
                pageSize: this.pageSize,
                price: this.price,
                num: this.num
            },
            success: function(data) {
                callback && callback(data);
                
                $('.product-buy').on('tap', function() {
                    var href = $(this).siblings('a').attr('href');
                    console.log(href);
                    window.location.href = href;
                })
                $('#preloader_4').hide();
            }
        })
    },
    initPulldownupRefresh: function() {
        var that = this;
        // 4. 初始化下拉刷新（类似于初始化区域滚动）
        mui.init({
            pullRefresh: {
                //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等区域滚动 的父容器可以写类名或者id选择器
                container: "#pullrefresh",
                //初始化下拉刷新
                down: {
                    contentrefresh: "哥正在拼命刷新...",
                    callback: pulldownRefresh
                },
                up: {
                    contentrefresh: "哥正在拼命加载更多...",
                    contentnomore: '在下实在是给不了给不了更多了，亲！',
                    //必选，刷新函数 发送请求请求最新下一页数据
                    callback: pullupRefresh
                }
            }
        });

        function pulldownRefresh() {
            setTimeout(function() {
                //1. 在下拉刷新之前把page重置为1 因为上拉的时候已经把page加到没有数据 把page重置为起点
                that.page = 1;
                that.pageSize = 2;
                that.search = that.getQueryString('search');
                //在下拉刷新的时候 拿到了搜索的关键字 调用ajax实现搜索 刷新页面
                // 2. 发送请求请求商品列表数据                                                    
                that.getProContent(function(data) {
                    //console.log(data);
                    var html = template('productlistTpl', data);
                    //console.log(html);
                    $('#productlist .content .mui-row').html(html);
                });
                mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                mui('#pullrefresh').pullRefresh().refresh(true);
            }, 1000)
        }

        function pullupRefresh() {
            //是因为模拟请求延迟给个1秒的延迟 1秒钟后结束上拉加载
            setTimeout(function() {
                //1. 在上拉加载之前 先让当前页码数++  假如当前是1 ++ 完后就是2  上拉加载请求第二页数据
                that.page++;
                //2. 发送请求请求商品列表数据                           
                that.getProContent(function(data) {
                    if (data.data.length > 0) {
                        //console.log(data);
                        var html = template('productlistTpl', data);
                        //console.log(html);
                        $('#productlist .content .mui-row').append(html);
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                    } else {
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                    }
                });

            }, 1000);
        }
    },
    sortProContent: function() {
        var that = this;
        $('#productlist .title a').on('tap', function() {
            var sortType = $(this).data('sort-type');
            var sort = $(this).data('sort');
            sort = sort == 1 ? 2 : 1;
            $(this).data('sort', sort);
            if (sortType == 'price') {
                that.price = sort;
                that.num = null;
            } else {
                that.num = sort;
                that.price = null;
            }
            that.page = 1;
            that.pageSize = $('.mui-col-xs-6').size();
            that.getProContent(function(data) {
                //console.log(data);
                var html = template('productlistTpl', data);
                //console.log(html);
                $('#productlist .content .mui-row').html(html);
            });
        })
    },
    searchProContent: function() {
        var that = this;
        $('.btn-search').on('tap', function() {
            var search = $('.input-search').val();
            if (!search) {
                alert('请输入要搜索的商品');
                return false;
            }
            that.page = 1;
            that.pageSize = 2;
            that.search = search;
            that.getProContent(function(data) {
                //console.log(data);
                var html = template('productlistTpl', data);
                //console.log(html);
                $('#productlist .content .mui-row').html(html);
            });
            $('.input-search').val('');
        })
    }
}
