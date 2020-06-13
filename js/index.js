
var map;
var markers = [];
var infoWindow;
function initMap() {
    var myLatLng = { lat: 34.063380, lng: -118.358080 }
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 8
    });
    /*var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!'
    });*/
    infoWindow = new google.maps.InfoWindow();
    searchStores();
    //displayStores();
    //showStoresMarkers();
    //setOnClickListener();
}

function searchStores(){
    var foundStores = [];
    var zipCode = document.getElementById('zip-code-input').value;
    if(zipCode){
        stores.forEach(function(store){
            var postalCode = store.address.postalCode.substring(0,5);
            if(postalCode == zipCode){
                foundStores.push(store);
            }
        });
    }
    else{
        foundStores=stores;
    }    
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}

function clearLocations(){
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}

function setOnClickListener(){
    
    var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(elem,index){
        elem.addEventListener('click', function(){
            google.maps.event.trigger(markers[index], 'click');
        })
    });
}

function displayStores(stores) {
    var storesHtml = "";
    stores.forEach(function (store) {
        var address = store.addressLines;
        var phoneNumber = store.phoneNumber;
        storesHtml += `<div class="store-container">
        <div class="store-info-container">
            <div class="store-address">
                <span>${address[0]}</span>
                <span>${address[1]}</span>
            </div>
            <div class="store-phone-number">
                <i class="fas fa-phone-alt"></i> ${phoneNumber}
            </div>
        </div>
        <div class="store-more-info-container">
            <i class="fas fa-ellipsis-v"></i>
        </div>
    </div>`;
    });
    document.querySelector('.store-list').innerHTML = storesHtml;

}

function showStoresMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();
    stores.forEach(function (store, index) {
        var latlng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude);
        var name = store.name;
        var address = store.addressLines[0];
        var openStatus = store.openStatusText;
        var phone = store.phoneNumber;
        bounds.extend(latlng);
        createMarker(latlng, name, address, phone, openStatus, index);
    });
    map.fitBounds(bounds);
}

function createMarker(latlng, name, address, phone, openStatus, index) {
    console.log(address);
    var url = "https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(address);
    console.log(url);
    var html = `<div class="nameOpenContainer">
                    <span class="name"><b>${name}</b></span>
                    <span class="open">${openStatus}</span>
                </div>
                <div class="phoneLocationContainer">
                    <span><i class="fas fa-location-arrow"></i><a href=${url} target="_blank">${address}</a></span>
                    <span><i class="fas fa-phone-alt"></i>${phone}</span>
                </div>`;
    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: `${index+1}`
    });
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker);
}