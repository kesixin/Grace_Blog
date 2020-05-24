// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articles: {},
    nodata: true,
    loading: true,
  },
  onLoad: function (options) {
    wx.u.getCollectList().then(res => {
      console.log(res)
      var nodata = true
      if (res.result.length > 0) {
        nodata = false
      }
      for (let object of res.result) {
        object.createdAt = object.createdAt.slice(0, 10)
      }
      this.setData({
        articles: res.result,
        nodata: nodata,
        loading: false
      })
    })
  },
  detail(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/index?id=' + id,
    })
  }
})