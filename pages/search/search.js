// pages/search/search.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageBottom: "30rpx",
    pageIndex: 1,
    keyword: '',
    pageEnd: false,
    goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let isPhone = app.globalData.isIPhoneX;

    this.setData({
      keyword: options.keyword,
      pageBottom: isPhone ? "68rpx" : "30rpx"
    });

    var sectionTitle = '搜索';

    wx.setNavigationBarTitle({
      title: sectionTitle
    });

    this.searchGoodsList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

    this.setData({
      pageIndex: 1,
      goodsList: [],
      pageEnd: false
    });

    this.searchGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.searchGoodsList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  openThis: function(e) {
    wx.navigateTo({
      url: '/pages/category/single?id=' + e.currentTarget.dataset.id
    })
  },

  searchGoodsList: function() {
    let _this = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.baseApi + "outer/search",
      method: "GET",
      data: {
        page: _this.data.pageIndex,
        keyword: _this.data.keyword
      },
      success(res) {
        if (res.data.code == 200) {
          console.log(res.data);

          let result = res.data.data.result;
          var page = _this.data.pageIndex;
          var pageEnd = true;

          if (result.length > 0) {
            page += 1;
            pageEnd = false;
          }

          _this.setData({
            pageIndex: page,
            goodsList: _this.data.goodsList.concat(result),
            pageEnd: pageEnd
          });
        }
      },
      complete() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    });
  }
})