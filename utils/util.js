const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * 保存用户信息
 * userPic:头像
 * nickName:昵称
 */
const saveUserInfo = (userPic,nickName)=>{
  let current = wx.Bmob.User.current();
  let uid = current.objectId
  return new Promise((resolve,reject)=>{
    const query  = wx.Bmob.Query('_User')
    query.get(uid).then(res=>{
      res.set('nickName',nickName)
      res.set('userPic',userPic)
      res.save();
    })
  })
}
/**
 * 获取文章列表
 * pageSize:数量
 * pagination:页码
 * category:分类
 */
const getArticleList = (pageSize, pagination, category)=>{
  return new Promise((resolve,reject)=>{
    const query = wx.Bmob.Query('articles')
    query.limit(pageSize)
    query.skip(pageSize * pagination)
    if(category != ''){
      query.equalTo("category","==",category)
    }
    query.order("-createdAt")
    query.include('category')
    query.select("objectId,title,read_counts,excerpt,author,createdAt,category,listPic")
    query.find().then(res=>{
      resolve({
        'result':res
      })
    }).catch(err=>{
      console.log(err)
    })
  })
}
/**
 * 获取文章详情
 * id:文章id
 */
const getArticleDetail =(id)=>{
  return new Promise((resolve,reject)=>{
    const query = wx.Bmob.Query('articles')
    query.get(id).then(res=>{
      resolve({
        'result': res
      })
    }).catch(err => {
      console.log(err)
    })
  })
}
/**
 * 获取分类列表
 */
const getCategoryList =()=>{
  return new Promise((resolve,reject)=>{
    const query = wx.Bmob.Query('categories')
    query.find().then(res=>{
      resolve({
        'result':res
      })
    })
  })
}

/**
 * 按照分类请求博文数据
 */
const getArticleByCategory =(category)=>{
  return new Promise((resolve, reject) => {
    const query =wx.Bmob.Query("articles");
    if (category != 0) {
      query.equalTo("category", "==", category);
    }
    query.select("objectId,title,read_counts,excerpt,author,createdAt,category,listPic")
    query.order("-createdAt");
    query.find().then(res => {
      resolve({
        'result': res
      })
    })
  })
}
/**
 * 获取签到天数
 */
const getSignNum =()=>{
  return new Promise((resolve,reject)=>{
    let current = wx.Bmob.User.current();
    let uid = current.objectId
    const query = wx.Bmob.Query('sign')
    query.equalTo("user","==",uid)
    query.count().then(result=>{
      query.order("-createdAt")
      query.limit(1)
      query.find().then(res=>{
        resolve({
          'signNum':result,
          'result':res
        })
      })
    })
  })
}
/**
 * 保存签到数据
 */
const saveSign =()=>{
  return new Promise((resolve, reject) => {
    let current = wx.Bmob.User.current();
    let uid = current.objectId
    const pointer = wx.Bmob.Pointer("_User")
    const poiID = pointer.set(uid)
    const query = wx.Bmob.Query('sign')
    query.set('user',poiID)
    query.save().then(res=>{
      resolve({
        'result':true,
        'data':res
      })
    })
  })
}

/**
 * 生成文章对应小程序二维码
 * id:文章id
 */
const getShareCode =(id)=>{
  return new Promise((resolve,reject)=>{
    let path = 'pages/detail/index?id=' + id
    let qrData = { path: path, width: 430, interface: 'a', type: 1 };

    wx.Bmob.generateCode(qrData).then(res=>{
      const query = wx.Bmob.Query('articles')
      query.get(id).then(res1=>{
        res1.set('shareCode',res.url)
        res1.save()
        resolve({
          'shareCode':res.url
        })
      }).catch(err=>{
        console.log(err);
      })
    })
  })
}
/**
 * 查询是否收藏文章
 * id:文章id
 */
const getIsCollect=(id)=>{
  return new Promise((resolve,reject)=>{
    let current = wx.Bmob.User.current();
    let uid = current.objectId
    const query = wx.Bmob.Query('collect')
    query.equalTo('article','==',id)
    query.equalTo('user', '==', uid)
    return query.count().then(res=>{
      resolve({
        'result':res
      })
    })
  })
}

/**
 * 取消/收藏文章
 * id:文章id
 * action：取消或者收藏
 */
const collectAction=(id,action)=>{
  return new Promise((resolve,reject)=>{
    let current = wx.Bmob.User.current();
    let uid = current.objectId
    const query = wx.Bmob.Query('collect');
    if(action == 'noCollect'){
      query.equalTo('article', '==', id);
      query.equalTo('user', '==', uid);
      query.find().then(todos =>{
        todos.destroyAll().then(res=>{
          resolve({
            'result': true
          })
        }).catch(err => {
          resolve({
            'result': false
          })
        })
      })
    }else{
      var pointer1 = wx.Bmob.Pointer("_User");
      var poiID1 = pointer1.set(uid);
      var pointer2 = wx.Bmob.Pointer("articles");
      var poiID2 = pointer2.set(id);
      query.set("user", poiID1);
      query.set("article", poiID2);
      query.save().then(res => {
        resolve({
          'result': true
        })
      }).catch(err => {
        resolve({
          'result': false
        })
      })
    }
  })
}
/**
 * 查询是否点赞文章
 * id:文章id
 */
