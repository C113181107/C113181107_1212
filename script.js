// 初始化地圖（中心點設台灣）
var map = L.map('map').setView([23.7, 121], 7);

// 載入 OpenStreetMap 圖磚（免費）
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// 船隻圖示
var shipIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/69/69906.png",
    iconSize: [40, 40]
});

// === 港口(起點)座標 ===
const ships = {
    ship1: { marker: null, pos: [22.62, 120.30], target: "acc1" }, // 高雄港
    ship2: { marker: null, pos: [24.26, 120.54], target: "acc2" }, // 台中港
    ship3: { marker: null, pos: [25.15, 121.75], target: "acc3" }  // 基隆港
};

// === 事故位置 ===
const accidents = {
    acc1: { pos: [23.8, 122.1], title: "花蓮外海觸礁", desc: "黑潮影響導致偏航觸礁。" },
    acc2: { pos: [21.9, 121.3], title: "巴士海峽火災", desc: "引擎室火災後停船求救。" },
    acc3: { pos: [23.6, 119.1], title: "澎湖外海碰撞", desc: "濃霧中視線不佳造成碰撞。" }
};


// === 建立事故點（紅色脈衝） ===
Object.keys(accidents).forEach(id => {
    L.circleMarker(accidents[id].pos, {
        radius: 10,
        color: "red",
        fillColor: "red",
        fillOpacity: 0.7
    }).addTo(map).on("click", () => {
        showInfo(id);
    });
});


// === 建立船隻 ===
Object.keys(ships).forEach(id => {
    let ship = ships[id];

    ship.marker = L.marker(ship.pos, { icon: shipIcon }).addTo(map);

    ship.marker.on("click", () => {
        animateShip(id);
        showInfo(ship.target);
    });
});


// === 顯示事故資訊 ===
function showInfo(id) {
    document.getElementById("infoBox").classList.remove("hidden");
    document.getElementById("accTitle").innerText = accidents[id].title;
    document.getElementById("accDesc").innerText = accidents[id].desc;
}

function closeInfo() {
    document.getElementById("infoBox").classList.add("hidden");
}



// === 船隻曲線航線動畫 ===
function animateShip(shipId) {
    let ship = ships[shipId];
    let start = ship.pos;
    let end = accidents[ship.target].pos;

    // 控制點（使航線產生弧度、往外海彎）
    let ctrl = [
        (start[0] + end[0]) / 2,
        Math.max(start[1], end[1]) + 1.5
    ];

    let t = 0;
    let interval = setInterval(() => {
        t += 0.01;
        if (t > 1) { clearInterval(interval); }

        // 二階貝茲曲線 Q(t)
        let lat =
            (1 - t) * (1 - t) * start[0] +
            2 * (1 - t) * t * ctrl[0] +
            t * t * end[0];

        let lng =
            (1 - t) * (1 - t) * start[1] +
            2 * (1 - t) * t * ctrl[1] +
            t * t * end[1];

        ship.marker.setLatLng([lat, lng]);
    }, 20);
}
