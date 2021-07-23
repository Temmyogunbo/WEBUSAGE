export const set = ({ key, value }: { key: string; value: any }) => {
  return new Promise((resolve, reject) => {
    if(!key || !value) {
      reject('Key/value missing');
    }
    chrome.storage.local.set({ [key]: value }, () => {
      console.log('Stored name: ' + value);
      resolve({ key, value });
    });
  });
};

export const get = (key: string) => {
  return new Promise((resolve, reject) => {
    if(!key) {
      reject('Key missing');
    }
    chrome.storage.local.get([key], (result) => {
      if (result) {
        resolve(result);
      }
      reject('No result found');
    });
  });
};
