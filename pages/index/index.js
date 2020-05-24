Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    current: '',
    current_scroll: '',
    category: '',
    moreData: true,//更多数据
    pageSize: 5,//数量
    pagination: 0,//页码
    articles: [],
    bottomWord:'',
    loadMore:false,
    loadMores:false
  },

  onLoad: function (options) {
    var that = this
    this.getArticleList(this.data.pageSize, this.data.pagination);
    if (wx.createInterstitialAd) {
      // 在页面中定义插屏广告
      let interstitialAd = null

      // 在页面onLoad回调事件中创建插屏广告实例
      if (wx.createInterstitialAd) {
        interstitialAd = wx.createInterstitialAd({
          adUnitId: 'adunit-87d173f19864060b'
        })
        interstitialAd.onLoad(() => { })
        interstitialAd.onError((err) => { })
        interstitialAd.onClose(() => { })
      }

      // 在适合的场景显示插屏广告
      if (interstitialAd) {
        interstitialAd.show().catch((err) => {
          console.error(err)
        })
      }
    }
  },
  getArticleList(pageSize, pagination) {
    wx.u.getArticleList(pageSize, pagination, '').then(res => {
      console.log(res)
      let data = [];
      res.result.forEach((resEach) => {
        data.push({
          'objectId': resEach.objectId,
          'title': resEach.title,
          'read_counts': resEach.read_counts,
          'excerpt': resEach.excerpt,
          'createdAt': resEach.createdAt.slice(0, 16),
          'category': resEach.category,
          'listPic': resEach.listPic,
          'author': resEach.author
        })
      })
      if (this.data.pagination == 0) {
        this.spinShow()
      }
      if (data.length) {
        let articles = this.data.articles;
        let pagination = this.data.pagination;
        articles.push.apply(articles, data);
        pagination = pagination ? pagination + 1 : 1;

        this.setData({
          'articles': articles,
          'pagination': pagination,
          'bottomWord': '',
          'loadMore': false,
        })
      }else{
        this.setData({
          'moreData':false,
          'bottomWord': '加载完',
          'loadMore': false,
        })
      }  
    })
  },
  onReachBottom: function () {
    if(this.data.moreData){
      this.setData({
        'loadMore': true,
        'bottomWord': '加载中',
      })
      this.getArticleList(this.data.pageSize, this.data.pagination);
    }
  },
  spinShow: function () {
    var that = this
    setTimeout(function () {
      that.setData({
        loading: !that.data.loading,
      });
      console.log("spinShow");
    }, 1500)
  },
  onShareAppMessage() {
    return {
      title: 'Mamba 博客',
      path: 'pages/index/index',
      imageUrl: '/images/blog.png'
    }
  }
})