// pages/category.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageBottom: "30rpx",
    pageIndex: 1,
    ageItems: [],
    languageItems: [],
    categoryItems: [],
    categoryIds: [],
    goodsList: [],
    pageEnd: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;

    let isPhone = app.globalData.isIPhoneX;

    this.setData({
      pageBottom: isPhone ? "68rpx" : "30rpx"
    });

    this.getCategoryListByParentId();
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getCategoryListByParentId: function() {
    let _this = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.baseApi + "outer/getCategoryListByParentId",
      method: "GET",
      data: {
        pid: "1,2,3",
      },
      success(res) {
        if (res.data.code == 200) {
          console.log(res.data);

          let result = res.data.data.result;
          _this.setData({
            ageItems: _this.data.ageItems.concat(result.p1),
            languageItems: _this.data.languageItems.concat(result.p2),
            categoryItems: _this.data.categoryItems.concat(result.p3)
          });
        }
      },
      complete() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    });
  },

  getGoodsListByCategoryId: function() {
    let _this = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.baseApi + "outer/getGoodsListByCategoryId",
      method: "GET",
      data: {
        cid: _this.data.categoryIds,
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
  },

  categoryTap: function(e) {
    let cid = e.currentTarget.dataset.id;

    console.log(cid);

    // var ids = this.data.categoryIds;
    // ids.push(cid.toString());

    // this.setData({
    //   categoryIds: ids
    // })

    // this.getGoodsListByCategoryId();
  }
})