
function getActiveTab() {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.query({
        currentWindow: true,
        active: true,
      }, function (tabs) {
        resolve(tabs[0]);
      })
    } catch (e) {
      reject(e);
    }
  })
}

export { getActiveTab }
