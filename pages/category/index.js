// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    cateList: {},
    current: '',
    current_scroll: '',
    category: '',
    nodata: false, //更多数据
    articles: []
  },

  onLoad: function(options) {
    wx.showLoading({
      title:'加载中'
    })
    var that = this
    wx.u.getCategoryList().then(res => {
      this.setData({
        cateList: res.result,
        current: res.result[0].objectId,
        current_scroll: res.result[0].objectId,
      })
      this.getArticleList(res.result[0].objectId);

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
  getArticleList(category) {
    wx.u.getArticleByCategory(category).then(res => {
      console.log(res)
      let data = [];
      res.result.forEach((resEach) => {
        data.push({
          'objectId': resEach.objectId,
          'title': resEach.title,
          'read_counts': resEach.read_counts,
          'excerpt': resEach.excerpt,
          'createdAt': resEach.createdAt.slice(0, 10),
          'category': resEach.category,
          'listPic': resEach.listPic,
          'author': resEach.author
        })
      })
      if (data.length) {
        this.setData({
          'articles': data,
          'nodata':false
        })
      }else{
        this.setData({
          'articles': data,
          'nodata': true
        })
      }
      
      this.spinShow();
    })
  },
  handleChangeScroll({
    detail
  }) {
    console.log(detail)
    this.setData({
      loading:true,
      current_scroll: detail.key,
      pagination: 0
    });
    this.getArticleList(detail.key)
  },
  spinShow: function() {
    var that = this
    setTimeout(function() {
      that.setData({
        loading: false,
      });
      console.log("spinShow");
    }, 1500)
  },
  detail(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/index?id='+id,
    })
  },
  onShareAppMessage() {
    return {
      title: 'Mamba 博客',
      path: 'pages/index/index',
      imageUrl: '/images/blog.png'
    }
  },
  
})