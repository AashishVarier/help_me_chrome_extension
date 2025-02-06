let settings = { blockedSites: [], timeLimit: 30, timeSpent: 0, startTime: null };
chrome.storage.local.get(["settings"], (result) => {
  if (result.settings) settings = result.settings;
  else chrome.storage.local.set({ settings });
});

function matchesBlockedSite(siteUrl) {
  return settings.blockedSites.some((blockedSite) => {
    let regex = new RegExp(blockedSite.replace(/\*/g, ".*"));
    return regex.test(siteUrl);  
  });
}

chrome.webNavigation.onCompleted.addListener((details) => {
  const url = details.url;  
  if (matchesBlockedSite(url)) {
    if (!settings.startTime) settings.startTime = Date.now();
    settings.timeSpent = (Date.now() - settings.startTime) / 60000;
    if (settings.timeSpent >= settings.timeLimit) {
      chrome.tabs.update(details.tabId, { url: "data:text/html,<h1>Blocked for today</h1>" });
    }
    chrome.storage.local.set({ settings });
  }
});

chrome.alarms.create("resetTime", { when: Date.now(), periodInMinutes: 1440 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "resetTime") {
    settings.timeSpent = 0;
    settings.startTime = null;
    chrome.storage.local.set({ settings });
  }
});