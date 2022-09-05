/*!
*
*/
import $ from 'jquery'

$.guide = function (options) {
    var defaults = {
        selector: '',  //
        content: '',  //
        align: 'top', // center, right,
        offset: {
            x: 0,
            y: 0
        }
    };

    // 判断是否有引导的参数，并且该参数是数组
    if (!options || !$.isArray(options)) {
        return;
    }

    // 获取某个元素
    var elGuide = $('#guideOverlap');               // 镂空的元素，自带半透明阴影
    var elGuideBg = $('#guideYabBg');               // 镂空蒙版底层透明挡板

    // 第几页
    var start = 0;

    // 移除引导元素
    var remove = function () {
        // 标记存cookie
        localStorage.setItem('isGuide', 'true');

        // 移除视图
        elGuide.remove();
        elGuideBg.remove();

        // 移除监听
        $(document).off('keydown.guide');
        $(window).off('resize.guide');
    };

    // 创建引导信息的视图
    var createGuidePrompt = function (options, currentData) {
        var elGuideContent = $('<div></div>').css({
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            position: 'relative',
            overflow: 'hidden'
        });

        // 标题和关闭按钮的盒子
        var elFirstBox = $('<div></div>').css({
            width: '100%',
            height: '17px',
            lineHeight: '17px',
            backgroundColor: 'transparent',
            position: 'relative',
            top: '9px'
        });
        elGuideContent.append(elFirstBox);

        // 关闭按钮
        var elCloseButton = $('<div>x</div>').css({
            width: '15px',
            height: '15px',
            lineHeight: '15px',
            color: '#CED7E2',
            position: 'absolute',
            fontSize: '18px',
            textAlign: 'center',
            cursor: 'pointer',
            right: '5px'
        });
        elCloseButton.on('click', function () {
            remove();
        });

        // 标题
        var elTitle = $('<div></div>').css({
            width: '100%',
            height: '17px',
            lineHeight: '17px',
            boxSizing: 'border-box',
            paddingRight: '35px',
            marginLeft: '10px',
            color: '#1F2D3D',
            fontSize: '12px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        }).append(currentData.title);
        elFirstBox.append(elCloseButton);
        elFirstBox.append(elTitle);

        // 内容
        var elContent = $('<div></div>').css({
            width: '100%',
            height: '34px',
            lineHeight: '17px',
            boxSizing: 'border-box',
            paddingRight: '20px',
            color: '#475669',
            fontSize: '12px',
            position: 'absolute',
            top: '36px',
            left: '10px',
            display: '-webkit-box',
            webkitBoxOrient: 'vertical',
            webkitLineClamp: '2',
            overflow: 'hidden'
        }).append(currentData.content);
        elGuideContent.append(elContent);

        // 脚部div
        var elFootView = $('<div></div>').css({
            width: '100%',
            height: '17px',
            lineHeight: '17px',
            boxSizing: 'border-box',
            paddingRight: '20px',
            backgroundColor: 'transparent',
            position: 'absolute',
            bottom: '5px',
            left: '10px'
        });
        elGuideContent.append(elFootView);

        // 步骤page
        var pagetion = $('<div></div>').css({
            width: '100%',
            height: '17px',
            boxSizing: 'border-box',
            paddingRight: '50px',
            backgroundColor: 'transparent',
            position: 'relative',
            overflow: 'hidden'
        });
        elFootView.append(pagetion);

        for (var i = 0; i < options.length; i++) {
            var currentLeft = 12 * i + 'px';
            var currentColor = (i === currentData.pageNum) ? '#0098FC' : '#CED7E2';
            var pageOne = $('<div></div>').css({
                width: '4px',
                height: '4px',
                borderRadius: '3px',
                border: '1px solid #CED7E2',
                position: 'absolute',
                bottom: '0',
                left: currentLeft,
                borderColor: currentColor
            });
            pagetion.append(pageOne);
        }

        // 下一步按钮
        var currentButtonTitle = (currentData.pageNum === options.length - 1) ?'立刻使用' : '下一步';
        var elNextButton = $('<div></div>').css({
            width: '80px',
            height: '17px',
            lineHeight: '17px',
            color: '#0098FC',
            fontSize: '12px',
            textAlign: 'right',
            position: 'absolute',
            bottom: '0',
            right: '20px',
            cursor: 'pointer'
        }).append(currentButtonTitle);
        elNextButton.on('click', function () {
            // 下一步
            if (currentData.pageNum !== options.length - 1) {
                // 下一步
                goto(1);
            }else {
                // 关闭
                remove();
            }
        });
        elFootView.append(elNextButton);

        return elGuideContent;
    };

    var goto = function (change) {
        start = start + change;
        if (start < 0) {
            start = 0;
        }
        if (!options[start]) {
            remove();
            return;
        }

        var data = $.extend({}, defaults, options[start]);

        var classNum = data.classNum >= 0 ? data.classNum : 0;
        var elTrigger = $(data.selector).eq(classNum);
        if (elTrigger.length === 0 && change) {
            goto(change);
            return;
        }

        // 清空蒙版上的引导元素
        elGuide.empty();
        // 宽高
        elGuide.css({
            width: elTrigger.outerWidth() + 10,
            height: elTrigger.outerHeight() + 10,
            left: elTrigger.offset().left - 5,
            top: elTrigger.offset().top - 5
        });

        // 引导提示的背景白
        var elGuideContentBg = $('<div></div>').css({
            display: 'none',
            position: 'absolute',
            backgroundColor: '#ffffff',
            width: '290px',
            height: '110px'
        });

        // 内容视图
        var elGuideContent = createGuidePrompt(options, data);
        elGuideContentBg.append(elGuideContent);

        elGuide.append(elGuideContentBg);

        // 提示框在镂空元素的何处位置
        var bgTopVal = elTrigger.outerHeight() + 20;
        var bgLeftVal = 0 - elGuideContentBg.outerWidth() / 2.0 + (elTrigger.outerWidth() + 10) / 2.0;
        if ((elTrigger.offset().top + elTrigger.outerHeight() + 10 + elGuideContentBg.outerHeight() + 10) > document.documentElement.clientHeight) {
            // 超过屏幕高度，放置镂空元素上方
            bgTopVal = 0 - 10 - elGuideContentBg.outerHeight();
        }

        if ((elTrigger.offset().left - elGuideContentBg.outerWidth() / 2.0) < 0) {
            bgLeftVal = 0 - elTrigger.offset().left;
        }else if ((elTrigger.offset().left - (elGuideContentBg.outerWidth() - elTrigger.outerWidth()) / 2.0 + elGuideContentBg.outerWidth()) > document.documentElement.clientWidth) {
            bgLeftVal = (document.documentElement.clientWidth - elTrigger.offset().left - elGuideContentBg.outerWidth());
        }

        elGuideContentBg.css({
            top: bgTopVal,
            left: bgLeftVal
        });

        // 如果参数指定显示位置
        if (data.yabAlign === 'left') {    // 居左
            var newTop = (0 - elGuideContentBg.outerHeight() / 2.0 + (elTrigger.outerHeight() + 10) / 2.0);
            if (elTrigger.offset().top - newTop + elTrigger.outerHeight() + 10 > document.documentElement.clientHeight) {
                newTop = newTop - (elTrigger.offset().top - newTop + elTrigger.outerHeight() - document.documentElement.clientHeight);
            }else if (elTrigger.offset().top + newTop < 0) {
                newTop = 0 - newTop - elGuide.offset().top;
            }
            elGuideContentBg.css({
                left: -elGuideContentBg.outerWidth() - 10,
                top: newTop
            });
        } else if (data.yabAlign === 'right') {    // 居右
            newTop = (0 - elGuideContentBg.outerHeight() / 2.0 + (elTrigger.outerHeight() + 10) / 2.0);
            if (elTrigger.offset().top - newTop + elTrigger.outerHeight() + 10 > document.documentElement.clientHeight) {
                newTop = newTop - (elTrigger.offset().top - newTop + elTrigger.outerHeight() - document.documentElement.clientHeight);
            }else if (elTrigger.offset().top + newTop < 0) {
                newTop = 0 - newTop - elGuide.offset().top;
            }
            elGuideContentBg.css({
                left: elTrigger.outerWidth() + 20,
                top: newTop
            });
        } else if(data.yabAlign === 'top') {  // 居上
            var newLeft = 0 - elGuideContentBg.outerWidth() / 2.0 + (elTrigger.outerWidth() + 10) / 2.0;
            if ((elTrigger.offset().left - 5 - elGuideContentBg.outerWidth() / 2.0) < 0) {
                newLeft = 0 - elTrigger.offset().left;
            }else if ((elTrigger.offset().left - 5 - (elGuideContentBg.outerWidth() - elTrigger.outerWidth()) / 2.0) > document.documentElement.clientWidth) {
                newLeft = document.documentElement.clientWidth - (elTrigger.offset().left - 5 - elGuideContentBg.outerWidth() / 2.0);
            }
            elGuideContentBg.css({
                top: 0 - 10 - elGuideContentBg.outerHeight(),
                left: newLeft
            });
        }else if(data.yabAlign === 'bottom') {  // 居下
            newLeft = 0 - elGuideContentBg.outerWidth() / 2.0 + (elTrigger.outerWidth() + 10) / 2.0;
            if ((elTrigger.offset().left - 5 - elGuideContentBg.outerWidth() / 2.0) < 0) {
                newLeft = 0 - elTrigger.offset().left;
            }else if ((elTrigger.offset().left - 5 - (elGuideContentBg.outerWidth() - elTrigger.outerWidth()) / 2.0) > document.documentElement.clientWidth) {
                newLeft = document.documentElement.clientWidth - (elTrigger.offset().left - 5 - elGuideContentBg.outerWidth() / 2.0);
            }
            elGuideContentBg.css({
                top: elTrigger.outerHeight() + 20,
                left: newLeft
            });
        }

        setTimeout(function () {
            elGuideContentBg.show();
        }, history.pushState ? 100 : 0);
    };

    // 透明挡板
    elGuideBg = $('<div id="guideYabBg"></div>').css({
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        position: 'absolute',
        left: '0',
        top: '0'
    });

    // 蒙版
    elGuide = $('<div id="guideOverlap"></div>').css({
        position: 'absolute',
        transition: 'all .3s',
        boxShadow: '0 0 0 9999px rgba(0,0,0,.75)',
        zIndex: 100
    });

    if (![].map) {
        // IE8之前的版本蒙版半透明
        elGuide.css('outline', '9999px solid #000').css('filter', 'alpha(opacity=75)');
    }

    $(document.body).append(elGuideBg);
    $(document.body).append(elGuide);

    // 上、下、左、右、esc键触发事件
    $(document).on('keydown.guide', function (event) {
        var keycode = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            27: 'esc'
        };

        switch (keycode[event.keyCode]) {
            case 'esc':
                remove();
                break;
            case 'up':
            case 'left':
                goto(-1);
                event.preventDefault();
                break;
            case 'right':
            case 'down':
                goto(1);
                event.preventDefault();
                break;

        }
    });

    $(window).on('resize.guide', function () {
        goto(0);
    });

    goto(0);
};
