// 事故資料
const accidentInfo = {
    acc1: { title: "油輪觸礁事故", desc: "強風浪導致船舶偏航，最終於此處觸礁並造成油污外洩。" },
    acc2: { title: "貨櫃船碰撞事故", desc: "航道視線不佳導致兩艘船相撞，造成大量貨櫃落海。" },
    acc3: { title: "漁船火災事故", desc: "引擎室電線短路，引發火勢並於此處求救停靠。" }
};

// 點擊船後觸發
document.querySelectorAll(".ship").forEach(ship => {
    ship.addEventListener("click", () => {
        let target = document.getElementById(ship.dataset.target);
        animateShipAlongCurve(ship, target);
        showInfo(ship.dataset.target);
    });
});

// 🚢 船沿曲線航道移動
function animateShipAlongCurve(ship, target) {

    const start = ship.getBoundingClientRect();
    const end = target.getBoundingClientRect();

    // 控制點 (決定曲線形狀)
    const controlX = (start.left + end.left) / 2;
    const controlY = start.top - 200;

    // 建立 SVG 路線
    let svg = document.getElementById("routes");
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    let d = `M ${start.left} ${start.top} Q ${controlX} ${controlY}, ${end.left} ${end.top}`;
    path.setAttribute("d", d);
    path.setAttribute("stroke", "yellow");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("fill", "none");
    path.setAttribute("id", "route-" + ship.id);
    svg.appendChild(path);

    // 路線動畫
    let length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.style.transition = "stroke-dashoffset 3s linear";
    setTimeout(() => path.style.strokeDashoffset = "0", 50);

    // 船移動動畫（沿著 path）
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
function closeInfo() {
    document.getElementById("infoBox").classList.add("hidden");
}
