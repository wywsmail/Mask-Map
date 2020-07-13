// var map = L.map('map', {
//   // center: [25.079026, 121.592525],
//   zoom: 19
// });

// 將 變數 map 導入 id 'map' 內建立地圖



var map = L.map('map', {
  Zoom: 20,
  zoomControl: false
});

// 載入圖資
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.control.zoom({
  position: "topright"
}).addTo(map);

// 設定監測使用者位置
map.locate({
  setView: true,
  watch: true,
  maxZoom: 19
});

// 設定 icon 顏色 使用 for迴圈寫法建立
var icons = [];
var createIcon = function (colors) {
  for (i = 0; i < colors.length; i++) {
    icons.push(new L.Icon({
      iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${colors[i]}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    }))
  }
  return icons
}
createIcon(['green', 'red', 'blue']);

// 載入效能插件
var markers = new L.MarkerClusterGroup().addTo(map);



function renderPage() {
  for (let i = 0; data.length > i; i++) {
    markers.addLayer(L.marker([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]], {
      icon: icons[2]
    }).bindPopup(`
      <h2>${data[i].properties.name}</h2>
      <p>${data[i].properties.address}</p>
      <p>${data[i].properties.phone}</p>
      <p>${data[i].properties.note}</p>
      <p>大人口罩：${data[i].properties.mask_adult}</p>
      <p>兒童口罩：${data[i].properties.mask_child}</p>
      `));
    // add more markers here...
    // L.marker().addTo(map)
    //   )
  }
  map.addLayer(markers);
}

// 設定 icon 顏色 使用 for迴圈寫法建立
var icons = [];
var createIcon = function (colors) {
  for (i = 0; i < colors.length; i++) {
    icons.push(new L.Icon({
      iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${colors[i]}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    }))
  }
  return icons
}
createIcon(['green', 'red', 'blue']);

// 載入效能插件
var markers = new L.MarkerClusterGroup().addTo(map);

// 載入健保署資料，並將資料存成全域變數



const xhr = new XMLHttpRequest();
xhr.open('get', 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json', true);
xhr.send(null);
data = [];
xhr.onload = function getData() {
  data = JSON.parse(xhr.responseText).features;
  console.log(data);
  renderPage();
  showCity();
}

//利用健保署資料取得經緯度將藥局以座標方式顯示
function renderPage() {
  for (let i = 0; data.length > i; i++) {
    markers.addLayer(L.marker([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]], {
      icon: icons[2]
    }).bindPopup(`
      <h3>${data[i].properties.name}</h3>
      <p>${data[i].properties.address}</p>
      <p>${data[i].properties.phone}</p>
      <p>${data[i].properties.note}</p>
      <div class="popmask d-flex">
        <a class="mask-adult">大人口罩：${data[i].properties.mask_adult}</a>
        <a class="mask-child">兒童口罩：${data[i].properties.mask_child}</a>
      </div>
      
      `));
    // add more markers here...
    // L.marker().addTo(map)
    //   )
  }
  map.addLayer(markers);
}

//連結 DOM 元素
let cityDOM = document.querySelector(".city");
let townDOM = document.querySelector(".town");
let pharmacyDOM = document.querySelector(".pharmacylist");

cityDOM.addEventListener('click', showTown, false);
townDOM.addEventListener('click', showPharmacy, false);




function showCity() {
  let cityList = [];
  data.forEach(function (item) {
    cityList.push(item.properties.county);
  })
  let cityAll = Array.from(new Set(cityList));
  // console.log(cityAll);
  let citySelect = '<option value="-- 請選擇行政區 --" disabled="disabled">-- 請選擇行政區 --</option>';
  cityAll.forEach(function (item) {
    if (item !== '') {
      citySelect += `<option value="${item}">${item}</option>`;
    }
  })
  cityDOM.innerHTML = citySelect;
  townDOM.innerHTML = '<option value = "-- 請選擇鄉鎮 --" disabled="disabled"> --請選擇鄉鎮-- </option>';
}



function showTown(e) {
  let value = '';
  if (e.target.tagName != "A") {
    value = e.target.value;
  } else {
    value = e.target.textContent;
  }
  let cityList = [];
  let cityAll = [];
  data.forEach(function (item) {
    cityList.push(item.properties.county);
  })
  cityAll = Array.from(new Set(cityList));

  let townList = [];
  let townAll = [];

  data.forEach(function (item) {
    if (item.properties.county === value) {
      townList.push(item.properties.town);
    }
  });
  townAll = Array.from(new Set(townList));
  let townSelect = '';
  townAll.forEach(function (item) {
    if (item !== '') {
      townSelect += `<option value="${item}">${item}</option>`;
    }
  });
  townDOM.innerHTML = townSelect;
}

function showPharmacy(e) {
  let value = '';
  if (e.target.tagName != "A") {
    value = e.target.value;
  } else {
    value = e.target.textContent;
  }
  let pharmacyList = '';
  data.forEach(function (item) {
    if (item.properties.town === value) {
      // console.log(item.properties.name);
      pharmacyList += `
        <li class="pharmacy">
          <h3>${item.properties.name}</h3>
          <p>${item.properties.address}</p>
          <p>${item.properties.phone}</p>
          <div class="mask-arrow d-flex">
            <div class="maskNumber d-flex">
              <a href="#" class="mask-adult">成人口罩：${item.properties.mask_adult}</a>
              <a href="#" class="mask-child">兒童口罩：${item.properties.mask_child}</a>
            </div>
            <a href="#">
              <i class="fas fa-location-arrow arrow" data-lat="${item.geometry.coordinates[1]}" data-lng="${item.geometry.coordinates[0]}">
              </i>
            </a>
          </div>
        </li>`;
    }
  })
  pharmacyDOM.innerHTML = pharmacyList;

  let arrow = document.querySelectorAll(".arrow");
  // pharmacy.forEach(function (item) {
  //   item.addEventListener("click", move, false);
  // });
  arrow.forEach(function (item) {
    item.addEventListener('click', move, false);
  })
  // console.log(pharmacy);

}

function move(e) {
  // e.preventDefault();
  // if (e.target.nodeName !== "A"){  
  console.log(e.target.dataset.lat);
  console.log(e.target.dataset.lng);
  map.flyTo([e.target.dataset.lat, e.target.dataset.lng]);
  map.stopLocate();
  // map.openPopup();
  // map = L.map('map').setView([e.target.dataset.lat, e.target.dataset.lng], 14);
  // console.log(e.target.nodeName);
  // };
  // e.preventD00efault();
  // let position= [];
  // position.pust(e.dataset.)

}

// 設定系統抓取日期
let getDate = document.querySelector(".getDate");
let date = [new Date().getFullYear(), new Date().getMonth(), new Date().getUTCDate(), new Date().getDay()];

getDate.textContent = `西元 ${date[0]} 年 ${date[1] + 1} 月 ${date[2]} 日 星期 ${date[3]}`;


$(document).ready(function () {
  // 打開左側選單
  $('.sideBarClick').click(function (event) {
    $('body').toggleClass('switch');
  });
});

// 藥局名稱：data[i].properties.name
// 縣市：data[i].properties.county
// 鄉鎮：data[i].properties.town
// 里：data[i].properties.cunli
// 地址：data[i].properties.address
// 電話：data[i].properties.phone
// 成人口罩：data[i].properties.mask_adult
// 兒童口罩：data[i].properties.mask_child
// 最後更新時間：data[i].properties.updated
// 營業時間：data[i].properties.available
// 其他資訊：data[i].properties.note
// 經度：data[i].geometry.coordinates[0]
// 緯度：data[i].geometry.coordinates[1]
