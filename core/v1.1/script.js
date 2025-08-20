// 全域變數，用於儲存按鍵按下的時間點
let keyDownTime = 0;
// 歷史紀錄陣列
const keyHistory = [];
const MAX_HISTORY = 10; // 最多紀錄10筆

// 監聽鍵盤按下的事件
document.addEventListener('keydown', (event) => {
    // 判斷是否為會重新整理或影響頁面狀態的功能鍵
    if (event.key === 'F5' || event.key === 'F12' || event.key === 'F11') {
        // 如果是這類按鍵，直接終止函式，不進行紀錄
        return;
    }

    // 阻止重複觸發，確保只在第一次按下時紀錄時間
    if (event.repeat) {
        return;
    }
    keyDownTime = Date.now();

    // 獲取並顯示按下的鍵
    const keyDisplay = document.getElementById('keyDisplay');
    if (keyDisplay) {
        // 判斷按下的鍵是否為單個字母，若是則轉為大寫
        const key = event.key;
        if (key.length === 1 && key.match(/[a-z]/i)) {
            keyDisplay.textContent = key.toUpperCase();
        } else {
            // 如果不是單個字母，例如：'Space'、'ArrowUp'、'Shift' 等，則保持原樣
            keyDisplay.textContent = key === ' ' ? 'Space' : key;
        }
    }

    // 獲取並顯示鍵碼 (keyCode) - 雖然已不推薦使用，但在舊版瀏覽器中仍常見
    const keyCodeDisplay = document.getElementById('keyCodeDisplay');
    if (keyCodeDisplay) {
        keyCodeDisplay.textContent = event.keyCode;
    }

    // 獲取並顯示鍵值 (code) - 這是較新的標準
    const keyValDisplay = document.getElementById('keyValDisplay');
    if (keyValDisplay) {
        keyValDisplay.textContent = event.code;
    }
});

// 監聽鍵盤放開的事件，計算時長並紀錄
document.addEventListener('keyup', (event) => {
    // 檢查 keyDownTime 是否有效，如果為 0，表示沒有正確的按鍵按下事件，則直接忽略
    if (keyDownTime === 0) {
        return;
    }
    
    // 判斷是否為會重新整理或影響頁面狀態的功能鍵
    if (event.key === 'F5' || event.key === 'F12' || event.key === 'F11') {
        // 如果是這類按鍵，直接終止函式，不進行紀錄
        return;
    }

    const keyUpTime = Date.now();
    const duration = keyUpTime - keyDownTime;
    
    // 顯示按鍵時長
    const durationDisplay = document.getElementById('durationDisplay');
    if (durationDisplay) {
        durationDisplay.textContent = `${duration} 毫秒`;
    }

    // 獲取本次按鍵資訊
    const keyText = event.key.length === 1 && event.key.match(/[a-z]/i) 
                    ? event.key.toUpperCase() 
                    : (event.key === ' ' ? 'Space' : event.key);

    // 獲取按鍵放開的時間
    const now = new Date();
    // 格式化為 HH:MM:SS
    const timeString = now.toLocaleTimeString('zh-TW', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // 建立一個紀錄物件
    const historyEntry = {
        key: keyText,
        keyCode: event.keyCode,
        code: event.code,
        duration: duration,
        time: timeString
    };

    // 將新紀錄加入陣列最前端
    keyHistory.unshift(historyEntry);

    // 如果超過最大紀錄數量，則移除最舊的紀錄
    if (keyHistory.length > MAX_HISTORY) {
        keyHistory.pop();
    }

    // 更新歷史紀錄列表
    updateHistoryList();

    // 在紀錄完成後，將 keyDownTime 重設為 0，以便下次重新紀錄
    keyDownTime = 0;
});

// 更新歷史紀錄列表的函式
function updateHistoryList() {
    const historyList = document.getElementById('historyList');
    if (historyList) {
        // 清空現有列表
        historyList.innerHTML = '';
        // 重新渲染每一筆紀錄
        keyHistory.forEach(entry => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="history-item">
                    <span class="history-label">鍵</span>
                    <span class="history-value">${entry.key}</span>
                </div>
                <div class="history-item">
                    <span class="history-label">碼</span>
                    <span class="history-value">${entry.keyCode}</span>
                </div>
                <div class="history-item">
                    <span class="history-label">時長</span>
                    <span class="history-value">${entry.duration}ms</span>
                </div>
                <div class="history-item">
                    <span class="history-label">時間</span>
                    <span class="history-value">${entry.time}</span>
                </div>
            `;
            historyList.appendChild(li);
        });
    }
}