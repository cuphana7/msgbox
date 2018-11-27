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

// page history
var parameter_list = {};
var hasSkipRetain = 0; // 페이지 history에 저장 안함 여부

parameter_list['app.info.ver'] = '3.3.1';
parameter_list['app.info.token'] = 'e610983851342fcf4a7fcec783f3744e3dbdea6eae8ed89d482eb47588c41fa83ed2087f66d4a8d8fa7116e20820f290';
parameter_list['area_id'] = 'T1C';
parameter_list['app.info.name'] = 'kbcardiaAndroid';
parameter_list['app.info.id'] = 'KIA00000000066993';

var hasStepURI = false;



/* PageHistory Javascript Class - start */
var PageHistory = function (keyName) {
    this.keyName = keyName;
};

PageHistory.prototype.count = function () {
    var ph = sessionStorage.getItem(this.keyName) || '[]';
    ph = JSON.parse(ph);
    return ph.length;
};

PageHistory.prototype.get = function (index) {
    var ph = sessionStorage.getItem(this.keyName) || '[]';
    ph = JSON.parse(ph);
    var lastIndex = ph.length - 1;
    if (index === undefined) {
        index = lastIndex;
    }
    return ph[index];
};

PageHistory.prototype.getAll = function () {
    var ph = sessionStorage.getItem(this.keyName) || '[]';
    ph = JSON.parse(ph);
    return ph;
};

PageHistory.prototype.setAll = function (ph) {
    ph = JSON.stringify(ph);
    sessionStorage.setItem(this.keyName, ph);
};

PageHistory.prototype.set = function (data, index) {
    var ph = sessionStorage.getItem(this.keyName) || '[]';
    ph = JSON.parse(ph);
    var lastIndex = ph.length - 1;
    if (index === undefined) {
        index = lastIndex;
    }
    $.extend(ph[index], data);
    ph = JSON.stringify(ph);
    sessionStorage.setItem(this.keyName, ph);
};

PageHistory.prototype.add = function (pageInfo) {
    var ph = sessionStorage.getItem(this.keyName) || '[]';
    ph = JSON.parse(ph);
    var lastIndex = ph.length - 1;

    if (lastIndex > -1) {


        var lastPageInfo = ph[lastIndex];
        if (lastPageInfo.uri == pageInfo.uri &&
            JSON.stringify(lastPageInfo.parameters) == JSON.stringify(pageInfo.parameters)) {
            this.set(pageInfo);
            console.log("duplicated navigation detected. skip.");
            return false;
        }
    }

    ph.push(pageInfo);
    ph = JSON.stringify(ph);
    sessionStorage.setItem(this.keyName, ph);
};

PageHistory.prototype.remove = function (index) {
    var ph = sessionStorage.getItem(this.keyName) || '[]';
    ph = JSON.parse(ph);
    var lastIndex = ph.length - 1;
    if (index === undefined) {
        index = lastIndex;
    }
    ph.splice(index, 1);
    ph = JSON.stringify(ph);
    sessionStorage.setItem(this.keyName, ph);
};

PageHistory.prototype.clear = function (uri, paramList) {
    var ph;
    if (uri) {
        ph = sessionStorage.getItem(this.keyName) || '[]';
        ph = JSON.parse(ph);
        ph = _.filter(ph, function (item) {
            if (item.parameters && paramList) {
                return !(item.uri == uri &&
                    item.parameters.mainCC == paramList.mainCC);
            }

            return !(item.uri == uri);
        });
        ph = JSON.stringify(ph);
    }
    else {
        ph = '[]';
    }

    sessionStorage.setItem(this.keyName, ph);
};

PageHistory.prototype.shift = function () {
    var ph = sessionStorage.getItem(this.keyName) || '[]';
    ph = JSON.parse(ph);
    ph.shift();
    ph = JSON.stringify(ph);
    sessionStorage.setItem(this.keyName, ph);
};

PageHistory.prototype.findIndex = function (uri) {
    var ph = sessionStorage.getItem(this.keyName) || '[]';
    ph = JSON.parse(ph);
    var index = _.findIndex(ph, function (data) {
        return data.uri == uri;
    });
    return index;
};

PageHistory.prototype.addToHistory = function (data) {

    try {

        if (!this.add(data)) {
            return;
        }
    } catch (e) {
        console.log(e);

        try {
            // 용량이 꽉차서 오래된 history를 제거해야함.
            this.shift();
        } catch (e) {
            console.log(e);


            this.clear();
            this.add(data);
        }
    }
};
/* PageHistory Javascript Class - end */


