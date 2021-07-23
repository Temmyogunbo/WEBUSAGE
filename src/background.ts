import { Storage, Tabs } from './backgound';
import { isChromeNewTabURL } from './lib/utils';
import { getParsedDate } from '@hours';
import {  CURRENT_TAB } from './constants';
import { updateTab } from './backgound/storage/index-db';
import { IdleState } from './types';

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    console.log(`tab update`, { tabId, tab, changeInfo });

    const currentTab: any = await Tabs.getCurrentTab();
    Storage.set({ key: CURRENT_TAB, value: currentTab });

    console.log(currentTab);

    const parsedDate = getParsedDate();

    if (
      currentTab?.active &&
      !isChromeNewTabURL(currentTab?.url) &&
      currentTab?.status === Tabs.status.COMPLETE
    ) {
      await Storage.addTab({ key: parsedDate, currentTab });
    }

    if (currentTab?.active && currentTab?.status === Tabs.status.COMPLETE) {
      await Storage.updateTab({
        key: parsedDate,
        currentTab,
      });
    }
  } catch (error) {
    console.log('An error ocur while trying to track website', error);
  }
});

chrome.browserAction.onClicked.addListener(() => {
  const url = chrome.runtime.getURL('./index.html');
  chrome.tabs.create({ url });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  try {
    const parsedDate = getParsedDate();
    console.log('tab changes', activeInfo);

    setTimeout(async () => {
      const currentTab: any = await Tabs.getTab(activeInfo.tabId);
      Storage.set({ key: CURRENT_TAB, value: currentTab });

      if (
        currentTab?.active &&
        !isChromeNewTabURL(currentTab?.url) &&
        currentTab?.status === Tabs.status.COMPLETE
      ) {
        await Storage.updateTab({ key: parsedDate, currentTab });
        //reactivate host when focus is received or tab is active
        await Storage.reActivateHost({ key: parsedDate, currentTab });
      }
    }, 1000);
  } catch (error) {
    console.log('Unable to track website when activated', error);
  }
});

chrome.idle.onStateChanged.addListener(async (idleState) => {
  // deactive host of the current and active tab when computer goes idle
  const parsedDate = getParsedDate();
  const currentTab = await Storage.get(CURRENT_TAB) as any;

  if (idleState === IdleState.active) {
    //reactivate host when focus is received or tab is active
    await Storage.reActivateHost({ key: parsedDate, currentTab: currentTab[CURRENT_TAB] });
  }
  if (idleState === IdleState.locked || idleState === IdleState.idle) {
    await updateTab({ key: parsedDate, currentTab: currentTab[CURRENT_TAB], idle: true });
  }
});
export {};
