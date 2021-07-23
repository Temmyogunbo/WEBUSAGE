const getCurrentTab = async () => {
  const queryInfo = { active: true, lastFocusedWindow: true };

  return new Promise((resolve, reject) => {
    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        if (tabs[0]) {
          resolve(tabs[0]);
        }
        reject('No tab found');
      });
  });
};

const getTab = async (tabId: number) => {
  return new Promise((resolve, reject) => {
    chrome.tabs &&
      chrome.tabs.get(tabId, (tab) => {
        console.log('tab gotten', tab, chrome.tabs);
        if (tab) return resolve(tab);
        reject({ error: 'An error occur' });
      });
  });
};
enum status {
  LOADING = 'loading',
  COMPLETE = 'complete',
  UNLOADED = 'unloaded',
}

export const Tabs = {
  getCurrentTab,
  getTab,
  status,
};
