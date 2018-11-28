$('.pushRadioSel input[type="radio"').change(function () {
    $(this).prop('checked', true).parent('li').addClass('checked').siblings('.checked').removeClass('checked').find('input').prop('checked', false);
});
//이벤트 리스트 토글 UI
$('.pushEvent .toggleUI').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);

    setTimeout(function () {
        $this.toggleClass('up');
    }, 400)

    var move_num = $('.pushEvent').outerHeight() - 56;

    if ($(this).hasClass('up')) {
        //하단 이벤트 영역 슬라이드업
        $('.pushEvent').css({ webkitTransform: 'translate3d(0, -' + move_num + 'px, 0)', transition: 'all 500ms cubic-bezier(0.250, 0.250, 0.540, 0.930)' })
        $('.dim').fadeIn().closest('body').css({ overflow: 'hidden' });
    } else {
        //하단 이벤트 영역 슬라이드다운
        $('.pushEvent').css({ webkitTransform: 'translate3d(0, 0, 0)', transition: 'all 500ms cubic-bezier(0.250, 0.250, 0.540, 0.930)' })
        $('.dim').fadeOut().closest('body').css({ overflow: 'auto' });;
    }
});

//하단 이벤트 영역 초기 세팅
$('.puchEventCont .eventList').css({ height: $(window).outerHeight() - 2981 }).closest('.pushEvent').css({ bottom: ($('.pushEvent').outerHeight() - 56) * -1 })

//삭제버튼 클릭 시 UI
$('.delete').on('click', function () {
    $('.pushArea').addClass('delete');
});

//상단 삭제 탭 닫을 때 UI
$('.pushDelete .close').on('click', function () {
    $('.pushArea').removeClass('delete');
});