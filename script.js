// 事故資料庫（台灣版）
const accidentInfo = {
    acc1: { title: "花蓮外海觸礁事故", desc: "船舶受到黑潮影響偏航，最後於花蓮外海觸礁。" },
    acc2: { title: "巴士海峽漁船火災", desc: "漁船引擎室起火，隨後於巴士海峽求救停船。" },
    acc3: { title: "澎湖外海碰撞事故", desc: "兩艘船於濃霧中視線不良導致碰撞。" }
};

// 船被點擊
document.querySelectorAll(".ship").forEach(ship => {
    ship.addEventListener("click", () => {
        let target = document.getElementById(ship.dataset.target);
        animateShipAlongCurve(ship, target);
        showInfo(ship.dataset.target);
    });
});

// === 船沿曲線航線移動 ===
function animateShipAlongCurve(ship, target) {

    const start = ship.getBoundingClientRect();
    const end = target.getBoundingClientRect();

    // 控制點，用來製作彎曲航線（自動置中提高）
    const controlX = (start.left + end.left) / 2;
    const controlY = Math.min(start.top, end.top) - 200;

    // 建立 SVG 路線
    let svg = document.getElementById("routes");
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    let d = `M ${start.left} ${start.top} Q ${controlX} ${controlY}, ${end.left} ${end.top}`;
    path.setAttribute("d", d);
    path.setAttribute("stroke", "yellow");
    path.setAttribute("stroke-width", "4");
    path.setAttribute("fill", "none");
    path.setAttribute("id", "route-" + ship.id);
    svg.appendChild(path);

    // 路線動畫
    let length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.style.transition = "stroke-dashoffset 3s linear";
    setTimeout(() => path.style.strokeDashoffset = "0", 50);

    // 船隻移動
    let t = 0;
    let interval = setInterval(() => {
        t += 0.01;
        if (t > 1) { clearInterval(interval); return; }

        let pos = path.getPointAtLength(length * t);
        ship.style.left = pos.x + "px";
        ship.style.top = pos.y + "px";
    }, 20);
}

// 顯示事故資訊
function showInfo(id) {
    document.getElementById("infoBox").classList.remove("hidden");
    document.getElementById("accTitle").innerText = accidentInfo[id].title;
    document.getElementById("accDesc").innerText = accidentInfo[id].desc;
}

// 關閉
function closeInfo() {
    document.getElementById("infoBox").classList.add("hidden");
}
