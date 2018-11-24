/**
 * PCXHIAE0008 : ���������_common_js
 * /cxh/js/mblhomeIa/common/common.js
 */
// ���� val method ����
var oldValFunction = $.fn.val;
var kakaoInitFlag = true;
var smsTimer = null;

// val method ������
$.fn.val = function() {
    var args = Array.prototype.slice.call(arguments, 0),
        ret = oldValFunction.apply(this, args);
    
    // get�� ���
    if(args.length == 0) {
                
        // get�� �� Ÿ���� .hasDatepicker(Ķ����) Ŭ������ ������ ���� ��� value �� �տ� '20' ���ϱ�
        if($(this).hasClass('hasDatepicker')) {
            
            // ���� ���� ��� �տ� '20'�� ����
            if(ret !== '' && ret.split('.')[0].substring(0, 2) !== '20') {
                ret = '20'+ret;
            } 
        }
    }
    
    return ret; 
};

$(document).ready(function() {
    //ios���� Ŭ���� �ݿ�
    var userAgentCheckP = navigator.userAgent || navigator.vendor || window.opera;
    if(/iPad|iPhone|iPod|Macintosh/.test(userAgentCheckP) && !window.MSStream) {
        $('body').addClass('ios');
    };

    //�������� �Ⱥ��̴� ��ư 
    if($.cxhia !== undefined && $.cxhia.isApp() == false) $('body').addClass('web');
});

// �Ѱ� ���� ������ ��Ʈ������ ����
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

//��ȿ�Ⱓ ���Է¿Ϸ�� Ű�е� ����
$(document).on('input.tel', 'input', function() {
                    if($(this).attr('maxlength') == 2 && $(this).val().length == 2 && $(this).attr('placeholder') == 'YY') {
                                $(this).blur();
                    }
});

