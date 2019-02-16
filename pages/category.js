// pages/category.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageBottom: app.globalData.pageBottom,
    pageIndex: 1,

    ageItemClass: "item-normal",
    languageItemClass: "item-normal",
    categoryItemClass: "item-normal",

    ageItems: [],
    languageItems: [],
    categoryItems: [],

    ageFilter: "0",
    languageFilter: "0",
    categoryFilter: "0",

    goodsList: [],
    pageEmpty: false,
    pageEnd: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCategoryListByParentId();
    this.getGoodsListByFilters();
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
    if (app.globalData.authorize) {
      app.checkSession();
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
    if (this.data.pageEnd == false) {
      this.getGoodsListByFilters();
    }
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
        pid: "0",
      },
      success(res) {
        if (res.data.code == 200) {
          console.log(res.data);

          let result = res.data.data.result;

          var ageResult = result.age;
          var languageResult = result.language;
          var classifyResult = result.classify;

          for (let i = 0; i < ageResult.length; i++) {
            if (i == 0) {
              ageResult[i].selected = true;
            } else {
              ageResult[i].selected = false;
            }
          }

          for (let i = 0; i < languageResult.length; i++) {
            if (i == 0) {
              languageResult[i].selected = true;
            } else {
              languageResult[i].selected = false;
            }
          }

          for (let i = 0; i < classifyResult.length; i++) {
            if (i == 0) {
              classifyResult[i].selected = true;
            } else {
              classifyResult[i].selected = false;
            }
          }

          _this.setData({
            ageItems: _this.data.ageItems.concat(ageResult),
            languageItems: _this.data.languageItems.concat(languageResult),
            categoryItems: _this.data.categoryItems.concat(classifyResult)
          });
        }
      },
      complete() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    });
  },

  getGoodsListByFilters: function() {
    let _this = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.baseApi + "outer/getGoodsListByFilters",
      method: "GET",
      data: {
        page: _this.data.pageIndex,
        age: _this.data.ageFilter,
        classify: _this.data.categoryFilter,
        language: _this.data.languageFilter
      },
      success(res) {
        if (res.data.code == 200) {
          console.log(res.data);

          let result = res.data.data.result;
          var page = _this.data.pageIndex;
          var pageEmpty = false;
          var pageEnd = false;

          if (result.length == 0 && _this.data.goodsList.length == 0) {
            pageEmpty = true;
          } else if (result.length > 0) {
            page = page + 1;
          } else if (result.length == 0) {
            pageEnd = true;
          }

          _this.setData({
            pageIndex: page,
            goodsList: _this.data.goodsList.concat(result),
            pageEmpty: pageEmpty,
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

  filterTap: function(e) {
    let _this = this;

    let pid = e.currentTarget.dataset.pid;
    let cid = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;

    console.log("pid: " + pid + " cid: " + cid + " index: " + index);

    var ageResult = _this.data.ageItems;
    var languageResult = _this.data.languageItems;
    var classifyResult = _this.data.categoryItems;

    if (pid == "0") {
      for (let i = 0; i < ageResult.length; i++) {
        if (i == index) {
          ageResult[i].selected = true;
        } else {
          ageResult[i].selected = false;
        }
      }

      _this.data.ageFilter = cid;
    } else if (pid == "1") {
      for (let i = 0; i < languageResult.length; i++) {
        if (i == index) {
          languageResult[i].selected = true;
        } else {
          languageResult[i].selected = false;
        }
      }

      _this.data.languageFilter = cid;
    } else if (pid == "2") {
      for (let i = 0; i < classifyResult.length; i++) {
        if (i == index) {
          classifyResult[i].selected = true;
        } else {
          classifyResult[i].selected = false;
        }
      }

      _this.data.categoryFilter = cid;
    }

    console.log(ageResult);

    _this.setData({
      pageIndex: "1",
      ageItems: ageResult,
      languageItems: languageResult,
      categoryItems: classifyResult,
      goodsList: [],
      pageEnd: false,
    });

    this.getGoodsListByFilters();
  },
  openThis: function(e) {
    wx.navigateTo({
      url: '/pages/details/goods?id=' + e.currentTarget.dataset.id
    })
  }
})