function getUser() {
  return new Promise((resolve) => {
    let arr = ['user', 'fakename', 'intUid'];
    chrome.storage.sync.get(arr, (result) => {
      const { user, fakename, intUid } = result;
      resolve(user || (fakename ? { username: fakename, intUid } : null));
    });
  });
}

function throttle(fn, interval = 200) {
  // 维护上次执行的时间
  let last = 0;
  let inter = 0;
  return function () {
    const context = this;
    const args = arguments;
    const now = Date.now();
    // 根据当前时间和上次执行时间的差值判断是否频繁
    if (now - last >= interval) {
      last = now;
      clearTimeout(inter);
      fn.apply(context, args);
    } else {
      setTimeout(() => {
        fn.apply(context, args);
      }, interval);
    }
  };
}
function createUUID() {
  // http://www.ietf.org/rfc/rfc4122.txt
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}
export {
  throttle,
  getUser,
  createUUID
};
