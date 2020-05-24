// pages/my/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData:{},
    signNum:0,
    sign:false,
    signTime:'',
    loading:true,
    noReadNewsCount:0
  },
  
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })
    var that = this
    wx.getUserInfo({
      success: (result) => {
        var nickName = result.userInfo.nickName
        var userPic = result.userInfo.avatarUrl
        var userData = { 'nickName': nickName, 'userPic': userPic }
        wx.setStorageSync('userInfo', userData)
        that.setData({
          userData: userData
        })
      }
    })

    wx.u.getSignNum().then(res=>{
      if (res.result[0]!="" && res.result[0]!=undefined){
        var day = new Date(res.result[0].createdAt).toDateString();

        if (day == new Date().toDateString()){
          that.setData({
            sign:true,
            signTime:res.result[0]
          })
        }
      }
      that.setData({
        signNum:res.signNum
      })
      that.spinShow()
    })
    wx.u.getNewsCount().then(res=>{
      this.setData({
        noReadNewsCount:res.result
      })
    })
  },
  adLoad() {
    wx.hideLoading();
    console.log('Banner 广告加载成功')
  },
  adError(err) {
    wx.hideLoading();
    console.log('Banner 广告加载失败', err)
  },
  adClose() {
    wx.hideLoading();
    console.log('Banner 广告关闭')
  },
  onShareAppMessage() {
    return {
      title: 'Mamba 博客',
      path: 'pages/index/index',
      imageUrl: '/images/blog.png'
    }
  },
  //授权获取用户数据
  bindGetUserInfo (){
    wx.showLoading({
      title: '授权中',
    })
    var that = this
    wx.login({
      success:()=>{
        wx.getUserInfo({
          success:(result)=>{
            var nickName = result.userInfo.nickName
            var userPic = result.userInfo.avatarUrl
            wx.u.saveUserInfo(userPic,nickName)
            var userData = {'nickName':nickName,'userPic':userPic}
            wx.setStorageSync('userInfo', userData)
            that.setData({  
              userData:userData
            })
            wx.hideLoading()
          }
        })
      }
    })
  },
  //签到
  sign (){
    var that = this
    wx.showLoading({
      title: '签到中',
    })
    wx.u.saveSign().then(res=>{
      if(res.result){
        setTimeout(function () {
          wx.hideLoading()
          that.setData({
            sign:true,
            signShow:true,
            signTime:res.data,
            signNum:that.data.signNum + 1
          })
        }, 1500)
      }
    })
  },
  //赞赏
  praise (){
    wx.navigateToMiniProgram({
      appId: 'wx18a2ac992306a5a4',
      path: 'pages/apps/largess/detail?id=H1DJCmq6QvY%3D',
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },
  //分享
  share (){

  },
  spinShow: function () {
    var that = this
    setTimeout(function () {
      that.setData({
        loading: !that.data.loading,
      });
      console.log("spinShow");
    }, 1500)
  }
})