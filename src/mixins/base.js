import wepy from 'wepy'

export default class baseMixin extends wepy.mixin {
  /**
   * [公共方法]
   * @param  {[type]}  item [description]
   * @return {Boolean}      [description]
   */
  noop() {
    return null;
  }
  hasOwn(obj, type) {
    return Object.prototype.hasOwnProperty.call(obj, type);
  }

  /**
   * [isXXX 基础方法]
   * @param  {[type]}  item [description]
   * @return {Boolean}      [description]
   */
  isUndefined(item) {
    return typeof item === 'undefined';
  }
  isDefined(item) {
    return !this.isUndefined(item);
  }
  isString(item) {
    return typeof item === 'string';
  }
  isNumber(item) {
    return typeof item === 'number';
  }
  isArray(item) {
    return Object.prototype.toString.apply(item) === '[object Array]';
  }
  isObject(item) {
    return typeof item === 'object' && !this.isArray(item);
  }
  isFunction(item) {
    return typeof item === 'function';
  }

  /**
   * [getXXX 增强方法]
   * @param  {[type]}  item [description]
   * @return {Boolean}      [description]
   */
  getString(item, defaultStr) {
    if (this.isString(item)) return item.trim();
    if (this.isNumber(item)) return `${item}`.trim();
    return defaultStr || '';
  }
  getNumber(item, defaultNum) {
    var matches = this.getString(item).match(/\d+/);
    return this.isNumber(matches && +matches[0]) ? +matches[0] : defaultNum;
  }
  getArray(item, defaultArr) {
    return this.isArray(item) ? item : (defaultArr || []);
  }
  getObject(item, defaultObj) {
    return this.isObject(item) ? item : (defaultObj || {});
  }
  getFunction(item) {
    return this.isFunction(item) ? item : noop;
  }

  /**
   * [JSON方法]
   * @param  {[type]}  item [description]
   * @return {Boolean}      [description]
   */
  $json(item) {
    let str = {type: Object.prototype.toString.call(item)}
    try {
      str = JSON.stringify(item)
    } catch (e) {
      str.error = e && e.stack || ''
    }
    return this.isString(str) ? str : this.$json(str)
  }
  $parse(item) {
    let obj = {type: Object.prototype.toString.call(item)}
    try {
      obj = JSON.parse(item)
    } catch (e) {
      obj.error = e && e.stack || ''
    }
    return this.isObject(obj) ? obj : this.$parse(obj)
  }

  /**
   * [功能方法]
   * @param  {[type]}  item [description]
   * @return {Boolean}      [description]
   */
  isPhone(str) {
    return /^1\d{10}$/.test(str)
  }
  $showToast(title){
    wx.showToast({
       title: title,
       icon: 'none',
       duration: 1200
    })
  }
  $Toast_success(title){
    wx.showToast({
      title: title,
      icon: 'success',
      duration: 1200
    })
  }
  $showLoading(title){
    wx.showLoading({
      title: title,
      mask: true
    })
  }
  $copyText(text) {
    wx.setClipboardData({
      data: text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  }

  // 警告框
  $alert(item = '标题', item2) {
    const param = this.isObject(item) ? Object.assign({
      // 首参数为obj
      title: 'title', content: 'content'
    }, item) : this.isString(item) ? this.isString(item2) ? {
      // 俩参数均为字符串
      title: item, content: item2
    } : {
      // 只有首参为字符串
      title: '', content: item
    } : {
      // 尝试转换字符串
      title: item.toString ? item.toString() : '参数异常'
    }
    wx.showModal(Object.assign({
      showCancel: false
    }, param))
  }
  //跳转链接
  $goto(url) {
    wx.navigateTo({url: url})
  }
  $gotoTab(url) {
    wx.switchTab({url: url})
  }
  $redirectTo(url) {
    wx.redirectTo({url: url})
  }
  $gotoBack(num) {
    wx.navigateBack({
      delta: num
    })
  }
  $gotoFriendPage(type, id) {
    let url = ''
    if (!type) {
      return this.$showToast('未获取到用户类型！')
    }
    if (type == 'single') {
      url = '/pages/home/information?id=' + id
    } else {
      url = '/pages/home/introducer?id=' + id
    }
    wx.navigateTo({url: url})
  }
  // 记录from_platform
  $recordFrom_platform(e){
    if (e.from_platform) {
      wx.setStorageSync('from_platform', e.from_platform)
    }
  }
  // 记录from_openid
  $recordFrom_openid(e){
    if (e.from_openid) {
      wx.setStorageSync('from_openid', e.from_openid)
    }
  }
  // 预览单图
  $previewImage(image) {
    let imageArray = []
    imageArray.push(image)
    console.log(imageArray)
    wepy.previewImage({
      current: image, // 当前显示图片的http链接
      urls: imageArray // 需要预览的图片http链接列表
    })
  }
  // 预览多图
  $previewImages(image, imageArray) {
    wepy.previewImage({
      current: image, // 当前显示图片的http链接
      urls: imageArray // 需要预览的图片http链接列表
    })
  }

  $getCurrentPageUrl() { // 获取当前页面路由
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const url = `/${currentPage.route}`
    return url
  }

  $getCurrentLastPageUrl() { // 获取上个页面路由
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 2]
    const url = `/${currentPage.route}`
    return url
  }

  // 动态设置setNavigationBarTitle
  $setNavigationBarTitle(title) {
    wx.setNavigationBarTitle({
      title: title
    })
  }
  // 拨打电话
  $makePhoneCall(iphone) {
    wx.makePhoneCall({
      phoneNumber: iphone //仅为示例，并非真实的电话号码
    })
  }
}
