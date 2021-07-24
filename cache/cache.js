let userCache = {},
	extCache = {};
const changes = new ChangesStack();
const getCache = async key => {
	if (typeof key != "object") key = [key];
	const prom = await new Promise(res => chrome.storage.sync.get(key, cache => res(cache)));
	[userCache, extCache] = [prom?.[hostname] ? prom[hostname] : {}, prom?.extCache ? prom.extCache : {}];
	return loadPrefs();
};

const setCache = key => {
	const newCache = {};
	newCache[key] = key == "extCache" ? extCache : userCache;
	chrome.storage.sync.set(newCache);
};

const removeCache = async key => {
	chrome.storage.sync.remove([key]);
};

let hostname = "";
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
	hostname = new URL(tabs[0].url).hostname;
	getCache([hostname, "extCache"]);
});

// The cache will become more useful when user login and authentication (Oauth) comes
