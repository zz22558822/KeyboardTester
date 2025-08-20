// 全域變數，用於儲存按鍵按下的時間點
let keyDownTime = 0;

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
});