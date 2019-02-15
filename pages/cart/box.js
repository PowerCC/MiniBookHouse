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
    boxList: [],
    selectedCount: 0,
    selectedAll: false,
    totalPrice: 0
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
        scrollViewHeight: app.globalData.windowHeight - heightAll - (80 / 750 * app.globalData.windowWidth)
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

    if (app.globalData.authorize) {
      app.checkSession();
    }

    let box = wx.getStorageSync('box');

    if (box.length > 0) {

      box.forEach(function(value, index, arrSelf) {
        if (_this.data.box.indexOf(value) < 0) {
          _this.data.box.push(value);
        }
      });

      console.log(_this.data.box);

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

          var result = res.data.data.result;

          if (result.length == 0 && _this.data.takeSelfList.length == 0) {
            pageEmpty = true;
          }

          for (let i = 0; i < result.length; i++) {
            result[i].selected = false;
          }

          _this.setData({
            boxList: result,
            selectedCount: 0,
            selectedAll: false,
            totalPrice: 0
          });
        }
      },
      complete() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    });
  },

  selectBook: function(e) {
    let bookIndex = e.currentTarget.dataset.index;
    var s = this.data.boxList[bookIndex].selected;
    s = !s;

    let price = parseFloat(this.data.boxList[bookIndex].sell_price);
    var totalPrice = parseFloat(this.data.totalPrice);

    if (s == true && this.data.selectedCount < this.data.boxList.length) {
      this.data.selectedCount += 1;
      totalPrice += price;
    } else if (this.data.selectedCount > 0) {
      this.data.selectedCount -= 1;
      totalPrice -= price;
    }

    totalPrice = totalPrice.toFixed(2);

    var selectedAll = false;
    if (this.data.selectedCount == this.data.boxList.length) {
      selectedAll = true;
    }

    
    console.log(this.data.selectedCount);
    console.log(price);

    var selected = "boxList[" + bookIndex + "].selected";

    this.setData({
      [selected]: s,
      selectedCount: this.data.selectedCount,
      selectedAll: selectedAll,
      totalPrice: totalPrice
    });

  },

  selectAllBook: function(e) {
    let selected = !this.data.selectedAll;
    var boxList = this.data.boxList;
    var totalPrice = parseFloat(0);
    for (let i = 0; i < boxList.length; i++) {
      boxList[i].selected = selected;

      if (selected) {
        totalPrice += parseFloat(boxList[i].sell_price);
      }
    }

    totalPrice = totalPrice.toFixed(2);

    var selectedCount = 0;
    if (selected) {
      selectedCount = this.data.boxList.length;
    }

    this.setData({
      boxList: boxList,
      selectedCount: selectedCount,
      selectedAll: selected,
      totalPrice: totalPrice
    });
  },

  deleteBook: function(e) {
    let _this = this;
    let id = e.currentTarget.dataset.id;
    let bookIndex = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定要从书包删除吗？',
      success: function(res) {
        if (res.confirm) {
          let index = _this.data.box.indexOf(id);
          console.log(index);

          _this.data.box.splice(index, 1);

          wx.setStorageSync('box', _this.data.box);

          var boxList = _this.data.boxList;
          boxList.splice(bookIndex, 1);

          _this.setData({
            boxList: boxList
          });
        }
      }
    });
  }
})