/********************************************************************************
* ���� ���ӽ����̽�
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
    * �ε���
    * @method commonJs.loading.open() �ε� �̹��� ����
    * @method commonJs.loading.close() �ε� �̹��� �ݱ�
    */
    ns.loading = {
        config : {
            wrap : 'loading',
            dim : 'loadingDim',
            imgSrc : 'https://img1.kbcard.com/cxh/ia_img/common/loading.gif'
        },
        
        /**
        * �ε��ٰ� ���������� �������� ���� �� �ε��� + dim ����
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
        * �ε��� open
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
        * �ε��� close
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
    * ���� ��� ��ü
    */
    ns.global = {
        bw : $(window).width(),
        bh : $(window).height(),
        
        // util.disableScroll() �̺�Ʈ ���� Ƚ�� üũ
        disableScrollCount : 0,
        
        /**
        * container �� show / hide �Ǵ� ��� ���
        * window scrollTop �� ����
        */
        getScrollTop : function() {
            ns.global.saveTop = parseInt($('body').css('top'), 10) < 0 ? Math.abs(parseInt($('body').css('top'), 10)) : $(window).scrollTop();  
            setTimeout(function() {
                $(window).scrollTop(0);
            }, 0);
        },
        /**
        * container �� show / hide �Ǵ� ��� ���
        * ����� scrollTop ����ŭ ��ũ�� �̵�
        */      
        setScrollTop : function() {
            if(ns.global.saveTop > 0) {
                $(window).scrollTop(ns.global.saveTop);
                ns.global.saveTop = null;
            }
        }
    };
    
    /**
    * ���ټ� �̺�Ʈ
    */
    waiAccessibility = {
        config : {
            focusTimer : null
        },
        init : function() {
            // ���ټ�
            waiAccessibility.goFocus($('.topHead'));
            waiAccessibility.setCurrentTitle();
            waiAccessibility.hiddenText();
            waiAccessibility.stepText();
            waiAccessibility.cardTypeLengthCheck();
            waiAccessibility.inputSetAriaLabel();
            waiAccessibility.setFormWrapIng();
            waiAccessibility.cardNameToTitle();
            
            // 2017.01.07 SNS �����ϱ� aria-label �߰�
            waiAccessibility.setAriaLabel({
                target : $('.btnShare'),
                type : 'button',
                text : 'SNS �����ϱ�'
            });
            
            // 2017.01.13 �˾� �ݱ� ���ټ� �Ӽ� �߰�
            waiAccessibility.setAriaLabel({
                target : $('.popClose a'), 
                type : 'button',
                text : '�ݱ�'
            });
            
            // 2017.01.11 �׷��� ���ټ� �߰� (���ʿ��� �׸� ��Ŀ�� x)
            $('.barGraph').attr('aria-hidden', true);
            
            // 2017.01.12 �������� ��ȭ��ȣ �ȳ� Ÿ��Ʋ
            $('#callPhoneNum').attr('title', '�������� �޴���ȭ��ȣ');
            
            // ���������� �ؽ�Ʈ ����
            $('.certificateList > ul > li > a').each(function() {
                var $ico = $(this).find('> .ico');
                $ico.after('<span class="hidden">' + $(this).text() + '</span>');
            });
            
        },
        
        /**
        * 2016.11.11
        * �ǰ��� ���ټ� Ÿ��Ʋ �߰� ��û
        */
        setCurrentTitle : function() {
            var $tabList = $('.tabDep0, .tabDep1, .tabDep2, .benefitTab');
            
            if($tabList.length > 0) {
                $tabList.find('li.on > a').attr('title', '���õ�');
            }
        },
        
        /*
        * 2017.01.02 ���ټ� �߰� (hidden Ŭ������ ���� ��� �ش� �±� ���� ��ҿ� role="text" �߰�)
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
                    
                // ������ġ �˻� ��ư, �������� ���� �ڼ������� ��ư�� ��Ŀ�� ������ ����
                } else if(!$(this).parent().hasClass('btnSrch') && !$(this).parent().hasClass('btnMap')) {
                    $(this).attr('aria-hidden', true);
                }
                */
            });
        },
        
        /*
        * 2017.01.04 ���ټ� �߰� ( ���� �ִ� ������ ���� ���ټ� �ؽ�Ʈ �߰� )
        */
        stepText : function() {
            var $stepBox = $('.stepBox');
            
            if($stepBox.length > 0) {
                var count = $stepBox.find('.stepList li').length,
                    index = $stepBox.find('.stepList li.on').index(),
                    title = $stepBox.find('h2').text();
                    
                $stepBox.attr('role', 'img');
                $stepBox.attr('aria-label', '�� ' + count + '�ܰ� �� ' + (index + 1) + '�ܰ�, ' + title);
            }
        },
        
        /*
        * 2017.01.07 ���ټ� �߰� ( ī�� �ȳ�/��û ������ ī��Ÿ�Ը��(.cdBtn)�� �ڽİ����� 1���� �� roleText ����
        */
        cardTypeLengthCheck : function() {
            var $cardTypeBtn = $('.cardDetailTop > .cdBtn > a'),
                getCardTypeBtnLen = $cardTypeBtn.length;
            
            if(getCardTypeBtnLen > 0) {
                if(getCardTypeBtnLen > 1) {
                    $cardTypeBtn.each(function() {
                        var getText;
                        
                        if($(this).hasClass('on')) {
                            getText = $(this).text()+'ī�� ���õ�'
                        } else {
                            getText = $(this).text()+'ī��'
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
                        text : $cardTypeBtn.text()+'ī��'
                    });                 
                }
            }
        },
        
        /**
        * 2017.01.07 ���ټ� �߰���ǲ title ���� �߰�
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
        * 2017.01.07 ���ټ� �߰� (���� ���������� �˾�)
        */
        setFormWrapIng : function() {
            var $formWrap = $('.formWrap');
            
            if($formWrap.length > 0) {
                $formWrap.each(function() {
                    var getText = $(this).find('> label').text();
                    if($(this).hasClass('ingOn')) {
                        $(this).attr('role', 'button');
                        $(this).attr('aria-label', getText+' ������');
                    } else if ($(this).hasClass('ingOff')) {
                        $(this).attr('role', 'button');
                        $(this).attr('aria-label', getText+' ���࿹��');
                    }
                });
            }
        },
        
        /**
        * 2017.01.09 ���ټ� �߰� (�żӹ߱� ī���û, ä������ ���ǻ�ȯ�� ī���û ��ư�� ī��� title �߰�)
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
        * ���ټ� ���� ��Ŀ�� �̵� �Լ� Ÿ���� ���� ù��° ��ҿ� ������ �ش� ��ҷ� ��Ŀ�� �̵�
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
        * 2017.01.02 ���ټ� �߰�
        * @param opts ���ټ� ���� ���� �ɼ�
        * @param opts.target ������ �߰��� Ÿ��
        * @param opts.text ���õ� �ؽ�Ʈ
        * @param opts.title ���õ� �˾� Ÿ��Ʋ
        * @pram {boolean} isFocus �ش� ���� true�� ��� target���� ��Ŀ�� �ٽ� ����
        * @example
        * waiAccessibility.setAriaLabel({
            target : $('�˾� ��ư'),
            type : 'text',
            text : '���õ� Ÿ���� �ؽ�Ʈ',
            title : '���õ� Ÿ�� �˾��� Ÿ��Ʋ',
            activeText : '���� ���� ǥ�ÿ� Ÿ��Ʋ(���õ�(������) or ���þȵ�(����))' // ���ڵ�� �Ǵ� üũ�ڽ����� Ÿ�Կ� ���
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
            
            // getText ���� ''�̳� undefined�� �ƴ� ���
            if(getText !== '' && getText) {
                result += getText;
            }
            
            // getTitle ���� ''�̳� undefined�� �ƴ� ���
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
        * 2017.01.17 ���ټ� �߰�
        * @param {jQuery} curTarget ���õ� ������
        * @param {jQuery} siblingsTarget ���õ� �������� ������ҵ�
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
                    curTarget.find('> a').attr('title', '���õ�');
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
                    $(this).find('> a').attr('title', '���� �ȵ�');
                }
            });
        },  

        /**
        * 2018.03.15 ���ټ� �߰�
        * @param {jQuery} curTarget ���õ� ������
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
        * 2017.01.09 ���ټ� �߰� (freeMode �������� ���ټ� ������ �׺���̼� ��ư ���� �޼���)
        * @param opts �ɼ� ��
        * @param opts.target ������
        * @param opts.prevButton.class ���� ��ư Ŭ����
        * @param opts.prevButton.text ���� ��ư �ؽ�Ʈ
        * @param opts.nextButton.class ���� ��ư Ŭ����        
        * @param opts.nextButton.text ���� ��ư �ؽ�Ʈ
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
        * 2017.01.14 ���ټ� �߰� ( freeMode �������� �̵��� ���� ���� ���̴� �����ۿܿ��� ��� aria-hidden=true
        */
        setFreeModeSwipeAriaHidden : function(opts) {
            var swiperSettings = opts || {},
                $item = swiperSettings.list,
                moveValue = Math.abs(swiperSettings.moveValue), // ��� ��ȯ
                maxValue = moveValue + swiperSettings.wrapWidth, // ���� �̵��� ���� ���δ� wrap�� ���� ����
                saveArr = [];

            $item.each(function(index) {
                var minCheckLeft = Math.round($(this).position().left),
                    // maxCheckLeft = minCheckLeft + parseInt($(this).innerWidth(), 10);
                    maxCheckLeft = minCheckLeft + (parseInt($(this).innerWidth(), 10) / 2);
                    // maxCheckLeft = minCheckLeft;
                    
                // �ش��ϴ� item�� position ���� moveValue ���� ���ų� maxValue���� Ŭ ��� hidden
                if(moveValue > minCheckLeft || maxCheckLeft > maxValue) {
                    $(this).attr('aria-hidden', true);
                    $(this).removeClass('firstFocus');
                    $(this).removeClass('lastFocus');
                } else {
                    $(this).attr('aria-hidden', false);
                    saveArr.push(this);
                }
            });
            
            // ��Ŀ�� Ÿ�� ����
            $(saveArr[0]).addClass('firstFocus').data('visibleLength', saveArr.length);
            $(saveArr[saveArr.length-1]).addClass('lastFocus').data('visibleLength', saveArr.length);
        }
    };
    
    /**
    * ��ƿ
    */  
    util = {
        
        /**
        * CSS3 ��밡�� ���� üũ
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
        * arr[index]�� �Լ� ���� �� �� �迭�� ���� �� �迭 ��ȯ
        * @param {jQuery | HTMLElement}  target ������Ʈ ������
        * @param {Function} funcName �Լ���
        * @param {Object} opts �ɼ� ��
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
        * �ֻ�� ��ũ�� �̵�
        * @param {HTMLElement | jQuery} target scrollTop(0)�� �����ų ������Ʈ (default�� $(window).scrollTop(0))
        */
        scrollTop : function(target) {
            var $target = target ? $(target) : $(window);
            $target.scrollTop(0);
        },
        
        /*
        * ��� ������ ��ҵ��� ���� ���� ������
        * @example
        * util.getFixItemTop();
        */
        getFixItemTop : function() {
            var $topHead = $('.topHead').filter(':visible'),
                $fixItem = $('.fixItem').filter(':visible'),
                offsetTop = 0;              
            
            // head�� ������ ��� ��� ���̰� ��
            if($topHead.length > 0) {
                offsetTop += parseInt($topHead.innerHeight(), 10);      
            }
            
            // fixItem�� ������ ���
            if($fixItem.length > 0) {
                $fixItem.each(function() {
                    offsetTop += parseInt($(this).innerHeight(), 10);
                });
            }
            
            return offsetTop;
        },
        
        /*
        * 2016.11.02
        * ���̰� get
        * @return topHead�� fixed ��Ҹ� ������ ����̽� ���̰�
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
        * ������ Ÿ���� offset top �� ��ŭ ��ũ�� �̵�r
        * @param {jQuery | HTMLElement} target Ÿ��
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
        * �˾� ���� �� ��ũ�� ����
        * @param {Boolean} isCheck true ���� �� ��ũ�� ���� fasle ��ũ�� Ǯ��
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
        * fixedBCheck Ŭ������ ���� �� Ư�� �̺�Ʈ ����� fixedBArea show / hide
        * @param {String} sValue 'show' : show, 'hide' : hide
        */
        fixedBCheck : function(sValue) {
            /*
            * 2016.10.12 �ٷ���ݰ���
            * ��� ���� ������ fixedBArea ��ư ����/����
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
        * �޸� ����
        * @param {Number} x
        */
        comma : function(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        
        /*
        msg : ���� ����  
        kakaoImg : �̹���URL
        width : �̹��� ����
        height :�̹��� ����
        text : ��ư txt
        url : �̵��� url
        
        ����� : commonJs.util.intgraKakaoLink(msg,kakaoImg,width,height,text,url);
        
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
                
                alert("������ �����߽��ϴ�");
              }
            });
          }
        },

        
        /**
        * 2016.12.25
        * show / hide �̺�Ʈ detect
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
    * �ʱ�ȭ �Լ�
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
    * �������� �̺�Ʈ
    */
    resizeEvent = function() {
        var timer = null;
        $(window).resize(function() {
            clearTimeout(timer);
            timer = setTimeout(function() {
                
                // ������ �ּ�â Ȱ�� / ��Ȱ�� �ɶ� �������� ���� ����
                if(ns.global.bw !== $(window).width()) {
                    ns.global.bw = $(window).width();
                    ns.global.bh = $(window).height();              
                    
                    // ����ī�� ���� �������� �� ��������� ���̰� ������
                    arcodians.fixedToggle.resize();
                    
                    // �˾� ��������
                    layerPopup.resize();
                    
                    // �Ϸ������� ������ ��� ����
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
        
        // ����� �� �ּ�â ũ�� üũ�ؼ� ns.global.bh �� ����..
        $(window).scroll(function() {
            if(window.innerHeight && window.innerHeight !== ns.global.bh) {
                ns.global.bh = window.innerHeight;
                
            }
        });
    };
    
    /************************************
    * ������ ���� ��ũ��Ʈ
    *************************************/
    common = {
        config : {
            rotateTimer : null                      // setRotateAppCard Ÿ�Ӿƿ� �����
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
        * �ֹε�Ϲ�ȣ ����üũ �׼�
        * '.inpBirthDate .backNumber' �ش� �����Ͱ� ���� �� ��� �ֹε�� �� ù��° ���� ����ŷ UI ����
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
        * section show / hide �̺�Ʈ ���� (���ߴܿ��� show / hide ���������� �۾���)
        * show / hide ĳġ �� setTimeout�� �ɾ� �ѹ��� �ʰ� ����
        * - section�� .show() / .hide()�� ����� ���������� �־� �����ϱ� ���� �߰�)
        * - main section�� popup ui section�� ��� ��ũ�� ��������ε� ���
        * - �ش� �޼��� �ȿ� ���� setTimeout�� ������������ �̺�Ʈ���� ������ ���߱����� �߰��Ǿ���.
        */
        detectEvents : function() {
            util.detect.show('section', function(e) {   
                var $mainSection = $('section').eq(0),
                    $target = $(e.target);
                
                if($target.hasClass('container')) {
                    
                    // show �Ǵ� section�� ���� section�� ��� ������ scrollTop set
                    if($target.attr('id') === $mainSection.attr('id')) {
                        setTimeout(function() {
                            ns.global.setScrollTop();
                        }, 0);
                    } else {
                        
                        // �ε� ������ disableScroll�� ���� body�� �����Ǿ� show �Ǵ� ������ �Ⱥ��̴� ���� ����
                        setTimeout(function() {
                            util.saveTop = 0;
                            if(parseInt($('body').css('top'), 10) < 0) {
                                $('body').css('top', 0);
                            }
                        }, 0);
                    }
                    
                    // section �±� show / hide�� fixedBArea ��ư ��ġ ���� �ȵǴ� ������������ �߰�
                    setTimeout(function() {
                        ns.changeSection();
                        
                        tabs.setup();
                        // �� ���� ���̵�α���, ���������� �α���, ����α��� ȭ���� show/hide�� �ٲ� �� �ϴ� ��� �� tabs �޴� css ������ (tabs�� eventAll.setup�ȿ� �������)
                        arcodians.eventAll.setup();     
                    }, 0);
                }
                
                // ī���û / ��õī�� ���Ŀ�ī�� contArea�ϰ�� ���� ���Ŀ�ī�� �������� ��������
                if($target.attr('id') === 'alphaGuid') {
                    setTimeout(function() {
                        swipers.refresh($target.find('.swipeTab'));
                    }, 0);
                }
                
                // 2017.01.16 �ϴ� ������ư fixedBArea ��ư�� show �� ��� container padding-bottom �� ������
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
                                        
                    // hide �Ǵ� section�� ���� section�� ��� scrollTop save
                    if($target.attr('id') === $mainSection.attr('id')) {
                        ns.global.getScrollTop();
                    }
                }
                
                // 2017.01.16 �ϴ� ������ư fixedBArea ��ư�� hide �� ��� container padding-bottom �� ������
                if($target.hasClass('fixedBArea')) {
                    setTimeout(function() {
                        common.setContainerPadding();
                    }, 0);
                }
            });
            
            
        },

        /**
        * fixedBArea ��ư�� ���� ��� container padding left & right �� 90px
        * 2016.12.23 fixedBArea ��ư�� ���̴� ���� 60 (fixedBArea ���� ������ �Ǵ� ��찡 �־� ��ư ���� ����)
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
        * fixedBArea ��ư�� footer�� �������� ���� ���� �� fixedBarea ��ũ�� �̺�Ʈ ����
        * ��� �̽��� fixedBtn�� �ؽ��� �Է��� �� input ������ ���������� �������� keypadOn Ŭ���� �߰�
        * 2016.12.12
        * ����ī�� ���� ��ư �߰�('.customCard')
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
                    
                    // footer ��ܿ� fixedBarea ��ư ����
                    if(winTop >= checkTop && $footer.is(':visible') || $fixedBtn.hasClass('keypadOn')) {
                    
                        $container.css('position', 'relative');
                        $fixedBtn.css('position', 'absolute');
                    
                    // ���� ����
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
        * Ư�� label �±� ���� �ؽ�Ʈ span���� ������
        */
        labelAppend : function() {
            var $wrap = $('.inpTxt1, .selType1');
            
            if($wrap.length > 0) {
                $wrap.each(function() {
                    var $label =  $(this).find('> label'),
                        $span = $('<span />'),
                        text = $label.html();
                    
                    // label ���� input�� ���� ��                 
                    if(!$label.find('input').length) {
                        $span.html(text);
                        $label.html($span);
                    }
                });
            }
        },
        
        /**
        * tabDep1�� ��� ���� ���� üũ�Ͽ� ���� ���� �������ִµ�
        * toggle ������ tab ���̰��� �������� ���Ͽ� ������ �ʱ� �ε�� ��� ���� ��� open
        * ��� ���� �÷����� ���� �� �ڵ����� hide ó��
        */
        toggleOpen : function() {
            var $toggleView = $('.inbox, .toggleView');
            
            if($toggleView.length > 0) {
                $toggleView.show();
            }
        },
        

        /**
        * fixItem�� �������ִ� ��� fixed ����
        */
        fixedSetup : function() {
            var $topHead = $('.topHead').filter(':visible'),
                $fixItem = $('.fixItem').filter(':visible'),
                $fixedBtn = $('.fixedBArea').filter(':visible'),
                $container = $('.container').filter(':visible'),
                sum = 0;                            // fixItem top ��
                
            if($topHead.length > 0) {
                sum = $topHead.outerHeight();
            }
            
            $fixItem.each(function() {
                var fixHeight = $(this).outerHeight();
                
                // �ش� ��Ұ� tabDep1�� ���
                if($(this).children().hasClass('tabDep1')) {
                    fixHeight = 49;             // tabDep1 ���̰� ������ "tabDep1 ����" �˻��ؼ� ���� ����
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
            * 2016.10.12 �ٷ���ݰ���
            * ��ݰ��������� ������ fixedBArea ��ư ���� / ���� ����� ���� �ش� Ŭ���� ���� �� ������ �ε�� none ���·� ����
            */
            if($('.container').hasClass('fixedBCheck')) {
                $fixedBtn.css('display', 'none');
            }
        },
        
        /**
        * 2016.11.28
        * .centerBox Ŭ������ �� ��� ���� ��� ����
        * 
        */
        centerAlign : function() {
            var $centerBox = $('.centerBox, .finish').filter(':visible'),
                $container = $centerBox.parent(),
                $footer = $('footer').filter(':visible'),
                boxHeight = 0,
                boxWidth = 0,
                containerHeight = ns.global.bh - $('.topHead').innerHeight();
            
            // ���̾� �˾� ���ο� �ִٸ� ��� x && layerWrap�� id�� id_layerWrap�� ���� ����
            // if($centerBox.closest('.layerWrap').length > 0 && $centerBox.closest('.layerWrap').attr('id') !== 'id_layerWrap') { return false; }
            
            // Ǫ�� ���� �� ����
            if($footer.length > 0) {
                containerHeight -= $footer.outerHeight();
            }
            
            // 2016.12.09 fixedBArea ��ư ���� �� ��ư ���� ����
            if($('.fixedBArea').length > 0) {
                containerHeight -= parseInt($('.fixedBArea').height(), 10);
            }

            // 2016.12.09 ���� ���� ���� ��� ���� ���̰� ����
            if($('.stepFixed').length > 0) {
                containerHeight -= $('.stepFixed').innerHeight();
            }
            
            // 2016.11.28
            $container.css('height', 'auto');
            
            if($centerBox.length > 0) {
                boxHeight = $centerBox.innerHeight();
                boxWidth = $centerBox.width();
                
                // 2016.12.09 .finish Ŭ������ ���� ��
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
      // ��û�Ϸ� ���������� �ϴܿ� infoBox(ī��߱޻��Talk)�� fixedArea ���� �ö�

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
        * section.container�� ����� Ŭ������ üũ�Ͽ� body�� class ����
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
        * ������ ���ִ� �޷� ����
        */
        removeCalendar : function() {
            var $calBox = $('.calBox');
            
            if($calBox.length > 0) {
                $calBox.remove();
            }
        },
        
        /**
        * 2016.10.26 (���߿�û����)
        * ������ ��ũ�ѽ� ���κб��� ��ũ������ ��� trigger ���� (������ ��ũ�� :'kbcard-load', �˾� ���� ��ũ�� : 'kbcard-popContLoad')
        */
        scrollEndCheck : function() {
            var saveWinTop = $(window).scrollTop(),
                savePopTop = $('.popCont').filter(':visible').scrollTop();
            function endCheck() {
                var $doc = $(document),
                    docHeight = $doc.innerHeight(),
                    winTop = $(window).scrollTop(),
                    checkTop = docHeight - 50;
                
                // ��ũ���� �������� �̺�Ʈ �߻�
                if(saveWinTop <= winTop && winTop + ns.global.bh > checkTop) {
                    $(document).trigger('kbcard-load');
                }
                
                // ���� scrollTop �� ����
                saveWinTop = winTop;
            }   
            
            // �ʱ� ����        
            endCheck();
            
            // ��ũ�ѽ� �Լ� ����
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
                
                // ��ũ���� �������� �̺�Ʈ �߻�
                if(savePopTop <= scrollTop && scrollTop + parseInt($(this).innerHeight(), 10) > checkTop) {
                    $(this).trigger('kbcard-popContLoad', [getId]);
                }
                
                // ���� scrollTop �� ����
                savePopTop = scrollTop;
            });
        },
        
        /**
        * 2016.11.01
        * ���ǻ��� Ŭ���� �߰� ico_noteŬ���� �������� üũ
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
        * ��ī�� ���η� �Ǿ��ִ� ī�� �̹��� rotate & width,height ����
        * OP_1.1.1
        */
        setRotateAppCard : function() {
            var $rotateImg = $('.rotate > img'),
                imgCount = 0;
            
            if($rotateImg.length > 0) {
                clearTimeout(common.config.rotateTimer);
                common.config.rotateTimer = setTimeout(function() {
                    $rotateImg.each(function() {
                        
                        // �̹��� �ε� üũ
                        $(this).one('load', function() {
                            imgCount += 1;
        
                            // �̹����� ��� �ε�Ǹ� ����
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
                                
                                // ī�� �� ��ȸ��
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
        * android 4.1�̻� ������ ���信���� input �±��� maxlength ���� ������ �ȵǴ� ������ ����
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
        * ����ȭ�̹��� ����
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
        * bottomArea ��ư�� ���� ��� ��ü ���̰��� �ּ� ������ ����
        * ��ư�� ������ �������� '.minContent'�� ���ΰ� �־�� �Ѵ�
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
    * DOM ���� �̺�Ʈ
    * CM : ����
    * MB : ȸ��
    * MK : My KB
    * BN : ����
    * FL : ����
    * CS : ������
    * CR : ī���û
    * SV : ����
    * OP : ����
    */
    domEvents = {
        init : function() {
            domEvents.bindEvents();
        },
        
        bindEvents: function() {
            
            /*****************************************************************************
            * CM : ����
            ******************************************************************************/
            $(document).on('click.disabled', 'a', function(e) {
                if($(this).hasClass('disabled') || $(this).parent().hasClass('disabled')) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
            
            /**
            * ������ ��ư �̺�Ʈ ����
            * 2016.12.04 ��ũ�� ������� �̵��Ǵ� ���� ����
            * 1. ���� ������ �����ϱ� ���� $(document)�� �̺�Ʈ ����
            * 2. ���ߴܿ��� �۾��� �κп��� $('.moreBtn >a').remove() ��Ű�� �������� $(document)�� �ɾ���� �̺�Ʈ���� ���� ����Ǿ� '.moreBtn > a'�� ã�� �� ����
            * 3. 2�� ������ �����ϱ� ���� $('.moreBtn > a')�� ���� preventDefault �̺�Ʈ �ϳ� �� �߰�
            */
            $('.moreBtn > a').on('click', function(e) {
                e.preventDefault();
            });
            $(document).on('click.moreBtn', '.moreBtn > a', function(e) {
                e.preventDefault();
            });
            
            // input�� change �̺�Ʈ�� �߻��Ҷ����� type checked setTime���� ����ӵ� �ڷ� ����
            $(document).on('click.typeCheck', 'input', function() {
                setTimeout(function() {
                    //formEvent.typeClass();
                    common.fixedBtnScroll();
                }, 0);
            });
            
            // 2016.12.13 btnCheck Ŭ������ ���� ��ư Ŭ���� toggleClass on 
            $(document).on('click.mkBtnCheck', 'button.btnCheck', function() {
                $(this).toggleClass('on');
            });
                        
            // tabDep1 Ŭ������ ������ �ִ� �� �޴��� ��ũ������ #�� ���°�� e.preventDefault()
            $(document).on('click.preventDefault', '.tabDep1 a', function(e) {      
                if($(this).attr('href').match(/#/gi)) {
                    e.preventDefault();
                }
            });
            
            // 2017.01.02 ����ȭ�̹��� �ڵ� �˾�
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
            
            // �ϴ� ������ư Ŭ���� �� input�� ��Ŀ���� on�Ǿ��ִ� ��� ��Ŀ�� �ƿ�
            $(document).on('touchstart.fixedBtn', '.fixedBArea > a', function() {
                $('input').blur();
            });

            // �˸��� ��ġ�� �ݱ� (CM_6.3.html)
            $(document).on('click.tgl', '.tglBtn', function(e) {
                e.preventDefault();
                $(this).parent().toggleClass('open');
            });
            
            /* ��������(���������� ����)
            * ���� : disabled
            * üũ : checked
            */
            $(document).on('click.certificateList', '.certificateList a', function(e) {
                e.preventDefault();
                var $li = $(this).parent(),
                    $liSiblings = $li.siblings().not('.disabled');
                
                if($li.hasClass('disabled')) { return false; }
                
                $liSiblings.removeClass('checked');             
                $(this).parent().addClass('checked');
            }); 
            
            // 2017.01.11 �ϴ� ���� ��ư keypadOn Ŭ����
            $(document).on('touchstart.preventEvent', '.fixedBArea.keypadOn', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });     
            
            // ������ ���� ���� ��� (CM_5.1.1T.1.1.html)
            if($('.termsBox').length > 0) {
                var $termsBox = $('.termsBox'),
                    $couponBox = $termsBox.find('> .couponboxList'),
                    $fncBtn = $termsBox.find('.fncBtn'),
                    $editBtn = $('.editBtn');
                
                // ���� ��ư
                $fncBtn.off('click');
                $fncBtn.on('click', '.btbEdit', function() {
                    $(this).hide();
                    $(this).next().show();
                    $editBtn.show();
                    $couponBox.addClass('listEdit');
                    common.setContainerPadding();
                });
                
                // ���� ��� ��ư
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
            
            // formWrap�ȿ� a�±� ���� ��
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


                // 2016.11.14 ���ټ� �߰�
                waiAccessibility.changeRadioTitle($formWrap, $formWrapSiblings);
                
            });
            
            /*****************************************************************************
            * FL : ����
            ******************************************************************************/
            // ���ī�����, �ܱ�ī����� �����Է� ��� ���̾�
            $(document).on('click.calculator', '.calculatorBox > input[type="button"]', function() {
                var $calculator = $(this).closest('.calculator'),
                    $sumRead = $calculator.find('.sumRead'),
                    $sumInput = $sumRead.find('> input'),
                    maxValue = parseInt($calculator.find('.popTop span > em').filter(':visible').text().split(',').join('')),
                    getValue = $sumRead.find('> input').val().split(',').join(''),
                    getCalculatorPopupIndex = $calculator.index('.calculator');
                    
                
                // calculator �˾� �ݾ� ���� ��ư
                if($(this).hasClass('delete')) {
                    getValue = getValue.slice(0, getValue.length-1);
                    
                // calculator �˾� Ȯ�� ��ư
                } else if ($(this).hasClass('confirm')) {
                    
                    // aplcnAmtText : �ܱ�ī�� ���� ���� id (�ܱ�ī������� 1������������ �Է� ����)
                    if(getValue % 10 === 0 || $('#aplcnAmtText, #aplcnAmtTextKB, #aplcnAmtTextBC').length > 0) {
                        
                        // �Է��� �ݾ��� ���� �ִ� ��û�ݾ׺��� ���� ���
                        if(getValue <= maxValue) {
                            // ��Űī�����
                            $('#aplcnAmtText').text(util.comma(getValue));
                            
                            // 2017.01.05 ���ī����� applyNum�� �ΰ��� ��찡 �־� �θ� �˾� index�� üũ�Ͽ� �ش��ϴ� index�� input�� �ݾ� �� ����
                            // 2017.08.23 �Է°��� input�� �� �� �־� val�߰�
                            var applyNum = $('.applyNum').eq(getCalculatorPopupIndex);
                            
                            if(applyNum.length > 0) {
                                if(applyNum[0].tagName.toLowerCase() == 'input') {
                                    applyNum.val(util.comma(getValue));
                                } else {
                                    applyNum.text(util.comma(getValue));
                                }
                            }
                            
                            layerPopup.closePopup($calculator);
                        
                        // �Է��� �ݾ��� ���� �ִ� ��û�ݾ׺��� Ŭ ��� �ݾ��� ���� �ִ� ��û�ݾ����� ����
                        } else {
                            getValue = maxValue;
                            $sumInput.val(getValue);
                        }
                    
                    // ���ī����� : �Է��� �ݾ��� ���� 10���� ������ �ƴ� ���
                    } else {
                        // ���� ���� �޼��� ���
                        try {
                            $.cxhia.alert({
                                title: "Alert",
                                message: "10���� ������ �Է����ּ���."
                            });
                        } catch(e) {
                            alert("10���� ������ �Է����ּ���.");
                            console.log(e);
                        }
                        return false;
                    }
                
                // calculator �˾� �ݾ� ��ư
                } else {
                    getValue += $(this).val();
                    
                    // ù��° �Է� �ݾ��� 0�� ��� �Է� x
                    if(getValue.substring(0, 1) === 0) {
                        getValue = '';
                    }
                }
                
                // �ݾ��� �Է��Ҷ����� üũ�Ͽ� �޸� ǥ��
                $sumInput.val(util.comma(getValue));    
            });
            
            // 2016.12.20 ���ī����� ������ ������ư Ŭ���� �ϴ� ���� ����
            $(document).on('change.flRadioTxt', '.applyArea .type2 input[name="labelRdio"]', function() {
                var idx = $(this).index('[name="labelRdio"]'),
                    $radioTxt = $('.interestTxt').eq(idx);
                    
                $radioTxt.siblings('.interestTxt').hide();              
                $radioTxt.show();
            });
            
            // ���ī�����(ī���) ��û(FL_1.1.6.1)
            $(document).on('click.repayment', '.repayment input', function() {
                
                if($(this).parent().index() === 2) {
                    $('.amountList').find('input#rs9, input#rs10').attr('disabled', 'disabled').parent().addClass('disabled');
                } else {
                    $('.amountList').find('input#rs9, input#rs10').removeAttr('disabled').parent().removeClass('disabled');
                }
            });
            
            /*****************************************************************************
            * CR : ī���û
            ******************************************************************************/         
            // ī�� �ȳ�/��û �� ��ȸ�� ��ư
            $(document).on('click.annualFee', '.annualFee a', function(e) {
                e.preventDefault();
                
                var $thisWrap = $(this).closest('.annualFee');
                
                $thisWrap.toggleClass('on');
                
                // 2016.11.08 �ؽ�Ʈ ü��ġ �߰�
                if($thisWrap.hasClass('on')) {
                    $(this).text('ī�庸��');
                    
                    // 2016.12.06 ���� ī�� rotate
                    if($thisWrap.hasClass('rotate')) {
                        $thisWrap.children('.rotateArea').hide();
                    }
                } else {
                    $(this).text('��ȸ�񺸱�');
                    
                    // 2016.12.06 ���� ī�� rotate
                    if($thisWrap.hasClass('rotate')) {
                        $thisWrap.children('.rotateArea').show();
                    }
                }
            });
            
            // ����ī�� ��߱� ������ üũ������� ����Ÿ��
            $(document).on('click.useCheckPay', '.useCheckPay a', function(e) {
                e.preventDefault();
                
                var $thisWrap = $(this).parent(),
                    $wrapSiblings = $thisWrap.siblings();
                
                if(!$(this).hasClass('disabled')) {
                    $thisWrap.addClass('on');
                    $wrapSiblings.removeClass('on');
                    

                    // 2016.11.14 ���ټ� �߰�
                    $(this).attr('title', '���õ�');
                    $wrapSiblings.find('> a').removeAttr('title');
                }
            });         
            
            // ���� ���� ��û üũ / ����
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
            * BN : ����
            ******************************************************************************/             
            // ��� �ȳ� show / hide
            $(document).on('click.donationList', '.donationList > li > a', function(e) {
                e.preventDefault();
                var $back = $(this).siblings('.back');
                $('.donationList > li').find('> .back').hide();
                $back.show();
            });
            
            // 2016.11.23 ��Ÿ�� ����(BN_5.1.1P.html) �˾� ���� ����Ʈ ����Ʈ ����� label text ����    
            $(document).on('change.defaultSelect', '.defalutSelect select', function() {
                var $select = $(this),
                    $options = $(this).find('> option'),
                    $label = $('label[for="'+ $select.attr('id') +'"]'),
                    $selected = $options.filter(':selected');
                    
                $label.text($selected.text());
            }); 
            

            /*****************************************************************************
            * SV : ����
            ******************************************************************************/     
            // SV_1 �̺�Ʈ show / hide
            $(document).on('click.payment', '.paymentList li a', function(e) {
                if($(this).hasClass('svEventBtn')) {
                    e.preventDefault();
                    $(this).closest('li').addClass('on');
                } else if($(this).hasClass('svCloseBtn')) {
                    e.preventDefault();
                    $(this).closest('li').removeClass('on');
                }
            });
            
            // �ſ�/üũ ���� ���� ��û������ üũ �������� ���� ��
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
    * form ���� �̺�Ʈ
    * üũ �ڽ� Ŭ�� �� �θ� .formWrap�� checked Ŭ���� �߰�
    **************************************/ 
    formEvent = {
        init : function() {
            formEvent.config = {
                input : 'input',
                tabsInput : '.radioSel',
                fontRadio : 'input[name="fontSel"]'
            };
            

            
            // input ���� tabs �̺�Ʈ
            if($(formEvent.config.tabsInput).length > 0) {
                formEvent.formTabs();
            }
            
            // ���� - ��Ʈ ũ�� ����
            if($(formEvent.config.fontRadio).length > 0) {
                formEvent.onFontSize();
            }
            
            formEvent.text.init();
            formEvent.radio.init();
            formEvent.checkbox.init();
            formEvent.select.init();
            formEvent.date.init();
            formEvent.searchBox.init();
            
            // readonly, disabled, checked ���� üũ �� Ŭ���� �߰�
            if($(formEvent.config.input).length > 0) {
                formEvent.typeClass();
            }           

        },
        
        /*
        * �Է� ���� �ѹ��� üũ�Ͽ� �뽬 ó��
        */
        phoneFomat : function(num) {
            /**
            * ���� �б�ó��
            * 02,
            * 01x
            * 013x
            * 030x
            * 050x 
            */
            return num.replace(/(^02.{0}|^013.{1}|^030.{1}|^01.{1}|^050.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3");
        },
        
        /*
        * �Է� ���� �ѹ��� üũ�Ͽ� �뽬 ó�� ( ī���ȣ 4�ڸ����� - ó��)
        */
        cardFomat : function(num) {
            return num.toString().replace(/\B(?=(\d{4})+(?!\d))/g, "-");
        },
        
        /*
        * ������ �ε�� checked �� disabled�� üũ�Ͽ� Ŭ���� �߰�
        */
        typeClass : function() {
            $(formEvent.config.input).each(function() {
                                
                // input�� ���°� üũ ������ ���
                if($(this).is(':checked')) {
                    $(this).parent().addClass('checked');
                    
                    // 2017.01.17 ���ټ� �߰�
                    if($(this).attr('type') === 'radio') {
                        var $thisWrap = $(this).parent();
                        if($thisWrap.hasClass('formWrap')) {
                            waiAccessibility.changeRadioTitle($thisWrap, $thisWrap.siblings('.formWrap'));
                        }
                    }
                    // 2018.03.15 ���ټ� �߰�
                    if($(this).attr('type') === 'checkbox') {
                        var $thisWrap = $(this).parent();
                        if($thisWrap.hasClass('formWrap')) {
                            waiAccessibility.changeCheckboxTitle($thisWrap, $thisWrap.siblings('.formWrap'));
                        }
                    }
                    
                // input�� ���°� disabled ������ ���
                } else if($(this).is(':disabled')) {
                    if($(this).attr('type') !== 'password'){
                        
                        $(this).parent().addClass('disabled');
                        // 2017.01.12 ���ټ� �߰� (����� aria-hidden ����)
                        $(this).parent().attr('aria-hidden', true);
                    }
                
                // input�� ���°� readonly ������ ���
                } else if($(this).is('[readonly]')) {
                    if($(this).attr('type') !== 'password' && !$(this).closest('.calendar').length){
                        $(this).parent().addClass('readonly');
                    }
                    
                // �� �� ��� ���
                } else {
                    $(this).parent().removeClass('disabled');                       
//                  $(this).parent().removeClass('checked');
                    if($(this).attr('type') !== 'password'){
                    
                        $(this).parent().removeClass('readonly');
                    }
                    
                    // 2017.01.12 ���ټ� �߰� (����� aria-hidden ����)
                    $(this).parent().removeAttr('aria-hidden');

                    // 2017.01.17 ���ټ� �߰�
                    if($(this).attr('type') === 'radio') {
                        var $thisWrap = $(this).parent();
                        if($thisWrap.hasClass('formWrap')) {
                            waiAccessibility.changeRadioTitle(null, $thisWrap);
                        }
                    }        
                    // 2018.03.15 ���ټ� �߰�
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
        * ī���̿볻�� ����(MK_3.1P.html)
        * input �� tabs
        * data-id�� üũ�Ͽ� �ش��ϴ� ������ ����
        * tabCont�� tabShow Ŭ���� ������� �ʱ� �ε��� ���� x
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
                
                // 2016.10.26 �ش� thisCont�ȿ� a.layerOpen ��ư�� ���� ��� trigger('click'
                if($thisContLayerBtn.length > 0) {
                    $thisContLayerBtn.trigger('click');
                } else if ($thisContCalBtn.length > 0) {
                    $thisContCalBtn.trigger('click');
                }
            });
        },
        
        /*
        * 2016.10.26
        * ���� - ��Ʈ������ ���� �κ� �߰�
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
        * Ư�� ���������� value �� get
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
    * input �ؽ�Ʈ �̺�Ʈ
    */
    formEvent.text = {
        init : function() {
            var config = null;
            
            formEvent.text.config = {
                input : $('input[type="text"], input[type="number"], input[type="tel"], input[type="search"]'),
                // ��ȭ��ȣ�� �ƴѵ� type�� tel�� ��찡 �־� ��� ���̽� ����..
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
            * �ؽ�Ʈ �Է� ���� �� üũ
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
                
                // 2016.12.14 Ư�� �ȵ���̵������� ���Խ� ��ȯ�� Ŀ�� ��ġ�� ����� ���� ���ϴ� �̽� ����(Ŀ����ġ �� �ڷ�)
                clearTimeout(config.inputTimer);
                config.inputTimer = setTimeout(function() {
                    _that.selectionStart = _that.selectionEnd = _that.value.length;
                }, 10);
            });
            
            // 2016.11.16 ī��ѹ� ���ó�� �߰�
            config.input.filter('#cardNumber').off('input.cardNum');
            config.input.filter('#cardNumber').on('input.cardNum', function() {
                var _that = this,
                    _val = $(this).val().split('-');
                
                _val = _val.join('');
                
                this.value = formEvent.cardFomat(_val);
                
                // 2016.12.14 Ư�� �ȵ���̵������� ���Խ� ��ȯ�� Ŀ�� ��ġ�� ����� ���� ���ϴ� �̽� ����(Ŀ����ġ �� �ڷ�)
                clearTimeout(config.inputTimer);
                config.inputTimer = setTimeout(function() {
                    _that.selectionStart = _that.selectionEnd = _that.value.length;
                }, 10);
            });
            
            // input[type="text"] ��Ŀ�� �̺�Ʈ
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
                
                // Ŭ���� input�� ���� ������Ʈ�� label�� ���� ��
                if($label.length > 0) {
                    borderEvent = true;
                    $target = $(this);
                // Ŭ���� input�� label ���ο� ���� ��
                } else if($labelWrap.length > 0 ) {
                    borderEvent = true;                     
                    $target = $labelWrap;   
                // ��ȿ�Ⱓ ���̽�
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
                
                
                // input �Է� ���ڿ� ��Ŀ�� ���� �� fixedBtn ���ϴ� ����
                if($('.fixedBArea').length > 0) {
                    $('.container').css('position', 'relative');
                    
                    // 2016.12.20 focusin : container�� ���̰� $(window).height()�� ���̺��� ���� ��� ���� �����Ͽ� ���� ��ư ���ϴܿ� �ٵ��� �߰�
                    if(ns.global.bh > $('.container').innerHeight()){
                        $('.container').css('min-height', ns.global.bh - (parseInt($('.container').css('padding-top'), 10) + parseInt($('.container').css('padding-bottom'), 10)));
                    }
                    $('.fixedBArea').addClass('keypadOn').css('position', 'absolute');
                    
                    // 2017.01.02 ���������� ��ǲ ���Խ� fixed ������Ʈ �̽� ���� �߰�(�ֻ�� ����)
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
                
                // Ŭ���� input�� ���� ������Ʈ�� label�� ���� ��
                if($label.length > 0) {
                    borderEvent = true;
                    $target = $(this);
                // Ŭ���� input�� label ���ο� ���� ��
                } else if($labelWrap.length > 0 ) {
                    borderEvent = true;                     
                    $target = $labelWrap;   
                // ��ȿ�Ⱓ ���̽�
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
                
                
                // input �Է� ���ڿ� ��Ŀ�� ���� �� fixedBtn fixed ����
                if($('.fixedBArea').length > 0) {
                    $('.fixedBArea').removeClass('keypadOn');
                    
                    // 2016.12.20 focusout : container�� ���̰� $(window).height()�� ���̺��� ���� ��� ������ ���� �� ����
                    if(ns.global.bh < $('.container').innerHeight()){
                        $('.container').css('height', 'auto');
                    }                   
                    common.fixedBtnScroll();
                    
                    // 2017.01.02 ���������� ��ǲ ���Խ� fixed ������Ʈ �̽� ���� �߰�(�ֻ�� ���� ����)
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
    * ������ư �̺�Ʈ
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
                
            // ���� Ŭ�� �̺�Ʈ
            $(document).off('click.radio');
            $(document).on('click.radio', config.input, formEvent.radio.onRadio);
        },
        
        onRadio : function(e) {
            var config = formEvent.radio.config,
                $thisWrap = $(this).parent(),
                $thisName = $(this).attr('name');

            // click �̺�Ʈ�� commonJs.radio.clear()�� ���� ����� ��� onRadio �̺�Ʈ ����
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
            
            // 2017.01.11 ���ټ� �߰� (������ư ���� ���� ����);  
            waiAccessibility.changeRadioTitle($thisWrap, $thisWrap.siblings('.formWrap'));
            
            
            // 2016.11.14 ���ټ� �߰� radio type form�� a�±װ� ���� �� title="���õ�" ����
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
            
            // �ּҰ˻� ������ư Ŭ���� ���ּҷ� ��Ŀ�� �̵�
            if($(this).is('[name*="addressRadio"]')) {
                $(this).closest('.toggleView').find('input[name="remainAddr"]').focus();
            }
        },
        
        /**
        * ���õ� radiobox üũ ����
        */
        clear : function(target) {
            var $target = $(target),
                $thisWrap = $target.parent();
            
            /*
            * 2016.12.14 
            * click�� clear�̺�Ʈ�� �� ���� ��� onRadio�� ť ������ ���� �ش� �޼��带 �����ص� on�� �Ǵ� ��찡 �߻��� setTimeout���� �̺�Ʈ ���� ����
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
        * radio checked �̺�Ʈ ( a�±��� ��� data-id���� �ش��ϴ� ������ ���� )
        * @param {jQuery | HTMLElement} target input �Ǵ� a�±�
        * @example
        * // id ���� radoi0�� ������Ʈ�� ã�� checked
        * commonJs.radio.checked('#radio0');
        */
        checked : function(target) {
            var $target = $(target),
                $thisWrap = $target.parent(),
                $formTabCont = $target.closest('.tabBox').find('> .tabCont');
                
            $thisWrap.siblings().removeClass('checked');
            $thisWrap.siblings().find('input[type="radio"]').prop('checked', false);

            $thisWrap.addClass('checked');
            
            // tabCont ���� hide
            if($formTabCont.length > 0) {
                $formTabCont.hide();
            }
            
            // target�� data('id')�� ���� ��� �ش��ϴ� tabCont ����
            if($target.data('id')) {
                
                $('#'+ $target.data('id')).show();
            // data('id')�� ���� ��� $target�� checked
            } else {
                $target.prop('checked', true);
            }
        }
    };
    
    /*
    * üũ�ڽ� �̺�Ʈ
    * ���� ���Ǵ� ��ü ���� ���ý� �ϴ� üũ�ڽ� ���� X
    * �б� �ʿ�
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

            // üũ�ڽ� Ŭ�� �̺�Ʈ
            $(document).off('change.checkbox');
            $(document).on('change.checkbox', config.input, formEvent.checkbox.onCheckbox);
            
            // ��ü ����
            config.termsT.off('change.checkbox');
            config.termsT.on('change.checkbox', formEvent.checkbox.onAllCheck);

            config.termsL.off('change.checkbox');
            config.termsL.on('change.checkbox', formEvent.checkbox.onListCheck);
            
            
            /*
            * 2016.11.16
            * Ư�� �˾������� �����ϱ� ����� �˾� -> ���ڵ������ ����
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
            * �ʼ� üũ�ڽ� 'a'Ŭ���� üũ�ǵ��� ó��
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

            // 2018.03.15 ���ټ� �߰� (üũ�ڽ� ���� ���� ����);  
            waiAccessibility.changeCheckboxTitle($thisWrap, $thisWrap.siblings('.formWrap'));
            
            /*
            * 2016.10.12 �ٷ���ݰ���
            * ��� ���� ������ fixedBArea ��ư ����/����
            */
            if($('.fixedBCheck ' + config.input).filter(':checked').length > 0) {
                util.fixedBCheck('show');
            } else {
                util.fixedBCheck('hide');               
            }
            
            // sel type ��ü���� checkbox
            if($(this).closest('.radioSel').hasClass('eventCheck')){
                
                // ��ü ���� ��ư (ù��° ��ġ�� ��ư)
                if($thisWrap.index() === 0) {
                    if($thisWrap.hasClass('checked')) {
                        $thisWrap.siblings().addClass('checked');
                        $thisWrap.siblings().find($(config.input)).prop('checked',true);
                    } else {
                        $thisWrap.siblings().removeClass('checked');
                        $thisWrap.siblings().find($(config.input)).prop('checked',false);                   
                    }
                
                // �ι�°���� ����Ʈ ��ư
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
            * 2018.05.21 üũ�ڽ� �ʼ����� UI�߰�
            */
            if($(this).closest('.inner').hasClass('must')){
                if($(this).data('confirm') != 'complete') {
                    var layer = $(this).closest('.must').find('a').attr('href');
                    $(this).data('confirm','complete');
                    commonJs.layerPopup.openPopup(layer);
                }
            }
        },
        
        // ��ü ���� ��ư �̺�Ʈ
        onAllCheck : function(e) {
            var config = formEvent.checkbox.config,
                $thisBox = $(this).closest('.termsBox'),
                // termsL input
                $termsL = $thisBox.find(config.termsL),
                $termsLWrap = $termsL.closest('.termsList'),
                isRequired = $thisBox.find('.allCheck').hasClass('required'); // �ʼ� ������ ��� �ϴ� üũ�ڽ� ����
            
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
        
        // ��ü ���� ���� üũ�ڽ� ����Ʈ üũ
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

            // ��ü���� üũ ���¿� ���� üũ�� ����Ʈ ���� üũ
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
    * 2016.10.12 ����Ʈ �˾� �̺�Ʈ �߰�
    * �⺻ ����Ʈ ������Ʈ -> ���̾� �˾����� ��ȯ
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
        * ����Ʈ ���̾� ��ư + ���̾� �˾� ����
        * �˾� id ���� 'sl' + index������ ����
        */
        setup : function() {
            var config = formEvent.select.config;
            
            formEvent.select.setSelectLayer();          
        },      
        
        bindEvents : function() {

            var config = formEvent.select.config;
            
            // label �±� Ŭ���� ����Ʈ ���̾� ����
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
                        liLen = $selectList.find('li').length,                                  // ����Ʈ �˾� li�� ��
                        optionLen = $select.find('option').length,                              // ����Ʈ�� option ��
                        /*
                        * option ���� li�� ���� �ٸ� ���� index+1 ���� ���� �⺻ index 
                        * (������ �ε�� '����Ʈ ����'���� �ɼ��� �ִ� ��찡 �־� �б� ó��. ���� �ɼ��� ���̾��˾����� ������ ����)
                        */
                        getSelectIndex = liLen !== optionLen ? $li.index() + 1 : $li.index(),   
                        valueTxt = $(this).text();

                        
                    $selectBtn.text(valueTxt);
                    // $selectBtn.siblings('select option:eq('+getIdx+')').attr('selected', 'selected');
                    $select.find('option:eq('+getSelectIndex+')').prop('selected', true);
                    
                    // 2016.10.25 depth2 select show / hide �߰� ���е�ϱݽ�û ���б� ����(SV_1.6P.1.1.html)
                    if($selectBtn.parent().hasClass('selDep1')) {
                        var $selDep2 = $selectBtn.parent().next('.selDep2').children().eq($li.index());
                        $selDep2.removeClass('disabled').show();
                        $selDep2.find('> a').removeClass('disabled');
                        
                        // ��Ŀ�� ����
                        layerPopup.config.saveBtn = $selDep2.find('> a');
                        
                        $selDep2.siblings().addClass('disabled').hide();
                        $selDep2.siblings().find('> a').addClass('disabled');
                        
                        $('.selDep2').children().find('> a').each(function() {
                            var getHref = $(this).attr('href');
                            formEvent.select.setSelected(getHref, 0);   
                        });
                    
                    // 2017.01.05 ī���û 3�ܰ� ��û�ѵ� �Է� �κ� �߰�
                    } else if($select.hasClass('js-reqmaxselect')) {
                        if(valueTxt === '�����Է�') {
                            layerPopup.config.saveBtn = null;
                        }
                    // �� �ܴ� Ŭ���� �ش� ����Ʈ ��ư���� ��Ŀ�� �̵�
                    }
                    
                    layerPopup.closePopup($layerWrap);
                    
                    // ���� ���� trigger ù��° ���ڴ� Ŭ���� select Ÿ��, �ι�° ���ڴ� Ŭ���� ����Ʈ�� index ��
                    $select.trigger('change', [$select, getSelectIndex]);
                    
                    //2017.01.02 ���ټ� �߰�
                    // $selectBtn.attr('title', '���õ�');
                    waiAccessibility.setAriaLabel({
                        target : $selectBtn,
                        type : 'button',
                        title : $layerWrap.find('.popTop').text() + ' ���̾� �˾� ��ũ',
                        text : valueTxt + ' ���õ� '
                    });
                };          
            });
        },
        
        /*
        * ����Ʈ �ɼ� �� ���� (a tag href �� selector)
        * @param {String} id select�� ���� ��ư a�±��� href ��
        * @param {Number} index ������ option index ��
        * @example
        * // href���� #sl0�� �±׸� ã�� ���� ��� select�� ���� �ʱ�ȭ
        * commonJs.select.setSelected('#sl0', 0);
        */
        setSelected : function(id, index) {
            var $btnElem = $('a[href="'+ id +'"]'),
                $select = $btnElem.next(),
                $selectOption = $select.find('option').eq(index);
                
            $btnElem.text($selectOption.text());
            $selectOption.prop('selected', true);
            
            //2017.01.02 ���ټ� �߰�
            // $selectBtn.attr('title', '���õ�');
            waiAccessibility.setAriaLabel({
                target : $btnElem,
                type : 'button',
                title : $(id).find('.popTop').text() + ' ���̾��˾� ��ũ',
                text : $selectOption.text() + ' ���õ� '
            });
        },
        
        /*
        * ����Ʈ �ɼ� �� ���� (select id selector)
        * @param {String} select id ��
        * @param oValue ������ option index ��
        * @example
        * // href���� #sl0�� �±׸� ã�� ���� ��� select�� ���� ����
        * commonJs.select.setSelected('#sl0', 'optionValue');
        */
        setSelectedValue : function(id, oValue) {
            var $select = $(id),
                $btnElem = $select.prev(),
                $selectOption = $select.find('option[value="'+ oValue +'"]');
                
            $btnElem.text($selectOption.text());
            $selectOption.prop('selected', true);
            
            //2017.01.02 ���ټ� �߰�
            // $selectBtn.attr('title', '���õ�');
            if($selectOption.hasClass('defaultText')) {
                waiAccessibility.setAriaLabel({
                    target : $btnElem,
                    type : 'button',
                    title : $(id).find('.popTop').text() + ' ���̾��˾� ��ũ'
                });
            } else {
                waiAccessibility.setAriaLabel({
                    target : $btnElem,
                    type : 'button',
                    title : $(id).find('.popTop').text() + ' ���̾��˾� ��ũ',
                    text : $selectOption.text() + ' ���õ� '
                });         
            }
        },
        
        /*
        * Ÿ�� ������Ʈ�� �����ϴ� ����Ʈ �ɼ� �� �ʱ�ȭ
        * @param {jQuery | HTMLElement} elem �ʱ�ȭ��ų ����Ʈ���� ���δ� ��
        * @example
        * // .noRevolving ���ο� �����ϴ� select �� �ʱ�ȭ
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
        * ����Ʈ �ɼ� �߰� �޼���
        * @param {String} �߰���ų select Ÿ���� id
        * @param {Object} option�� value, text
        * @param {Number | String} opts.value option value ��
        * @param {Number | String} opts.text option text ��
        * @example
        * commonJs.select.addOption('#sl0', {
            value : 0,
            text : '�ɼ� �ؽ�Ʈ'
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
        * select option - > layer popup���� ����
        * @param {jQuery | HTMLElement} target ������
        * @param {Number} index �������� index �� ( ����Ʈ�� ���̵𰪵ڿ� �ٴ� ���ڷ� ���)

        */
        setLayer : function(target, index) {
            var config = formEvent.select.config,
                id = config.id + index,
                $layerBtn = $('<a href="#" class="layerOpen" />'),
                $layerWrap = $('<div class="layerWrap" />'),
                $layerTop = $('<div class="popTop" />'),
                $layerTopTxt = $('<strong class="fs2" />'),
                $layerCont = $('<div class="popCont type2" />'),
                $layerCloseBtn = $('<span class="popClose"><a href="#">�ݱ�</a></span>'),
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

            // ù��° �ɼ� ���� ����Ʈ �ɼ��̹Ƿ� �ι�° �ɼǺ��� for�� ����
            for(var i=0, len = $option.length; i< len; i++) {
                var $selectLi = $('<li />'),

                    $selectA = $('<a href="#" />'),
                    $curOption = $option.eq(i);
                
                if(!$curOption.text().match('����')) {
                    // 2016.11.18 option�� defaultText Ŭ���� ���� �� �˾��� �ɼ� �߰� x
                    if(!$curOption.hasClass('defaultText')){
                        $selectA.text($curOption.text());
                        $selectLi.append($selectA);
                        $selectUl.append($selectLi);
                        
                        // disabled�� �� ����Ʈ a ������Ʈ�� Ŭ���� �߰�
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
                        
            // �ش� �˾��� ���� ��� ���� �������� ����
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

            // ���� �� Ŭ���� �߰�
            if(target.hasClass('col2')){
                $selectUl.addClass('col2 center');
            } else if(target.hasClass('col5')) {
                $selectUl.addClass('col5 center');
            }
            
            // 2017.01.14 ���ټ� �߰� (getTitle �� default �ؽ�Ʈ�� �����ϰų� option���� defaultText�� ���� ��� �⺻ label�� ���̾��˾��� title ��)
            if(getTitle === defaultText || $option.filter('.defaultText').length > 0) {
                waiAccessibility.setAriaLabel({
                    target : $layerBtn,
                    type : 'button',
                    title : getTitle + ' ���̾��˾� ��ũ'
                });         
            
            // ���� ���ǹ��� ��ġ���� ���� ��� ���õ� �ؽ�Ʈ ����
            } else {
                // $layerBtn.attr('title', '���õ�');
                waiAccessibility.setAriaLabel({
                    target : $layerBtn,
                    type : 'button',
                    title : getTitle + ' ���̾��˾� ��ũ',
                    text : defaultText + ' ���õ� '
                }); 
            }

        },
        
        /**
        * ��ü ����Ʈ ������ ����Ʈ�� ����
        * @example
        * commonJs.select.setSelectLayer();
        */
        setSelectLayer : function() {
            var formSelect = formEvent.select,
                config = formSelect.config;     
                    
            config.target.each(function(index) {
                // selType1�� disabled Ŭ������ ���� �� layerPopup ��ȯ���� ����
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
    * �޷� ���� �˾� ��/��/��
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
        * �⵵ setup method
        * @param {Number} index selector index
        * @param {Object} opts �ɼ� ��ü
        * @param {Number} opts.year ���� �⵵ default : ���� �⵵
        * @param {Number} opts.startYear �⵵ ����
        * @param {Number} opts.endYear �⵵ ��
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
                $target.html('<option>�� ����</option>');
                for(var y=startYear; y <= endYear; y++) {
                    $target.append('<option>'+ y + '��</option>');
                }
            
                setLayer($target, $target.index('select'));     
            }
        },
        
        /**
        * �� setup method
        * @param {Number} index selector index
        * @param {Number} maxDay ����� �� �� default�� 27�ϱ���
        * @public       
        */
        daySetup : function(index, maxDay) {
            var config = formEvent.date.config,
                setLayer = formEvent.select.setLayer,
                maxDay = maxDay || 27,
                $target = config.$day.eq(index);
            
            if($target.length > 0) {
                $target.html('<option>�� ����</option>');
                for(var d=1; d <= maxDay; d++) {
                    $target.append('<option value="'+ d +'">'+ d + '��</option>');
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
        * @method enabled Ư���ϸ� enabled�� ���Ѿ� �� �� �ش� �޼��� ����
        * @param {String} sValue enable ��ų ���ڿ� ( ":"�� �������� �迭 ����)
        * @public       
        * @example 
        * commonJs.dateSelect.enabled('1:3:5:7')    // 1,3,5,7�� ������ �������� disabled
        */
        enabled : function(target, sValue) {
            var config = formEvent.date.config,
                getValue = sValue.toString().split(':');



            if(getValue.length > 0) {           
                var $target = target,
                    getId = $target.siblings('a').attr('href');
                
                // select option �� disabled
                $target.find('option').prop('disabled', true);
                
                // layerPopup ��ư disabled
                $(getId).find('.selectList > li > a').addClass('disabled');
                
                // ���ڷ� ���� sValue üũ�Ͽ� �ش��ϴ� ���� enabled
                for(var i=0, len=getValue.length; i< len; i++){
                    var valueIdx = getValue[i];
                    $target.find('option').eq(valueIdx).prop('disabled', false);
                    $(getId).find('.selectList > li').eq(valueIdx-1).children().removeClass('disabled');    // �޷� ���� �˾����� ���� �ɼ��� ���⶧���� index-1
                }
                
            }
        }
    };
    
    /*
    * 2016.10.25
    * ���հ˻� �߰�
    * ��Ÿ��, ������ �˻� �߰�
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
            
            // 2016.10.25 �˻� �� �߰�
            if(config.searchInput.length > 0) {
                formEvent.searchBox.totalSearchEvents();
            }
            
            // 2016.11.10 ��Ÿ��, ������ �˻� �̺�Ʈ �߰� 
            if(config.srchLayer.length > 0) {
                formEvent.searchBox.srchLayerEvents();
            }
        },
        
        /**
        * ���հ˻� �̺�Ʈ
        */
        totalSearchEvents : function() {
            var searchBox = formEvent.searchBox,
                config = formEvent.searchBox.config;
            
            config.searchInput.find(config.list).hide();
            
            // �ʱ� ������ ���Խ� ���հ˻��� input value �� ������ x��ư hide
            if(config.searchInput.find('input[type="search"]').val() === '') {
                config.searchInput.find(config.deleteBtn).hide();
            }
                    
            // ���հ˻� input focus �̺�Ʈ
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
            
            // �˻��� �Է½� delete ��ư show / hide
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
            
            // ����Ʈ ��ġ�� ��Ŀ�� �ƿ�
            // �������� ��� Ű�е�� ���� ��ũ���� ���Ƶ� ������ ���� ����ŭ ��ũ���� ��
            $(document).off('touchstart.searchBoxList');
            $(document).on('touchstart.searchBoxList', '.kwdList', function() {
                config.searchInput.find('input').blur();

            });
            
            // ����Ʈ Ŭ���� �˻� input �� Ŭ���� �ؽ�Ʈ�� ����
            config.searchInput.find(config.list).off('click.searchBox');
            config.searchInput.find(config.list).on('click.searchBox', 'a', function(e) {
                e.preventDefault();
                
                var getText = $(this).text();
                
                config.searchInput.find('input').val(getText);
                config.searchInput.find('input').focus();
            });
            
            
            // ���� �˻� �Է� �� ����
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
            
            // ���� �˻� �Է�â �ݱ�
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
        * ��Ÿ��, ������ �̺�Ʈ
        */
        srchLayerEvents : function() {
            var searchBox = formEvent.searchBox,
                config = formEvent.searchBox.config;
        
            // ��Ÿ�� �˻�
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
                    
            // 2016.11.10 ��Ÿ��, ���� �˻� �߰�
            config.srchLayer.off('focus.searchBoxFocus');
            config.srchLayer.on('focus.searchBoxFocus', 'input[type="text"]', function() {
                if($(this).val().length === 0) {
                    config.srchLayer.find(config.deleteBtn).hide();
                } else {
                    config.srchLayer.find(config.deleteBtn).show();
                }
            });     
            
            // �˻��� �Է½� delete ��ư show / hide
            config.srchLayer.find('> input').off('input.searchBoxInput');
            config.srchLayer.find('> input').on('input.searchBoxInput', function() {
                var $val = $(this).val();
                
                if($val !== '') {
                    config.srchLayer.find(config.deleteBtn).show();
                } else {
                    config.srchLayer.find(config.deleteBtn).hide();
                }
            }); 
            
            // �˻� input �ʱ�ȭ
            config.srchLayer.find(config.deleteBtn).off('click.searchBoxDelete')
            config.srchLayer.find(config.deleteBtn).on('click.searchBoxDelete', function(e) {
                e.preventDefault();
                config.srchLayer.find('input[type="text"]').val('');
                config.srchLayer.find(config.deleteBtn).hide();
                config.srchLayer.find('input[type="text"]').focus();
                
            });
        },
        
        /**
        * Ư�� ��⿡�� fixed�� ������Ʈ�� Ű�е尡 �ö�� �� ui ������ ���� �߻�
        * �˻��� input focus�� ȭ�� ������� �̵� �� position: 'relative'�� Ű�е� �ö�� �� ������ ���� ���� focus out�� ���� ��ġ�� �̵�
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
                    marginTop : '-1px',         // margin-top�� -1�� �ִ� ������ fixed ������Ʈ�� relative�� ��� �����Ǹ鼭 topHead�� border�� �������� 1px�� �и�
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
                // kwdDim�� �˻�â �±� ���ο� ���� ��� #Wrap �ٷ� ������ �̵�
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
        * Ư�� ��⿡�� fixed�� ������Ʈ�� Ű�е尡 �ö�� �� ui ������ ���� �߻�
        * �˻��� input focus�� ȭ�� ������� �̵� �� position: 'relative'�� Ű�е� �ö�� �� ������ ���� ���� focus out�� ���� ��ġ�� �̵�
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
    * Tabs (������ show / hide) class=".tabJs"
    * ��ư href, ������ id ��Ī�Ͽ� show/hide
    * ��ü show �߰� #tabAll
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
                    // getHref = index === -1 ? $li.eq(0).addClass('on').find('a').attr('href') : $target.find('a').attr('href'),       // on�� ������ �ִ� li�� ���� ��� ù��° li Ȱ��ȭ
                    // 2016.11.11 tabJs�� class="on"�� ���� ��� ������ ���� x
                    getHref = $target.find('a').attr('href'),
                    $tabCont = $(this).closest(config.tabList).siblings(config.content);
                
                // 2017.01.02 ���ټ� �߰�
                $target.find('> a').attr('title', '���õ�');
                
                if(getHref === '#tabAll') {
                    $tabCont.show();
                } else {
                    $tabCont.hide();
                    $(getHref).show();
                }

                //��Ÿ�� ���̾ƿ� ����
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

                // form Tabs�� �ƴ� �� ����
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

                // 2016.11.11 ���ټ� Ÿ��Ʋ �߰�
                $(this).attr('title', '���õ�');
                $tabLi.find('> a').removeAttr('title');
                
                /*
                * 2016.10.25 
                * swipeTabCont�� ���� ���� ���� �� tabJs ��� ����
                * 
                */
                if(!$swipeTabCont.length > 0) {
                    // 2016.10.25 ���հ˻� (CM_7P.1T.html) - 
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
                            
                            // �� Ŭ���� �� ���̷� �̵�
                            // util.contentsTop($(this).closest('.tabBox'));
                            
                            // 2017.01.05
                            waiAccessibility.goFocus($thisCont);
                        }
                    }
                
                    // ��� �� �ȿ� tabJs �ִ� ��� scrollTop ��� x
                    if($(this).closest('.tabList').css('position') === 'fixed'){
                        util.scrollTop();
                    }
                    
                    /*
                    * 2016.10.19
                    * tabCont�ȿ� swiper�� ���� ��� �ش� �� ���� �� swiper.refresh
                    */
                    if($thisCont.find('.tabDep1').length > 0) {
                        swipers.tab.tabSetup($thisCont.find('.tabDep1'));
                        swipers.refresh($thisCont.find('.tabDep1'));
                    }
                    
                    /*
                    * 2016.11.08
                    * tabCont�ȿ� bannerBox�� ���� ��� �ش� �� ���� �� swiper.refresh
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
                    * ī�� ��(�÷�Ƽ��) �ֿ� ����
                    * tabJs ���ο� toggleList�� ���� �� accordion bind check
                    */
                    if($thisCont.find('.toggleList').length > 0) {
                        arcodians.defaultToggle.init();
                    }
                    
                    /*
                    * tabJs�� swipe ����� ��� ���� ���
                    * swipe�޴� ����Ʈ
                    */
                    if($thisTab.data('swiper')) {
                        swipers.slideTo($thisTab, $thisLi.index());
                    }
                    
                    // �� �α��������� �̺�Ʈ ��ü���� (�α��� ������ ���� �� ���� ��ȭ������ �� Ŭ���ø��� ������ ������)
                    if($('.eventArea').length > 0) {
                        setTimeout(function() {
                            arcodians.eventAll.setup();
                        }, 50);
                    }

                    //���ο� �� Ÿ��
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
                    * fixedBArea ��ư ��ġ ������ (�ż�ī�� �߱���ȸ)
                    */
                    // common.centerAlign();
                    common.fixedBtnScroll();
                }
                
                // ���� ���� �̺�Ʈ
                $thisTab.trigger("change", [$thisLi, $thisLi.index()]);

            });
        
        }
    };
    
    /**************************************
    * �������� ���� ��ü
    * - �������� �ִϸ��̼� ����Ǵ� �κ� �������� �������� �Ϸ� �� Ÿ������ trigger �̺�Ʈ ����
    * - change �̺�Ʈ Ÿ���� ���� �ش� ��ü ���� config.target
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
        * target�� ����� data�� �����ɴϴ�.
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
        * target�� swiper�� refresh �մϴ�.
        * @param {jQuery | HTMLElement} target swiper selector
        */
        refresh : function(target) {
            var getSwiper = swipers.getSwiper(target);
            
            if(getSwiper) {
                getSwiper.refresh();
            }
        },
        
        /**
        * target�� swiper�� ��ġ ���� �����մϴ�.(�ִϸ��̼� x)
        * @param {jQuery | HTMLElement} target swiper selector
        * @param {Number} index ������ index ��
        */
        currentTo : function(target, index) {
            var getSwiper = swipers.getSwiper(target);
            
            if(getSwiper) {
                getSwiper.currentTo(index);
            }
        },
        
        /**
        * target�� swiper�� ��ġ ���� �����մϴ�.(�ִϸ��̼� o)
        * @param {jQuery | HTMLElement} target swiper selector
        * @param {Number} index ������ index ��
        */
        slideTo : function(target, index) {
            var getSwiper = swipers.getSwiper(target);
            
            if(getSwiper) {
                getSwiper.slideTo(index);
            }
        },
        /**
        * target�� swiper�� ��ġ ���� �����մϴ�.(��ġ���� ����)
        * @param {jQuery | HTMLElement} target swiper selector
        * @param {Number} index ������ index ��     
        */
        moveTo : function(target, index) {
            var getSwiper = swipers.getSwiper(target);
            
            if(getSwiper) {
                getSwiper.moveTo(index);
            }
        },
        
        /**
        * target�� ���� index���� �����ɴϴ�.
        * @param {jQuery | HTMLElement} target �������� ������
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
    * �⺻ �������� ��
    * free mode�� ����
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
                    
                    // 2017.01.14 ���ټ� �߰� ( ���̴� ������ ��Ŀ�� )
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
    * �̺�Ʈ today list (BN_3.2T.1.html)
    * �������� ó��, ���κп��� �ٽ� ���������� ��¥ list�� �߰�
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
                * todayBox swipeTab option ������
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
                            
                // 2017.01.14 ���ټ� �߰� ( ���̴� ������ ��Ŀ�� )
                config.daySwiper.settings.onRefresh = function(swiper) {                                                                    
                    waiAccessibility.setFreeModeSwipeAriaHidden(swiper);
                };
                
                // End swipers.defaults options
                swipers.defaults.todayBox.boxSetup();

                // ���⿡ date list �Ѹ���
                swipers.defaults.todayBox.createList({
                    year : parseInt(getEventDate[0], 10),
                    month : parseInt(getEventDate[1], 10)
                });

                // ����Ʈ�� date �� set
                swipers.defaults.todayBox.setEventDate();
                
                // 2017.01.04 ���ټ� �߰� (���� ���õ� ��¥ �������δ� ��Ŀ�� �̵� ����)
                setTimeout(function() {

                    swipers.refresh($todayTarget);
                }, 0);
            }
        },
        
        /**
        * todayBox�� ���� ���� ������
        */
        refresh : function() {
            var todayBox = swipers.defaults.todayBox,
                config = swipers.defaults.todayBox.config;
                        
            if(config.target.length > 0) {
                todayBox.boxSetup();
            }
        },
        
        /**
        * todayBox width �� ����
        */
        boxSetup : function() {

            var todayBox = swipers.defaults.todayBox,
                config = todayBox.config,
                wrapWidth = config.target.innerWidth(),
                btnWidth = 0,
                resultWidth = 0;
            
            config.btn = config.target.find('a.today');
            config.list = config.target.find(' > .inner').length > 0 ? config.target.find(' > .inner') : config.target.find(' > form > .inner'); // form�� ���߿�
            
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
        * today List ����
        * @param {Object} obts swipers.defaults.todayBox.getToDay�� Today���� �޾ƿ��� �ɼ�
        * @param {Number} opts.year ������ų ����Ʈ�� �⵵ �� ����
        * @param {Number} opts.month ������ų ����Ʈ�� �� �� ����
        * @example
        * // 2015�� 10�� 1�� ~ ������ �ϱ��� ����Ͽ� ����Ʈ ����
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
                year = getToday[0],                                         // ��
                month = getToday[1],                                            // ��                                        // ��
                weekNames = ['SUN','MON','TUE','WED','THU','FRI','SAT'],
                last = [31,28,31,30,31,30,31,31,30,31,30,31],
                lastDay,                                                    // �� ������ �� ����
                convertDate,                                                // �޾ƿ� ��¥ Date ��ȯ �� ����
                getDayName,                                                 // ���� ����
                $ul = $('<ul />'),
                $li, $a, $month, $day,
                i, forDay,
                minDate,
                maxDate,
                dayCheck,
                checkDate;
            
            // ���� ���
            if((year%4 === 0 && year%100!=0) || year%400 === 0) {
                last[1] = 29;
            }
             
            // �������� ���ϱ�
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
                // 2016.10.20 �� ���� üũ�Ͽ� disabled �ֱ�
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
        * swipeTab�� left ���� üũ�Ͽ� �ش��ϴ� ��/���� .eventDay �ؽ�Ʈ�� �ѷ���
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
        * today ���� �޾ƿ�
        * @param {Object} opt date �ɼ� ��
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
        * eventDay �ؽ�Ʈ ����
        * @param {Number} day ������ ��¥. ������ ���� �� �Է�
        */
        setEventDate : function(getData) {
            var todayBox = swipers.defaults.todayBox,
                config = todayBox.config,
                getDataYMD = getData || todayBox.getEventDay().join('.');
                
            $(config.eventDay).text(getDataYMD);
        },
        
        /**
        * today List�� day ����Ʈ �߰�
        * @param {String} handle prev�� ���� ���� day ����Ʈ �߰� next�� �� ������ day ����Ʈ �߰�
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
                
                // ���� 1���� �۾����� ��� 12�� �缳���� �⵵ -1
                if(month < 1) {
                    year = year - 1;
                    month = 12;
                }
            } else if( handle === 'next') {
                $target = $getList.eq($getList.length - 1);
                getDataYMD = $target.attr('data-ymd').split('.');
                year = parseInt(getDataYMD[0], 10);
                month = parseInt(getDataYMD[1], 10) + 1;
                
                // ���� 12���� Ŭ��� 1�� �缳���� �⵵ + 1
                if (month > 12) {
                    year = year + 1;
                    month = 1;
                }                           
            }

            // ���⿡ ���� ����Ʈ ����
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
        * ��¦���� date swipeTab �̵�
        * @param {Number} index ������ index��
        */
        slideTo : function(index) {
            var todayBox = swipers.defaults.todayBox,
                config = todayBox.config,
                swipeTab = config.daySwiper.target;

            swipers.defaults.$target[swipeTab.index(config.swipeClass)].slideTo(index);
        }
        
    }
    
        
    /*
    * ��� ��������
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
                        
                        // 2017.01.09 ���ټ� �߰�
                        waiAccessibility.setSwipeNavigationButton({
                            target : swiper.wrap,
                            
                            prevButton : {
                                text : '����',
                                class : 'btnPrev'
                            },
                            
                            nextButton : {
                                text : '����',
                                class : 'btnNext'
                            }
                        });                 
                    }
                });
            }
        }
    };
    
    /*
    * ī�� ����Ʈ
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
                        // 2017.01.09 ���ټ� �߰�
                        waiAccessibility.setSwipeNavigationButton({
                            target : swiper.wrap,
                            prevButton : {
                                class : 'btnPrev',                              
                                text : '����'
                            },
                            nextButton : {
                                class : 'btnNext',
                                text : '����'
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
    * ī�� �� ����Ʈ (��ư & ������ �ؽ�Ʈ)
    * ī��ȳ�/��û
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
                        
                        // 2017.01.09 ���ټ� �߰�
                        waiAccessibility.setSwipeNavigationButton({
                            target : swiper.wrap,
                            prevButton : {
                                class : 'btnPrev',                              
                                text : '����'
                            },
                            nextButton : {
                                class : 'btnNext',
                                text : '����'
                            }
                        });
                    }
                });
            }
        }       

    }
    
    /*
    * TabDep1 �������� ( ���̵��� ����Ʈ ���� ���� )
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
                        
                        // 2016.11.11 ���ټ� Ÿ��Ʋ �߰�
                        $(e.target).attr('title', '���õ�');
                        $(e.target).parent().siblings().find('> a').removeAttr('title');
                    },
                    
                    onResize : function(swipe) {
                        swipers.tab.tabSetup(swipe.target);
                    }
                });
                        
            }
        },
        
        /*
        * �� ����Ʈ ���̰� �θ� ���̺��� ���� ��� % ���缭 ����
        * TODO �� ������ ���� ���� ���� �ʿ�.
        * newType�� ��� �� ����Ʈ ���̿� ���� �״�� ����
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

                // �ʱ� ������ ���� ���� ����
                tabLi.attr('style', 'width: ' + (Math.floor(equalWidth*100)/100) + '% !important');

                // ���� ���� �� ���� �� ����
                tabHeight = parseInt(tab.height(), 10);

                /*
                * tab�� ���̰� 55(���� �������̰�)���� Ŭ ��� �� ����Ʈ�� ���� �� �缳��
                * tabDep1 ���̰� ������ "tabDep1 ����" �˻��ؼ� ���� ����
                * ��Ʈ ������ ����� �ش� �� ���� �缳�� �ʿ�?
                */
                if(tabHeight > 55) {
                    tabLi.attr('style', 'width: auto !important');
                    
                    tabLi.each(function() {
                        var itemWidth = $(this).width()+14;
                        $(this).attr('style', 'width: ' + itemWidth + 'px !important');
                        sum += itemWidth;

                    });
                    
                    // ���� ���� ���̺��� ����Ʈ�� �� ���ΰ��� ���� ��� %�� ����
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
    * Content �������� (����¡ ����)
    */
    swipers.cont = {
        init : function() {
            var config = null;
            
            swipers.cont.config = {
                target : $('.swiperCon > ul')
            };
            
            config = swipers.cont.config;
            
            if(config.target.length > 0) {
                // 2016.12.17 �ȵ���̵� �ۿ��� �ø�ŷ ��ħ���� ���� �÷���O2O ���� ������ư �߰�
                var $plusSwiper = config.target,
                    $plusWrap = $plusSwiper.parent();
                    
                if($plusSwiper.hasClass('plusBanner')) {
                    $plusWrap.addClass('plusBinner');
                    if(!$plusWrap.find('.btnNrev').length) {
                        $plusSwiper.after('<a href="#" class="btnNext"><span class="hidden">����</span></a>');
                    }                   
                    if(!$plusWrap.find('.btnPrev').length) {
                        $plusSwiper.after('<a href="#" class="btnPrev"><span class="hidden">����</span></a>');
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
                        
                        // type2 Ŭ������ ���� ���� Ŭ�� ��� false
                        if(swiper.wrap.hasClass('type2') || swiper.wrap.closest('.etcService').length > 0) {
                            swiper.settings.infinite = false;
                        }
                        
                        /*
                        * 2016.11.17
                        * vip ���� (BN_8.4.html) �߰�
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
                        * ���� > �����Ӽ��� ���̾��˾�(BN_8.1.2T.2T.html)
                        * ���̾� �˾� ���� �������� �ɼ� ����
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
                            * 2017.01.07 ���ټ� �߰� (����, ī��� ���̾��˾� �����̵� �۵��� navTit�� ��Ŀ�� �̵�)
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
                        
                        // 2016.11.02 ���μ��� numberPaging
                        if(swiper.wrap.closest('.swipeInner').length > 0) {
                            swiper.customWrap = swiper.target.closest('.swipeInner');
                            swiper.settings.numberText = true;
                            swiper.settings.arrows = true;              // boolean  
                        }
                        
                        // ��� ������ �������� ���� �� ����
                        if(swiper.wrap.hasClass('donation')) {
                            swiper.wrap.css('height', (util.getContentHeight())+'px');
                        }
                        
                        // ī����� / my card �ε������Ͱ� ������� �߸��Ƿ� ���� �ؽ�Ʈ�� ��ü
                        if(swiper.wrap.closest('.grayBox').length > 0 && swiper.wrap.closest('.myCard').length > 0 && swiper.listLen > 20) {
                            swiper.settings.numberText = true;
                            swiper.wrap.find('.paging').removeClass('paging').addClass('numPaging');
                        }
                        
                        // 2016.12.17 �÷���O2O ���� ������ư �߰�
                        if(swiper.wrap.hasClass('plusBinner')) {
                            swiper.settings.arrows = true;
                        }
                        
                                                    
                        // 2017.01.09 ���ټ� �߰�
                        if(swiper.wrap.closest('.cardRecommend').length > 0 || swiper.wrap.closest('.myCard').length > 0 || swiper.wrap.closest('.appService').length > 0) {
                            swiper.settings.nextArrow = '.btnNext2',                // String
                            swiper.settings.prevArrow = '.btnPrev2',                // String
                            waiAccessibility.setSwipeNavigationButton({
                                target : swiper.wrap,
                                
                                prevButton : {
                                    text : '����',
                                    class : 'btnPrev2'
                                },
                                
                                nextButton : {
                                    text : '����',
                                    class : 'btnNext2'
                                }
                            });
                        }
                    },
                    
                    onBeforeChange : function(swiper, oldIndex, newIndex) {
                        /*
                        * 2016.11.17
                        * ���������, VIP����(BN_8.4)
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
                        
                        // vip ���� swiper chain animate üũ��
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
    * ���ڵ��
    * 1. Ÿ��Ʋ Ŭ�� - > on Ŭ���� �߰� - > ������ ����
    * 2. Ŭ�� �� ���� ������Ʈ on Ŭ���� ���� �� ������ ����
    ***************************************************************/
    arcodians = {
        init : function() {
            arcodians.defaultToggle.init();
            arcodians.cardToggle.init();
            arcodians.stateToggle.init();
            arcodians.fixedToggle.init();
            
            // �ۿ����� ���. 
            arcodians.eventAll.init();
        },
        
        /**
        * ���ڵ�� �÷����� data �� ����
        * @param target ���ڵ�� ������
        */
        getAccordion : function(target) {
            var $target = $(target);
            return $target.data('accordion');
        },
        
        /**
        * ���ڵ�� �������� ( ���� �ε��� ���� )
        * @param target ���ڵ�� ������
        */
        refresh : function(target) {
            arcodians.getAccordion(target).refresh();           
        }
    };
    
    // �⺻ ���
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
                            
                        // ���� ��Ʈ�� ������ �� �ִϸ��̼� ����
                        if($pieChart.length > 0 && !$pieChart.hasClass('onDraw')) {
                            for(var i = 0, len = $pieChart.length; i < len; i++) {      
                                $pieChart.eq(i).addClass('onDraw');
                                chart.pie.$target[i].pieChartStart();
                            }
                        }
                        
                        // ���� ��Ʈ�� ������ �� �ִϸ��̼� ����
                        if($barChart.length > 0 && !$barChart.hasClass('onDraw')) {
                            for(var i = 0, len = $barChart.length; i < len; i++) {
                                $barChart.eq(i).addClass('onDraw');
                                chart.bar.$target[i].barChartStart();
                            }
                        }
                        // 2016.11.14 ������ ��ۺ� ���� refresh ���� -> �������� ���� �۾� �ʿ�
                        if($googleMap.length > 0) {
                            var getPos = {
                                lat : $googleMap.data('lat'),
                                lng : $googleMap.data('lng')
                            };
                            google.maps.event.trigger($googleMap.data('map'), 'resize');
                            $googleMap.data('map').setCenter(getPos);                           
                        }
                        
                        
                        // 2017.01.11 ������ ��ۺ� ���� ����
                        // 2017.13.28 ������ �������� ������ ����
                        try{
                            if($daumMap.length > 0) {
                                var getPos = new daum.maps.LatLng($daumMap.data('lat'),$daumMap.data('lng'));
                                $daumMap.data('map').relayout();
                                $daumMap.data('map').setCenter(getPos);     
                            }
                        }catch(e){
                            console.log(e);
                        }
                        // 2016.11.29 ���ټ� �߰�
                        $toggleTarget.find('> a').attr('title','������');
                    },
                    
                    // 2016.11.29 ���ټ� �߰�
                    onAfterClose : function(opts, idx) {
                        var $toggleTarget = $(opts.list[idx]);                      
                        $toggleTarget.find('> a').attr('title','����');
                    }
                });

            }
        }
    };
    
    // ī�� ���
    arcodians.cardToggle = {
        init : function() {
            var config = null;
            
            arcodians.cardToggle.config = {
                target : $('.cardBox'),
                toggleItem : $('.cardToggle')
            };
            
            config = arcodians.cardToggle.config;
            
            // ī�� ���ڵ��
            
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
            
            // ī�� ���� �̺�Ʈ
            if(config.target.length >0) {
                arcodians.cardToggle.setup();
                arcodians.cardToggle.bindEvents();          
            }           

        },
        
        // 2017.01.13 ���ټ� �߰� (ī�� üũ Ÿ�� ���ټ� �Ӽ� �ʱ�ȭ)
        setup : function() {
            var config = arcodians.cardToggle.config;
            
            config.target.find('.cardCheck').each(function() {
                var $cardTxt = $(this).find('.cardTxt');
                
                if($(this).hasClass('on')) {
                    //2017.01.02 ���ټ� �߰�
                    waiAccessibility.setAriaLabel({
                        target : $cardTxt,
                        type : 'button',
                        text : $cardTxt.text(),
                        activeText : '���õ�'
                    }); 
                } else {
                    //2017.01.02 ���ټ� �߰�
                    waiAccessibility.setAriaLabel({
                        target : $cardTxt,
                        type : 'button',
                        text : $cardTxt.text(),
                        activeText : '���� �ȵ�'
                    }); 
                }
            });
        },
        
        /*
        * üũ, ���� ��� �߰�
        */
        bindEvents : function() {
            var config = arcodians.cardToggle.config;
                
            config.target.off('click.cardToggle');
            config.target.on('click.cardToggle', '.cardTxt', function(e) {
                e.preventDefault();
                var $thisWrap = $(this).parent();

                // �⺻ ��� �� ����+���
                if($thisWrap.hasClass('cardToggle')) {      
                    $thisWrap.siblings().removeClass('on');
                    $thisWrap.siblings().find('> .toggleView').stop(true,false).slideUp();
                }
                
                /*
                * ������ư ���
                * 2016.10.10 ���� ��� .cardBox > .cardTxt 
                */
                if($thisWrap.hasClass('type4') && !$(this).hasClass('disabled')) {
                    $(this).siblings().removeClass('on');                   
//                  $(this).toggleClass('on');
                    $(this).addClass('on');
                    
                    // ��ȭ������� ������ fixedBArea ��ư ��Ÿ�� ����
                    commonJs.changeSection();
                }

                // üũ�ڽ� ���
                if($thisWrap.hasClass('cardCheck')) {

                    $thisWrap.toggleClass('on');
                    
                    //2017.01.02 ���ټ� �߰� role="text" aria-label ����
                    if($thisWrap.hasClass('on')) {                          
                        //2017.01.02 ���ټ� �߰�
                        waiAccessibility.setAriaLabel({
                            target : $(this),
                            type : 'button',
                            text : $(this).text(),
                            activeText : '���õ�'
                        }); 
                    } else {
                        //2017.01.02 ���ټ� �߰�
                        waiAccessibility.setAriaLabel({
                            target : $(this),
                            type : 'button',
                            text : $(this).text(),
                            activeText : '���� �ȵ�'
                        }); 
                    }
                }
                
                // 2016.12.17 container Ŭ������ fixedBCheck�� ���� ��� cardTxt Ŭ���� fixedBArea ��ư ����
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
    
    // ���� ���(MK)
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
                    openText : '�ݱ�',
                    closeText : '���ĺ���',
                    onInit : function(accordion) {
                        var $toggle = accordion.viewElem.parent(),
                            $titBox = $toggle.siblings('.titBox').length > 0 ? $toggle.siblings('.titBox').find(' > .tit') : $toggle.siblings('.tit'),
                            getTit = $titBox.text(),
                            openTxt = getTit + ' �ݱ�',
                            closeTxt = getTit + ' ���ĺ���';
                        
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
    * ��� ���½� ������ ���̰� ���� �� position : fixed
    * ī��ȳ�/��û CR_1.1.html
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
                    // ���� ���� �޼��� ���
                    $.cxhia.alert({
                        title: "Alert",
                        message: "ī�������� �������ּ���."
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
            
            // ���� Ŭ�� �� formWrap�� ��ȭ�� ���� ��� customCard�� ���� ����
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
        * ��ۺ��� ������ ���̸� ���Ѵ� ( ��ü ���̿��� ������ҵ��� ���̸� �� ������ )
        */
        getContentsHeight : function(target) {
            var targetHeight = $(target).innerHeight(),
                fixHeight = util.getFixItemTop(),
                winHeight = ns.global.bh,
                result =  winHeight - (targetHeight + fixHeight);

                        
            // ����� �� Ǫ�� ���� ��
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
    * �̺�Ʈ ��ü���� ���ڵ��(�ۿ� �α���������)
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
                * 2016.10.24 �α��� �̺�Ʈ ��ü���� �ʱ� css ����(���� �ӵ� �ڷ� ����)
                */
                setTimeout(function() {
                    arcodians.eventAll.setup();
                }, 0);
                //arcodians.eventAll.bindEvents();
            }
            
        },
        
        /**
        * 2016.10.24
        * �ʱ�ȭ��, ��������� �ش� setup �����Ͽ� üũ
        * �α��� �������� �̺�Ʈ ��ü���� ��ư�� ������ ��� ��ü���� ��ư fixed ����
        */
        setup : function() {
            var config = arcodians.eventAll.config,
                $eventArea = $(config.target).filter(':visible'),
                $content = $('#content'),
                totalHeight = parseInt($content.innerHeight(), 10),
                result;
            
            if(!$eventArea.length) { return false; }
            
            // �������� ���̰����� ���� ���̰��� ����� ������ �ʴ� ���� ����
            swipers.reInit($eventArea.find('.swiper'));
            
            // �α��� ����� ���� �ٲ�� ���� �����ϱ����� eventDetail�� ��Ÿ���� ����
            // $('.eventDetail').removeAttr('style');
            
            $content.css({position: 'relative', minHeight: $(window).outerHeight()}).find('.container').css({paddingBottom: $('.eventDetail').outerHeight()});
        }
    };

    
    /********************************************************
    * ���� ��Ʈ & ���� �׷���
    *********************************************************/
    chart = {
        init : function() {
            chart.pie.init();
            chart.bar.init();
        }
    };
    
    /**
    * ���� ��Ʈ
    * @method chart.pie.$target[0].pieChartSetup(Array)
    */
    chart.pie = {
        init : function() {
            chart.pie.$target = util.eachFunc($('.circleGraph'), $.fn.pieChart);
        }
    };
    
    /*
    * ���� ��Ʈ
    */
    chart.bar = {
        init : function() {
            chart.bar.$target = util.eachFunc($('.barGraph'), $.fn.barChart);
        }
    };
    
    /********************************************************
    * �޷� ��ũ��Ʈ
    * // Ư�� ��¥ ���� ���� �Ұ��� (data-min �Ӽ� ����)
    * <input data-min="yy.mm.dd">
    *
    * // Ư�� ��¥ ���� ���� �Ұ��� (data-max �Ӽ� ����)
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
        * jquery ui calendar�� ���δ� layerPopup �� ����
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
                
                $strong.text('��¥ ����');
                $popTop.append($strong);
                $popCont.append($inner);
                $closeBtn.text('�ݱ�');
                $lyrFixBtnArea.append($closeBtn);
                
                $layerDatePicker.append($popTop);
                $layerDatePicker.append($popCont);
                $layerDatePicker.append($lyrFixBtnArea);
                
                $('body').append($layerDatePicker);
            }
        },
        
        /**
        * jQuery ui calendar �ɼ� ����
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
                    * dateFormat : 'y.mm.dd'�� ������ ��� �����ںе鿡�� �߰� ��û �ʿ���
                    * ������ �� data-min, data-max ���� 16.mm.dd������ ���� ��û �ʿ���
                    */
                    dateFormat : 'yy.mm.dd', // 
                    showMonthAfterYear : true,
                    changeYear : true,
                    changeMonth : true,
                    showOtherMonths : true,
                    monthNamesShort : ['1','2','3','4','5','6','7','8','9','10','11','12'],
                    dayNamesMin : ['��','��','ȭ','��','��','��','��'],
                    minDate : getDataMin,
                    maxDate : getDataMax,
                    beforeShow: function(input) {
                        
                        // 2016.10.31 ���ټ� �߰� ( popup saveBtn ���� )
                        layerPopup.config.saveBtn = $(input).parent().next('.calBtn');                                                          
                                                
                        // ui calendar ������ �˾� ���η� �̵�
                        $('.layerDatePicker .popCont .inner').append($('#ui-datepicker-div'));
                        
                        // beforeShow�̱⶧���� ���� �ʰ� ����
                        setTimeout(function() {
                            $('#ui-datepicker-div').css({
                                position: 'relative',
                                top: 0,
                                left: 0
                            });
                            
                            layerPopup.openPopup('.layerDatePicker');               
                            
                            // 2017.01.07 ���ټ� �߰� (Ķ���� ���ó�¥ �ؽ�Ʈ �߰�)
                            $('#ui-datepicker-div').find('.ui-state-highlight').attr('title', '���� ��¥');
                            $('#ui-datepicker-div').find('.ui-state-active').attr('title', '���õ�');
                            
                            // 2017.01.07 ���ټ� �߰� (���� ��ư aria-label ����)
                            waiAccessibility.setAriaLabel({
                                target : $('#ui-datepicker-div').find('.ui-datepicker-prev'),
                                type : 'button',
                                text : '���� �޷� ����'
                            });
                            
                            // 2017.01.07 ���ټ� �߰� (���� ��ư aria-label ����)
                            waiAccessibility.setAriaLabel({
                                target : $('#ui-datepicker-div').find('.ui-datepicker-next'),
                                type : 'button',
                                text : '���� �޷� ����'
                            });
                            
                            // 2017.01.07 ���ټ� �߰� (����Ʈ title �߰�)
                            $('.ui-datepicker-year').attr('title', '�� ����');
                            $('.ui-datepicker-month').attr('title', '�� ����');
                            
                        }, 0);
                        
                        // layerPopup.centerAlign($('.layerDatePicker'));
                        $('.layerDatePicker').one('click', '.close', function(e) {
                            e.preventDefault();
                        });
                        
                        // input�� data-min�� ���� ��� data-min�� ���� ��¥ üũ �Ұ���
                        if($(input).attr('data-min')){
                            $(input).datepicker('option', 'minDate', $(input).attr('data-min'));
                        }
                        
                        // input�� data-min�� ���� ��� data-max�� ���� ��¥ üũ �Ұ���
                        if($(input).attr('data-max')) {
                            $(input).datepicker('option', 'maxDate', $(input).attr('data-max'));
                        }
                        
                        
                    },
                    
                    onChangeMonthYear : function() {
                        setTimeout(function() {
                            // 2017.01.07 ���ټ� �߰� (Ķ���� ���ó�¥ �ؽ�Ʈ �߰�)
                            $('#ui-datepicker-div').find('.ui-state-highlight').attr('title', '���� ��¥');
                            $('#ui-datepicker-div').find('.ui-state-active').attr('title', '���õ�');
                            
                            // 2017.01.07 ���ټ� �߰� (���� ��ư aria-label ����)
                            waiAccessibility.setAriaLabel({
                                target : $('#ui-datepicker-div').find('.ui-datepicker-prev'),
                                type : 'button',
                                text : '���� �޷� ����'
                            });
                            
                            // 2017.01.07 ���ټ� �߰� (���� ��ư aria-label ����)
                            waiAccessibility.setAriaLabel({
                                target : $('#ui-datepicker-div').find('.ui-datepicker-next'),
                                type : 'button',
                                text : '���� �޷� ����'
                            });
                            
                            // 2017.01.07 ���ټ� �߰� (����Ʈ title �߰�)
                            $('.ui-datepicker-year').attr('title', '�� ����');
                            $('.ui-datepicker-month').attr('title', '�� ����');        
                            
                            $('.ui-datepicker-year').focus();                   
                        }, 1000);
                    },
                    
                    onSelect: function(date) {
                        waiAccessibility.setAriaLabel({
                            target : layerPopup.config.saveBtn,
                            type : 'button',
                            text : calendar.convertToText(date) + ' ���õ� ',
                            title : $imgBtn.text() + ' ��ư'
                        });
                    },
                    
                    // ui datepicker ���� �� callback
                    onClose : function(selectedDate) {
    
                        var $dateWrap = $(this).closest('.calWrap'),
                            $dateWrapChildren = $dateWrap.children(),
                            $calendar = null,
                            $siblingsCalendar = null,
                            $siblingsInput = null,
                            title = '',
                            saveValue = null;
                        
                        // 2017.01.10 asis ���� �߰� (asis���� �ҷ����� �̺�Ʈ���� �޷� �˾�)
                        if(config.target.hasClass('jsDatePopup')) {
                            $dateWrapChildren = $('.jsDatePopup');
                        }
                            
                        // calWrap �ȿ� �޷��� 2�� ���� ��� (������, ��������)
                        if($dateWrapChildren.length > 1) {
                            $calendar = $(this).closest('.calendar').parent();
                            $siblingsCalendar = $calendar.siblings();

                            $siblingsInput = $siblingsCalendar.find('input');
                            
                            // 2017.01.10 asis ���� �߰� (asis���� �ҷ����� �̺�Ʈ���� �޷� �˾�)                          
                            if(config.target.hasClass('jsDatePopup')) {
                                $siblingsInput = $(this).siblings('.jsDatePopup');
                                
                                title = $(this).index('.jsDatePopup') === 0 ? '������' : '������';
                            
                            // ���� ���վ� ����, ���� �޷�
                            } else {
                                title = $(this).attr('title');
                            }
                            
                            // ������, �������� ��� �����ϰ� �����Ͽ� ���� �ش� �ּ�, �ִ� �� ������
                            if(selectedDate !== '') {
                                switch(title) {
                                    case '������' :
                                        $siblingsInput.datepicker('option', 'minDate', selectedDate);
                                        break;
                                    case '������' :
                                        $siblingsInput.datepicker('option', 'maxDate', selectedDate);
                                        break;
                                }
                                
                                // 2017.01.10 input�� value ���� yy.mm.dd ���·� ����
                                $siblingsInput.val(calendar.yyyyToYy($siblingsInput.val()));
                            }
                        }
                        
                        // 2017.01.10 input�� value ���� yy.mm.dd ���·� ����
                        $(this).val(calendar.yyyyToYy($(this).val()));
                        
                        layerPopup.closePopup('.layerDatePicker');
                        
                    }
                }).off('focus');
                
                // 2017.01.10 input�� value ���� yy.mm.dd ���·� ����
                $(this).val(calendar.yyyyToYy($(this).val()));
                
                // 2017.01.14 ���ټ� �߰� (���� ���õ� ��¥�� ���� ��� ��ư�� ���ټ� �ؽ�Ʈ ����)
                waiAccessibility.setAriaLabel({
                    target : $imgBtn,
                    type : 'button',
                    text : $(this).val() !== '' ? calendar.convertToText($(this).val()) + ' ���õ� ' : '',
                    title : $imgBtn.text() + ' ��ư'
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
        * input�� �� ��¥ format ����
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
        * �Ѱܹ��� date�� �� 2017.01.01�� 2017�� 01�� 01�Ϸ� ����
        */
        convertToText : function(date) {
            var getDateSplit = date.split('.'),
                dateText = ['�� ', '�� ', '�� '],
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
    * ���� ���̾� �˾�
    *
    * ���߰���
    * �˾� ���� �� �ش� ���̵� ���� ������ �ִ� ��ư�� �ε��� ���� �Ѱ���
    * layerPopup.config.wrap.on('change', function(e, selector, index) { ... });
    * 2016.10.17 Ǯ���� �˾� �߰�
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
            
            // 2017.01.02 ���ټ� �߰� (ī�弱�� ���̾� ��ư ���� ��� ���ټ� �ؽ�Ʈ �߰�)
            if($('.cardTxt.layerOpen').length > 0) {
                
                $('.cardTxt.layerOpen').each(function() {
                    var getId = $('.cardTxt.layerOpen').attr('href'),
                        $layerWrap = $(getId),
                        $layerPopTop = $layerWrap.find('.popTop');
                        
                    //2017.01.02 ���ټ� �߰�
                    waiAccessibility.setAriaLabel({
                        target : $(this),
                        type : 'button',
                        title : $layerPopTop.text() + ' ���̾��˾� ��ũ',
                        text : $(this).text()+' ���õ� '
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
                    // ���� Ŭ���� ��ư ����
                    layerPopup.config.saveBtn = $(this);

                    // href�� ����  �� id������ ��ü
                    if(!$(this).attr('href')) {
                        getHref = '#' + $(this).attr('data-id');
                    } else {
                        getHref = $(this).attr('href');             
                    }
                    
                    layerPopup.openPopup(getHref);

                    /*
                    * 2016.11.03
                    * ���ī�����(ī���)��û ������ �����Է� input value �ʱ�ȭ
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
                
                // �޷� �˾��� ���� closePopup �������� ����. �޷¿� ����.
                if(!$(this).closest('.layerWrap').hasClass('layerDatePicker')){
                    layerPopup.closePopup('#'+getId);
                }
            });
            
            /*
            * 2016.10.12 ī�� �̿볻�� ���� ī�庰 ���� �߰�
            * 2016.11.09 ī�庰 �� ī�� ��ũ�� �������� ���� ��ũ��Ʈ ����
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
                
                // ���¹�ȣ ����
                if($thisWrap.attr('id') === 'accountList') {
                    $('#accountNumber').data('selectIndex', $(this).index());
                    $('#accountNumber').val($clone.html());
                // ī�� ����
                } else {
                    // ī�� �˾� ��ư�� ������ ī���� index �� ����
                    $btn.data('selectIndex', $(this).index());          
                    $btn.html($clone.html());
                    
                    // 2016.12.08 ������ ��û trigger �̺�Ʈ (ī�带 Ŭ������ �� selectCard �̺�Ʈ ���� ����)
                    $btn.trigger('selectCard');
                    
                    //2017.01.02 ���ټ� �߰�
                    waiAccessibility.setAriaLabel({
                        target : $btn,
                        type : 'button',
                        title : $thisWrap.find('.popTop').text() + ' ���̾��˾� ��ũ',
                        text : $clone.text() + ' ���õ� '
                    });                 
                }
                
                // $thisWrap.find('.popClose').trigger('click');
                layerPopup.closePopup('#'+getId);
            });
            
            /*
            * 2016.11.18
            * �������㼱�� / ī���û(CR_4.1.3) �ѵ����� �̺�Ʈ
            */
            $(document).off('click.layerTbl');
            $(document).on('click.layerTbl', layerTbl, function(e) {
                var $layerWrap = $(this).closest('.layerWrap'),
                    $label = $(this).next('label'),
                    layerId = $layerWrap.attr('id'),
                    labelText = $label.text();
                    
                if($layerWrap.attr('id') === 'reqmaxLayer2') {
                    layerPopup.closePopup('#'+layerId);
                    
                    if(labelText !== '�����Է�') {
                        $('.reqmaxInput').val(labelText.split('����')[0]);
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
            * 2016.10.28 multiple select popup(��Ÿ��, �����˻�) Ŭ���̺�Ʈ
            * 2016.11.08 ���� Ŭ���� ������ depth �ؽ�Ʈ �߰�
            * 2016.11.10 ���� �� depth2�� �ش��ϴ� depth3 ����Ʈ show
            */
            $(document).off('click.layerMultipleSelect');
            $(document).on('click.layerMultipleSelect', multipleSelectorBtn, function(e) {
                var $layerWrap = $(this).closest('.layerWrap'),
                    getId = $layerWrap.attr('id');              

                // ���� ����, ī�װ� ����, ����ö �� ���� ���̾��϶�                       
                if(getId === 'subwayLayer' || getId === 'categoryLayer' || getId === 'areaLayer'){  
                    e.preventDefault();         
                    if($(this).hasClass('btnWhite')){
                        var $defaultSelect = $layerWrap.find('.defalutSelect > select'),
                            getDepth2 = $layerWrap.find('ul.depth2 li.on > a:visible').text(),
                            getDepth3 = $layerWrap.find('ul.depth3 li.on > a:visible').text(),
                            resultText = [];
                        
                        // select�� ���� �� select �ؽ�Ʈ ����
                        if($defaultSelect.length > 0) {
                            resultText.push($defaultSelect.filter(':visible').find('option:selected').text());
                        }
                        
                        // depth2 text ����
                        resultText.push(getDepth2);
                        // depth3 text ����
                        resultText.push(getDepth3);
                        
                        // �ؽ�Ʈ ��ġ��
                        resultText = resultText.join(' ');
                        
                        // ������ Ŭ���ؾ� ���� ����
                        if(resultText !== '' && getDepth2 !== '' && getDepth3 !== '' || getDepth2 === '��ü') {
                            $('.selType1 a[href="#'+getId+'"]').text(resultText);
                            layerPopup.closePopup($layerWrap);
                        }

                    } else {
                        $(this).parent().siblings().removeClass('on');
                        $(this).parent().addClass('on');
                        
                        // 2016.11.10 depth2 Ŭ���� �ش� depth3 show �� �� hide
                        if($(this).closest('ul').hasClass('depth2')) {
                            $($(this).attr('href')).show();
                            $($(this).attr('href')).siblings().hide();
                        }
                    }
                }               
            });
            
            /*
            * 2016.11.04 �߰�
            * ��Ÿ�� �˻��ݰ� ���� �˾�
            */
            // ���� formEvent.select �̺�Ʈ ����
            $(layerPopup.config.wrap).find('.searchRadius').off('click.selectList');
            $(document).off('click.layerSearchRadius');
            $(document).on('click.layerSearchRadius', searchRadius, function(e) {
                e.preventDefault();
                var layerId = $(this).closest('.layerWrap').attr('id'),
                    getValue = $(this).data('radius');
                
                // 2016.11.21 �˻��ݰ� ���� ( google map�� �ʱ�ȭ�Ǿ����� ��츸 ���);
                // 2017.01.03 ���� -> ���� ���� �ʿ�
                if(maps.google.config.map) {
                    maps.google.config.radius = getValue;
                    maps.google.radiusRefresh();
                }
                
                // 2017.01.11 ���� �߰�
                if(maps.daum.config.map) {
                    maps.daum.config.radius = getValue;
                    maps.daum.radiusRefresh();
                }

                layerPopup.config.saveBtn.html('�˻��ݰ� <em>'+ $(this).text() + '</em>');
                
                layerPopup.closePopup('#'+layerId);
            });         
        },
        
        /*
        * �˾� ����
        * @param {String} id �˾��� #id
        * @param {Boolean} isAnimation �˾� �ִϸ��̼� ����
        * @param {Boolean} isCallbackNotSizeType ���� true�� ��� �˾� ������ sizeType �ݹ� ���� ����
        */
        openPopup : function(id, isDefaultShow, isCallbackNotSizeType) {
            var config = layerPopup.config,
                $target = $(id),
                getId = id;
                
            if(!$target.length || $target.is(':visible')) { 
                // ���̾� �˾� ������ ����
                layerPopup.sizeType(getId); 
                return; 
            }
            
            var getWidth = ns.global.bw - config.marginRL;

            if($target.hasClass('fullLayer') || $target.hasClass('comeUp')) { getWidth = ns.global.bw }
            
            // 2017.01.11 ���ټ� �߰� (�˾� �ݱ��ư�� Ÿ��Ʋ ������ ��ġ�ؾ��մϴ�)
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

                // 2017.01.03 ���ټ� �߰� ��� ���̾��˾��� body �ϴܿ� �� (�˾� ����� content�� aria-hidden="true"�� �ǹǷ� content���ο� ������ �ȵ�)
                if($target.parent().attr('id') !== 'Wrap'){
                    $('#Wrap').append($target);
                }
                
                // type�� ���� layerPopup�� ���� �� ����
                $target.css({
                    width: getWidth+'px',
                }).stop(true, false).fadeIn(layerPopup.config.duration, function() {
                    
                    // 2017.01.15 Ư�� ��� ������� �ּҹٷ� ���� ���̰� ����� ������ �˾� ���� �� ������ ������
                    if(!isCallbackNotSizeType && !$target.hasClass('comeUp')) { layerPopup.sizeType(getId); }
                });
                            
                /* 
                * ���� ���� ��쿡�� ��ũ�� ž ����
                * �˾� ���� �� �� ���̾��˾� ������ ��� ���
                
                if(!$('.dim').length){
                    util.disableScroll(true);
                }
                */
                util.disableScroll(true);
                
                waiAccessibility.goFocus($target);

                /*
                * 2016.11.27
                * ȸ������ �˾� ���� �� ��� �˾� Ȯ�ν� ȸ������ �˾��� ������ �κ����� ���Ͽ� �ּ�
                */      
                // layerPopup.siblingsClose($(id));
                
                // ���̾� �˾� ������ ����
                layerPopup.sizeType(getId);     

                // ���̾� �˾� ���� �������� �̺�Ʈ
                layerPopup.inSwiperEvents(getId);           
                
                
                // .dim ������Ʈ ����
                
                if(!$target.hasClass('fullLayer')) {
                    layerPopup.createDim(layerPopup.config.duration);
                }

                // layerPopup.createDim(layerPopup.config.duration);
                            
                // �˾� ���ο� centerBox�� ���� �� ��� ����
                common.centerAlign();
                
                // 2016.10.05 ���� ���� trigger �̺�Ʈ
                $target.trigger('change', [$target]);
                
                // 2017.01.03 ���� -> ���� ���� �ʿ�
                if($target.find('#googleMap').length > 0 && maps.google.config.map) {
                    var apiGoogle = maps.google,
                        googleConfig = apiGoogle.config,
                        googleMap = googleConfig.map;
                    apiGoogle.setHeight();
                    google.maps.event.trigger(googleMap, 'resize');
                    googleMap.setCenter(googleConfig.markers[0].getPosition());
                }
                
                // 2017.01.11 ���� ���� �߰�
                if($target.find('#daumMap').length > 0 && maps.daum.config.map) {
                    var apiDaum = maps.daum,
                        daumConfig = apiDaum.config,
                        daumMap = daumConfig.map;
                    apiDaum.setHeight();
                    daumConfig.map.relayout();
                    daumConfig.map.setCenter(daumConfig.markers[0].getPosition());
                }
                
                // 2017.01.02 ���ټ� �߰�(�˾� ���½� �˾� ������ ��Ŀ�� �̵� ����)
                $('#content, footer, .topHead, .backBtn').attr('aria-hidden', true);

                //2017.10.11 �˾��ȿ� newType ���� ������ ���
                if($target.find('.tabJs.newType').length > 0) {
                    commonJs.tabsSetup();
                };
                
                //2018.08.23 �˾��ȿ� minContent Ŭ������ ������ ��
                if($target.find('.minContent').length > 0) {
                    common.minHeightSet('popup', id)
                };
            }
        },
        
        /**
        * �˾� �ݱ� ȣ��
        * @param {String} id �ش� �˾��� #id
        */
        closePopup : function(id, callback) {
            var config = layerPopup.config,
                $target = $(id),
                $popCont = $target.find('> .popCont'),
                duration = config.duration;
            
            // ���� ���̾��˾� �ִϸ��̼�
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
                //2017.08.01 ������_�Ʒ����� �ö���� �˾� CSS�ʱ�ȭ
                $target.css({height: 'auto', webkitTransform: 'translate3d(0, '+ $target.innerHeight() +'px, 0)', transition: 'none'});
                $popCont.scrollTop(0);
                layerPopup.removeDim(duration);
                util.disableScroll(false);  
            } else {
                /*
                * 2016.11.27
                * ���� ���̾� �˾��� �� ������ �˾� ���� �� dim ����
                */
                /*
                if($(config.wrap).not('.fullLayer').filter(':visible').length === 1 && !$target.hasClass('fullLayer')) {
                    layerPopup.removeDim(duration);
                }
                */
                layerPopup.removeDim(duration);
                util.disableScroll(false);  
            }
            
            // �˾� hide
            $target.stop(true, false).fadeOut(duration, function() {
                
                // 2017.01.12 callback �߰�
                if(typeof callback === 'function') {
                    callback();
                }               
                
                // 2016.10.31 ���ټ� ��Ŀ�� �߰�
                if(config.saveBtn) {
                    config.saveBtn.focus();
                    config.saveBtn = null;
                }
            });
            

            
            // 2017.01.02 ���ټ� �߰�(�˾� ���½� �˾� ������ ��Ŀ�� �̵� ����)
            $('#content, footer, .topHead, .backBtn').attr('aria-hidden', false);
        },
        
        
        
        /*
        * �� ����
        */
        createDim : function(duration) {
            var $dim = $('.dim');
            
            if(!$dim.length) {
                $('body').append('<div class="dim"></div');
            }
            $('.dim').stop(true, false).fadeIn(duration);
        },
        
        /*
        * �� ����
        * @param duration duration ��
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
        * ���� �˾� �����
        * @param {jQuery | HTMLElement} target �˾� Ÿ��
        */
        siblingsClose : function(target) {
            var $target = $(target);
            
            $target.siblings('.layerWrap').stop(true,false).fadeOut(layerPopup.config.duration);
        },
        
        /*
        * �˾� Ǯ������
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
            * 2016.11.09 ����
            * ��ü�޴� overflow-y ���� ����
            */
            if($target.attr('id') === 'totalMenu') {

                // 2016.01.02 ���� ���� �޴� cont�� marginTop ���� Ʋ�� totalHeight ������
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
        * �ö���� UI
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
        * �˾� ��� ����
        * @param {jQuery | HTMLElement} elem jquery ������
        * �˾� ����� ����̽� ���̰����� Ŭ��� �ִ� ���� - 64
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
            
            // �˾� ���̰� ��ü ���̺��� Ŭ ���
            if(targetHeight > totalHeight) {
                getTop = maxMarginTB / 2;
                getHeight = totalHeight - targetHeaderH - targetContP - alertBtnBoxH;
                
                // 2016.10.13 ���� ��ǥ �˾� ��� �߰�
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
                
                // ��ð��� ��ư�� ���� ��� ��ư ���� �� ��
                if($target.find('.lyrFixBtnArea').length > 0) {
                    getHeight = getHeight - $target.find('.lyrFixBtnArea').innerHeight();
                }
                
                $target.find('.popCont').css('height', getHeight+'px');
            
            // �˾� ���̰� ��ü ���̺��� ���� ���
            } else {
                getTop = -(targetHeight / 2);
                
                // 2016.10.13 ���� ��ǥ �˾� ��� �߰�
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
        * col2 ����Ʈ �˾� ���̰� �ִ�� ���� (������, ��Ÿ��)
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
        * ���̾� �˾� type ���� ( full, fullTpye2, centerAlign )
        */
        sizeType : function(target) {
            var $target = $(target);
            if($target.hasClass('fullLayer')) {
                layerPopup.full($target);   
                
            // 2016.10.28 ��Ÿ��, ������ �˾������� ������ ����
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
        * �˾� ���½� ���� �������� ��������
        * primeLayer (vip ���� �˾�)
        * couponBox (ī��ȳ�/��û ������ ���� �˾�) CR 
        */
        inSwiperEvents : function(id) {
            var config = layerPopup.config,
                $layerWrap = $(id),
                $popCont = $layerWrap.find('.popCont'),
                $layerNav = $layerWrap.find('.layerNav');
            
            /*
            * 2016.10.19
            * �˾��� ��� ���������� css�� ����� ���� �ʾ� �˾� ���� �� �������� refresh �޼��� ����
            */
            if($layerWrap.find('.swiperCon').length > 0) {
                
                if(config.saveBtn) {
                    var $slider = $layerWrap.find('.swiperCon > ul'),
                        $btn = config.saveBtn,
    //                  swiperIdx = $(id).find('.swiperCon').index('.swiperCon'),
                        btnIdx = -1;
                    
                    // 2016.11.15 primeLayer�� id�� ������ ���� ��� infinite ��尡 false�̹Ƿ� +1�� ���� �ʽ��ϴ�.
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
    * ���ո޴� + ���հ˻�
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
                
                // 2017.01.02 ���ټ� �߰�
                $('.tmToggle').find('> a').attr('title', '����');
            }
        },
        
        bindEvents : function() {
            var config = totalMenu.config;
            
            // �޴� ��ư
            $(config.totalMenuBtn).off('click.totalMenu');
            $(config.totalMenuBtn).on('click.totalMenu', function(e) {
                e.preventDefault();
                totalMenu.openPopup(config.totalMenuPop);
            });
            
            // �ݱ� ��ư
            $(config.totalCloseBtn).off('click.totalMenu');
            $(config.totalCloseBtn).on('click.totalMenu', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                var getId = '#' + $(this).closest('.layerWrap').attr('id');
                
                totalMenu.closePopup(getId);
            });
            
            // 2016.10.28  ��ü�޴� ��Ӵٿ� �߰�
            $(config.totalMenuList).off('click.totalMenu');
            $(config.totalMenuList).on('click.totalMenu', 'li.tmToggle > a', function(e) {
                e.preventDefault();
                var $li = $(this).parent(),
                    $depth2 = $(this).next('ul');
                
                // ���� �޴��� ���� ���� ��� ���� �޴� ����
                if($('.tmToggle').hasClass('on') && !$li.hasClass('on')) {
                    var $siblingsOn  = $('.tmToggle.on');
                    
                    // ���� �޴� Ŭ���� ����
                    $siblingsOn.removeClass('on');
                    // 2017.01.02 ���ټ� �߰�
                    $siblingsOn.find('> a').attr('title', '����');
                    // ���� �޴� ��ü ����
                    $siblingsOn.children('ul').slideUp({
                        duration: 'fast',
                        complete : function() {
                            // ���� �޴� Ŭ���� �߰�
                            $li.toggleClass('on');
                            
                            $depth2.stop(true,false).slideToggle('fast', function() {
                                // 2016.12.17 depth2 �޴��� ������ �� ��ũ�� ��� ����
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
                                    
                                    // 2017.01.02 ���ټ� �߰�
                                    $li.find('> a').attr('title', '������');
                                } else {
                                    // 2017.01.02 ���ټ� �߰�
                                    $li.find('> a').attr('title', '����');
                                }
                            });
                        }
                    });
                    
                // �޴� ��� ���
                } else {
                    $li.toggleClass('on');
                    $depth2.stop(true,false).slideToggle('fast', function() {
                        // 2016.12.17 depth2 �޴��� ������ �� ��ũ�� ��� ����
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
                            
                            // 2017.01.02 ���ټ� �߰�
                            $li.find('> a').attr('title', '������');
                        } else {
                            // 2017.01.02 ���ټ� �߰�
                            $li.find('> a').attr('title', '����');
                        }
                    });
                }
            });
        },
        
        /**
        * ��Ż�޴� animation
        * @param {jQuery | HTMLElement}elem �˾� target
        * @param {String} oldValue animation �����ϱ� �� css left �� ���� ex) '100%'
        * @param {String} newValue animation ���� �� css left �� ���� ex) '100%'
        * @param {Function} callback �ִϸ��̼� ���� �� �ݹ�
        */
        animPop : function(elem, oldValue, newValue, callback) {
            var config = totalMenu.config,
                $target = $(elem);
            
            $target.show();
            
            // 2016.11.04 �������� ���� �߰�
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
        * ��ü �޴� or ��ü �˻� ����
        * @param {jQuery | HTMLElement} id �˾� id
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
                // 2017.01.15 �ּҹٷ� ���� ����� ����Ǵ� ��춧���� �޴� ���� �� ������ ������
                layerPopup.full(id);
                
                totalMenu.disablePopupScroll({
                    wrap : '.menuWrap'
                });
                
                // 2017.01.02 ���ټ� �߰�(�˾� ���½� �˾� ù��° ��ҷ� ��Ŀ�� �̵�)
                waiAccessibility.goFocus($target);
            });
            
            util.disableScroll(true);
            
            // 2017.01.02 ���ټ� �߰�(�˾� ���½� �˾� ������ ��Ŀ�� �̵� ����)
            $('#content, footer, .topHead, .backBtn').attr('aria-hidden', true);
        },
        
        /**
        * ��ü �޴� or ��ü �˻� ����
        * @param {jQuery | HTMLElement} id �˾� id
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
            
            // 2017.01.02 ���ټ� �߰�(�˾� ���� �� �޴���ư���� ��Ŀ�� �̵�)
            $(config.totalMenuBtn).focus();
            
            //2017.01.05 �ǽ̹��� �ڵ� �˾� �������� ��� �ݱ�
            if($('.icoSec > .txt').is(':visible')) {
                $('.icoSec > .txt').hide();
            }

            // 2017.01.02 ���ټ� �߰�(�˾� ���� �� �˾� ������ ��Ŀ�� �̵� ���� ����)
            $('#content, footer, .topHead, .backBtn').attr('aria-hidden', false);
        },
        
        /**
        * ���ո޴� -> ���հ˻�â �̵�(��ü �޴�, ���հ˻�â �и��� ���� ���� ������� ����)
        */
        changePopup : function() {
            var config = totalMenu.config,
                totalMenuPop = config.totalMenuPop,
                totalSearchPop = config.totalSearchPop; 
            
            if($(totalMenuPop).is(':visible')) {
                // ���ո޴� �������� �и�
                totalMenu.animPop(totalMenuPop, '0%', '-100%', function() {
                    $(config.totalMenuPop).hide();
                    
                    // ���հ˻� ��Ŀ�� �̵�
                    $(config.totalSearchPop).find('.srchInput input').focus();
                });
                
                // ���հ˻�â ����
                totalMenu.openPopup(totalSearchPop);
            } else if($(totalSearchPop).is(':visible')) {
                // ���ո޴� �������� �и�
                totalMenu.animPop(totalSearchPop, '0%', '100%', function() {
                    $(config.totalSearchPop).hide();
                    
                    // ���ո޴� - �˻���ư ��Ŀ�� �̵�
                    $(config.totalSearchBtn).focus();
                });
                
                // ���հ˻�â ����
                totalMenu.animPop(totalMenuPop, '-100%', '0%');
                $(config.totalSearchPop).find('.srchInput').removeClass('open');
            }
        },
        
        /**
        * �޴� ����(�ִϸ��̼� ����)
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
        * IOS���� ��ũ���� �� �� �� ���µ��� ��ũ���� ��� ��ũ�� duration�� ������������ ��ũ�� �ȵǴ� ���󶧹��� �߰�
        * @param opts wrap ������Ʈ�� contents ������Ʈ
        * @param opts.wrap ���δ� ���
        * @param opts.contents ���� ���
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
                    
                    // ��ũ���� ó���κ�, ���κ� üũ�Ͽ� true�Ͻ� ��ġ ��ũ�� ����
                    if((touchPoint.move < 0 && wrapScrollTop <= 0) || (touchPoint.move > 0 && wrapScrollTop >= maxScrollTop)){
                        e.preventDefault();
                        e.stopPropagation();
                    }
                
            });     
        }
    };
    
    /**
    * ��ũ�� �� Ư�� ������Ʈ ��� ����
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
                            // offset ������ scrollFixed �޴��� ���̿� fixedItem�� ���̸� ���Ѱ��� ���ϴ�.
                            var offsetTop = $(this).offset().top - (targetHeight + fixedTop),
                                offsetHeight = offsetTop + parseInt($(this).innerHeight(), 10),
                                winTop = $(window).scrollTop();
                            
                            
                            // ������ tabCont�� ���̰� ������� ���� tabCont�� Ÿ��Ʋ�� Ȱ��ȭ �Ǵ� ��� ����
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
            
            // scroll�̵� �̺�Ʈ ����
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
            // ��ü��Ŀ
            markers : [],
            // ���� ���̴� ��Ŀ �ε� �̰� �� ���ٳ�...
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
            
            // �ʱ� ���̰� ����
            if($(config.target).length > 0) {
                maps.daum.setHeight();
            }
            
            // list������ �� �ʱ�ȭ
            //if($(config.listTarget).length > 0) {
            //  maps.daum.listMaps($(config.listTarget));
            //}
            
            if($('.daumMap').length > 0) {
                maps.daum.listMaps('.daumMap');
            }
        },
        
        /**
        * ���� ���� �ʱ�ȭ
        * @param {Object} placeLocation ��ǥ ��
        */
        setup : function(placeLocation) {
            var apiDaum = maps.daum,
                config = apiDaum.config;
            
            // �ؽ�Ʈ�� ��
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
                
            // �ؽ�Ʈ�� �ƴ� ��
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
        * Ű����� �˻�
        * @param opts �Ķ���� �ɼ� ��
        * @param opts.keyword �˻��� Ű����
        * @param opts.lat �߽��� �� ��ǥ �� (latitude)
        * @param opts.lng �߽��� �� ��ǥ �� (longitude)
        * @param opts.radius �ݰ� ���� ( default ���� 500 )
        * @example
        * commonJs.daumMaps.placeSetup({
            keyword : '��Ÿ����',
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
                        
                        // ������ ��Ŀ ��ǥ���� bounds ��ü�� �߰�
                        bounds.extend(location);
                    }
                    
                    // bounds ��ü�� �߰��� ��ǥ���� �������� ���� ���� �缳��
                    config.map.setBounds(bounds);           
                }
            });
            
        },
        
        /**
        * �ݰ� �� �˻�
        * @param opts �ɼ� ��
        * @param opts.currentLocation ������ġ �ɼǰ�
        * @param opts.locationList ��Ŀ ����Ʈ
        */
        radiusSetup : function(opts) {
            var apiDaum = maps.daum,
                config = apiDaum.config;
            
            try {

                var coords = new daum.maps.LatLng(opts.currentLocation.lat, opts.currentLocation.lng);
                
                // �� ������ �ȵǾ� ���� ��� map ����
                if(!$(config.target).data('daumMap')) {
                    config.map = new daum.maps.Map(config.target, {
                        center : coords,
                        level : 3
                    });
                    
                    $(config.target).data('daumMap', config.map);
                }
                
                //���� ���� ����
                apiDaum.setHeight();
                
                // ��Ŀ�� ��ǥ ����Ʈ�� ���� ��� ��Ŀ ����
                try{
                    if(opts.locationList){
                        apiDaum.addAllMarker(opts.locationList);    
                    }
                }catch(e){
                    console.log(e);
                }
                
                // ���� ��ġ ��ǥ�� ���� ��� ������ġ ��Ŀ
                if(opts.currentLocation) {
                    apiDaum.setCurrentMarker(opts.currentLocation);
                    try{
                        apiDaum.setRadiusMarker(opts.currentLocation); //[����]
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
            
            // ���� ��ġ�� �̵�
            daumMap.setCenter(getLocation);
            
            // ���� ��Ŀ ����
            if(radiusMarker) { radiusMarker.setMap(null); }
            
            // ��Ŀ ����
            config.radiusMarker = new daum.maps.Marker({
                position : getLocation,
                map : daumMap,
                icon : null
            });
            
            config.radiusMarker.setVisible(false);
            
            apiDaum.radiusRefresh(location.lat * 1,location.lng * 1);
        },
        
        /**
        * ����Ʈ Ÿ���� �� �ʱ�ȭ
        * target�� .daumMap���� ����
        * .daumMap ������Ʈ�� data-lat�� data-lng �Ӽ� �ʿ�
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
        * ��Ŀ ����
        * @param {Object} location ��Ŀ�� ǥ���� ��ǥ �� ex) {lat:32, lng: 120}
        * @param {Object} content ��Ŀ�� ������ content �� 
        * @param {Number} index ��Ŀ�� index ��
        */
        addMarker : function(opts, index) {
            var apiDaum = maps.daum,
                config = apiDaum.config,
                icon = config.icon,
                getLocation = new daum.maps.LatLng(opts.location.lat, opts.location.lng);
                //��Ŀ �ε��� �� �߰�
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
            
            // ������ ���� ��
            if(opts.content) {
                // ��Ŀ ���� ����
                $(marker).data('info',opts.content);
                // ��Ŀ index �� ����
                $(marker).data('index', index);
                // ��Ŀ Ŭ�� �̺�Ʈ
                daum.maps.event.addListener(marker, 'click', function() {
                    // Ŭ���� ��Ŀ �������� rectangle area ����
                    try{
                        apiDaum.rectangles(marker, index,opts.location.lat, opts.location.lng);
                    } catch(e) {
                        console.log(e);
                    }

                });
            }
            // ��Ŀ ����
            config.markers.push(marker);
        },
        
        
                /**
        * ������ �����ؼ� ��ġ�� ��Ŀ üũ
        * @param marker area�� ������ų marker Ÿ��
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
            
            // ��ġ�� ��Ŀ üũ
            var getOverLap = apiDaum.getOverLapMarker(startLat, startLng, endLat, endLng, idx);
            
            apiDaum.getClickMarkerInfo(marker, getOverLap,lat,lng);
            
            rectangle.setMap(null);
            
        },
        
        /**
        * ��ħ ��Ŀ Ŭ���� ��Ŀ ����Ʈ �˾� ����
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
            
            // ����Ʈ ����
            function addList(content) {
                var $li = $('<li />'),
                    $a = $('<a href="#" />');
                    
                $a.text(content.title);
                $a.data('content', content); 
                
                $li.append($a);
                
                return $li;

            }
            
            // ����Ʈ���̾ �����Ǿ������� ���� �� �����
            if($('#markerListLayer').length > 0) {
                $('#markerListLayer').remove();
            }
            
            // Ŭ���� target ���� ó�� ����
            $ul.append(addList(targetContent));
            
            // �޾ƿ� ��Ŀ�� ������ �±� ���� �� �±׿� ����
            for(var i=0, len=getMarkers.length; i < len; i++) {
                var markerContent = getMarkers[i];
                
                $ul.append(addList(markerContent));
            }
            $layerCloseBtn.text('�ݱ�');
            $layerClose.append($layerCloseBtn);
            $layerPopCont.append($ul);
            $layerPopTop.html('<strong class="fs2">������ ����Ʈ</strong>')           
            $layerWrap.append($layerPopTop);
            $layerWrap.append($layerPopCont);
            $layerWrap.append($layerClose);         
            
            // ����Ʈ �˾� ����
            $('.mapArea > .inner, .mapType').append($layerWrap);
                        
            // �˾� ����
            layerPopup.openPopup($layerWrap, false, true);

            // �˾� css ����
            $layerWrap.css({
                'position': 'absolute',
                'top' : 0,
                'margin-top' : 0
            });         
            
            /*
            apiGoogle.setListHeight($layerWrap);
            
            // ����Ʈ Ŭ���� ���� set
            $layerWrap.on('click', '.searchPlace a', function(e) {
                e.preventDefault();
                apiGoogle.setInfo($(this).data('content'));
            });
            */
        },
        
        
        
        /**
        * ��Ŀ ��ü ����
        * @param opts �ɼ� ��
        * @param {Array} opts.locationList ��Ŀ ����Ʈ
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
                // ��ǥ ����
                getLocation = new daum.maps.LatLng(getPlace.location.lat, getPlace.location.lng);
                // ������ ���� ��� ����
                //getInfo = getPlace.content ? getPlace.content : null;
                //��Ŀ �߰�
                apiDaum.addMarker(list[i], i);
                
                // ������ ��Ŀ ��ǥ���� bounds ��ü�� �߰�
                bounds.extend(getLocation);
            }
            
            // bounds�� �߰��� ��ǥ���� �������� ���� ���� ������
            config.map.setBounds(bounds);
        },
        
        /**
        * ��Ŀ ��ü ����
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
        * �ݰ� �˻� ���� ��ħ
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
        * �� ���� ��ħ
        */
        refreshMap : function() {
            var apiDaum = maps.daum,
                config = apiDaum.config;
                
            apiDaum.setHeight();
            config.map.relayout();      
        },
        
        /**
        * ������, ����� show / hide
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
            
            // ����Ʈ��, ���� switch ��ư
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
        * ��Ŀ Ŭ�� �̺�Ʈ
        */
        getClickMarkerInfo : function(target,markers,lat,lng) {
            try{
                var apiDaum = maps.daum,
                config = apiDaum.config,
                $target = $(target),
                targetInfo = $target.data('info'),
                getMarkerArr = markers,
                getMarkerArrLen = getMarkerArr.length;
                
                // ���� ��Ŀ�� ������ 1�� �̻��� ��
                if(getMarkerArrLen > 0) {
                    var arr = [];
            
                // ��Ŀ���� ��ȸ�ϸ� arr�� info�� ����
                    for(var i=0; i< getMarkerArrLen ; i++) {
                        arr.push($(getMarkerArr[i]).data('info'));
                    }
                    
                    // �Ÿ������� ����
                    arr.sort(function(a, b) {
                        return a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0;
                    });
                    
                    // �Ѱ��� �迭�� ����Ʈ�˾� ����
                    apiDaum.setCreateInfoLayer(targetInfo, arr,lat,lng);
                }
                
                apiDaum.setInfo(targetInfo,lat,lng);
                
            }catch(e){
                console.log(e);
            }

        },
        
        /**
        * ��ġ�� ��Ŀ üũ
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
                    
                    // Ŭ���� ��Ŀ�� ��ġ���� üũ
                    inAreaCheck = startLat <= getEndLat && endLat >= getStartLat && startLng <= getEndLng && endLng >= getStartLng,
                    
                    // ��ǥ�� ������ ��ġ�ϴ��� üũ
                    equalCheck = startLat === getStartLat && endLat === getEndLat && startLng === getStartLng && endLng === getEndLng;
    
                    if((inAreaCheck || equalCheck) && idx !== i){
                        checked++
                        arr.push(viewList[i]);
                    }
            }
            return arr;
        },
        
        /**
        * ���� ������ ���� ��Ŀ width, height �� ��ȯ
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
        * ��Ŀ ũ�⸸ŭ�� ���� ��ǥ get
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
        * �ϵ�, ���� ��ǥ �� return
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
        * ���� ��ġ �ּ� return
        * commonJs.googleMaps.getCurrentAddress(currentLocation, callback);
        * @param {Object} currentLocation ���� ��ǥ ��
        * @example
        * commonJs.daumMaps.getCurrentAddress({lat: 33.333, lng : 120.111}, function(address) {
        *       // address = �ּ�
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
        * ������ �Ǵ� ��Ŀ ����
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
                // ���� ��ġ�� �̵�
                daumMap.setCenter(getLocation);             
            }catch(e){
                console.log(e);
            }
            // ���� ��ġ�� �̵�
            //daumMap.setCenter(getLocation);
            
            // ���� ��Ŀ ����
            if(currentMarker) { currentMarker.setMap(null); }
            
            // ��Ŀ ����
            currentMarker = new daum.maps.Marker({
                map : daumMap,
                position : getLocation
            });
            
            currentMarker.setMap(daumMap);
            config.currentMarker = currentMarker;
            
        },
        
        /*
        * ���� ���� �� ����
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
        * ��Ŀ ũ�⸸ŭ �簢�� �׸���(���� üũ��)
        */
        setRactangle : function(curMarker, callback) {
            var apiDaum = maps.daum,
                config = apiDaum.config,
                
                // ������ ǥ���� �簢���� �����մϴ�.
                rectangle = new daum.maps.Rectangle({
                    bounds : apiDaum.getCurrentBounds(curMarker.getPosition()),
                    strokeWeight : 2,
                    strokeColor : '#FF0000',
                    strokeOpacity: 0.8,
                    strokeStyle : 'shortdashdot',
                    fillColor: '#FF0000',
                    fillOpacity: 0.35
                });
                
            // �������� �簢���� ǥ���մϴ�.
            ractangle.setMap(config.map);
                
            var rectBounds = apiDaum.getSwNe(rectangle.getBounds());
            
            if(typeof callback === 'function') {
                callback(rectBounds);
            }
            
            // �������� �簢���� �����մϴ�.
            rectangle.setMap(null);
                
        },
        
        /**
        * ��Ŀ�� ����� ������ ������ ȭ�鿡 �Ѹ�
        */
        setInfo : function(markerContent,lat,lng) {
            var getData = markerContent,
                getDataDistance = getData.distance,
                $mapArea = $('.mapArea, .mapType'),
                $branchInfo = $mapArea.find('.branchInfo'),
                $listType = $mapArea.find('.listType');
                
            // ��Ÿ�� ������ ����
            if($listType.length > 0) {
                $listType.find('.distance').text(getDataDistance+'m');
                $listType.find('.category').text(getData.category);
                $listType.find('.tit').text(getData.title);
                $listType.find('.addr').text(getData.address);
                $listType.find('.thum > img').attr('src', getData.thumb);
                
                $listType.find('.benefit').empty();
                
                if(getData.mbrmchIdnfr) { $listType.find('a').attr('onclick', 'starShopManager.bztypDtail("' + getData.mbrmchIdnfr +'","list")'); }
                
                if(getData.benefit) {
                    if(getData.benefit.discount) { $listType.find('.benefit').append('<span>���� <em class="fc2">' + getData.benefit.discount + '</em></span>'); }
                    if(getData.benefit.saving) { $listType.find('.benefit').append('<span>���� <em class="fc5">' + getData.benefit.saving + '</em></span>'); }
                    if(getData.benefit.freePaymant) { $listType.find('.benefit').append('<span>������ <em class="fc6">' + getData.benefit.freePaymant + '</em></span>'); }
                }
                
                $branchInfo.find('.btnSS').attr('onClick', 'goApp('+lat+','+lng+')');
                
            } else if ($branchInfo.length > 0) {
                
                $branchInfo.find('.brName').text(getData.title);
                $branchInfo.find('.brAddr').text(getData.address);
                $branchInfo.find('.btnSS').attr('onClick', 'goApp('+lat+','+lng+')');
                
                // atm
                if($branchInfo.closest('.atmSearch').length > 0) {
                    $branchInfo.find('.distance').text(getDataDistance+'m');
                
                // ���࿵������
                } else {
                    $branchInfo.find('.brTel').attr('href', 'tel:'+getData.tel);
                    $branchInfo.find('.brTel').text(getData.tel);
                    $branchInfo.find('.distance').text(getDataDistance + 'km');
                }
            }
            // 2017.01.13 ���߰��� trigger �̺�Ʈ �߰� (���õ� info�� index���� �Ѱ���)
            // ������  ���ۿ��� ��������� �߰� ...... ����ϳ�?
            $(document).trigger('mapSetInfo', [getData.index]);
        },
        
        /**
        * ��ġ�� ��Ŀ üũ�Ͽ� ���̾� �˾� ����
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
                
            // ����Ʈ ����
            function addList(content) {
                var $li = $('<li />'),
                    $a = $('<a href="#" />');
                
                $a.text(content.title);
                $a.data('info', content);
                
                $li.append($a);
                
                return $li;
            }
            
            // ����Ʈ���̾ �����Ǿ����� �� ���� �� �����
            if($('#markerListLayer').length >0) {
                $('#markerListLayer').remove();
            }
            
            // Ŭ���� target�� ���� ���� ����
            $ul.append(addList(targetInfo));
            
            // �޾ƿ� ��Ŀ�� ������ �±� ���� �� �±׿� ����
            for(var i=0, len=getMarkers.length; i< len; i++) {
                var markerContent = getMarkers[i];
                
                $ul.append(addList(markerContent));
            }
            
            $layerCloseBtn.text('�ݱ�');
            $layerClose.append($layerCloseBtn);
            $layerPopCont.append($ul);
            $layerPopTop.html('<strong class="fs2">������ ����Ʈ</strong>');
            $layerWrap.append($layerPopTop);
            $layerWrap.append($layerPopCont);
            $layerWrap.append($layerClose);
            
            // ����Ʈ �˾� ����
            $('.mapArea > .inner, .mapType').append($layerWrap);
            
            // �˾� ����
            layerPopup.openPopup($layerWrap);
            //$layerWrap.show();
            
            $layerWrap.css({
                'position' : 'absolute',
                'top' : 0,
                'margin-top' : 0
            });
            
            // ����Ʈ Ŭ���� ���� set
            $layerWrap.on('click', '.searchPlace a', function(e) {
                e.preventDefault();
                apiDaum.setInfo($(this).data('info'),lat,lng);
            });
        },
        
        /**
        * �ݰ� �� ����
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
                title : '�˻��ݰ� ���̾� �˾� ��ũ',
                text : '�˻��ݰ� ' + $('.srchRadius > .layerOpen > em').text() + ' ���õ� '
            });
            
            if(config.map) {
                //apiDaum.radiusRefresh();
            }
        }
    };
    
    /**
    * ���� maps
    * 2017.01.03 ���� -> ���� ���� �ʿ�
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
            // ��ü ��Ŀ
            markers : [],
            // ���� ���̴� ��Ŀ
            viewMarkers : [],
            radius : 500,
            infoIndex : 0
        },
        init : function() {
            var config = maps.google.config;
            
            if(config.switchBtn.length > 0) { maps.google.activeSwitch(); }
            
            if($(config.target).length > 0) {
                // ���� ���� �� ����
                maps.google.setHeight();    
            }
            
            /**
            * ����� ���� �׽�Ʈ
            * ��� on�� ���� refresh �ʿ�
            * google.maps.event.trigger($('.googleMap').data('map'), 'resize');
            */
            if($('.googleMap').length > 0) {
                maps.google.listMaps('.googleMap');
            }
        },
        
        /**
        
        * ���� �� �ʱ�ȭ
        * @param {Object} opts ��ǥ ������
        * @param {Object} opts.currentLocation ������ġ
        * @param {Object} opts.locationList ������ ������
        */
        setup : function(opts) {
            var apiGoogle = maps.google,
                config = apiGoogle.config;
                
            try {
                // �� �ʱ�ȭ
                config.map = new google.maps.Map(config.target, {
                    // center: myLatLng,
                    disableDefaultUI : true,
                    zoom : 13
                });
            } catch(e) {
                
                console.log(e);
                return;
            }
            
            // ���� ���� �� ����
            apiGoogle.setHeight();              
            
            // ��Ŀ�� ��ǥ ����Ʈ�� ���� ��� ��Ŀ ����
            if(opts.locationList) { 
                apiGoogle.addAllMarker(opts.locationList); 
            }
            
            // ���� ��ǥ���� ���� ��� ���� ��ǥ�� ���� ��Ŀ ����
            if(opts.currentLocation) { 
                apiGoogle.setCurrentMarker(opts.currentLocation);
                apiGoogle.setRadiusMarker(opts.currentLocation);
                
            // ���� ��ǥ�� �������� ���� �� �Ѱܹ��� locationList[0]��°�� ������ setCenter
            } else {
                apiGoogle.viewPlace(config.markers[0]);
            }
            
            apiGoogle.bindEvents();
            
            $(config.target).data('map', config.map);
        },
        
        /**
        * ����� ����Ʈ �� �ʱ�ȭ
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
            // ���� ��ġ ��ư
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
                    //alert('���������ʽ��ϴ�.');
                }               
                
            }); 
            
            // ���ΰ�ħ
            $(config.refreshBtn).off('click.googleMap');
            $(config.refreshBtn).on('click.googleMap', function(e) {
                e.preventDefault();
                
                var getCenter = config.map.getCenter(),
                    getPosition = {
                        lat : getCenter.lat(),
                        lng : getCenter.lng()
                    };
                // ��Ŀ ����
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
        * �� �������� �޼���
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
        * ���ΰ�ħ �̺�Ʈ (�ݰ� �� ������)
        */
        refreshPosition : function(opts) {
            var apiGoogle = maps.google,
                config = apiGoogle.config;
            
            apiGoogle.deleteMarkers();
            apiGoogle.addAllMarker(opts.locationList);
            apiGoogle.setRadiusMarker(opts.currentLocation);
        },
        
        /**
        * ������, ����� show / hide
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
            
            // ����Ʈ��, ���� switch ��ư
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
        * ���� ��ǥ �������� �ݰ� �׸���
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

            // ���� �ݰ� ����
            if(currentCircle) { currentCircle.setMap(null); }
            config.currentCircle = new google.maps.Circle(circleOptions);               
            googleMap.fitBounds(config.currentCircle.getBounds());
        },
    
        /**
        * �ݰ� �� ��Ŀ ǥ��
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
            
            // ��ü ���� (distance ������ ����)
            config.viewMarkers.sort(function(a,b) {
                return a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0;
            });
            
        },      
        
        /**
        * Ư�� ��� marker ǥ��
        * @param placeMarker �Ѱܹ��� ����Ʈ�� ù��° ��ǥ
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
        * �ݰ� ����
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
        * ��Ŀ ����
        * @param {Object} opts ��ǥ �� ������ ����
        */
        addMarker : function(opts, idx) {
            var apiGoogle = maps.google,
                config = apiGoogle.config;
                
                // ��Ŀ �ε��� �� �߰�
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
                
            // ��Ŀ ����
            var marker = new google.maps.Marker(markerOptions);
            
            marker.addListener('mousedown', function() {
                apiGoogle.rectangles(marker, idx);
                
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 750);
            });
            
            // ���� ������ ��Ŀ�� ����
            config.markers.push(marker);        
        },
        
        /*
        * ��Ŀ ��ü ����
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
        * ��Ŀ ��ü ǥ��
        */
        allViewMarker : function() {
            var apiGoogle = maps.google,
                config = apiGoogle.config;
            
            for(var i = 0, len = config.markers.length; i < len; i++) {
                config.markers[i].setMap(config.map);
            }
        },
        
        /**
        * ��Ŀ �Ⱥ��̱�
        */
        clearMarkers : function() {
            var apiGoogle = maps.google,
                config = apiGoogle.config;
            
            for(var i = 0, len = config.markers.length; i < len; i++) {
                config.markers[i].setMap(null);
            }
        },
        
        /**
        * ��Ŀ ����
        */
        deleteMarkers : function() {
            var apiGoogle = maps.google,
                config = apiGoogle.config;
            
            apiGoogle.clearMarkers();
            config.markers = [];
        },
        
        /*
        * ���� �ݰ泻 ǥ�õ� marker�� ���� �̺�Ʈ
        * @param {Number} index �ݰ泻 ���� ����� ��Ŀ������ 0���� ����
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
        * ������ �����ؼ� ��ġ�� ��Ŀ üũ
        * @param marker area�� ������ų marker Ÿ��
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
            
            // �׽�Ʈ
            
            var startLat = parseFloat(rectangle.getBounds().getSouthWest().lat());
            var startLng = parseFloat(rectangle.getBounds().getSouthWest().lng());
            var endLat = parseFloat(rectangle.getBounds().getNorthEast().lat());
            var endLng = parseFloat(rectangle.getBounds().getNorthEast().lng());
            
            // ��ġ�� ��Ŀ üũ
            var getOverLap = apiGoogle.getOverLapMarker(startLat, startLng, endLat, endLng, idx);
            
            apiGoogle.onClickMarker(marker, getOverLap);
            
            rectangle.setMap(null);

        },
        
        /**
        * �� ���� �� ����
        */
        setHeight : function() {
            var apiGoogle = maps.google,
                config = apiGoogle.config;
                
            /**
            * ���̰� ����
            * .shopInfor�� ��Ÿ�� �������� �б�� Ŭ���� üũ
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
        * �˻� �ݰ� ���� �޼���(�ʿ��� ��� ���)
        * @param {Number} rValue ������ ���� �� (300, 500, 1000, 3000);
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
            
            //2017.01.07 ���ټ� �߰� (�˻��ݰ� �ؽ�Ʈ)
            waiAccessibility.setAriaLabel({
                target : $('.srchRadius > .layerOpen'),
                type : 'button',
                title : '�˻��ݰ� ���̾� �˾� ��ũ',
                text : '�˻��ݰ� ' + $('.srchRadius > .layerOpen > em').text() + ' ���õ� '
            });
            
            if(config.map) {
                apiGoogle.radiusRefresh();  
            }

        },
                
        /*
        * ������ �Ǵ� ��Ŀ ����
        */
        setCurrentMarker : function(location) {
            var apiGoogle = maps.google,
                config = apiGoogle.config,
                googleMap = config.map,
                currentMarker = config.currentMarker,
                getLocation = {lat : location.lat * 1 , lng : location.lng * 1 };
            
            // config.currentLocation = getLocation;
            
            // ���� ��ġ�� �̵�
            googleMap.setCenter(getLocation);
            
            // ���� ��Ŀ ����
            if(currentMarker) { currentMarker.setMap(null); }
            
            // ��Ŀ ����
            config.currentMarker = new google.maps.Marker({
                position : getLocation,
                map : googleMap
            });
        },
        
        /*
        * ������ �˻��� ��Ŀ
        */
        setRadiusMarker : function(location) {
            var apiGoogle = maps.google,
                config = apiGoogle.config,
                googleMap = config.map,
                radiusMarker = config.radiusMarker,
                getLocation = {lat : location.lat * 1 , lng : location.lng * 1 };
            
            config.currentLocation = getLocation;
            
            // ���� ��ġ�� �̵�
            googleMap.setCenter(getLocation);
            
            // ���� ��Ŀ ����
            if(radiusMarker) { radiusMarker.setMap(null); }
            
            // ��Ŀ ����
            config.radiusMarker = new google.maps.Marker({
                position : getLocation,
                map : googleMap,
                icon : null
            });
            
            config.radiusMarker.setVisible(false);
            
            apiGoogle.radiusRefresh();
        },
        
        /**
        * Ŭ���� ��Ŀ�� ���� ���� �޾ƿ�
        * @param {Array | Object} markers ��Ŀ�� ������ �޾ƿ�
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
                
                // ��ü ���� (distance ������ ����)
                arr.sort(function(a,b) {
                    return a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0;
                });
                
                // �Ѱ��ִ� ��ü�� ����Ʈ�˾� ����
                apiGoogle.createListLayer(target.content, arr);
            }
            
            apiGoogle.setInfo(target.content);
        },
        
        /**
        * ��ħ ��Ŀ Ŭ���� ��Ŀ ����Ʈ �˾� ����
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
            
            // ����Ʈ ����
            function addList(content) {
                var $li = $('<li />'),
                    $a = $('<a href="#" />');
                    
                $a.text(content.title);
                $a.data('content', content); 
                
                $li.append($a);
                
                return $li;

            }
            
            // ����Ʈ���̾ �����Ǿ������� ���� �� �����
            if($('#markerListLayer').length > 0) {
                $('#markerListLayer').remove();
            }
            
            // Ŭ���� target ���� ó�� ����
            $ul.append(addList(targetContent));
            
            // �޾ƿ� ��Ŀ�� ������ �±� ���� �� �±׿� ����
            for(var i=0, len=getMarkers.length; i < len; i++) {
                var markerContent = getMarkers[i];
                
                $ul.append(addList(markerContent));
            }
            $layerCloseBtn.text('�ݱ�');
            $layerClose.append($layerCloseBtn);
            $layerPopCont.append($ul);
            $layerPopTop.html('<strong class="fs2">������ ����Ʈ</strong>')           
            $layerWrap.append($layerPopTop);
            $layerWrap.append($layerPopCont);
            $layerWrap.append($layerClose);         
            
            // ����Ʈ �˾� ����
            $('.mapArea > .inner, .mapType').append($layerWrap);
                        
            // �˾� ����
            layerPopup.openPopup($layerWrap, false, true);

            // �˾� css ����
            $layerWrap.css({
                'position': 'absolute',
                'top' : 0,
                'margin-top' : 0
            });         
            apiGoogle.setListHeight($layerWrap);
            
            // ����Ʈ Ŭ���� ���� set
            $layerWrap.on('click', '.searchPlace a', function(e) {
                e.preventDefault();
                apiGoogle.setInfo($(this).data('content'));
            });
        },

        
        /**
        * ����Ʈ �˾� ���� ����
        * @param {jQuery | HTMLElement} ���̾� Ÿ��
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
                mapAreaOffsetTop = $mapArea.offset().top,       // 2017.01.05 ���ټ� ��Ŀ�� �̽������� ���̾ �ٱ����� �������ν� ���̰� ������ ���� �߰�
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
                // ���̾� �˾��� .popTop ���� �� ����
                totalHeight -= popTopHeight;
                // ���� �� ����
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
        * place ���� �ϴ� ���̾��˾����� set
        */
        setInfo : function(getContent) {
            var getData = getContent,
                getDataDistance = getData.distance,
                $mapArea = $('.mapArea, .mapType'),
                $branchInfo = $mapArea.find('.branchInfo'),
                $listType = $mapArea.find('.listType');
            
            // ��Ÿ�� ������ ����
            if($listType.length > 0) {
                        
                $listType.find('.distance').text(getDataDistance+'m');
                $listType.find('.category').text(getData.category);
                $listType.find('.tit').text(getData.title);
                $listType.find('.addr').text(getData.address);
                $listType.find('.thum > img').attr('src', getData.thumb);
                
                $listType.find('.benefit').empty();             
                
                if(getData.mbrmchIdnfr) { $listType.find('a').attr('onclick', 'starShopManager.bztypDtail("' + getData.mbrmchIdnfr +'")'); }
                
                if(getData.benefit.discount) { $listType.find('.benefit').append('<span>���� <em class="fc2">'+ getData.benefit.discount +'</em></span>') } 
                if(getData.benefit.saving) { $listType.find('.benefit').append('<span>���� <em class="fc5">'+ getData.benefit.saving +'</em></span>') } 
                if(getData.benefit.freePaymant) { $listType.find('.benefit').append('<span>������ <em class="fc6">'+ getData.benefit.freePaymant +'</em></span>') } 
                
            // ������ atm, ���࿵������ ����
            } else if ($branchInfo.length > 0) {
                
                $branchInfo.find('.brName').text(getData.title);
                $branchInfo.find('.brAddr').text(getData.address);
                
                // atm
                if($branchInfo.closest('.atmSearch').length > 0) {
                    $branchInfo.find('.distance').text(getDataDistance+'m');
                
                // ���࿵������
                } else {
                    $branchInfo.find('.brName').append('('+getDataDistance+'km)');
                    $branchInfo.find('.brTel').attr('href', 'tel:'+ getData.tel);
                    $branchInfo.find('.brTel').text(getData.tel);
                }
            }
            
            // 2017.01.13 ���߰��� trigger �̺�Ʈ �߰� (���õ� info�� index���� �Ѱ���)
            $(document).trigger('mapSetInfo', [getData.index]);
        },
        

        /**
        * ��ġ�� ��Ŀ �ִ��� üũ
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
                    
                    // Ŭ���� ��Ŀ�� ��ġ���� üũ
                    inAreaCheck = startLat <= getEndLat && endLat >= getStartLat && startLng <= getEndLng && endLng >= getStartLng,
                    
                    // ��ǥ�� ������ ��ġ�ϴ��� üũ
                    equalCheck = startLat === getStartLat && endLat === getEndLat && startLng === getStartLng && endLng === getEndLng;
                
                /*
                * ��ġ�� ��Ŀ üũ
                */
                if((inAreaCheck || equalCheck) && idx !== i){
                    checked++
                    /*
                    ���� Ȯ�ο�
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
            
            // ������ ��Ŀ�� ����
            return arr;
        },
        
        /**
        * ������ ���� �޾ƿ� �ش� �����ǰ��� rectangles ����
        * @param center position(location) ��
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
        * radius �� ���
        */
        getRad : function(x) {
            return x * Math.PI / 180;
        },
        
        /*
        * ���� ��Ŀ�κ��� �Ÿ� ����
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
        * ���� ��ġ �ּ� return
        * commonJs.googleMaps.getCurrentAddress(currentLocation, callback);
        * @param {Object} currentLocation ���� ��ǥ ��
        * @example
        * commonJs.googleMaps.getCurrentAddress({lat: 33.333, lng : 120.111}, function(address) {
        *       // address = �ּ�
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
    * // �������� �ʱ�ȭ
    * commonJs.swipers.init();
    *
    * // ��� �ʱ�ȭ
    * commonJs.arcodians.init();
    *
    * // �˾� �ʱ�ȭ
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
    
    // filter �˾����� filter �� return
    ns.getFilterValue = formEvent.getFilterValue;
     
    /**
    * form ���� event reBind
    */
    ns.formBindEvents = function() {
        formEvent.init();
        arcodians.init();
        tabs.init();
        layerPopup.init();
    };
    
    // ��ü �޴� show
    ns.showMenu = totalMenu.showMenu;
    
    // section �±� show / hide �� �� ���� �ʿ�
    ns.changeSection = function() {
        common.bgClass();
        common.fixedSetup();
        common.setContainerPadding();
        common.centerAlign();
        common.fixedBtnScroll();
    };
    
    // ���� ī�� �̹��� ���η� ��ȯ
    ns.setRotateAppCard = common.setRotateAppCard;
    
    // ���ټ� ��Ŀ��
    ns.goFocus = waiAccessibility.goFocus;
    
    ns.autoMoveNextTag = function(obj, nextObj){
        //e.preventDefault();
        
        /**
         * ��ũ�� �̵� �ӽ� �Լ�
         */
        var moveObj = function(obj){
            var nextObjId = obj.attr("id");
            var offset = $("#"+nextObjId).offset();
            $("html, body").animate({scrollTop:offset.top-80}, 1000);
        }
        
        var isMoveFlag = false;
        var inputType = obj.type;
        
        // �ؽ�Ʈ�� ��й�ȣ
        if(inputType == "text" || inputType == "password"){
            var maxLength = $(obj).attr("maxlength");
            var tempValueLength = $(obj).val().length;
            
            if(maxLength == tempValueLength){
                isMoveFlag = true;
            }
        // ��ȭ��ȣ ���
        }else if(inputType == "tel"){
            var maxLength = $(obj).attr("maxlength");
            //������� 6�ڸ� �Ǵ� �ֹε�Ϲ�ȣ ���ڸ� 1�ڸ� �ϰ��
            if(maxLength == 6 || maxLength == 1){
                var tempValueLength = $(obj).val().length;
                
                if(maxLength == tempValueLength){
                    isMoveFlag = true;
                }
            // �ڵ��� ��ȣ �� ���
            }else if(maxLength == 16){
                var regExp = /^01([0|1|6|7|8|9]?)-?([0-9]{4})-?([0-9]{4})$/;//�ڵ�����ȣ ���Խ�
                var tempVal = $(obj).val();
                if(regExp.test(tempVal)){
                    isMoveFlag = true;
                }
            }
        //üũ�ڽ��� ���
        }else if(inputType == "checkbox"){
            var isChecked = $(obj).is(":checked");
            if(isChecked){
                isMoveFlag = true;
            }
        }
        /**
         * isMoveFlag�̸� ���� obj�� �̵��Ѵ�. ��Ŀ��+ ��ũ���̵�
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
                //������ȣ �������� - SMS�� ���������� �� ���鰪 "" (������ C)
                kbmobile.app.getSmsAuthNo(function(smsAuthNo){
                    
                    if(smsAuthNo){
                        //console.log("smsAuthNo: "+ smsAuthNo);
                        //console.log("polling stop");
                        clearTimeout(smsTimer);
                        //������ȣ ���� �� ����Ȯ�� Ŭ���̺�Ʈ
                        $authNumTag.val(smsAuthNo);
                        
                        if(!notBtnClickFlag || (typeof notBtnClickFlag == 'undefined')){
                        	// �̹� ���ִ� �˾�â�� ���� ��쿡 �̸� �ݾ��ش�.(��ũ���� ������ ���������� ����)
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
     SMS ������ȣ �ڵ��ϼ�
     MT00542, ������
    - CORDOVA�Լ�ȣ�� ���� ������ȣ ��������( �����÷����ο��� ����)
    - ������ ���� ȣ��(���ֵ������� �ϱ� ����-��ī��ó��)
    - ���ڸ� ���޹޾Ƽ� ����
    - �ڵ��ϼ��Ѵ����� ����Ȯ�� ��ư�� ��Ŀ���� ����
    - $phoneNumTag: �޴���ȭ��ȣ �Է��±�
    - $authNumSendBtn: ������ȣ���� ��ư
    - $authNumTag : ������ȣ �Է��±�
    - $authCheckBtn : ����Ȯ�� ��ư
    - notBtnClickFlag : ���� ��ư Ŭ�� ���� �̺�Ʈ �÷��� : true�̸� �ȳѾ�� false�̰ų� undefined �̸� �Ѿ�� 
    **/
    ns.setAutoSMSAuthNo= function ($phoneNumTag, $authNumSendBtn, $authNumTag, $authCheckBtn, $mmss, notBtnClickFlag ){
        smsTimer = null; // ���� Ÿ�̸�
        
        /**
            SMS������û
            - ������ȣ ���� ��ư ������ �ÿ�
            - Application activeSmsNoti ȣ�� 
        **/
        
        try{
            // activeSmsNoti ȣ��
            kbmobile.app.activeSmsNoti();
            
            clearTimeout(smsTimer);
            // ������ȣ ����
            commonJs.getSmsAuthNo($phoneNumTag, $authNumSendBtn, $authNumTag, $authCheckBtn, $mmss, notBtnClickFlag);
        }catch(err){
            //console.log("error: "+ err);
        }
        /**
            �Է�â ��Ŀ���ÿ� ������ ����
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
    // �ڵ� ����
    $(function() {
        init();
    }); 
    
    // Ǫ�Ͱ� �ʰ� �����Ǵ� �������� �־� ��ü �ε��� ��ư ���� �ѹ��� ����
    window.onload = function() {
        common.fixedBtnScroll();
        waiAccessibility.init();        
        
        /*
        * 2017.01.03
        * ���� ���� �����Ǵ� �������� ���� $(document)�� event�� �ɾ���ұ� ������
        * ����Ű�е� ��ġ�Ҷ�(touchstart) $(document) �̺�Ʈ���� ����Ǵ� ����(����)�� touchstart ���� ���� ��ũ��Ʈ �߰�
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
    * jquery show / hide �̺�Ʈ ����
    * @example
    * // section.show()�� ������ �� �Ʒ� console ���
    * $('section').on('show', function() {
        console.log('show');
    * });
    * // section.hide()�� ������ �� �Ʒ� console ���
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
    * ��������
    */
    (function() {
        var defaults = {
            // �ִϸ��̼� �ӵ� ��
            duration: 500,              // number
            easing : '',
            
            // ���� ���õ� index (�ش� ��� ��� ������ ������Ʈ�� currentClass �߰�)
            currentIndex : 0,           // number
            
            // ���� ���õ� �����̵��� class
            currentClass : 'on',        // String
            
            // width �� ���� fasle �� ��� �θ� ������Ʈ�� ���̷� ����
            // true�� ��� css�� ���̸� �״�� ����
            variableWidth : true,       // boolean
            autoHeight : false,
            
            //��ġ ��� ����
            useTouch : true,            // boolean  
            // �������� free mode
            freeMode : false,           // boolean
            // momentum ( ���� )
            momentum : true,
            bounce : false,
                    
            // wrap Ŭ���� ����
            customWrap : '',            //String
            
            // ����¡ ��� ����
            paging : false,             // boolean
            pagingClass : '.paging',    // String
            pagingCurrentClass : 'on',  // String
            
            // �ؽ�Ʈ ����¡

            numberText : false,

            numberTextClass : '.numPaging',
            
            arrows : true,              // boolean
            nextArrow : '.btnNext',             // String
            prevArrow : '.btnPrev',             // String
            disabled : 'disabled',      // String
            
            // css3 ��� ����
            useCSS : true,              // Boolean
            
            // infinite mode - !freeMode && !variableWidth �϶��� ��� ����
            infinite : true,
            
            autoFocus : true,           // true���� ����, ������ư�� ���ٸ� false�� ��
            
            /*
            * callback
            */
            // �����̵� �ʱ�ȭ ��. �Լ� �μ��� �ڽ��� �޽��ϴ�.
            onInit : function(swiper) { },
            // ��ġ ����
            onTouchStart : function(swiper) {},
            // ��ġ �̵� ��
            onTouchMove : function(swiper) {},
            // ��ġ ������ ��
            onTouchEnd : function(swiper) {},
            // �����̵� �ִϸ��̼� ���� �ٷ� �� oldIndex : ���� currentIndex ��, newIndex : ���� ���õ� currentIndex ��
            onBeforeChange : function(swiper, oldIndex, newIndex) {},
            // �����̵� �ִϸ��̼� ���� ��
            onAfterChange : function(swiper, newIndex) {},
            // �������� ��ġ ���� ó������ �� ����
            onCheckStart : function(swiper) {},
            // �������� ��ġ ���� ������ ���� �� ����
            onCheckEnd : function(swiper) {},
            // ���� ��ư ���� ��
            onPrev : function(swiper) {},
            // ���� ��ư ���� ��
            onNext : function(swiper) {},
            // Ŭ�� �ݹ�
            onClick : function(e, swiper) {},
            // �������� �ݹ�
            onResize : function(swiper) {},
            // �������� �ݹ�
            onRefresh : function(swiper) {}
            
        };
        
        /**
        * �������� �÷�����
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
                
                onFocusEvent,           // 2017.01.07 ���ټ� �߰� ( ��Ŀ�� ���Խ� �̵�)
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
            �ʱ�ȭ
            */
            init = function() {

                swiper.settings = $.extend({}, defaults, opts);
                
                // CSS3 ��뿩�� üũ
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
                
                // infinite mode�� free mode�� �ƴ� ���� ��� ����
                swiper.settings.infinite = swiper.settings.infinite && !swiper.settings.freeMode && !swiper.settings.variableWidth;
                
                swiper.settings.easing = swiper.settings.freeMode ? swiper.settings.useCSS ? 'ease-out' : 'easeOutSine' : swiper.settings.easing;
                
                swiper.target = el;
                // �������� �������� �θ� ������Ʈ
                swiper.wrap = el.parent();
                /*
                * ���� wrap ���� (����¡�̳� ��ư Ŭ������ ã�� ����Ҷ� ���)
                */
                swiper.customWrap = swiper.settings.customWrap !== '' ? swiper.target.closest(swiper.settings.customWrap) : swiper.wrap;
                
                // �������� �������� �ڽ� ������Ʈ
                swiper.list = el.children();
                // �ڽ� ������Ʈ�� ��
                swiper.listLen = swiper.list.length;
                
                //console.log(swiper.listLen);
                // �̹���
                swiper.images = el.find('img');
                // �̹��� ��
                swiper.imageLen = swiper.images.length;
                // �̹��� ī��Ʈ
                swiper.imageCount = 0;
                    
                
                swiper.isMobile = (function () {
                    var UserAgent = navigator.userAgent;
                    
                    return !!(UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) !== null || UserAgent.match(/LG|SAMSUNG|Samsung/) !== null);
                }());
                
                // 2016.09.29 ��ġ �̺�Ʈ
                // swiper.touchEvent = swiper.isMobile ? ['touchstart', 'touchmove', 'touchend'] : ['mousedown', 'mousemove', 'mouseup'];                                               
                swiper.touchEvent = ['touchstart.swiper', 'touchmove.swiper', 'touchend.swiper'];                                               

                // ��ũ�� Ÿ�̸�
                swiper.scrollTimer = null;
                swiper.lock = false;

                swiper.working = false;
                
                swiper.target.off('click.swiper');
                swiper.target.on('click.swiper', 'a', function(e) {
                    // �ݹ� Ŭ�� �̺�Ʈ
                    swiper.settings.onClick(e, swiper);
                });
                
                // fixed �Ǵ� absolute�� ��� �θ� ���� el���� �����ϰ� ����Ǿ� width �� 100%�� ����
                if(swiper.wrap.css('position') === 'fixed' || swiper.wrap.css('position') === 'absolute') {
                    swiper.wrap.css('width', '100%');
                }

                // 2016.10.13 on Ŭ���� üũ�Ͽ� �ش� Ŭ������ currentIndex�� ����
                swiper.settings.currentIndex = swiper.list.filter('.' + swiper.settings.currentClass).index() === -1 ? 0 : swiper.list.filter('.' + swiper.settings.currentClass).index();
                /*
                swiper.list.filter('.' + swiper.settings.currentClass).index() === -1 ? (swiper.settings.infinite ? 1 : 0) : swiper.list.filter('.' + swiper.settings.currentClass).index()
                */

                /*
                * �������� ���ο� �̹����� ������ ���
                * �̹��� ��ü �ε� �� �Լ� ����
                * 2016.11.21
                * �̹��� hide �� �ε� �Ϸ�� show
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
            * ���� �Լ�
            */
            funcStart = function() {
                if(el.is(':hidden')) { el.show(); }
                // �ݹ� : �����̵� �ʱ�ȭ ��
                swiper.settings.onInit(swiper);
            
                if(el.children().is(':hidden')) { el.children().show(); }
                if(swiper.settings.infinite) { infiniteSetup(); }
                        
                cssSetup();
                    
                checkClass();               
                    
                if(swiper.settings.useTouch) { touchInit(); }
                if(swiper.settings.paging) { pagingSetup(); }
                if(swiper.settings.numberText) { numberTextSetup(); }
                if(swiper.settings.arrows) { arrowsSetup(); }
                
                // 2017.01.07 ���ټ� �߰� (focus ���Խ� �����̵� �̵�)
                 onFocusEvent();
                
                resizeSetup();  
            };
            
            /*
            * 2016.10.25
            * infinite mode �߰�
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
                
                // length �缳��
                swiper.listLen = swiper.list.length + 2;
                
                // 2016.10.13 on Ŭ���� üũ�Ͽ� �ش� Ŭ������ currentIndex�� ����
                swiper.settings.currentIndex = swiper.list.filter('.' + swiper.settings.currentClass).index() === -1 ? swiper.settings.infinite ? 1 : swiper.settings.currentIndex : swiper.list.filter('.' + swiper.settings.currentClass).index();
            };
                        
            /*
            * �⺻ ��Ÿ�� �¾�
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

                // 2017.01.04 Ư�� LG������ highlight-color �� �Ȳ����� ���� ���� (������� ��û)
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
                
                // 2016.10.14 index ����
                swiper.firstIndex = 0;
                swiper.lastIndex = el.children().length - 1;
                
                swiper.minValue = 0;
                swiper.maxValue = getMaxValue();    
                
                // ���̰� ������ �ʿ��� ���
                if(swiper.settings.autoHeight) {
                    el.css('overflow', 'hidden');
                    setTimeout(function() {
                        setHeight();
                    }, 0);
                }       
            },
            
            /*
            * paging �¾�
            */
            pagingSetup = function() {
                var pagingTxt = '';
                
                swiper.pagingWrap = swiper.customWrap.find(swiper.settings.pagingClass);
                
                if(swiper.listLen > 1){
                    
                    for(var i=0, len = swiper.list.length; i < len; i+=1) {
    
                        pagingTxt += '<span>' + (i+1) + '</span>'
                        // 2017.01.02 ���ټ� ���� (talkback, voiceover ���� �ε����������� �� �� ���� ������ �ƿ� ��Ŀ���� �Ȱ��� ���� ��û
                        //pagingTxt += '<span></span>'
                    }
                    
                    swiper.pagingWrap.attr('aria-hidden',true).html(pagingTxt);
                    
                    setCurrentPaging();
                } else {
                    swiper.pagingWrap.hide();
                }
            };
            
            /*
            * number paging �¾�
            */
            numberTextSetup = function() {
                var idx = swiper.settings.currentIndex+1,
                    len = swiper.listLen;
                
                swiper.numberTextWrap = swiper.customWrap.find(swiper.settings.numberTextClass);
                // 2016.10.14 infinite mode �߰�
                if(swiper.settings.infinite) {
                    idx = idx - 1;

                    len = len - 2;
                }
                
                swiper.numberTextWrap.html('<em>'+idx+'</em>' + ' / ' + len);
                
                // 2017.01.07 ���ټ� �߰�
                swiper.numberTextWrap.attr('role', 'text');
                swiper.numberTextWrap.attr('aria-label', '�� '+ len +'���� �����̵��� ' + idx +'��°');
            };
            
            /*
            * ���� & ���� ��ư �¾�
            */
            arrowsSetup = function() {
                swiper.nextButton = swiper.customWrap.find(swiper.settings.nextArrow);
                swiper.prevButton = swiper.customWrap.find(swiper.settings.prevArrow);
                
                swiper.nextButton.off('click.swipeNext');
                swiper.nextButton.on('click.swipeNext', function(e) {
                    e.preventDefault();             
                                            
                    // 2017.01.09 ���ټ� �߰� (freeMode���� ������ �����̵�� �Ѿ�� �ִϸ��̼��� ���� working Ǯ���� �ʴ� ���� ����)
                    if(0 === Math.abs(getTransform()[0]) && swiper.settings.freeMode) {                 
                        if(swiper.working) {
                            swiper.working = false;
                        }
                        
                        var index = swiper.settings.currentIndex + 1 > swiper.lastIndex ? swiper.lastIndex : swiper.settings.currentIndex + 1;
                        
                        // checkClass()���� ����ӵ� ���߱� ���� setTimeout �߰�
                        setTimeout(function() {
                            commonJs.goFocus(el.children().eq(index));
                        }, 100);
                    }                                       
                                        
                    if(!$(this).hasClass(swiper.settings.disabled) && !swiper.working){
                        el.nextSlide();
                        
                        // 2017.01.09 ���ټ� �߰� ( freeMode ��Ŀ�� �̵� )
                        if(swiper.settings.currentIndex === swiper.lastIndex && swiper.settings.freeMode) {                 
                            commonJs.goFocus(el.children().eq(swiper.settings.currentIndex));
                        } 
                    }
                });
                
                swiper.prevButton.off('click.swipePrev');
                swiper.prevButton.on('click.swipePrev', function(e){
                    e.preventDefault();
                        
                    // 2017.01.09 ���ټ� �߰� (freeMode���� ������ �����̵�� �Ѿ�� �ִϸ��̼��� ���� working Ǯ���� �ʴ� ���� ����)
                    if(Math.abs(getMaxValue()) === Math.abs(getTransform()[0]) && swiper.settings.freeMode) {                   
                        if(swiper.working) {
                            swiper.working = false;
                        }
                        
                        var index = swiper.settings.currentIndex - 1 < 0 ? 0 : swiper.settings.currentIndex - 1;

                        // checkClass()���� ����ӵ� ���߱� ���� setTimeout �߰�
                        setTimeout(function() {
                            commonJs.goFocus(el.children().eq(index));
                        }, 100);
                    
                    } 

                    if(!$(this).hasClass(swiper.settings.disabled) && !swiper.working){
                        el.prevSlide();
                        
                        // 2017.01.09 ���ټ� �߰� ( freeMode ��Ŀ�� �̵� )
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
            * �������� ���ο� ���ڵ�� ���� �� 
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
            * �������� Total Width
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
            * �������� get Max Value
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
            * �������� get Move Value
            */
            getMoveValue = function(idx) {

                var $wrap = swiper.wrap,
                    $list = el.children(),
                    getResult,
                    listWidth;
                    
                    
                if($list.length > 1) {
                    /* 
                    * infinite ����� ���� �ٷ� left �� get
                    * infinite ��尡 �ƴ� ���� index���� 0�� �ƴ� ��츸 left �� get
                    * bak 
                    * getResult = idx !== 0 ? -Math.round($list.eq(idx).position().left) : 0;
                    */
                    getResult = idx !== 0 ? -Math.round($list.eq(idx).position().left) : 0;
                    
                    // centerMoad�� true�� �� current target ��� ����
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
            * transform�� matrix���� ��ȯ
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
            * �����̵� set css (�ִϸ��̼� ����)
            * @param {Number} moveX �̵���ų value ��
            */
            setMoveCSS = function(moveX) {
                var x = moveX;
                
                // 2016.10.20 bounce �߰�
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
            * �����̵� set css (�ִϸ��̼� ����)
            * @param {Number} moveX �̵���ų value ��
            */
            setAnimCSS = function(moveX, duration, callback) {          
                // 2016.10.14 infinite mode �߰�
                if(swiper.settings.infinite) {
                    if(swiper.settings.currentIndex === swiper.firstIndex) {
                        swiper.settings.currentIndex = swiper.lastIndex -1;
                    } else if (swiper.settings.currentIndex === swiper.lastIndex) {
                        swiper.settings.currentIndex = swiper.firstIndex + 1;
                    }
                }
                
                // css3 ���� o
                if(swiper.settings.useCSS) {
                    el.css('-'+swiper.cssPrefix+'-transition', duration+'ms ' + swiper.settings.easing);
                    el.css(swiper.animProp, 'translate3d(' + moveX + 'px, 0px, 0px)');

                    el.unbind('webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd');
                    el.bind('webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd', function() {
                        swiper.working = false;
                        
                        // 2016.10.14 infinite mode �߰�
                        if(swiper.settings.infinite) {
                            swiper.moveValue = getMoveValue(swiper.settings.currentIndex);

                            setMoveCSS(swiper.moveValue);
                        }                       
                        
                        $(this).css('-'+swiper.cssPrefix+'-transition', '0ms');
                        
                        // �̵��� value �� ����
                        swiper.moveValue = moveX;
                        
                        // �ݹ� : �����̵� ���� �� 
                        swiper.settings.onAfterChange(swiper, convertIndex(swiper.settings.currentIndex));                  
                        
                        if(typeof callback === 'function') {
                            callback();
                        }
                        
                        // 2017.01.05 ���ټ� �߰� (����, ������ư�� �ִ� �����̵�� ���õ� ���������� ��Ŀ�� �̵�)
                        if(swiper.settings.arrows && swiper.nextButton.length > 0 && swiper.prevButton.length > 0 && swiper.settings.autoFocus) {
                            commonJs.goFocus(el.children().eq(swiper.settings.currentIndex));
                        }
                    });
                    
                // css3 ���� x
                } else {
                    el.stop().animate({
                        left: moveX+'px'
                    }, {
                        duration: duration,
                        easing: swiper.settings.easing,
                        complete : function() {
                            swiper.working = false;
                            
                            // 2016.10.14 infinite mode �߰�
                            if(swiper.settings.infinite) {
                                swiper.moveValue = getMoveValue(swiper.settings.currentIndex);
                                setMoveCSS(swiper.moveValue);
                            }
                            
                            // �̵��� value �� ����
                            swiper.moveValue = moveX;
                                                    
                            // �ݹ� : �����̵� ���� �� 
                            swiper.settings.onAfterChange(swiper, convertIndex(swiper.settings.currentIndex));
                            
                            if(typeof callback === 'function') {
                                callback();
                            }               
                            
                            // 2017.01.05 ���ټ� �߰� (����, ������ư�� �ִ� �����̵�� ���õ� ���������� ��Ŀ�� �̵�)
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
                // ���̰� ������ �ʿ��� ���
                if(swiper.settings.autoHeight) {
                    setHeight();
                }           
            };
            
            // paging active

            setCurrentPaging = function() {
                var settings = swiper.settings,
                    $pagingList = swiper.pagingWrap.children(),
                    idx = settings.currentIndex;
                                        
                // 2016.10.14 infinite mode �߰�
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
                
                // 2016.10.14 infinite mode �߰�
                if(swiper.settings.infinite) {
                    idx = idx - 1;
                    len = len - 2;
                }
                                            
                swiper.numberTextWrap.html('<em>'+idx+'</em>' + ' / ' + len);
                
                // 2017.01.07 ���ټ� �߰�
                swiper.numberTextWrap.attr('aria-label', '�� '+ len +'���� �����̵��� ' + idx +'��°');
            };
            
            // Ŭ���� �� ����
            checkClass = function() {

                var $list = el.children(),
                    idx = swiper.settings.currentIndex;



                // 2016.10.14 infinite mode �߰�
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
            
            // ���� or ���� ��ư üũ
            checkArrow = function() {
                var settings = swiper.settings,
                    
                    // 2017.01.04 ���ټ� �߰� �ϴܰ� ����
                    $list = el.children(),
                    idx = swiper.settings.currentIndex;
                
                if(settings.currentIndex === swiper.firstIndex) {
                    swiper.prevButton.addClass(settings.disabled);
                    
                    // 2017.01.07 ���ټ� �߰� (��ư disabled Ŭ���� �߰��� ���� ����);
                    swiper.prevButton.attr('aria-hidden', 'true');
                } else {
                    swiper.prevButton.removeClass(settings.disabled);
                    
                    // 2017.01.07 ���ټ� �߰� (��ư disabled Ŭ���� �߰��� ���� ����);
                    swiper.prevButton.attr('aria-hidden', 'false');
                }
                
                if(settings.currentIndex === swiper.lastIndex) {
                    swiper.nextButton.addClass(settings.disabled);
                    
                    // 2017.01.07 ���ټ� �߰� (��ư disabled Ŭ���� �߰��� ���� ����);
                    swiper.nextButton.attr('aria-hidden', 'true');
                } else {
                    swiper.nextButton.removeClass(settings.disabled);
                    
                    // 2017.01.07 ���ټ� �߰� (��ư disabled Ŭ���� �߰��� ���� ����);
                    swiper.nextButton.attr('aria-hidden', 'false');
                }
                
                // 2017.01.04 ���ټ� �߰� (����, ������ư�� �ִ� �����̵��� ���� active�� item �ܿ� �������� aria-hidden = false�� ��Ŀ�� �̵� ����)
                if(swiper.settings.arrows && swiper.nextButton.length > 0 && swiper.prevButton.length > 0) {
                    $list.eq(idx).siblings().removeClass(swiper.settings.currentClass).attr('aria-hidden', true);
                    $list.eq(idx).addClass(swiper.settings.currentClass).attr('aria-hidden', false);

                    setTimeout(function() {
                        var visibility = $list.eq(idx).css('backface-visibility') == 'visible' ? 'hidden' : 'visible';
                        $list.eq(idx).css({webkitBackfaceVisibility: visibility})
                    }, 500)
                    
                    // 2017.01.05 ���ټ� �߰� (����, ������ư ���ټ� �ؽ�Ʈ)
                    swiper.nextButton.attr('role', 'button');
                    swiper.prevButton.attr('role', 'button');
                    
                    swiper.nextButton.attr('aria-label', '����');
                    swiper.prevButton.attr('aria-label', '����');
                }

                // ���������� ����Ʈ ������ ���ų� 1�� �̻��� �ƴҰ��
                if(!el.children().length || el.children().length <= 1) {
                    swiper.nextButton.hide();
                    swiper.prevButton.hide();
                } else {
                    swiper.nextButton.show();
                    swiper.prevButton.show();               
                }
            };
            
            // ��ũ�� üũ
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
            * Ŭ�и�� index �� ��ȯ �Լ�
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
            
            // ��ġ ����
            touchStart = function(e) {
                // e.stopPropagation();
                
                var orig = e.originalEvent,
                    point = (typeof orig.changedTouches !== 'undefined') ? orig.changedTouches : [orig];

                swiper.touch.moved = false;
                swiper.touch.distX = 0;
                swiper.touch.distY = 0;
                swiper.touch.directionX = 0;
                swiper.touch.directionY = 0;
                
                // scroll Type üũ
                swiper.touch.swipeLocked = 0;
                
                swiper.touch.startTime = new Date().getTime();
                
                if(swiper.settings.freeMove && swiper.settings.momentum && swiper.touch.isInTransition) {
                    swiper.touch.isInTransition = false;
                    pos = getTransform()[0];
                    setMoveCSS(Math.round(pos));    
                    
                // �⺻ �������� ���           
                } else {
                    pos = getTransform()[0];
                    if(pos === swiper.moveValue){
                        swiper.working = false;
                    }
                }
                
                // position ����
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
            
            // ��ġ �̵�
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
                
                // ����
                if( timestamp - swiper.touch.endTime > 150 && (absDistX < 10 && absDistY < 10)) {
                    return;
                }
                
                // swipe
                if(!swiper.touch.swipeLocked) {
                    // y ��ũ�� ����
                    if(absDistX > absDistY + swiper.touch.swipeLockThreshold) {
                        swiper.touch.swipeLocked = 'v';
                    
                    // x ��ũ�� ����
                    } else if ( absDistY >= absDistX + swiper.touch.swipeLockThreshold) {
                        swiper.touch.swipeLocked = 'h';
                        
                    // ���� ����
                    } else {
                        swiper.touch.swipeLocked = 'n';
                    }
                }
                
                // ���� ��ũ�� lock
                if(swiper.touch.swipeLocked === 'v') {
                    e.preventDefault();
                    
                    // �������� ���� �� ��ũ�ѹ� ��� disabled
                    if(!swiper.touch.scrollLock && !swiper.lock) { swiper.touch.scrollLock = true; }
                    if(swiper.settings.freeMode){
                        deltaX = deltaX;                
                        newX = swiper.moveValue + deltaX;
                        
                        
                        // �̵� �� ���?
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
                // ���� ��ũ�� lock
                } else if ( swiper.touch.swipeLocked === 'h') {
                    // code
                }           
                
                swiper.settings.onTouchMove(swiper);
            };
            
            // ��ġ ��
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
                
                // freeMode�� �������� ���� �� �⺻ �����̵�
                } else if(!swiper.settings.freeMode) {
                    
                    // momentum �� freeMode�� �������� ���� ��
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
                
                // �������� ���� �� ��ũ�ѹ� ��� disabled
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

                // �ݹ� : �����̵� ���� ��
                swiper.settings.onBeforeChange(swiper, convertIndex(swiper.settings.currentIndex), convertIndex(index));
                
                // ���� �� ����              
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
            * slideTo�� �����ϳ� animation ����
            *
            */
            el.currentTo = function(index) {

                if(index < swiper.firstIndex || index > swiper.lastIndex) {
                    return false;
                }
                
                // �ݹ� : �����̵� ���� ��
                swiper.settings.onBeforeChange(swiper, convertIndex(swiper.settings.currentIndex), convertIndex(index));

                // ���� �� ����              
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
                    
                    // 2017.01.09 ���ټ� �߰�(freeMode ����. anim�� ���� ���� working ��ȭ����)
                    if(getMoveValue(index) !== getTransform()[0]){
                        swiper.working = true;
                    }
                    
                    el.slideTo(index);
                            
                    // �ݹ� : nextSlide ���� ��
                    swiper.settings.onNext(swiper);
                }
            };
            
            el.prevSlide = function() {
                var index = swiper.settings.currentIndex - 1;

                if(index >= swiper.firstIndex) {

                    
                    // 2017.01.09 ���ټ� �߰�(freeMode ����. anim�� ���� ���� working ��ȭ����)
                    if(getMoveValue(index) !== getTransform()[0]){
                        swiper.working = true;
                    }
                    
                    el.slideTo(index);
    
                    // �ݹ� : nextSlide ���� ��
                    swiper.settings.onPrev(swiper); 
                }
            };
            
            /**
            * ���� currentIndex�� get (infinite mode�� true�϶��� -1)
            */
            el.getCurrentIndex = function() {

                return convertIndex(swiper.settings.currentIndex);
            };
            
            /**
            * swiper ���ʱ�ȭ
            */
            el.reInit = function() {
                el.children('.clone').remove();
                
                init();
            };
            
            el.refresh = function() {
                // �������� �������� �ڽ� ������Ʈ
                swiper.list = el.children();
                // �ڽ� ������Ʈ�� ��
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
    * ���ڵ��
    * @param {Object} opts �ɼ� ��ü
    * @param {String} opts.toggleWrap ��ư�� �並 ���δ� wrap Ŭ����
    * @param {String} opts.btnClass ��ư Ÿ�� ex) '> li > a' or '.btnClass'
    * @param {String} opts.viewClass Ÿ�� ex) '.toggleView'
    * @param {String} opts.currentClass activeClass�� ����
    * @param {String} opts.lazyOpenClass �޼���� ���� ������ class ���� (�ش� ��ư Ŭ���� 'toggleLazyOpen'���� trigger �̺�Ʈ �߻�)
    * @param {String} opts.defaultOpen ����Ʈ�� ���½�ų Ŭ������ ����
    * @param {Boolean} opts.changeText ��ư �ؽ�Ʈ ���� �Ҹ� ��
    * @param {String} opts.openText ���� �� ��ư �ؽ�Ʈ
    * @param {String} opts.closeText �ݱ� �� ��ư �ؽ�Ʈ
    * @param {String} opts.duration �ӵ�
    * @param {String} opts.easing easing
    
    *
    * // �ݹ�
    * @param opts.onInit �÷����� �ʱ�ȭ�� �̺�Ʈ
    * @param opts.onBeforeOpen ��� open �� �̺�Ʈ
    * @param opts.onAfterOpen ��� open �� �̺�Ʈ
    * @param opts.onAfterClose ��� close �� �̺�Ʈ
    *
    * @method openList(index) index���� �ش��ϴ� ����Ʈ ����
    * @method closeList(index) index���� �ش��ϴ� ����Ʈ �ݱ�
    * @method openAll() ��ü ����Ʈ ����
    * @method closeAll() ��ü ����Ʈ �ݱ�
    * @method currentOpen(index) openList�� ������ �ִϸ��̼� ����
    
    * @example
    * ���ڵ�� �Լ� ����
    * var arcodi = $('.arcodi').commonAccordion(opts);
    * // ù��° ����Ʈ ����
    * arcodi.openList(0);
    * // ù��° ����Ʈ ���� (�ִϸ��̼� ����)
    * arcodi.currentOpen(0);
    * // ù��° ����Ʈ �ݱ�
    * arcodi.closeList(0);
    * // ��ü �ݱ�
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

            
            // �ؽ�Ʈ ���� ����
            changeText : false, // Boolean
            openText : '',
            closeText : '',
            
            duration : 'fast',
            easing: '',
            
            // �ݹ� ���� �� �̺�Ʈ
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
            * �ʱ�ȭ
            */
            init = function() {
                arcodian.settings = $.extend({}, defaults, opts);
                
                // 2016.11.29 �߰�
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
                
                // 2017.01.02 ���ټ� �߰� ( �������� ��� title = "����")
                arcodian.btnElem.attr('title', '����');
                arcodian.btnElem.attr('role', 'button');
                arcodian.btnElem.each(function() {
                    $(this).attr('aria-label', $(this).text());
                });
                
                // .defaultOpen ���� �� ���ڵ�� ���� ����
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
                
                // 2016.10.10 ���ڵ�� ��� Ŭ���� ���� ������Ʈ ������ �� ���� 
                // closeSiblings(idx);
                if(!$target.hasClass('disabled')) {
                    // class üũ �� open �̺�Ʈ;
                    if($targetLi.hasClass(arcodian.settings.currentClass)) {
                        closeList(idx);
                    } else {
                        // 2016.10.31 lazyOpenClass�� ���� �� �⺻ �̺�Ʈ ����
                        if(!$target.hasClass(arcodian.settings.lazyOpenClass)){

                            openList(idx);
                        } else {
                            $target.trigger('toggleLazyOpen', [el, idx]);
                        }
                    }
                }
                    
                // contents offset Top ������ ��ũ�� �̵�
                // commonJs.util.contentsTop($target);
            };
            
            /*
            * ����Ʈ ����
            */
            openList = function(idx) {
                var $list = arcodian.list.eq(idx),
                    $view = $list.find(arcodian.settings.viewClass);
                
                // ���� �� �ݹ�
                arcodian.settings.onBeforeOpen(arcodian, idx);
                
                $list.addClass(arcodian.settings.currentClass);
                
                $view.hide();

                $view.stop(true, false).slideToggle({
                    duration: arcodian.settings.duration,
                    easing : arcodian.settings.easing,
                    complete : function() {
                        // ���� �� �ݹ�
                        arcodian.settings.onAfterOpen(arcodian, idx);
                    }
                });
                
                // �ؽ�Ʈ ����               
                if(arcodian.settings.changeText){
                    $list.find(arcodian.settings.btnClass).text(arcodian.settings.openText);
                }
                
                // 2016.10.26 ���߰��� trigger �̺�Ʈ �߰�
                $view.trigger('toggleCont', ['open']);
                
                $list.find(arcodian.settings.btnClass).attr('title', '������');
            };
            
            /*
            * ���õ� ����Ʈ ���� ( �ִϸ��̼� x )
            */
            currentOpen = function(idx) {
                var $list = arcodian.list.eq(idx);
                
                // ���� �� �ݹ�
                arcodian.settings.onBeforeOpen(arcodian, idx);
                
                $list.addClass(arcodian.settings.currentClass);

                $list.find(arcodian.settings.viewClass).show();
                
                arcodian.settings.onAfterOpen(arcodian, idx);
                
                // �ؽ�Ʈ ����               
                if(arcodian.settings.changeText){
                    $list.find(arcodian.settings.btnClass).text(arcodian.settings.openText);
                }
                
                $list.find(arcodian.settings.btnClass).attr('title', '������');
            }
            
            /*
            * ����Ʈ �ݱ�
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
                        // Ŭ���� �� �ݹ�
                        arcodian.settings.onAfterClose(arcodian, idx);
                    }
                });
                
                // �ؽ�Ʈ ����               
                if(arcodian.settings.changeText){
                    $list.find(arcodian.settings.btnClass).text(arcodian.settings.closeText);
                }
                
                // 2016.10.26 ���߰��� trigger �̺�Ʈ �߰�
                $view.trigger('toggleCont', ['close']);
                
                $list.find(arcodian.settings.btnClass).attr('title', '����');
            };
            
            /*
            * 2016.10.10 ��� Ŭ���� ���� ������Ʈ �ݱ�
            * ���� ����Ʈ �ݱ�
            */
            closeSiblings = function(idx) {
                var $listSiblings = arcodian.list.eq(idx).siblings();
                
                // ���� ������Ʈ hide
                $listSiblings.removeClass(arcodian.settings.currentClass);
                $listSiblings.find(arcodian.settings.viewClass).stop(true, false).slideToggle({
                    duration: arcodian.settings.duration,
                    easing : arcodian.settings.easing,
                    complete : function() {
                    }
                });

                // �ؽ�Ʈ ����               
                if(arcodian.settings.changeText){
                    $listSiblings.find(arcodian.settings.btnClass).text(arcodian.settings.closeText);
                }
                
                $listSiblings.find(arcodian.settings.btnClass).attr('title', '����');
            };
            
            /*
            * ��ü ����Ʈ ����
            */
            openAll = function() {
                var $list = arcodian.list;
                
                // ���� �� �ݹ�
                arcodian.settings.onBeforeOpen(arcodian);
                
                $list.addClass(arcodian.settings.currentClass);
                $list.find(arcodian.settings.viewClass).show();
                
                arcodian.settings.onAfterOpen(arcodian);
                
                // console.log(arcodian.list);
                // �ؽ�Ʈ ����               
                if(arcodian.settings.changeText){
                    $list.find(arcodian.settings.btnClass).text(arcodian.settings.openText);
                }
                
                $list.find(arcodian.settings.btnClass).attr('title', '������')
            };
            
            /*
            * ��ü ����Ʈ �ݱ�
            */
            closeAll = function() {
                var $list = arcodian.list;
                
                $list.removeClass(arcodian.settings.currentClass);
                $list.find(arcodian.settings.viewClass).hide();
                
                // �ؽ�Ʈ ����               
                if(arcodian.settings.changeText){
                    $list.find(arcodian.settings.btnClass).text(arcodian.settings.closeText);
                }
                
                $list.find(arcodian.settings.btnClass).attr('title', '����')
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
            * �ش��ϴ� index�� ����Ʈ open
            * @param {Number} idx index value
            * @example
            * // ù��° ����Ʈ ����
            * el.openList(0);
            */
            el.openList = function(idx) {
                //closeSiblings(idx);
                openList(idx);
            };
            
            /**
            * �ش��ϴ� index�� ����Ʈ close
            * @param {Number} idx index value
            * @example
            * // ù��° ����Ʈ �ݱ�
            * el.closeList(0);
            */
            el.closeList = function(idx) {
                closeSiblings(idx);
                closeList(idx);
            };
            
            /*
            * ����Ʈ ��ü ����
            */
            el.openAll = function() {
                openAll();
            };
            
            /**
            * ����Ʈ ��ü �ݱ�
            */
            el.closeAll = function() {
                closeAll();
            };
            
            /**
            * index �� get
            */
            el.getCurrentIndex = function() {
                var getIndex = swiper.settings.currentIndex;
                if(swiper.settings.infinite) {
                    getIndex -= 1
                }
                
                return getIndex;
            };
            
            /**
            * ����Ʈ open (�ִϸ��̼� x)
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
        * ���� ��Ʈ
        * @example
        * <div id="pie"><canvas></canvas></div>
        * var data = [ { name: '�Ƿ�', value : 50000 } ];
        *
        * // ��Ʈ �÷����� ����
        * var pieChart = $('#pie').pieChart();
        *
        * // ��Ʈ ������ �Է�
        * pieChart.pieChartSetup(data);
        * 
        * // ��Ʈ ���
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
                
                // �޸�
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
                // spider ���ε��
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
                        context.arc(tx, ty, radius, degreesToRadians(startPurc[i]), degreesToRadians(endPurc[i] - 1), false); // -1�� ���ϴ� ���� 1�� ���
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
                
                // �ִϸ��̼� ����
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
                
                // total �� ��� �� ������ ���� ���
                var setup = function() {

                    var $dataUl = el.siblings('.graphInfo'),
                        $div = $('<div />');
                    
                    // total �� ���
                    for(var t = 0, len = arr.length; t < len; t++){
                        total += parseInt(arr[t].value, 10);
                    }
                    
                    // ������ ���� ���
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
                    
                    // data �� ����
                    for(var g = 0, len =arr.length; g < len; g++) {
                        var curPerc = (arr[g].value / total) * 360;
                        
                        startPurc[g] = Math.floor(plus);
                        endPurc[g] = plus + curPerc;
                        
                        plus = endPurc[g];
                    }
                };
                
                el.pieChartSetup = function(pieData) {
                    // data ����
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
        * ���� ��Ʈ
        * @example
        * var data = [ { month: '8��', value : 2500000 } ];
        *
        * // ��Ʈ �÷����� ����
        * var barChart = $('.barGraph').barChart();
        *

        * // ��Ʈ ������ �Է�
        * barChart.barChartSetup(data);
        * 
        * // ��Ʈ ���
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
                    
                // data �� ����
                for(var i=0; i < dataLen; i++) {
                    var $li = $('<li />'),
                        $strong = $('<strong />'),
                        $pattern = $('<span class="ptn' + (i+1) + '" />'),
                        $value = $('<em />');
                    
                    $strong.text(arr[i].month);
                    $strong.prepend($pattern)
                    $value.text(comma(arr[i].value)+'��');
                    $li.append($strong);
                    $li.append($value);
                    $div.append($li);
                    
                    valueArr[i] = arr[i].value; 
                }
                
                $data.html($div.html());
                
                /*
                * ���⼭���� ���� �׷��� ����
                */
                // max �� get
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
                    $bar.text(comma(arr[g].value)+'��');
                    
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

  //이벤트 리스트 토글 UI
  $('.pushEvent .toggleUI').on('click',function(e) {
    e.preventDefault();
    var $this = $(this);
    
    setTimeout(function() {
      $this.toggleClass('up');
    }, 400)

    var move_num = $('.pushEvent').outerHeight() - 56;

    if($(this).hasClass('up')) {
      //하단 이벤트 영역 슬라이드업
      $('.pushEvent').css({webkitTransform: 'translate3d(0, -' + move_num + 'px, 0)',transition: 'all 500ms cubic-bezier(0.250, 0.250, 0.540, 0.930)'})
      $('.dim').fadeIn().closest('body').css({overflow:'hidden'});
    } else {
      //하단 이벤트 영역 슬라이드다운
      $('.pushEvent').css({webkitTransform: 'translate3d(0, 0, 0)',transition: 'all 500ms cubic-bezier(0.250, 0.250, 0.540, 0.930)'})
      $('.dim').fadeOut().closest('body').css({overflow:'auto'});;
    }
  });
  
  //하단 이벤트 영역 초기 세팅
  $('.puchEventCont .eventList').css({height: $(window).outerHeight() - 281}).closest('.pushEvent').css({bottom: ($('.pushEvent').outerHeight() - 56) * -1})

  //삭제버튼 클릭 시 UI
  $('.delete').on('click', function() {
    $('.pushArea').addClass('delete');
  });

  //상단 삭제 탭 닫을 때 UI
  $('.pushDelete .close').on('click', function() {
    $('.pushArea').removeClass('delete');
  });