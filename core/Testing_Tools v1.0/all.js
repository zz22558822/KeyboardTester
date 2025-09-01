// 取得所有需要的 DOM 元素
const threshold = document.getElementById("threshold");
const thresholdValueElement = document.getElementById("thresholdValue");
const scrollUpElement = document.getElementById("scrollUp");
const scrollDownElement = document.getElementById("scrollDown");
const pollingRateElement = document.getElementById("pollingRate");

// 初始化雙擊閾值
let thresholdValue = threshold.value;

// 儲存按鍵狀態的陣列
const buttons = ["left", "middle", "right", "backward", "forward"].map(
    (button) => ({
        name: button.charAt(0).toUpperCase() + button.slice(1),
        elements: {
            totalDown: document.querySelector(`td.${button}:nth-child(2)`),
            totalDoubleDown: document.querySelector(`td.${button}:nth-child(3)`),
            minDownDownDelta: document.querySelector(`td.${button}:nth-child(4)`),
        },
        totalDown: 0,
        totalDoubleDown: 0,
        minDownDownDelta: Infinity,
        lastDownTimeStamp: 0,
        first: true,
    })
);

// 處理滑鼠按下事件
function handleMousedown(ev) {
    // 檢查點擊的目標是否為滑桿
    if (ev.target.id === "threshold") {
        return; // 如果是滑桿，則不阻止預設行為，直接結束函式
    }

    // 阻止預設行為，如右鍵選單
    ev.preventDefault();
    ev.stopPropagation();

    const button = buttons[ev.button];
    if (!button) return;

    if (!button.first) {
        const delta = ev.timeStamp - button.lastDownTimeStamp;
        if (delta < thresholdValue) {
            button.elements.totalDoubleDown.textContent = ++button.totalDoubleDown;
            if (button.totalDoubleDown === 1) {
                button.elements.totalDoubleDown.classList.add("warning");
            }
        }
        if (delta < button.minDownDownDelta) {
            button.elements.minDownDownDelta.textContent = delta.toFixed(1);
            button.minDownDownDelta = delta;
        }
        console.log(
            `%c${button.name.padEnd(8)} | Down - Down Δ | ${delta.toFixed(1).padStart(7)} ms`,
            "color: black; background-color: white"
        );
    }
    button.first = false;
    button.elements.totalDown.textContent = ++button.totalDown;
    button.lastDownTimeStamp = ev.timeStamp;
}

// 處理滑鼠放開事件
function handleMouseup(ev) {
    if (ev.target.id === "threshold") {
        return;
    }
    ev.preventDefault();
    ev.stopPropagation();
}

// 滾輪事件處理
let totalScrollUp = 0;
let totalScrollDown = 0;

function handleWheel(ev) {
    if (ev.target.id === "threshold") {
        return;
    }
    ev.preventDefault();
    ev.stopPropagation();

    if (ev.wheelDeltaY > 0) {
        scrollUpElement.textContent = ++totalScrollUp;
    } else if (ev.wheelDeltaY < 0) {
        scrollDownElement.textContent = ++totalScrollDown;
    }
}

// 輪詢率計算
let counts = 0;
let lastRefresh = performance.now();
const UPDATE_INTERVAL = 200;

function handlePointermove(ev) {
    counts += ev.getCoalescedEvents().length;
    const delta = ev.timeStamp - lastRefresh;

    if (delta >= UPDATE_INTERVAL) {
        pollingRateElement.textContent = Math.round((counts * 1000) / delta);
        counts = 0;
        lastRefresh = ev.timeStamp;
    }
}

// 監聽按鍵、滾輪、移動事件
document.addEventListener("mousedown", handleMousedown);
document.addEventListener("mouseup", handleMouseup);
document.addEventListener("wheel", handleWheel);
document.addEventListener("pointermove", handlePointermove);

// 雙擊閾值調整
threshold.addEventListener("input", () => {
    thresholdValue = threshold.value;
    thresholdValueElement.textContent = thresholdValue;
});

// 阻止右鍵選單
window.addEventListener("contextmenu", (ev) => {
    if (ev.target.id === "threshold") {
        return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    return false;
});