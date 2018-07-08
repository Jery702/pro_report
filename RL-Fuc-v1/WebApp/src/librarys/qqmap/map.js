"use strict"
//map
var map, centerMarker, geocoder;

map = new qq.maps.Map(document.getElementById("mapContainer"), {
	mapTypeControl: false,
	zoomControl: false,
	panControl: false,
	scaleControl: true,
	scaleControlOptions: {
		position: qq.maps.ControlPosition.BOTTOM_RIGHT
	}
});

centerMarker = new qq.maps.Marker({
	map: map,
	visible: true,
	icon: new qq.maps.MarkerImage("../../../images/bases/location.png"),
	draggable: false
});

geocoder = new qq.maps.Geocoder();
geocoder.setComplete(function(result) {
	//if (result.detail.addressComponents.province == '陕西省') {
	$("#regionName").val(result.detail.addressComponents.district);
	$("#address").val(result.detail.address);
	layer.closeAll();
	// } else {
	//     layer.closeAll();
	//     layer.open({
	//         time: 2,
	//         content: "不能举报外省污染事件"
	//     });
	// }
});
geocoder.setError(function() {
	layer.closeAll();
	layer.open({
		time: 2,
		content: "地址解析失败"
	});
});

qq.maps.event.addListener(map, 'click', function(event) {
	var latlng = event.latLng;
	$("#longitude").val(latlng.getLng());
	$("#latitude").val(latlng.getLat());
	centerMarker.setPosition(latlng);
	map.panTo(latlng);
	startGeocoder(latlng);
});

var startGeocoder = function(latlng) {
	layer.open({
		type: 2,
		time: 30,
		content: "地址解析...",
		shadeClose: false
	});
	geocoder.getAddress(latlng);
};

//wx
wx.ready(function() {
	//location
	wx.getLocation({
		type: 'gcj02',
		success: function(res) {
			$("#longitude").val(res.longitude);
			$("#latitude").val(res.latitude);
			setTimeout(function() {
				var latlng = new qq.maps.LatLng(res.latitude, res.longitude);
				centerMarker.setPosition(latlng);
				map.zoomTo(12);
				map.panTo(latlng);
				startGeocoder(latlng);
			}, 800);
		},
		cancel: function(res) {
			setTimeout(function() {
				var latlng = new qq.maps.LatLng(30.273745, 108.956106);
				$("#latitude").val(30.273745);
				$("#longitude").val(108.956106);
				centerMarker.setPosition(latlng);
				map.panTo(latlng);
				startGeocoder(latlng)
			}, 800);
		}
	});

	$("#getgeo").click(function() {
		wx.getLocation({
			type: 'gcj02',
			success: function(res) {
				$("#longitude").val(res.longitude);
				$("#latitude").val(res.latitude);
				setTimeout(function() {
					var latlng = new qq.maps.LatLng(res.latitude, res.longitude);
					centerMarker.setPosition(latlng);
					map.zoomTo(12);
					map.panTo(latlng);
					startGeocoder(latlng);
				}, 800);
			},
			cancel: function(res) {
				setTimeout(function() {
					var latlng = new qq.maps.LatLng(30.273745, 108.956106);
					$("#latitude").val(30.273745);
					$("#longitude").val(108.956106);
					centerMarker.setPosition(latlng);
					map.panTo(latlng);
					startGeocoder(latlng)
				}, 800);
			}
		});
	});
});

wx.error(function(res) {
	alert(res.errMsg);
});