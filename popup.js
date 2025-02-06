document.getElementById("addSite").addEventListener("click", () => {
  let site = document.getElementById("siteInput").value;
  if (site) {
    chrome.storage.local.get(["settings"], (data) => {
      let settings = data.settings;
      settings.blockedSites.push(site);
      chrome.storage.local.set({ settings }, updateUI);
    });
  }
});

function updateUI() {
  chrome.storage.local.get(["settings"], (data) => {
    let settings = data.settings;
    let siteList = document.getElementById("siteList");
    siteList.innerHTML = "";
    settings.blockedSites.forEach(site => {
      let li = document.createElement("li");
      li.textContent = site;
      siteList.appendChild(li);
    });
    
    let remainingTime = Math.max(0, settings.timeLimit - settings.timeSpent).toFixed(2);
    document.getElementById("remainingTime").textContent = remainingTime + " minutes left";
  });
}

document.addEventListener("DOMContentLoaded", updateUI);
