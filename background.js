chrome.webRequest.onBeforeSendHeaders.addListener(
	function(details) {
		details.requestHeaders.push({name: 'Sec-GPC', value: '1'});
		return {requestHeaders: details.requestHeaders};
	},
	{urls: ['<all_urls>']},
	['blocking', 'requestHeaders', 'extraHeaders']
);