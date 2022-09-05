import './Guide';
import $ from 'jquery'

/*
 * @data Array类型，里面包括着每一步引导页需要的属性对象,下面会列举每一步骤对象需要的参数属性
 * @localStorageKey  String类型，完成引导后存localStorage标识，以后不再引导
 *
 * 每个引导步骤需要的Object参数属性
 *  @selector   需要定位的元素id或者class
 *  @classNum   选填参数，如果多个class，指定第几个class，默认为0
 *  @yabAlign   选填参数，提示框位置显示在元素的什么位置 (left, right, top, bottom)
 *  @title      提示框的标题内容
 *  @content    提示框的内容
 *
 * */

var CommonGuide = function(data, localStorageKey) {
    // 遍历生成新的数据源
    var isShowGuidePage =  localStorage.getItem('isGuide')
    if (isShowGuidePage === 'true' && !(data.length > 0)) return;     // 已显示过引导页,或者引导页数没有
    // 已有在显示的引导页，就不在叠加显示了
    if (document.getElementById('guideOverlap') !== null || document.getElementById('guideYabBg') !== null) return;

    var pageIndex = 0;
    data.every(item => {
        item.pageNum = pageIndex;
        item.localStorageKey = localStorageKey;
        pageIndex += 1;
        return true;
    });

    setTimeout(() => {
        $.guide(data);
    }, 50);
};

export {CommonGuide};
