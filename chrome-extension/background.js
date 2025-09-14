const REFRESH_INTERVAL_MINUTES = 10; // change as needed

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && tab.url.includes("dashboard.vapi.ai") && changeInfo.status === "complete") {
        console.log("[Rehan VS] Dashboard loaded, will refresh in", REFRESH_INTERVAL_MINUTES, "minutes");
        setTimeout(() => {
            chrome.tabs.reload(tabId);
        }, REFRESH_INTERVAL_MINUTES * 60 * 1000);
    }
});
