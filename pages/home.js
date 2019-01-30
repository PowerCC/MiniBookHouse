// pages/home.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imageHeight: 0,
    page: 1,
    slideshow: [],
    brandCategoryList: [],
    categoryListHasIcon: [],
    categoryListNoIcon: [],
    suitGoodsList: [],
    hotGoodsList: [],
    newGoodsList: [],
    bestGoodsList: []
  },
  imageLoad: function(e) {
    let windowWidth = wx.getSystemInfoSync().windowWidth;
    let width = e.detail.width;
    let height = e.detail.height;
    this.setData({
      imageHeight: windowWidth * height / width,
    });
  },
  openMoreList: function(e) {
    var comType = e.currentTarget.dataset.comtype;
    wx.navigateTo({
      url: '/pages/normalSectionList?comType=' + comType
    })
  },
  openSuit: function(e) {
    wx.navigateTo({
      url: '/pages/details/suit?id=' + e.currentTarget.dataset.id
    })
  },
  openGoods: function (e) {
    wx.navigateTo({
      url: '/pages/details/goods?id=' + e.currentTarget.dataset.id
    })
  },
  getSlideshow: function() {
    let _this = this;
    wx.request({
      url: app.globalData.baseApi + "outer/getHomeBannerList",
      method: "GET",
      success(res) {
        if (res.data.code == 200) {
          _this.setData({
            slideshow: res.data.data.result,
          });
        }
      }
    });
  },
  getBrandCategoryList: function() {
    let _this = this;
    wx.request({
      url: app.globalData.baseApi + "outer/getHomeBrandCategoryList",
      method: "GET",
      success(res) {
        if (res.data.code == 200) {
          _this.setData({
            brandCategoryList: res.data.data.result,
          });
        }
      }
    });
  },
  getCategoryList: function() {
    let _this = this;
    wx.request({
      url: app.globalData.baseApi + "outer/getHomeGoodsCategoryList",
      method: "GET",
      success(res) {
        if (res.data.code == 200) {
          _this.setData({
            categoryListHasIcon: res.data.data.result.hasIcon,
            categoryListNoIcon: res.data.data.result.noIcon,
          });
        }
      }
    });
  },
  getGoodsList: function() {
    let _this = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.baseApi + "outer/getHomeGoodsList",
      method: "GET",
      success(res) {
        if (res.data.code == 200) {
          _this.setData({
            suitGoodsList: res.data.data.result.suit,
            hotGoodsList: res.data.data.result.hot,
            newGoodsList: res.data.data.result.new,
            bestGoodsList: res.data.data.result.best,
          });
        }
      },
      complete() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSlideshow();
    this.getBrandCategoryList();
    this.getCategoryList();
    this.getGoodsList();
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
      page: 1,
    });

    this.getSlideshow();
    this.getBrandCategoryList();
    this.getCategoryList();
    this.getGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("上拉");
    //this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  bindKeyConfirm(e) {
    wx.navigateTo({
      url: '/pages/search/search?keyword=' + e.detail.value
    })
  }
});