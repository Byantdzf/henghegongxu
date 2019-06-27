import wepy from 'wepy';
import { service } from '../config.js'

export default class ShareMessage extends wepy.mixin {
  data = {
    from_openid: '',
    formId: [],
    openGid: ''
  };
  onLoad(e) {
    let that = this
    if (e.from_platform) {
      wx.setStorageSync('from_platform', e.from_platform)
    }
    that.from_openid = wx.getStorageSync('openid')
    if (e.from_openid) {
      wx.setStorageSync('from_openid', e.from_openid)
      that.from_openid = wx.getStorageSync('openid')
      that.$apply()
    }
    wx.showShareMenu({
      withShareTicket: true
    })
  }
  onShow(e) {
  }
  getCurrentPageUrlWithArgs(){
    var pages = getCurrentPages()    // 获取加载的页面
    var currentPage = pages[pages.length - 1]    // 获取当前页面的对象
    var url = currentPage.route    // 当前页面url
    var options = currentPage.options    // 如果要获取url中所带的参数可以查看options
    // 拼接url的参数
    var urlWithArgs = url + '?from_openid=' + this.from_openid
    for (var key in options) {
      var value = options[key]
      if (key !== 'from_openid') {
        urlWithArgs = url + '?' + key + '=' + value + '&from_openid=' + this.from_openid
      }
    }
    // urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
    return urlWithArgs
  }
  getCurrentPageUrl() { // 获取页面路由
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const url = `/${currentPage.route}`
    return url
  }
  methods = {
    formSubmit(e) {
      this.formId.push(e.detail.formId)
      console.log(this.formId)
      wx.setStorageSync('formId', this.formId)
    },
    onShareAppMessage(res) {
      let that = this,
        url = that.getCurrentPageUrlWithArgs(),
        page = that.getCurrentPageUrl(),
        imageUrl = ''
      console.log(page)
      console.log(url)
      if (page == '/pages/home/information') {
        imageUrl = ''
      }
      return {
        title: this.config.navigationBarTitleText,
        path: url,
        imageUrl: imageUrl,
        success: function(res) {
          let shareTickets = res.shareTickets;
          console.log(res)
          if (!shareTickets) {
            return false
          }
          wx.getShareInfo({
            shareTicket: shareTickets[0],
            success: function(res){
              let encryptedData = res.encryptedData
              let iv = res.iv
              let code = ''
              wepy.login({
                success: (res) => {
                  code = res.code
                  let data = {
                    code: code,
                    iv: iv,
                    encryptedData: encryptedData
                  }
                  // that.$post({url: service.infor, data}, {
                  //   success: ({code, data}) => {
                  //     that.openGid = data.openGId
                  //     that.$apply()
                  //   },
                  //   fail: ({code, data}) => {},
                  //   complete: () => { }
                  // })
                },
                fail: (res) => {
                  console.log('wepy.login.fail:', res)
                }
              })
            }
          })
          console.log('转发成功')
        },
        fail: function(res) {
          console.log('转发成功')
        }
      }
    }
  }
}
