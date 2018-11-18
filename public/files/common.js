/**
 * PCXHIAE0008 : 모바일통합_common_js
 * /cxh/js/mblhomeIa/common/common.js
 */
// 기존 val method 저장
var oldValFunction = $.fn.val;
var kakaoInitFlag = true;
var smsTimer = null;

// val method 재정의
$.fn.val = function() {
    var args = Array.prototype.slice.call(arguments, 0),
        ret = oldValFunction.apply(this, args);
    
    // get일 경우
    if(args.length == 0) {
                
        // get을 한 타겟이 .hasDatepicker(캘린더) 클래스를 가지고 있을 경우 value 값 앞에 '20' 더하기
        if($(this).hasClass('hasDatepicker')) {
            
            // 값이 있을 경우 앞에 '20'을 더함
            if(ret !== '' && ret.split('.')[0].substring(0, 2) !== '20') {
                ret = '20'+ret;
            } 
        }
    }
    
    return ret; 
};

$(document).ready(function() {
    //ios전용 클래스 반영
    var userAgentCheckP = navigator.userAgent || navigator.vendor || window.opera;
    if(/iPad|iPhone|iPod|Macintosh/.test(userAgentCheckP) && !window.MSStream) {
        $('body').addClass('ios');
    };

    //웹에서만 안보이는 버튼 
    if($.cxhia !== undefined && $.cxhia.isApp() == false) $('body').addClass('web');
});

// 넘겨 받은 값으로 폰트사이즈 정의
$(document).on('deviceready', function(e){
    kbmobile.preferences.getStringValue("fontSize", function(fontSize) {
        var $fontSelId = null;
        if(fontSize == 'small'){
            $('html').css('font-size', '14px');
            $fontSelId = $('#fontSel1');
        }else if(fontSize == 'medium'){
            $('html').css('font-size', '15px');
            $fontSelId = $('#fontSel2');
            
        }else if(fontSize == 'large'){
            $('html').css('font-size', '16px');
            $fontSelId = $('#fontSel3');
        }else{
            $('html').css('font-size', '15px');
            $fontSelId = $('#fontSel2');
        }
        
        if($fontSelId.length > 0) {
            $fontSelId.prop("checked", true);
            $fontSelId.parent().addClass("checked");            
        }
    });
});

//유효기간 년입력완료시 키패드 내림
$(document).on('input.tel', 'input', function() {
                    if($(this).attr('maxlength') == 2 && $(this).val().length == 2 && $(this).attr('placeholder') == 'YY') {
                                $(this).blur();
                    }
});

/********************************************************************************
* 전역 네임스페이스
* @namespace commonJs
*/
var commonJs = commonJs || {};

(function(ns, $, undefined) {
    'use strict';
    var init,
        util,
        common,
        domEvents,
        formEvent,
        tabs,
        swipers,
        arcodians,
        chart,
        layerPopup,
        totalMenu,
        calendar,
        scrollFixed,
        maps,
        waiAccessibility,
        resizeEvent;
    
    /**
    * 로딩바
    * @method commonJs.loading.open() 로딩 이미지 오픈
    * @method commonJs.loading.close() 로딩 이미지 닫기
    */
    ns.loading = {
        config : {
            wrap : 'loading',
            dim : 'loadingDim',
            imgSrc : 'https://img1.kbcard.com/cxh/ia_img/common/loading.gif'
        },
        
        /**
        * 로딩바가 페이지내에 존재하지 않을 때 로딩바 + dim 생성
        */
        createLoading : function() {
            var config = commonJs.loading.config,
                $wrap = $('<div class="' + config.wrap + '" />'),
                $dim = $('<div class="' + config.dim + '" />'),
                $img = $('<img src="' + config.imgSrc + '" />');
            
            if(!$('.'+config.wrap).length) {
                $('body').append($wrap);
            }
            
            if(!$('.'+config.dim).length) {
                $('body').append($dim);
            }
            
            if(!$('img[src="'+ config.imgSrc +'"]').length){
                $wrap.append($img);
            }
            
        },
        
        /**
        * 로딩바 open
        * @example
        * commonJs.loading.open();
        */
        open : function() {
            var config = commonJs.loading.config,
                $wrap,
                $dim;   
            
            if($('.' + config.wrap).is(':visible')) { return; }
            
            commonJs.loading.createLoading();
            
            config = commonJs.loading.config;
            $wrap = $('.'+config.wrap);
            $dim = $('.'+config.dim);   
            
            $wrap.hide().css('z-index', '10001');
            $dim.hide().css('z-index', '10000');
            
            $wrap.stop(true, false).fadeIn();

            $dim.stop(true, false).fadeIn();
            
            util.disableScroll(true);
        },
        
        /**
        * 로딩바 close
        * @example
        * commonJs.loading.close();
        */
        close : function() {
            var config = commonJs.loading.config,
                $wrap = $('.'+config.wrap),
                $dim = $('.'+config.dim);
            
            $wrap.stop(true, false).fadeOut(function() {
                $(this).remove();
                util.disableScroll(false);
            });
            $dim.stop(true, false).fadeOut(function() {
                $(this).remove();
            });
            // 
        }
    };
    
    /**
    * 공통 사용 객체
    */
    ns.global = {
        bw : $(window).width(),
        bh : $(window).height(),
        
        // util.disableScroll() 이벤트 실행 횟수 체크
        disableScrollCount : 0,
        
        /**
        * container 가 show / hide 되는 경우 사용
        * window scrollTop 값 저장
        */
        getScrollTop : function() {
            ns.global.saveTop = parseInt($('body').css('top'), 10) < 0 ? Math.abs(parseInt($('body').css('top'), 10)) : $(window).scrollTop();  
            setTimeout(function() {
                $(window).scrollTop(0);
            }, 0);
        },
        /**
        * container 가 show / hide 되는 경우 사용
        * 저장된 scrollTop 값만큼 스크롤 이동
        */      
        setScrollTop : function() {
            if(ns.global.saveTop > 0) {
                $(window).scrollTop(ns.global.saveTop);
                ns.global.saveTop = null;
            }
        }
    };
    
    /**
    * 접근성 이벤트
    */
    waiAccessibility = {
        config : {
            focusTimer : null
        },
        init : function() {
            // 접근성
            waiAccessibility.goFocus($('.topHead'));
            waiAccessibility.setCurrentTitle();
            waiAccessibility.hiddenText();
            waiAccessibility.stepText();
            waiAccessibility.cardTypeLengthCheck();
            waiAccessibility.inputSetAriaLabel();
            waiAccessibility.setFormWrapIng();
            waiAccessibility.cardNameToTitle();
            
            // 2017.01.07 SNS 공유하기 aria-label 추가
            waiAccessibility.setAriaLabel({
                target : $('.btnShare'),
                type : 'button',
                text : 'SNS 공유하기'
            });
            
            // 2017.01.13 팝업 닫기 접근성 속성 추가
            waiAccessibility.setAriaLabel({
                target : $('.popClose a'), 
                type : 'button',
                text : '닫기'
            });
            
            // 2017.01.11 그래프 접근성 추가 (불필요한 항목 포커스 x)
            $('.barGraph').attr('aria-hidden', true);
            
            // 2017.01.12 본인인증 전화번호 안내 타이틀
            $('#callPhoneNum').attr('title', '인증받을 휴대전화번호');
            
            // 공인인증서 텍스트 생성
            $('.certificateList > ul > li > a').each(function() {
                var $ico = $(this).find('> .ico');
                $ico.after('<span class="hidden">' + $(this).text() + '</span>');
            });
            
        },
        
        /**
        * 2016.11.11
        * 탭관련 접근성 타이틀 추가 요청
        */
        setCurrentTitle : function() {
            var $tabList = $('.tabDep0, .tabDep1, .tabDep2, .benefitTab');
            
            if($tabList.length > 0) {
                $tabList.find('li.on > a').attr('title', '선택됨');
            }
        },
        
        /*
        * 2017.01.02 접근성 추가 (hidden 클래스가 있을 경우 해당 태그 상위 요소에 role="text" 추가)
        */
        hiddenText : function() {
            //$('.hidden').parent().attr('role', 'text');

            var $hidden = $('.hidden');
            
            $hidden.each(function() {
                if($(this).parent('a').length > 0 || $(this).parent('button').length > 0) {
                    $(this).attr('aria-hidden', true).parent().attr('role','button');
                }

                if($(this).closest('.formWrap').length > 0) {
                    $(this).parent('label').attr('role', 'text');
                }
                
                /*
                if($(this).closest('.formWrap').length > 0) {
                    $(this).parent('label').attr('role', 'text');
                    
                // 현재위치 검색 버튼, 상세페이지 지도 자세히보기 버튼은 포커스 가리지 않음
                } else if(!$(this).parent().hasClass('btnSrch') && !$(this).parent().hasClass('btnMap')) {
                    $(this).attr('aria-hidden', true);
                }
                */
            });
        },
        
        /*
        * 2017.01.04 접근성 추가 ( 스텝 있는 페이지 스텝 접근성 텍스트 추가 )
        */
        stepText : function() {
            var $stepBox = $('.stepBox');
            
            if($stepBox.length > 0) {
                var count = $stepBox.find('.stepList li').length,
                    index = $stepBox.find('.stepList li.on').index(),
                    title = $stepBox.find('h2').text();
                    
                $stepBox.attr('role', 'img');
                $stepBox.attr('aria-label', '총 ' + count + '단계 중 ' + (index + 1) + '단계, ' + title);
            }
        },
        
        /*
        * 2017.01.07 접근성 추가 ( 카드 안내/신청 페이지 카드타입목록(.cdBtn)의 자식개수가 1개일 때 roleText 적용
        */
        cardTypeLengthCheck : function() {
            var $cardTypeBtn = $('.cardDetailTop > .cdBtn > a'),
                getCardTypeBtnLen = $cardTypeBtn.length;
            
            if(getCardTypeBtnLen > 0) {
                if(getCardTypeBtnLen > 1) {
                    $cardTypeBtn.each(function() {
                        var getText;
                        
                        if($(this).hasClass('on')) {
                            getText = $(this).text()+'카드 선택됨'
                        } else {
                            getText = $(this).text()+'카드'
                        }
                        
                        waiAccessibility.setAriaLabel({
                            target : $(this),
                            type : 'button',
                            text : getText
                        });
                    });
                } else {
                    waiAccessibility.setAriaLabel({
                        target : $cardTypeBtn,
                        type : 'text',
                        text : $cardTypeBtn.text()+'카드'
                    });                 
                }
            }
        },
        
        /**
        * 2017.01.07 접근성 추가인풋 title 문구 추가
        */
        inputSetAriaLabel : function() {
            var $input = $('input');
            
            if($input.length > 0) {
                $input.each(function() {
                    var getPlaceHolder = $(this).attr('placeholder');
                    
                    if($(this).attr('title') === '' || !$(this).attr('title')) {
                        $(this).attr('title', getPlaceHolder);
                    }
                });
            }
        },
        
        /**
        * 2017.01.07 접근성 추가 (혜택 가맹점보기 팝업)
        */
        setFormWrapIng : function() {
            var $formWrap = $('.formWrap');
            
            if($formWrap.length > 0) {
                $formWrap.each(function() {
                    var getText = $(this).find('> label').text();
                    if($(this).hasClass('ingOn')) {
                        $(this).attr('role', 'button');
                        $(this).attr('aria-label', getText+' 진행중');
                    } else if ($(this).hasClass('ingOff')) {
                        $(this).attr('role', 'button');
                        $(this).attr('aria-label', getText+' 진행예정');
                    }
                });
            }
        },
        
        /**
        * 2017.01.09 접근성 추가 (신속발급 카드신청, 채무조정 성실상환자 카드신청 버튼에 카드명 title 추가)
        */
        cardNameToTitle : function() {
            var $applicationCardBtn = $('.applicationCard').find('.btnCardApp');
            
            $applicationCardBtn.each(function() {
                var getCardName = $(this).prev('strong').text();
                
                $(this).attr('title', getCardName);
            });
        },
        
        /**
        * 2016.11.25
        * 접근성 관련 포커스 이동 함수 타겟의 가장 첫번째 요소에 접근해 해당 요소로 포커스 이동
        */
        goFocus : function(target) {
            var $target = $(target),
                i = 0,
                getFirstChild = (function getFirstChild(elem) {
                    var $elem = $(elem),
                        getChildren = null;
                                        
                    if($elem.children().length > 0) {
                        getChildren = $elem.children().eq(0);
                        
                        if(getChildren.hasClass('hidden') || getChildren.is(':hidden')) {
                            getChildren = getChildren.next();
                        }
                        return getFirstChild(getChildren);
                    } else {
                        return $elem;
                    }
                }($target));
                
            getFirstChild.css('outline', 'none');
            getFirstChild.attr('tabindex', '0');
            getFirstChild.focus();
            getFirstChild.off('focusout.goFocus');
            getFirstChild.on('focusout.goFocus', function() {
                $(this).removeAttr('tabindex');
            });
        },  
            
        /**
        * 2017.01.02 접근성 추가
        * @param opts 접근성 관련 문구 옵션
        * @param opts.target 문구를 추가할 타겟
        * @param opts.text 선택된 텍스트
        * @param opts.title 선택된 팝업 타이틀
        * @pram {boolean} isFocus 해당 값이 true일 경우 target으로 포커스 다시 던짐
        * @example
        * waiAccessibility.setAriaLabel({
            target : $('팝업 버튼'),
            type : 'text',
            text : '선택된 타겟의 텍스트',
            title : '선택된 타겟 팝업의 타이틀',
            activeText : '현재 상태 표시용 타이틀(선택됨(펼쳐짐) or 선택안됨(닫힘))' // 아코디언 또는 체크박스같은 타입에 사용
        * });
        */
        setAriaLabel : function(opts, isFocus) {
            var config = waiAccessibility.config,
                getOpts = opts || {},
                $target = opts.target,
                getType = opts.type,
                getText = opts.text,
                getTitle = opts.title,
                getActiveText = opts.activeText,
                result = '';
            
            // getText 값이 ''이나 undefined가 아닐 경우
            if(getText !== '' && getText) {
                result += getText;
            }
            
            // getTitle 값이 ''이나 undefined가 아닐 경우
            if(getTitle !== '' && getTitle) {
                result += getTitle;
            }
            
            if(getType !== '') {
                $target.attr('role', getType);
            }
            
            if(getActiveText !== '') {
                $target.attr('title', getActiveText);
            }
            
            if(result !== '') {
                $target.attr('aria-label', result);     
            }
        },
        
        /**
        * 2017.01.17 접근성 추가
        * @param {jQuery} curTarget 선택된 셀렉터
        * @param {jQuery} siblingsTarget 선택된 셀렉터의 형제요소들
        */
        changeRadioTitle : function(curTarget, siblingsTarget) {
            if(curTarget) {
                if(!curTarget.find('> a').length) {
                    var $label = curTarget.find('> label');
                    waiAccessibility.setAriaLabel({
                        target : $label,
                        type : 'radio'
                    });
                    $label.attr('aria-checked', 'true');

                    setTimeout(function() {commonJs.goFocus($label);}, 10);
                } else {
                    curTarget.find('> a').attr('title', '선택됨');
                    setTimeout(function() {commonJs.goFocus(curTarget.find('> a'));}, 10);
                }

            }
            
            siblingsTarget.each(function() {
                var $label = $(this).find('> label');
                if(!$(this).find('> a').length) {
                    waiAccessibility.setAriaLabel({
                        target : $label,
                        type : 'radio'
                    });
                    $label.attr('aria-checked', 'false');
                } else {
                    $(this).find('> a').attr('title', '선택 안됨');
                }
            });
        },  

        /**
        * 2018.03.15 접근성 추가
        * @param {jQuery} curTarget 선택된 셀렉터
        */
        changeCheckboxTitle : function(curTarget, siblingsTarget) {
            if(curTarget) {
                var $label = curTarget.find('> label');

                waiAccessibility.setAriaLabel({
                    target : $label,
                    type : 'checkbox'
                });

                if(curTarget.hasClass('checked')) {
                    $label.attr('aria-checked', 'true');
                } else {
                    $label.attr('aria-checked', 'false');
                }

                setTimeout(function() {commonJs.goFocus($label);}, 10);
            }

            siblingsTarget.each(function() {
                var $label = $(this).find('> label');

                waiAccessibility.setAriaLabel({
                    target : $label,
                    type : 'checkbox'
                });

                if($(this).hasClass('checked')) {
                    $label.attr('aria-checked', 'true');
                } else {
                    $label.attr('aria-checked', 'false');
                }
            });
        },     
        
        /**
        * 2017.01.09 접근성 추가 (freeMode 스와이프 접근성 대응용 네비게이션 버튼 생성 메서드)
        * @param opts 옵션 값
        * @param opts.target 셀렉터
        * @param opts.prevButton.class 이전 버튼 클래스
        * @param opts.prevButton.text 이전 버튼 텍스트
        * @param opts.nextButton.class 다음 버튼 클래스        
        * @param opts.nextButton.text 다음 버튼 텍스트
        */
        setSwipeNavigationButton : function(opts) {
            var opts = opts || {},
                getPrevText = opts.prevButton.text,
                getNextText = opts.nextButton.text,
                getPrevClass = opts.prevButton.class,
                getNextClass = opts.nextButton.class,
                $getTarget = $(opts.target),
                $prevBtn = $('<a href="#" class="'+ getPrevClass +' js-btnPrev">'+getPrevText+'</a>'),
                $nextBtn = $('<a href="#" class="'+ getNextClass +' js-btnNext">'+getNextText+'</a>');
            
            /*
            $prevBtn.css({
                width: '1px',
                height: '1px',
                fontSize : '1px',
                lineHeight : '1px',
                color : 'transparent'
            }); 
            
            $nextBtn.css({
                width: '1px',
                height: '1px',
                fontSize : '1px',
                lineHeight : '1px',
                color : 'transparent'
            });
            */
            $getTarget.css('position', 'relative');     

            if(!$getTarget.find('.'+getPrevClass).length) {    
                $getTarget.append($prevBtn);    
            }    
            if(!$getTarget.find('.'+getNextClass).length) {    
                $getTarget.append($nextBtn);    
            }
        },
        
        /**
        * 2017.01.14 접근성 추가 ( freeMode 스와이프 이동한 값에 따라 보이는 아이템외에는 모두 aria-hidden=true
        */
        setFreeModeSwipeAriaHidden : function(opts) {
            var swiperSettings = opts || {},
                $item = swiperSettings.list,
                moveValue = Math.abs(swiperSettings.moveValue), // 양수 변환
                maxValue = moveValue + swiperSettings.wrapWidth, // 현재 이동한 값과 감싸는 wrap의 값을 더함
                saveArr = [];

            $item.each(function(index) {
                var minCheckLeft = Math.round($(this).position().left),
                    // maxCheckLeft = minCheckLeft + parseInt($(this).innerWidth(), 10);
                    maxCheckLeft = minCheckLeft + (parseInt($(this).innerWidth(), 10) / 2);
                    // maxCheckLeft = minCheckLeft;
                    
                // 해당하는 item의 position 값이 moveValue 보다 낮거나 maxValue보다 클 경우 hidden
                if(moveValue > minCheckLeft || maxCheckLeft > maxValue) {
                    $(this).attr('aria-hidden', true);
                    $(this).removeClass('firstFocus');
                    $(this).removeClass('lastFocus');
                } else {
                    $(this).attr('aria-hidden', false);
                    saveArr.push(this);
                }
            });
            
            // 포커스 타겟 저장
            $(saveArr[0]).addClass('firstFocus').data('visibleLength', saveArr.length);
            $(saveArr[saveArr.length-1]).addClass('lastFocus').data('visibleLength', saveArr.length);
        }
    };
    
    /**
    * 유틸
    */  
    util = {
        
        /**
        * CSS3 사용가능 여부 체크
        * @return {Boolean} true or check
        */
        checkCSS : (function() {


            var div = document.createElement('div'),
                props = ['WebkitPerspective', 'MozPerspective', 'Operspective', 'msPerspective'];
                
                for (var i =0; i < props.length; i++) {



                    if (div.style[props[i]] !== undefined) {
                        ns.global.cssPrefix = props[i].replace('Perspective', '').toLowerCase();
                        ns.global.animProp = '-' + ns.global.cssPrefix + '-transform';
                        return true;
                    }
                }
                return false;
            
        }()),
        
        /**
        * arr[index]에 함수 실행 한 뒤 배열에 저장 후 배열 반환
        * @param {jQuery | HTMLElement}  target 엘리먼트 선택자
        * @param {Function} funcName 함수명
        * @param {Object} opts 옵션 값
        * @example
        * util.eachFunc($('selector'), funcs, funcsOpts);
        */
        eachFunc : function(target, funcName, opts) {
            var arr = [];
            
            target.each(function(index) {
                arr[index] = funcName.call($(this), opts);
            });
            return arr;
        },
        
        /**
        * 최상단 스크롤 이동
        * @param {HTMLElement | jQuery} target scrollTop(0)을 적용시킬 엘리먼트 (default는 $(window).scrollTop(0))
        */
        scrollTop : function(target) {
            var $target = target ? $(target) : $(window);
            $target.scrollTop(0);
        },
        
        /*
        * 상단 고정된 요소들의 높이 합을 가져옴
        * @example
        * util.getFixItemTop();
        */
        getFixItemTop : function() {
            var $topHead = $('.topHead').filter(':visible'),
                $fixItem = $('.fixItem').filter(':visible'),
                offsetTop = 0;              
            
            // head가 존재할 경우 헤더 높이값 뺌
            if($topHead.length > 0) {
                offsetTop += parseInt($topHead.innerHeight(), 10);      
            }
            
            // fixItem이 존재할 경우
            if($fixItem.length > 0) {
                $fixItem.each(function() {
                    offsetTop += parseInt($(this).innerHeight(), 10);
                });
            }
            
            return offsetTop;
        },
        
        /*
        * 2016.11.02
        * 높이값 get
        * @return topHead와 fixed 요소를 제외한 디바이스 높이값
        */
        getContentHeight : function() {
            var $fixedBArea = $('.fixedBArea'),
                getFixedHeight = util.getFixItemTop(),
                totalHeight = ns.global.bh - getFixedHeight;
                
                
            if($fixedBArea.length > 0) {
                totalHeight -= $fixedBArea.innerHeight();
            }
            
            return totalHeight;     
        },
        
        /**
        * 지정한 타겟의 offset top 값 만큼 스크롤 이동r
        * @param {jQuery | HTMLElement} target 타겟
        */
        contentsTop : function(target) {
            var $target = $(target),
                offsetTop = $target.offset().top,
                maxScrollTop = $(document).innerHeight() - ns.global.bh;
            
            offsetTop = offsetTop - util.getFixItemTop();
            
            if(offsetTop < maxScrollTop) {
                $(window).scrollTop(offsetTop); 
            } else if (offsetTop >= maxScrollTop) {
                $(window).scrollTop(maxScrollTop);  
            }
        },
        
        /*
        * 팝업 오픈 시 스크롤 방지
        * @param {Boolean} isCheck true 값일 때 스크롤 막기 fasle 스크롤 풀기
        */
        disableScroll : function(isCheck) {
            if(isCheck){                
            
                if(ns.global.disableScrollCount === 0) {
                    util.saveTop = $(window).scrollTop();
                    
                    $('body').css({
                        position: 'fixed',
                        top: -util.saveTop,
                        left: 0,
                        width: '100%'               
                    });
                }
                
                ns.global.disableScrollCount++; 
            } else if(!isCheck) {           
                if(ns.global.disableScrollCount > 0) {
                    ns.global.disableScrollCount--;
                }
                if(ns.global.disableScrollCount === 0)  {
                    $('body').css({
                        position: 'static',
                        top: 0
                    });
                    
                    $(window).scrollTop(util.saveTop);
                    util.saveTop = null;
                }
            }
        },
        
        /**
        * fixedBCheck 클래스가 있을 때 특정 이벤트 실행시 fixedBArea show / hide
        * @param {String} sValue 'show' : show, 'hide' : hide
        */
        fixedBCheck : function(sValue) {
            /*
            * 2016.10.12 바로출금결제
            * 출금 결제 페이지 fixedBArea 버튼 노출/숨김
            */
            if($('.container').hasClass('fixedBCheck')) {
                if(sValue === 'show') {
                    $('.fixedBArea').fadeIn(100);
                    common.setContainerPadding();
                    common.fixedBtnScroll();
                } else if(sValue === 'hide') {
                    $('.fixedBArea').fadeOut(100);
                    $('.container').css('padding-bottom', '20px');
                }
            }       
        },
        
        /**
        * 콤마 생성
        * @param {Number} x
        */
        comma : function(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        
        /*
        msg : 본문 내용  
        kakaoImg : 이미지URL
        width : 이미지 넓이
        height :이미지 높이
        text : 버튼 txt
        url : 이동시 url
        
        사용방법 : commonJs.util.intgraKakaoLink(msg,kakaoImg,width,height,text,url);
        
      */
      
      intgraKakaoLink : function(msg,kakaoImg,width,height,text,url) {
        
          var kakaoKey = '32903a14f0dca5640d4816c24e225c2d';
          if(kakaoInitFlag) {
            Kakao.init(kakaoKey);
            kakaoInitFlag= false;
          }
          
          
          var userAgent = navigator.userAgent;
          if(userAgent.indexOf('kbcardia') > -1 && userAgent.match(/iPhone|iPad|iPod/i)){
            try {
                kbmobile.app.intgraKakaoLink(msg,kakaoImg,width,height,text,url,function(res){});
            } catch(e) {
            }
          }else{
          
            Kakao.Link.sendDefault({
            
              objectType:'feed',
              content:{
                title:msg,
                imageUrl : kakaoImg,
                link:{
                  webUrl : url+"",
                  mobileWebUrl : url+""
                },
                imageWidth: Number(width),
                imageHeight : Number(height)
              },
              buttons : [{
                title : text,
                link : {
                  webUrl : url+"",
                  mobileWebUrl : url+""
                }
              }],
              fail:function(res){
                
                alert("공유에 실패했습니다");
              }
            });
          }
        },

        
        /**
        * 2016.12.25
        * show / hide 이벤트 detect
        */
        detect : {
            show : function(id, callback) {
                $(document).on('show', id, function(e) {
                    if(typeof callback === 'function') {
                        callback(e);
                    }
                });
            },
            
            hide : function(id, callback) {
                $(document).on('hide', id, function(e) {
                    if(typeof callback === 'function') {
                        callback(e);
                    }
                });
            }
        }
    }
    
    /*
    * 초기화 함수
    */
    init = function() {
        // ... code

        common.init();
        totalMenu.init();
        formEvent.init();
        swipers.init();
        tabs.init();
        chart.init();
        arcodians.init();
        layerPopup.init();
        calendar.init();
        scrollFixed.init();
        maps.init();
        
        domEvents.init();
        resizeEvent();
    };

    /*
    * 리사이즈 이벤트
    */
    resizeEvent = function() {
        var timer = null;
        $(window).resize(function() {
            clearTimeout(timer);
            timer = setTimeout(function() {
                
                // 아이폰 주소창 활성 / 비활성 될때 리사이즈 실행 방지
                if(ns.global.bw !== $(window).width()) {
                    ns.global.bw = $(window).width();
                    ns.global.bh = $(window).height();              
                    
                    // 맞춤카드 보기 열려있을 때 리사이즈시 높이값 재지정
                    arcodians.fixedToggle.resize();
                    
                    // 팝업 리사이즈
                    layerPopup.resize();
                    
                    // 완료페이지 컨텐츠 가운데 정렬
                    common.resize();
                    
                    if($('#Wrap').hasClass('fixFixed')){
                        formEvent.searchBox.openStyle();
                    }                   
                }   
                
                if(window.innerHeight && window.innerHeight !== ns.global.bh) {
                    ns.global.bh = window.innerHeight;
                    
                    layerPopup.resize();
                }
            }, 0);
        });
        
        // 모바일 웹 주소창 크기 체크해서 ns.global.bh 값 변경..
        $(window).scroll(function() {
            if(window.innerHeight && window.innerHeight !== ns.global.bh) {
                ns.global.bh = window.innerHeight;
                
            }
        });
    };
    
    /************************************
    * 페이지 공통 스크립트
    *************************************/
    common = {
        config : {
            rotateTimer : null                      // setRotateAppCard 타임아웃 저장용
        },
        init : function() {
            common.addNoteBox();
            common.fixedSetup();
            common.toggleOpen();
            common.setContainerPadding();
            common.labelAppend();
            common.centerAlign();   
            common.bgClass();
            common.removeCalendar();    
            common.scrollEndCheck();
            common.fixedBtnScroll();
            common.dimmedBtn();
            common.setRotateAppCard();
            common.bindMaxLength();
            common.detectEvents();
            common.phishingSecurityImg();
            common.minHeightSet();
            common.birthChk();
        },
        
        resize : function() {
            common.centerAlign();
            common.fixedBtnScroll();
            common.setRotateAppCard();
            common.minHeightSet();
        },
        
        /**
        * 2018.05.02
        * 주민등록번호 성별체크 액션
        * '.inpBirthDate .backNumber' 해당 셀렉터가 존재 할 경우 주민등록 뒤 첫번째 숫자 마스킹 UI 적용
        */
        birthChk : function() {
            $(document).on("keyup", ".inpBirthDate .backNumber", function() {
                var $target = $(this);
                if ($target.val().length > 0) {
                    $target.addClass('on');
                } else {
                    $target.removeClass('on');
                }
            });
        },
        
        /**
        * 2016.12.05
        * section show / hide 이벤트 감지 (개발단에서 show / hide 대응용으로 작업됨)
        * show / hide 캐치 후 setTimeout을 걸어 한박자 늦게 실행
        * - section에 .show() / .hide()를 사용한 페이지들이 있어 대응하기 위해 추가)
        * - main section과 popup ui section의 경우 스크롤 저장용으로도 사용
        * - 해당 메서드 안에 사용된 setTimeout은 개발페이지의 이벤트보다 동작을 늦추기위해 추가되었음.
        */
        detectEvents : function() {
            util.detect.show('section', function(e) {   
                var $mainSection = $('section').eq(0),
                    $target = $(e.target);
                
                if($target.hasClass('container')) {
                    
                    // show 되는 section이 메인 section일 경우 저장한 scrollTop set
                    if($target.attr('id') === $mainSection.attr('id')) {
                        setTimeout(function() {
                            ns.global.setScrollTop();
                        }, 0);
                    } else {
                        
                        // 로딩 생성시 disableScroll로 인해 body가 고정되어 show 되는 섹션이 안보이는 현상 방지
                        setTimeout(function() {
                            util.saveTop = 0;
                            if(parseInt($('body').css('top'), 10) < 0) {
                                $('body').css('top', 0);
                            }
                        }, 0);
                    }
                    
                    // section 태그 show / hide시 fixedBArea 버튼 위치 고정 안되는 페이지때문에 추가
                    setTimeout(function() {
                        ns.changeSection();
                        
                        tabs.setup();
                        // 앱 메인 아이디로그인, 공인인증서 로그인, 간편로그인 화면이 show/hide로 바뀔 때 하단 배너 및 tabs 메뉴 css 재조정 (tabs는 eventAll.setup안에 들어있음)
                        arcodians.eventAll.setup();     
                    }, 0);
                }
                
                // 카드신청 / 추천카드 알파원카드 contArea일경우 내부 알파원카드 스와이프 리프레시
                if($target.attr('id') === 'alphaGuid') {
                    setTimeout(function() {
                        swipers.refresh($target.find('.swipeTab'));
                    }, 0);
                }
                
                // 2017.01.16 하단 고정버튼 fixedBArea 버튼이 show 될 경우 container padding-bottom 값 재정의
                if($target.hasClass('fixedBArea')) {
                    setTimeout(function() {
                        common.setContainerPadding();
                    }, 0);
                }
            });
            
            util.detect.hide('section', function(e) {
                var $mainSection = $('section').eq(0),
                    $target = $(e.target);
                
                if($target.hasClass('container')) {
                                        
                    // hide 되는 section이 메인 section일 경우 scrollTop save
                    if($target.attr('id') === $mainSection.attr('id')) {
                        ns.global.getScrollTop();
                    }
                }
                
                // 2017.01.16 하단 고정버튼 fixedBArea 버튼이 hide 될 경우 container padding-bottom 값 재정의
                if($target.hasClass('fixedBArea')) {
                    setTimeout(function() {
                        common.setContainerPadding();
                    }, 0);
                }
            });
            
            
        },

        /**
        * fixedBArea 버튼이 있을 경우 container padding left & right 값 90px
        * 2016.12.23 fixedBArea 버튼의 높이는 현재 60 (fixedBArea 동적 생성이 되는 경우가 있어 버튼 높이 고정)
        */
        setContainerPadding : function() {
            var $fixedBtn = $('.fixedBArea').filter(':visible'),
                $customCard = $('.customCard').filter(':visible'),
                fixedBtnHeight = parseInt($fixedBtn.innerHeight(), 10) > 60 ? parseInt($fixedBtn.innerHeight(), 10) : 80;
        
            if($fixedBtn.length > 0 && $fixedBtn.is(':visible')) {
                $('.container').css('padding-bottom', fixedBtnHeight+'px');
                // $('.container').css('padding-bottom', ($fixedBtn.innerHeight() + 20)+'px');
            }else if($customCard.length) {
                $('.container').css('padding-bottom', $customCard.innerHeight()+'px');
            }else {
                $('.container').css('padding-bottom', '20px');
            }
        },
        
        /**
        * 2016.11.02
        * fixedBArea 버튼과 footer가 한페이지 내에 있을 때 fixedBarea 스크롤 이벤트 적용
        * 기기 이슈로 fixedBtn이 텍스를 입력할 때 input 영역을 가려버리는 현상으로 keypadOn 클래스 추가
        * 2016.12.12
        * 맞춤카드 보기 버튼 추가('.customCard')
        */
        fixedBtnScroll : function() {
            var $fixedBtn = $('.fixedBArea, .customCard').filter(':visible'),

                $footer = $('footer'),
                $container = $('.container').filter(':visible');
                
            if($fixedBtn.length > 0 && $footer.length > 0 && $footer.is(':visible')) {
                $(window).off('scroll.fixedBtn');
                $(window).on('scroll.fixedBtn', function() {
                    var $container = $('.container').filter(':visible'),
                        $fixedBtn = $('.fixedBArea, .customCard').filter(':visible'),
                        $footer = $('footer'),
                        winTop = $(window).scrollTop(),
                        footerOffsetTop = $footer.offset().top,
                        checkTop = footerOffsetTop - ns.global.bh;
                    
                    // footer 상단에 fixedBarea 버튼 고정
                    if(winTop >= checkTop && $footer.is(':visible') || $fixedBtn.hasClass('keypadOn')) {
                    
                        $container.css('position', 'relative');
                        $fixedBtn.css('position', 'absolute');
                    
                    // 고정 해제
                    } else {
                        $container.css('position', 'static');
                        $fixedBtn.css('position','fixed');
                    }
                });
                
                setTimeout(function() {
                    $(window).trigger('scroll.fixedBtn');
                }, 0);
            } else {
                if($('.fixedBArea, .customCard').hasClass('keypadOn')){
                    $('.fixedBArea, .customCard').css('position', 'absolute');
                } else {
                    $('.fixedBArea, .customCard').css('position', 'fixed');
                }
            }
        },
        
        /**
        * 특정 label 태그 내부 텍스트 span으로 감싸줌
        */
        labelAppend : function() {
            var $wrap = $('.inpTxt1, .selType1');
            
            if($wrap.length > 0) {
                $wrap.each(function() {
                    var $label =  $(this).find('> label'),
                        $span = $('<span />'),
                        text = $label.html();
                    
                    // label 내에 input이 없을 때                 
                    if(!$label.find('input').length) {
                        $span.html(text);
                        $label.html($span);
                    }
                });
            }
        },
        
        /**
        * tabDep1의 경우 높이 값을 체크하여 비율 값을 설정해주는데
        * toggle 내부의 tab 높이값을 가져오지 못하여 페이지 초기 로드시 토글 관련 모두 open
        * 토글 관련 플러그인 실행 시 자동으로 hide 처리
        */
        toggleOpen : function() {
            var $toggleView = $('.inbox, .toggleView');
            
            if($toggleView.length > 0) {
                $toggleView.show();
            }
        },
        

        /**
        * fixItem을 가지고있는 요소 fixed 설정
        */
        fixedSetup : function() {
            var $topHead = $('.topHead').filter(':visible'),
                $fixItem = $('.fixItem').filter(':visible'),
                $fixedBtn = $('.fixedBArea').filter(':visible'),
                $container = $('.container').filter(':visible'),
                sum = 0;                            // fixItem top 값
                
            if($topHead.length > 0) {
                sum = $topHead.outerHeight();
            }
            
            $fixItem.each(function() {
                var fixHeight = $(this).outerHeight();
                
                // 해당 요소가 tabDep1일 경우
                if($(this).children().hasClass('tabDep1')) {
                    fixHeight = 49;             // tabDep1 높이값 수정시 "tabDep1 높이" 검색해서 같이 수정
                    $(this).css('background-color','#fff');
                }
                
                $(this).css({
                    position: 'fixed',
                    top: sum+'px',
                    left: 0,
                    width: '100%',
                    zIndex: 99
                });
                
                sum += fixHeight;
            });
            
            $container.css('padding-top', sum+'px');
            
            /*
            * 2016.10.12 바로출금결제
            * 출금결제페이지 페이지 fixedBArea 버튼 노출 / 숨김 제어로 인해 해당 클래스 있을 때 페이지 로드시 none 상태로 변경
            */
            if($('.container').hasClass('fixedBCheck')) {
                $fixedBtn.css('display', 'none');
            }
        },
        
        /**
        * 2016.11.28
        * .centerBox 클래스가 들어간 요소 높이 가운데 정렬
        * 
        */
        centerAlign : function() {
            var $centerBox = $('.centerBox, .finish').filter(':visible'),
                $container = $centerBox.parent(),
                $footer = $('footer').filter(':visible'),
                boxHeight = 0,
                boxWidth = 0,
                containerHeight = ns.global.bh - $('.topHead').innerHeight();
            
            // 레이어 팝업 내부에 있다면 기능 x && layerWrap의 id가 id_layerWrap일 경우는 제외
            // if($centerBox.closest('.layerWrap').length > 0 && $centerBox.closest('.layerWrap').attr('id') !== 'id_layerWrap') { return false; }
            
            // 푸터 높이 값 빼기
            if($footer.length > 0) {
                containerHeight -= $footer.outerHeight();
            }
            
            // 2016.12.09 fixedBArea 버튼 있을 때 버튼 높이 빼기
            if($('.fixedBArea').length > 0) {
                containerHeight -= parseInt($('.fixedBArea').height(), 10);
            }

            // 2016.12.09 스텝 영역 있을 경우 스텝 높이값 빼기
            if($('.stepFixed').length > 0) {
                containerHeight -= $('.stepFixed').innerHeight();
            }
            
            // 2016.11.28
            $container.css('height', 'auto');
            
            if($centerBox.length > 0) {
                boxHeight = $centerBox.innerHeight();
                boxWidth = $centerBox.width();
                
                // 2016.12.09 .finish 클래스가 없을 때
                if($centerBox.innerHeight() > containerHeight) {
                    $container.css('position', 'static');
                    $centerBox.css({
                        position: 'relative',
                        top: '0',
                        marginTop : '20px'
                    });
                } else {
                    
                    // 2016.11.28   
                    var getHeight = containerHeight - 20;
                    
                    $container.css({
                        position: 'relative',
                        height: getHeight+'px'
                    });

                    $centerBox.css({
                        position : 'absolute',
                        top: '50%',
                        left: '0',
                        width: '100%',
    
                        marginTop: -(boxHeight / 2) +'px'
                    });
                }
            }
            
            // 2017.12.14
      // 신청완료 페이지에서 하단에 infoBox(카드발급상담Talk)가 fixedArea 위에 올때

      if($centerBox.siblings(".infoBox").length > 0){
          var $infoBox = $centerBox.siblings(".infoBox"),
              $infoBox_h = $infoBox.outerHeight(),
              $finish_h = $centerBox.outerHeight();
              
          $infoBox.css({
              position : "absolute" ,
              bottom : "56px",
              background : "#ffffff"
          });
          $centerBox.css({
              position : "",
              marginTop : "56px"
          });
          $container.css({
              "min-height" : $finish_h + $infoBox_h + 56
          });
      }
        },
        
        /**
        * section.container에 적용된 클래스를 체크하여 body에 class 적용
        */
        bgClass : function() {
            var $body = $('body'),
                $container = $('.container').filter(':visible');
            
            if($container.hasClass('bgGray')) {
                $body.addClass('bgGray');
            } else {
                $body.removeClass('bgGray');
            }
        },
        
        /**
        * 2016.10.20
        * 기존에 들어가있던 달력 삭제
        */
        removeCalendar : function() {
            var $calBox = $('.calBox');
            
            if($calBox.length > 0) {
                $calBox.remove();
            }
        },
        
        /**
        * 2016.10.26 (개발요청사항)
        * 페이지 스크롤시 끝부분까지 스크롤했을 경우 trigger 실행 (브라우저 스크롤 :'kbcard-load', 팝업 내부 스크롤 : 'kbcard-popContLoad')
        */
        scrollEndCheck : function() {
            var saveWinTop = $(window).scrollTop(),
                savePopTop = $('.popCont').filter(':visible').scrollTop();
            function endCheck() {
                var $doc = $(document),
                    docHeight = $doc.innerHeight(),
                    winTop = $(window).scrollTop(),
                    checkTop = docHeight - 50;
                
                // 스크롤을 내릴때만 이벤트 발생
                if(saveWinTop <= winTop && winTop + ns.global.bh > checkTop) {
                    $(document).trigger('kbcard-load');
                }
                
                // 현재 scrollTop 값 저장
                saveWinTop = winTop;
            }   
            
            // 초기 실행        
            endCheck();
            
            // 스크롤시 함수 실행
            $(window).off('scroll.endCheck');
            $(window).on('scroll.endCheck', function() {
                endCheck();
            });     
            
            $('.popCont').off('scroll.popContEndCheck');
            $('.popCont').on('scroll.popContEndCheck', function() {
                var $layerWrap = $(this).closest('.layerWrap'),
                    $cont = $(this).children(),
                    getId = $layerWrap.attr('id') ? $layerWrap.attr('id') : '',
                    contHeight = $cont.innerHeight(),
                    scrollTop = $(this).scrollTop(),
                    checkTop = contHeight - 50;
                
                // 스크롤을 내릴때만 이벤트 발생
                if(savePopTop <= scrollTop && scrollTop + parseInt($(this).innerHeight(), 10) > checkTop) {
                    $(this).trigger('kbcard-popContLoad', [getId]);
                }
                
                // 현재 scrollTop 값 저장
                savePopTop = scrollTop;
            });
        },
        
        /**
        * 2016.11.01
        * 유의사항 클래스 추가 ico_note클래스 기준으로 체크
        */
        addNoteBox : function() {
            var $ico = $('.ico_note');
            
            $ico.closest('li').addClass('noteBox');
        },
        
        /**
        * .btnL, .btnM disabled
        */
        dimmedBtn : function() {
            var $btn = '.btnL, .btnM';
            
            $(document).off('click.dimmed');
            $(document).on('click.dimmed', $btn, function(e) {
                if($(this).hasClass('dimmed')) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        },
    
        /**
        * 2016.11.28
        * 앱카드 세로로 되어있는 카드 이미지 rotate & width,height 지정
        * OP_1.1.1
        */
        setRotateAppCard : function() {
            var $rotateImg = $('.rotate > img'),
                imgCount = 0;
            
            if($rotateImg.length > 0) {
                clearTimeout(common.config.rotateTimer);
                common.config.rotateTimer = setTimeout(function() {
                    $rotateImg.each(function() {
                        
                        // 이미지 로드 체크
                        $(this).one('load', function() {
                            imgCount += 1;
        
                            // 이미지가 모두 로드되면 실행
                            if(imgCount === $rotateImg.length) {
                                var $rotateParent = $(this).parent();
                                if($rotateParent.find('.rotateArea').length > 0) {
                                    $rotateParent.find('img').removeAttr('style').unwrap('.rotateArea');
                                    
                                }
                                
                                var $origImg = $(this),     
                                    origWidth = $origImg[0].naturalHeight,
                                    origHeight = $origImg[0].naturalWidth,
                                    rotateWidth = $rotateParent.width() > 130 && !$rotateParent.closest('.swiperCon').hasClass('type2') && !$rotateParent.hasClass('annualFee') ? 130 : $rotateParent.width(),
                                    average = rotateWidth / origWidth;
                                
                                origWidth = rotateWidth;
                                origHeight = average * origHeight;
                                
                                
                                if(util.checkCSS) {
                                    $(this).wrap('<span class="rotateArea"></span>');
                                    
                                    $rotateParent.find('.rotateArea').css({
                                        display: 'block',
                                        position: 'relative',
                                        width: origWidth+'px',
                                        height: origHeight+'px',
                                        marginRight: 'auto',
                                        marginLeft: 'auto'
                                    });
                                    
                                    $rotateParent.find('.rotateArea > img').attr('style', 'display: block; position: absolute; top: 0; left: 0; width: ' + origHeight + 'px !important; height: ' + origWidth + 'px !important;');
                                    
                                    $rotateParent.find('.rotateArea > img').css(ns.global.animProp, 'rotate(-90deg) translate(29%, 18.5%)');
                                } else {
                                    $rotateParent.removeAttr('style');
                                    $rotateParent.css({
                                        textAlign: 'center'
                                    });
                                    $(this).show().css('width', '50%');
                                }
                                
                                // 카드 상세 연회비
                                if($rotateParent.closest('.annualFee').hasClass('on')) {
                                    $rotateParent.find('.rotateArea').hide();
                                }
                            }
                        }).each(function() {
                            if(this.complete) {
                                $(this).trigger('load');
                            } else {
                                $(this).trigger('load');
                            }
                        });                         
                    });
                }, 1000);
            }
        },

        /*
        * 2016.12.02
        * android 4.1이상 버전의 웹뷰에서는 input 태그의 maxlength 값이 적용이 안되는 문제가 있음
        */
        bindMaxLength : function() {
            var version = navigator.userAgent;
            
            if(version.match(/Android/)) {
                $(document).on('input.maxLength', 'input', function() {
                    if($(this).attr('maxlength')) {
                        var txt = $(this).val(),
                            maxLength = $(this).attr('maxlength');
                        
                        if(txt.length >= maxLength) {
                            $(this).val(txt.slice(0, maxLength));
                        }
                    }
                });
            }
        },
        
        /*
        * 개인화이미지 설정
        */
        phishingSecurityImg : function() {
            var target = '.stepArea .radioSel .formWrap label';
                
            if($(target).length > 0) {
                
                
                var setHeight = function setHeight() {
                    var $circle = $(target),
                        paddingValue = $circle.width() / 2 / 2;
                    
                    $circle.removeAttr('style');
                    $circle.css({
                        padding: paddingValue + 'px 0'
                    });
                };
                setHeight();
                
                $(document).on('click.securiImg', target, function() {
                    setHeight();
                });
                            
            }
        },

        /*
        * bottomArea 버튼이 있을 경우 전체 높이값을 최소 값으로 설정
        * 버튼을 제외한 컨텐츠를 '.minContent'로 감싸고 있어야 한다
        */
        minHeightSet : function(type, id) {
            var $windowH = $(window).outerHeight(),
                $topHead = $('.topHead').outerHeight(),
                $container = $('.container > .bottomArea').hasClass('type2') ? 0 : parseInt($('.container').css('padding-bottom')),
                $bottomArea = $('.container > .bottomArea').outerHeight() + 40,
                $minTop = $('.minContent').position() == undefined ? 0 : $('.minContent').eq(0).position().top - $topHead,
                $footerH = $('footer').css('display') == 'none' ? 0 : $('footer').outerHeight(),
                $selector = '.minContent';

            if(type == 'popup') {
                $selector = id + ' .popCont .minContent';
                $bottomArea = $(id + ' .popCont .bottomArea').outerHeight() + 40;
                $minTop = 0;
                $footerH = 0;
            }
            
            $($selector).css({'min-height': $windowH - ($topHead + $container + $bottomArea + $minTop + $footerH)});
        }
    };
    
    /**
    * DOM 조작 이벤트
    * CM : 공통
    * MB : 회원
    * MK : My KB
    * BN : 혜택
    * FL : 금융
    * CS : 고객센터
    * CR : 카드신청
    * SV : 서비스
    * OP : 설정
    */
    domEvents = {
        init : function() {
            domEvents.bindEvents();
        },
        
        bindEvents: function() {
            
            /*****************************************************************************
            * CM : 공통
            ******************************************************************************/
            $(document).on('click.disabled', 'a', function(e) {
                if($(this).hasClass('disabled') || $(this).parent().hasClass('disabled')) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
            
            /**
            * 더보기 버튼 이벤트 막기
            * 2016.12.04 스크롤 상단으로 이동되는 현상 방지
            * 1. 동적 생성에 대응하기 위해 $(document)에 이벤트 연결
            * 2. 개발단에서 작업한 부분에서 $('.moreBtn >a').remove() 시키는 과정에서 $(document)에 걸어놓은 이벤트보다 먼저 실행되어 '.moreBtn > a'를 찾을 수 없음
            * 3. 2번 사항을 방지하기 위해 $('.moreBtn > a')에 따로 preventDefault 이벤트 하나 더 추가
            */
            $('.moreBtn > a').on('click', function(e) {
                e.preventDefault();
            });
            $(document).on('click.moreBtn', '.moreBtn > a', function(e) {
                e.preventDefault();
            });
            
            // input에 change 이벤트가 발생할때마다 type checked setTime으로 실행속도 뒤로 늦춤
            $(document).on('click.typeCheck', 'input', function() {
                setTimeout(function() {
                    //formEvent.typeClass();
                    common.fixedBtnScroll();
                }, 0);
            });
            
            // 2016.12.13 btnCheck 클래스가 들어가는 버튼 클릭시 toggleClass on 
            $(document).on('click.mkBtnCheck', 'button.btnCheck', function() {
                $(this).toggleClass('on');
            });
                        
            // tabDep1 클래스를 가지고 있는 탭 메뉴중 링크값으로 #이 들어가는경우 e.preventDefault()
            $(document).on('click.preventDefault', '.tabDep1 a', function(e) {      
                if($(this).attr('href').match(/#/gi)) {
                    e.preventDefault();
                }
            });
            
            // 2017.01.02 개인화이미지 코드 팝업
            $(document).on('click.icoSec', '.icoSec > a', function(e) {
                e.preventDefault();
                var $this = $(this),
                    $textPop = $(this).next(),
                    $text = $textPop.find('span');
                
                $textPop.show();
                waiAccessibility.goFocus($text);

                $textPop.one('click', '> a', function(e) {
                    e.preventDefault();
                    $textPop.hide();
                    waiAccessibility.goFocus($this);
                });
            });
            
            // 하단 고정버튼 클릭할 때 input에 포커스가 on되어있는 경우 포커스 아웃
            $(document).on('touchstart.fixedBtn', '.fixedBArea > a', function() {
                $('input').blur();
            });

            // 알리미 펼치기 닫기 (CM_6.3.html)
            $(document).on('click.tgl', '.tglBtn', function(e) {
                e.preventDefault();
                $(this).parent().toggleClass('open');
            });
            
            /* 본인인증(공인인증서 선택)
            * 만료 : disabled
            * 체크 : checked
            */
            $(document).on('click.certificateList', '.certificateList a', function(e) {
                e.preventDefault();
                var $li = $(this).parent(),
                    $liSiblings = $li.siblings().not('.disabled');
                
                if($li.hasClass('disabled')) { return false; }
                
                $liSiblings.removeClass('checked');             
                $(this).parent().addClass('checked');
            }); 
            
            // 2017.01.11 하단 고정 버튼 keypadOn 클래스
            $(document).on('touchstart.preventEvent', '.fixedBArea.keypadOn', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });     
            
            // 쿠폰함 쿠폰 편집 기능 (CM_5.1.1T.1.1.html)
            if($('.termsBox').length > 0) {
                var $termsBox = $('.termsBox'),
                    $couponBox = $termsBox.find('> .couponboxList'),
                    $fncBtn = $termsBox.find('.fncBtn'),
                    $editBtn = $('.editBtn');
                
                // 편집 버튼
                $fncBtn.off('click');
                $fncBtn.on('click', '.btbEdit', function() {
                    $(this).hide();
                    $(this).next().show();
                    $editBtn.show();
                    $couponBox.addClass('listEdit');
                    common.setContainerPadding();
                });
                
                // 편집 취소 버튼
                $editBtn.off('click');
                $editBtn.on('click', '.btnGray', function(e) {
                    e.preventDefault();
                    $couponBox.removeClass('listEdit');
                    $fncBtn.find('.allCheck').hide();
                    $fncBtn.find('.btbEdit').show();
                    $editBtn.hide();
                    
                    $termsBox.find('input[type="checkbox"]').prop('checked', false).parent().removeClass('checked');
                    common.setContainerPadding();                   
                });
            }
            
            // formWrap안에 a태그 있을 때
            $(document).on('click.formWrapA', '.formWrap > a', function(e) {
                e.preventDefault();
                
                var $formWrap = $(this).parent(),
                    $formWrapSiblings = $formWrap.siblings('.formWrap'),
                    $formWrapSiblingsInput = $formWrapSiblings.find('> input');
                
                if($formWrap.hasClass('disabled') == false) {
                    $formWrapSiblingsInput.filter(':checked').prop('checked',false);
                    $formWrapSiblings.removeClass('checked');
                    $formWrap.addClass('checked');
                    
                    if($formWrap.siblings('.slide').length > 0) {
                        var $slide = $formWrap.next();

                        $slide.slideDown(300).siblings('.slide').slideUp(300);
                    }   
                }


                // 2016.11.14 접근성 추가
                waiAccessibility.changeRadioTitle($formWrap, $formWrapSiblings);
                
            });
            
            /*****************************************************************************
            * FL : 금융
            ******************************************************************************/
            // 장기카드대출, 단기카드대출 직접입력 계산 레이어
            $(document).on('click.calculator', '.calculatorBox > input[type="button"]', function() {
                var $calculator = $(this).closest('.calculator'),
                    $sumRead = $calculator.find('.sumRead'),
                    $sumInput = $sumRead.find('> input'),
                    maxValue = parseInt($calculator.find('.popTop span > em').filter(':visible').text().split(',').join('')),
                    getValue = $sumRead.find('> input').val().split(',').join(''),
                    getCalculatorPopupIndex = $calculator.index('.calculator');
                    
                
                // calculator 팝업 금액 삭제 버튼
                if($(this).hasClass('delete')) {
                    getValue = getValue.slice(0, getValue.length-1);
                    
                // calculator 팝업 확인 버튼
                } else if ($(this).hasClass('confirm')) {
                    
                    // aplcnAmtText : 단기카드 대출 전용 id (단기카드대출은 1만원단위까지 입력 가능)
                    if(getValue % 10 === 0 || $('#aplcnAmtText, #aplcnAmtTextKB, #aplcnAmtTextBC').length > 0) {
                        
                        // 입력한 금액의 값이 최대 신청금액보다 작을 경우
                        if(getValue <= maxValue) {
                            // 단키카드대출
                            $('#aplcnAmtText').text(util.comma(getValue));
                            
                            // 2017.01.05 장기카드대출 applyNum이 두개인 경우가 있어 부모 팝업 index로 체크하여 해당하는 index의 input에 금액 값 변경
                            // 2017.08.23 입력값이 input에 들어갈 수 있어 val추가
                            var applyNum = $('.applyNum').eq(getCalculatorPopupIndex);
                            
                            if(applyNum.length > 0) {
                                if(applyNum[0].tagName.toLowerCase() == 'input') {
                                    applyNum.val(util.comma(getValue));
                                } else {
                                    applyNum.text(util.comma(getValue));
                                }
                            }
                            
                            layerPopup.closePopup($calculator);
                        
                        // 입력한 금액의 값이 최대 신청금액보다 클 경우 금액의 값을 최대 신청금액으로 변경
                        } else {
                            getValue = maxValue;
                            $sumInput.val(getValue);
                        }
                    
                    // 장기카드대출 : 입력한 금액의 값이 10만원 단위가 아닐 경우
                    } else {
                        // 개발 공통 메서드 사용
                        try {
                            $.cxhia.alert({
                                title: "Alert",
                                message: "10만원 단위로 입력해주세요."
                            });
                        } catch(e) {
                            alert("10만원 단위로 입력해주세요.");
                            console.log(e);
                        }
                        return false;
                    }
                
                // calculator 팝업 금액 버튼
                } else {
                    getValue += $(this).val();
                    
                    // 첫번째 입력 금액이 0일 경우 입력 x
                    if(getValue.substring(0, 1) === 0) {
                        getValue = '';
                    }
                }
                
                // 금액을 입력할때마다 체크하여 콤마 표시
                $sumInput.val(util.comma(getValue));    
            });
            
            // 2016.12.20 장기카드대출 이자율 라디오버튼 클릭시 하단 문구 변경
            $(document).on('change.flRadioTxt', '.applyArea .type2 input[name="labelRdio"]', function() {
                var idx = $(this).index('[name="labelRdio"]'),
                    $radioTxt = $('.interestTxt').eq(idx);
                    
                $radioTxt.siblings('.interestTxt').hide();              
                $radioTxt.show();
            });
            
            // 장기카드대출(카드론) 신청(FL_1.1.6.1)
            $(document).on('click.repayment', '.repayment input', function() {
                
                if($(this).parent().index() === 2) {
                    $('.amountList').find('input#rs9, input#rs10').attr('disabled', 'disabled').parent().addClass('disabled');
                } else {
                    $('.amountList').find('input#rs9, input#rs10').removeAttr('disabled').parent().removeClass('disabled');
                }
            });
            
            /*****************************************************************************
            * CR : 카드신청
            ******************************************************************************/         
            // 카드 안내/신청 상세 연회비 버튼
            $(document).on('click.annualFee', '.annualFee a', function(e) {
                e.preventDefault();
                
                var $thisWrap = $(this).closest('.annualFee');
                
                $thisWrap.toggleClass('on');
                
                // 2016.11.08 텍스트 체인치 추가
                if($thisWrap.hasClass('on')) {
                    $(this).text('카드보기');
                    
                    // 2016.12.06 세로 카드 rotate
                    if($thisWrap.hasClass('rotate')) {
                        $thisWrap.children('.rotateArea').hide();
                    }
                } else {
                    $(this).text('연회비보기');
                    
                    // 2016.12.06 세로 카드 rotate
                    if($thisWrap.hasClass('rotate')) {
                        $thisWrap.children('.rotateArea').show();
                    }
                }
            });
            
            // 보유카드 재발급 페이지 체크결제방식 라디오타입
            $(document).on('click.useCheckPay', '.useCheckPay a', function(e) {
                e.preventDefault();
                
                var $thisWrap = $(this).parent(),
                    $wrapSiblings = $thisWrap.siblings();
                
                if(!$(this).hasClass('disabled')) {
                    $thisWrap.addClass('on');
                    $wrapSiblings.removeClass('on');
                    

                    // 2016.11.14 접근성 추가
                    $(this).attr('title', '선택됨');
                    $wrapSiblings.find('> a').removeAttr('title');
                }
            });         
            
            // 맞춤 서비스 신청 체크 / 해제
            $(document).on('click.selService', '.selService a', function(e) {
                e.preventDefault();
                
                var $thisWrap = $(this).parent(),
                    $wrapSiblings = $thisWrap.siblings();
                
                if(!$thisWrap.hasClass('disabled')){
                    if($(this).closest('.selService').hasClass('checkType')){
                        $(this).toggleClass('on');                      
                    } else {
                        $(this).addClass('on');
                        $wrapSiblings.find('> a').removeClass('on');
                    }
                }
            });
            
            /*****************************************************************************
            * BN : 혜택
            ******************************************************************************/             
            // 기부 안내 show / hide
            $(document).on('click.donationList', '.donationList > li > a', function(e) {
                e.preventDefault();
                var $back = $(this).siblings('.back');
                $('.donationList > li').find('> .back').hide();
                $back.show();
            });
            
            // 2016.11.23 스타샵 필터(BN_5.1.1P.html) 팝업 내부 디폴트 셀렉트 변경시 label text 변경    
            $(document).on('change.defaultSelect', '.defalutSelect select', function() {
                var $select = $(this),
                    $options = $(this).find('> option'),
                    $label = $('label[for="'+ $select.attr('id') +'"]'),
                    $selected = $options.filter(':selected');
                    
                $label.text($selected.text());
            }); 
            

            /*****************************************************************************
            * SV : 서비스
            ******************************************************************************/     
            // SV_1 이벤트 show / hide
            $(document).on('click.payment', '.paymentList li a', function(e) {
                if($(this).hasClass('svEventBtn')) {
                    e.preventDefault();
                    $(this).closest('li').addClass('on');
                } else if($(this).hasClass('svCloseBtn')) {
                    e.preventDefault();
                    $(this).closest('li').removeClass('on');
                }
            });
            
            // 신용/체크 선택 결제 신청페이지 체크 결제조건 선택 폼
            $(document).on('click.selSum', '.selSum .selBox', function(e) {
                var $input = $(this).find('input[type="text"]'),
                    $inputWrap = $input.parent();

                if($(this).hasClass('disabled')) return
                
                $(this).siblings().removeClass('on');
                $(this).siblings().find('input[type="text"]').prop('disabled', true);
                $(this).siblings().find('input[type="text"]').parent().addClass('disabled');
                
                
                $(this).addClass('on');
                
                if($input.length > 0) {

                    $input.prop('disabled', false);
                    $inputWrap.removeClass('disabled');
                }
            });         
        }
    };
    
    /**************************************
    * form 관련 이벤트
    * 체크 박스 클릭 시 부모 .formWrap에 checked 클래스 추가
    **************************************/ 
    formEvent = {
        init : function() {
            formEvent.config = {
                input : 'input',
                tabsInput : '.radioSel',
                fontRadio : 'input[name="fontSel"]'
            };
            

            
            // input 관련 tabs 이벤트
            if($(formEvent.config.tabsInput).length > 0) {
                formEvent.formTabs();
            }
            
            // 설정 - 폰트 크기 설정
            if($(formEvent.config.fontRadio).length > 0) {
                formEvent.onFontSize();
            }
            
            formEvent.text.init();
            formEvent.radio.init();
            formEvent.checkbox.init();
            formEvent.select.init();
            formEvent.date.init();
            formEvent.searchBox.init();
            
            // readonly, disabled, checked 상태 체크 후 클래스 추가
            if($(formEvent.config.input).length > 0) {
                formEvent.typeClass();
            }           

        },
        
        /*
        * 입력 받은 넘버값 체크하여 대쉬 처리
        */
        phoneFomat : function(num) {
            /**
            * 국번 분기처리
            * 02,
            * 01x
            * 013x
            * 030x
            * 050x 
            */
            return num.replace(/(^02.{0}|^013.{1}|^030.{1}|^01.{1}|^050.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3");
        },
        
        /*
        * 입력 받은 넘버값 체크하여 대쉬 처리 ( 카드번호 4자리마다 - 처리)
        */
        cardFomat : function(num) {
            return num.toString().replace(/\B(?=(\d{4})+(?!\d))/g, "-");
        },
        
        /*
        * 페이지 로드시 checked 나 disabled를 체크하여 클래스 추가
        */
        typeClass : function() {
            $(formEvent.config.input).each(function() {
                                
                // input의 상태가 체크 상태일 경우
                if($(this).is(':checked')) {
                    $(this).parent().addClass('checked');
                    
                    // 2017.01.17 접근성 추가
                    if($(this).attr('type') === 'radio') {
                        var $thisWrap = $(this).parent();
                        if($thisWrap.hasClass('formWrap')) {
                            waiAccessibility.changeRadioTitle($thisWrap, $thisWrap.siblings('.formWrap'));
                        }
                    }
                    // 2018.03.15 접근성 추가
                    if($(this).attr('type') === 'checkbox') {
                        var $thisWrap = $(this).parent();
                        if($thisWrap.hasClass('formWrap')) {
                            waiAccessibility.changeCheckboxTitle($thisWrap, $thisWrap.siblings('.formWrap'));
                        }
                    }
                    
                // input의 상태가 disabled 상태일 경우
                } else if($(this).is(':disabled')) {
                    if($(this).attr('type') !== 'password'){
                        
                        $(this).parent().addClass('disabled');
                        // 2017.01.12 접근성 추가 (적용된 aria-hidden 제거)
                        $(this).parent().attr('aria-hidden', true);
                    }
                
                // input의 상태가 readonly 상태일 경우
                } else if($(this).is('[readonly]')) {
                    if($(this).attr('type') !== 'password' && !$(this).closest('.calendar').length){
                        $(this).parent().addClass('readonly');
                    }
                    
                // 그 외 모든 경우
                } else {
                    $(this).parent().removeClass('disabled');                       
//                  $(this).parent().removeClass('checked');
                    if($(this).attr('type') !== 'password'){
                    
                        $(this).parent().removeClass('readonly');
                    }
                    
                    // 2017.01.12 접근성 추가 (적용된 aria-hidden 제거)
                    $(this).parent().removeAttr('aria-hidden');

                    // 2017.01.17 접근성 추가
                    if($(this).attr('type') === 'radio') {
                        var $thisWrap = $(this).parent();
                        if($thisWrap.hasClass('formWrap')) {
                            waiAccessibility.changeRadioTitle(null, $thisWrap);
                        }
                    }        
                    // 2018.03.15 접근성 추가
                    if($(this).attr('type') === 'checkbox') {
                        var $thisWrap = $(this).parent();
                        if($thisWrap.hasClass('formWrap')) {
                            waiAccessibility.changeCheckboxTitle(null, $thisWrap);
                        }
                    }                   
                }
            });     
        },
        
        /*
        * 2016.10.12
        * 카드이용내역 필터(MK_3.1P.html)
        * input 용 tabs
        * data-id를 체크하여 해당하는 콘텐츠 노출
        * tabCont에 tabShow 클래스 있을경우 초기 로딩시 숨김 x
        */
        formTabs : function() {
            var config = formEvent.config,
                $tabsInput = $(config.tabsInput)
            
            $tabsInput.siblings('.tabCont').not('.tabShow').hide();
            
            $tabsInput.off('click.formTabs');
            $tabsInput.on('click.formTabs', 'input, a', function() {
                var dataId = $(this).attr('data-id'),
                    $thisWrap = $(this).closest('.radioSel'),
                    $thisCont = $thisWrap.siblings('#'+dataId),
                    $thisContLayerBtn = $thisCont.find('.selType1').eq(0).find('a.layerOpen'),
                    $thisContCalBtn = $thisCont.find('.calendar').eq(0).find('.calBtn'),
                    $tabCont = $thisWrap.siblings('.tabCont');
                    
                $tabCont.hide();
                $thisCont.show();
                
                // 2016.10.26 해당 thisCont안에 a.layerOpen 버튼이 있을 경우 trigger('click'
                if($thisContLayerBtn.length > 0) {
                    $thisContLayerBtn.trigger('click');
                } else if ($thisContCalBtn.length > 0) {
                    $thisContCalBtn.trigger('click');
                }
            });
        },
        
        /*
        * 2016.10.26
        * 설정 - 폰트사이즈 설정 부분 추가
        */
        onFontSize : function() {
            var config = formEvent.config,
                $fontRadio = $(config.fontRadio);
                        
            $fontRadio.off('change.fontSize');
            $fontRadio.on('change.fontSize', function() {
                var getId = $(this).attr('id');
                
                switch(getId) {
                    case 'fontSel1' :
                        $('.lineBox').css('font-size', '14px');
                        break;
                    case 'fontSel2' :
                        $('.lineBox').css('font-size', '15px');             
                        break;
                    case 'fontSel3' :
                        $('.lineBox').css('font-size', '16px');
                        break;
                }
            });     
        },
        
        /**
        * 특정 필터페이지 value 값 get
        */
        getFilterValue : function() {
            var $formWrap = $('.formWrap.checked').filter(':visible'),
            arr = [];
            
            if($formWrap.length > 0) {
                $formWrap.each(function() {
                    var getValue = '',
                        $label = $(this).find('> label'),
                        $a = $(this).find('> a'),
                        $elem = $label.length > 0 ? $label : $a,
                        getText = $elem.text();
                    
                    if($elem[0].tagName.toUpperCase() === 'A') {
                        var getDataId = $elem.attr('data-id'),
                            $selectTarget = $('#'+getDataId),
                            $selectCont = $selectTarget.children();
                        
                        
                        if($selectCont.hasClass('cardBox')){                        
                            getText += ':' + $selectCont.find('.cardTxt').data('selectIndex');
                        }
                    }
                    arr.push(getText);
                });
                return arr.join(',');
            }
        }
    };
    
    /*
    * input 텍스트 이벤트
    */
    formEvent.text = {
        init : function() {
            var config = null;
            
            formEvent.text.config = {
                input : $('input[type="text"], input[type="number"], input[type="tel"], input[type="search"]'),
                // 전화번호가 아닌데 type이 tel인 경우가 있어 모든 케이스 적용..
                phone : $('.idenArea > input[type="text"], #telNumber, #telNum, #phoneNumber, #cellNumber, #phoneNum, #cpNum1'),
                selectBox : $('.selBox input[type="text"]'),
                parentClass : '.inpTxt1',
                textarea : 'textarea',
                inputTimer : null
            };
            
            config = formEvent.text.config;
            
            if(config.input.length > 0 ) {
                formEvent.text.bindEvents();
            }
            
            /* 2016.11.30 
            * 텍스트 입력 글자 수 체크
            */
            if($(config.textarea).length > 0) {
                $(document).on('input.wordCount', config.textarea, function(e) {
                    var $titArea = $(this).prev('.titArea').children('.rtArea');
                    
                    if($titArea.length > 0) {
                        var maxNum = parseInt($titArea.text().split('/')[1]),
                            $countArea = $titArea.children('em'),
                            count = $(this).val().length;
                        
                        if(count > maxNum) {
                            var txt = $(this).val();
                            
                            $(this).val(txt.slice(0, maxNum));
                            $countArea.text(maxNum);
                        } else {                        
                            $countArea.text(count);
                        }
                    }
                });
            }

        },
        
        bindEvents : function() {
            var config = formEvent.text.config;
            
            config.phone.each(function() {
                if($(this).attr('type') !== 'hidden') {
                    $(this).attr('type', 'tel');
                }
            });
            config.phone.off('input.phoneFomat');
            config.phone.on('input.phoneFomat', function() {
                var _that = this,
                    _val = $(this).val().split('-');
                
                _val = _val.join('');
                
                this.value = formEvent.phoneFomat(_val);
                
                // 2016.12.14 특정 안드로이드폰에서 정규식 변환시 커서 위치를 제대로 잡지 못하는 이슈 방지(커서위치 맨 뒤로)
                clearTimeout(config.inputTimer);
                config.inputTimer = setTimeout(function() {
                    _that.selectionStart = _that.selectionEnd = _that.value.length;
                }, 10);
            });
            
            // 2016.11.16 카드넘버 대시처리 추가
            config.input.filter('#cardNumber').off('input.cardNum');
            config.input.filter('#cardNumber').on('input.cardNum', function() {
                var _that = this,
                    _val = $(this).val().split('-');
                
                _val = _val.join('');
                
                this.value = formEvent.cardFomat(_val);
                
                // 2016.12.14 특정 안드로이드폰에서 정규식 변환시 커서 위치를 제대로 잡지 못하는 이슈 방지(커서위치 맨 뒤로)
                clearTimeout(config.inputTimer);
                config.inputTimer = setTimeout(function() {
                    _that.selectionStart = _that.selectionEnd = _that.value.length;
                }, 10);
            });
            
            // input[type="text"] 포커스 이벤트
            $(document).off('focusin.inputText');
            $(document).on('focusin.inputText', 'input[type="text"], input[type="number"], input[type="tel"], input[type="search"]', function() {
                if($(this).attr('readonly') === 'readonly') {
                    $(this).blur();
                    return false; 
                }
                var borderEvent = false,
                    $target,
                    $label = $(this).siblings('label'),
                    $labelWrap = $(this).closest('label'),
                    $validity = $(this).closest('.validity'),
                    $email = $(this).closest('.emailAddr');
                
                // 클릭한 input의 형제 엘리먼트에 label이 있을 때
                if($label.length > 0) {
                    borderEvent = true;
                    $target = $(this);
                // 클릭한 input이 label 내부에 있을 때
                } else if($labelWrap.length > 0 ) {
                    borderEvent = true;                     
                    $target = $labelWrap;   
                // 유효기간 케이스
                } else if($validity.length > 0) {
                    borderEvent = true;                     
                    $target = $validity;
                } else if($email.length > 0) {
                    borderEvent = true;                     
                    $target = $email;                       
                }
                
                if(borderEvent) {
                    $target.closest(config.parentClass).addClass('checked');
                    $(this).attr('style', 'border: 0 !important');                      
                }
                
                
                // input 입력 상자에 포커스 들어갔을 때 fixedBtn 최하단 고정
                if($('.fixedBArea').length > 0) {
                    $('.container').css('position', 'relative');
                    
                    // 2016.12.20 focusin : container의 높이가 $(window).height()의 높이보다 작을 경우 높이 지정하여 고정 버튼 최하단에 붙도록 추가
                    if(ns.global.bh > $('.container').innerHeight()){
                        $('.container').css('min-height', ns.global.bh - (parseInt($('.container').css('padding-top'), 10) + parseInt($('.container').css('padding-bottom'), 10)));
                    }
                    $('.fixedBArea').addClass('keypadOn').css('position', 'absolute');
                    
                    // 2017.01.02 아이폰에서 인풋 진입시 fixed 엘리먼트 이슈 관련 추가(최상단 고정)
                    if($(this).attr('type') !== 'search' && $(this).closest('.srchLayer').length === 0){
                        $('.topHead, .homeBtn').css('position', 'absolute');
                    }
                }       
                
                if($('.eventAllView').length > 0) {
                    $('.eventArea').css('position', 'relative');
                    $('.eventAllView').css('position', 'absolute');
                }
            });
            
            $(document).off('focusout.inputText');
            $(document).on('focusout.inputText', 'input[type="text"], input[type="number"], input[type="tel"], input[type="search"]', function() {
                if($(this).attr('readonly') === 'readonly') { return false; }
                var borderEvent = false,
                    $target,
                    $label = $(this).siblings('label'),
                    $labelWrap = $(this).closest('label'),
                    $validity = $(this).closest('.validity'),
                    $email = $(this).closest('.emailAddr');
                
                // 클릭한 input의 형제 엘리먼트에 label이 있을 때
                if($label.length > 0) {
                    borderEvent = true;
                    $target = $(this);
                // 클릭한 input이 label 내부에 있을 때
                } else if($labelWrap.length > 0 ) {
                    borderEvent = true;                     
                    $target = $labelWrap;   
                // 유효기간 케이스
                } else if($validity.length > 0) {
                    borderEvent = true;                     
                    $target = $validity;
                } else if($email.length > 0) {
                    borderEvent = true;                     
                    $target = $email;                       
                }
                
                if(borderEvent) {
                    $target.closest(config.parentClass).removeClass('checked');
                    $(this).removeAttr('style');
                }
                
                
                // input 입력 상자에 포커스 나갈 때 fixedBtn fixed 고정
                if($('.fixedBArea').length > 0) {
                    $('.fixedBArea').removeClass('keypadOn');
                    
                    // 2016.12.20 focusout : container의 높이가 $(window).height()의 높이보다 작을 경우 지정한 높이 값 삭제
                    if(ns.global.bh < $('.container').innerHeight()){
                        $('.container').css('height', 'auto');
                    }                   
                    common.fixedBtnScroll();
                    
                    // 2017.01.02 아이폰에서 인풋 진입시 fixed 엘리먼트 이슈 관련 추가(최상단 고정 해제)
                    if($(this).attr('type') !== 'search' && $(this).closest('.srchLayer').length === 0){
                        $('.topHead, .homeBtn').css('position', 'fixed');
                    }
                }       
                
                if($('.eventAllView').length > 0) {
                    $('.eventArea').css('position', 'static');
                    $('.eventAllView').css('position', 'fixed');
                }
            });
        }
    };
    
    /*
    * 라디오버튼 이벤트
    */
    formEvent.radio = {
        init : function() {
            var config = null;
            
            formEvent.radio.config = {
                input : 'input[type="radio"]'
            };
            
            config = formEvent.radio.config;
            
            if($(config.input).length > 0) {
                formEvent.radio.bindEvents();
            }
        },
        
        bindEvents : function() {
            var config = formEvent.radio.config;
                
            // 라디오 클릭 이벤트
            $(document).off('click.radio');
            $(document).on('click.radio', config.input, formEvent.radio.onRadio);
        },
        
        onRadio : function(e) {
            var config = formEvent.radio.config,
                $thisWrap = $(this).parent(),
                $thisName = $(this).attr('name');

            // click 이벤트시 commonJs.radio.clear()가 먼저 실행된 경우 onRadio 이벤트 중지
            if($(this).data('clear')) {
                setTimeout(function() {
                    $thisWrap.siblings().removeClass('checked');
                    $thisWrap.siblings().find('input[type="radio"]').prop('checked', false);
                }, 0);
                return false;
            }
            
            $(config.input).filter('[name="'+ $thisName + '"]').parent().removeClass('checked');    
            $thisWrap.siblings().removeClass('checked');
            $thisWrap.addClass('checked');
            
            // 2017.01.11 접근성 추가 (라디오버튼 선택 여부 제공);  
            waiAccessibility.changeRadioTitle($thisWrap, $thisWrap.siblings('.formWrap'));
            
            
            // 2016.11.14 접근성 추가 radio type form에 a태그가 있을 때 title="선택됨" 삭제
            if($thisWrap.siblings().find('> a').length > 0) {
                $thisWrap.siblings().find('> a').removeAttr('title');
            }
            
            /* 
            * CR_4.1.3
            */
            if($thisWrap.siblings('.inforCheck').length > 0) {
                $thisWrap.siblings('.inforCheck').hide();
                $thisWrap.next('.inforCheck').show();
            }

            if($thisWrap.parent('.radioSel').length < 1) {
                if($('.fixedBCheck ' +config.input).filter(':checked').length > 0) {
                    util.fixedBCheck('show');
                } else {
                    util.fixedBCheck('hide');
                }
            }
            
            // 주소검색 라디오버튼 클릭시 상세주소로 포커스 이동
            if($(this).is('[name*="addressRadio"]')) {
                $(this).closest('.toggleView').find('input[name="remainAddr"]').focus();
            }
        },
        
        /**
        * 선택된 radiobox 체크 해제
        */
        clear : function(target) {
            var $target = $(target),
                $thisWrap = $target.parent();
            
            /*
            * 2016.12.14 
            * click에 clear이벤트가 들어가 있을 경우 onRadio와 큐 순서가 겹쳐 해당 메서드를 실행해도 on이 되는 경우가 발생해 setTimeout으로 이벤트 실행 늦춤
            */
            $target.data('clear', true);
            setTimeout(function() {
                $target.removeData('clear', false);
            }, 0);
            
            $thisWrap.removeClass('checked');
            if(!$target.attr('href')) {
                $target.prop('checked', false);
            }
        },
        
        /**
        * radio checked 이벤트 ( a태그일 경우 data-id값에 해당하는 콘텐츠 오픈 )
        * @param {jQuery | HTMLElement} target input 또는 a태그
        * @example
        * // id 값이 radoi0인 엘리먼트를 찾아 checked
        * commonJs.radio.checked('#radio0');
        */
        checked : function(target) {
            var $target = $(target),
                $thisWrap = $target.parent(),
                $formTabCont = $target.closest('.tabBox').find('> .tabCont');
                
            $thisWrap.siblings().removeClass('checked');
            $thisWrap.siblings().find('input[type="radio"]').prop('checked', false);

            $thisWrap.addClass('checked');
            
            // tabCont 관련 hide
            if($formTabCont.length > 0) {
                $formTabCont.hide();
            }
            
            // target에 data('id')가 있을 경우 해당하는 tabCont 노출
            if($target.data('id')) {
                
                $('#'+ $target.data('id')).show();
            // data('id')가 업을 경우 $target에 checked
            } else {
                $target.prop('checked', true);
            }
        }
    };
    
    /*
    * 체크박스 이벤트
    * 선택 동의는 전체 동의 선택시 하단 체크박스 숨김 X
    * 분기 필요
    */
    formEvent.checkbox = {
        init : function() {
            var config = null;
            
            formEvent.checkbox.config = {
                input : 'input[type="checkbox"]',
                termsT : $('.allCheck input[type="checkbox"]'),
                termsL : $('.termsList input[type="checkbox"]')
            };
            
            config = formEvent.checkbox.config;
            
            if(config.input.length > 0) {
                formEvent.checkbox.bindEvents();
            }
        },

        bindEvents : function() {
            var config = formEvent.checkbox.config;

            // 체크박스 클릭 이벤트
            $(document).off('change.checkbox');
            $(document).on('change.checkbox', config.input, formEvent.checkbox.onCheckbox);
            
            // 전체 동의
            config.termsT.off('change.checkbox');
            config.termsT.on('change.checkbox', formEvent.checkbox.onAllCheck);

            config.termsL.off('change.checkbox');
            config.termsL.on('change.checkbox', formEvent.checkbox.onListCheck);
            
            
            /*
            * 2016.11.16
            * 특정 팝업페이지 동의하기 설명글 팝업 -> 아코디언으로 변경
            */
            $('.termsList').on('click', 'a.termsInfo', function(e) {
                e.preventDefault();
                var $inner = $(this).closest('.inner'),
                    $view = $inner.length > 0 ? $inner.siblings('.termsView') : $(this).siblings('.termsView');
                
                if($(this).hasClass('on')) {
                    $(this).removeClass('on');
                    $view.slideUp('fast');
                } else {
                    $(this).addClass('on');
                    $view.slideDown('fast');
                }
            });

            /*
            * 2018.05.21
            * 필수 체크박스 'a'클릭시 체크되도록 처리
            */
            $('.inforCheck .inner.must').on('click', 'a', function(e) {
                $(this).closest('.must').find('input[type="checkbox"]').data('confirm','complete').prop('checked', true);
            });
        },
        
        onCheckbox : function(e) {
            var config = formEvent.checkbox.config,
                isChecked = $(this).is(':checked'),
                $thisWrap = $(this).parent('.formWrap').length > 0 ? $(this).parent('.formWrap') : $(this).parent('.allCheck');

            if(isChecked) {
                $thisWrap.addClass('checked');
            } else {
                $thisWrap.removeClass('checked');
            }   

            // 2018.03.15 접근성 추가 (체크박스 선택 여부 제공);  
            waiAccessibility.changeCheckboxTitle($thisWrap, $thisWrap.siblings('.formWrap'));
            
            /*
            * 2016.10.12 바로출금결제
            * 출금 결제 페이지 fixedBArea 버튼 노출/숨김
            */
            if($('.fixedBCheck ' + config.input).filter(':checked').length > 0) {
                util.fixedBCheck('show');
            } else {
                util.fixedBCheck('hide');               
            }
            
            // sel type 전체동의 checkbox
            if($(this).closest('.radioSel').hasClass('eventCheck')){
                
                // 전체 동의 버튼 (첫번째 위치한 버튼)
                if($thisWrap.index() === 0) {
                    if($thisWrap.hasClass('checked')) {
                        $thisWrap.siblings().addClass('checked');
                        $thisWrap.siblings().find($(config.input)).prop('checked',true);
                    } else {
                        $thisWrap.siblings().removeClass('checked');
                        $thisWrap.siblings().find($(config.input)).prop('checked',false);                   
                    }
                
                // 두번째부터 리스트 버튼
                } else {
                    var $radioSel = $(this).closest('.radioSel'),
                        $formWrap = $radioSel.find('.formWrap'),
                        $allBtn = $formWrap.eq(0),
                        $listBtn = $radioSel.find($(config.input)).not(':eq(0)'),
                        len = $listBtn.length;
                    
                    if($listBtn.filter(':checked').length === len) {
                        $allBtn.eq(0).addClass('checked');
                        $allBtn.eq(0).find($(config.input)).prop('checked', true);
                    } else {
                        $allBtn.eq(0).removeClass('checked');
                        $allBtn.eq(0).find($(config.input)).prop('checked', false);                 
                    }
                }
            }

             /*
            * 2018.05.21 체크박스 필수동의 UI추가
            */
            if($(this).closest('.inner').hasClass('must')){
                if($(this).data('confirm') != 'complete') {
                    var layer = $(this).closest('.must').find('a').attr('href');
                    $(this).data('confirm','complete');
                    commonJs.layerPopup.openPopup(layer);
                }
            }
        },
        
        // 전체 동의 버튼 이벤트
        onAllCheck : function(e) {
            var config = formEvent.checkbox.config,
                $thisBox = $(this).closest('.termsBox'),
                // termsL input
                $termsL = $thisBox.find(config.termsL),
                $termsLWrap = $termsL.closest('.termsList'),
                isRequired = $thisBox.find('.allCheck').hasClass('required'); // 필수 동의일 경우 하단 체크박스 숨김
            
            if($(this).is(':checked')) {
                $termsL.parent().addClass('checked');
                $termsL.prop('checked', true);
                
                if(isRequired){
                    $termsLWrap.hide();
                    // common.fixedBtnScroll();
                }
            } else {
                $termsL.prop('checked', false);
                $termsL.parent().removeClass('checked');
                
                if(isRequired) {
                    $termsLWrap.show();
                    // common.fixedBtnScroll();
                }
            }
        },
        
        // 전체 동의 관련 체크박스 리스트 체크
        onListCheck : function() {
            var config = formEvent.checkbox.config,
                $thisLi = $(this).closest('li'),
                $thisBox = $thisLi.closest('.termsBox'),
                // termsT input
                $termsT = $thisBox.find(config.termsT),
                // termsL input
                $termsL = $thisBox.find(config.termsL),
                $termsLWrap = $termsL.closest('.termsList'),
                isRequired = $thisBox.find('.allCheck').hasClass('required'),
                
                len = $termsL.length,
                checkCount = 0;
            
            $termsL.each(function() {
                if($(this).is(':checked')) {
                    checkCount++;
                }
            });

            // 전체동의 체크 상태와 현재 체크된 리스트 개수 체크
            if(checkCount != len && $termsT.is(':checked')) {
                $termsT.prop('checked', false);
                $termsT.parent().removeClass('checked');
                isRequired && $termsLWrap.show();
                
            } else if(checkCount === len) {
                
                $termsT.prop('checked', true);
                $termsT.parent().addClass('checked');               
                isRequired && $termsLWrap.hide();           
            }
        },
        
        offCheckBox : function(target) {
            var $target = $(target);
            $target.prop('checked', false);
            $target.parent().removeClass('checked');
            
        }
    };
    
    /**
    * 2016.10.12 셀렉트 팝업 이벤트 추가
    * 기본 셀렉트 엘리먼트 -> 레이어 팝업으로 변환
    */
    formEvent.select = {
        init : function() {
            var config = null;
            
            formEvent.select.config = {
                target : $('.selType1 select'),
                id : 'sl',
                ulClass : 'selectList'
            };
            
            config = formEvent.select.config;
            
            if(config.target.length > 0) {
                formEvent.select.setup();
            }
        },
        
        /**
        * 셀렉트 레이어 버튼 + 레이어 팝업 세팅
        * 팝업 id 값은 'sl' + index값으로 제어
        */
        setup : function() {
            var config = formEvent.select.config;
            
            formEvent.select.setSelectLayer();          
        },      
        
        bindEvents : function() {

            var config = formEvent.select.config;
            
            // label 태그 클릭시 셀렉트 레이어 오픈
            $(document).off('click.label');
            $(document).on('click.label', 'label', function(e) {
                var $selectLayerBtn = $(this).siblings('.layerOpen');
                
                if($selectLayerBtn.length > 0) {
                    $selectLayerBtn.trigger('click');
                }
            });

            $('.'+config.ulClass).off('click.selectList');
            $('.'+config.ulClass).on('click.selectList', 'a', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('disabled')) {
                                    
                    var $layerWrap = $(this).closest('.layerWrap'),
                        $layerCloseBtn = $layerWrap.find('> .popClose a'),
                        $selectList = $layerWrap.find('.selectList'),
                        $li = $(this).parent(),
                        getId = $layerWrap.attr('id'),
                        
                        $selectBtn = $('a[href="#' + getId + '"]'),
                        $select = $selectBtn.next('select'),
                        liLen = $selectList.find('li').length,                                  // 셀렉트 팝업 li의 수
                        optionLen = $select.find('option').length,                              // 셀렉트의 option 수
                        /*
                        * option 수와 li의 수가 다를 때는 index+1 같을 때는 기본 index 
                        * (페이지 로드시 '셀렉트 선택'같은 옵션이 있는 경우가 있어 분기 처리. 선택 옵션은 레이어팝업에서 나오지 않음)
                        */
                        getSelectIndex = liLen !== optionLen ? $li.index() + 1 : $li.index(),   
                        valueTxt = $(this).text();

                        
                    $selectBtn.text(valueTxt);
                    // $selectBtn.siblings('select option:eq('+getIdx+')').attr('selected', 'selected');
                    $select.find('option:eq('+getSelectIndex+')').prop('selected', true);
                    
                    // 2016.10.25 depth2 select show / hide 추가 대학등록금신청 대학교 선택(SV_1.6P.1.1.html)
                    if($selectBtn.parent().hasClass('selDep1')) {
                        var $selDep2 = $selectBtn.parent().next('.selDep2').children().eq($li.index());
                        $selDep2.removeClass('disabled').show();
                        $selDep2.find('> a').removeClass('disabled');
                        
                        // 포커스 저장
                        layerPopup.config.saveBtn = $selDep2.find('> a');
                        
                        $selDep2.siblings().addClass('disabled').hide();
                        $selDep2.siblings().find('> a').addClass('disabled');
                        
                        $('.selDep2').children().find('> a').each(function() {
                            var getHref = $(this).attr('href');
                            formEvent.select.setSelected(getHref, 0);   
                        });
                    
                    // 2017.01.05 카드신청 3단계 요청한도 입력 부분 추가
                    } else if($select.hasClass('js-reqmaxselect')) {
                        if(valueTxt === '직접입력') {
                            layerPopup.config.saveBtn = null;
                        }
                    // 그 외는 클릭시 해당 셀렉트 버튼으로 포커스 이동
                    }
                    
                    layerPopup.closePopup($layerWrap);
                    
                    // 개발 관련 trigger 첫번째 인자는 클릭한 select 타겟, 두번째 인자는 클릭한 셀렉트의 index 값
                    $select.trigger('change', [$select, getSelectIndex]);
                    
                    //2017.01.02 접근성 추가
                    // $selectBtn.attr('title', '선택됨');
                    waiAccessibility.setAriaLabel({
                        target : $selectBtn,
                        type : 'button',
                        title : $layerWrap.find('.popTop').text() + ' 레이어 팝업 링크',
                        text : valueTxt + ' 선택됨 '
                    });
                };          
            });
        },
        
        /*
        * 셀렉트 옵션 값 변경 (a tag href 값 selector)
        * @param {String} id select의 선택 버튼 a태그의 href 값
        * @param {Number} index 변경할 option index 값
        * @example
        * // href값이 #sl0인 태그를 찾아 형제 요소 select의 값을 초기화
        * commonJs.select.setSelected('#sl0', 0);
        */
        setSelected : function(id, index) {
            var $btnElem = $('a[href="'+ id +'"]'),
                $select = $btnElem.next(),
                $selectOption = $select.find('option').eq(index);
                
            $btnElem.text($selectOption.text());
            $selectOption.prop('selected', true);
            
            //2017.01.02 접근성 추가
            // $selectBtn.attr('title', '선택됨');
            waiAccessibility.setAriaLabel({
                target : $btnElem,
                type : 'button',
                title : $(id).find('.popTop').text() + ' 레이어팝업 링크',
                text : $selectOption.text() + ' 선택됨 '
            });
        },
        
        /*
        * 셀렉트 옵션 값 변경 (select id selector)
        * @param {String} select id 값
        * @param oValue 변경할 option index 값
        * @example
        * // href값이 #sl0인 태그를 찾아 형제 요소 select의 값을 변경
        * commonJs.select.setSelected('#sl0', 'optionValue');
        */
        setSelectedValue : function(id, oValue) {
            var $select = $(id),
                $btnElem = $select.prev(),
                $selectOption = $select.find('option[value="'+ oValue +'"]');
                
            $btnElem.text($selectOption.text());
            $selectOption.prop('selected', true);
            
            //2017.01.02 접근성 추가
            // $selectBtn.attr('title', '선택됨');
            if($selectOption.hasClass('defaultText')) {
                waiAccessibility.setAriaLabel({
                    target : $btnElem,
                    type : 'button',
                    title : $(id).find('.popTop').text() + ' 레이어팝업 링크'
                });
            } else {
                waiAccessibility.setAriaLabel({
                    target : $btnElem,
                    type : 'button',
                    title : $(id).find('.popTop').text() + ' 레이어팝업 링크',
                    text : $selectOption.text() + ' 선택됨 '
                });         
            }
        },
        
        /*
        * 타겟 엘리먼트에 존재하는 셀렉트 옵션 값 초기화
        * @param {jQuery | HTMLElement} elem 초기화시킬 셀렉트들을 감싸는 폼
        * @example
        * // .noRevolving 내부에 존재하는 select 값 초기화
        * commonJs.selected.resetOption('.noRevolving');
        */
        resetOption : function(elem) {
            var $selectWrap = $(elem),
                $select = $selectWrap.find('.selType1 select');
                
            $select.each(function(index) {
                var $selectBtn = $(this).siblings('a.layerOpen');
                
                formEvent.select.setSelected($selectBtn.attr('href'), 0);
            });
        },
        
        /**
        * 셀렉트 옵션 추가 메서드
        * @param {String} 추가시킬 select 타겟의 id
        * @param {Object} option의 value, text
        * @param {Number | String} opts.value option value 값
        * @param {Number | String} opts.text option text 값
        * @example
        * commonJs.select.addOption('#sl0', {
            value : 0,
            text : '옵션 텍스트'
        * });
        */
        addOption : function(id, opts) {
            var opts = opts || {},
                $select = $(id),
                $btnHref = $select.siblings('.layerOpen').attr('href'),             
                $option = $('<option>', { value : opts.value || '', text : opts.text || ''}),
                $popupUl = $($btnHref).find('.selectList'),
                $li = $('<li />'),
                $a = $('<a href="#" />');
                
            $select.append($option);

            $a.text(opts.text);
            $li.append($a);
            $popupUl.append($li);
        },
        
        /*
        * select option - > layer popup으로 변경
        * @param {jQuery | HTMLElement} target 선택자
        * @param {Number} index 선택자의 index 값 ( 셀렉트의 아이디값뒤에 붙는 숫자로 사용)

        */
        setLayer : function(target, index) {
            var config = formEvent.select.config,
                id = config.id + index,
                $layerBtn = $('<a href="#" class="layerOpen" />'),
                $layerWrap = $('<div class="layerWrap" />'),
                $layerTop = $('<div class="popTop" />'),
                $layerTopTxt = $('<strong class="fs2" />'),
                $layerCont = $('<div class="popCont type2" />'),
                $layerCloseBtn = $('<span class="popClose"><a href="#">닫기</a></span>'),
                $selectUl = $('<ul class="' + config.ulClass + '" />'),
                $option = target.find('> option'),
                getTitle = $('label[for="'+ target.attr('id') +'"]').length > 0 ? $('label[for="'+ target.attr('id') +'"]').text() : target.attr('title'),
                defaultText = target.find('> option:selected') ? target.find('> option:selected').text() : target.find('> option').eq(0).text();
            
            if(target.data('type') == 'comeUp') {
                $layerWrap.addClass('comeUp');
                $layerTop.addClass('type2');
                $layerTopTxt.removeClass('fs2');
                getTitle = target.attr('title');
            };

            $layerWrap.attr('id', id);                  
            $layerBtn.attr('href', '#'+id).text(defaultText);
            $layerTopTxt.text(getTitle);

            // 첫번째 옵션 값은 디폴트 옵션이므로 두번째 옵션부터 for문 시작
            for(var i=0, len = $option.length; i< len; i++) {
                var $selectLi = $('<li />'),

                    $selectA = $('<a href="#" />'),
                    $curOption = $option.eq(i);
                
                if(!$curOption.text().match('선택')) {
                    // 2016.11.18 option에 defaultText 클래스 있을 때 팝업에 옵션 추가 x
                    if(!$curOption.hasClass('defaultText')){
                        $selectA.text($curOption.text());
                        $selectLi.append($selectA);
                        $selectUl.append($selectLi);
                        
                        // disabled일 시 셀렉트 a 엘리먼트에 클래스 추가
                        if($curOption.is(':disabled')) {
                            $selectA.addClass('disabled');
                        }                       
                    }
                }
            }
            
            $layerCont.append($selectUl);
            $layerTop.append($layerTopTxt);
            $layerWrap.append($layerTop);
            $layerWrap.append($layerCont);
            $layerWrap.append($layerCloseBtn);
                        
            // 해당 팝업이 있을 경우 내부 컨텐츠만 변경
            if($('a[href="#'+id+'"]').length > 0) {
                $('a[href="#'+id+'"]').text(defaultText);
            } else {
                target.before($layerBtn);   
            };

            if($('#'+id).length > 0) {
                $('#'+id).find('.'+config.ulClass).html($selectUl.html());
            } else {
                $('body').append($layerWrap);
            };

            // 월일 때 클래스 추가
            if(target.hasClass('col2')){
                $selectUl.addClass('col2 center');
            } else if(target.hasClass('col5')) {
                $selectUl.addClass('col5 center');
            }
            
            // 2017.01.14 접근성 추가 (getTitle 과 default 텍스트가 동일하거나 option값에 defaultText가 있을 경우 기본 label은 레이어팝업의 title 값)
            if(getTitle === defaultText || $option.filter('.defaultText').length > 0) {
                waiAccessibility.setAriaLabel({
                    target : $layerBtn,
                    type : 'button',
                    title : getTitle + ' 레이어팝업 링크'
                });         
            
            // 위의 조건문이 일치하지 않을 경우 선택된 텍스트 적용
            } else {
                // $layerBtn.attr('title', '선택됨');
                waiAccessibility.setAriaLabel({
                    target : $layerBtn,
                    type : 'button',
                    title : getTitle + ' 레이어팝업 링크',
                    text : defaultText + ' 선택됨 '
                }); 
            }

        },
        
        /**
        * 전체 셀렉트 디자인 셀렉트로 변형
        * @example
        * commonJs.select.setSelectLayer();
        */
        setSelectLayer : function() {
            var formSelect = formEvent.select,
                config = formSelect.config;     
                    
            config.target.each(function(index) {
                // selType1에 disabled 클래스가 있을 때 layerPopup 변환하지 않음
                formSelect.setLayer($(this), index);
                $(this).css('display','none');
                    
                if($(this).closest('.selType1').hasClass('disabled') || $(this).is(':disabled')){
                    $(this).parent().addClass('disabled');
                    $(this).siblings('.layerOpen').addClass('disabled');
                    $(this).prop('disabled', true);
                }
            });
            
            formEvent.select.bindEvents();
        }
    };
    
    /**
    * 2016.10.17
    * 달력 공통 팝업 년/월/일
    */
    formEvent.date = {
        init : function() {
            var config = null;
            
            formEvent.date.config = {
                $year : $('select[data-name="year"]'),
                $month : $('select[data-name="month"]'),
                $day : $('select[data-name="day"]')
            };
            
            config = formEvent.date.config;
            
            if(config.$year.length > 0) {
                config.$year.each(function(index) {
                    formEvent.date.yearSetup(index);
                });
            }
        },
        
        /**
        * 년도 setup method
        * @param {Number} index selector index
        * @param {Object} opts 옵션 객체
        * @param {Number} opts.year 기준 년도 default : 현재 년도
        * @param {Number} opts.startYear 년도 시작
        * @param {Number} opts.endYear 년도 끝
        * @public       
        */
        yearSetup : function(index, opts) {
            var config = formEvent.date.config,
                setLayer = formEvent.select.setLayer,
                date = new Date(),
                opts = opts || {},
                year = opts.year || date.getFullYear(),
                startYear = opts.startYear ? year - opts.startYear : year - 5,
                endYear = opts.endYear ? year + opts.endYear : year + 5,
                $target = config.$year.eq(index);
            
            if($target.length > 0) {
                $target.html('<option>년 선택</option>');
                for(var y=startYear; y <= endYear; y++) {
                    $target.append('<option>'+ y + '년</option>');
                }
            
                setLayer($target, $target.index('select'));     
            }
        },
        
        /**
        * 일 setup method
        * @param {Number} index selector index
        * @param {Number} maxDay 출력한 일 수 default는 27일까지
        * @public       
        */
        daySetup : function(index, maxDay) {
            var config = formEvent.date.config,
                setLayer = formEvent.select.setLayer,
                maxDay = maxDay || 27,
                $target = config.$day.eq(index);
            
            if($target.length > 0) {
                $target.html('<option>일 선택</option>');
                for(var d=1; d <= maxDay; d++) {
                    $target.append('<option value="'+ d +'">'+ d + '일</option>');
                }
            
                setLayer($target, $target.index('select'));     
            }
        },
            
        yearEnabled : function(index, sValue) {
            var config = formEvent.date.config;
            
            formEvent.date.enabled(config.$year.eq(index), sValue);         
        },

        monthEnabled : function(index, sValue) {
            var config = formEvent.date.config;
            
            formEvent.date.enabled(config.$month.eq(index), sValue);            
        },
        
        dayEnabled : function(index, sValue) {

            var config = formEvent.date.config;
            
            formEvent.date.enabled(config.$day.eq(index), sValue);          
        },      
        
        /**
        * @method enabled 특정일만 enabled를 시켜야 할 때 해당 메서드 실행
        * @param {String} sValue enable 시킬 문자열 ( ":"을 기준으로 배열 생성)
        * @public       
        * @example 
        * commonJs.dateSelect.enabled('1:3:5:7')    // 1,3,5,7일 제외한 나머지는 disabled
        */
        enabled : function(target, sValue) {
            var config = formEvent.date.config,
                getValue = sValue.toString().split(':');



            if(getValue.length > 0) {           
                var $target = target,
                    getId = $target.siblings('a').attr('href');
                
                // select option 값 disabled
                $target.find('option').prop('disabled', true);
                
                // layerPopup 버튼 disabled
                $(getId).find('.selectList > li > a').addClass('disabled');
                
                // 인자로 받은 sValue 체크하여 해당하는 값만 enabled
                for(var i=0, len=getValue.length; i< len; i++){
                    var valueIdx = getValue[i];
                    $target.find('option').eq(valueIdx).prop('disabled', false);
                    $(getId).find('.selectList > li').eq(valueIdx-1).children().removeClass('disabled');    // 달력 공통 팝업에는 선택 옵션이 없기때문에 index-1
                }
                
            }
        }
    };
    
    /*
    * 2016.10.25
    * 통합검색 추가
    * 스타샵, 쿠폰함 검색 추가
    */
    formEvent.searchBox = {
        init : function() {
            var config = null;
            
            formEvent.searchBox.config = {
                searchInput : $('.srchArea .srchInput'),
                srchLayer : $('.srchLayer'),
                dim : '.kwdDim',
                list : '.kwdList',
                deleteBtn : '.kwdDel'
            };
            
            config = formEvent.searchBox.config;
            
            // 2016.10.25 검색 폼 추가
            if(config.searchInput.length > 0) {
                formEvent.searchBox.totalSearchEvents();
            }
            
            // 2016.11.10 스타샵, 쿠폰함 검색 이벤트 추가 
            if(config.srchLayer.length > 0) {
                formEvent.searchBox.srchLayerEvents();
            }
        },
        
        /**
        * 통합검색 이벤트
        */
        totalSearchEvents : function() {
            var searchBox = formEvent.searchBox,
                config = formEvent.searchBox.config;
            
            config.searchInput.find(config.list).hide();
            
            // 초기 페이지 진입시 통합검색어 input value 값 업으면 x버튼 hide
            if(config.searchInput.find('input[type="search"]').val() === '') {
                config.searchInput.find(config.deleteBtn).hide();
            }
                    
            // 통합검색 input focus 이벤트
            config.searchInput.off('focus.searchBox');  
            config.searchInput.on('focus.searchBox', 'input[type="search"]', function() {
                if(!$(this).closest('.srchInput').hasClass('open')) {
                    $(this).closest('.srchInput').addClass('open');
                    
                    searchBox.openStyle();
                    // util.disableScroll(true);
                }
                if($(this).val().length === 0) {
                    config.searchInput.find(config.list).hide();
                    config.searchInput.find(config.deleteBtn).hide();
                } else {
                    config.searchInput.find(config.deleteBtn).show();
                }
            });
            
            // 검색어 입력시 delete 버튼 show / hide
            config.searchInput.find('> input').off('input.searchBox');
            config.searchInput.find('> input').on('input.searchBox', function() {
                var $val = $(this).val();
                if($val !== '') {
//                  config.searchInput.find(config.list).show();
                    config.searchInput.find(config.deleteBtn).show();
                } else {
                    config.searchInput.find(config.list).hide();
                    config.searchInput.find(config.deleteBtn).hide();
                }

            });
            
            // 리스트 터치시 포커스 아웃
            // 아이폰의 경우 키패드로 인해 스크롤을 막아도 막기전 높이 값만큼 스크롤이 됨
            $(document).off('touchstart.searchBoxList');
            $(document).on('touchstart.searchBoxList', '.kwdList', function() {
                config.searchInput.find('input').blur();

            });
            
            // 리스트 클릭시 검색 input 값 클릭한 텍스트로 변경
            config.searchInput.find(config.list).off('click.searchBox');
            config.searchInput.find(config.list).on('click.searchBox', 'a', function(e) {
                e.preventDefault();
                
                var getText = $(this).text();
                
                config.searchInput.find('input').val(getText);
                config.searchInput.find('input').focus();
            });
            
            
            // 통합 검색 입력 값 삭제
            $(document).off('click.searchBoxDelete');
            $(document).on('click.searchBoxDelete', config.deleteBtn, function(e) {
                e.preventDefault();
                e.stopPropagation();
                config.searchInput.find('input').val('');
                if(config.searchInput.hasClass('open')){
                    config.searchInput.find('input').focus();
                }

                config.searchInput.find(config.list).hide();
                config.searchInput.find(config.deleteBtn).hide();
                config.searchInput.find('input').focus();
                
                return false;
            });
            
            // 통합 검색 입력창 닫기
            $(document).off('click.searchBoxDim, touchstart.searchBoxDim');
            $(document).on('click.searchBoxDim, touchstart.searchBoxDim', config.dim, function() {
                config.searchInput.find('input').blur();        
                config.searchInput.removeClass('open');
                config.searchInput.find(config.list).hide();
                // util.disableScroll(false);
                $(this).hide();
                searchBox.closeStyle();
                return false;
            });
        },
        
        /**
        * 스타샵, 쿠폰함 이벤트
        */
        srchLayerEvents : function() {
            var searchBox = formEvent.searchBox,
                config = formEvent.searchBox.config;
        
            // 스타샵 검색
            $(document).off('click.bnSearchBtn');
            $(document).on('click.bnSearchBtn', '.btnSrch', function() {
                var $layer = $('.srchLayer');
                
                if($layer.hasClass('open')){ return false; }
                $layer.addClass('open').show();
                layerPopup.createDim(0);
                $('.dim').css({
                    position: 'absolute',
                    zIndex: 90
                });
                    
                $('.dim').one('click', function() {
                    $layer.removeClass('open').hide();
                    layerPopup.removeDim(0);
                    $layer.find('> input[type="text"]').blur(); 
                    searchBox.closeStyle();                 
                });
                searchBox.openStyle();
                $layer.find('> input[type="text"]').focus();                
            });
                    
            // 2016.11.10 스타샵, 쿠폰 검색 추가
            config.srchLayer.off('focus.searchBoxFocus');
            config.srchLayer.on('focus.searchBoxFocus', 'input[type="text"]', function() {
                if($(this).val().length === 0) {
                    config.srchLayer.find(config.deleteBtn).hide();
                } else {
                    config.srchLayer.find(config.deleteBtn).show();
                }
            });     
            
            // 검색어 입력시 delete 버튼 show / hide
            config.srchLayer.find('> input').off('input.searchBoxInput');
            config.srchLayer.find('> input').on('input.searchBoxInput', function() {
                var $val = $(this).val();
                
                if($val !== '') {
                    config.srchLayer.find(config.deleteBtn).show();
                } else {
                    config.srchLayer.find(config.deleteBtn).hide();
                }
            }); 
            
            // 검색 input 초기화
            config.srchLayer.find(config.deleteBtn).off('click.searchBoxDelete')
            config.srchLayer.find(config.deleteBtn).on('click.searchBoxDelete', function(e) {
                e.preventDefault();
                config.srchLayer.find('input[type="text"]').val('');
                config.srchLayer.find(config.deleteBtn).hide();
                config.srchLayer.find('input[type="text"]').focus();
                
            });
        },
        
        /**
        * 특정 기기에서 fixed된 엘리먼트들 키패드가 올라올 때 ui 깨지는 현상 발생
        * 검색어 input focus시 화면 상단으로 이동 후 position: 'relative'로 키패드 올라올 때 깨지는 현상 방지 focus out시 원래 위치로 이동
        */
        openStyle : function() {
            ns.global.getScrollTop();
            var $topHead = $('.topHead').filter(':visible'),
                $fixItem = $('.fixItem').filter(':visible'),
                $backBtn = $('.backBtn').filter(':visible'),
                $wrap = $('#Wrap').filter(':visible'),
                $container = $('.container').filter(':visible'),
                $kwdDim = $('.kwdDim');
            
            if($topHead.length > 0) {
                $topHead.css('position', 'relative');
            }
            
            if($container.length > 0) {
                $container.css({
                    marginTop : '-1px',         // margin-top을 -1을 주는 이유는 fixed 엘리먼트가 relative로 상단 고정되면서 topHead의 border의 영향으로 1px가 밀림
                    paddingTop : 0
                });
            }
            
            if($fixItem.length > 0) {
                $fixItem.css({
                    position: 'relative',
                    top: 0
                });
            }
            
            if($backBtn.length > 0){
                $backBtn.css({
                    position: 'absolute'
                });
            }
            
            if($kwdDim.length > 0) {
                // kwdDim이 검색창 태그 내부에 있을 경우 #Wrap 바로 하위로 이동
                if($kwdDim.parent().attr('id') !== '#Wrap'){
                    $wrap.append($kwdDim);
                }
                $kwdDim.css({
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    height: ns.global.bh+'px',
                    background: '#000',
                    opacity: '0.3',
                    zIndex: 1
                });
            }
            
            $wrap.addClass('fixFixed').css({
                position: 'relative',
                height: ns.global.bh+'px',
                overflow: 'hidden'
            });
            $(window).scrollTop(0);
        },
        
        /**
        * 특정 기기에서 fixed된 엘리먼트들 키패드가 올라올 때 ui 깨지는 현상 발생
        * 검색어 input focus시 화면 상단으로 이동 후 position: 'relative'로 키패드 올라올 때 깨지는 현상 방지 focus out시 원래 위치로 이동
        */
        closeStyle : function() {
            var $topHead = $('.topHead'),
                $fixItem = $('.fixItem'),
                $backBtn = $('.backBtn'),
                $container = $('.container').filter(':visible'),
                $wrap = $('#Wrap');

            $wrap.removeClass('fixFixed').removeAttr('style');      
            if($topHead.length > 0) {       
                $topHead.removeAttr('style');
            }
            
            if($container.length > 0) {
                $container.css('margin-top', 0);
            }
            
            if($backBtn.length > 0) {
                $backBtn.css('position', 'fixed');
            }
            common.fixedSetup();
            ns.global.setScrollTop();           
        }
    };
    
    /**************************************
    * Tabs (콘텐츠 show / hide) class=".tabJs"
    * 버튼 href, 콘텐츠 id 매칭하여 show/hide
    * 전체 show 추가 #tabAll
    **************************************/
    tabs = {
        init : function() {
            var config = null;
            
            tabs.config = {
                target : '.tabJs',
                tabList : '.tabList',
                content : '.tabCont',
                currentClass : 'on'
            };
            
            config = tabs.config;
            
            if(config.target.length > 0) {
                tabs.setup();
            }
        },
        
        setup : function() {
            var config = tabs.config;
            
            if(!$(config.target).length) { return; }
            $(config.target).each(function() {
                var $li = $(this).find('li'),
                    $target = $li.filter('.on'),
                    index = $target.index(),
                    // getHref = index === -1 ? $li.eq(0).addClass('on').find('a').attr('href') : $target.find('a').attr('href'),       // on을 가지고 있는 li가 없을 경우 첫번째 li 활성화
                    // 2016.11.11 tabJs에 class="on"이 없을 경우 콘텐츠 노출 x
                    getHref = $target.find('a').attr('href'),
                    $tabCont = $(this).closest(config.tabList).siblings(config.content);
                
                // 2017.01.02 접근성 추가
                $target.find('> a').attr('title', '선택됨');
                
                if(getHref === '#tabAll') {
                    $tabCont.show();
                } else {
                    $tabCont.hide();
                    $(getHref).show();
                }

                //뉴타입 레이아웃 설정
                if($(this).hasClass('newType')) {
                    var $left = $target.position().left + $target.find('a').position().left,
                        $width = $target.find('a').outerWidth(),
                        $margin = parseInt($target.css('margin-left'));
                        
                    $(this).closest('.tabList').find('.bar').remove();

                    if($(this).closest('.tabList').find('.bar').length < 1) {
                        if($(this).innerWidth() <= $(this).closest('.tabList').innerWidth()) {
                            $(this).closest('.tabList').append('<span class="bar"></span>');
                        } else {
                            $(this).append('<span class="bar"></span>');
                        }
                    };
                    $(this).closest('.tabList').find('.bar').css({width: $width, webkitTransform: 'translate3d(' + ($left + $margin) + 'px, 0, 0)', transition: 'none'});
                }
                
            });
            // config.target.closest(config.tabList).siblings(config.content).hide();
            // $(config.target.find('> .on a').attr('href')).show();
            
            tabs.bindEvents();
        },
        
        bindEvents : function() {
            var config = tabs.config,
                $btn = $(config.target).find('a');

            $(document).off('click.tabs');  
            $(document).on('click.tabs', '.tabJs a', function(e) {
                e.preventDefault();

                // form Tabs가 아닐 때 실행
                if($(this).parent().hasClass('formWrap')) {
                    return false;
                }
                
                var $thisTab = $(this).closest('.tabJs'),
                    $thisLi = $(this).parent(),
                    $tabLi = $thisLi.siblings(),
                    getHref = $(this).attr('href'),
                    $tabList = $(this).closest('.tabList'),
                    $tabCont = $tabList.siblings(config.contents),
                    $swipeTabCont = $tabList.siblings('.swipeTabCont'),
                    $thisCont = $(getHref),
                    $bar = $(this).closest('.tabList').find('.bar');
                
                if($thisLi.hasClass('disabled')) {
                    return false;
                }

                // 2016.11.11 접근성 타이틀 추가
                $(this).attr('title', '선택됨');
                $tabLi.find('> a').removeAttr('title');
                
                /*
                * 2016.10.25 
                * swipeTabCont로 묶여 있지 않을 때 tabJs 기능 실행
                * 
                */
                if(!$swipeTabCont.length > 0) {
                    // 2016.10.25 통합검색 (CM_7P.1T.html) - 
                    if($tabCont.length > 0) {
    
                        $tabLi.removeClass(config.currentClass);
                        $thisLi.addClass(config.currentClass);
                        
                        if($thisCont.is(':hidden') || !$thisCont.length) {
                            
                            if(getHref === '#tabAll') {
                                $tabCont.show();
                            } else {
                                $tabCont.hide();
                                $thisCont.show();
                            }
                            
                            // 탭 클릭시 탭 높이로 이동
                            // util.contentsTop($(this).closest('.tabBox'));
                            
                            // 2017.01.05
                            waiAccessibility.goFocus($thisCont);
                        }
                    }
                
                    // 토글 뷰 안에 tabJs 있는 경우 scrollTop 기능 x
                    if($(this).closest('.tabList').css('position') === 'fixed'){
                        util.scrollTop();
                    }
                    
                    /*
                    * 2016.10.19
                    * tabCont안에 swiper가 있을 경우 해당 탭 실행 시 swiper.refresh
                    */
                    if($thisCont.find('.tabDep1').length > 0) {
                        swipers.tab.tabSetup($thisCont.find('.tabDep1'));
                        swipers.refresh($thisCont.find('.tabDep1'));
                    }
                    
                    /*
                    * 2016.11.08
                    * tabCont안에 bannerBox가 있을 경우 해당 탭 실행 시 swiper.refresh
                    */
                    if($thisCont.find('.bannerBox > ul').length > 0) {
                        swipers.refresh($thisCont.find('.bannerBox > ul'));
                    }
                    
                    // 2016.11.29
                    if($thisCont.find('> .tabBox > .tabList > .tabJs').length > 0) {
                        swipers.currentTo($thisCont.find('> .tabBox > .tabList > .tabJs'), 0);
                        $thisCont.find('> .tabBox > .tabList > .tabJs').children().eq(0).find('> a').trigger('click');
                    }
                    
                    /* 
                    * 2016.12.02
                    * 카드 상세(플래티넘) 주요 혜택
                    * tabJs 내부에 toggleList가 있을 때 accordion bind check
                    */
                    if($thisCont.find('.toggleList').length > 0) {
                        arcodians.defaultToggle.init();
                    }
                    
                    /*
                    * tabJs에 swipe 기능이 들어 있을 경우
                    * swipe메뉴 셀렉트
                    */
                    if($thisTab.data('swiper')) {
                        swipers.slideTo($thisTab, $thisLi.index());
                    }
                    
                    // 앱 로그인페이지 이벤트 전체보기 (로그인 종류에 따른 탭 높이 변화로인해 탭 클릭시마다 사이즈 재지정)
                    if($('.eventArea').length > 0) {
                        setTimeout(function() {
                            arcodians.eventAll.setup();
                        }, 50);
                    }

                    //새로운 바 타입
                    if($bar.length > 0) {
                        var $left = $thisLi.position().left + $thisLi.find('a').position().left,
                            $width = $thisLi.find('a').outerWidth(),
                            $margin = parseInt($thisLi.css('margin-left')),
                            $ulPosition = $thisTab[0].style['transform'] == undefined ? Number($thisTab[0].style['-webkit-transform'].slice(12).split('px')[0]) : Number($thisTab[0].style['transform'].slice(12).split('px')[0]);

                        if($bar.closest('.tabDep1').length > 0) $ulPosition = 0;
                        $bar.css({width: $width, webkitTransform: 'translate3d(' + ($left + $margin + $ulPosition) + 'px, 0, 0)', transition: 'all 300ms ease-out'});
                    }
                    
                    /*
                    * 2016.12.02
                    * fixedBArea 버튼 위치 재정의 (신속카드 발급조회)
                    */
                    // common.centerAlign();
                    common.fixedBtnScroll();
                }
                
                // 개발 관련 이벤트
                $thisTab.trigger("change", [$thisLi, $thisLi.index()]);

            });
        
        }
    };
    
    /**************************************
    * 스와이프 공통 객체
    * - 스와이프 애니메이션 실행되는 부분 공통으로 스와이프 완료 시 타겟으로 trigger 이벤트 실행
    * - change 이벤트 타겟은 각각 해당 객체 안의 config.target
    ***************************************/
    swipers = {
        init : function() {
            swipers.defaults.init();
            swipers.banner.init();
            swipers.cardList.init();
            swipers.tab.init();
            swipers.cardAppReport.init();
            swipers.cont.init();
        },
        
        /**
        * target의 저장된 data를 가져옵니다.
        * @param {jQuery | HTMLElement} target swiper selector
        */
        getSwiper : function(target) {
            var $target = $(target);
            
            if($target.data('swiper')) {
                return $target.data('swiper');
            }
            
            return false;
        },
        
        /**
        * target의 swiper를 refresh 합니다.
        * @param {jQuery | HTMLElement} target swiper selector
        */
        refresh : function(target) {
            var getSwiper = swipers.getSwiper(target);
            
            if(getSwiper) {
                getSwiper.refresh();
            }
        },
        
        /**
        * target의 swiper의 위치 값을 변경합니다.(애니메이션 x)
        * @param {jQuery | HTMLElement} target swiper selector
        * @param {Number} index 변경할 index 값
        */
        currentTo : function(target, index) {
            var getSwiper = swipers.getSwiper(target);
            
            if(getSwiper) {
                getSwiper.currentTo(index);
            }
        },
        
        /**
        * target의 swiper의 위치 값을 변경합니다.(애니메이션 o)
        * @param {jQuery | HTMLElement} target swiper selector
        * @param {Number} index 변경할 index 값
        */
        slideTo : function(target, index) {
            var getSwiper = swipers.getSwiper(target);
            
            if(getSwiper) {
                getSwiper.slideTo(index);
            }
        },
        /**
        * target의 swiper의 위치 값을 변경합니다.(위치값만 변경)
        * @param {jQuery | HTMLElement} target swiper selector
        * @param {Number} index 변경할 index 값     
        */
        moveTo : function(target, index) {
            var getSwiper = swipers.getSwiper(target);
            
            if(getSwiper) {
                getSwiper.moveTo(index);
            }
        },
        
        /**
        * target의 현재 index값을 가져옵니다.
        * @param {jQuery | HTMLElement} target 스와이프 셀렉터
        */
        getCurrentIndex : function(target) {
            var getSwiper = swipers.getSwiper(target);
            
            if(getSwiper) {
                return getSwiper.getCurrentIndex();
            } else {
                return -1;
            }
        },
        
        reInit : function(target) {
            var getSwiper = swipers.getSwiper(target);
            if(getSwiper) {
                return getSwiper.reInit();
            }
        }
    };
    
    /*
    * 기본 스와이프 탭
    * free mode를 지원
    */
    swipers.defaults = {
        init : function() {
            var config = null;
            
            swipers.defaults.config = {
                target : $('.swipeTab')
            };
            
            config = swipers.defaults.config;
            
            if(config.target.length > 0) {
                
                swipers.defaults.$target = util.eachFunc(config.target, $.fn.commonSwiper, {
                    freeMode : true,
                    onInit : function(swiper) {                                             
                        swipers.defaults.todayBox.init(swiper); 
                        
                        waiAccessibility.setFreeModeSwipeAriaHidden(swiper);            
                    },
                    
                    // 2017.01.14 접근성 추가 ( 보이는 영역만 포커스 )
                    onAfterChange : function(swiper, idx) {
                        waiAccessibility.setFreeModeSwipeAriaHidden(swiper);
                    },
                    
                    onResize : function(swiper) {
                        swipers.defaults.todayBox.refresh();
                    }
                });

            }
        }
    };  
    
    /**
    * 이벤트 today list (BN_3.2T.1.html)
    * 스와이프 처음, 끝부분에서 다시 스와이프시 날짜 list에 추가
    */
    swipers.defaults.todayBox = {
        init : function(swiper) {
            var config = null;
            swipers.defaults.todayBox.config = {
                daySwiper : swiper,                 // todayBox swiper options              
                target : $('.todayBox'),
                eventDay : '.eventDay',
                swipeClass : '.swipeTab',
                
                minDate : $('#firstDay').val(),
                maxDate : $('#lastDay').val()
            };
            
            config = swipers.defaults.todayBox.config;
            
            if(config.target.length > 0) {              
                var getEventDate = swipers.defaults.todayBox.getEventDay(),
                    $todayTarget = config.target.find(config.swipeClass);
                
                /* 
                * todayBox swipeTab option 재정의
                */
                config.daySwiper.settings.bounce = true;
                config.daySwiper.settings.currentIndex = parseInt(getEventDate[2], 10) - 1;
                config.daySwiper.settings.currentClass = 'focus';
                
                config.daySwiper.settings.onTouchMove = function(swiper) {
                    swipers.defaults.todayBox.offsetCheckEventDay();
                    waiAccessibility.setFreeModeSwipeAriaHidden(swiper);
                };
                config.daySwiper.settings.onCheckStart = function(swiper) {
//                  alert('prevLoad');
                    swipers.defaults.todayBox.addList('prev');
                };
                config.daySwiper.settings.onCheckEnd = function(swiper) {
//                  alert('nextLoad');
                    swipers.defaults.todayBox.addList('next');
                };              
                            
                // 2017.01.14 접근성 추가 ( 보이는 영역만 포커스 )
                config.daySwiper.settings.onRefresh = function(swiper) {                                                                    
                    waiAccessibility.setFreeModeSwipeAriaHidden(swiper);
                };
                
                // End swipers.defaults options
                swipers.defaults.todayBox.boxSetup();

                // 여기에 date list 뿌리기
                swipers.defaults.todayBox.createList({
                    year : parseInt(getEventDate[0], 10),
                    month : parseInt(getEventDate[1], 10)
                });

                // 리스트에 date 값 set
                swipers.defaults.todayBox.setEventDate();
                
                // 2017.01.04 접근성 추가 (현재 선택된 날짜 이전으로는 포커스 이동 막기)
                setTimeout(function() {

                    swipers.refresh($todayTarget);
                }, 0);
            }
        },
        
        /**
        * todayBox의 가로 값을 재정의
        */
        refresh : function() {
            var todayBox = swipers.defaults.todayBox,
                config = swipers.defaults.todayBox.config;
                        
            if(config.target.length > 0) {
                todayBox.boxSetup();
            }
        },
        
        /**
        * todayBox width 값 설정
        */
        boxSetup : function() {

            var todayBox = swipers.defaults.todayBox,
                config = todayBox.config,
                wrapWidth = config.target.innerWidth(),
                btnWidth = 0,
                resultWidth = 0;
            
            config.btn = config.target.find('a.today');
            config.list = config.target.find(' > .inner').length > 0 ? config.target.find(' > .inner') : config.target.find(' > form > .inner'); // form은 개발용
            
            btnWidth = config.btn.outerWidth() + parseInt(config.btn.css('margin-left'), 10) + parseInt(config.btn.css('margin-right'), 10) +4;
            
            resultWidth = wrapWidth - btnWidth;
                        
            config.list.css('width', resultWidth + 'px');
        },
        
        /*
        * 2016.11.30
        * getEventDay
        */
        getEventDay : function() {
            var todayBox = swipers.defaults.todayBox,
                getEventDate = $('.eventDay').text(),
                year, month, day;
            
            if(getEventDate !== ''){
                getEventDate = getEventDate.split('.');
                year = getEventDate[0];
                month = getEventDate[1];
                day = getEventDate[2];
                
                return [year, month, day];
            } else {
                year =  todayBox.getToDay()[0];
                month = todayBox.getToDay()[1];
                day =   todayBox.getToDay()[2];
            }
            
            return [year, month, day];
        },
        
        /*
        * today List 생성
        * @param {Object} obts swipers.defaults.todayBox.getToDay의 Today갑을 받아오는 옵션
        * @param {Number} opts.year 생성시킬 리스트의 년도 값 설정
        * @param {Number} opts.month 생성시킬 리스트의 월 값 설정
        * @example
        * // 2015년 10월 1일 ~ 마지막 일까지 계산하여 리스트 생성
        * swipers.defaults.todayBox.createList({
        *     year : 2015,
        *     month : 10
        * });
        */
        createList : function(opts, handle) {
            var todayBox = swipers.defaults.todayBox,
                config = todayBox.config,
                
                getMinDate = config.minDate,
                getMaxDate = config.maxDate,
                
                getToday = todayBox.getToDay(opts),                         // get date
                year = getToday[0],                                         // 년
                month = getToday[1],                                            // 월                                        // 일
                weekNames = ['SUN','MON','TUE','WED','THU','FRI','SAT'],
                last = [31,28,31,30,31,30,31,31,30,31,30,31],
                lastDay,                                                    // 월 마지막 일 저장
                convertDate,                                                // 받아온 날짜 Date 변환 후 저장
                getDayName,                                                 // 요일 저장
                $ul = $('<ul />'),
                $li, $a, $month, $day,
                i, forDay,
                minDate,
                maxDate,
                dayCheck,
                checkDate;
            
            // 윤년 계산
            if((year%4 === 0 && year%100!=0) || year%400 === 0) {
                last[1] = 29;
            }
             
            // 마지막일 구하기
            lastDay = last[parseInt(month, 10) - 1];
            for(i = 0; i < lastDay; i++) {
                $li = $('<li />');
                $a = $('<a href="#" />');
                $month = $('<span class="month" />');
                $day = $('<span class="day" />');
                forDay = i + 1;
                convertDate = new Date(parseInt('20' + year, 10), month-1, forDay);
                getDayName = weekNames[convertDate.getDay()];
                
                $month.text(getDayName);

                $day.text(forDay);
                
                $a.append($month);
                $a.append($day);
                waiAccessibility.setAriaLabel({
                    target : $a,
                    type : 'button',
                    text : $month.text() + ' ' + $day.text()
                });
                
                $li.append($a);
                
                if(parseInt(year, 10) < 10) { year = '0' + parseInt(year, 10); }
                if(parseInt(month, 10) < 10) { month = '0' + parseInt(month, 10); }
                if(parseInt(forDay, 10) < 10) { forDay = '0' + parseInt(forDay, 10); }
                
                $li.attr('data-ymd', year+'.'+month+'.'+forDay);
                
                checkDate = ['20'+year, month, forDay].join('');
                
                // if((year < getMinDate[0] || year > getMaxDate[0]) && (month < getMinDate[1] || month > getMaxDate[1]) && (day < getMinDate[2] || day > getMaxDate[2])) {             
                if(parseInt(getMinDate, 10) > parseInt(checkDate, 10) || parseInt(checkDate, 10) > parseInt(getMaxDate, 10)) {
                    $a.addClass('disabled').css('color', 'gray');
                }
                // 2016.10.20 년 월일 체크하여 disabled 넣기
                $ul.append($li);
            }
            
            $ul.children().eq(0).attr('data-eq','first');
            $ul.children().eq(lastDay-1).attr('data-eq','last');
            
            if(handle === 'prev') {
                config.daySwiper.target.prepend($ul.html());
            } else {
                config.daySwiper.target.append($ul.html());
            }

        },              
        
        /**
        * swipeTab의 left 값을 체크하여 해당하는 년/월을 .eventDay 텍스트로 뿌려줌
        */
        offsetCheckEventDay : function() {
            var config = swipers.defaults.todayBox.config;
            
            config.daySwiper.target.find('> li[data-eq="first"]').each(function(index) {
                var $lastLi = $('li[data-eq="last"]').eq(index),
                    positionLeft = $(this).position().left,
                    positionWidth = positionLeft + ($lastLi.position().left + $lastLi.width()),
                    dataYMD = null,
                    eventDay = null;
                
                // console.log(config.daySwiper.moveValue);

                // console.log(positionLeft, Math.abs(config.daySwiper.moveValue), Math.abs(positionWidth));
                if(Math.abs(config.daySwiper.moveValue) > positionLeft && Math.abs(config.daySwiper.moveValue) < Math.abs(positionWidth)){
                    eventDay = $('.eventDay').text().split('.');
                    dataYMD = $(this).attr('data-ymd').split('.');
                    eventDay[0] = dataYMD[0];
                    eventDay[1] = dataYMD[1];

                    $('.eventDay').text(eventDay.join('.'));
                }
            });     
        },
        
        /*
        * today 값을 받아옴
        * @param {Object} opt date 옵션 값
        * return [year, month, day]
        */  
        getToDay : function(opts) {
            
            var date = new Date(),
                
                opts = opts || {},
                year = parseInt(opts.year, 10) || date.getFullYear().toString().substring(2, 4),
                month = parseInt(opts.month, 10) || date.getMonth()+1,
                day = parseInt(opts.day, 10) || date.getDate();
            
            if(parseInt(year, 10) < 10) { year = '0' + parseInt(year, 10); }
            if(parseInt(month, 10) < 10) { month = '0' + parseInt(month, 10); }
            if(parseInt(day, 10) < 10) { day = '0' + parseInt(day, 10); }
            
            return [year, month, day];
        },
        
        /*
        * eventDay 텍스트 변경
        * @param {Number} day 선택한 날짜. 없으면 현재 일 입력
        */
        setEventDate : function(getData) {
            var todayBox = swipers.defaults.todayBox,
                config = todayBox.config,
                getDataYMD = getData || todayBox.getEventDay().join('.');
                
            $(config.eventDay).text(getDataYMD);
        },
        
        /**
        * today List에 day 리스트 추가
        * @param {String} handle prev일 때는 전달 day 리스트 추가 next일 땐 다음달 day 리스트 추가
        */
        addList : function(handle) {
            var todayBox = swipers.defaults.todayBox,
                config = todayBox.config,
                $getList = config.daySwiper.target.children(),
                $target = null,
                getDataYMD = null,
                year, month;

            if(handle === 'prev') {
                $target = $getList.eq(0);
                getDataYMD = $target.attr('data-ymd').split('.');
                year = parseInt(getDataYMD[0], 10);
                month = parseInt(getDataYMD[1], 10) - 1;
                
                // 월이 1보다 작아지는 경우 12로 재설정후 년도 -1
                if(month < 1) {
                    year = year - 1;
                    month = 12;
                }
            } else if( handle === 'next') {
                $target = $getList.eq($getList.length - 1);
                getDataYMD = $target.attr('data-ymd').split('.');
                year = parseInt(getDataYMD[0], 10);
                month = parseInt(getDataYMD[1], 10) + 1;
                
                // 월이 12보다 클경우 1로 재설정후 년도 + 1
                if (month > 12) {
                    year = year + 1;
                    month = 1;
                }                           
            }

            // 방향에 따라 리스트 생성
            todayBox.createList({
                year : year,
                month : month
            }, handle);
            
            config.daySwiper.settings.currentIndex = config.target.find('.focus').index();      
            config.daySwiper.target.refresh();
            
            if(handle === 'prev') {
                config.daySwiper.target.setMoveCSS(-Math.round($target.position().left));
            }
        },
        

        /*
        * 반짝할인 date swipeTab 이동
        * @param {Number} index 선택한 index값
        */
        slideTo : function(index) {
            var todayBox = swipers.defaults.todayBox,
                config = todayBox.config,
                swipeTab = config.daySwiper.target;

            swipers.defaults.$target[swipeTab.index(config.swipeClass)].slideTo(index);
        }
        
    }
    
        
    /*
    * 배너 스와이프
    */
    swipers.banner = {

        init : function() {
            var config = null;
            
            swipers.banner.config = {
                target : $('.bannerBox > ul')
            };
            
            config = swipers.banner.config;
            
            if(config.target.length > 0) {
                swipers.banner.$target = util.eachFunc(config.target, $.fn.commonSwiper, {
                    paging: true,
                    pagingClass: '> div',
                    onInit : function(swiper) {
                        
                        // 2017.01.09 접근성 추가
                        waiAccessibility.setSwipeNavigationButton({
                            target : swiper.wrap,
                            
                            prevButton : {
                                text : '이전',
                                class : 'btnPrev'
                            },
                            
                            nextButton : {
                                text : '다음',
                                class : 'btnNext'
                            }
                        });                 
                    }
                });
            }
        }
    };
    
    /*
    * 카드 리스트
    */
    swipers.cardList = {
        init : function() {
            var config = null;
            
            swipers.cardList.config = {
                target : $('.cardList .cardBox > ul, .tagList ul')
            };
            
            config = swipers.cardList.config;
            
            if(config.target.length > 0) {
                swipers.cardList.$target = util.eachFunc(config.target, $.fn.commonSwiper, {
                    freeMode : true,
                    onInit : function(swiper) {
                        // 2017.01.09 접근성 추가
                        waiAccessibility.setSwipeNavigationButton({
                            target : swiper.wrap,
                            prevButton : {
                                class : 'btnPrev',                              
                                text : '이전'
                            },
                            nextButton : {
                                class : 'btnNext',
                                text : '다음'
                            }
                        });
                    },
                    onRefresh : function(swiper) {
                        swipers.reInit(swiper.target);
                    }
                });
            }
        }
    };
    
    /*
    * 카드 앱 리스트 (버튼 & 페이지 텍스트)
    * 카드안내/신청
    */
    swipers.cardAppReport = {
        init : function() {
            var config = null;
            
            swipers.cardAppReport.config = {
                target : $('.cardAppReport > div > ul')
            };
            
            config = swipers.cardAppReport.config;
            
            if(config.target.length > 0) {
                swipers.cardAppReport.$target = util.eachFunc(config.target, $.fn.commonSwiper, {
                    freeMode : false,
                    variableWidth: false,   
                    customWrap : '.cardAppReport',

                    paging: true,
                    pagingClass : '.paging',
                    onInit : function(swiper) {
                        
                        // 2017.01.09 접근성 추가
                        waiAccessibility.setSwipeNavigationButton({
                            target : swiper.wrap,
                            prevButton : {
                                class : 'btnPrev',                              
                                text : '이전'
                            },
                            nextButton : {
                                class : 'btnNext',
                                text : '다음'
                            }
                        });
                    }
                });
            }
        }       

    }
    
    /*
    * TabDep1 스와이프 ( 길이따라 리스트 비율 적용 )
    */
    swipers.tab = {
        init : function() {
            var config = null;
            
            swipers.tab.config = {
                target : $('.tabDep1')
            };
            
            config = swipers.tab.config;
            
            if(config.target.length > 0) {
                
                swipers.tab.$target = util.eachFunc(config.target, $.fn.commonSwiper, {
                    freeMode : true,
                    centerMode : true,
                    
                    onInit : function(swiper) {     
                        swipers.tab.tabSetup(swiper.target);
                    },
                    
                    onClick : function(e, swipe) {
                        
                        // 2016.11.11 접근성 타이틀 추가
                        $(e.target).attr('title', '선택됨');
                        $(e.target).parent().siblings().find('> a').removeAttr('title');
                    },
                    
                    onResize : function(swipe) {
                        swipers.tab.tabSetup(swipe.target);
                    }
                });
                        
            }
        },
        
        /*
        * 탭 리스트 길이가 부모 길이보다 작을 경우 % 맞춰서 정렬
        * TODO 탭 개수에 따른 정렬 보수 필요.
        * newType인 경우 탭 리스트 길이에 따라 그대로 정렬
        */
        tabSetup : function(elem) {
            var tab = $(elem),
                tabHeight = 0,
                tabLi = tab.children(),
                tabWrap = tab.parent(),
                tabWrapWidth = parseInt(tabWrap.innerWidth(), 10),
                equalWidth = (tabWrapWidth / tabLi.length) / tabWrapWidth * 100,
                widthCheck = 0,
                heightCheck = 0,
                sum = 0;
            
            tab.css('width', '100%');
            tab.css('height', 'auto');

            if(!tab.hasClass('newType')) {

                // 초기 세팅은 같은 비율 정렬
                tabLi.attr('style', 'width: ' + (Math.floor(equalWidth*100)/100) + '% !important');

                // 비율 정렬 후 높이 값 저장
                tabHeight = parseInt(tab.height(), 10);

                /*
                * tab의 높이가 55(한줄 고정높이값)보다 클 경우 탭 리스트의 가로 값 재설정
                * tabDep1 높이값 수정시 "tabDep1 높이" 검색해서 같이 수정
                * 폰트 사이즈 변경시 해당 탭 높이 재설정 필요?
                */
                if(tabHeight > 55) {
                    tabLi.attr('style', 'width: auto !important');
                    
                    tabLi.each(function() {
                        var itemWidth = $(this).width()+14;
                        $(this).attr('style', 'width: ' + itemWidth + 'px !important');
                        sum += itemWidth;

                    });
                    
                    // 탭의 가로 길이보다 리스트의 총 가로값이 작을 경우 %로 변경
                    if(tabWrapWidth >= sum) {
                        tabLi.each(function() {
                            var itemWidth = $(this).width() / sum * 100;
                            $(this).attr('style', 'width: ' + (Math.floor(itemWidth*100)/100) + '% !important');    
                        });
                    }
                    
                }

            } else {
                if(tabWrap.parents('.contArea').length > 0) {
                    tabWrap.css({padding: '0 16px'});
                };

                tabLi.each(function() {
                    if($(this).outerHeight() > 50) {
                        tabLi.attr('style', 'width: auto!important').css({marginLeft: 8});
                    };
                });
            }
        }
    };
    

    /*
    * Content 스와이프 (페이징 적용)
    */
    swipers.cont = {
        init : function() {
            var config = null;
            
            swipers.cont.config = {
                target : $('.swiperCon > ul')
            };
            
            config = swipers.cont.config;
            
            if(config.target.length > 0) {
                // 2016.12.17 안드로이드 앱에서 플리킹 겹침으로 인해 플러스O2O 이전 다음버튼 추가
                var $plusSwiper = config.target,
                    $plusWrap = $plusSwiper.parent();
                    
                if($plusSwiper.hasClass('plusBanner')) {
                    $plusWrap.addClass('plusBinner');
                    if(!$plusWrap.find('.btnNrev').length) {
                        $plusSwiper.after('<a href="#" class="btnNext"><span class="hidden">다음</span></a>');
                    }                   
                    if(!$plusWrap.find('.btnPrev').length) {
                        $plusSwiper.after('<a href="#" class="btnPrev"><span class="hidden">이전</span></a>');
                    }
                }
                //End 2016.12.17
                swipers.cont.$target = util.eachFunc(config.target, $.fn.commonSwiper, {
                    freeMode : false,
                    variableWidth : false,
                    autoHeight: true,
                    paging : true,
                    pagingClass : '.paging',
                    onInit : function(swiper) {
                        swiper.target.css('width', '100%');
                        
                        // type2 클래스가 있을 때는 클론 모드 false
                        if(swiper.wrap.hasClass('type2') || swiper.wrap.closest('.etcService').length > 0) {
                            swiper.settings.infinite = false;
                        }
                        
                        /*
                        * 2016.11.17
                        * vip 서비스 (BN_8.4.html) 추가
                        */
                        if(swiper.wrap.closest('.vipCard_Intro').length > 0) {
                            $('.vipCont.swiperCon > ul').children().each(function(index) {
                                var getTitle = swiper.list.eq(index).find('strong > span').text();
                                $(this).find('dt.hidden').text(getTitle);
                            });
                        }
                        if(swiper.wrap.hasClass('vipCont')) {
                            swiper.settings.infinite = false;
                            //swiper.settings.useTouch = false;
                        }
                        // End 2016.11.17
                        
                        /*
                        * 혜택 > 프라임서비스 레이어팝업(BN_8.1.2T.2T.html)
                        * 레이어 팝업 내부 스와이프 옵션 변경
                        */
                        if(swiper.wrap.closest('.layerWrap').length > 0 && swiper.wrap.closest('.layerWrap').attr('id') !== '' && swiper.wrap.closest('.layerWrap').attr('id').match('primeLayer')) {
                            swiper.settings.numberText = true;
                            swiper.settings.arrows = true;
                            swiper.settings.infinite = false;
                            swiper.settings.onBeforeChange = function(swiper, old, newIdx) {
                                var $title = swiper.list.eq(newIdx).find('.travelCont > h2.hidden').length > 0 ? swiper.list.eq(newIdx).find('.travelCont > h2.hidden') : swiper.list.eq(newIdx).find('.navTit'),
                                    getTitle = $title.text();
                                util.scrollTop(swiper.wrap.parent());
                                swiper.wrap.find('.layerNav > .tit').text(getTitle);
                            };
                            
                            /*
                            * 2017.01.07 접근성 추가 (헤택, 카드상세 레이어팝업 슬라이드 작동시 navTit로 포커스 이동)
                            */
                            swiper.settings.autoFocus = false;
                            swiper.settings.onAfterChange = function(swiper, newIdx) {
                                var $navTit = $('.layerNav').filter(':visible').find('.tit');
                                
                                    $navTit.attr('tabindex', '0');
                                    $navTit.css('outline', 'none');
                                    
                                    $navTit.focus();
                                    $navTit.off('focusout.goFocus');
                                    $navTit.on('focusout.goFocus', function() {
                                        $(this).removeAttr('tabindex');
                                    });
                                
                            };
                            
                            var $initTitle = swiper.list.eq(swiper.settings.currentIndex).find('.travelCont > h2.hidden').length > 0 ? swiper.list.eq(swiper.settings.currentIndex).find('.travelCont > h2.hidden') : swiper.list.eq(swiper.settings.currentIndex).find('.navTit'),
                                getInitTitle = $initTitle.text();
                                
                            swiper.wrap.find('.layerNav > .tit').text(getInitTitle);
                        }
                        
                        // 2016.11.02 납부서비스 numberPaging
                        if(swiper.wrap.closest('.swipeInner').length > 0) {
                            swiper.customWrap = swiper.target.closest('.swipeInner');
                            swiper.settings.numberText = true;
                            swiper.settings.arrows = true;              // boolean  
                        }
                        
                        // 기부 페이지 스와이프 높이 값 지정
                        if(swiper.wrap.hasClass('donation')) {
                            swiper.wrap.css('height', (util.getContentHeight())+'px');
                        }
                        
                        // 카드관리 / my card 인디케이터가 많을경우 잘리므로 숫자 텍스트로 대체
                        if(swiper.wrap.closest('.grayBox').length > 0 && swiper.wrap.closest('.myCard').length > 0 && swiper.listLen > 20) {
                            swiper.settings.numberText = true;
                            swiper.wrap.find('.paging').removeClass('paging').addClass('numPaging');
                        }
                        
                        // 2016.12.17 플러스O2O 이전 다음버튼 추가
                        if(swiper.wrap.hasClass('plusBinner')) {
                            swiper.settings.arrows = true;
                        }
                        
                                                    
                        // 2017.01.09 접근성 추가
                        if(swiper.wrap.closest('.cardRecommend').length > 0 || swiper.wrap.closest('.myCard').length > 0 || swiper.wrap.closest('.appService').length > 0) {
                            swiper.settings.nextArrow = '.btnNext2',                // String
                            swiper.settings.prevArrow = '.btnPrev2',                // String
                            waiAccessibility.setSwipeNavigationButton({
                                target : swiper.wrap,
                                
                                prevButton : {
                                    text : '이전',
                                    class : 'btnPrev2'
                                },
                                
                                nextButton : {
                                    text : '다음',
                                    class : 'btnNext2'
                                }
                            });
                        }
                    },
                    
                    onBeforeChange : function(swiper, oldIndex, newIndex) {
                        /*
                        * 2016.11.17
                        * 기부페이지, VIP서비스(BN_8.4)
                        */
                        if(swiper.wrap.hasClass('donation')) {
                            var $showBtn = $('.fixedBArea > a').eq(newIndex);
                            
                            $showBtn.show();
                            $showBtn.siblings().hide();
                        }
                        
                        if(swiper.target.closest('.vipCard_Intro').length > 0 && !config.animCheck && $('.vipCont.swiperCon').length > 0) {
                            config.animCheck = true;
                            swipers.slideTo($('.vipCont.swiperCon > ul'), newIndex);
                        }
                        
                        if(swiper.wrap.hasClass('vipCont') && !config.animCheck) {
                            config.animCheck = true;
                            swipers.slideTo($('.vipCard_Intro > .swiperCon > ul'), newIndex);
                        }

                        
                        // End 2016.11.17
                    },
                    
                    onAfterChange : function(swiper) {
                        
                        // vip 서비스 swiper chain animate 체크용
                        if(config.animCheck) {
                            config.animCheck = false;
                        }
                    },
                    
                    onResize : function() {
                        
                        if($('.rotate').length > 0) {
                            common.setRotateAppCard();
                        }
                    }
                });
                
            }
        }
    };
        
    /***************************************************************
    * 아코디언
    * 1. 타이틀 클릭 - > on 클래스 추가 - > 컨텐츠 노출
    * 2. 클릭 시 형제 엘리먼트 on 클래스 삭제 후 컨텐츠 숨김
    ***************************************************************/
    arcodians = {
        init : function() {
            arcodians.defaultToggle.init();
            arcodians.cardToggle.init();
            arcodians.stateToggle.init();
            arcodians.fixedToggle.init();
            
            // 앱에서만 사용. 
            arcodians.eventAll.init();
        },
        
        /**
        * 아코디언 플러그인 data 값 접근
        * @param target 아코디언 셀렉터
        */
        getAccordion : function(target) {
            var $target = $(target);
            return $target.data('accordion');
        },
        
        /**
        * 아코디언 리프레쉬 ( 동적 로딩시 생성 )
        * @param target 아코디언 셀렉터
        */
        refresh : function(target) {
            arcodians.getAccordion(target).refresh();           
        }
    };
    
    // 기본 토글
    arcodians.defaultToggle = {
        init : function() {
            var config = null;
            
            arcodians.defaultToggle.config = {
                target : $('.toggleList')
            };
            
            config = arcodians.defaultToggle.config;
            
            if(config.target.length > 0) {
                arcodians.defaultToggle.$target = util.eachFunc(config.target, $.fn.commonAccordion, {
                    toggleWrap : 'li',
                    btnClass : 'li.toggleItem > a, a.moreInfo',
                    viewClass : '.toggleView',
                    onAfterOpen : function(opts, idx) {
                        var $toggleTarget = $(opts.list[idx]),
                            $pieChart = $(opts.list[idx]).find('.circleGraph'),
                            $barChart = $(opts.list[idx]).find('.barGraph'),
                            $googleMap = $toggleTarget.find('.googleMap'),
                            $daumMap = $toggleTarget.find('.daumMap');
                            
                        // 파이 차트가 존재할 때 애니메이션 실행
                        if($pieChart.length > 0 && !$pieChart.hasClass('onDraw')) {
                            for(var i = 0, len = $pieChart.length; i < len; i++) {      
                                $pieChart.eq(i).addClass('onDraw');
                                chart.pie.$target[i].pieChartStart();
                            }
                        }
                        
                        // 막대 차트가 존재할 때 애니메이션 실행
                        if($barChart.length > 0 && !$barChart.hasClass('onDraw')) {
                            for(var i = 0, len = $barChart.length; i < len; i++) {
                                $barChart.eq(i).addClass('onDraw');
                                chart.bar.$target[i].barChartStart();
                            }
                        }
                        // 2016.11.14 영업점 토글뷰 지도 refresh 구글 -> 다음으로 변경 작업 필요
                        if($googleMap.length > 0) {
                            var getPos = {
                                lat : $googleMap.data('lat'),
                                lng : $googleMap.data('lng')
                            };
                            google.maps.event.trigger($googleMap.data('map'), 'resize');
                            $googleMap.data('map').setCenter(getPos);                           
                        }
                        
                        
                        // 2017.01.11 영업점 토글뷰 다음 지도
                        // 2017.13.28 임윤왕 다음지도 나오게 변경
                        try{
                            if($daumMap.length > 0) {
                                var getPos = new daum.maps.LatLng($daumMap.data('lat'),$daumMap.data('lng'));
                                $daumMap.data('map').relayout();
                                $daumMap.data('map').setCenter(getPos);     
                            }
                        }catch(e){
                            console.log(e);
                        }
                        // 2016.11.29 접근성 추가
                        $toggleTarget.find('> a').attr('title','펼쳐짐');
                    },
                    
                    // 2016.11.29 접근성 추가
                    onAfterClose : function(opts, idx) {
                        var $toggleTarget = $(opts.list[idx]);                      
                        $toggleTarget.find('> a').attr('title','닫힘');
                    }
                });

            }
        }
    };
    
    // 카드 토글
    arcodians.cardToggle = {
        init : function() {
            var config = null;
            
            arcodians.cardToggle.config = {
                target : $('.cardBox'),
                toggleItem : $('.cardToggle')
            };
            
            config = arcodians.cardToggle.config;
            
            // 카드 아코디언
            
            if(config.toggleItem.length > 0) {
                config.target.find('.on').not('.pwBox > span').removeClass('on');
                arcodians.cardToggle.$target = util.eachFunc(config.target, $.fn.commonAccordion, {
                    toggleWrap : '.cardToggle, .toggle',
                    btnClass : '.cardTxt, .more',
                    viewClass : '.toggleView',
                    currentClass : '',
                    onInit : function(arcodian) {
                        if(arcodian.btnElem.closest('.cardToggle').length > 0) {
                            arcodian.settings.currentClass = 'on';
                        }
                        
                        if(arcodian.btnElem.closest('.cardCheck').length > 0) { 
                            arcodian.settings.btnClass = '.more';
                            arcodian.settings.currentClass = 'open';
                        }
                    }
                });
            }
            
            // 카드 선택 이벤트
            if(config.target.length >0) {
                arcodians.cardToggle.setup();
                arcodians.cardToggle.bindEvents();          
            }           

        },
        
        // 2017.01.13 접근성 추가 (카드 체크 타입 접근성 속성 초기화)
        setup : function() {
            var config = arcodians.cardToggle.config;
            
            config.target.find('.cardCheck').each(function() {
                var $cardTxt = $(this).find('.cardTxt');
                
                if($(this).hasClass('on')) {
                    //2017.01.02 접근성 추가
                    waiAccessibility.setAriaLabel({
                        target : $cardTxt,
                        type : 'button',
                        text : $cardTxt.text(),
                        activeText : '선택됨'
                    }); 
                } else {
                    //2017.01.02 접근성 추가
                    waiAccessibility.setAriaLabel({
                        target : $cardTxt,
                        type : 'button',
                        text : $cardTxt.text(),
                        activeText : '선택 안됨'
                    }); 
                }
            });
        },
        
        /*
        * 체크, 라디오 기능 추가
        */
        bindEvents : function() {
            var config = arcodians.cardToggle.config;
                
            config.target.off('click.cardToggle');
            config.target.on('click.cardToggle', '.cardTxt', function(e) {
                e.preventDefault();
                var $thisWrap = $(this).parent();

                // 기본 토글 및 라디오+토글
                if($thisWrap.hasClass('cardToggle')) {      
                    $thisWrap.siblings().removeClass('on');
                    $thisWrap.siblings().find('> .toggleView').stop(true,false).slideUp();
                }
                
                /*
                * 라디오버튼 기능
                * 2016.10.10 라디오 토글 .cardBox > .cardTxt 
                */
                if($thisWrap.hasClass('type4') && !$(this).hasClass('disabled')) {
                    $(this).siblings().removeClass('on');                   
//                  $(this).toggleClass('on');
                    $(this).addClass('on');
                    
                    // 전화요금해지 페이지 fixedBArea 버튼 스타일 정의
                    commonJs.changeSection();
                }

                // 체크박스 기능
                if($thisWrap.hasClass('cardCheck')) {

                    $thisWrap.toggleClass('on');
                    
                    //2017.01.02 접근성 추가 role="text" aria-label 적용
                    if($thisWrap.hasClass('on')) {                          
                        //2017.01.02 접근성 추가
                        waiAccessibility.setAriaLabel({
                            target : $(this),
                            type : 'button',
                            text : $(this).text(),
                            activeText : '선택됨'
                        }); 
                    } else {
                        //2017.01.02 접근성 추가
                        waiAccessibility.setAriaLabel({
                            target : $(this),
                            type : 'button',
                            text : $(this).text(),
                            activeText : '선택 안됨'
                        }); 
                    }
                }
                
                // 2016.12.17 container 클래스에 fixedBCheck가 있을 경우 cardTxt 클릭시 fixedBArea 버튼 노출
                if($thisWrap.closest('.container').hasClass('fixedBCheck')) {
                    if($thisWrap.closest('.cardBox').find('.on').length > 0) {
                        util.fixedBCheck('show');
                    } else {
                        util.fixedBCheck('hide');
                    }
                }
            });
        }
    };
    
    // 명세서 토글(MK)
    arcodians.stateToggle = {
        init : function() {
            var config = null;
            
            arcodians.stateToggle.config = {
                target : $('.contArea.statement'),
                toggleItem : $('.stateToggle')
            };
            
            config = arcodians.stateToggle.config;
            
            if(config.toggleItem.length > 0) {
                arcodians.stateToggle.$target = util.eachFunc(config.target, $.fn.commonAccordion, {
                    toggleWrap : '.stateToggle',
                    btnClass : 'a.more',
                    viewClass : '.inbox',
                    currentClass : 'open',
                    changeText : true,
                    openText : '닫기',
                    closeText : '펼쳐보기',
                    onInit : function(accordion) {
                        var $toggle = accordion.viewElem.parent(),
                            $titBox = $toggle.siblings('.titBox').length > 0 ? $toggle.siblings('.titBox').find(' > .tit') : $toggle.siblings('.tit'),
                            getTit = $titBox.text(),
                            openTxt = getTit + ' 닫기',
                            closeTxt = getTit + ' 펼쳐보기';
                        
                        accordion.settings.openText = openTxt;
                        accordion.settings.closeText = closeTxt;
                        
                        if($toggle.hasClass('defaultOpen')) {
                            accordion.btnElem.text(openTxt);
                        } else {
                            accordion.btnElem.text(closeTxt);
                        }
                        
                    },
                    
                    onAfterOpen : function(accordion) {
                        waiAccessibility.goFocus(accordion.list.filter('.open').find('.inbox'));
                    }
                });
            }
        }
    };
    
    /*
    * 토글 오픈시 컨텐츠 높이값 설정 및 position : fixed
    * 카드안내/신청 CR_1.1.html
    */
    arcodians.fixedToggle = {
        init : function() {
            var config = null;
            
            arcodians.fixedToggle.config = {
                eventArea : $('.customArea'),
                target : $('.tabCont'),
                toggleItem : $('.customCard'),
                openClass : 'open'
            };
            
            config = arcodians.fixedToggle.config;
            
            if(config.toggleItem.length > 0) {
                
                arcodians.fixedToggle.setup();
                arcodians.fixedToggle.bindEvents();
            }
        },
        
        setup : function() {
            var fixedToggle = arcodians.fixedToggle,
                config = fixedToggle.config,
                $toggleWrap = config.toggleItem,
                $btn = $toggleWrap.find('a.more'),
                $view = $toggleWrap.find('.listBox');

            $toggleWrap.removeClass('open');
            $view.hide();
        },
        
        bindEvents : function() {
            var fixedToggle = arcodians.fixedToggle,
                config = fixedToggle.config;
            
            config.toggleItem.off('click.fixedToggle');
            config.toggleItem.on('click.fixedToggle', 'a.more', function(e) {
                e.preventDefault();
                var $thisList = $(this).parent(),
                    $thisView = $(this).next('.listBox');
                

                if(!$('.customArea .radioSel').eq(0).find('input[type="radio"]:checked').length) {
                    // 개발 공통 메서드 사용
                    $.cxhia.alert({
                        title: "Alert",
                        message: "카드종류를 선택해주세요."
                    });                 
                    return false;
                }
                
                if(!$thisList.hasClass('open')) {
                    config.saveBtn = $(this);
                    config.saveView = $thisView;
                    
                    fixedToggle.open();
                } else {
                    config.saveBtn = null;
                    config.saveView = null;
                    
                    fixedToggle.close();
                }
            });
            
            // 라디오 클릭 후 formWrap에 변화가 있을 경우 customCard의 색상 변경
            config.eventArea.find('.formWrap').off('change.fixedToggle');
            config.eventArea.find('.formWrap').on('change.fixedToggle', function() {

                if($(this).parent().index('.customArea .radioSel') === 0) {
                    return false;
                }

                if(util.checkCSS){
                    config.toggleItem.stop(true, false).animate({
                        backgroundColor: '#fc0'
                    }, {
                        duration: 100,
                        complete : function() {
                            $(this).animate({
                                backgroundColor: '#605d5a'
                            });
                        }
                    });

                }
            });

        },
        
        open : function() {
            var fixedToggle = arcodians.fixedToggle,
                config = fixedToggle.config,
                $toggleWrap = config.toggleItem,
                $btn = $toggleWrap.find('a.more'),
                $view = $toggleWrap.find('.listBox');
                            
            $toggleWrap.addClass(config.openClass).css({
                bottom : 0,
                left: 0,
                width: '100%',
                marginBottom : 0,
                zIndex: 1000
            });
            
            if(!config.saveBtn) {
                config.saveBtn = $btn;
            }
            
            if(!config.saveView) {
                config.saveView = $view;
            }
            
            fixedToggle.setContentsHeight(config.saveBtn, config.saveView);
            
            $view.stop(true, false).slideDown({
                duration: 700,
                easing : 'easeInOutQuart'
            });
            
            util.disableScroll(true);
        },
        
        close : function() {
            var fixedToggle = arcodians.fixedToggle,
                config = fixedToggle.config,
                $toggleWrap = config.toggleItem,
                $btn = $toggleWrap.find('a.more'),
                $view = $toggleWrap.find('.listBox');
            
            $toggleWrap.removeClass(config.openClass)
            $view.stop(true, false).slideUp({
                duration: 700,
                easing : 'easeInOutQuart',
                complete : function() {
                    util.disableScroll(false);  
                }
            });                                 
        },
        
        /**
        * 토글뷰의 콘텐츠 높이를 구한다 ( 전체 높이에서 고정요소들의 높이를 뺀 나머지 )
        */
        getContentsHeight : function(target) {
            var targetHeight = $(target).innerHeight(),
                fixHeight = util.getFixItemTop(),
                winHeight = ns.global.bh,
                result =  winHeight - (targetHeight + fixHeight);

                        
            // 모바일 웹 푸터 있을 때
            if($('.customCard').css('position') === 'absolute' && $('footer').filter(':visible').length > 0) {
                result -=  $(window).scrollTop() - ($('footer').offset().top - ns.global.bh);
            }

            return result;
        },
        
        setContentsHeight : function(btnTarget, viewTarget) {
            viewTarget.css({
                height: arcodians.fixedToggle.getContentsHeight(btnTarget) - 10 + 'px'
            });
        },
        
        resize : function() {
            var config = arcodians.fixedToggle.config;
            
            if(config.saveBtn && config.saveView) {
                arcodians.fixedToggle.setContentsHeight(config.saveBtn, config.saveView);
            }
        }
    };
    
    /*
    * 2016.10.20
    * 이벤트 전체보기 아코디언(앱용 로그인페이지)
    */
    arcodians.eventAll = {
        init : function() {
            var config = null;
            
            arcodians.eventAll.config = {
                target : '.eventArea',
                saveBtn : null,
                saveView : null
            };
            
            config = arcodians.eventAll.config;
                
            if($(config.target).length > 0) {
                /*
                * 2016.10.24 로그인 이벤트 전체보기 초기 css 설정(실행 속도 뒤로 늦춤)
                */
                setTimeout(function() {
                    arcodians.eventAll.setup();
                }, 0);
                //arcodians.eventAll.bindEvents();
            }
            
        },
        
        /**
        * 2016.10.24
        * 초기화시, 리사이즈시 해당 setup 실행하여 체크
        * 로그인 콘텐츠가 이벤트 전체보기 버튼에 가려질 경우 전체보기 버튼 fixed 해제
        */
        setup : function() {
            var config = arcodians.eventAll.config,
                $eventArea = $(config.target).filter(':visible'),
                $content = $('#content'),
                totalHeight = parseInt($content.innerHeight(), 10),
                result;
            
            if(!$eventArea.length) { return false; }
            
            // 스와이프 넓이값으로 인해 높이값이 제대로 잡히지 않는 문제 방지
            swipers.reInit($eventArea.find('.swiper'));
            
            // 로그인 방법에 따라 바뀌는 폼에 대응하기위해 eventDetail의 스타일을 변경
            // $('.eventDetail').removeAttr('style');
            
            $content.css({position: 'relative', minHeight: $(window).outerHeight()}).find('.container').css({paddingBottom: $('.eventDetail').outerHeight()});
        }
    };

    
    /********************************************************
    * 파이 차트 & 막대 그래프
    *********************************************************/
    chart = {
        init : function() {
            chart.pie.init();
            chart.bar.init();
        }
    };
    
    /**
    * 파이 차트
    * @method chart.pie.$target[0].pieChartSetup(Array)
    */
    chart.pie = {
        init : function() {
            chart.pie.$target = util.eachFunc($('.circleGraph'), $.fn.pieChart);
        }
    };
    
    /*
    * 막대 차트
    */
    chart.bar = {
        init : function() {
            chart.bar.$target = util.eachFunc($('.barGraph'), $.fn.barChart);
        }
    };
    
    /********************************************************
    * 달력 스크립트
    * // 특정 날짜 이전 선택 불가능 (data-min 속성 적용)
    * <input data-min="yy.mm.dd">
    *
    * // 특정 날짜 이후 선택 불가능 (data-max 속성 적용)
    * <input data-max="yy.mm.dd">   
    *********************************************************/
    calendar = {
        init : function() {
            var config = null;
            
            calendar.config = {
                target : $('.calendar, .jsDatePopup')
            };
            
            config = calendar.config;
            

            if(config.target.length > 0){
                calendar.createDateWrap();
                calendar.setup();
                calendar.bindEvents();

            }
        },
        
        /**
        * jquery ui calendar를 감싸는 layerPopup 폼 생성
        */
        createDateWrap : function() {
            if(!$('.layerDatePicker').length) {
                var $layerDatePicker = $('<div class="layerWrap layerDatePicker" />'),
                    $popTop = $('<div class="popTop" />'),
                    $strong = $('<strong class="fs2" />'),
                    $popCont = $('<div class="popCont" />'),
                    $inner = $('<div class="inner" />'),
                    $lyrFixBtnArea = $('<div class="lyrFixBtnArea" />'),
                    $closeBtn = $('<a href="#" class="close" />');
                
                $strong.text('날짜 선택');
                $popTop.append($strong);
                $popCont.append($inner);
                $closeBtn.text('닫기');
                $lyrFixBtnArea.append($closeBtn);
                
                $layerDatePicker.append($popTop);
                $layerDatePicker.append($popCont);
                $layerDatePicker.append($lyrFixBtnArea);
                
                $('body').append($layerDatePicker);
            }
        },
        
        /**
        * jQuery ui calendar 옵션 세팅
        */
        setup : function() {
            var config = calendar.config,
                saveTarget = null,
                calendarInput = config.target.find('input');
            
            if(config.target.hasClass('jsDatePopup')){
                calendarInput = $('.jsDatePopup');
            }
            
            calendarInput.each(function() {
                var getDataMin = $(this).data('min') || '-3Y',
                    getDataMax = $(this).data('max') || '+3Y',
                    $imgBtn = $(this).parent().next('.calBtn'),
                    dateAriaLabel = '';
                
                $(this).datepicker({
                    /*
                    * dateFormat : 'y.mm.dd'로 수정할 경우 개발자분들에게 추가 요청 필요함
                    * 변경할 때 data-min, data-max 값도 16.mm.dd식으로 수정 요청 필요함
                    */
                    dateFormat : 'yy.mm.dd', // 
                    showMonthAfterYear : true,
                    changeYear : true,
                    changeMonth : true,
                    showOtherMonths : true,
                    monthNamesShort : ['1','2','3','4','5','6','7','8','9','10','11','12'],
                    dayNamesMin : ['일','월','화','수','목','금','토'],
                    minDate : getDataMin,
                    maxDate : getDataMax,
                    beforeShow: function(input) {
                        
                        // 2016.10.31 접근성 추가 ( popup saveBtn 변경 )
                        layerPopup.config.saveBtn = $(input).parent().next('.calBtn');                                                          
                                                
                        // ui calendar 생성한 팝업 내부로 이동
                        $('.layerDatePicker .popCont .inner').append($('#ui-datepicker-div'));
                        
                        // beforeShow이기때문에 조금 늦게 노출
                        setTimeout(function() {
                            $('#ui-datepicker-div').css({
                                position: 'relative',
                                top: 0,
                                left: 0
                            });
                            
                            layerPopup.openPopup('.layerDatePicker');               
                            
                            // 2017.01.07 접근성 추가 (캘린더 오늘날짜 텍스트 추가)
                            $('#ui-datepicker-div').find('.ui-state-highlight').attr('title', '오늘 날짜');
                            $('#ui-datepicker-div').find('.ui-state-active').attr('title', '선택됨');
                            
                            // 2017.01.07 접근성 추가 (이전 버튼 aria-label 적용)
                            waiAccessibility.setAriaLabel({
                                target : $('#ui-datepicker-div').find('.ui-datepicker-prev'),
                                type : 'button',
                                text : '이전 달력 보기'
                            });
                            
                            // 2017.01.07 접근성 추가 (다음 버튼 aria-label 적용)
                            waiAccessibility.setAriaLabel({
                                target : $('#ui-datepicker-div').find('.ui-datepicker-next'),
                                type : 'button',
                                text : '다음 달력 보기'
                            });
                            
                            // 2017.01.07 접근성 추가 (셀렉트 title 추가)
                            $('.ui-datepicker-year').attr('title', '년 선택');
                            $('.ui-datepicker-month').attr('title', '월 선택');
                            
                        }, 0);
                        
                        // layerPopup.centerAlign($('.layerDatePicker'));
                        $('.layerDatePicker').one('click', '.close', function(e) {
                            e.preventDefault();
                        });
                        
                        // input에 data-min이 있을 경우 data-min의 이전 날짜 체크 불가능
                        if($(input).attr('data-min')){
                            $(input).datepicker('option', 'minDate', $(input).attr('data-min'));
                        }
                        
                        // input에 data-min이 있을 경우 data-max의 이후 날짜 체크 불가능
                        if($(input).attr('data-max')) {
                            $(input).datepicker('option', 'maxDate', $(input).attr('data-max'));
                        }
                        
                        
                    },
                    
                    onChangeMonthYear : function() {
                        setTimeout(function() {
                            // 2017.01.07 접근성 추가 (캘린더 오늘날짜 텍스트 추가)
                            $('#ui-datepicker-div').find('.ui-state-highlight').attr('title', '오늘 날짜');
                            $('#ui-datepicker-div').find('.ui-state-active').attr('title', '선택됨');
                            
                            // 2017.01.07 접근성 추가 (이전 버튼 aria-label 적용)
                            waiAccessibility.setAriaLabel({
                                target : $('#ui-datepicker-div').find('.ui-datepicker-prev'),
                                type : 'button',
                                text : '이전 달력 보기'
                            });
                            
                            // 2017.01.07 접근성 추가 (다음 버튼 aria-label 적용)
                            waiAccessibility.setAriaLabel({
                                target : $('#ui-datepicker-div').find('.ui-datepicker-next'),
                                type : 'button',
                                text : '다음 달력 보기'
                            });
                            
                            // 2017.01.07 접근성 추가 (셀렉트 title 추가)
                            $('.ui-datepicker-year').attr('title', '년 선택');
                            $('.ui-datepicker-month').attr('title', '월 선택');        
                            
                            $('.ui-datepicker-year').focus();                   
                        }, 1000);
                    },
                    
                    onSelect: function(date) {
                        waiAccessibility.setAriaLabel({
                            target : layerPopup.config.saveBtn,
                            type : 'button',
                            text : calendar.convertToText(date) + ' 선택됨 ',
                            title : $imgBtn.text() + ' 버튼'
                        });
                    },
                    
                    // ui datepicker 닫을 때 callback
                    onClose : function(selectedDate) {
    
                        var $dateWrap = $(this).closest('.calWrap'),
                            $dateWrapChildren = $dateWrap.children(),
                            $calendar = null,
                            $siblingsCalendar = null,
                            $siblingsInput = null,
                            title = '',
                            saveValue = null;
                        
                        // 2017.01.10 asis 대응 추가 (asis에서 불러오는 이벤트내의 달력 팝업)
                        if(config.target.hasClass('jsDatePopup')) {
                            $dateWrapChildren = $('.jsDatePopup');
                        }
                            
                        // calWrap 안에 달력이 2개 있을 경우 (시작일, 끝나는일)
                        if($dateWrapChildren.length > 1) {
                            $calendar = $(this).closest('.calendar').parent();
                            $siblingsCalendar = $calendar.siblings();

                            $siblingsInput = $siblingsCalendar.find('input');
                            
                            // 2017.01.10 asis 대응 추가 (asis에서 불러오는 이벤트내의 달력 팝업)                          
                            if(config.target.hasClass('jsDatePopup')) {
                                $siblingsInput = $(this).siblings('.jsDatePopup');
                                
                                title = $(this).index('.jsDatePopup') === 0 ? '시작일' : '종료일';
                            
                            // 기존 통합앱 시작, 종료 달력
                            } else {
                                title = $(this).attr('title');
                            }
                            
                            // 시작일, 종료일일 경우 시작일과 종료일에 따라 해당 최소, 최대 값 재지정
                            if(selectedDate !== '') {
                                switch(title) {
                                    case '시작일' :
                                        $siblingsInput.datepicker('option', 'minDate', selectedDate);
                                        break;
                                    case '종료일' :
                                        $siblingsInput.datepicker('option', 'maxDate', selectedDate);
                                        break;
                                }
                                
                                // 2017.01.10 input의 value 값을 yy.mm.dd 형태로 변경
                                $siblingsInput.val(calendar.yyyyToYy($siblingsInput.val()));
                            }
                        }
                        
                        // 2017.01.10 input의 value 값을 yy.mm.dd 형태로 변경
                        $(this).val(calendar.yyyyToYy($(this).val()));
                        
                        layerPopup.closePopup('.layerDatePicker');
                        
                    }
                }).off('focus');
                
                // 2017.01.10 input의 value 값을 yy.mm.dd 형태로 변경
                $(this).val(calendar.yyyyToYy($(this).val()));
                
                // 2017.01.14 접근성 추가 (현재 선택된 날짜가 있을 경우 버튼에 접근성 텍스트 제공)
                waiAccessibility.setAriaLabel({
                    target : $imgBtn,
                    type : 'button',
                    text : $(this).val() !== '' ? calendar.convertToText($(this).val()) + ' 선택됨 ' : '',
                    title : $imgBtn.text() + ' 버튼'
                });             
            });
            
            
            
            // config.target.find('input').val($.datepicker.formatDate('yy.mm.dd', new Date()));
            
        },
        
        bindEvents : function() {
            var config = calendar.config;
            
            config.target.find('button').off('click.calendar');
            config.target.find('button').on('click.calendar', function() {
                $(this).closest('.calendar').find('input').datepicker("show");
            });
            
            config.target.find('input').off('click.calendar');
            config.target.find('input').on('click.calendar', function() {
                $(this).datepicker("show");
            });
        },
        
        /**
        * input에 들어갈 날짜 format 변경
        */
        yyyyToYy : function(getText) {
            var result = null;
            if(getText.split('.')[0].length === 4) {
                result = getText.substring(2, getText.length);
            } else {
                result = getText;
            }
            return result;
        },
        
        /**
        * 넘겨받은 date의 값 2017.01.01을 2017년 01월 01일로 변경
        */
        convertToText : function(date) {
            var getDateSplit = date.split('.'),
                dateText = ['년 ', '월 ', '일 '],
                result = '';
            
            if(!getDateSplit.length) { return; }
            
            for(var i=0, len = getDateSplit.length; i<len; i++) {
                
                if(getDateSplit[i] !== '') {
                    result += getDateSplit[i] + dateText.splice(0, 1);
                }
            }
            
            return result;
        }
    };
    
    /************************************************************
    * 공통 레이어 팝업
    *
    * 개발관련
    * 팝업 실행 시 해당 아이디 값을 가지고 있는 버튼의 인덱스 값을 넘겨줌
    * layerPopup.config.wrap.on('change', function(e, selector, index) { ... });
    * 2016.10.17 풀버전 팝업 추가
    *************************************************************/
    layerPopup = {
        config : {
                wrap : '.layerWrap',
                target : '.layerOpen',
                closeBtn : '.popClose, .js-popup-close',
                duration : 100,
                marginRL : 30,
                saveTop : 0,
                saveBtn : null
        },
        
        init : function () {
            
            if($(layerPopup.config.wrap).length > 0) {
                layerPopup.bindEvents();
                
                if($(layerPopup.config.wrap).filter(':visible').length > 0) {
                    layerPopup.resize();
                }
            }
            
            // 2017.01.02 접근성 추가 (카드선택 레이어 버튼 있을 경우 접근성 텍스트 추가)
            if($('.cardTxt.layerOpen').length > 0) {
                
                $('.cardTxt.layerOpen').each(function() {
                    var getId = $('.cardTxt.layerOpen').attr('href'),
                        $layerWrap = $(getId),
                        $layerPopTop = $layerWrap.find('.popTop');
                        
                    //2017.01.02 접근성 추가
                    waiAccessibility.setAriaLabel({
                        target : $(this),
                        type : 'button',
                        title : $layerPopTop.text() + ' 레이어팝업 링크',
                        text : $(this).text()+' 선택됨 '
                    }); 
                });
                
            }
        },
        
        bindEvents : function() {
            
            var config = layerPopup.config,
                openBtn = '.layerOpen',
                closeBtn = config.wrap + ' .popClose, ' + config.wrap + ' .close',
                selectCardBtn = config.wrap + ' .selectCard > a',
                layerTbl = config.wrap + ' #drvLicense1 input[type="radio"],' + config.wrap + ' .layerTbl input[type="radio"]',
                multipleSelectorBtn =  config.wrap + ' .areaSearch li > a,' +  config.wrap + ' .btn > .btnWhite',
                searchRadius = config.wrap + ' .searchRadius a';
            
            $(document).off('click.layerOpen');
            $(document).on('click.layerOpen', openBtn, function(e) {
                e.preventDefault();
                var getHref;
                if(!$(this).hasClass('disabled')) {
                    // 현재 클릭한 버튼 저장
                    layerPopup.config.saveBtn = $(this);

                    // href가 없을  때 id값으로 대체
                    if(!$(this).attr('href')) {
                        getHref = '#' + $(this).attr('data-id');
                    } else {
                        getHref = $(this).attr('href');             
                    }
                    
                    layerPopup.openPopup(getHref);

                    /*
                    * 2016.11.03
                    * 장기카드대출(카드론)신청 페이지 직접입력 input value 초기화
                    */
                    if(getHref === '#calculator' || $(getHref).hasClass('calculator')) {
                        $(getHref).find('.sumRead input').val('');
                    }
                }
            });
            

            // layerPopup.config.wrap.off('click.layerPopup');
            $(document).off('click.layerClose');
            $(document).on('click.layerClose', closeBtn, function(e) {
                e.preventDefault();
                
                var getId = $(this).closest('.layerWrap').attr('id');
                
                // 달력 팝업일 경우는 closePopup 실행하지 않음. 달력에 있음.
                if(!$(this).closest('.layerWrap').hasClass('layerDatePicker')){
                    layerPopup.closePopup('#'+getId);
                }
            });
            
            /*
            * 2016.10.12 카드 이용내역 필터 카드별 선택 추가
            * 2016.11.09 카드별 탭 카드 마크업 변경으로 인해 스크립트 수정
            */
            $(document).off('click.layerSelectCard');
            $(document).on('click.layerSelectCard', selectCardBtn, function(e) {
                e.preventDefault();
                
                var $clone = $(this).clone(),
                    $thisWrap = $(this).closest('.layerWrap'),
                    getId = $thisWrap.attr('id'),
                    $btn = $('a[href="#'+ getId +'"]').filter('.cardTxt');
            
//                  getDataId = $btn.attr('data-id'),
//                  $dataBox = $('#'+getDataId).find('.cardBox > .cardSel > a');
                
                // 계좌번호 선택
                if($thisWrap.attr('id') === 'accountList') {
                    $('#accountNumber').data('selectIndex', $(this).index());
                    $('#accountNumber').val($clone.html());
                // 카드 선택
                } else {
                    // 카드 팝업 버튼에 선택한 카드의 index 값 저장
                    $btn.data('selectIndex', $(this).index());          
                    $btn.html($clone.html());
                    
                    // 2016.12.08 개발팀 요청 trigger 이벤트 (카드를 클릭했을 때 selectCard 이벤트 강제 실행)
                    $btn.trigger('selectCard');
                    
                    //2017.01.02 접근성 추가
                    waiAccessibility.setAriaLabel({
                        target : $btn,
                        type : 'button',
                        title : $thisWrap.find('.popTop').text() + ' 레이어팝업 링크',
                        text : $clone.text() + ' 선택됨 '
                    });                 
                }
                
                // $thisWrap.find('.popClose').trigger('click');
                layerPopup.closePopup('#'+getId);
            });
            
            /*
            * 2016.11.18
            * 운전면허선택 / 카드신청(CR_4.1.3) 한도선택 이벤트
            */
            $(document).off('click.layerTbl');
            $(document).on('click.layerTbl', layerTbl, function(e) {
                var $layerWrap = $(this).closest('.layerWrap'),
                    $label = $(this).next('label'),
                    layerId = $layerWrap.attr('id'),
                    labelText = $label.text();
                    
                if($layerWrap.attr('id') === 'reqmaxLayer2') {
                    layerPopup.closePopup('#'+layerId);
                    
                    if(labelText !== '직접입력') {
                        $('.reqmaxInput').val(labelText.split('만원')[0]);
                    } else {
                        $('.reqmaxInput').val('');
                    }
                                        
                    $('.reqmaxInput').focus();
                } else {
                    layerPopup.config.saveBtn.val(labelText).text(labelText);
                    layerPopup.closePopup('#'+layerId);
                }
            });
            
            /*
            * 2016.10.28 multiple select popup(스타샵, 쿠폰검색) 클릭이벤트
            * 2016.11.08 선택 클릭시 선택한 depth 텍스트 추가
            * 2016.11.10 선택 시 depth2에 해당하는 depth3 리스트 show
            */
            $(document).off('click.layerMultipleSelect');
            $(document).on('click.layerMultipleSelect', multipleSelectorBtn, function(e) {
                var $layerWrap = $(this).closest('.layerWrap'),
                    getId = $layerWrap.attr('id');              

                // 지역 선택, 카테고리 선택, 지하철 역 선택 레이어일때                       
                if(getId === 'subwayLayer' || getId === 'categoryLayer' || getId === 'areaLayer'){  
                    e.preventDefault();         
                    if($(this).hasClass('btnWhite')){
                        var $defaultSelect = $layerWrap.find('.defalutSelect > select'),
                            getDepth2 = $layerWrap.find('ul.depth2 li.on > a:visible').text(),
                            getDepth3 = $layerWrap.find('ul.depth3 li.on > a:visible').text(),
                            resultText = [];
                        
                        // select가 있을 때 select 텍스트 저장
                        if($defaultSelect.length > 0) {
                            resultText.push($defaultSelect.filter(':visible').find('option:selected').text());
                        }
                        
                        // depth2 text 저장
                        resultText.push(getDepth2);
                        // depth3 text 저장
                        resultText.push(getDepth3);
                        
                        // 텍스트 합치기
                        resultText = resultText.join(' ');
                        
                        // 동까지 클릭해야 선택 가능
                        if(resultText !== '' && getDepth2 !== '' && getDepth3 !== '' || getDepth2 === '전체') {
                            $('.selType1 a[href="#'+getId+'"]').text(resultText);
                            layerPopup.closePopup($layerWrap);
                        }

                    } else {
                        $(this).parent().siblings().removeClass('on');
                        $(this).parent().addClass('on');
                        
                        // 2016.11.10 depth2 클릭시 해당 depth3 show 그 외 hide
                        if($(this).closest('ul').hasClass('depth2')) {
                            $($(this).attr('href')).show();
                            $($(this).attr('href')).siblings().hide();
                        }
                    }
                }               
            });
            
            /*
            * 2016.11.04 추가
            * 스타샵 검색반경 선택 팝업
            */
            // 기존 formEvent.select 이벤트 해제
            $(layerPopup.config.wrap).find('.searchRadius').off('click.selectList');
            $(document).off('click.layerSearchRadius');
            $(document).on('click.layerSearchRadius', searchRadius, function(e) {
                e.preventDefault();
                var layerId = $(this).closest('.layerWrap').attr('id'),
                    getValue = $(this).data('radius');
                
                // 2016.11.21 검색반경 조정 ( google map이 초기화되어있을 경우만 사용);
                // 2017.01.03 구글 -> 다음 변경 필요
                if(maps.google.config.map) {
                    maps.google.config.radius = getValue;
                    maps.google.radiusRefresh();
                }
                
                // 2017.01.11 다음 추가
                if(maps.daum.config.map) {
                    maps.daum.config.radius = getValue;
                    maps.daum.radiusRefresh();
                }

                layerPopup.config.saveBtn.html('검색반경 <em>'+ $(this).text() + '</em>');
                
                layerPopup.closePopup('#'+layerId);
            });         
        },
        
        /*
        * 팝업 오픈
        * @param {String} id 팝업의 #id
        * @param {Boolean} isAnimation 팝업 애니메이션 유무
        * @param {Boolean} isCallbackNotSizeType 값이 true일 경우 팝업 오픈후 sizeType 콜백 실행 안함
        */
        openPopup : function(id, isDefaultShow, isCallbackNotSizeType) {
            var config = layerPopup.config,
                $target = $(id),
                getId = id;
                
            if(!$target.length || $target.is(':visible')) { 
                // 레이어 팝업 사이즈 정의
                layerPopup.sizeType(getId); 
                return; 
            }
            
            var getWidth = ns.global.bw - config.marginRL;

            if($target.hasClass('fullLayer') || $target.hasClass('comeUp')) { getWidth = ns.global.bw }
            
            // 2017.01.11 접근성 추가 (팝업 닫기버튼은 타이틀 다음에 위치해야합니다)
            if($target.find('.popClose').length > 0 && !$target.hasClass('newType')) {
                $target.find('> .popTop').after($target.find('.popClose'));
            }
            
            if(isDefaultShow) {

                $target.css({
                    width: getWidth+'px',
                }).show().css({
                    position: 'relative',
                    top: 0,
                    margin: 0,
                    zIndex : 10
                });
                layerPopup.inSwiperEvents(getId);   

            } else {

                // 2017.01.03 접근성 추가 모든 레이어팝업은 body 하단에 들어감 (팝업 실행시 content에 aria-hidden="true"가 되므로 content내부에 있으면 안됨)
                if($target.parent().attr('id') !== 'Wrap'){
                    $('#Wrap').append($target);
                }
                
                // type에 따른 layerPopup의 가로 값 설정
                $target.css({
                    width: getWidth+'px',
                }).stop(true, false).fadeIn(layerPopup.config.duration, function() {
                    
                    // 2017.01.15 특정 기기 모바일웹 주소바로 인해 높이가 제대로 안잡혀 팝업 오픈 후 사이즈 재정의
                    if(!isCallbackNotSizeType && !$target.hasClass('comeUp')) { layerPopup.sizeType(getId); }
                });
                            
                /* 
                * 딤이 없을 경우에만 스크롤 탑 저장
                * 팝업 실행 후 또 레이어팝업 실행할 경우 대비
                
                if(!$('.dim').length){
                    util.disableScroll(true);
                }
                */
                util.disableScroll(true);
                
                waiAccessibility.goFocus($target);

                /*
                * 2016.11.27
                * 회원가입 팝업 오픈 후 약관 팝업 확인시 회원가입 팝업이 닫히는 부분으로 인하여 주석
                */      
                // layerPopup.siblingsClose($(id));
                
                // 레이어 팝업 사이즈 정의
                layerPopup.sizeType(getId);     

                // 레이어 팝업 내부 스와이프 이벤트
                layerPopup.inSwiperEvents(getId);           
                
                
                // .dim 엘리먼트 생성
                
                if(!$target.hasClass('fullLayer')) {
                    layerPopup.createDim(layerPopup.config.duration);
                }

                // layerPopup.createDim(layerPopup.config.duration);
                            
                // 팝업 내부에 centerBox가 있을 때 가운데 정렬
                common.centerAlign();
                
                // 2016.10.05 개발 관련 trigger 이벤트
                $target.trigger('change', [$target]);
                
                // 2017.01.03 구글 -> 다음 변경 필요
                if($target.find('#googleMap').length > 0 && maps.google.config.map) {
                    var apiGoogle = maps.google,
                        googleConfig = apiGoogle.config,
                        googleMap = googleConfig.map;
                    apiGoogle.setHeight();
                    google.maps.event.trigger(googleMap, 'resize');
                    googleMap.setCenter(googleConfig.markers[0].getPosition());
                }
                
                // 2017.01.11 다음 지도 추가
                if($target.find('#daumMap').length > 0 && maps.daum.config.map) {
                    var apiDaum = maps.daum,
                        daumConfig = apiDaum.config,
                        daumMap = daumConfig.map;
                    apiDaum.setHeight();
                    daumConfig.map.relayout();
                    daumConfig.map.setCenter(daumConfig.markers[0].getPosition());
                }
                
                // 2017.01.02 접근성 추가(팝업 오픈시 팝업 밖으로 포커스 이동 방지)
                $('#content, footer, .topHead, .backBtn').attr('aria-hidden', true);

                //2017.10.11 팝업안에 newType 탭이 존재할 경우
                if($target.find('.tabJs.newType').length > 0) {
                    commonJs.tabsSetup();
                };
                
                //2018.08.23 팝업안에 minContent 클래스가 존재할 때
                if($target.find('.minContent').length > 0) {
                    common.minHeightSet('popup', id)
                };
            }
        },
        
        /**
        * 팝업 닫기 호출
        * @param {String} id 해당 팝업의 #id
        */
        closePopup : function(id, callback) {
            var config = layerPopup.config,
                $target = $(id),
                $popCont = $target.find('> .popCont'),
                duration = config.duration;
            
            // 명세서 레이어팝업 애니메이션
            if($target.hasClass('layerStatement')){
                duration = layerPopup.config.duration * 3;
                $popCont.animate({
                    marginTop : '200%'
                }, {
                    duration: duration,
                    complete : function(){
                        $(this).css('margin-top','0');
                        util.disableScroll(false);
                    }
                });
                layerPopup.removeDim(duration);
            } else if($target.hasClass('comeUp')) {
                //2017.08.01 박진수_아래에서 올라오는 팝업 CSS초기화
                $target.css({height: 'auto', webkitTransform: 'translate3d(0, '+ $target.innerHeight() +'px, 0)', transition: 'none'});
                $popCont.scrollTop(0);
                layerPopup.removeDim(duration);
                util.disableScroll(false);  
            } else {
                /*
                * 2016.11.27
                * 이중 레이어 팝업일 때 마지막 팝업 닫을 때 dim 삭제
                */
                /*
                if($(config.wrap).not('.fullLayer').filter(':visible').length === 1 && !$target.hasClass('fullLayer')) {
                    layerPopup.removeDim(duration);
                }
                */
                layerPopup.removeDim(duration);
                util.disableScroll(false);  
            }
            
            // 팝업 hide
            $target.stop(true, false).fadeOut(duration, function() {
                
                // 2017.01.12 callback 추가
                if(typeof callback === 'function') {
                    callback();
                }               
                
                // 2016.10.31 접근성 포커스 추가
                if(config.saveBtn) {
                    config.saveBtn.focus();
                    config.saveBtn = null;
                }
            });
            

            
            // 2017.01.02 접근성 추가(팝업 오픈시 팝업 밖으로 포커스 이동 방지)
            $('#content, footer, .topHead, .backBtn').attr('aria-hidden', false);
        },
        
        
        
        /*
        * 딤 생성
        */
        createDim : function(duration) {
            var $dim = $('.dim');
            
            if(!$dim.length) {
                $('body').append('<div class="dim"></div');
            }
            $('.dim').stop(true, false).fadeIn(duration);
        },
        
        /*
        * 딤 삭제
        * @param duration duration 값
        */
        removeDim : function(duration) {
            var $dim = $('.dim');
            
            if($('.layerWrap').filter(':visible').length === 1 || !$('.layerWrap').filter(':visible').length){
                $dim.stop(true, false).fadeOut(duration, function() {
                    $(this).remove();
                });
            }
        },
        

        /*
        * 형제 팝업 숨기기
        * @param {jQuery | HTMLElement} target 팝업 타겟
        */
        siblingsClose : function(target) {
            var $target = $(target);
            
            $target.siblings('.layerWrap').stop(true,false).fadeOut(layerPopup.config.duration);
        },
        
        /*
        * 팝업 풀사이즈
        */
        full : function(elem) {
            var $target = $(elem),
                $targetHeader = $target.find('.popTop').length > 0 ? $target.find('.popTop') : $target.find('.topHead'),
                $targetCont = $target.find('.popCont'),
                targetContP = 0,
                winWidth = ns.global.bw,
                winHeight = ns.global.bh > $(window).innerHeight() ? $(window).innerHeight() : ns.global.bh,
                // winHeight = window.outerHeight,
                totalHeight = 0;
                
            $targetCont.removeAttr('style');            
            $target.css({
                width: '100%',
                height: winHeight,
                margin: 0,
                top: 0
            });
            targetContP = parseInt($targetCont.css('padding-top'), 10) + parseInt($targetCont.css('padding-bottom'), 10);
            
            totalHeight = winHeight - targetContP - $targetHeader.innerHeight();
            
            /*
            * 2016.11.09 수정
            * 전체메뉴 overflow-y 관련 수정
            */
            if($target.attr('id') === 'totalMenu') {

                // 2016.01.02 웹과 앱의 메뉴 cont의 marginTop 값이 틀려 totalHeight 재정의
                targetContP = $target.hasClass('totalMenuRE') ? $targetHeader.innerHeight() : targetContP;
                totalHeight = ns.global.bh - targetContP - parseInt($targetCont.css('margin-top'), 10);
                
                $targetCont.css('overflow', 'hidden');
                $targetCont.children('.menuList, .relationLink, .tmSetup, .bannerLink').wrapAll('<div class="menuWrap" />');
                
                
                $targetCont.css('height', totalHeight+'px');
                $targetCont.find('.menuWrap').css({
                    overflowScrolling: 'touch',
                    height: totalHeight+'px',
                    overflow : 'auto'
                });             
            } else {                
                $targetCont.css('height', totalHeight+'px');
                totalMenu.disablePopupScroll({
                    wrap : '.popCont.type2'
                });
            }
        },

        /*
        * 올라오는 UI
        */
        comeUp : function(elem) {
            var $target = $(elem),
                $targetHeader = $target.find('.popTop'),
                $targetCont = $target.find('.popCont'),
                winWidth = ns.global.bw,
                winHeight = $target.innerHeight() > Math.floor(ns.global.bh / 2) ? Math.floor(ns.global.bh / 2) : $target.innerHeight(),
                targetContP = 0,
                totalHeight = winHeight - $targetHeader.innerHeight();
            
            $targetCont.removeAttr('style');            
            $target.css({
                width: '100%',
                height: winHeight,
                webkitTransform: 'translate3d(0, 0, 0)',
                transition: 'all 400ms',
                margin: 0,
                bottom: 0
            });

            if(winHeight >= Math.floor(ns.global.bh / 2)) {
                $targetCont.css({
                    overflowScrolling: 'touch',
                    height: totalHeight+'px',
                    overflow : 'auto'
                });             
            }
        },
        
        /*
        * 팝업 가운데 정렬
        * @param {jQuery | HTMLElement} elem jquery 셀렉터
        * 팝업 사이즈가 디바이스 높이값보다 클경우 최대 높이 - 64
        */
        centerAlign : function(elem) {
            var config = layerPopup.config,
                $target = $(elem),
                $targetHeader = $target.find('.popTop'),
                $targetCont = $target.find('.popCont'),
                $alertBtnBox = $target.find('.btnBox'),
                targetHeight = 0,
                targetHeaderH = 0,
                targetContP = 0,
                alertBtnBoxH = 0,
                winWidth = ns.global.bw,
                winHeight = ns.global.bh,
                maxMarginTB = 64,
                maxMarginRL = config.marginRL,
                totalHeight = winHeight - maxMarginTB,
                getTop = 0,
                getHeight = 0;
                
            $targetCont.removeAttr('style');
            $target.css({
                // width: winWidth - maxMarginRL
                width: (winWidth - maxMarginRL) % 2 === 0 ? winWidth - maxMarginRL : (winWidth - maxMarginRL) + 1
            });
            
            targetHeight = $target.height();
            targetHeaderH = $targetHeader.length > 0 ? $targetHeader.height() + parseInt($targetHeader.css('border-bottom-width'), 10) : 0;     
            targetContP = parseInt($targetCont.css('padding-top'), 10) + parseInt($targetCont.css('padding-bottom'), 10);
            alertBtnBoxH = $alertBtnBox.length > 0 ? $alertBtnBox.height() : 0;
            
            // 팝업 높이가 전체 높이보다 클 경우
            if(targetHeight > totalHeight) {
                getTop = maxMarginTB / 2;
                getHeight = totalHeight - targetHeaderH - targetContP - alertBtnBoxH;
                
                // 2016.10.13 매출 전표 팝업 모션 추가
                if($target.hasClass('layerStatement')) {
                    $target.css({
                        top: '-100%',
                        marginTop: 0
                    }).animate({
                        top: getTop+'px'
                    });             
                            
                } else {
                    $target.css({
                        top: getTop+'px',

                        marginTop: 0
                    });
                }
                
                // 즉시결제 버튼이 있을 경우 버튼 높이 값 뺌
                if($target.find('.lyrFixBtnArea').length > 0) {
                    getHeight = getHeight - $target.find('.lyrFixBtnArea').innerHeight();
                }
                
                $target.find('.popCont').css('height', getHeight+'px');
            
            // 팝업 높이가 전체 높이보다 작을 경우
            } else {
                getTop = -(targetHeight / 2);
                
                // 2016.10.13 매출 전표 팝업 모션 추가
                if($target.hasClass('layerStatement')) {
                    $target.css({
                        top: '-100%',
                        marginTop: getTop + 'px'
                    }).animate({
                        top: '50%'
                    });             
                            
                } else {
                    $target.css({
                        top: '50%',
                        marginTop: getTop + 'px'
                    });                 
                }
            }
        },
        
        /**
        * col2 셀렉트 팝업 높이값 최대로 설정 (쿠폰함, 스타샵)
        */
        fullType2 : function(id) {
            var config = layerPopup.config,
                $target = $(id),
                $col1 = $target.find('ul.depth2'),
                $col2 = $target.find('ul.depth3'),
                $popTop = $target.find('.popTop'),
                $popCont = $target.find('.popCont'),
                $btn = $target.find('.btn'),
                $select = $target.find('.defalutSelect'),
                popTopHeight = $popTop.innerHeight(),
                btnHeight = $btn.innerHeight(),
                selectHeight = $select.length > 0 ? $select.innerHeight() : 0,
                maxMarginTB = 64,
                maxMarginRL = config.marginRL,
                totalHeight = ns.global.bh - (popTopHeight + btnHeight + selectHeight + maxMarginTB);
            
            $target.css({
                top: maxMarginTB/2+'px',
                width : ns.global.bw - maxMarginRL+'px'
                
            });
            
            if($col1.length> 0 && $col2.length >0) {
                $col1.css('height', totalHeight+'px');
                $col2.css('height', totalHeight+'px');
            } else {
                $popCont.css('height', (totalHeight-54)+'px');
            }
        },
        
        
        /**
        * 2016.11.28
        * 레이어 팝업 type 정의 ( full, fullTpye2, centerAlign )
        */
        sizeType : function(target) {
            var $target = $(target);
            if($target.hasClass('fullLayer')) {
                layerPopup.full($target);   
                
            // 2016.10.28 스타샵, 쿠폰함 팝업컨텐츠 사이즈 조정
            } else if($target.attr('id') === 'findBranch' || $target.find('.areaSearch').length > 0) {
                layerPopup.fullType2($target);
            } else if($target.hasClass('comeUp')) {
                layerPopup.comeUp($target);
            } else {                
                layerPopup.centerAlign($target);
            }       
        },
        
        /**
        * 2016.11.24
        * 팝업 오픈시 내부 스와이프 리프레시
        * primeLayer (vip 혜택 팝업)
        * couponBox (카드안내/신청 페이지 혜택 팝업) CR 
        */
        inSwiperEvents : function(id) {
            var config = layerPopup.config,
                $layerWrap = $(id),
                $popCont = $layerWrap.find('.popCont'),
                $layerNav = $layerWrap.find('.layerNav');
            
            /*
            * 2016.10.19
            * 팝업의 경우 스와이프의 css가 제대로 먹지 않아 팝업 실행 시 스와이프 refresh 메서드 실행
            */
            if($layerWrap.find('.swiperCon').length > 0) {
                
                if(config.saveBtn) {
                    var $slider = $layerWrap.find('.swiperCon > ul'),
                        $btn = config.saveBtn,
    //                  swiperIdx = $(id).find('.swiperCon').index('.swiperCon'),
                        btnIdx = -1;
                    
                    // 2016.11.15 primeLayer의 id를 가지고 있을 경우 infinite 모드가 false이므로 +1을 하지 않습니다.
                    //btnIdx = !id.match('primeLayer') ? $btn.parent('li').index()+1 : $btn.closest('li').index();
                    if(!id.match('primeLayer')) {
                        btnIdx = $btn.closest('li').index()+1;
                    } else {
                        if($btn.hasClass('couponBox')) {
                            btnIdx = $btn.index('.couponList .couponBox');
                        } else {
                            btnIdx = $btn.closest('li').index();
                        }

                        if($('body').hasClass('ios')) {
                            $layerWrap.find('.swiper').children('li').css({minHeight: $popCont.innerHeight() - $layerNav.innerHeight() + 1});
                        }
                    }
                    
                    /*
                    swipers.cont.$target[swiperIdx].refresh();
                    swipers.cont.$target[swiperIdx].currentTo(btnIdx);
                    */
                    
                    swipers.refresh($slider);
                    
                    if(btnIdx >= 0) {
                        swipers.currentTo($slider, btnIdx);
                    }
                }
            }
            
            if($layerWrap.find('.tabDep1').length > 0) {
                swipers.refresh($layerWrap.find('.tabDep1'));
            }
        },
        
        resize : function() {
            var $visiblePopup = $(layerPopup.config.wrap).filter(':visible');
            
            if($visiblePopup.length > 0) {
                $visiblePopup.each(function() {
                    layerPopup.sizeType($(this));                   
                });
            }
        }
        
    };
    
    /**
    * 통합메뉴 + 통합검색
    */
    totalMenu = {
        config : {
                totalMenuBtn : '.hmBtn',
                totalSearchBtn : '.btnTotalSearch',
                totalCloseBtn : '#totalMenu .popClose, #totalSearch .popClose',
                totalBackBtn : '.tmBack',
                totalMenuPop : '#totalMenu',
                totalSearchPop : '#totalSearch',
                totalMenuList : '.menuList',
                fixedControl : '.popTop, .srchArea',
                duration : 'fast',
                easing : ''
        },
        
        init : function() {         
            var config = totalMenu.config;
            
            if(config.totalMenuPop.length > 0) {
                $(config.totalMenuPop+', '+config.totalSearchPop).find(config.fixedControl).css({
                    position: 'absolute',
                    top: 0,
                    left: 0
                });
                totalMenu.bindEvents();
                
                // 2017.01.02 접근성 추가
                $('.tmToggle').find('> a').attr('title', '닫힘');
            }
        },
        
        bindEvents : function() {
            var config = totalMenu.config;
            
            // 메뉴 버튼
            $(config.totalMenuBtn).off('click.totalMenu');
            $(config.totalMenuBtn).on('click.totalMenu', function(e) {
                e.preventDefault();
                totalMenu.openPopup(config.totalMenuPop);
            });
            
            // 닫기 버튼
            $(config.totalCloseBtn).off('click.totalMenu');
            $(config.totalCloseBtn).on('click.totalMenu', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                var getId = '#' + $(this).closest('.layerWrap').attr('id');
                
                totalMenu.closePopup(getId);
            });
            
            // 2016.10.28  전체메뉴 드롭다운 추가
            $(config.totalMenuList).off('click.totalMenu');
            $(config.totalMenuList).on('click.totalMenu', 'li.tmToggle > a', function(e) {
                e.preventDefault();
                var $li = $(this).parent(),
                    $depth2 = $(this).next('ul');
                
                // 형제 메뉴가 열려 있을 경우 형제 메뉴 닫힘
                if($('.tmToggle').hasClass('on') && !$li.hasClass('on')) {
                    var $siblingsOn  = $('.tmToggle.on');
                    
                    // 형제 메뉴 클래스 제거
                    $siblingsOn.removeClass('on');
                    // 2017.01.02 접근성 추가
                    $siblingsOn.find('> a').attr('title', '닫힘');
                    // 형제 메뉴 전체 닫힘
                    $siblingsOn.children('ul').slideUp({
                        duration: 'fast',
                        complete : function() {
                            // 선택 메뉴 클래스 추가
                            $li.toggleClass('on');
                            
                            $depth2.stop(true,false).slideToggle('fast', function() {
                                // 2016.12.17 depth2 메뉴가 열렸을 때 스크롤 가운데 정렬
                                if($li.hasClass('on')) {
                                    var $menuWrap = $(config.totalMenuList).parent(),
                                        menuWrapOffsetTop = $menuWrap.offset().top,
                                        menuWrapHeight = $menuWrap.innerHeight(),
                                        liHeight = $li.innerHeight(),
                                        liOffsetTop = $menuWrap.scrollTop() + $li.offset().top - menuWrapOffsetTop,
                                        average = (menuWrapHeight - liHeight) / 2,
                                        result = liOffsetTop - average;
                                        
                                    $menuWrap.stop(true, false).animate({
                                        scrollTop : result+'px'
                                        
                                    }, 'fast');
                                    
                                    // 2017.01.02 접근성 추가
                                    $li.find('> a').attr('title', '펼쳐짐');
                                } else {
                                    // 2017.01.02 접근성 추가
                                    $li.find('> a').attr('title', '닫힘');
                                }
                            });
                        }
                    });
                    
                // 메뉴 토글 기능
                } else {
                    $li.toggleClass('on');
                    $depth2.stop(true,false).slideToggle('fast', function() {
                        // 2016.12.17 depth2 메뉴가 열렸을 때 스크롤 가운데 정렬
                        if($li.hasClass('on')) {
                            var $menuWrap = $(config.totalMenuList).parent(),
                                menuWrapOffsetTop = $menuWrap.offset().top,
                                menuWrapHeight = $menuWrap.innerHeight(),
                                liHeight = $li.innerHeight(),
                                liOffsetTop = $menuWrap.scrollTop() + $li.offset().top - menuWrapOffsetTop,
                                average = (menuWrapHeight - liHeight) / 2,
                                result = liOffsetTop - average;
                                
                            $menuWrap.stop(true, false).animate({
                                scrollTop : result+'px'
                            }, 'fast');
                            
                            // 2017.01.02 접근성 추가
                            $li.find('> a').attr('title', '펼쳐짐');
                        } else {
                            // 2017.01.02 접근성 추가
                            $li.find('> a').attr('title', '닫힘');
                        }
                    });
                }
            });
        },
        
        /**
        * 토탈메뉴 animation
        * @param {jQuery | HTMLElement}elem 팝업 target
        * @param {String} oldValue animation 실행하기 전 css left 값 지정 ex) '100%'
        * @param {String} newValue animation 실행 후 css left 값 지정 ex) '100%'
        * @param {Function} callback 애니메이션 실행 후 콜백
        */
        animPop : function(elem, oldValue, newValue, callback) {
            var config = totalMenu.config,
                $target = $(elem);
            
            $target.show();
            
            // 2016.11.04 리사이즈 관련 추가
            layerPopup.full($target);
            
            $target.css({
                left: oldValue
            }).stop(true, true).animate({
                left: newValue
            }, {
                duration : config.duration,
                easing : config.easing,
                complete : function() {
                    if(typeof callback === 'function') {
                        callback();
                    }
                }
            });
        },
        
        /**
        * 전체 메뉴 or 전체 검색 오픈
        * @param {jQuery | HTMLElement} id 팝업 id
        */
        openPopup : function(id) {
            var config = totalMenu.config,
                $target = $(id);
            
            if(!$target.length) { return; }
            $target.css({
                display: 'block',
                zIndex: 9000
            });
            layerPopup.full(id);
            totalMenu.animPop(id, '100%', '0%', function() {
                // 2017.01.15 주소바로 인해 사이즈가 변경되는 경우때문에 메뉴 열린 후 사이즈 재정의
                layerPopup.full(id);
                
                totalMenu.disablePopupScroll({
                    wrap : '.menuWrap'
                });
                
                // 2017.01.02 접근성 추가(팝업 오픈시 팝업 첫번째 요소로 포커스 이동)
                waiAccessibility.goFocus($target);
            });
            
            util.disableScroll(true);
            
            // 2017.01.02 접근성 추가(팝업 오픈시 팝업 밖으로 포커스 이동 방지)
            $('#content, footer, .topHead, .backBtn').attr('aria-hidden', true);
        },
        
        /**
        * 전체 메뉴 or 전체 검색 오픈
        * @param {jQuery | HTMLElement} id 팝업 id
        */
        closePopup : function(id) {
            var config = totalMenu.config,          
                $target = $(id);
            
            if(!$target.length) { return; }
            totalMenu.animPop($target, '0%', '100%', function() {
                $target.hide();
                util.disableScroll(false);
            });
            
            $(config.totalSearchPop).find('.srchInput').removeClass('open');
            
            // 2017.01.02 접근성 추가(팝업 닫을 때 메뉴버튼으로 포커스 이동)
            $(config.totalMenuBtn).focus();
            
            //2017.01.05 피싱방지 코드 팝업 열려있을 경우 닫기
            if($('.icoSec > .txt').is(':visible')) {
                $('.icoSec > .txt').hide();
            }

            // 2017.01.02 접근성 추가(팝업 닫을 때 팝업 밖으로 포커스 이동 방지 해제)
            $('#content, footer, .topHead, .backBtn').attr('aria-hidden', false);
        },
        
        /**
        * 통합메뉴 -> 통합검색창 이동(전체 메뉴, 통합검색창 분리로 인해 현재 사용하지 않음)
        */
        changePopup : function() {
            var config = totalMenu.config,
                totalMenuPop = config.totalMenuPop,
                totalSearchPop = config.totalSearchPop; 
            
            if($(totalMenuPop).is(':visible')) {
                // 통합메뉴 왼쪽으로 밀림
                totalMenu.animPop(totalMenuPop, '0%', '-100%', function() {
                    $(config.totalMenuPop).hide();
                    
                    // 통합검색 포커스 이동
                    $(config.totalSearchPop).find('.srchInput input').focus();
                });
                
                // 통합검색창 오픈
                totalMenu.openPopup(totalSearchPop);
            } else if($(totalSearchPop).is(':visible')) {
                // 통합메뉴 왼쪽으로 밀림
                totalMenu.animPop(totalSearchPop, '0%', '100%', function() {
                    $(config.totalSearchPop).hide();
                    
                    // 통합메뉴 - 검색버튼 포커스 이동
                    $(config.totalSearchBtn).focus();
                });
                
                // 통합검색창 오픈
                totalMenu.animPop(totalMenuPop, '-100%', '0%');
                $(config.totalSearchPop).find('.srchInput').removeClass('open');
            }
        },
        
        /**
        * 메뉴 오픈(애니메이션 없음)
        */
        showMenu : function() {
            var config = totalMenu.config,
                $menu = $(config.totalMenuPop);
            
            $menu.css({
                display: 'block',
                left: 0,
                zIndex: 9000
            });
            layerPopup.full($menu);
            util.disableScroll(true);
        },
        
        /**
        * IOS에서 스크롤이 더 될 수 없는데도 스크롤할 경우 스크롤 duration이 끝나기전까지 스크롤 안되는 현상때문에 추가
        * @param opts wrap 엘리먼트와 contents 엘리먼트
        * @param opts.wrap 감싸는 요소
        * @param opts.contents 내부 요소
        */
        disablePopupScroll : function(opts) {
            var opts = opts || {},
                $target = $(opts.wrap),
                $cont = $target.find(opts.contents),
                totalContHeight = 0,
                touchPoint = {
                    start : 0,
                    move : 0
                };

            $target.scrollTop(0);
            $target.off('touchstart.minMaxCheck');
            $target.on('touchstart.minMaxCheck', function(e) {
                var orig = e.originalEvent,
                    point = (typeof orig.changedTouches !== 'undefined') ? orig.changedTouches : [orig];
                    touchPoint.start = point[0].pageY;      
                    
                totalContHeight = 0;    
                $target.children().each(function() {
                    totalContHeight += $(this).innerHeight();
                });         
            });
            $target.off('touchmove.minMaxCheck');
            $target.on('touchmove.minMaxCheck', function(e) {
                var orig = e.originalEvent,
                    point = (typeof orig.changedTouches !== 'undefined') ? orig.changedTouches : [orig],    
                    wrapScrollTop = $(this).scrollTop(),
                    wrapHeight = parseInt($(this).innerHeight(), 10),
                    contHeight = parseInt(totalContHeight, 10) - 2,
                    maxScrollTop = wrapHeight < contHeight ? contHeight - wrapHeight : 0;
                    
                    touchPoint.move = touchPoint.start - point[0].pageY;
                    
                    // 스크롤의 처음부분, 끝부분 체크하여 true일시 터치 스크롤 막기
                    if((touchPoint.move < 0 && wrapScrollTop <= 0) || (touchPoint.move > 0 && wrapScrollTop >= maxScrollTop)){
                        e.preventDefault();
                        e.stopPropagation();
                    }
                
            });     
        }
    };
    
    /**
    * 스크롤 시 특정 엘리먼트 상단 고정
    */
    scrollFixed = {
        init : function() {
            var config = null;
            
            scrollFixed.config = {
                target : $('.scrollFixed'),
                cont : $('.scrollFixed').siblings(),
                offsetTop : 0
            };
            
            config = scrollFixed.config;
            
            if(config.target.length > 0) {
                scrollFixed.bindEvents();
            }
        },
        
        bindEvents : function() {
            var config = scrollFixed.config,
                tabCheck = !config.target.hasClass('tabJs') && !config.target.children().hasClass('tabJs') && config.target.siblings('.tabCont').length > 0;
            
            config.offsetTop = config.target.offset().top;
            
            $(window).off('scroll.scrollFixed');
            $(window).on('scroll.scrollFixed', function() {
                var fixedTop = util.getFixItemTop(),
                    targetHeight = config.target.innerHeight();
                
                if(config.target.css('position') !== 'fixed' && config.offsetTop !== config.target.offset().top){
                    config.offsetTop = config.target.offset().top;
                }
                
                if($(window).scrollTop() > config.offsetTop-fixedTop) {
                    config.target.parent().css({
                        paddingTop: config.target.innerHeight()+'px'
                    });
                    
                    config.target.css({
                        position : 'fixed',
                        top: fixedTop+'px',
                        left: 0,
                        width: '100%',
                        zIndex: 100
                    });
                    

                    if(tabCheck) {
                        var $offsetCont = config.target.siblings('.tabCont');
                        
                        $offsetCont.each(function() {
                            // offset 값에서 scrollFixed 메뉴의 높이와 fixedItem의 높이를 더한값을 뺍니다.
                            var offsetTop = $(this).offset().top - (targetHeight + fixedTop),
                                offsetHeight = offsetTop + parseInt($(this).innerHeight(), 10),
                                winTop = $(window).scrollTop();
                            
                            
                            // 마지막 tabCont의 높이가 낮을경우 이전 tabCont의 타이틀이 활성화 되는 경우 방지
                            if(winTop + ns.global.bh >= parseInt($(document).innerHeight(), 10) - 5) {
                                var idx = $('.tabCont').length-1;
                                //ns.swipers.tab.$target[0].slideTo(idx);
                                swipers.slideTo(config.target.find('> .tabDep1'), idx);
                                
                            } else if(winTop >= offsetTop && winTop < offsetHeight) {
                                var idx = $(this).index('.tabCont');
                                //ns.swipers.tab.$target[0].slideTo(idx);
                                swipers.slideTo(config.target.find('> .tabDep1'), idx);
                            }
                        });
                    }
                    
                    
                } else {
                    config.target.removeAttr('style');
                    config.target.parent().css('padding-top', 0);
                    
                    if(tabCheck) {
                        //ns.swipers.tab.$target[0].slideTo(0);
                        swipers.slideTo(config.target.find('> .tabDep1'), 0);
                    }
                }
            });
            
            // scroll이동 이벤트 연결
            if(tabCheck) {
                config.target.off('click.scrollFixed');
                config.target.on('click.scrollFixed', 'a', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    var getHref = $(this).attr('href'),
                        $contTarget = $(getHref),
                        contOffsetTop = $contTarget.offset().top,
                        fixedTop = util.getFixItemTop() + config.target.innerHeight() - 1,
                        result = contOffsetTop - fixedTop;
                    
                    $('html, body').stop(true, false).animate({
                        scrollTop : result+'px'
                    });
                    
                });
            }
        }       
    };

    /**
    * maps ( google, daum map api )
    */  
    maps = {
        init : function() {
            maps.google.init();
            maps.daum.init();
        }
    };
    

    
    /**
    * daum maps
    */
    maps.daum = {
        config : {
            target : null,
            listTarget : '.daumMap',
            switchBtn : '.switchBtn',
            map : null,
            radius : 500,
            // 전체마커
            markers : [],
            // 현재 보이는 마커 인데 이건 또 뭐다냐...
            viewMarkers : [],
            currentMarker : null,
            radiusMarker : null,
            currentLocation : null,
            currentCircle : null,
            icon : {
                src : 'https://img1.kbcard.com/cxh/ia_img/BN/ico_mark.png',
                width : 39,
                height: 33
            }
        },
        init : function() {
            var config = maps.daum.config;

            if(config.switchBtn.length > 0) { maps.daum.activeSwitch(); }
            
            config.target = document.getElementById('daumMap');
            
            // 초기 높이값 설정
            if($(config.target).length > 0) {
                maps.daum.setHeight();
            }
            
            // list형식의 맵 초기화
            //if($(config.listTarget).length > 0) {
            //  maps.daum.listMaps($(config.listTarget));
            //}
            
            if($('.daumMap').length > 0) {
                maps.daum.listMaps('.daumMap');
            }
        },
        
        /**
        * 다음 지도 초기화
        * @param {Object} placeLocation 좌표 값
        */
        setup : function(placeLocation) {
            var apiDaum = maps.daum,
                config = apiDaum.config;
            
            // 텍스트일 때
            if(typeof placeLocation === 'string') {
                try {
                    var geocoder = new daum.maps.services.Geocoder();
    
                    geocoder.addr2coord(placeLoacation, function(status, result) {
                        if(status === daum.maps.services.Status.OK) {
                            var coords = new daum.maps.LatLng(result.addr[0].lat, result.addr[0].lng);
                    
                            config.map = new daum.maps.Map(config.target, {
                                center : coords,
                                level : 3
                            });
                            
                            apiDaum.addMarker(coords);
                        }
                    });     
                            
                } catch(e) {
                    
                    console.log(e);
                    return;
                }
                
            // 텍스트가 아닐 때
            } else {
                try {
                    var coords = new daum.maps.LatLng(placeLocation.lat, placeLocation.lng);
                    config.map = new daum.maps.Map(config.target, {
                        center : coords,
                        level : 3
                    });
                    
                    apiDaum.addMarker(placeLocation);
                } catch(e) {
                    
                    console.log(e);
                    return;
                }
            }
                        
            //apiDaum.setHeight();
        },
        
        /**
        * 키워드로 검색
        * @param opts 파라메터 옵션 값
        * @param opts.keyword 검색할 키워드
        * @param opts.lat 중심이 될 좌표 값 (latitude)
        * @param opts.lng 중심이 될 좌표 값 (longitude)
        * @param opts.radius 반경 설정 ( default 값은 500 )
        * @example
        * commonJs.daumMaps.placeSetup({
            keyword : '스타벅스',
            lat : 37.566826,
            lng : 126.9786567,
            radius : 500
        * });
        */
        placeSetup : function(opts) {
            var apiDaum = maps.daum,
                config = apiDaum.config,
                paramOpts = opts || {},
                keyword = paramOpts.keyword,
                lat = paramOpts.lat,
                lng = paramOpts.lng,
                radius = paramOpts.radius || 500,
                params = '&query='+keyword+'&location='+lat+', '+lng+'&radius='+radius,
                centerLocation = new daum.maps.LatLng(lat, lng);
            
            config.map = new daum.maps.Map(config.target, {
                center : centerLocation,
                level : 3
            });
            
            $.ajax({
                //url : '//apis.daum.net/local/v1/search/keyword.json?apikey=a4eafe4d1b9e96f6291377d28e40c29f',
                url : '//dapi.kakao.com/v2/local/search/keyword.json?apikey=32903a14f0dca5640d4816c24e225c2d',
                data : params,
                dataType : "jsonp",
                type : 'get',
                success : function(data) {
                    console.log(data);
                    var getList = data.channel.item,
                        bounds = new daum.maps.LatLngBounds();
                        
                    for(var i=0, len = getList.length; i < len; i++) {
                        var getPlace = getList[i],
                            location = new daum.maps.LatLng(getPlace.latitude, getPlace.longitude);
                        
                        apiDaum.addMarker(location);
                        
                        // 저장한 마커 좌표값을 bounds 객체에 추가
                        bounds.extend(location);
                    }
                    
                    // bounds 객체에 추가된 좌표들을 기준으로 지도 레벨 재설정
                    config.map.setBounds(bounds);           
                }
            });
            
        },
        
        /**
        * 반경 내 검색
        * @param opts 옵션 값
        * @param opts.currentLocation 현재위치 옵션값
        * @param opts.locationList 마커 리스트
        */
        radiusSetup : function(opts) {
            var apiDaum = maps.daum,
                config = apiDaum.config;
            
            try {

                var coords = new daum.maps.LatLng(opts.currentLocation.lat, opts.currentLocation.lng);
                
                // 맵 생성이 안되어 있을 경우 map 생성
                if(!$(config.target).data('daumMap')) {
                    config.map = new daum.maps.Map(config.target, {
                        center : coords,
                        level : 3
                    });
                    
                    $(config.target).data('daumMap', config.map);
                }
                
                //지도 높이 지정
                apiDaum.setHeight();
                
                // 마커의 좌표 리스트가 있을 경우 마커 생성
                try{
                    if(opts.locationList){
                        apiDaum.addAllMarker(opts.locationList);    
                    }
                }catch(e){
                    console.log(e);
                }
                
                // 현재 위치 좌표가 있을 경우 현재위치 마커
                if(opts.currentLocation) {
                    apiDaum.setCurrentMarker(opts.currentLocation);
                    try{
                        apiDaum.setRadiusMarker(opts.currentLocation); //[할일]
                    }catch(e){
                        alert(e);
                    }
                    
                }
            } catch(e) {
                console.log(e);
            }
        },
        
        setRadiusMarker : function(location) {
            
            var apiDaum = maps.daum,
            config = apiDaum.config,
            daumMap = config.map,
            radiusMarker = config.radiusMarker,
            //getLocation = {lat : location.lat * 1 , lng : location.lng * 1 };
            getLocation = new daum.maps.LatLng(location.lat * 1 , location.lng * 1 );

            config.currentLocation = getLocation;
            
            // 현재 위치로 이동
            daumMap.setCenter(getLocation);
            
            // 기존 마커 삭제
            if(radiusMarker) { radiusMarker.setMap(null); }
            
            // 마커 생성
            config.radiusMarker = new daum.maps.Marker({
                position : getLocation,
                map : daumMap,
                icon : null
            });
            
            config.radiusMarker.setVisible(false);
            
            apiDaum.radiusRefresh(location.lat * 1,location.lng * 1);
        },
        
        /**
        * 리스트 타입의 맵 초기화
        * target은 .daumMap으로 고정
        * .daumMap 엘리먼트에 data-lat과 data-lng 속성 필요
        */
        listMaps : function(target) {
            
            try{
                
                var apiDaum = maps.daum,
                config = apiDaum.config,
                icon = config.icon,
                $target = $(target);
            
                $target.each(function() {
                    $(this).css('height', '150px');
                    var dataLat = $(this).data('lat'),
                        dataLng = $(this).data('lng'),
                        location = new daum.maps.LatLng(dataLat, dataLng),
                        imageSrc = icon.src,
                        imageSize = new daum.maps.Size(icon.width, icon.height),
                        markerImage = new daum.maps.MarkerImage(imageSrc, imageSize);
                    
                    var map = new daum.maps.Map(this, {
                        center : location,
                        level : 5
                    });
                    var markerOptions = {
                            map : map,
                            position: location,
                            image: markerImage
                        };
                    //$(config.target).data('daumMap', config.map);
                    var marker = new daum.maps.Marker(markerOptions);
                    //marker.setMap(map);
                    $(this).data('map', map);
                    
                });
                
            }catch(e){
                console.log(e);
            }
            
        },
    
        /**
        * 마커 생성
        * @param {Object} location 마커를 표시할 좌표 값 ex) {lat:32, lng: 120}
        * @param {Object} content 마커에 저장할 content 값 
        * @param {Number} index 마커의 index 값
        */
        addMarker : function(opts, index) {
            var apiDaum = maps.daum,
                config = apiDaum.config,
                icon = config.icon,
                getLocation = new daum.maps.LatLng(opts.location.lat, opts.location.lng);
                //마커 인덱스 값 추가
                //location.content.index = index;
            var imageSrc = icon.src,
                imageSize = new daum.maps.Size(icon.width, icon.height),
                markerImage = new daum.maps.MarkerImage(imageSrc, imageSize),
                markerOptions = {
                    position: getLocation,
                    image: markerImage,
                    content : opts.content
                };
    
            var marker = new daum.maps.Marker(markerOptions);
            
            marker.setMap(config.map);
            
            // 정보가 있을 때
            if(opts.content) {
                // 마커 정보 저장
                $(marker).data('info',opts.content);
                // 마커 index 값 저장
                $(marker).data('index', index);
                // 마커 클릭 이벤트
                daum.maps.event.addListener(marker, 'click', function() {
                    // 클릭한 마커 기준으로 rectangle area 생성
                    try{
                        apiDaum.rectangles(marker, index,opts.location.lat, opts.location.lng);
                    } catch(e) {
                        console.log(e);
                    }

                });
            }
            // 마커 저장
            config.markers.push(marker);
        },
        
        
                /**
        * 영역을 구분해서 겹치는 마커 체크
        * @param marker area를 생성시킬 marker 타겟
        */  
        rectangles : function(marker, idx,lat,lng) {
            var apiDaum = maps.daum,
                config = apiDaum.config,
                icon = config.icon;
                
            var getCurrentBounds = apiDaum.getCurrentBounds(marker.getPosition());
            
            var rectangle = new daum.maps.Rectangle({
                /*
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                */
                bounds : getCurrentBounds,
                map: config.map,
                editable: true
            });

            var getSouthWest = rectangle.getBounds().getSouthWest(),
            getNorthEast = rectangle.getBounds().getNorthEast(),
            startLat = parseFloat(getSouthWest.getLat()),
            startLng = parseFloat(getSouthWest.getLng()),
            endLat = parseFloat(getNorthEast.getLat()),
            endLng = parseFloat(getNorthEast.getLng());
            
            // 겹치는 마커 체크
            var getOverLap = apiDaum.getOverLapMarker(startLat, startLng, endLat, endLng, idx);
            
            apiDaum.getClickMarkerInfo(marker, getOverLap,lat,lng);
            
            rectangle.setMap(null);
            
        },
        
        /**
        * 겹침 마커 클릭시 마커 리스트 팝업 생성
        */
        createListLayer : function(targetContent, markerContentList) {
            var apiDaum = maps.daum,
                config = apiDaum.config,
                getMarkers = markerContentList,
                $layerWrap = $('<div id="markerListLayer"class="layerWrap" />'),
                $layerPopTop = $('<div class="popTop" />'),

                $layerPopCont = $('<div class="popCont type2" />'),
                $layerClose = $('<span class="popClose" />'),
                $layerCloseBtn = $('<a href="#" />'),
                $ul = $('<div class="selectList searchPlace" />');
            
            // 리스트 생성
            function addList(content) {
                var $li = $('<li />'),
                    $a = $('<a href="#" />');
                    
                $a.text(content.title);
                $a.data('content', content); 
                
                $li.append($a);
                
                return $li;

            }
            
            // 리스트레이어가 생성되어있을때 삭제 후 재생성
            if($('#markerListLayer').length > 0) {
                $('#markerListLayer').remove();
            }
            
            // 클릭한 target 가장 처음 생성
            $ul.append(addList(targetContent));
            
            // 받아온 마커의 정보를 태그 생성 후 태그에 저장
            for(var i=0, len=getMarkers.length; i < len; i++) {
                var markerContent = getMarkers[i];
                
                $ul.append(addList(markerContent));
            }
            $layerCloseBtn.text('닫기');
            $layerClose.append($layerCloseBtn);
            $layerPopCont.append($ul);
            $layerPopTop.html('<strong class="fs2">가맹점 리스트</strong>')           
            $layerWrap.append($layerPopTop);
            $layerWrap.append($layerPopCont);
            $layerWrap.append($layerClose);         
            
            // 리스트 팝업 생성
            $('.mapArea > .inner, .mapType').append($layerWrap);
                        
            // 팝업 오픈
            layerPopup.openPopup($layerWrap, false, true);

            // 팝업 css 정의
            $layerWrap.css({
                'position': 'absolute',
                'top' : 0,
                'margin-top' : 0
            });         
            
            /*
            apiGoogle.setListHeight($layerWrap);
            
            // 리스트 클릭시 정보 set
            $layerWrap.on('click', '.searchPlace a', function(e) {
                e.preventDefault();
                apiGoogle.setInfo($(this).data('content'));
            });
            */
        },
        
        
        
        /**
        * 마커 전체 생성
        * @param opts 옵션 값
        * @param {Array} opts.locationList 마커 리스트
        */
        addAllMarker : function(opts) {
            var apiDaum = maps.daum,
                list = opts,
                listLen = list.length,
                config = apiDaum.config,
                bounds = new daum.maps.LatLngBounds(),
                getLocation,
                getInfo;
                
                apiDaum.removeAllMarker();
                
            for(var i = 0, len = listLen; i < len; i++) {
                var getPlace = list[i];
                // 좌표 저장
                getLocation = new daum.maps.LatLng(getPlace.location.lat, getPlace.location.lng);
                // 정보가 있을 경우 저장
                //getInfo = getPlace.content ? getPlace.content : null;
                //마커 추가
                apiDaum.addMarker(list[i], i);
                
                // 저장한 마커 좌표값을 bounds 객체에 추가
                bounds.extend(getLocation);
            }
            
            // bounds에 추가된 좌표들을 기준으로 지도 레벨 재정의
            config.map.setBounds(bounds);
        },
        
        /**
        * 마커 전체 삭제
        */
        removeAllMarker : function() {
            var apiDaum = maps.daum,
            config = apiDaum.config,
            markerList = config.markers;
            
            for(var i=0, len=markerList.length; i<len; i++) {
                markerList[i].setMap(null);
            }
            
            config.markers = [];
        },
        
        /**
        * 반경 검색 새로 고침
        */
        radiusRefresh : function(lat,lng) {
            var apiDaum = maps.daum,
                config = apiDaum.config,
                markerList = config.markers;

            if(markerList.length > 0) {
                apiDaum.setInfo($(markerList[0]).data('info'),lat,lng);
            }
        },
        
        /**
        * 맵 새로 고침
        */
        refreshMap : function() {
            var apiDaum = maps.daum,
                config = apiDaum.config;
                
            apiDaum.setHeight();
            config.map.relayout();      
        },
        
        /**
        * 지도형, 목록형 show / hide
        */
        activeSwitch : function() {
            var apiDaum = maps.daum,
                config = apiDaum.config,
                $activeBtn = $(config.switchBtn).filter('.on'),         //
                getIndex = $activeBtn.index(config.switchBtn),
                $viewList = $activeBtn.closest('.fncArea').siblings(),
                $listType = $viewList.filter('.listType, .listArea'),
                $mapType = $viewList.filter('.mapType, .mapArea'),
                $activeList = null;
            
            if(getIndex === 0) {
                $activeBtn.show();
                $activeBtn.next().hide();
                $listType.show();
                $mapType.hide();
            } else if (getIndex === 1) {
                $activeBtn.show();
                $activeBtn.prev().hide();
                $listType.hide();
                $mapType.show();
            }   
            
            // 리스트형, 지도 switch 버튼
            $(config.switchBtn).off('click.daumMap');
            $(config.switchBtn).on('click.daumMap', function(e) {
                  
                e.preventDefault();
                
                if(!config.markers.length) { return false; }

                if($(this).hasClass('on')) {
                    $(this).removeClass('on');
                    $(this).siblings(config.switchBtn).addClass('on');
                }
                
                apiDaum.activeSwitch();
                /*
                if(config.map) {        
                    apiDaum.refreshMap();
                }
                */
            });
        },
        
        /**
        * 마커 클릭 이벤트
        */
        getClickMarkerInfo : function(target,markers,lat,lng) {
            try{
                var apiDaum = maps.daum,
                config = apiDaum.config,
                $target = $(target),
                targetInfo = $target.data('info'),
                getMarkerArr = markers,
                getMarkerArrLen = getMarkerArr.length;
                
                // 얻어온 마커의 개수가 1개 이상일 때
                if(getMarkerArrLen > 0) {
                    var arr = [];
            
                // 마커들을 순회하며 arr에 info값 저장
                    for(var i=0; i< getMarkerArrLen ; i++) {
                        arr.push($(getMarkerArr[i]).data('info'));
                    }
                    
                    // 거리순으로 정렬
                    arr.sort(function(a, b) {
                        return a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0;
                    });
                    
                    // 넘겨준 배열로 리스트팝업 생성
                    apiDaum.setCreateInfoLayer(targetInfo, arr,lat,lng);
                }
                
                apiDaum.setInfo(targetInfo,lat,lng);
                
            }catch(e){
                console.log(e);
            }

        },
        
        /**
        * 겹치는 마커 체크
        */
        getOverLapMarker : function(startLat, startLng, endLat, endLng, idx) {
            var apiDaum = maps.daum,
                config = apiDaum.config;
                
            var viewList = config.markers,
                listLen = viewList.length,
                checked = 0,
                arr = [];
            
            for(var i=0; i< listLen; i++) {
                var inAreaCheck, equalCheck;
                
                var getMarkerBounds = apiDaum.getCurrentBounds(viewList[i].getPosition());
                
                var getSouthWest = getMarkerBounds.getSouthWest(),
                    getNorthEast = getMarkerBounds.getNorthEast(),
                
                    getStartLat = parseFloat(getSouthWest.getLat()),
                    getStartLng = parseFloat(getSouthWest.getLng()),
                    getEndLat = parseFloat(getNorthEast.getLat()),
                    getEndLng = parseFloat(getNorthEast.getLng());
                    
                    // 클릭한 마커와 겹치는지 체크
                    inAreaCheck = startLat <= getEndLat && endLat >= getStartLat && startLng <= getEndLng && endLng >= getStartLng,
                    
                    // 좌표가 완전히 일치하는지 체크
                    equalCheck = startLat === getStartLat && endLat === getEndLat && startLng === getStartLng && endLng === getEndLng;
    
                    if((inAreaCheck || equalCheck) && idx !== i){
                        checked++
                        arr.push(viewList[i]);
                    }
            }
            return arr;
        },
        
        /**
        * 지도 레벨에 따른 마커 width, height 값 반환
        */
        getMarkerWidthOrHeight : function(widthOrHeightValue, count) {
            var apidaum = maps.daum,
                config = apiDaum.config,
                result = widthOrHeightValue;
                
            for(var i=1; i<count; i++) {
                result = result * 2;
            }
            
            return result;
        },
        
        /**
        * 마커 크기만큼의 영역 좌표 get
        */
        getCurrentBounds : function(center) {
            var apiDaum = maps.daum,
                config = apiDaum.config,
                result = '';

            var getMapZoomLevel = config.map.getLevel();
            var scale = Math.pow(2, getMapZoomLevel);
            var proj = config.map.getProjection();
            var wc = proj.pointFromCoords(center);
            var bounds = new daum.maps.LatLngBounds();
            var sw = new daum.maps.Point(((wc.x * scale) - 10) / scale, ((wc.y * scale) - 31) / scale);
            bounds.extend(proj.coordsFromPoint(sw));
            var ne = new daum.maps.Point(((wc.x * scale) + 10) / scale, ((wc.y * scale)) / scale);
            bounds.extend(proj.coordsFromPoint(ne));        
            
            return bounds;
        },
        
        /**
        * 북동, 남서 좌표 값 return
        */
        getSwNe : function(position) {
            var boundsOrPosition = position;
            var getSoutWest = boundsOrPosition.getSouthWest(),
                getNorthEast = boundsOrPosition.getNorthEast(),
                startLat = parseFloat(getSouthWest.getLat()),
                startLng = parseFloat(getSouthWest.getLng()),
                endLat = parseFloat(getNorthEast.getLat()),
                endLng = parseFloat(getNorthEast.getLng());
                
            return {
                startLat : startLat,
                startLng : startLng,
                endLat : endLat,
                endLng : endLng
            }
        },
        
        /**
        * 현재 위치 주소 return
        * commonJs.googleMaps.getCurrentAddress(currentLocation, callback);
        * @param {Object} currentLocation 현재 좌표 값
        * @example
        * commonJs.daumMaps.getCurrentAddress({lat: 33.333, lng : 120.111}, function(address) {
        *       // address = 주소
        *       // code...
        * });       
        */
        getCurrentAddress: function(currentLatLng, callback) {
            /*var apiDaum = maps.daum,
                config = apiDaum.config,
                lat = paramOpts.lat,
                lng = paramOpts.lng,
                params = '&longitude=' + lng + '&latitude=' + lat + '&inputCoordSystem=WGS84&output=json';
                
            $.ajax({
                url : '//apis.daum.net/local/geo/coord2addr?apikey=a4eafe4d1b9e96f6291377d28e40c29f',
                data : params,
                dataType : "jsonp",
                type : 'get',
                success : function(data) {
                    if(typeof callback === 'function') {
                        callback(Data.fullName);
                    }
                }
            });*/
            
            /*var geocoder = new daum.maps.services.Geocoder(),
                getLocation = currentLatLng,
                latlng = new daum.maps.LatLng(currentLatLng.lat, currentLatLng.lng);
            
            geocoder.geocode({
                'latLng': latlng
            }, function(status,results) {
                if(status == daum.maps.services.Status.OK) {
                    callback(results[0].formatted_address);
                }
            });
            */
            
            var geocoder = new daum.maps.services.Geocoder();
            var latlng = new daum.maps.LatLng(currentLatLng.lat, currentLatLng.lng);
                /*
                geocoder.coord2detailaddr(latlng, function(status,result) {
                if(status == daum.maps.services.Status.OK) {
                    callback(result[0].jibunAddress.name);
                }
                */
                geocoder.coord2Address(latlng.getLng(), latlng.getLat(),function(result,status) {
                if(status === daum.maps.services.Status.OK) {
                    callback(result[0].address.address_name);
                }
            });
        },
        
        /*
        * 기준이 되는 마커 생성
        */
        setCurrentMarker : function(location) {
            var apiDaum = maps.daum,
            config = apiDaum.config,
            daumMap = config.map,
            currentMarker = config.currentMarker,
            //getLocation = {lat : location.lat * 1 , lng : location.lng * 1 };
            getLocation = new daum.maps.LatLng(location.lat * 1 , location.lng * 1 );

        
            // config.currentLocation = getLocation;
            try{
                // 현재 위치로 이동
                daumMap.setCenter(getLocation);             
            }catch(e){
                console.log(e);
            }
            // 현재 위치로 이동
            //daumMap.setCenter(getLocation);
            
            // 기존 마커 삭제
            if(currentMarker) { currentMarker.setMap(null); }
            
            // 마커 생성
            currentMarker = new daum.maps.Marker({
                map : daumMap,
                position : getLocation
            });
            
            currentMarker.setMap(daumMap);
            config.currentMarker = currentMarker;
            
        },
        
        /*
        * 지도 높이 값 설정
        */
        setHeight : function() {
            var apiDaum = maps.daum,
                config = apiDaum.config,
                $target = $(config.target);
            
            /*if($target.closest('.layerWrap').length > 0) {
                var $layerWrap = $target.closest('.layerWrap'),
                    $popCont = $layerWrap.find('.popCont'),
                    popContHeight = parseInt($popCont.height(), 10);
                    
                $target.css('height', popContHeight + 'px');
            } else if ($target.closest('.branchMap, .popupWrap').length > 0 && !$('.shopInfor').length) {
                var topHeadHeight = parseInt($('.topHead').innerHeight(), 10),
                    fncHeight = parseInt($('.fncArea').innerHeight(), 10),
                    total = 300;
                
                if(topHeadHeight > 0) {
                    total -= topHeadHeight;
                }
                
                if(fncHeight > 0) {
                    total -= fncHeight;
                }
                
                $target.css('height', total);
            } else {
                var getWidth = $target.closest('.starshopList').length > 0 ? $target.width() : $target.width() / 2;
                
                $target.css({
                    height : getWidth + 'px',
                    maxHeight : '300px'
                });
            }*/
            
            if($(config.target).closest('.layerWrap').length > 0) {
                var $layerWrap = $(config.target).closest('.layerWrap'),
                    $popCont = $layerWrap.find('.popCont'),
                    popContHeight = parseInt($popCont.height(), 10);
                
                $(config.target).css('height', popContHeight+'px');
            } else if($(config.target).closest('.branchMap, .popupWrap').length > 0 && !$('.shopInfor').length) {
                var topHeadHeight = parseInt($('.topHead').innerHeight(), 10),
                    fncHeight = parseInt($('.fncArea').innerHeight(), 10),
                    total = ns.global.bh;
                    
                if(topHeadHeight > 0) { 
                    total -= topHeadHeight;
                }
                
                if(fncHeight > 0) {
                    total -= fncHeight;
                }

                $(config.target).css('height', total);  
            } else {
                var getWidth = $(config.target).closest('.starshopView').length > 0 ? $(config.target).width() / 2 : $(config.target).width();
                
                
                $(config.target).css('height', getWidth+'px');
            }               
            
        },
        
        /**
        * 마커 크기만큼 사각형 그리기(영역 체크용)
        */
        setRactangle : function(curMarker, callback) {
            var apiDaum = maps.daum,
                config = apiDaum.config,
                
                // 지도에 표시할 사각형을 생성합니다.
                rectangle = new daum.maps.Rectangle({
                    bounds : apiDaum.getCurrentBounds(curMarker.getPosition()),
                    strokeWeight : 2,
                    strokeColor : '#FF0000',
                    strokeOpacity: 0.8,
                    strokeStyle : 'shortdashdot',
                    fillColor: '#FF0000',
                    fillOpacity: 0.35
                });
                
            // 지도에서 사각형을 표시합니다.
            ractangle.setMap(config.map);
                
            var rectBounds = apiDaum.getSwNe(rectangle.getBounds());
            
            if(typeof callback === 'function') {
                callback(rectBounds);
            }
            
            // 지도에서 사각형을 제거합니다.
            rectangle.setMap(null);
                
        },
        
        /**
        * 마커에 저장된 정보를 가져와 화면에 뿌림
        */
        setInfo : function(markerContent,lat,lng) {
            var getData = markerContent,
                getDataDistance = getData.distance,
                $mapArea = $('.mapArea, .mapType'),
                $branchInfo = $mapArea.find('.branchInfo'),
                $listType = $mapArea.find('.listType');
                
            // 스타샵 가맹점 정보
            if($listType.length > 0) {
                $listType.find('.distance').text(getDataDistance+'m');
                $listType.find('.category').text(getData.category);
                $listType.find('.tit').text(getData.title);
                $listType.find('.addr').text(getData.address);
                $listType.find('.thum > img').attr('src', getData.thumb);
                
                $listType.find('.benefit').empty();
                
                if(getData.mbrmchIdnfr) { $listType.find('a').attr('onclick', 'starShopManager.bztypDtail("' + getData.mbrmchIdnfr +'","list")'); }
                
                if(getData.benefit) {
                    if(getData.benefit.discount) { $listType.find('.benefit').append('<span>할인 <em class="fc2">' + getData.benefit.discount + '</em></span>'); }
                    if(getData.benefit.saving) { $listType.find('.benefit').append('<span>적립 <em class="fc5">' + getData.benefit.saving + '</em></span>'); }
                    if(getData.benefit.freePaymant) { $listType.find('.benefit').append('<span>무이자 <em class="fc6">' + getData.benefit.freePaymant + '</em></span>'); }
                }
                
                $branchInfo.find('.btnSS').attr('onClick', 'goApp('+lat+','+lng+')');
                
            } else if ($branchInfo.length > 0) {
                
                $branchInfo.find('.brName').text(getData.title);
                $branchInfo.find('.brAddr').text(getData.address);
                $branchInfo.find('.btnSS').attr('onClick', 'goApp('+lat+','+lng+')');
                
                // atm
                if($branchInfo.closest('.atmSearch').length > 0) {
                    $branchInfo.find('.distance').text(getDataDistance+'m');
                
                // 은행영업지점
                } else {
                    $branchInfo.find('.brTel').attr('href', 'tel:'+getData.tel);
                    $branchInfo.find('.brTel').text(getData.tel);
                    $branchInfo.find('.distance').text(getDataDistance + 'km');
                }
            }
            // 2017.01.13 개발관련 trigger 이벤트 추가 (선택된 info의 index값을 넘겨줌)
            // 임윤왕  구글에서 다음적용시 추가 ...... 사용하나?
            $(document).trigger('mapSetInfo', [getData.index]);
        },
        
        /**
        * 겹치는 마커 체크하여 레이어 팝업 생성
        */
        setCreateInfoLayer : function(targetInfo, markerInfoList,lat,lng) {
            var apiDaum = maps.daum,
                config = apiDaum.config,
                getMarkers = markerInfoList,
                $layerWrap = $('<div id="markerListLayer" class="layerWrap" />'),
                $layerPopTop = $('<div class="popTop" />'),
                
                $layerPopCont = $('<div class="popCont type2" />'),
                $layerClose = $('<span class="popClose" />'),
                $layerCloseBtn = $('<a href="#" />'),
                $ul = $('<div class="selectList searchPlace" />');
                
            // 리스트 생성
            function addList(content) {
                var $li = $('<li />'),
                    $a = $('<a href="#" />');
                
                $a.text(content.title);
                $a.data('info', content);
                
                $li.append($a);
                
                return $li;
            }
            
            // 리스트레이어가 생성되어있을 때 삭제 후 재생성
            if($('#markerListLayer').length >0) {
                $('#markerListLayer').remove();
            }
            
            // 클릭한 target을 가장 먼저 생성
            $ul.append(addList(targetInfo));
            
            // 받아온 마커의 정보를 태그 생성 후 태그에 저장
            for(var i=0, len=getMarkers.length; i< len; i++) {
                var markerContent = getMarkers[i];
                
                $ul.append(addList(markerContent));
            }
            
            $layerCloseBtn.text('닫기');
            $layerClose.append($layerCloseBtn);
            $layerPopCont.append($ul);
            $layerPopTop.html('<strong class="fs2">가맹점 리스트</strong>');
            $layerWrap.append($layerPopTop);
            $layerWrap.append($layerPopCont);
            $layerWrap.append($layerClose);
            
            // 리스트 팝업 생성
            $('.mapArea > .inner, .mapType').append($layerWrap);
            
            // 팝업 오픈
            layerPopup.openPopup($layerWrap);
            //$layerWrap.show();
            
            $layerWrap.css({
                'position' : 'absolute',
                'top' : 0,
                'margin-top' : 0
            });
            
            // 리스트 클릭시 정보 set
            $layerWrap.on('click', '.searchPlace a', function(e) {
                e.preventDefault();
                apiDaum.setInfo($(this).data('info'),lat,lng);
            });
        },
        
        /**
        * 반경 값 변경
        */
        setRadius : function(rValue) {
            var apiDaum = maps.daum,
                config = apiDaum.config,
                getRadius = parseInt(rValue, 10),
                selectLen = $('.srchRadius').find('select').length,
                idx = -1;
            
            switch(getRadius) {
                case 300 :
                    idx = 0;
                    break;
                case 500 :
                    idx = 1;
                    break;
                case 1000 :
                    idx = 2;
                    break;
                case 3000 :
                    idx = 3;
                    break;
            }
            
            if(idx > 1) {
                $('.srchRadius > .layerOpen > em').text(parseInt(getRadius)/1000 + 'km');
            } else {
                $('.srchRadius > .layerOpen > em').text(getRadius + 'm');
            }
            
            config.radius = getRadius;
            
            waiAccessibility.setAriaLabel({
                target : $('.srchRadius > .layerOpen'),
                type : 'button',
                title : '검색반경 레이어 팝업 링크',
                text : '검색반경 ' + $('.srchRadius > .layerOpen > em').text() + ' 선택됨 '
            });
            
            if(config.map) {
                //apiDaum.radiusRefresh();
            }
        }
    };
    
    /**
    * 구글 maps
    * 2017.01.03 구글 -> 다음 변경 필요
    */
    maps.google = {
        config : {
            target : document.getElementById('googleMap'),
            refreshBtn : '.btnCheck, .btnResrch',
            currentBtn : '.btnPoint',
            switchBtn : '.switchBtn',
            map : null,
            currentMarker : null,
            radiusMarker : null,
            currentLocation : null,
            currentCircle : null,
            // 전체 마커
            markers : [],
            // 현재 보이는 마커
            viewMarkers : [],
            radius : 500,
            infoIndex : 0
        },
        init : function() {
            var config = maps.google.config;
            
            if(config.switchBtn.length > 0) { maps.google.activeSwitch(); }
            
            if($(config.target).length > 0) {
                // 지도 높이 값 지정
                maps.google.setHeight();    
            }
            
            /**
            * 목록형 지도 테스트
            * 토글 on시 지도 refresh 필요
            * google.maps.event.trigger($('.googleMap').data('map'), 'resize');
            */
            if($('.googleMap').length > 0) {
                maps.google.listMaps('.googleMap');
            }
        },
        
        /**
        
        * 구글 맵 초기화
        * @param {Object} opts 좌표 데이터
        * @param {Object} opts.currentLocation 현재위치
        * @param {Object} opts.locationList 가맹점 데이터
        */
        setup : function(opts) {
            var apiGoogle = maps.google,
                config = apiGoogle.config;
                
            try {
                // 맵 초기화
                config.map = new google.maps.Map(config.target, {
                    // center: myLatLng,
                    disableDefaultUI : true,
                    zoom : 13
                });
            } catch(e) {
                
                console.log(e);
                return;
            }
            
            // 지도 높이 값 지정
            apiGoogle.setHeight();              
            
            // 마커의 좌표 리스트가 있을 경우 마커 생성
            if(opts.locationList) { 
                apiGoogle.addAllMarker(opts.locationList); 
            }
            
            // 현재 좌표값이 있을 경우 현재 좌표값 기준 마커 생성
            if(opts.currentLocation) { 
                apiGoogle.setCurrentMarker(opts.currentLocation);
                apiGoogle.setRadiusMarker(opts.currentLocation);
                
            // 현재 좌표를 제공하지 않을 때 넘겨받은 locationList[0]번째의 값으로 setCenter
            } else {
                apiGoogle.viewPlace(config.markers[0]);
            }
            
            apiGoogle.bindEvents();
            
            $(config.target).data('map', config.map);
        },
        
        /**
        * 목록형 리스트 맵 초기화
        * @param {jQuery | HTMLElement} target selector
        */
        listMaps : function(target) {
            var $target = $(target);
            
            $target.each(function() {
                var dataLat = $(this).data('lat'),
                    dataLng = $(this).data('lng');
                    
                var map = new google.maps.Map(this, {
                    center: {lat: dataLat, lng: dataLng},
                    disableDefaultUI : true,
                    navigationControl : false,
                    draggable: false,
                    zoom : 16
                });
                
                var marker = new google.maps.Marker({
                    position: {lat: dataLat, lng: dataLng},
                    map : map,
                    icon : {
                        // url: '../img/BN/ico_mark.png',
                        url: 'https://img1.kbcard.com/cxh/ia_img/BN/ico_mark.png',
                        size: new google.maps.Size(39, 33),
                        scaledSize: new google.maps.Size(39, 33)                
                    }
                });
                $(this).data('map', map);
                $(this).css('height', '150px');
            });         
        },
        
        bindEvents : function() {
            var apiGoogle = maps.google,
                config = apiGoogle.config;
            // 현재 위치 버튼
            $(config.currentBtn).off('click.googleMap');
            $(config.currentBtn).on('click.googleMap', function(e) {
                e.preventDefault();
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var pos = {
                            lat : position.coords.latitude,
                            lng : position.coords.longitude
                        };
                        
                        apiGoogle.setCurrentMarker(pos);
                    }, function() {
                        var pos = {
                            lat: 37.576035,
                            lng: 126.976915
                        };
                        
                        apiGoogle.setCurrentMarker(pos);
                    });
                } else {
                    //alert('지원하지않습니다.');
                }               
                
            }); 
            
            // 새로고침
            $(config.refreshBtn).off('click.googleMap');
            $(config.refreshBtn).on('click.googleMap', function(e) {
                e.preventDefault();
                
                var getCenter = config.map.getCenter(),
                    getPosition = {
                        lat : getCenter.lat(),
                        lng : getCenter.lng()
                    };
                // 마커 생성
                // apiGoogle.setRadiusMarker(getPosition);
                
                $(config.refreshBtn).trigger('googleMapRefresh', [getPosition]);
            });
            /*
            $(config.refreshBtn).on('googleMapRefresh', function(e, position){
                console.log(position);
            });
            */
        },
        
        /**
        * 맵 리프레시 메서드
        * @public
        */
        refreshMap : function() {
            var apiGoogle = maps.google,
                config = apiGoogle.config;
            
            if(config.map){ 
                apiGoogle.setHeight();
                google.maps.event.trigger(config.map, 'resize');
                config.map.setCenter(config.currentLocation);
                
                if(config.currentCircle) {  config.map.fitBounds(config.currentCircle.getBounds()); }

            }
        },
        
        /**
        * 새로고침 이벤트 (반경 및 포지션)
        */
        refreshPosition : function(opts) {
            var apiGoogle = maps.google,
                config = apiGoogle.config;
            
            apiGoogle.deleteMarkers();
            apiGoogle.addAllMarker(opts.locationList);
            apiGoogle.setRadiusMarker(opts.currentLocation);
        },
        
        /**
        * 지도형, 목록형 show / hide
        */
        activeSwitch : function() {
            var apiGoogle = maps.google,
                config = apiGoogle.config,
                $activeBtn = $(config.switchBtn).filter('.on'),
                getIndex = $activeBtn.index(config.switchBtn),
                $viewList = $activeBtn.closest('.fncArea').siblings(),
                $listType = $viewList.filter('.listType, .listArea'),
                $mapType = $viewList.filter('.mapType, .mapArea'),
                $activeList = null;

            if(getIndex === 0) {
                $activeBtn.show();
                $activeBtn.next().hide();
                $listType.show();
                $mapType.hide();
            } else if (getIndex === 1) {
                $activeBtn.show();
                $activeBtn.prev().hide();
                $listType.hide();
                $mapType.show();
            }   
            
            // 리스트형, 지도 switch 버튼
            $(config.switchBtn).off('click.googleMap');
            $(config.switchBtn).on('click.googleMap', function(e) {
                  
                e.preventDefault();
                
                if(!config.markers.length) { return false; }
                
                if($(this).hasClass('on')) {
                    $(this).removeClass('on');
                    $(this).siblings(config.switchBtn).addClass('on');
                }

                apiGoogle.activeSwitch();
                
                if(config.map) {        
                    apiGoogle.refreshMap();
                }
                
            });
        },
        
        /*
        * 현재 좌표 기준으로 반경 그리기
        */
        drawCircle : function() {
            var apiGoogle = maps.google,
                config = apiGoogle.config,
                googleMap = config.map,
                currentLocation = config.currentLocation,
                currentCircle = config.currentCircle,
                radius = config.radius;
            

            var circleOptions = {
                strokeColor : '#00a0e9',
                strokeOpacity: 0.1,
                strokeWeight: 2,
                fillColor: '#00a0e9',
                fillOpacity: 0.2,
                map: googleMap,
                center: currentLocation,
                radius: radius
            };

            // 기존 반경 삭제
            if(currentCircle) { currentCircle.setMap(null); }
            config.currentCircle = new google.maps.Circle(circleOptions);               
            googleMap.fitBounds(config.currentCircle.getBounds());
        },
    
        /**
        * 반경 내 마커 표시
        */
        viewMarker : function() {
            
            var apiGoogle = maps.google,
                config = apiGoogle.config,
                googleMap = config.map,
                radius = config.radius,
                markers = config.markers,
                radiusMarker = config.radiusMarker;
            
            
            config.viewMarkers = [];
            
            var geocoder = new google.maps.Geocoder(),
                listLen = markers.length,
                curPos = radiusMarker.getPosition(),
                distance = 0;
                
            // test
            var $div = $('<div />');
                
            for(var i=0; i<listLen; i++) {
                distance = apiGoogle.getDistance(markers[i].getPosition(), curPos);
                
                if(distance < radius) {
                    markers[i].setMap(googleMap);
                    markers[i].setAnimation(google.maps.Animation.DROP);
                    markers[i].distance = Math.round(distance);
                    
                    config.viewMarkers.push(markers[i]);
                } else {
                    markers[i].setMap(null);
                }
            }   
            
            // 객체 정렬 (distance 값으로 정렬)
            config.viewMarkers.sort(function(a,b) {
                return a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0;
            });
            
        },      
        
        /**
        * 특정 장소 marker 표시
        * @param placeMarker 넘겨받은 리스트의 첫번째 좌표
        */
        viewPlace : function(placeMarker) {
            var apiGoogle = maps.google,
                config = apiGoogle.config;
            
            
            placeMarker.setMap(config.map);
            apiGoogle.setInfo(placeMarker.content);
            apiGoogle.refreshMap();
            config.map.setCenter(placeMarker.getPosition());
            config.map.setZoom(16);
        },
        
        /**
        * 반경 설정
        * @public       
        */
        radiusRefresh : function() {
            var apiGoogle = maps.google,
                config = apiGoogle.config,
                getIdx = config.infoIndex !== '' ? parseInt(config.infoIndex, 10) : 0;
                
            // nearbySearch();
            apiGoogle.drawCircle();
            apiGoogle.viewMarker();
            
            if(config.viewMarkers.length > 0) {
                apiGoogle.setInfo(config.viewMarkers[getIdx].content);
            }
        },
        
        /*
        * 마커 생성
        * @param {Object} opts 좌표 및 콘텐츠 정보
        */
        addMarker : function(opts, idx) {
            var apiGoogle = maps.google,
                config = apiGoogle.config;
                
                // 마커 인덱스 값 추가
                opts.content.index = idx;
            
            var markerOptions = {
                position: opts.location,
                map : config.map,
                icon : {
                    // url: '../img/BN/ico_mark.png',
                    url: 'https://img1.kbcard.com/cxh/ia_img/BN/ico_mark.png',
                    size: new google.maps.Size(39, 33),
                    scaledSize: new google.maps.Size(39, 33)                
                },
                content : opts.content
            };
                
            // 마커 생성
            var marker = new google.maps.Marker(markerOptions);
            
            marker.addListener('mousedown', function() {
                apiGoogle.rectangles(marker, idx);
                
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 750);
            });
            
            // 현재 생성한 마커를 저장
            config.markers.push(marker);        
        },
        
        /*
        * 마커 전체 생성
        */
        addAllMarker : function(markerOpts) {
            var apiGoogle = maps.google,
                list = markerOpts,
                listLen = list.length;
            
            apiGoogle.deleteMarkers();
            for(var i = 0; i < listLen; i++) {              
                maps.google.addMarker(list[i], i);
            }       
        },
        
        /*
        * 마커 전체 표시
        */
        allViewMarker : function() {
            var apiGoogle = maps.google,
                config = apiGoogle.config;
            
            for(var i = 0, len = config.markers.length; i < len; i++) {
                config.markers[i].setMap(config.map);
            }
        },
        
        /**
        * 마커 안보이기
        */
        clearMarkers : function() {
            var apiGoogle = maps.google,
                config = apiGoogle.config;
            
            for(var i = 0, len = config.markers.length; i < len; i++) {
                config.markers[i].setMap(null);
            }
        },
        
        /**
        * 마커 삭제
        */
        deleteMarkers : function() {
            var apiGoogle = maps.google,
                config = apiGoogle.config;
            
            apiGoogle.clearMarkers();
            config.markers = [];
        },
        
        /*
        * 현재 반경내 표시된 marker중 선택 이벤트
        * @param {Number} index 반경내 가장 가까운 마커순으로 0부터 시작
        * @example
        * commonJs.googleMaps.activemarker(index);
        */
        activeMarker : function(index) {
            var apiGoogle = maps.google,
                config = apiGoogle.config,
                viewMarkers = config.viewMarkers;
            
            if(viewMarkers.length > 0) {
                config.map.setCenter(viewMarkers[index].location);
                apiGoogle.setInfo(viewMarkers[index].content);  
            }
        },
        
        /**
        * 영역을 구분해서 겹치는 마커 체크
        * @param marker area를 생성시킬 marker 타겟
        */  
        rectangles : function(marker, idx) {
            var apiGoogle = maps.google,
                config = apiGoogle.config;
            
            var getCurrentBounds = apiGoogle.getCurrentBounds(marker.getPosition());
            
            var rectangle = new google.maps.Rectangle({
                /*
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                */
                bounds : getCurrentBounds,
                map: config.map,
                editable: true
            });
            
            // 테스트
            
            var startLat = parseFloat(rectangle.getBounds().getSouthWest().lat());
            var startLng = parseFloat(rectangle.getBounds().getSouthWest().lng());
            var endLat = parseFloat(rectangle.getBounds().getNorthEast().lat());
            var endLng = parseFloat(rectangle.getBounds().getNorthEast().lng());
            
            // 겹치는 마커 체크
            var getOverLap = apiGoogle.getOverLapMarker(startLat, startLng, endLat, endLng, idx);
            
            apiGoogle.onClickMarker(marker, getOverLap);
            
            rectangle.setMap(null);

        },
        
        /**
        * 맵 높이 값 설정
        */
        setHeight : function() {
            var apiGoogle = maps.google,
                config = apiGoogle.config;
                
            /**
            * 높이값 설정
            * .shopInfor는 스타샵 상세페이지 분기용 클래스 체크
            */                  
            
            if($(config.target).closest('.layerWrap').length > 0) {
                var $layerWrap = $(config.target).closest('.layerWrap'),
                    $popCont = $layerWrap.find('.popCont'),
                    popContHeight = parseInt($popCont.height(), 10);
                
                $(config.target).css('height', popContHeight+'px');
            } else if($(config.target).closest('.branchMap, .popupWrap').length > 0 && !$('.shopInfor').length) {
                var topHeadHeight = parseInt($('.topHead').innerHeight(), 10),
                    fncHeight = parseInt($('.fncArea').innerHeight(), 10),
                    total = ns.global.bh;
                    
                if(topHeadHeight > 0) { 
                    total -= topHeadHeight;
                }
                
                if(fncHeight > 0) {
                    total -= fncHeight;
                }

                $(config.target).css('height', total);  
            } else {
                var getWidth = $(config.target).closest('.starshopView').length > 0 ? $(config.target).width() / 2 : $(config.target).width();
                
                
                $(config.target).css('height', getWidth+'px');
            }               
        },
        
        /*
        * 검색 반경 변경 메서드(필요할 경우 사용)
        * @param {Number} rValue 조정할 범위 값 (300, 500, 1000, 3000);
        */
        setRadius : function(rValue) {
            var apiGoogle = maps.google,
                config = apiGoogle.config,  
                getRadius = parseInt(rValue, 10),
                selectLen = $('.srchRadius').find('select').length,
                idx = -1;
                
            switch(getRadius) {
                case 300 :
                    idx = 0;
                    break;
                case 500 :
                    idx = 1;
                    break;
                case 1000 :
                    idx = 2;
                    break;
                case 3000 :
                    idx = 3;
                    break;
            }
            
            if(idx > 1) {
                $('.srchRadius > .layerOpen > em').text(parseInt(getRadius)/1000+'km')
            } else {
                $('.srchRadius > .layerOpen > em').text(getRadius+'m')
            }       
            
            config.radius = getRadius;
            
            //2017.01.07 접근성 추가 (검색반경 텍스트)
            waiAccessibility.setAriaLabel({
                target : $('.srchRadius > .layerOpen'),
                type : 'button',
                title : '검색반경 레이어 팝업 링크',
                text : '검색반경 ' + $('.srchRadius > .layerOpen > em').text() + ' 선택됨 '
            });
            
            if(config.map) {
                apiGoogle.radiusRefresh();  
            }

        },
                
        /*
        * 기준이 되는 마커 생성
        */
        setCurrentMarker : function(location) {
            var apiGoogle = maps.google,
                config = apiGoogle.config,
                googleMap = config.map,
                currentMarker = config.currentMarker,
                getLocation = {lat : location.lat * 1 , lng : location.lng * 1 };
            
            // config.currentLocation = getLocation;
            
            // 현재 위치로 이동
            googleMap.setCenter(getLocation);
            
            // 기존 마커 삭제
            if(currentMarker) { currentMarker.setMap(null); }
            
            // 마커 생성
            config.currentMarker = new google.maps.Marker({
                position : getLocation,
                map : googleMap
            });
        },
        
        /*
        * 범위내 검색용 마커
        */
        setRadiusMarker : function(location) {
            var apiGoogle = maps.google,
                config = apiGoogle.config,
                googleMap = config.map,
                radiusMarker = config.radiusMarker,
                getLocation = {lat : location.lat * 1 , lng : location.lng * 1 };
            
            config.currentLocation = getLocation;
            
            // 현재 위치로 이동
            googleMap.setCenter(getLocation);
            
            // 기존 마커 삭제
            if(radiusMarker) { radiusMarker.setMap(null); }
            
            // 마커 생성
            config.radiusMarker = new google.maps.Marker({
                position : getLocation,
                map : googleMap,
                icon : null
            });
            
            config.radiusMarker.setVisible(false);
            
            apiGoogle.radiusRefresh();
        },
        
        /**
        * 클릭한 마커의 정보 값을 받아옴
        * @param {Array | Object} markers 마커의 정보를 받아옴
        */
        onClickMarker : function(target, markers) {
            var apiGoogle = maps.google,
                config = apiGoogle.config,
                
                getMarkers = markers,
                getMarkerLength = getMarkers.length;
            
            
            if(getMarkerLength > 0) {
                var arr = [];
                for(var i = 0; i < getMarkerLength; i++) {
                    arr.push(getMarkers[i].content);
                }
                
                // 객체 정렬 (distance 값으로 정렬)
                arr.sort(function(a,b) {
                    return a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0;
                });
                
                // 넘겨주는 객체로 리스트팝업 생성
                apiGoogle.createListLayer(target.content, arr);
            }
            
            apiGoogle.setInfo(target.content);
        },
        
        /**
        * 겹침 마커 클릭시 마커 리스트 팝업 생성
        */
        createListLayer : function(targetContent, markerContentList) {
            var apiGoogle = maps.google,
                config = apiGoogle.config,
                getMarkers = markerContentList,
                $layerWrap = $('<div id="markerListLayer"class="layerWrap" />'),
                $layerPopTop = $('<div class="popTop" />'),

                $layerPopCont = $('<div class="popCont type2" />'),
                $layerClose = $('<span class="popClose" />'),
                $layerCloseBtn = $('<a href="#" />'),
                $ul = $('<div class="selectList searchPlace" />');
            
            // 리스트 생성
            function addList(content) {
                var $li = $('<li />'),
                    $a = $('<a href="#" />');
                    
                $a.text(content.title);
                $a.data('content', content); 
                
                $li.append($a);
                
                return $li;

            }
            
            // 리스트레이어가 생성되어있을때 삭제 후 재생성
            if($('#markerListLayer').length > 0) {
                $('#markerListLayer').remove();
            }
            
            // 클릭한 target 가장 처음 생성
            $ul.append(addList(targetContent));
            
            // 받아온 마커의 정보를 태그 생성 후 태그에 저장
            for(var i=0, len=getMarkers.length; i < len; i++) {
                var markerContent = getMarkers[i];
                
                $ul.append(addList(markerContent));
            }
            $layerCloseBtn.text('닫기');
            $layerClose.append($layerCloseBtn);
            $layerPopCont.append($ul);
            $layerPopTop.html('<strong class="fs2">가맹점 리스트</strong>')           
            $layerWrap.append($layerPopTop);
            $layerWrap.append($layerPopCont);
            $layerWrap.append($layerClose);         
            
            // 리스트 팝업 생성
            $('.mapArea > .inner, .mapType').append($layerWrap);
                        
            // 팝업 오픈
            layerPopup.openPopup($layerWrap, false, true);

            // 팝업 css 정의
            $layerWrap.css({
                'position': 'absolute',
                'top' : 0,
                'margin-top' : 0
            });         
            apiGoogle.setListHeight($layerWrap);
            
            // 리스트 클릭시 정보 set
            $layerWrap.on('click', '.searchPlace a', function(e) {
                e.preventDefault();
                apiGoogle.setInfo($(this).data('content'));
            });
        },

        
        /**
        * 리스트 팝업 센터 정렬
        * @param {jQuery | HTMLElement} 레이어 타겟
        */
        setListHeight : function(target) {
            var apiGoogle = maps.google,
                config = apiGoogle.config,
                $target = $(target),
                $mapArea = $('.mapArea, .mapType'),
                $branchInfo = $mapArea.find('.branchInfo'),
                $listType = $mapArea.find('.listType'),
                targetHeight = $target.innerHeight(),
                popTopHeight = $target.find('.popTop').innerHeight(),
                mapAreaOffsetTop = $mapArea.offset().top,       // 2017.01.05 접근성 포커스 이슈로인해 레이어가 바깥으로 빠짐으로써 높이값 지정을 위해 추가
                totalHeight = $mapArea.innerHeight(),

                boxHeight = 0,
                marginTB = 60;
                
            if($branchInfo.length > 0) {
                boxHeight += $branchInfo.innerHeight();
            } else if ($listType.length > 0 ) {
                boxHeight += $listType.innerHeight();
            }
            
            
            totalHeight -= boxHeight;
            
            if(targetHeight > totalHeight) {
                // 레이어 팝업의 .popTop 높이 값 빼기
                totalHeight -= popTopHeight;
                // 마진 값 빼기
                totalHeight -= marginTB;
                
                $target.css({
                    // top: 20+'px'
                    top: (20 + mapAreaOffsetTop) +'px'
                });
                $target.find('.popCont').css('height', totalHeight);
            } else {
                totalHeight -= targetHeight;
                $target.css({
                    // top: totalHeight / 2 + 'px'
                    top: (totalHeight / 2) + mapAreaOffsetTop + 'px'
                });
            }
                        
        },
        
        /**
        * place 정보 하단 레이어팝업으로 set
        */
        setInfo : function(getContent) {
            var getData = getContent,
                getDataDistance = getData.distance,
                $mapArea = $('.mapArea, .mapType'),
                $branchInfo = $mapArea.find('.branchInfo'),
                $listType = $mapArea.find('.listType');
            
            // 스타샵 가맹점 정보
            if($listType.length > 0) {
                        
                $listType.find('.distance').text(getDataDistance+'m');
                $listType.find('.category').text(getData.category);
                $listType.find('.tit').text(getData.title);
                $listType.find('.addr').text(getData.address);
                $listType.find('.thum > img').attr('src', getData.thumb);
                
                $listType.find('.benefit').empty();             
                
                if(getData.mbrmchIdnfr) { $listType.find('a').attr('onclick', 'starShopManager.bztypDtail("' + getData.mbrmchIdnfr +'")'); }
                
                if(getData.benefit.discount) { $listType.find('.benefit').append('<span>할인 <em class="fc2">'+ getData.benefit.discount +'</em></span>') } 
                if(getData.benefit.saving) { $listType.find('.benefit').append('<span>적립 <em class="fc5">'+ getData.benefit.saving +'</em></span>') } 
                if(getData.benefit.freePaymant) { $listType.find('.benefit').append('<span>무이자 <em class="fc6">'+ getData.benefit.freePaymant +'</em></span>') } 
                
            // 고객센터 atm, 은행영업지점 정보
            } else if ($branchInfo.length > 0) {
                
                $branchInfo.find('.brName').text(getData.title);
                $branchInfo.find('.brAddr').text(getData.address);
                
                // atm
                if($branchInfo.closest('.atmSearch').length > 0) {
                    $branchInfo.find('.distance').text(getDataDistance+'m');
                
                // 은행영업지점
                } else {
                    $branchInfo.find('.brName').append('('+getDataDistance+'km)');
                    $branchInfo.find('.brTel').attr('href', 'tel:'+ getData.tel);
                    $branchInfo.find('.brTel').text(getData.tel);
                }
            }
            
            // 2017.01.13 개발관련 trigger 이벤트 추가 (선택된 info의 index값을 넘겨줌)
            $(document).trigger('mapSetInfo', [getData.index]);
        },
        

        /**
        * 겹치는 마커 있는지 체크
        * @param startLat
        * @param startLng
        * @param endLat
        * @param endLng
        */
        getOverLapMarker : function(startLat, startLng, endLat, endLng, idx) {
            var apiGoogle = maps.google,
                config = apiGoogle.config;
                            
            var viewList = config.viewMarkers,
                listLen = viewList.length,
                checked = 0,
                arr = [];
            
            for(var i=0; i<listLen; i++) {
                var getMarkerBounds = apiGoogle.getCurrentBounds(viewList[i].getPosition()),
                    getStartLat = parseFloat(getMarkerBounds.getSouthWest().lat()),
                    getStartLng = parseFloat(getMarkerBounds.getSouthWest().lng()),
                    getEndLat = parseFloat(getMarkerBounds.getNorthEast().lat()),
                    getEndLng = parseFloat(getMarkerBounds.getNorthEast().lng()),
                    
                    // 클릭한 마커와 겹치는지 체크
                    inAreaCheck = startLat <= getEndLat && endLat >= getStartLat && startLng <= getEndLng && endLng >= getStartLng,
                    
                    // 좌표가 완전히 일치하는지 체크
                    equalCheck = startLat === getStartLat && endLat === getEndLat && startLng === getStartLng && endLng === getEndLng;
                
                /*
                * 겹치는 마커 체크
                */
                if((inAreaCheck || equalCheck) && idx !== i){
                    checked++
                    /*
                    영역 확인용
                    var rectangle = new google.maps.Rectangle({
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#FF0000',
                        fillOpacity: 0.35,              
                        bounds : getMarkerBounds,
                        map: config.map,
                        editable: true
                    });
                    */
                    arr.push(viewList[i]);
                }
            }
            
            // 저장한 마커를 리턴
            return arr;
        },
        
        /**
        * 포지션 값을 받아와 해당 포지션값에 rectangles 생성
        * @param center position(location) 값
        */
        getCurrentBounds : function(center) {
            var apiGoogle = maps.google,
                config = apiGoogle.config;  
                        
            var scale = Math.pow(2, config.map.getZoom());
            var proj = config.map.getProjection();
            var wc = proj.fromLatLngToPoint(center);
            var bounds = new google.maps.LatLngBounds();
            var sw = new google.maps.Point(((wc.x * scale) - 10) / scale, ((wc.y * scale) - 31) / scale);
            bounds.extend(proj.fromPointToLatLng(sw));
            var ne = new google.maps.Point(((wc.x * scale) + 10) / scale, ((wc.y * scale)) / scale);
            bounds.extend(proj.fromPointToLatLng(ne));
            
            return bounds;
        },      
        
        /*
        * radius 값 계산
        */
        getRad : function(x) {
            return x * Math.PI / 180;
        },
        
        /*
        * 현재 마커로부터 거리 측정
        */
        getDistance : function(p1, p2) {
            var apiGoogle = maps.google,
                R, dLat, dLong, a, c, d;
            
            R = 6378137;
            dLat = apiGoogle.getRad(p2.lat() - p1.lat());
            dLong = apiGoogle.getRad(p2.lng() - p1.lng());
            a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(apiGoogle.getRad(p1.lat())) * Math.cos(apiGoogle.getRad(p2.lat())) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            d = R * c;
            return d;
        },
        
        /**
        * 현재 위치 주소 return
        * commonJs.googleMaps.getCurrentAddress(currentLocation, callback);
        * @param {Object} currentLocation 현재 좌표 값
        * @example
        * commonJs.googleMaps.getCurrentAddress({lat: 33.333, lng : 120.111}, function(address) {
        *       // address = 주소
        *       // code...
        * });       
        */
        getCurrentAddress: function(currentLatLng, callback) {
            var geocoder = new google.maps.Geocoder(),
                getLocation = currentLatLng,
                latlng = new google.maps.LatLng(currentLatLng.lat, currentLatLng.lng);
            
            geocoder.geocode({
                'latLng': latlng
            }, function(results, status) {
                if(status == google.maps.GeocoderStatus.OK) {
                    callback(results[0].formatted_address);
                }
            });
        }
    }   
    
    /**********************************************************************
    * Public methods
    *
    * // 스와이프 초기화
    * commonJs.swipers.init();
    *
    * // 토글 초기화
    * commonJs.arcodians.init();
    *
    * // 팝업 초기화
    * commonJs.layerPopup.init();
    **********************************************************************/
    ns.util = util;
    ns.swipers = swipers;
    ns.accordions = ns.arcodians = arcodians;
    ns.calendar = calendar;
    ns.chart = chart;   
    ns.date = formEvent.date;
    ns.select = formEvent.select;
    ns.radio = formEvent.radio;
    ns.checkbox = formEvent.checkbox;
    ns.layerPopup = layerPopup;
    ns.googleMaps = maps.google;
    ns.daumMaps = maps.daum;
    ns.tabsSetup =  function() {
        tabs.setup();
        swipers.tab.init();
        console.log('tabsSetup');
    }
    
    // filter 팝업에서 filter 값 return
    ns.getFilterValue = formEvent.getFilterValue;
     
    /**
    * form 관련 event reBind
    */
    ns.formBindEvents = function() {
        formEvent.init();
        arcodians.init();
        tabs.init();
        layerPopup.init();
    };
    
    // 전체 메뉴 show
    ns.showMenu = totalMenu.showMenu;
    
    // section 태그 show / hide 될 때 실행 필요
    ns.changeSection = function() {
        common.bgClass();
        common.fixedSetup();
        common.setContainerPadding();
        common.centerAlign();
        common.fixedBtnScroll();
    };
    
    // 세로 카드 이미지 가로로 변환
    ns.setRotateAppCard = common.setRotateAppCard;
    
    // 접근성 포커스
    ns.goFocus = waiAccessibility.goFocus;
    
    ns.autoMoveNextTag = function(obj, nextObj){
        //e.preventDefault();
        
        /**
         * 스크롤 이동 임시 함수
         */
        var moveObj = function(obj){
            var nextObjId = obj.attr("id");
            var offset = $("#"+nextObjId).offset();
            $("html, body").animate({scrollTop:offset.top-80}, 1000);
        }
        
        var isMoveFlag = false;
        var inputType = obj.type;
        
        // 텍스트나 비밀번호
        if(inputType == "text" || inputType == "password"){
            var maxLength = $(obj).attr("maxlength");
            var tempValueLength = $(obj).val().length;
            
            if(maxLength == tempValueLength){
                isMoveFlag = true;
            }
        // 전화번호 경우
        }else if(inputType == "tel"){
            var maxLength = $(obj).attr("maxlength");
            //생년월일 6자리 또는 주민등록번호 뒷자리 1자리 일경우
            if(maxLength == 6 || maxLength == 1){
                var tempValueLength = $(obj).val().length;
                
                if(maxLength == tempValueLength){
                    isMoveFlag = true;
                }
            // 핸드폰 번호 인 경우
            }else if(maxLength == 16){
                var regExp = /^01([0|1|6|7|8|9]?)-?([0-9]{4})-?([0-9]{4})$/;//핸드폰번호 정규식
                var tempVal = $(obj).val();
                if(regExp.test(tempVal)){
                    isMoveFlag = true;
                }
            }
        //체크박스일 경우
        }else if(inputType == "checkbox"){
            var isChecked = $(obj).is(":checked");
            if(isChecked){
                isMoveFlag = true;
            }
        }
        /**
         * isMoveFlag이면 다음 obj로 이동한다. 포커스+ 스크롤이동
         */
        if(isMoveFlag){
            commonJs.goFocus(nextObj);
            moveObj(nextObj);
        }
        return;
    };
    
    ns.getSmsAuthNo = function($phoneNumTag, $authNumSendBtn, $authNumTag, $authCheckBtn, $mmss, notBtnClickFlag){
        smsTimer = setTimeout(function(){
            //console.log("polling start");
            //console.log("getSmsAuthNo start");
            
            var mmss = $mmss.html().replace(/:|\(|\)/gi, "");
            
            if(mmss == "0000"){
                //console.log("polling stop");
                clearTimeout(smsTimer);
            }
            try{
                //인증번호 가져오기 - SMS를 못가져왔을 때 공백값 "" (장형원 C)
                kbmobile.app.getSmsAuthNo(function(smsAuthNo){
                    
                    if(smsAuthNo){
                        //console.log("smsAuthNo: "+ smsAuthNo);
                        //console.log("polling stop");
                        clearTimeout(smsTimer);
                        //인증번호 세팅 후 인증확인 클릭이벤트
                        $authNumTag.val(smsAuthNo);
                        
                        if(!notBtnClickFlag || (typeof notBtnClickFlag == 'undefined')){
                        	// 이미 떠있는 팝업창이 있을 경우에 미리 닫아준다.(스크롤이 막히는 에러때문에 적용)
							if($("#messageBoxLayerPopup").html() != 'undefined'){
								if($("#messageBoxLayerPopup").attr("style").indexOf("display: block;") > -1){
									$("#btnOK_messageBoxLayerPopup").click();
								}								
							}
                            $authCheckBtn.focus();
                            $authCheckBtn.click();  
                        }
                        return;
                    }
                });
                
                //console.log("polling stop");
                clearTimeout(smsTimer);
                commonJs.getSmsAuthNo($phoneNumTag, $authNumSendBtn, $authNumTag, $authCheckBtn, $mmss);
                
            }catch(err){
                clearTimeout(smsTimer);
                //console.log("error: "+ err);
            }
        }, 1000);   
    };
    /**
     SMS 인증번호 자동완성
     MT00542, 조성욱
    - CORDOVA함수호출 통해 인증번호 가져오기( 기존플러그인에서 공통)
    - 폴링을 통해 호출(웹주도적으로 하기 위해-앱카드처럼)
    - 숫자만 전달받아서 검증
    - 자동완성한다음에 인증확인 버튼에 포커스를 주자
    - $phoneNumTag: 휴대전화번호 입력태그
    - $authNumSendBtn: 인증번호전송 버튼
    - $authNumTag : 인증번호 입력태그
    - $authCheckBtn : 인증확인 버튼
    - notBtnClickFlag : 다음 버튼 클릭 방지 이벤트 플래그 : true이면 안넘어가고 false이거나 undefined 이면 넘어간다 
    **/
    ns.setAutoSMSAuthNo= function ($phoneNumTag, $authNumSendBtn, $authNumTag, $authCheckBtn, $mmss, notBtnClickFlag ){
        smsTimer = null; // 폴링 타이머
        
        /**
            SMS인증요청
            - 인증번호 전송 버튼 눌렀을 시에
            - Application activeSmsNoti 호출 
        **/
        
        try{
            // activeSmsNoti 호출
            kbmobile.app.activeSmsNoti();
            
            clearTimeout(smsTimer);
            // 인증번호 폴링
            commonJs.getSmsAuthNo($phoneNumTag, $authNumSendBtn, $authNumTag, $authCheckBtn, $mmss, notBtnClickFlag);
        }catch(err){
            //console.log("error: "+ err);
        }
        /**
            입력창 포커스시에 폴링을 중지
        **/
        $authNumTag.on('focus', function(e){
            try{
                if(smsTimer != null){
                    //console.log("polling stop");
                    clearTimeout(smsTimer);
                }
            }catch(err){
                //console.log("error: "+ err);
            }
        });
    };
    
    ns.pfrmRequestGetParam= function(param){
        var requestParam = "";
        var url = unescape(location.href);
        var paramArr = (url.substring(url.indexOf("?")+1, url.length)).split("&");
        
        for(var i = 0; i<paramArr.length; i++){
            var temp = paramArr[i].split("=");
            if(temp[0].toUpperCase()== param.toUpperCase()){
                requestParam = paramArr[i].split("=")[1];
                break;
            }
        }
        return requestParam;
    };
    // 코드 실행
    $(function() {
        init();
    }); 
    
    // 푸터가 늦게 생성되는 페이지가 있어 전체 로드후 버튼 고정 한번더 실행
    window.onload = function() {
        common.fixedBtnScroll();
        waiAccessibility.init();        
        
        /*
        * 2017.01.03
        * 현재 동적 생성되는 페이지가 많아 $(document)에 event를 걸어놓았기 때문에
        * 보안키패드 터치할때(touchstart) $(document) 이벤트까지 실행되는 문제(버블링)로 touchstart 버블링 방지 스크립트 추가
        */
        $('.transkey_number2_done').on('touchend', function(e) {
            e.preventDefault();
        });
        
        /*
        * 2017.01.07
        * 
        */
        $('[type="password"]').on('click', function() {
            var $this = $(this),
                $target = $('.transkey_div').filter(':visible').find('#mtk_disp > img');
            $target.css('outline', 'none');
            $target.attr('tabindex', 0).focus();
            
            $('.transkey_div').filter(':visible').on('hide', function() {
                $this.focus();
            });
        });
        
                    
        $('.radioSel.col3').each(function() {
            var getWidth = $(this).outerWidth();
            
            if(getWidth % 2 !== 0) {
                $(this).css({
                    width: getWidth+1 + 'px'
                });
            }
        });
    };
    
    
}(commonJs, jQuery));

/*********************************************************************
* plugin
*********************************************************************/
(function($) {

    /*
    * jquery show / hide 이벤트 감지
    * @example
    * // section.show()를 실행할 때 아래 console 출력
    * $('section').on('show', function() {
        console.log('show');
    * });
    * // section.hide()를 실행할 때 아래 console 출력
    * $('section').on('hide', function() {
        console.log('hide');
    * });
    */
    (function () {
        $.each(['show', 'hide'], function (i, ev) {
            var el = $.fn[ev];
            $.fn[ev] = function() {
                this.trigger(ev);
                return el.apply(this, arguments);
            };
        });
    }());

    /**
    * 스와이프
    */
    (function() {
        var defaults = {
            // 애니메이션 속도 값
            duration: 500,              // number
            easing : '',
            
            // 현재 선택된 index (해당 기능 대신 선택할 엘리먼트에 currentClass 추가)
            currentIndex : 0,           // number
            
            // 현재 선택된 슬라이드의 class
            currentClass : 'on',        // String
            
            // width 값 설정 fasle 일 경우 부모 엘리먼트의 길이로 설정
            // true일 경우 css의 길이를 그대로 설정
            variableWidth : true,       // boolean
            autoHeight : false,
            
            //터치 사용 여부
            useTouch : true,            // boolean  
            // 스와이프 free mode
            freeMode : false,           // boolean
            // momentum ( 관성 )
            momentum : true,
            bounce : false,
                    
            // wrap 클래스 선택
            customWrap : '',            //String
            
            // 페이징 사용 여부
            paging : false,             // boolean
            pagingClass : '.paging',    // String
            pagingCurrentClass : 'on',  // String
            
            // 텍스트 페이징

            numberText : false,

            numberTextClass : '.numPaging',
            
            arrows : true,              // boolean
            nextArrow : '.btnNext',             // String
            prevArrow : '.btnPrev',             // String
            disabled : 'disabled',      // String
            
            // css3 사용 여부
            useCSS : true,              // Boolean
            
            // infinite mode - !freeMode && !variableWidth 일때만 사용 가능
            infinite : true,
            
            autoFocus : true,           // true여도 이전, 다음버튼이 없다면 false로 됨
            
            /*
            * callback
            */
            // 슬라이드 초기화 전. 함수 인수로 자신을 받습니다.
            onInit : function(swiper) { },
            // 터치 시작
            onTouchStart : function(swiper) {},
            // 터치 이동 중
            onTouchMove : function(swiper) {},
            // 터치 떼었을 때
            onTouchEnd : function(swiper) {},
            // 슬라이드 애니메이션 실행 바로 전 oldIndex : 현재 currentIndex 값, newIndex : 새로 선택된 currentIndex 값
            onBeforeChange : function(swiper, oldIndex, newIndex) {},
            // 슬라이드 애니메이션 실행 후
            onAfterChange : function(swiper, newIndex) {},
            // 스와이프 위치 값이 처음값일 때 실행
            onCheckStart : function(swiper) {},
            // 스와이프 위치 값이 마지막 값일 때 실행
            onCheckEnd : function(swiper) {},
            // 이전 버튼 실행 후
            onPrev : function(swiper) {},
            // 다음 버튼 실행 후
            onNext : function(swiper) {},
            // 클릭 콜백
            onClick : function(e, swiper) {},
            // 리사이즈 콜백
            onResize : function(swiper) {},
            // 리프레시 콜백
            onRefresh : function(swiper) {}
            
        };
        
        /**
        * 스와이프 플러그인
        * @example
        * $('.selector').commonSwiper({
            // options
        * });
        */
        $.fn.commonSwiper = function(opts) {
            var swiper = {},
            
            el = this,
            imgCount = 0,
            
            winWidth = $(window).width(),
            winHeight = $(window).height();
            

            if($(el).data('swiper')) {

                $('.clone', this).remove();
                $(el).unbind().removeData();
            }

            var init,
                funcStart,
                cssSetup,
                infiniteSetup,
                onRefresh,
                pagingSetup,
                numberTextSetup,
                arrowsSetup,
                resizeSetup,
                
                onFocusEvent,           // 2017.01.07 접근성 추가 ( 포커스 진입시 이동)
                touchInit,
                touchStart,
                touchMove,
                touchEnd,
                
                // helper func
                getTotalWidth,
                getMaxValue,
                getMoveValue,
                getTransform,
                setHeight,
                setMoveCSS,
                setAnimCSS,
                setCurrentPaging,
                setCurrentNumber,
                moveSlide,
                checkClass,
                checkArrow,
                checkScrolling,
                momentum,
                convertIndex;
            
            /*
            if(this.length > 1) {
                var arr = [];
                
                this.each(function(index) {
                    arr[index] = $(this).commonSwiper(opts);
                });
    
                return arr;
            }*/         
            
            /*
            초기화
            */
            init = function() {

                swiper.settings = $.extend({}, defaults, opts);
                
                // CSS3 사용여부 체크
                swiper.settings.useCSS = swiper.settings.useCSS && (function() {
                    var div = document.createElement('div'),
                        props = ['WebkitPerspective', 'MozPerspective', 'Operspective', 'msPerspective'];
                        
                    for (var i =0; i < props.length; i++) {
                        if (div.style[props[i]] !== undefined) {
                            swiper.cssPrefix = props[i].replace('Perspective', '').toLowerCase();
                            swiper.animProp = '-' + swiper.cssPrefix + '-transform';
                            return true;
                        }
                    }
                    return false;
                }());
                
                // infinite mode는 free mode가 아닐 때만 사용 가능
                swiper.settings.infinite = swiper.settings.infinite && !swiper.settings.freeMode && !swiper.settings.variableWidth;
                
                swiper.settings.easing = swiper.settings.freeMode ? swiper.settings.useCSS ? 'ease-out' : 'easeOutSine' : swiper.settings.easing;
                
                swiper.target = el;
                // 스와이프 선택자의 부모 엘리먼트
                swiper.wrap = el.parent();
                /*
                * 임의 wrap 저장 (페이징이나 버튼 클래스명 찾기 곤란할때 사용)
                */
                swiper.customWrap = swiper.settings.customWrap !== '' ? swiper.target.closest(swiper.settings.customWrap) : swiper.wrap;
                
                // 스와이프 선택자의 자식 엘리먼트
                swiper.list = el.children();
                // 자식 엘리먼트의 수
                swiper.listLen = swiper.list.length;
                
                //console.log(swiper.listLen);
                // 이미지
                swiper.images = el.find('img');
                // 이미지 수
                swiper.imageLen = swiper.images.length;
                // 이미지 카운트
                swiper.imageCount = 0;
                    
                
                swiper.isMobile = (function () {
                    var UserAgent = navigator.userAgent;
                    
                    return !!(UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) !== null || UserAgent.match(/LG|SAMSUNG|Samsung/) !== null);
                }());
                
                // 2016.09.29 터치 이벤트
                // swiper.touchEvent = swiper.isMobile ? ['touchstart', 'touchmove', 'touchend'] : ['mousedown', 'mousemove', 'mouseup'];                                               
                swiper.touchEvent = ['touchstart.swiper', 'touchmove.swiper', 'touchend.swiper'];                                               

                // 스크롤 타이머
                swiper.scrollTimer = null;
                swiper.lock = false;

                swiper.working = false;
                
                swiper.target.off('click.swiper');
                swiper.target.on('click.swiper', 'a', function(e) {
                    // 콜백 클릭 이벤트
                    swiper.settings.onClick(e, swiper);
                });
                
                // fixed 또는 absolute의 경우 부모 값이 el값과 동일하게 적용되어 width 값 100%로 설정
                if(swiper.wrap.css('position') === 'fixed' || swiper.wrap.css('position') === 'absolute') {
                    swiper.wrap.css('width', '100%');
                }

                // 2016.10.13 on 클래스 체크하여 해당 클래스를 currentIndex로 설정
                swiper.settings.currentIndex = swiper.list.filter('.' + swiper.settings.currentClass).index() === -1 ? 0 : swiper.list.filter('.' + swiper.settings.currentClass).index();
                /*
                swiper.list.filter('.' + swiper.settings.currentClass).index() === -1 ? (swiper.settings.infinite ? 1 : 0) : swiper.list.filter('.' + swiper.settings.currentClass).index()
                */

                /*
                * 스와이프 내부에 이미지가 존재할 경우
                * 이미지 전체 로드 후 함수 실행
                * 2016.11.21
                * 이미지 hide 후 로딩 완료시 show
                */
                if(swiper.imageLen > 0) {
                    el.find('img').one('load', function() {
                        swiper.imageCount += 1;
    
                        if(swiper.imageCount === swiper.imageLen) {
                            funcStart();
                        }
                    }).each(function() {
                        if(this.complete) {
                            $(this).trigger('load');
                        } else {
                            $(this).trigger('load');
                        }
                    });
                } else {
                    funcStart();
                }
            };
            
            /*
            * 실행 함수
            */
            funcStart = function() {
                if(el.is(':hidden')) { el.show(); }
                // 콜백 : 슬라이드 초기화 전
                swiper.settings.onInit(swiper);
            
                if(el.children().is(':hidden')) { el.children().show(); }
                if(swiper.settings.infinite) { infiniteSetup(); }
                        
                cssSetup();
                    
                checkClass();               
                    
                if(swiper.settings.useTouch) { touchInit(); }
                if(swiper.settings.paging) { pagingSetup(); }
                if(swiper.settings.numberText) { numberTextSetup(); }
                if(swiper.settings.arrows) { arrowsSetup(); }
                
                // 2017.01.07 접근성 추가 (focus 진입시 슬라이드 이동)
                 onFocusEvent();
                
                resizeSetup();  
            };
            
            /*
            * 2016.10.25
            * infinite mode 추가
            */
            infiniteSetup = function() {
                if(swiper.listLen === 1) { 
                    swiper.settings.infinite = false;
                    return; 
                }
                
                swiper.firstClone = el.children().eq(0).clone();
                swiper.lastClone = el.children().eq(el.children().length-1).clone();
                
                swiper.firstClone.removeClass(swiper.settings.currentClass).addClass('clone').attr('aria-hidden', true);
                swiper.lastClone.removeClass(swiper.settings.currentClass).addClass('clone').attr('aria-hidden', true);

                
                el.prepend(swiper.lastClone);
                el.append(swiper.firstClone);
                
                // length 재설정
                swiper.listLen = swiper.list.length + 2;
                
                // 2016.10.13 on 클래스 체크하여 해당 클래스를 currentIndex로 설정
                swiper.settings.currentIndex = swiper.list.filter('.' + swiper.settings.currentClass).index() === -1 ? swiper.settings.infinite ? 1 : swiper.settings.currentIndex : swiper.list.filter('.' + swiper.settings.currentClass).index();
            };
                        
            /*
            * 기본 스타일 셋업
            */
            cssSetup = function() { 
                el.removeAttr('style');
            
                if(el.is(':hidden')) { el.show(); }
                
                el.css('overflow', 'hidden');
                swiper.customWrap.css('overflow', 'hidden');
                el.children().css('float', 'left');
                
                onRefresh();

                swiper.moveValue = getMoveValue(swiper.settings.currentIndex);
                
                // setHeight();
                
                setTimeout(function() {
                    setMoveCSS(swiper.moveValue);                   
                }, 0);

                // 2017.01.04 특정 LG폰에서 highlight-color 가 안꺼지는 현상 방지 (공팀장님 요청)
                swiper.customWrap.find('a').css('-'+swiper.cssPrefix+'-tap-highlight-color', 'transparent');
            };
            
            onRefresh = function() {
                var setListWidth = 0;
                swiper.wrapWidth = parseInt(swiper.wrap.width(), 10);
                swiper.totalWidth = getTotalWidth();    

                
                // custom Width
                if(!swiper.settings.variableWidth) {
                    var $list = el.children();
                    
                    setListWidth = 100 / swiper.listLen + '%';
                    
                    $list.css({
                        width : setListWidth,
                        padding: 0,
                        margin: 0,
                        float: 'left'
                    });
                }
                
                // swiper.customWrap.css('overflow', 'hidden');
                el.css({
                    position: 'relative',
                    width: swiper.totalWidth + 'px'
                });
                
                swiper.list = el.children().not('.clone');
                swiper.listLen = el.children().length;
                
                // 2016.10.14 index 저장
                swiper.firstIndex = 0;
                swiper.lastIndex = el.children().length - 1;
                
                swiper.minValue = 0;
                swiper.maxValue = getMaxValue();    
                
                // 높이값 변동이 필요한 경우
                if(swiper.settings.autoHeight) {
                    el.css('overflow', 'hidden');
                    setTimeout(function() {
                        setHeight();
                    }, 0);
                }       
            },
            
            /*
            * paging 셋업
            */
            pagingSetup = function() {
                var pagingTxt = '';
                
                swiper.pagingWrap = swiper.customWrap.find(swiper.settings.pagingClass);
                
                if(swiper.listLen > 1){
                    
                    for(var i=0, len = swiper.list.length; i < len; i+=1) {
    
                        pagingTxt += '<span>' + (i+1) + '</span>'
                        // 2017.01.02 접근성 관련 (talkback, voiceover 사용시 인디케이터인지 알 수 없기 때문에 아예 포커스가 안가게 제거 요청
                        //pagingTxt += '<span></span>'
                    }
                    
                    swiper.pagingWrap.attr('aria-hidden',true).html(pagingTxt);
                    
                    setCurrentPaging();
                } else {
                    swiper.pagingWrap.hide();
                }
            };
            
            /*
            * number paging 셋업
            */
            numberTextSetup = function() {
                var idx = swiper.settings.currentIndex+1,
                    len = swiper.listLen;
                
                swiper.numberTextWrap = swiper.customWrap.find(swiper.settings.numberTextClass);
                // 2016.10.14 infinite mode 추가
                if(swiper.settings.infinite) {
                    idx = idx - 1;

                    len = len - 2;
                }
                
                swiper.numberTextWrap.html('<em>'+idx+'</em>' + ' / ' + len);
                
                // 2017.01.07 접근성 추가
                swiper.numberTextWrap.attr('role', 'text');
                swiper.numberTextWrap.attr('aria-label', '총 '+ len +'개의 슬라이드중 ' + idx +'번째');
            };
            
            /*
            * 이전 & 다음 버튼 셋업
            */
            arrowsSetup = function() {
                swiper.nextButton = swiper.customWrap.find(swiper.settings.nextArrow);
                swiper.prevButton = swiper.customWrap.find(swiper.settings.prevArrow);
                
                swiper.nextButton.off('click.swipeNext');
                swiper.nextButton.on('click.swipeNext', function(e) {
                    e.preventDefault();             
                                            
                    // 2017.01.09 접근성 추가 (freeMode에서 마지막 슬라이드로 넘어갈때 애니메이션이 없어 working 풀리지 않는 현상 방지)
                    if(0 === Math.abs(getTransform()[0]) && swiper.settings.freeMode) {                 
                        if(swiper.working) {
                            swiper.working = false;
                        }
                        
                        var index = swiper.settings.currentIndex + 1 > swiper.lastIndex ? swiper.lastIndex : swiper.settings.currentIndex + 1;
                        
                        // checkClass()보다 실행속도 늦추기 위해 setTimeout 추가
                        setTimeout(function() {
                            commonJs.goFocus(el.children().eq(index));
                        }, 100);
                    }                                       
                                        
                    if(!$(this).hasClass(swiper.settings.disabled) && !swiper.working){
                        el.nextSlide();
                        
                        // 2017.01.09 접근성 추가 ( freeMode 포커스 이동 )
                        if(swiper.settings.currentIndex === swiper.lastIndex && swiper.settings.freeMode) {                 
                            commonJs.goFocus(el.children().eq(swiper.settings.currentIndex));
                        } 
                    }
                });
                
                swiper.prevButton.off('click.swipePrev');
                swiper.prevButton.on('click.swipePrev', function(e){
                    e.preventDefault();
                        
                    // 2017.01.09 접근성 추가 (freeMode에서 마지막 슬라이드로 넘어갈때 애니메이션이 없어 working 풀리지 않는 현상 방지)
                    if(Math.abs(getMaxValue()) === Math.abs(getTransform()[0]) && swiper.settings.freeMode) {                   
                        if(swiper.working) {
                            swiper.working = false;
                        }
                        
                        var index = swiper.settings.currentIndex - 1 < 0 ? 0 : swiper.settings.currentIndex - 1;

                        // checkClass()보다 실행속도 늦추기 위해 setTimeout 추가
                        setTimeout(function() {
                            commonJs.goFocus(el.children().eq(index));
                        }, 100);
                    
                    } 

                    if(!$(this).hasClass(swiper.settings.disabled) && !swiper.working){
                        el.prevSlide();
                        
                        // 2017.01.09 접근성 추가 ( freeMode 포커스 이동 )
                        if(swiper.settings.currentIndex === swiper.firstIndex && swiper.settings.freeMode) {                    
                            commonJs.goFocus(el.children().eq(swiper.settings.currentIndex));
                        } 
                    }
                });
                
                checkArrow();
            };
    
            
            resizeSetup = function() {
                var timer = null;
                //$(window).off('resize.swiper');
                $(window).on('resize.swiper', function() {
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        
                        if(winWidth !== $(window).width() && winHeight !== $(window).height()) {
                            winWidth = $(window).width();
                            winHeight = $(window).height();
                            
                            swiper.settings.onResize(swiper);
                            cssSetup();
                        }
                    },100);
                });
            };
            
            onFocusEvent = function() {
                var $list = el.children();
                
                $list.find('a').each(function(index) {

                });
                                
            }
            
            /**************************************************************************************
            * helper Functions
            **************************************************************************************/
            
            /*
            * 스와이프 내부에 아코디언 있을 때 
            */
            setHeight = function() {
                var $list = el.children(),
                    getIdx = $list.eq(swiper.settings.currentIndex).index() !== -1 ? swiper.settings.currentIndex : 0,
                    getHeight,
                    getCurrentHeight;
                    
                $list.css('height', 'auto');
                
                getHeight = $list.eq(getIdx).innerHeight();
                getCurrentHeight = getHeight  > 0 ? getHeight : 1;
                
                $list.css('height', getCurrentHeight);
                $list.eq(getIdx).css('height', 'auto');
            };
            
            /*
            * 스와이프 Total Width
            */
            getTotalWidth = function() {
                var result = 0,
                    $list = el.children(),
                    listLen = $list.length;
                
                if(swiper.settings.variableWidth) {                     
                    $list.each(function(index) {                        
                        var getMarginRight = parseInt($(this).css('margin-right'), 10),
                            getMarginLeft = parseInt($(this).css('margin-left'), 10),
                            getWidth = parseInt($(this).innerWidth(), 10),
                            sum = 0;
                    
                        if(getMarginRight > 0) {
                            sum += getMarginRight;
                        }
                        
                        if(getMarginLeft > 0) {
                            sum += getMarginLeft;
                        }
                        
                        sum += getWidth;
                        
                        result += sum;
                    });
                    
                    if(result < swiper.wrap.width()) {
                        result = swiper.wrap.width();
                    }
                } else {
                    result = swiper.wrap.width() * listLen;
                }
                
                return result;
            };
            
            /*
            * 스와이프 get Max Value
            */
            getMaxValue = function() {
                var getListPaddingRight = parseInt(swiper.list.eq(swiper.listLen-1).css('padding-right'), 10),
                    getWrapMarginRight = parseInt(swiper.wrap.css('margin-right'), 10),
                    getWrapPaddingRight = parseInt(swiper.wrap.css('padding-right'), 10),
                    

                    result = swiper.wrapWidth - swiper.totalWidth;
                    
                    if(getWrapMarginRight > 0 || getWrapPaddingRight > 0) {
                        result += (getListPaddingRight > 0 ? getListPaddingRight : 0);
                    }
                    
                    if(result > 0) {
                        result = 0;
                    }

                return result;
            };
            
            /*
            * 스와이프 get Move Value
            */
            getMoveValue = function(idx) {

                var $wrap = swiper.wrap,
                    $list = el.children(),
                    getResult,
                    listWidth;
                    
                    
                if($list.length > 1) {
                    /* 
                    * infinite 모드일 때는 바로 left 값 get
                    * infinite 모드가 아닐 때는 index값이 0이 아닌 경우만 left 값 get
                    * bak 
                    * getResult = idx !== 0 ? -Math.round($list.eq(idx).position().left) : 0;
                    */
                    getResult = idx !== 0 ? -Math.round($list.eq(idx).position().left) : 0;
                    
                    // centerMoad가 true일 때 current target 가운데 정렬
                    if(swiper.settings.centerMode && swiper.settings.variableWidth) {
                        listWidth = $list.eq(idx).innerWidth();
                        
                        getResult += (winWidth - listWidth) / 2;            
                    }
                } else {
                    getResult = 0;
                }
                
                // left -> right
                if(getResult > swiper.minValue) {
                    getResult = swiper.minValue;
                    
                // right -> left
                } else if (getResult < swiper.maxValue) {
                    getResult = swiper.maxValue;
                }
                
                return getResult;
            };
            
            /**
            * transform의 matrix값을 변환
            * @return {Array} x : [0], y : [1];
            * @example
            * // get translateX
            * getTransform($('.target'))[0];
            * // get translateY
            * getTransform($('.target'))[1];
            */
            getTransform = function() {
                var x, y, arr;
                
                if(swiper.settings.useCSS) {
                    var transformMatrix,
                        matrix;
                                                
                    // get transform
                    transformMatrix = el.css(swiper.animProp);
                    
                    // get matrix
                    matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');
                    
                    // translate x
                    x = matrix[12] || matrix[4] || 0;
                    
                    // translate y
                    y = matrix[13] || matrix[5] || 0;
                                    
                } else {
                    var x = el.css('left'),
                        y = el.css('top');
                }
                
                arr = [parseInt(x, 10), parseInt(y, 10)];
                
                return arr;             
            };
            
            /**
            * 슬라이드 set css (애니메이션 없음)
            * @param {Number} moveX 이동시킬 value 값
            */
            setMoveCSS = function(moveX) {
                var x = moveX;
                
                // 2016.10.20 bounce 추가
                if(!swiper.settings.bounce) {
                    if(x > 0) {
                        x = 0;
                    } else if ( x < swiper.maxValue) {
                        x = swiper.maxValue;
                    }
                }

                if(swiper.settings.useCSS) {
                    el.css('-'+swiper.cssPrefix+'-transition', 0+'ms');
                    el.css(swiper.animProp, 'translate3d(' + x + 'px, 0px, 0px)');  
                } else {
                    x = Math.round(x);
                    el.stop(true, false).animate({
                        left: x + 'px'
                    }, {
                        duration: 0
                    });
                }
                swiper.moveValue = x;
            };
            
            /**
            * 슬라이드 set css (애니메이션 있음)
            * @param {Number} moveX 이동시킬 value 값
            */
            setAnimCSS = function(moveX, duration, callback) {          
                // 2016.10.14 infinite mode 추가
                if(swiper.settings.infinite) {
                    if(swiper.settings.currentIndex === swiper.firstIndex) {
                        swiper.settings.currentIndex = swiper.lastIndex -1;
                    } else if (swiper.settings.currentIndex === swiper.lastIndex) {
                        swiper.settings.currentIndex = swiper.firstIndex + 1;
                    }
                }
                
                // css3 지원 o
                if(swiper.settings.useCSS) {
                    el.css('-'+swiper.cssPrefix+'-transition', duration+'ms ' + swiper.settings.easing);
                    el.css(swiper.animProp, 'translate3d(' + moveX + 'px, 0px, 0px)');

                    el.unbind('webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd');
                    el.bind('webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd', function() {
                        swiper.working = false;
                        
                        // 2016.10.14 infinite mode 추가
                        if(swiper.settings.infinite) {
                            swiper.moveValue = getMoveValue(swiper.settings.currentIndex);

                            setMoveCSS(swiper.moveValue);
                        }                       
                        
                        $(this).css('-'+swiper.cssPrefix+'-transition', '0ms');
                        
                        // 이동한 value 값 저장
                        swiper.moveValue = moveX;
                        
                        // 콜백 : 슬라이드 실행 후 
                        swiper.settings.onAfterChange(swiper, convertIndex(swiper.settings.currentIndex));                  
                        
                        if(typeof callback === 'function') {
                            callback();
                        }
                        
                        // 2017.01.05 접근성 추가 (이전, 다음버튼이 있는 슬라이드는 선택된 아이템으로 포커스 이동)
                        if(swiper.settings.arrows && swiper.nextButton.length > 0 && swiper.prevButton.length > 0 && swiper.settings.autoFocus) {
                            commonJs.goFocus(el.children().eq(swiper.settings.currentIndex));
                        }
                    });
                    
                // css3 지원 x
                } else {
                    el.stop().animate({
                        left: moveX+'px'
                    }, {
                        duration: duration,
                        easing: swiper.settings.easing,
                        complete : function() {
                            swiper.working = false;
                            
                            // 2016.10.14 infinite mode 추가
                            if(swiper.settings.infinite) {
                                swiper.moveValue = getMoveValue(swiper.settings.currentIndex);
                                setMoveCSS(swiper.moveValue);
                            }
                            
                            // 이동한 value 값 저장
                            swiper.moveValue = moveX;
                                                    
                            // 콜백 : 슬라이드 실행 후 
                            swiper.settings.onAfterChange(swiper, convertIndex(swiper.settings.currentIndex));
                            
                            if(typeof callback === 'function') {
                                callback();
                            }               
                            
                            // 2017.01.05 접근성 추가 (이전, 다음버튼이 있는 슬라이드는 선택된 아이템으로 포커스 이동)
                            if(swiper.settings.arrows && swiper.nextButton.length > 0 && swiper.prevButton.length > 0 && swiper.settings.autoFocus) {
                                commonJs.goFocus(el.children().eq(swiper.settings.currentIndex));
                            }
                        }
                    });
                }
                
                checkClass();
                if(swiper.settings.paging) { setCurrentPaging(); }
                if(swiper.settings.numberText) { setCurrentNumber(); }
                if(swiper.settings.arrows) { checkArrow(); }    
                // 높이값 변동이 필요한 경우
                if(swiper.settings.autoHeight) {
                    setHeight();
                }           
            };
            
            // paging active

            setCurrentPaging = function() {
                var settings = swiper.settings,
                    $pagingList = swiper.pagingWrap.children(),
                    idx = settings.currentIndex;
                                        
                // 2016.10.14 infinite mode 추가
                if(settings.infinite) {
                    idx = idx - 1
                }
                
                $pagingList.removeClass(settings.pagingCurrentClass);
                $pagingList.eq(idx).addClass(settings.pagingCurrentClass);
            };
            
            // set number Text 
            setCurrentNumber = function() {
                var idx = swiper.settings.currentIndex+1,
                    len = swiper.listLen;
                
                // 2016.10.14 infinite mode 추가
                if(swiper.settings.infinite) {
                    idx = idx - 1;
                    len = len - 2;
                }
                                            
                swiper.numberTextWrap.html('<em>'+idx+'</em>' + ' / ' + len);
                
                // 2017.01.07 접근성 추가
                swiper.numberTextWrap.attr('aria-label', '총 '+ len +'개의 슬라이드중 ' + idx +'번째');
            };
            
            // 클래스 재 설정
            checkClass = function() {

                var $list = el.children(),
                    idx = swiper.settings.currentIndex;



                // 2016.10.14 infinite mode 추가
                if(swiper.settings.infinite) {
                    if(idx === swiper.firstIndex) {
                        idx = swiper.lastIndex-1;
                    } else if(idx === swiper.lastIndex) {
                        idx = swiper.firstIndex+1;
                    }
                }

                if(!$list.eq(idx).hasClass(swiper.settings.currentClass) && el.closest('.tagList').length < 1) {
                    $list.eq(idx).siblings().removeClass(swiper.settings.currentClass);
                    $list.eq(idx).addClass(swiper.settings.currentClass);
                }
                
            };
            
            // 이전 or 다음 버튼 체크
            checkArrow = function() {
                var settings = swiper.settings,
                    
                    // 2017.01.04 접근성 추가 하단과 동일
                    $list = el.children(),
                    idx = swiper.settings.currentIndex;
                
                if(settings.currentIndex === swiper.firstIndex) {
                    swiper.prevButton.addClass(settings.disabled);
                    
                    // 2017.01.07 접근성 추가 (버튼 disabled 클래스 추가시 접근 막기);
                    swiper.prevButton.attr('aria-hidden', 'true');
                } else {
                    swiper.prevButton.removeClass(settings.disabled);
                    
                    // 2017.01.07 접근성 추가 (버튼 disabled 클래스 추가시 접근 막기);
                    swiper.prevButton.attr('aria-hidden', 'false');
                }
                
                if(settings.currentIndex === swiper.lastIndex) {
                    swiper.nextButton.addClass(settings.disabled);
                    
                    // 2017.01.07 접근성 추가 (버튼 disabled 클래스 추가시 접근 막기);
                    swiper.nextButton.attr('aria-hidden', 'true');
                } else {
                    swiper.nextButton.removeClass(settings.disabled);
                    
                    // 2017.01.07 접근성 추가 (버튼 disabled 클래스 추가시 접근 막기);
                    swiper.nextButton.attr('aria-hidden', 'false');
                }
                
                // 2017.01.04 접근성 추가 (이전, 다음버튼이 있는 슬라이드의 현재 active된 item 외에 나머지는 aria-hidden = false로 포커스 이동 막기)
                if(swiper.settings.arrows && swiper.nextButton.length > 0 && swiper.prevButton.length > 0) {
                    $list.eq(idx).siblings().removeClass(swiper.settings.currentClass).attr('aria-hidden', true);
                    $list.eq(idx).addClass(swiper.settings.currentClass).attr('aria-hidden', false);

                    setTimeout(function() {
                        var visibility = $list.eq(idx).css('backface-visibility') == 'visible' ? 'hidden' : 'visible';
                        $list.eq(idx).css({webkitBackfaceVisibility: visibility})
                    }, 500)
                    
                    // 2017.01.05 접근성 추가 (이전, 다음버튼 접근성 텍스트)
                    swiper.nextButton.attr('role', 'button');
                    swiper.prevButton.attr('role', 'button');
                    
                    swiper.nextButton.attr('aria-label', '다음');
                    swiper.prevButton.attr('aria-label', '이전');
                }

                // 스와이프의 리스트 개수가 없거나 1개 이상이 아닐경우
                if(!el.children().length || el.children().length <= 1) {
                    swiper.nextButton.hide();
                    swiper.prevButton.hide();
                } else {
                    swiper.nextButton.show();
                    swiper.prevButton.show();               
                }
            };
            
            // 스크롤 체크
            checkScrolling = function() {
                swiper.lock = true;
                clearTimeout(swiper.scrollTimer);
                swiper.scrollTimer = setTimeout(function() {
                    swiper.lock = false;
                }, 100);
            };
            
            // 2016.10.13
            // iscroll 
            momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
                var distance = current - start,
                    speed = Math.abs(distance) / time,
                    destination,
                    duration;

                deceleration = swiper.touch.deceleration ? swiper.touch.deceleration : 0.0006;
                
                destination = current + (speed * speed ) / (2 * deceleration) * (distance < 0 ? -1 : 1);
                duration = speed / deceleration;
                
                duration = duration > swiper.settings.duration ? swiper.settings.duration : duration;
                
                /*
                * max
                * lowerMargin = swiper.maxValue
                */

                if (destination < lowerMargin) {
                    destination = lowerMargin;
                    distance = Math.abs(destination - current);
                    duration = distance / speed;
                } else if (destination > 0) {
                    destination = 0;
                    distance = Math.abs(current) + destination;
                    duration = distance / speed;
                }

                return {
                    destination: Math.round(destination),
                    duration: duration
                };
            };
            // End 2016.10.13
            
            /*
            * 클론모드 index 값 변환 함수
            */
            convertIndex = function(index) {
                var getIndex = index;

                if(swiper.settings.infinite){
                    if(index === swiper.firstIndex) {
                        getIndex = swiper.lastIndex-1;
                    } else  if(index === swiper.lastIndex) {
                        getIndex = swiper.firstIndex+1;
                    }
                    getIndex -= 1;
                }
                
                return getIndex;
            };
                    
            /**************************************************************************************
            * Event
            **************************************************************************************/
            touchInit = function() {
                swiper.touch = {                    
                    swipeLockThreshold : 5,
                    
                    deceleration : 0.0003,
                    bounce: true,
                    bounceTime: 600,
                    scrollLock: false
                };
                
                $(window).off('scroll.swiper');
                $(window).on('scroll.swiper', checkScrolling);
                $(document).off(swiper.touchEvent[1]);
                $(document).on(swiper.touchEvent[1], function(e) {
                    if(swiper.touch.scrollLock) {
                        e.preventDefault();
                    }
                });
                el.unbind(swiper.touchEvent[0], touchStart);
                el.bind(swiper.touchEvent[0], touchStart);
            };
            
            // 터치 시작
            touchStart = function(e) {
                // e.stopPropagation();
                
                var orig = e.originalEvent,
                    point = (typeof orig.changedTouches !== 'undefined') ? orig.changedTouches : [orig];

                swiper.touch.moved = false;
                swiper.touch.distX = 0;
                swiper.touch.distY = 0;
                swiper.touch.directionX = 0;
                swiper.touch.directionY = 0;
                
                // scroll Type 체크
                swiper.touch.swipeLocked = 0;
                
                swiper.touch.startTime = new Date().getTime();
                
                if(swiper.settings.freeMove && swiper.settings.momentum && swiper.touch.isInTransition) {
                    swiper.touch.isInTransition = false;
                    pos = getTransform()[0];
                    setMoveCSS(Math.round(pos));    
                    
                // 기본 스와이프 모드           
                } else {
                    pos = getTransform()[0];
                    if(pos === swiper.moveValue){
                        swiper.working = false;
                    }
                }
                
                // position 설정
                // swiper.moveValue = this.x
                swiper.moveValue = getTransform()[0];
                swiper.touch.startX = swiper.moveValue;
                swiper.touch.absStartX = swiper.moveValue;
                
                // touch.start.x
                swiper.touch.pointX = point[0].pageX
                swiper.touch.pointY = point[0].pageY;
                
                swiper.settings.onTouchStart(swiper);
                
                el.bind(swiper.touchEvent[1], touchMove);
                el.bind(swiper.touchEvent[2], touchEnd);
            };
            
            // 터치 이동
            touchMove = function(e) {
                
                var orig = e.originalEvent,
                    point = (typeof orig.changedTouches !== 'undefined') ? orig.changedTouches : [orig],
                    deltaX = point[0].pageX - swiper.touch.pointX,
                    deltaY = point[0].pageY - swiper.touch.pointY,
                    timestamp = new Date().getTime(),
                    newX, newY,
                    absDistX, absDistY;
                
                swiper.touch.pointX = point[0].pageX;
                swiper.touch.pointY = point[0].pageY;
                
                swiper.touch.distX += deltaX;
                swiper.touch.distY += deltaY;
                absDistX = Math.abs(swiper.touch.distX);
                absDistY = Math.abs(swiper.touch.distY);
                
                // 중지
                if( timestamp - swiper.touch.endTime > 150 && (absDistX < 10 && absDistY < 10)) {
                    return;
                }
                
                // swipe
                if(!swiper.touch.swipeLocked) {
                    // y 스크롤 막기
                    if(absDistX > absDistY + swiper.touch.swipeLockThreshold) {
                        swiper.touch.swipeLocked = 'v';
                    
                    // x 스크롤 막기
                    } else if ( absDistY >= absDistX + swiper.touch.swipeLockThreshold) {
                        swiper.touch.swipeLocked = 'h';
                        
                    // 막지 않음
                    } else {
                        swiper.touch.swipeLocked = 'n';
                    }
                }
                
                // 세로 스크롤 lock
                if(swiper.touch.swipeLocked === 'v') {
                    e.preventDefault();
                    
                    // 스와이프 중일 땐 스크롤바 기능 disabled
                    if(!swiper.touch.scrollLock && !swiper.lock) { swiper.touch.scrollLock = true; }
                    if(swiper.settings.freeMode){
                        deltaX = deltaX;                
                        newX = swiper.moveValue + deltaX;
                        
                        
                        // 이동 값 계산?
                        if(newX > 0 || newX < Math.abs(swiper.maxValue)) {
                            if(swiper.settings.momentum) {
                                newX = swiper.moveValue + deltaX / 1.5;
                            } else {
                                newX = swiper.moveValue + deltaX;
                            }
                        }
                        
                        //console.log(newX);
                        swiper.touch.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
                        
                        
                        swiper.touch.moved = true;
                                
                        setMoveCSS(newX);
                        
        
                        // momentum?
                        // console.log(timestamp - swiper.touch.startTime);
                        if(timestamp - swiper.touch.startTime > 150) {
                            swiper.touch.startTime = timestamp;
                            swiper.touch.startX = swiper.moveValue;
                        }
                    }
                // 가로 스크롤 lock
                } else if ( swiper.touch.swipeLocked === 'h') {
                    // code
                }           
                
                swiper.settings.onTouchMove(swiper);
            };
            
            // 터치 끝
            touchEnd = function(e) {                
                var orig = e.originalEvent,
                    point = (typeof orig.changedTouches !== 'undefined') ? orig.changedTouches : [orig],
                    momentumX,
                    duration = new Date().getTime() - swiper.touch.startTime,
                    newX = Math.round(swiper.moveValue),
                    distanceX = Math.abs(newX - swiper.touch.startX),
                    time = 0,
                    easing = '';
                
                swiper.touch.isInTransition = 0;
                swiper.touch.initiated = 0;

                swiper.touch.endTime = new Date().getTime();
                
                if(swiper.settings.freeMode && swiper.settings.momentum) {
                    if(duration < 150) {
                        momentumX = momentum(swiper.moveValue, swiper.touch.startX, duration, swiper.maxValue, swiper.touch.bounce ? swiper.wrapWidth : 0, swiper.touch.deceleration);
                        newX = momentumX.destination;
                        time = momentumX.duration;
                        swiper.touch.isInTransition = 1;
                    }
                        
                    if(newX != swiper.moveValue && swiper.moveValue < 0 && swiper.moveValue > swiper.maxValue) {
                        setAnimCSS(newX, time);
                    }
                
                // freeMode를 지원하지 않을 때 기본 슬라이드
                } else if(!swiper.settings.freeMode) {
                    
                    // momentum 및 freeMode를 지원하지 않을 때
                    if(swiper.touch.swipeLocked === 'v') {
                        var idx = swiper.settings.currentIndex;
                    
                        // left - > right
                        if(swiper.touch.distX > swiper.wrapWidth / 6 && !swiper.working && !swiper.lock && swiper.touch.scrollLock) {
                            // idx = idx !== 0 ? idx - 1 : 0;
                            el.prevSlide();
                            
                        // right -> left
                        } else if(swiper.touch.distX < -(swiper.wrapWidth / 6) && !swiper.working && !swiper.lock && swiper.touch.scrollLock) {
                            // idx = idx !== swiper.listLen -1 ? idx + 1 : swiper.listLen -1;
                            el.nextSlide();
                        }
                    }
                }
                
                // bounce mode 
                if(swiper.settings.bounce) {
                    if(swiper.moveValue > 0){
                        setAnimCSS(0, swiper.settings.duration, function() {
                            swiper.settings.onCheckStart(swiper);
                        });
                        
                    } else if( swiper.moveValue < swiper.maxValue) {
                        setAnimCSS(swiper.maxValue, swiper.settings.duration, function() {
                            swiper.settings.onCheckEnd(swiper);
                        });
                    }
                    
                }
                
                // 스와이프 중일 땐 스크롤바 기능 disabled
                if(swiper.touch.scrollLock) { swiper.touch.scrollLock = false; }
                
                swiper.settings.onTouchEnd(swiper);
                
                el.unbind(swiper.touchEvent[1], touchMove);

                el.unbind(swiper.touchEvent[2], touchEnd);
            };
            
            /**
            * commonSwiper Public Functions
            * @param index slide index
            * @example
            * el.slideTo = function() {};
            */  
            el.slideTo = function(index) {
                if(index < swiper.firstIndex || index > swiper.lastIndex) {
                    return false;
                }

                // 콜백 : 슬라이드 실행 전
                swiper.settings.onBeforeChange(swiper, convertIndex(swiper.settings.currentIndex), convertIndex(index));
                
                // 인자 값 저장              
                swiper.settings.currentIndex = index;
                
                var animValue = getMoveValue(swiper.settings.currentIndex);
                
                setAnimCSS(animValue, swiper.settings.duration);

            };
            
            /**
            * commonSwiper Public Functions
            * @param index slide index
            */
            
            el.moveTo = function(index) {
                if(index < swiper.firstIndex || index > swiper.lastIndex) {
                    return false;
                }

                var animValue = getMoveValue(index);
                
                setAnimCSS(animValue, swiper.settings.duration);
            };
            
            /**
            * slideTo와 동일하나 animation 없음
            *
            */
            el.currentTo = function(index) {

                if(index < swiper.firstIndex || index > swiper.lastIndex) {
                    return false;
                }
                
                // 콜백 : 슬라이드 실행 전
                swiper.settings.onBeforeChange(swiper, convertIndex(swiper.settings.currentIndex), convertIndex(index));

                // 인자 값 저장              
                swiper.settings.currentIndex = index;
                
                var animValue = getMoveValue(swiper.settings.currentIndex);
                
                setAnimCSS(animValue, 0);       
            };
            
            el.setMoveCSS = function(moveValue) {
                setMoveCSS(moveValue);          
            };
            
            el.nextSlide = function() {
                var index = swiper.settings.currentIndex + 1;
                
                if(index <= swiper.lastIndex) { 
                    
                    // 2017.01.09 접근성 추가(freeMode 대응. anim이 없을 때는 working 변화없음)
                    if(getMoveValue(index) !== getTransform()[0]){
                        swiper.working = true;
                    }
                    
                    el.slideTo(index);
                            
                    // 콜백 : nextSlide 실행 후
                    swiper.settings.onNext(swiper);
                }
            };
            
            el.prevSlide = function() {
                var index = swiper.settings.currentIndex - 1;

                if(index >= swiper.firstIndex) {

                    
                    // 2017.01.09 접근성 추가(freeMode 대응. anim이 없을 때는 working 변화없음)
                    if(getMoveValue(index) !== getTransform()[0]){
                        swiper.working = true;
                    }
                    
                    el.slideTo(index);
    
                    // 콜백 : nextSlide 실행 후
                    swiper.settings.onPrev(swiper); 
                }
            };
            
            /**
            * 현재 currentIndex값 get (infinite mode가 true일때는 -1)
            */
            el.getCurrentIndex = function() {

                return convertIndex(swiper.settings.currentIndex);
            };
            
            /**
            * swiper 재초기화
            */
            el.reInit = function() {
                el.children('.clone').remove();
                
                init();
            };
            
            el.refresh = function() {
                // 스와이프 선택자의 자식 엘리먼트
                swiper.list = el.children();
                // 자식 엘리먼트의 수
                swiper.listLen = swiper.list.length;
                
                swiper.list.css('height', 'auto');

                if(swiper.list.is(':hidden')) { swiper.list.show();}

                onRefresh();            
                swiper.settings.onRefresh(swiper);
            };
            
            init();
            
            // 2016.10.31       
            $(el).data('swiper', this);

            return el;          
        };
    }());
    
    /**
    * 아코디언
    * @param {Object} opts 옵션 객체
    * @param {String} opts.toggleWrap 버튼과 뷰를 감싸는 wrap 클래스
    * @param {String} opts.btnClass 버튼 타겟 ex) '> li > a' or '.btnClass'
    * @param {String} opts.viewClass 타겟 ex) '.toggleView'
    * @param {String} opts.currentClass activeClass명 정의
    * @param {String} opts.lazyOpenClass 메서드로 수동 제어할 class 지정 (해당 버튼 클릭시 'toggleLazyOpen'으로 trigger 이벤트 발생)
    * @param {String} opts.defaultOpen 디폴트로 오픈시킬 클래스명 정의
    * @param {Boolean} opts.changeText 버튼 텍스트 변경 불린 값
    * @param {String} opts.openText 오픈 시 버튼 텍스트
    * @param {String} opts.closeText 닫기 시 버튼 텍스트
    * @param {String} opts.duration 속도
    * @param {String} opts.easing easing
    
    *
    * // 콜백
    * @param opts.onInit 플러그인 초기화전 이벤트
    * @param opts.onBeforeOpen 토글 open 전 이벤트
    * @param opts.onAfterOpen 토글 open 후 이벤트
    * @param opts.onAfterClose 토글 close 후 이벤트
    *
    * @method openList(index) index값에 해당하는 리스트 열기
    * @method closeList(index) index값에 해당하는 리스트 닫기
    * @method openAll() 전체 리스트 열기
    * @method closeAll() 전체 리스트 닫기
    * @method currentOpen(index) openList와 같으나 애니메이션 없음
    
    * @example
    * 아코디언 함수 실행
    * var arcodi = $('.arcodi').commonAccordion(opts);
    * // 첫번째 리스트 열기
    * arcodi.openList(0);
    * // 첫번째 리스트 열기 (애니메이션 없음)
    * arcodi.currentOpen(0);
    * // 첫번째 리스트 닫기
    * arcodi.closeList(0);
    * // 전체 닫기
    * arcodi.closeAll();
    *
    */
    (function() {
        var defaults = {
            toggleWrap: '',
            btnClass : '',
            viewClass : '',
            
            currentClass : 'on',
            lazyOpenClass : 'lazyOpen',
            defaultOpen : '.defaultOpen',
            linkClass : 'linkBtn',

            
            // 텍스트 변경 여부
            changeText : false, // Boolean
            openText : '',
            closeText : '',
            
            duration : 'fast',
            easing: '',
            
            // 콜백 오픈 후 이벤트
            onInit : function(accordion) {},
            onBeforeOpen : function(accordion, index) {},
            onBeforeClose : function(accordion, index) {},
            onAfterOpen : function(accordion, index) {},
            onAfterClose : function(accordion, index) {}
        };
        
        $.fn.commonAccordion = function(opts) {
            var arcodian = {},
                el = this,
                
                init,
                cssSetup,
                funcStart,
                onRefresh,
                bindEvents,
                eventHandle,
                openList,
                currentOpen,
                closeList,
                closeSiblings,
                openAll,
                closeAll;
                    
            if($(this).data('accordion')){
                $(this).unbind().removeData();
            }
            
            /*
            * 초기화
            */
            init = function() {
                arcodian.settings = $.extend({}, defaults, opts);
                
                // 2016.11.29 추가
                if(!el.find('> ' + arcodian.settings.toggleWrap).length) { return false; }
                
                el.find('> ' + arcodian.settings.toggleWrap).addClass('toggleItem');
                
                arcodian.list = el.children();
                arcodian.btnElem = el.find(arcodian.settings.btnClass);
                arcodian.viewElem = el.find(arcodian.settings.viewClass);
                arcodian.settings.onInit(arcodian);
                funcStart();            
            };
            
            funcStart = function() {
                cssSetup();
                bindEvents();
            };
            
            cssSetup = function() {
                
                arcodian.list.removeClass(arcodian.settings.currentClass);
//              el.find('> ' + arcodian.settings.toggleWrap).addClass('toggleItem');
                arcodian.viewElem.hide();
                
                // 2017.01.02 접근성 추가 ( 닫혀있을 경우 title = "닫힘")
                arcodian.btnElem.attr('title', '닫힘');
                arcodian.btnElem.attr('role', 'button');
                arcodian.btnElem.each(function() {
                    $(this).attr('aria-label', $(this).text());
                });
                
                // .defaultOpen 있을 때 아코디언 오픈 상태
                if(arcodian.list.filter(arcodian.settings.defaultOpen).length > 0) {
                    arcodian.list.filter(arcodian.settings.defaultOpen).each(function() {
                        el.currentOpen($(this).index());
                    });
                }
            };
            
            onRefresh = function() {
                arcodian.list = el.children();
                arcodian.btnElem = el.find(arcodian.settings.btnClass);
                arcodian.viewElem = el.find(arcodian.settings.viewClass);
                
                el.find('> ' + arcodian.settings.toggleWrap).addClass('toggleItem');
                bindEvents();
            };
            
            /**************************************************************************************
            * Event
            **************************************************************************************/
            bindEvents = function() {
                el.off('click.accordion');
                el.on('click.accordion', arcodian.settings.btnClass, function(e) {
                    if(!$(this).hasClass(arcodian.settings.linkClass)){
                        e.preventDefault();
                        e.stopPropagation();
    
                        eventHandle($(this));
                    }
                });
            };
            
            eventHandle = function(target) {                
                var $target = target,
                    $targetLi = $target.closest(arcodian.settings.toggleWrap),
                    idx = $targetLi.index();
                
                // 2016.10.10 아코디언 요소 클릭시 형제 엘리먼트 닫히는 것 제거 
                // closeSiblings(idx);
                if(!$target.hasClass('disabled')) {
                    // class 체크 후 open 이벤트;
                    if($targetLi.hasClass(arcodian.settings.currentClass)) {
                        closeList(idx);
                    } else {
                        // 2016.10.31 lazyOpenClass가 없을 때 기본 이벤트 실행
                        if(!$target.hasClass(arcodian.settings.lazyOpenClass)){

                            openList(idx);
                        } else {
                            $target.trigger('toggleLazyOpen', [el, idx]);
                        }
                    }
                }
                    
                // contents offset Top 값으로 스크롤 이동
                // commonJs.util.contentsTop($target);
            };
            
            /*
            * 리스트 열기
            */
            openList = function(idx) {
                var $list = arcodian.list.eq(idx),
                    $view = $list.find(arcodian.settings.viewClass);
                
                // 오픈 전 콜백
                arcodian.settings.onBeforeOpen(arcodian, idx);
                
                $list.addClass(arcodian.settings.currentClass);
                
                $view.hide();

                $view.stop(true, false).slideToggle({
                    duration: arcodian.settings.duration,
                    easing : arcodian.settings.easing,
                    complete : function() {
                        // 오픈 후 콜백
                        arcodian.settings.onAfterOpen(arcodian, idx);
                    }
                });
                
                // 텍스트 변경               
                if(arcodian.settings.changeText){
                    $list.find(arcodian.settings.btnClass).text(arcodian.settings.openText);
                }
                
                // 2016.10.26 개발관련 trigger 이벤트 추가
                $view.trigger('toggleCont', ['open']);
                
                $list.find(arcodian.settings.btnClass).attr('title', '펼쳐짐');
            };
            
            /*
            * 선택된 리스트 오픈 ( 애니메이션 x )
            */
            currentOpen = function(idx) {
                var $list = arcodian.list.eq(idx);
                
                // 오픈 전 콜백
                arcodian.settings.onBeforeOpen(arcodian, idx);
                
                $list.addClass(arcodian.settings.currentClass);

                $list.find(arcodian.settings.viewClass).show();
                
                arcodian.settings.onAfterOpen(arcodian, idx);
                
                // 텍스트 변경               
                if(arcodian.settings.changeText){
                    $list.find(arcodian.settings.btnClass).text(arcodian.settings.openText);
                }
                
                $list.find(arcodian.settings.btnClass).attr('title', '펼쳐짐');
            }
            
            /*
            * 리스트 닫기
            */
            closeList = function(idx) {
                var $list = arcodian.list.eq(idx),
                    $view = $list.find(arcodian.settings.viewClass);
                
                $list.removeClass(arcodian.settings.currentClass);
                $view.show();
                
                arcodian.settings.onBeforeClose(arcodian, idx);
                
                $view.stop(true, false).slideToggle({
                    duration: arcodian.settings.duration,
                    easing : arcodian.settings.easing,
                    complete : function() {
                        // 클로즈 후 콜백
                        arcodian.settings.onAfterClose(arcodian, idx);
                    }
                });
                
                // 텍스트 변경               
                if(arcodian.settings.changeText){
                    $list.find(arcodian.settings.btnClass).text(arcodian.settings.closeText);
                }
                
                // 2016.10.26 개발관련 trigger 이벤트 추가
                $view.trigger('toggleCont', ['close']);
                
                $list.find(arcodian.settings.btnClass).attr('title', '닫힘');
            };
            
            /*
            * 2016.10.10 요소 클릭시 형제 엘리먼트 닫기
            * 형제 리스트 닫기
            */
            closeSiblings = function(idx) {
                var $listSiblings = arcodian.list.eq(idx).siblings();
                
                // 형제 엘리먼트 hide
                $listSiblings.removeClass(arcodian.settings.currentClass);
                $listSiblings.find(arcodian.settings.viewClass).stop(true, false).slideToggle({
                    duration: arcodian.settings.duration,
                    easing : arcodian.settings.easing,
                    complete : function() {
                    }
                });

                // 텍스트 변경               
                if(arcodian.settings.changeText){
                    $listSiblings.find(arcodian.settings.btnClass).text(arcodian.settings.closeText);
                }
                
                $listSiblings.find(arcodian.settings.btnClass).attr('title', '닫힘');
            };
            
            /*
            * 전체 리스트 열기
            */
            openAll = function() {
                var $list = arcodian.list;
                
                // 오픈 전 콜백
                arcodian.settings.onBeforeOpen(arcodian);
                
                $list.addClass(arcodian.settings.currentClass);
                $list.find(arcodian.settings.viewClass).show();
                
                arcodian.settings.onAfterOpen(arcodian);
                
                // console.log(arcodian.list);
                // 텍스트 변경               
                if(arcodian.settings.changeText){
                    $list.find(arcodian.settings.btnClass).text(arcodian.settings.openText);
                }
                
                $list.find(arcodian.settings.btnClass).attr('title', '펼쳐짐')
            };
            
            /*
            * 전체 리스트 닫기
            */
            closeAll = function() {
                var $list = arcodian.list;
                
                $list.removeClass(arcodian.settings.currentClass);
                $list.find(arcodian.settings.viewClass).hide();
                
                // 텍스트 변경               
                if(arcodian.settings.changeText){
                    $list.find(arcodian.settings.btnClass).text(arcodian.settings.closeText);
                }
                
                $list.find(arcodian.settings.btnClass).attr('title', '닫힘')
            };
            
            goToggleTop = function(target) {
                var $target = $(target),
                    offsetTop = $target.position().top;
                    
                $(window).scrollTop(offsetTop);
            };
            
            /*******************************************************************************************
            * Public Functions
            ********************************************************************************************/
            /**
            * 해당하는 index값 리스트 open
            * @param {Number} idx index value
            * @example
            * // 첫번째 리스트 열기
            * el.openList(0);
            */
            el.openList = function(idx) {
                //closeSiblings(idx);
                openList(idx);
            };
            
            /**
            * 해당하는 index값 리스트 close
            * @param {Number} idx index value
            * @example
            * // 첫번째 리스트 닫기
            * el.closeList(0);
            */
            el.closeList = function(idx) {
                closeSiblings(idx);
                closeList(idx);
            };
            
            /*
            * 리스트 전체 열기
            */
            el.openAll = function() {
                openAll();
            };
            
            /**
            * 리스트 전체 닫기
            */
            el.closeAll = function() {
                closeAll();
            };
            
            /**
            * index 값 get
            */
            el.getCurrentIndex = function() {
                var getIndex = swiper.settings.currentIndex;
                if(swiper.settings.infinite) {
                    getIndex -= 1
                }
                
                return getIndex;
            };
            
            /**
            * 리스트 open (애니메이션 x)
            */
            el.currentOpen = function(idx) {
                currentOpen(idx);
            };
            
            el.refresh = function() {
                onRefresh();
            };
            
            init();
            
            $(el).data('accordion', this);          
            
            return this;
        };

    }());

    (function() {
        /**
        * 파이 차트
        * @example
        * <div id="pie"><canvas></canvas></div>
        * var data = [ { name: '의류', value : 50000 } ];
        *
        * // 차트 플러그인 실행
        * var pieChart = $('#pie').pieChart();
        *
        * // 차트 데이터 입력
        * pieChart.pieChartSetup(data);
        * 
        * // 차트 출력
        * pieChart.pieChartStart();
        */
        $.fn.pieChart = function() {
            var el = this,
                canvas = el.find('canvas')[0];
                
            if(canvas) {
                el.css('text-align','center');
                canvas.width = 153;
                canvas.height = 153;
                $(canvas).css({
                    width: '152px',
                    height: '152px',
                    margin: '0 auto'
                });
                
                var context = canvas.getContext("2d");
                var plus = 270;
                var degreesToRadians = function(degrees){
                    return degrees * (Math.PI / 180);
                };
                
                var radiansToDegrees = function(radians) {
                    return radians * (180 / Math.PI);
                };
                
                // 콤마
                var comma = function(x) {
                    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                };
                
                var lineWidth = 27;
                var radius = 63;
                var tx = canvas.width / 2;
                var ty = canvas.height / 2;
                var sell = 0;
                var arr = [];
                //var color = ['red', 'green', 'blue', 'orange', 'pink', '#000', '#f2f2f2']
                // var patternImg = ['../img/MK/bg_pattern1s.png','../img/MK/bg_pattern2s.png','../img/MK/bg_pattern3s.png','../img/MK/bg_pattern4s.png','../img/MK/bg_pattern5s.png','../img/MK/bg_pattern6s.png','../img/MK/bg_pattern7s.png','../img/MK/bg_pattern8s.png'];
                // spider 업로드용
                var patternImg = ['https://img1.kbcard.com/cxh/ia_img/MK/bg_pattern1s.png','https://img1.kbcard.com/cxh/ia_img/MK/bg_pattern2s.png','https://img1.kbcard.com/cxh/ia_img/MK/bg_pattern3s.png','https://img1.kbcard.com/cxh/ia_img/MK/bg_pattern4s.png','https://img1.kbcard.com/cxh/ia_img/MK/bg_pattern5s.png','https://img1.kbcard.com/cxh/ia_img/MK/bg_pattern6s.png','https://img1.kbcard.com/cxh/ia_img/MK/bg_pattern7s.png','https://img1.kbcard.com/cxh/ia_img/MK/bg_pattern8s.png'];
                
                // var patternImg = ['../img/MK/bg_pattern1.png','../img/MK/bg_pattern2.png','../img/MK/bg_pattern3.png','../img/MK/bg_pattern4.png','../img/MK/bg_pattern5.png'];
                var total = 0;
                var startPurc = [];
                var endPurc = [];
    
                // draw Pie Chart
                var drawCircle = function(now) {
                    
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    

                    for(var i = 0, len=arr.length; i < len; i++) {
                        var image = new Image();
                        image.src = patternImg[i];
                        
                        context.beginPath();                
                        context.arc(tx, ty, radius, degreesToRadians(startPurc[i]), degreesToRadians(endPurc[i] - 1), false); // -1은 패턴당 간격 1씩 띄움
                        context.lineWidth = lineWidth;
                        context.strokeStyle = context.createPattern(image, "repeat");
                        //context.strokeStyle = color[i];
                        context.stroke();
                    }               
    
                    
                    context.beginPath();
                    
                    context.arc(tx, ty, radius, degreesToRadians(plus), degreesToRadians(plus + now), false);
                    context.lineWidth = lineWidth+2;
                    context.strokeStyle = '#f8f9f9';
                    context.stroke();
                    
                };
                
                // 애니메이션 실행
                var start = function() {
                    el.addClass('onDraw');
                    
                    var dummy = { t : 360 };
                    
                    $(dummy).animate({ t : 0 }, {
                        eaing: {
                            t : 'easeInQutCubic'
                        },
                        duration : 1000,
                        step: function(now, fx) {
                            drawCircle(now);
                            // animCircle(now);
                        },
                        complete : function(e) {
                            //drawLabel();
                        }
                    });
                };
                
                // total 값 계산 및 데이터 정보 출력
                var setup = function() {

                    var $dataUl = el.siblings('.graphInfo'),
                        $div = $('<div />');
                    
                    // total 값 계산
                    for(var t = 0, len = arr.length; t < len; t++){
                        total += parseInt(arr[t].value, 10);
                    }
                    
                    // 데이터 정보 출력
                    for(var i = 0, len = arr.length; i < len; i++) {
                        var $li = $('<li />'),
                            $strong = $('<strong />'),
                            $patternThumb = $('<span class="ptn' + (i+1) +'" />'),
                            $dataTxt = $('<em />'),
                            ThumbSrc = 'url("' + patternImg[i] + '")',
                            getPerc =  Math.round(arr[i].value / total * 100);
                        /*                      
                        $patternThumb.css({
                            backgroundImage : ThumbSrc 
                        });
                        */
                        
                        $strong.text(arr[i].name);
                        $strong.prepend($patternThumb);
                        $dataTxt.text(comma(arr[i].value) + '('+ getPerc + '%)');
                        
                        $li.append($strong);
                        $li.append($dataTxt);
                        $div.append($li);
                        
                    }
                    
                    
                    $dataUl.html($div.html());
                    
                    // data 값 설정
                    for(var g = 0, len =arr.length; g < len; g++) {
                        var curPerc = (arr[g].value / total) * 360;
                        
                        startPurc[g] = Math.floor(plus);
                        endPurc[g] = plus + curPerc;
                        
                        plus = endPurc[g];
                    }
                };
                
                el.pieChartSetup = function(pieData) {
                    // data 저장
                    arr = pieData;
                    setup();                
                    //start();
                };
                
                el.pieChartStart = function() {
                    start();
                };
            }
            
            if($(this).data('pieChart')){
                $(this).removeData('pieChart');
            }
            $(el).data('pieChart', this);
            
            return el;
        }       
    }());
    
    (function() {
        /**
        * 막대 차트
        * @example
        * var data = [ { month: '8월', value : 2500000 } ];
        *
        * // 차트 플러그인 실행
        * var barChart = $('.barGraph').barChart();
        *

        * // 차트 데이터 입력
        * barChart.barChartSetup(data);
        * 
        * // 차트 출력
        * barChart.barChartStart();
        */
        $.fn.barChart = function() {
            var el = this,
                $data = el.next('.graphInfo'),
                arr = [];
            
            var comma = function(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            
            var getMax = function(numArray) {
                return Math.max.apply(null, numArray);
            };
            
            var getTotal = function(numArray) {
                var sum = 0;
                
                for(var i=0,len = numArray.length; i<len; i++) {
                    sum += numArray[i];
                }
                return sum;
            };
            
            var getPerc = function(maxValue, thisValue) {
                return Math.floor(thisValue / maxValue * 100)
            };
            
            var setup = function(type) {
                var dataLen = arr.length,
                    $div = $('<div />'),
                    valueArr = [],
                    maxValue = 0;
                    
                // data 값 적용
                for(var i=0; i < dataLen; i++) {
                    var $li = $('<li />'),
                        $strong = $('<strong />'),
                        $pattern = $('<span class="ptn' + (i+1) + '" />'),
                        $value = $('<em />');
                    
                    $strong.text(arr[i].month);
                    $strong.prepend($pattern)
                    $value.text(comma(arr[i].value)+'원');
                    $li.append($strong);
                    $li.append($value);
                    $div.append($li);
                    
                    valueArr[i] = arr[i].value; 
                }
                
                $data.html($div.html());
                
                /*
                * 여기서부터 막대 그래프 세팅
                */
                // max 값 get
                if(type === 'merge') {
                    maxValue = getTotal(valueArr);
                } else if ( type === 'each') {
                    maxValue = 100;
                } else {
                    maxValue = getMax(valueArr);
                }
                $div = $('<div />');
                for(var g=0; g < dataLen; g++) {
                    var $li = $('<li />'),
                        $month = $('<em />'),
                        $p = $('<p class="per" />'),
                        $bar = $('<span class="bar" />');
                    
                    $month.text(arr[g].month);
                    
                    $p.text(getPerc(maxValue, arr[g].value) + '%');
                    $bar.css('height', getPerc(maxValue, parseInt(arr[g].value, 10))+'%').hide();
                    $bar.text(comma(arr[g].value)+'원');
                    
                    $li.append($p);
                    $li.append($month);
                    $li.append($bar);
                    
                    $div.append($li);
                }
                el.find('> ul').html($div.html());
            };
            
            var start = function() {
                if(el.find('.bar').is(':hidden')) {
                    el.addClass('onDraw');
                    el.find('.bar').slideDown({
                        duration : 1000
                    });
                } else {
                    el.addClass('onDraw');
                    setTimeout(function() {
                        el.find('.bar').slideDown({
                            duration : 1000
                        });
                    }, 100);
                }
            };
            
            el.barChartSetup = function(barData, type) {
                arr = barData;
                setup(type);
            };
            
            el.barChartStart = function() {
                start();
            };
            
            
            if($(this).data('barChart')){
                $(this).removeData('barChart');
            }
            $(el).data('barChart', this);

            return el;
        };
    }());
}(jQuery));