const getIsLiked = (id) => {
  return new Promise((resolve, reject) => {
    let current = wx.Bmob.User.current();
    let uid = current.objectId
    const query = wx.Bmob.Query('like')
    query.equalTo('article', '==', id)
    query.equalTo('user', '==', uid)
    return query.count().then(res => {
      resolve({
        'result': res
      })
    })
  })
}
/**
 * 取消/点赞文章
 * id:文章id
 * action：取消或者点赞
 */
const likeAction = (id, action) => {
  return new Promise((resolve, reject) => {
    let current = wx.Bmob.User.current();
    let uid = current.objectId
    const query = wx.Bmob.Query('like');
    if (action == 'noLike') {
      query.equalTo('article', '==', id);
      query.equalTo('user', '==', uid);
      query.find().then(todos => {
        todos.destroyAll().then(res => {
          resolve({
            'result': true
          })
        }).catch(err => {
          resolve({
            'result': false
          })
        })
      })
    } else {
      query.set("user", uid);
      query.set("article", id);
      query.save().then(res => {
        resolve({
          'result': true
        })
      }).catch(err => {
        resolve({
          'result': false
        })
      })
    }
  })
}

/**
 * 获取收藏列表
 */
const getCollectList=()=>{
  return new Promise((resolve, reject) => {
    let current = wx.Bmob.User.current();
    let uid = current.objectId
    const query = wx.Bmob.Query('collect')
    query.equalTo('user', '==', uid);
    query.include('article');
    query.order('-createdAt');
    query.find().then(res=>{
      resolve({
        'result':res
      })
    })
  })
}
/**
 * 文章阅读数增加
 */
const addReadCount=(id)=>{
  const query = wx.Bmob.Query('articles')
  query.get(id).then(res => {
    res.set('read_counts', (parseInt(res.read_counts) + 1));
    res.save();
  })
}

/**
 * 获取文章评论
 * id：文章id
 */
const getComment=(id)=>{
  return new Promise((resolve,reject)=>{
    const query = wx.Bmob.Query('comments')
    query.include('replyer,user','_User')
    query.equalTo('article','==',id)
    query.find().then(res=>{
      resolve({
        'result':res
      })
    })
  })
}

/**
 * 保存评论
 * id:文章id
 * userId:被评论者id
 * content:评论内容
 * form_Id:表单id
 */
const saveComment = (id,userId,content,form_Id)=>{
  return new Promise((resolve,reject)=>{
    let current = wx.Bmob.User.current();
    let replyerId = current.objectId
    const query = wx.Bmob.Query('comments')
    const pointer1 = wx.Bmob.Pointer("_User");
    const poiID1 = pointer1.set(replyerId);
    const pointer2 = wx.Bmob.Pointer("articles");
    const poiID2 = pointer2.set(id);
    if (userId) {
      var pointer3 = wx.Bmob.Pointer("_User");
      var poiID3 = pointer3.set(userId);
      query.set("user", poiID3)
    }
    
    query.set("content", content);
    query.set("replyer", poiID1);
    query.set("article", poiID2);
    query.set("formID", form_Id);
    query.save().then(res=>{
      resolve({
        'result': true
      })
    }).catch(err=>{
      resolve({
        'result': false
      })
    })
  })
}
/**
 * 推送消息通知
 */
const sendNew = (action, content, user, id)=>{
  const query = wx.Bmob.Query('news')
  const pointer1= wx.Bmob.Pointer('_User')
  if(action=='own'){
    var poiID1 = pointer1.set('d5af81d4d9')
  } else {
    var poiID1 = pointer1.set(user);
  }
  const pointer2 = wx.Bmob.Pointer("articles");
  const poiID2 = pointer2.set(id);
  query.set("user", poiID1);
  query.set("content", content);
  query.set("article", poiID2);
  query.set("status", 'false');
  query.save().then(res=>{

  })
}

/**
 * 查询我的消息列表
 */
const getNewsList=()=>{
  return new Promise((resolve, reject) => {
    let current = wx.Bmob.User.current();
    let uid = current.objectId
    const query = wx.Bmob.Query('news')
    query.equalTo('user','==',uid)
    query.equalTo('status','==','false')
    query.order('-createdAt')
    query.find().then(res=>{
      resolve({
        'result': res
      })
    })
  })
}

/**
 * 修改信息的阅读状态
 */
const changeStatus=(id)=>{
  const query = wx.Bmob.Query('news');
  query.get(id).then(res => {
    res.set('status', 'true');
    res.save();
  })
}

/**
 * 查询未读消息
 */
const getNewsCount=()=>{
  return new Promise((resolve, reject) => {
    const query = wx.Bmob.Query('news');
    let current = wx.Bmob.User.current();
    let uid = current.objectId
    query.equalTo('status', '==', 'false');
    query.equalTo('user', '==', uid);
    query.count().then(res=>{
      resolve({
        'result':res
      })
    })
  })
}

module.exports = {
  formatTime: formatTime,
  saveUserInfo: saveUserInfo,
  getArticleList:getArticleList,
  getArticleDetail: getArticleDetail,
  getCategoryList: getCategoryList,
  getArticleByCategory: getArticleByCategory,
  getSignNum: getSignNum,
  saveSign: saveSign,
  getShareCode: getShareCode,
  getIsCollect: getIsCollect,
  collectAction: collectAction,
  getIsLiked: getIsLiked,
  addReadCount: addReadCount,
  likeAction: likeAction,
  getCollectList: getCollectList,
  getComment: getComment,
  saveComment: saveComment,
  sendNew: sendNew,
  getNewsList: getNewsList,
  changeStatus: changeStatus,
  getNewsCount: getNewsCount
}
