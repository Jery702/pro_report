"use strict"
//map
var map, centerMarker, geocoder;

var inp1 = document.getElementById("inp1").value;
var inp2 = document.getElementById("inp2").value;
console.log(inp1);

map = new qq.maps.Map(document.getElementById("mapContainer"), {
    center: new qq.maps.LatLng(inp2,inp1),
    zoom: 12,
    mapTypeControl: false,
    zoomControl: false,
    panControl: false,
    scaleControl: true, scaleControlOptions: {
        position: qq.maps.ControlPosition.BOTTOM_RIGHT
    }
});

var marker = new qq.maps.Marker({
    position:new qq.maps.LatLng(inp2,inp1),
    map: map,
    icon: new qq.maps.MarkerImage("../../../../images/location.png"),
});

geocoder = new qq.maps.Geocoder();
geocoder.setComplete(function (result) {
    //if (result.detail.addressComponents.province == '陕西省') {
    $("#eventbelongcity").val(result.detail.addressComponents.city);
    $("#eventbelongcounty").val(result.detail.addressComponents.district);
    $("#eventbelongtown").val(result.detail.addressComponents.street);
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
geocoder.setError(function () {
    layer.closeAll();
    layer.open({
        time: 2,
        content: "地址解析失败"
    });
});

qq.maps.event.addListener(map, 'click', function (event) {
    var latlng = event.latLng;
    $("#longitude").val(latlng.getLng());
    $("#latitude").val(latlng.getLat());
    centerMarker.setPosition(latlng);
    map.panTo(latlng);
    startGeocoder(latlng);
});

var startGeocoder = function (latlng) {
    layer.open({
        type: 2,
        time: 30,
        content: "地址解析...",
        shadeClose: false
    });
    geocoder.getAddress(latlng);
};
// var str = "120.199548178,30.3284554630001;120.199512845,30.328437324;120.198998746,30.328500568;120.198580017,30.3285270580001";
// var arr = str.split(";");
// var paths = [];
// for (var i = 0; i < arr.length; i++) {
//     var arr1 = arr[i].split(",");
//     var latlng = new qq.maps.LatLng(arr1[1], arr1[0]);
//     paths.push(latlng);
// }
// var polyline = new qq.maps.Polyline({
//     path:paths,
//     strokeColor: '#7df',
//     strokeWeight: 5,
//     map:map
// });

