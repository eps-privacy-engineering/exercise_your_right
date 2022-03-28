window.onload = function () {
	chrome.storage.sync.get(['gpcKey'], function(result) {
		console.log('GPC value currently is ' + result.gpcKey);
		document.getElementById("gpc-received").append(result.gpcKey);
	});


	document.getElementById('ccpa-button').onclick = function () {
		chrome.tabs.query(
			{
				currentWindow: true,    // currently focused window
				active: true            // selected tab
			},
			function (foundTabs) {
				if (foundTabs.length > 0) {
					var nowPage = foundTabs[0].url;
					console.log(foundTabs[0])
					var url = new URL(nowPage)
					var keyName = 'optOutKey_'+url.hostname
					alert("this key name in popup is "+keyName)
					chrome.storage.sync.get([keyName], function(result) {
						alert('Privacy info value currently is ' + result.keyName);
						// alert('Privacy info value currently is ' + result.optOutKey)
						if (result.keyName == null){
							const para = document.createElement('p');
							para.innerHTML = "No privacy information available.";
							document.body.appendChild(para);
						}
						else {
							console.log('test href');
							window.open(result.keyName, "_blank");
						}
					});
				} else {

				}
			}
		);
	}
}
