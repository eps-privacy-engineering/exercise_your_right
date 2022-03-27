window.onload = function () {
	chrome.storage.sync.get(['gpcKey'], function(result) {
		console.log('GPC value currently is ' + result.gpcKey);
		document.getElementById("gpc-received").append(result.gpcKey);
	});


	document.getElementById('ccpa-button').onclick = function () {
		chrome.storage.sync.get(['optOutKey'], function(result) {
			console.log('Privacy info value currently is ' + result.optOutKey);
			if (result.optOutKey == null){
				const para = document.createElement('p');
				para.innerHTML = "No privacy information available.";
				document.body.appendChild(para);
			}
		else {
				console.log('test href');
				window.open(result.optOutKey, "_blank");
			}
		});
	}
}
