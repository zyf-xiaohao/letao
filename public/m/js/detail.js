 $(function() {
         var letao = new LETAO();
         letao.id = letao.getQueryString('id');
         //console.log(letao.id);
         letao.getDetaContent(function() {
             letao.initSlider();
             letao.initWrapper();
         });
         letao.addCart();
     }

 )
 var LETAO = function() {

 }

 LETAO.prototype = {
     id: '',
     initSlider: function() {
         //获得slider插件对象
         var gallery = mui('.mui-slider');
         gallery.slider({
             interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
         });
     },
     initWrapper: function() {
         mui('.mui-scroll-wrapper').scroll({
             deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
         });
     },
     getQueryString: function(name) {
         var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
         var r = window.location.search.substr(1).match(reg);
         if (r != null) {
             return decodeURI(r[2]);
         } else {
             return null;
         }
     },
     getDetaContent: function(callback) {
         $.ajax({
             url: '/product/queryProductDetail',
             data: {
                 id: this.id
             },
             success: function(data) {
                 //console.log(data);
                 var html = template('detailTlp', data);
                 //console.log(html);
                 $('#main').html(html);
                 var size = data.size;
                 var arr = size.split('-');
                 //console.log(arr);
                 var reduce = Math.abs(arr[0] - arr[1]);
                 //console.log(reduce);
                 var span = '';
                 for (var i = 0; i <= reduce; i++) {
                     span += '<span class="btn-size">' + (Number(arr[0]) + i) + '</span>';
                     $('.product-size .right').html(span);
                 }
                 $('.btn-size').on('tap', function() {
                     //给当前点击的尺码按钮添加active其他的删除
                     $(this).addClass('active').siblings().removeClass('active');
                 });
                 //初始化数数据输入库
                 mui('.mui-numbox').numbox();

                 callback && callback(data);
             }
         })
     },
     addCart: function() {
         var that = this;
         $('.btn-add-cart').on('tap', function() {
             var size = $('.product-size span.active').html();
             if (!size) {
                 mui.toast('请选择尺码', { duration: 1000, type: 'div' });
                 return false;
             }
             var num = mui('.mui-numbox').numbox().getValue();
             if (!num) {
                 mui.toast('请选择数量', { duration: 1000, type: 'div' });
                 return false;
             }
             $.ajax({
                 url: '/cart/addCart',
                 type: 'post',
                 data: {
                     productId: that.id,
                     num: num,
                     size: size
                 },
                 success: function(data) {
                     console.log(data);
                     if (data.error) {
                         location.href = 'login.html?returnUrl=detail.html?id=' + that.id;
                     } else {
                         mui.confirm('添加购物车成功,是否去购物车查看', '温馨提示', ['是', '否'], function(data) {
                             console.log(data);
                             if (data.index == 0) {
                                 location.href = 'cart.html';
                             } else {
                                 mui.toast('继续添加购物车', { duration: 1000, type: 'div' });
                             }
                         })
                     }
                 }
             })
         })
     }
 }
