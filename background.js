chrome.browserAction.onClicked.addListener((tab) => {
  let json1Param = ''
  if (tab && tab.url) {
    const tabURL = new URL(tab.url)
    if (tabURL) {
      const protocol = tabURL.protocol
      const host = tabURL.host
      const pathArray = tabURL.pathname.split('/')
      let path = ''
      if (pathArray.length > 1) {
        path = pathArray[1]
      }
      if (protocol && host && path) {
        json1Param = `?json1=${protocol}//${host}/${path}/json`
      }
    }
  }

  chrome.tabs.create({
    'url': chrome.extension.getURL(`src/index.html${json1Param}`),
    'active': true
  })
})