var pageHistory = new PageHistory('pageHistory');


try {
    // skip될 uri가 등록되어 있으면 지운다.
    if (hasSkipRetain == 1) {
        if (location.search.indexOf('loginCC') == -1) {
            pageHistory.clear('/CXHIABNC0022.cms', parameter_list);
        }
    }

    if (window.sessionStorage) {
        if (!hasSkipRetain) {
            var curPageStep = sessionStorage.getItem('curPageStep') || '0';

            if (hasStepURI) {
                var data = {
                    uri: '/CXHIABNC0022.cms',
                    parameters: parameter_list,
                    step: ++curPageStep,
                    backMark: 'N'
                };

                pageHistory.addToHistory(data);
            }
            else {
                curPageStep = 0;
                var data = {
                    uri: '/CXHIABNC0022.cms',
                    parameters: parameter_list,
                    step: 0,
                    backMark: 'Y'
                };

                pageHistory.addToHistory(data);
            }
            sessionStorage.setItem('curPageStep', curPageStep);
        }
    }

} catch (e) {
    // alert(JSON.stringify(e)); //console.log(e); 
}

/**
pageInfo에 해당하는 page로 이동한다.
*/
function goWithPageInfo(pageInfo) {
    if (pageInfo) {
        var usePost = true;
        if (!usePost) { // get method

            var uri = pageInfo.uri;
            var query_string = '';
            var shouldAddAmp = false;

            if (pageInfo.parameters) {
                $.each(pageInfo.parameters, function (k, v) {
                    if (shouldAddAmp) {
                        query_string += '&';
                    } else {
                        query_string += '?';
                        shouldAddAmp = true;
                    }

                    query_string += k + '=' + v;
                });
            }

            pageHistory.remove();
            window.location.replace(uri + query_string);

        } else { // post method
            var uri = pageInfo.uri;
            var form = $('<form>', { name: 'cmnNavigatorPostForm', action: uri, method: 'post' });
            if (pageInfo.parameters) {
                $.each(pageInfo.parameters, function (k, v) {
                    $('<input>', { type: 'hidden', name: k, value: v }).appendTo(form);
                });
            }

            pageHistory.remove();
            form.appendTo('body').submit().remove();
        }
    } else {

        console.log('goWithPageInfo: fallback - no valid parameters data in pageInfo. back to main...');
        backToMain();
    }
}

/**
backToPrev()와 같은 기능임.
*/
function back() {
    backToPrev();
}

/**
일반적인 닫기시 사용하는 뒤로 이동 기능
*/
function backToPrev() {
    if (hasStepURI && getHeaderType() == 3) {
        $.cxhia.confirm({
            message: '종료 시 입력하신 정보가 손실됩니다. 진행 중인 프로세스를 종료하시겠습니까?'
        }, function (res) {
            if (res == 'ok') {
                $(document).trigger('stepClose');
                // step이 시작되기 이전
                backToPrevBackMark();
            }
        });
    }
    else {
        try {
            var pageHistoryLength = pageHistory.count();
            if (!hasSkipRetain && pageHistoryLength > 0) {

                pageHistory.remove();
            }
            else if (hasSkipRetain == 2) {
                pageHistory.remove();
            }

            if (pageHistoryLength > 0) {
                backToPrevBackMark();
            }
            else {
                console.log('backToPrev: empty history. back to main...');
                backToNative();
            }
        }
        catch (e) {
            history.back();
        }
    }
}

/**
프로세스화면에서 X버튼을 누르면 호출되고
프로세스를 종료하고, 프로세스를 시작하기 전 화면으로 이동
*/
function backToPrevBackMark() {
    var pageInfos = pageHistory.getAll();
    var lastIndex = _.findLastIndex(pageInfos, function (item, index) {
        return item.backMark == 'Y';
    });

    // 이전이 없으면, 메인으로
    if (lastIndex == -1) {
        backToNative();
    }
    else {
        var pageInfo = pageInfos[lastIndex];
        pageInfos = pageInfos.splice(0, lastIndex + 1);
        pageHistory.setAll(pageInfos);

        sessionStorage.setItem('curPageStep', Math.max(0, pageInfo.step - 1));

        goWithPageInfo(pageInfo);
    }
}

