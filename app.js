//app.js
App({
  globalData: {
    baseApi: "https://open.hunli.baihe.com/",
    cartList: [],
    cartNum: 0,
    session: "",
    userInfo: {},
    isIPhoneX: false,
    windowWidth: 0,
    windowHeight: 0,
    scrollViewHeight: 0,
    pageBottom: 30,
    selectedCategory: {},
    box: [],
    selectedAddress: {
      id: "",
      name: "",
      address: ""
    }
  },

  onLaunch: function() {
    //获取用户授权
    //this.checkAuth();

    //初始化购物车信息
    // try{
    //   const jsonStr = wx.getStorageSync('cart-list');
    //   if (!jsonStr) return true;
    //   this.globalData.cartList = JSON.parse(jsonStr)
    // }catch(e){
    //   console.log(e.toString());
    //   return false;
    // }
    // let cartNum = 0;
    // this.globalData.cartList.forEach(function(item){
    //   cartNum += item.number;
    // });
    // this.globalData.cartNum = cartNum;

    let _this = this;
    wx.getSystemInfo({
      success: function(res) {

        _this.globalData.windowWidth = res.windowWidth;
        _this.globalData.windowHeight = res.windowHeight;

        //model中包含着设备信息
        console.log(res.model)
        var model = res.model
        if (model.search('iPhone X') != -1) {
          _this.globalData.isIPhoneX = true;
          _this.globalData.pageBottom = 128
        } else {
          _this.globalData.isIPhoneX = false;
          _this.globalData.pageBottom = 60
        }
      }
    });

    let box = wx.getStorageSync('box');
    if (box.length > 0) {
      _this.globalData.box = box;
    }
  },

  checkAuth: function() {
    try {
      const session = wx.getStorageSync("session");
      if (session) {
        this.globalData.session = session;
        return true;
      }
    } catch (e) {
      console.log(e.toString());
      return false;
    }

    let _this = this;
    wx.login({
      success(res) {
        if (res.code) {
          //_this.login(res.code);
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      }
    });
  },
  login: function(code) {
    let _this = this;
    wx.request({
      url: _this.globalData.baseApi + "user/login",
      method: "GET",
      data: {
        code: code
      },
      success(res) {
        if (res.data.code === 200) {
          _this.globalData.session = res.data.session;
          try {
            wx.setStorageSync("session", res.data.session);
          } catch (e) {
            console.log(e.toString());
            return false;
          }
        }
      }
    })
  },
});