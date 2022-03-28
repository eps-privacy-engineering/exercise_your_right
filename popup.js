window.onload = function () {
	chrome.storage.sync.get(['gpcKey'], function(result) {
		console.log('GPC value currently is ' + result.gpcKey);
		document.getElementById("gpc-received").append(result.gpcKey);
	});


	document.getElementById('ccpa-button').onclick = function () {
		let text0 = localStorage.getItem("testJSON");
		alert(text0);
		let obj0 = JSON.parse(text0);
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
					var keyName=url.hostname;
					alert(obj0[keyName]);
					alert("this key name in popup is "+keyName)
					chrome.storage.sync.get(['map'], function(result) {
						alert('Privacy info value currently is ' + result.map[keyName]);
						// alert('Privacy info value currently is ' + result.optOutKey)
						if (result.map[keyName] == null){
							const para = document.createElement('p');
							para.innerHTML = "No privacy information available.";
							document.body.appendChild(para);
						}
						else {
							console.log('test href');
							window.open(result.map[keyName], "_blank");
						}
					});
				} else {

				}
			}
		);
	}
}