/**
step이 일치하는 마지막  history index로 이동
프로세스화면에서 <-버튼을 누르면 호출
*/
function backToPrevByStep(step) {
    var pageInfos = pageHistory.getAll();
    var lastIndex = _.findLastIndex(pageInfos, function (item, index) {
        return item.step == step;
    });

    var pageInfo = pageInfos[lastIndex];
    pageInfos = pageInfos.splice(0, lastIndex + 1);
    pageHistory.setAll(pageInfos);

    sessionStorage.setItem('curPageStep', Math.max(0, step - 1));

    goWithPageInfo(pageInfo);
}

/**
프로세스화면에서 <-버튼 처리
*/
function backToPrevStepPage() {
    try {
        var pageInfo = pageHistory.get();
        if (pageInfo.step == 0) {
            // 사용자가 직접처리
        }
        else if (pageInfo.step == 1) {
            back();
        }
        else {
            $.cxhia.confirm({
                message: '최초 단계로 이동하시겠습니까?'
            }, function (res) {
                if (res == 'ok') {
                    $(document).trigger('stepBack');
                    // step이 시작되는 처음
                    backToPrevByStep(1);
                }
            });
        }

    } catch (e) {
        history.back();
    }
}

/**
이전 native화면으로 이동, 웹일때는 메인으로 이동 
*/
function backToNative() {
    if ($.cxhia.isApp()) {
        // 이전 native화면으로 이동
        kbmobile.ui.backToNative();
    }
    else {
        // 메인으로
        var uri = '/CXHIAAMC0002.cms';
        window.location.replace(uri);
    }
}

/**
메인으로 이동
*/
function backToMain() {
    // 이 값은 app에서는 저장되어 있어야 함.
    pageHistory.clear();
    var uri = '';
    if ($.cxhia.isApp()) {
        kbmobile.ui.clearTop('main');
        return;
    }
    else {
        uri = '/CXHIAAMC0002.cms';
        window.location.replace(uri);
    }
}

/*
바로 뒤로 가야할 경우에 사용, 에러 페이지에서 사용한다.
*/
function backToPrevOrg() {
    pageHistory.remove();

    if (pageHistory.count() > 0) {
        var pageInfo = pageHistory.get();
        sessionStorage.setItem('curPageStep', Math.max(0, pageInfo.step - 1));
        goWithPageInfo(pageInfo);
    }
    else {
        backToMain();
    }
}



/**
현재페이지를 강제로 backMark를 설정한다.
*/
function setBackMark() {
    var pageInfo = pageHistory.get();
    pageInfo.backMark = 'Y';
    pageHistory.set(pageInfo);
};

/**
curPageStep을 지운다.
setBackMark()와 함께 호출하여 프로세스화면에서 또다른 프로세스화면으로 이동전 호출해야 한다.
*/
function resetCurPageStep() {
    sessionStorage.removeItem('curPageStep');
}

/**
curPageStep를 하나 감소시킨다.
*/
function decrementCurPageStep() {
    var curPageStep = sessionStorage.getItem('curPageStep') || 0;
    curPageStep = Math.max(0, curPageStep - 1);
    sessionStorage.setItem('curPageStep', curPageStep);
}

/**
가장 마지막의 uri와 mainCC에 맞는 history로 이동한다.
이동시 중간에 쌓여있던 history는 지워진다.
*/
function clearTop(pageInfo) {
    var pageInfos = pageHistory.getAll();
    var lastIndex = _.findLastIndex(pageInfos, function (item, index) {
        if (pageInfo.parameters) {
            return (item.uri == pageInfo.uri &&
                item.parameters.mainCC == pageInfo.parameters.mainCC);
        }
        else {
            return (item.uri == pageInfo.uri);
        }
    });

    if (lastIndex == -1) {
        if (!hasSkipRetain) {
            pageHistory.remove();
        }

        pageHistory.addToHistory(pageInfo);
        goWithPageInfo(pageInfo);
    }
    else {
        pageInfos = pageInfos.splice(0, lastIndex + 1);
        pageHistory.setAll(pageInfos);
        goWithPageInfo(pageInfo);
    }
}

/**
마지막 history 하나를 지운다.
*/
function sessionremove() {
    pageHistory.remove();
}

/**
이동전에 back시에 선택된 tab으로 돌아오기위한 tabIdx를 변경
*/
function setTabIndexToSessionStorage(idx) {
    try {
        var data = pageHistory.get();
        $.extend(true, data, {
            parameters: {
                tabIdx: '' + idx
            }
        });
        pageHistory.set(data);
    } catch (e) {
        console.error(e);
    }
}

$('.topHead .backBtn').on('click', function (e) {
    if (getHeaderType() != 3) {
        back();
    }
    else {
        backToPrevStepPage();
    }
    return false;
});