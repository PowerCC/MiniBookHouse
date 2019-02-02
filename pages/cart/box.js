// pages/cart/box.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollViewHeight: 0,
    pageBottom: app.globalData.pageBottom,
    pageEmpty: false,
    box: [],
    boxList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    let query = wx.createSelectorQuery();
    query.selectAll('.box-top').boundingClientRect(rect => {
      let heightAll = 0;
      rect.map((currentValue, index, arr) => {
        heightAll = heightAll + currentValue.height
      });

      _this.setData({
        scrollViewHeight: app.globalData.windowHeight - heightAll - _this.data.pageBottom
      });

    }).exec();
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
    let _this = this;
    let box = wx.getStorageSync('box');
    console.log(box);

    if (box.length > 0) {

      box.forEach(function(value, index, arrSelf) {
        if (_this.data.box.indexOf(value) < 0) {
          _this.data.box.push(value);
        }
      });

      this.getGoodsSummaryByIds();
    }
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

  getGoodsSummaryByIds: function() {
    let _this = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.baseApi + "outer/getGoodsSummaryByIds",
      method: "GET",
      data: {
        ids: _this.data.box.toString()
      },
      success(res) {
        if (res.data.code == 200) {

          console.log(res.data.data.result);

          let result = res.data.data.result;

          if (result.length == 0 && _this.data.takeSelfList.length == 0) {
            pageEmpty = true;
          }

          _this.setData({
            boxList: result
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