$(function() {
    var letao = new LETAO();
    letao.getInputContent();
    letao.addContent();
    letao.delOneContent();
    letao.delAllContent();
})

var LETAO = function() {

}

LETAO.prototype = {
    getInputContent: function() {
        var that = this;
        $('.search-form .btn-search').on('tap', function() {
            var search = $('.search-form .input-search').val();
            //console.log(search);
            if(!search){
            	alert('请输入搜索内容');
            	return false;
            }
            var locaStorage = JSON.parse(localStorage.getItem('locaStorage')) || [];
            var index = locaStorage.indexOf(search);
            if (index != -1) {
                locaStorage.splice(index, 1);
                locaStorage.unshift(search);
            } else {
                locaStorage.unshift(search);
            }
            //console.log(JSON.stringify(locaStorage));
            localStorage.setItem('locaStorage', JSON.stringify(locaStorage));
            that.addContent();
            $('.search-form .input-search').val('');
            window.location.href = 'productlist.html?search=' + search;
        })
    },

    addContent: function() {
        var locaStorage = JSON.parse(localStorage.getItem('locaStorage')) || [];
        var html = template('historyTlp', { list: locaStorage });
        //console.log(html);
        $('.search-history .content ul').html(html);
    },
    delOneContent: function() {
        var that = this;
        $('.search-history .content ul').on('tap', '.content ul li .fa-close', function() {
            //console.log(this);
            var id = $(this).data('id');
            var locaStorage = JSON.parse(localStorage.getItem('locaStorage'));
            locaStorage.splice(id, 1);
            localStorage.setItem('locaStorage', JSON.stringify(locaStorage));
            that.addContent();
        })
    },
    delAllContent: function() {
        var that = this;
        $('.fa-trash').on('tap', function() {
            console.log('haha');
            localStorage.removeItem('locaStorage');
            that.addContent();
        })
    }
}
