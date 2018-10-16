$(function() {
    var letao = new LETAO();
    letao.getCategoryLeft();
    letao.getCategoryRight();
})

var LETAO = function() {

}
LETAO.prototype = {
    getCategoryLeft: function() {
        $.ajax({
            url: '/category/queryTopCategory',
            success: function(data) {
                //console.log(data);
                var html = template('categoryLeftTpl', data);
                //console.log(html);
                $('#main .category-left ul').html(html);
            }
        })
    },
    getCategoryRight: function() {
        var ul = $('#main .category-left ul');
        ul.on('tap', '.category-left li a', getData);
        getData();
        function getData() {
            //console.log(this);
            var id = $(this).data('index') || 1;
            //console.log(id);
            $(this).parent().addClass('active').siblings().removeClass('active');
            $.ajax({
                url: '/category/querySecondCategory',
                data: {
                    id: id
                },
                success: function(data) {
                    //console.log(data);
                    var html = template('categoryRightTpl', data);
                    //console.log(html);
                    $('#main .category-right .mui-row').html(html);
                }
            })
        }

    }
}
