try {
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url == "https://www.episodate.com/watchlist-7" && changeInfo.status == 'complete') {
      chrome.scripting.executeScript({
        files: ['contentScript.js'],
        target: { tabId: tab.id }
      });
    }
  })
} catch (e) {
  console.log(e);
}
