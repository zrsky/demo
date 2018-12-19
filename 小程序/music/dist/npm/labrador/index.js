'use strict';
(function(module,require){var exports=module.exports={};
/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-09-26
 * @author Liang <liang@maichong.it>
 */


var labrador = module.exports = {};
labrador.default = labrador;

labrador._createPage = require('./create-page.js');
labrador.Component = require('./component.js');
labrador.List = require('./list.js');
labrador.PropTypes = labrador.Types = require('./prop-types.js');

Object.defineProperty(labrador, 'app', {
  get: function () {
    return getApp();
  }
});

var noPromiseMethods = {
  stopRecord: true,
  pauseVoice: true,
  stopVoice: true,
  pauseBackgroundAudio: true,
  stopBackgroundAudio: true,
  showNavigationBarLoading: true,
  hideNavigationBarLoading: true,
  createAnimation: true,
  createContext: true,
  hideKeyboard: true,
  stopPullDownRefresh: true
};

function forEach(key) {
  if (noPromiseMethods[key] || key.substr(0, 2) === 'on' || /\w+Sync$/.test(key)) {
    labrador[key] = function () {
      if (false) {
        var res = wx[key].apply(wx, arguments);
        if (!res) {
          res = {};
        }
        if (res && typeof res === 'object') {
          res.then = function () {
            console.warn('wx.' + key + ' is not a async function, you should not use await ');
          };
        }
        return res;
      }
      return wx[key].apply(wx, arguments);
    };
    return;
  }

  labrador[key] = function (obj) {
    obj = obj || {};
    return new Promise(function (resolve, reject) {
      obj.success = resolve;
      obj.fail = function (res) {
        if (res && res.errMsg) {
          reject(new Error(res.errMsg));
        } else {
          reject(res);
        }
      };
      wx[key](obj);
    });
  };
}

Object.keys(wx).forEach(forEach);

})(module,require);