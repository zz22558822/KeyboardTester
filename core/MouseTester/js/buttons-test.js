// 確保在 DOM 載入完成後才執行腳本
window.addEventListener('DOMContentLoaded', function() {
    // down 和 up 變數用於追蹤滑鼠按下的按鈕狀態，這是判斷按鈕的核心邏輯
    let down = 0;
    let up = 0;

    // 處理滑鼠按鈕按下事件
    document.addEventListener('mousedown', function(e) {
        // 利用 e.buttons 屬性和 down 變數的差值，來判斷是哪個按鈕被按下
        let activeButtons = e.buttons;
        let currentButton = activeButtons - down;
        
        // 移除所有類別，並為對應的按鈕元素新增 'active' 類別，呈現「按下」的視覺效果
        let buttonElement = document.getElementById('button-' + currentButton);
        if (buttonElement) {
            buttonElement.classList.remove('active', 'visited', 'non-active');
            buttonElement.classList.add('active');
        }
        down = activeButtons;
    });

    // 處理滑鼠按鈕釋放事件
    document.addEventListener('mouseup', function(e) {
        // 利用 down 和 up 變數的差值，來判斷是哪個按鈕被釋放
        up = e.buttons;
        let disabledButton = down - up;

        // 移除所有類別，並為對應的按鈕元素新增 'visited' 類別，呈現「點擊過」的視覺效果
        let buttonElement = document.getElementById('button-' + disabledButton);
        if (buttonElement) {
            buttonElement.classList.remove('active', 'visited', 'non-active');
            buttonElement.classList.add('visited');
        }
        down = up;
    });

    // 選取 ID 為 'mouse-container' 的元素，用於滾輪事件和滑鼠進出事件
    let mouseContainer = document.getElementById('mouse-container');
    
    // 使用原生綁定事件，防止右鍵選單和滑鼠按鈕的預設行為
    // prevent 函式負責阻止這些行為
    document.addEventListener('contextmenu', prevent, { passive: false });
    document.addEventListener('mousedown', prevent, { passive: false });
    document.addEventListener('mouseup', prevent, { passive: false });

    // 用於管理滾輪效果計時器的變數
    let scrollingUp, scrollingDown;

    // 處理滑鼠滾輪事件
    mouseContainer.addEventListener('wheel', function(e) {
        // 根據 e.deltaY 判斷滾動方向
        if (e.deltaY < 0) {
            // 如果向上滾動，為對應元素新增 'active' 類別，並在 200ms 後切換為 'visited'
            let scrollUpElement = document.getElementById('scroll-up');
            if (scrollUpElement) {
                scrollUpElement.classList.remove('active', 'visited', 'non-active');
                scrollUpElement.classList.add('active');
            }
            window.clearTimeout(scrollingUp);
            scrollingUp = window.setTimeout(function() {
                if (scrollUpElement) {
                    scrollUpElement.classList.remove('active', 'visited', 'non-active');
                    scrollUpElement.classList.add('visited');
                }
            }, 200);
        } else if (e.deltaY > 0) {
            // 如果向下滾動，邏輯相同
            let scrollDownElement = document.getElementById('scroll-down');
            if (scrollDownElement) {
                scrollDownElement.classList.remove('active', 'visited', 'non-active');
                scrollDownElement.classList.add('active');
            }
            window.clearTimeout(scrollingDown);
            scrollingDown = window.setTimeout(function() {
                if (scrollDownElement) {
                    scrollDownElement.classList.remove('active', 'visited', 'non-active');
                    scrollDownElement.classList.add('visited');
                }
            }, 200);
        }
    }, { passive: false });

    // 阻止事件預設行為的核心函式
    function prevent(e) {
        e.preventDefault();
    }
    
    // 定義滾動事件選項，確保能阻止預設滾動
    let wheelOpt = { passive: false };
    let wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

    // 禁用頁面滾動
    function disableScroll() {
        window.addEventListener('DOMMouseScroll', prevent, false);
        window.addEventListener(wheelEvent, prevent, wheelOpt);
        window.addEventListener('touchmove', prevent, wheelOpt);
    }

    // 啟用頁面滾動
    function enableScroll() {
        window.removeEventListener('DOMMouseScroll', prevent, false);
        window.removeEventListener(wheelEvent, prevent, wheelOpt); 
        window.removeEventListener('touchmove', prevent, wheelOpt);
    }
    
    // 透過滑鼠進出 'mouse-container' 區域，來觸發禁用或啟用頁面滾動的功能
    mouseContainer.addEventListener('mouseover', disableScroll);
    mouseContainer.addEventListener('mouseout', enableScroll);
});