console.log("Hi2");

chrome.webRequest.onBeforeSendHeaders.addListener(
	function(details) {
		details.requestHeaders.push({name: 'Sec-GPC', value: '1'});
		return {requestHeaders: details.requestHeaders};
	},
	{urls: ['<all_urls>']},
	['blocking', 'requestHeaders', 'extraHeaders']
);
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

console.log("CALL GET~s2");
console.log(httpGet("https://www.xfinity.com/privacy/manage-preference"));
console.log("CALL GET~e2");


