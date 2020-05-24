// pages/new/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    nodata:true,
    news:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.u.getNewsList().then(res=>{
      console.log(res.result.length)
      var news = res.result
      var nodata = true
      if (res.result.length>0){
        nodata = false
      }
      this.setData({
        loading:false,
        nodata:nodata,
        news:res.result
      })
    })
  },
  read(e){
    var id = e.currentTarget.dataset.id
    var article = e.currentTarget.dataset.article
    wx.redirectTo({
      url: '/pages/detail/index?id='+article,
    })
    wx.u.changeStatus(id)
  }
})