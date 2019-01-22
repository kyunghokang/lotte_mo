<%@ page language="java" contentType="text/html;charset=utf-8"%>
<!doctype html>
<html lang="ko">
<head>
	<meta charset="utf-8">
	<title>스토리지공유</title>
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="pragma" content="no-cache">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
	<meta name="format-detection" content="telephone=no">
	<script>
	// Get URL Parameters
	function getUrlParams() {
		var params = {};

		if (location.search) {
			var parts = location.search.substring(1).split('&');

			for (var i = 0; i < parts.length; i++) {
				var nv = parts[i].split('=');
				if (!nv[0]) continue;
				params[nv[0]] = nv[1] || null;
			}
		}
		return params;
	}

	// HTTP와 HTTPS 간 sessionStorage, localStorage 공유가 되지 않아 강제로 세팅해 주는 Function
	function setStorage(type, key, val) {
		//sessionStorage.setItem(key, value);
		//localStorage.setItem(key, value);

		if (!type || !key || !val) {
			return false;
		}

		if (type == "local") {
			try {
				localStorage.setItem(key, val);
			} catch (e) {}
		} else {
			try {
				sessionStorage.setItem(key, val);
			} catch (e) {}
		}
	}

	function findSetItem() {
		var params = getUrlParams(),
			storageType = params.type ? params.type : "session",
			storageKey = params.key,
			storageVal = params.val;

		if (!storageKey || !storageVal) {
			return false;
		}

		if (storageType.indexOf("local") > -1) {
			storageType = "local";
		} else {
			storageType = "session";
		}

		setStorage(storageType, storageKey, storageVal);
	}

	findSetItem();
	</script>
</head>
<body>
</body>
</html>