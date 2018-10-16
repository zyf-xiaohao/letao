$(function() {
    var letao = new LETAO();
    letao.getCartList(function(data) {
        //console.log(data);
        var html = template('cartListTpl', data);
        //console.log(html);
        $('#cartList .mui-table-view').html(html);
    });
    letao.initPulldownupRefresh();
    letao.delCart();
    letao.editCart();
    letao.addPrice();
})

var LETAO = function() {

}
LETAO.prototype = {
    page: 1,
    pageSize: 4,
    getCartList: function(callback) {
        $('#preloader_4').show();
        $.ajax({
            url: '/cart/queryCartPaging',
            data: {
                page: this.page,
                pageSize: this.pageSize
            },
            success: function(data) {
                //console.log(data);
                if (data.error) {
                    location.href = 'login.html?returnUrl=cart.html';
                    return false;
                }
                if (data instanceof Array) {
                    data = { data: data }
                }
                //console.log(data);
                callback && callback(data);
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
                that.pageSize = 4;
                //在下拉刷新的时候 拿到了搜索的关键字 调用ajax实现搜索 刷新页面
                // 2. 发送请求请求商品列表数据                                                    
                that.getCartList(function(data) {
                    //console.log(that.page);
                    var html = template('cartListTpl', data);
                    //console.log(html);
                    $('#cartList .mui-table-view').html(html);
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
                that.pageSize = 4;
                //2. 发送请求请求商品列表数据                           
                that.getCartList(function(data) {
                    //console.log(data);
                    if (data.data.length > 0) {
                        var html = template('cartListTpl', data);
                        //console.log(html);
                        $('#cartList .mui-table-view').append(html);
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                    } else {
                        //console.log(111);
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                    }
                });

            }, 1000);
        }
    },
    delCart: function() {
        var that = this;
        $('#cartList .mui-table-view').on('tap', '.mui-table-view li .btn-delete', function() {
            var elem = this;
            var id = $(elem).attr('cartId');
            //console.log(id);
            mui.confirm('添加购物车成功,是否去购物车查看', '温馨提示', ['是', '否'], function(data) {
                //console.log(data);
                if (data.index == 0) {
                    $.ajax({
                        url: '/cart/deleteCart',
                        data: {
                            id: id
                        },
                        success: function(data) {
                            if (data.success) {
                                that.page = 1;
                                that.pageSize = $('.mui-table-view li').size();
                                that.getCartList(function(data) {
                                    //console.log(that.page);
                                    var html = template('cartListTpl', data);
                                    //console.log(html);
                                    $('#cartList .mui-table-view').html(html);
                                    mui('#pullrefresh').pullRefresh().refresh(true);
                                });
                                mui.toast('删除成功', { duration: 'short', type: 'div' });
                            } else {
                                window.location.href = 'login.html?=returnUrl=cart.html';
                            }
                        }
                    })
                } else {
                    mui.swipeoutClose(elem.parentNode.parentNode); //传入dom原生对象
                }
            })
        })
    },
    editCart: function() {
        var that = this;
        $('#cartList .mui-table-view').on('tap', '.mui-table-view li .btn-edit', function() {
            var elem = this;
            var product = $(elem).data('product');
            var start = product.productSize.split('-')[0];
            var end = product.productSize.split('-')[1];
            var arr = [];
            for (var i = start; i <= end; i++) {
                arr.push(parseInt(i));
            }
            product.productSize = arr;
            //console.log(product);
            var html = template('editTpl', product);
            html = html.replace(/[\r\n]/g, "");

            mui.confirm(html, product.proName.split(' ')[0], ['确定', '取消'], function(data) {
                var size = $('.btn-size.active').data('size');
                var num = mui('.mui-numbox').numbox().getValue();
                if (data.index == 0) {
                    $.ajax({
                        url: '/cart/updateCart',
                        type: 'post',
                        data: {
                            id: product.id,
                            size: size,
                            num: num
                        },
                        success: function(data) {
                            if (data.success) {
                                that.page = 1;
                                that.pageSize = $('.mui-table-view li').size();
                                that.getCartList(function(data) {
                                    //console.log(that.page);
                                    var html = template('cartListTpl', data);
                                    //console.log(html);
                                    $('#cartList .mui-table-view').html(html);
                                });
                                mui.toast('修改成功', { duration: 'short', type: 'div' });
                            } else {
                                window.location.href = 'login.html?=returnUrl=cart.html';
                            }
                        }
                    })
                } else {
                    mui.swipeoutClose(elem.parentNode.parentNode); //传入dom原生对象
                }
            });
            //弹框完成后初始化尺码选择和数据输入框
            $('.btn-size').on('tap', function() {
                //给当前点击的尺码按钮添加active其他的删除
                $(this).addClass('active').siblings().removeClass('active');
            });
            //初始化数数据输入框
            mui('.mui-numbox').numbox();
        })
    },
    addPrice: function() {
        $('#cartList .mui-table-view').on('change', '.mui-pull-left input[type="checkbox"]', function() {
            //console.log(this);
            var sum = 0;
            $('input:checked').each(function(index, value) {
                var price = $(value).data('price');
                var num = $(value).data('num');
                //console.log(price, num);
                sum += price * num;
            });
            sum = sum.toFixed(2);
            //console.log(sum);
            $('#count .mui-pull-left span').html(sum);
        })
    }
}
