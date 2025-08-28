'use strict';

const keyboardMode = document.getElementById('keyboard-mode'); //鍵盤顯示區塊
const mouseMode = document.getElementById('mouse-mode'); //滑鼠顯示區塊
const clearOnSwitchCheckbox = document.getElementById('clearOnSwitchCheckbox'); //清除模式開關

// 新增一個變數來追蹤目前的模式
let isMouseModeActive = false;
// --------------------- 模式切換 ---------------------
const btnKeyboard = document.querySelector('.btn-keyboard-mode')
const btnMouse = document.querySelector('.btn-mouse-mode')

// 滑鼠模式
function showMouseMode() {
  isMouseModeActive = true;
  keyboardMode.style.display = 'none';
  mouseMode.style.display = 'block';
  // 當切換模式時，取消鍵盤按鍵的計時
  clearKeyboardDisplay();
  // 清除觸發紀錄
  clearAllDisplays()
  // 按鈕顏色改變
  btnMouse.style.color = "var(--color-keycaps-legends)"
  btnKeyboard.style.color = "var(--color-keycaps-legends-accent)"
}
// 鍵盤模式
function showKeyboardMode() {
  isMouseModeActive = false;
  keyboardMode.style.display = 'flex';
  mouseMode.style.display = 'none';
  // 當切換模式時，取消鍵盤按鍵的計時
  clearKeyboardDisplay();
  // 清除觸發紀錄
  clearAllDisplays()
  // 按鈕顏色改變
  btnKeyboard.style.color = "var(--color-keycaps-legends)"
  btnMouse.style.color = "var(--color-keycaps-legends-accent)"
}

// --------------------- 主題切換 ---------------------
// 若不顯示的主題要註解掉否則會Error
const themes = {
  retro: document.querySelector('.retro'), //預設 復古風
  // navyBlue: document.querySelector('.navy-blue'), //海軍藍
  // cyberpunk: document.querySelector('.cyberpunk'), //賽博龐克
  cyberpunk2077: document.querySelector('.cyberpunk2077'), //電馭叛客
  eva01: document.querySelector('.eva-01'), // EVA 初號機
};

for (const theme in themes) {
  if (themes[theme]) {
    themes[theme].addEventListener('click', function () {
      changeTheme(themes[theme].className);
    });
  }
}

const initializeTheme = () => {
  const savedTheme = localStorage.getItem('currentTheme');
  if (savedTheme) changeTheme(savedTheme);
};

const changeTheme = function (themeName) {
  // 動態產生class 需要改名才能讀取 themes.css 的主題
  const themeCSS = 'theme--' + themeName;

  document.body.classList.remove(
    'theme--' + localStorage.getItem('currentTheme')
  );
  document.body.classList.add(themeCSS);
  localStorage.setItem('currentTheme', themeName);
};

// ------------------- 按鍵觸發相關 -------------------
// 新增變數來追蹤按鍵時長
let keyHistory = {};

// 取得新增的顯示元素
const keyDisplay = document.getElementById('keyDisplay');
const keyCodeDisplay = document.getElementById('keyCodeDisplay');
const codeDisplay = document.getElementById('codeDisplay');
const durationDisplay = document.getElementById('durationDisplay');

// 清除鍵盤顯示狀態的函式
function clearKeyboardDisplay() {
  for (const keyCode in keyHistory) {
    clearInterval(keyHistory[keyCode].timerId);
  }
  keyHistory = {};
  document.querySelectorAll('.key-pressing-simulation').forEach(el => {
    el.classList.remove('key-pressing-simulation');
  });
  keyDisplay.textContent = '-';
  keyCodeDisplay.textContent = '-';
  codeDisplay.textContent = '-';
  durationDisplay.textContent = '-';
}

const handleKeyPress = function (e) {
  // 當處於滑鼠模式時，不處理鍵盤事件
  if (isMouseModeActive) return;

  e.preventDefault();

  // 偵測 AltGr 按鍵被按下 (同時按下 Alt + Control)
  const isAltGr = e.key === 'AltGraph';

  // 如果按下 AltGr(右邊Alt)，忽略左 Control 鍵
  if (isAltGr) {
    document
      .querySelector('.' + 'controlleft')
      .classList.remove('key-pressing-simulation');

    document
      .querySelector('.' + 'controlleft')
      .classList.remove('key--pressed');
  }

  const keyElement = document.querySelector('.' + e.code.toLowerCase());

  if (e.type === 'keydown') {
    // 檢查按鍵是否已經按下，避免重複計時
    if (!keyHistory[e.code]) {
      keyHistory[e.code] = {
        startTime: Date.now(),
        timerId: null
      };

      // 更新顯示框內容
      // 判斷按下的鍵是否為單個字母，若是則轉為大寫
      const key = e.key;
      if (key.length === 1 && key.match(/[a-z]/i)) {
        keyDisplay.textContent = key.toUpperCase();
      } else {
        // 如果不是單個字母，例如：'Space'、'ArrowUp'、'Shift' 等
        // 檢查是否為 Space 鍵
        keyDisplay.textContent = key === ' ' ? 'Space' : key;
      }

      keyCodeDisplay.textContent = e.keyCode;
      codeDisplay.textContent = e.code;

      // 開始每 10 毫秒更新一次時長
      keyHistory[e.code].timerId = setInterval(() => {
        const duration = Date.now() - keyHistory[e.code].startTime;
        durationDisplay.textContent = duration;
      }, 10);
    }
    if (keyElement) {
        keyElement.classList.add('key-pressing-simulation');
    }
  } else if (e.type === 'keyup') {
    // 檢查按鍵是否已被計時
    if (keyHistory[e.code]) {
      // 停止計時器並顯示最終時長
      clearInterval(keyHistory[e.code].timerId);
      const duration = Date.now() - keyHistory[e.code].startTime;
      durationDisplay.textContent = duration;

      // 清除歷史紀錄
      delete keyHistory[e.code];
    }
    if (keyElement) {
      keyElement.classList.remove('key-pressing-simulation');
    }
  }

  if (keyElement && !keyElement.classList.contains('key--pressed')) {
    keyElement.classList.add('key--pressed');
  }

  // 處理特殊的 Meta/OS 按鈕
  if (keyElement && (e.key === 'Meta' || e.key === 'OS')) {
    keyElement.classList.remove('key-pressing-simulation');
  }
};

// 當視窗失去焦點時處理
const handleBlur = () => {
  // 當處於滑鼠模式時，不處理
  if (isMouseModeActive) return;

  clearKeyboardDisplay();
};

// --------------------- 滑鼠事件處理 ---------------------
// down 和 up 變數用於追蹤滑鼠按下的按鈕狀態，這是判斷按鈕的核心邏輯
let down = 0;
let up = 0;

const handleMouseDown = (e) => {
    // 當處於鍵盤模式時，不處理滑鼠事件
    if (!isMouseModeActive) return;

    // 利用 e.buttons 屬性和 down 變數的差值，來判斷是哪個按鈕被按下
    let activeButtons = e.buttons;
    let currentButton = activeButtons - down;
    let buttonElement = document.getElementById('button-' + currentButton);
    if (buttonElement) {
        // 移除所有類別，並為對應的按鈕元素新增 'active' 類別，呈現「按下」的視覺效果
        buttonElement.classList.remove('active', 'visited', 'non-active');
        buttonElement.classList.add('active');
    }
    down = activeButtons;
};

const handleMouseUp = (e) => {
    // 當處於鍵盤模式時，不處理滑鼠事件
    if (!isMouseModeActive) return;

    // 利用 down 和 up 變數的差值，來判斷是哪個按鈕被釋放
    up = e.buttons;
    let disabledButton = down - up;
    let buttonElement = document.getElementById('button-' + disabledButton);
    if (buttonElement) {
        // 移除所有類別，並為對應的按鈕元素新增 'visited' 類別，呈現「點擊過」的視覺效果
        buttonElement.classList.remove('active', 'visited', 'non-active');
        buttonElement.classList.add('visited');
    }
    down = up;
};

// 阻止事件預設行為的核心函式 (例如：右鍵選單)
const preventDefault = (e) => {
  if (!isMouseModeActive) return;
  e.preventDefault();
};

let scrollingUp, scrollingDown;
const handleWheel = (e) => {
    // 當處於鍵盤模式時，不處理滑鼠滾輪事件
    if (!isMouseModeActive) return;

    const scrollUpElement = document.getElementById('scroll-up');
    const scrollDownElement = document.getElementById('scroll-down');

    // 判斷滾動方向 (e.deltaY < 0 為向上滾動，e.deltaY > 0 為向下滾動)
    if (e.deltaY < 0) {
        if (scrollUpElement) {
            scrollUpElement.classList.remove('active', 'visited', 'non-active');
            scrollUpElement.classList.add('active');
        }
        window.clearTimeout(scrollingUp);
        // 設定計時器，在短時間後將狀態恢復為「點擊過」
        scrollingUp = window.setTimeout(() => {
            if (scrollUpElement) {
                scrollUpElement.classList.remove('active', 'visited', 'non-active');
                scrollUpElement.classList.add('visited');
            }
        }, 200);
    } else if (e.deltaY > 0) {
        if (scrollDownElement) {
            scrollDownElement.classList.remove('active', 'visited', 'non-active');
            scrollDownElement.classList.add('active');
        }
        window.clearTimeout(scrollingDown);
        scrollingDown = window.setTimeout(() => {
            if (scrollDownElement) {
                scrollDownElement.classList.remove('active', 'visited', 'non-active');
                scrollDownElement.classList.add('visited');
            }
        }, 200);
    }
};

// 滾動事件的選項，passive: false 確保能阻止預設滾動行為
const wheelOpt = { passive: false };
const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// 禁用頁面滾動的函式
function disableScroll() {
  if (!isMouseModeActive) return;
  window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.addEventListener(wheelEvent, preventDefault, wheelOpt);
  window.addEventListener('touchmove', preventDefault, wheelOpt);
}

// 啟用頁面滾動的函式
function enableScroll() {
  if (!isMouseModeActive) return;
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
}


// --------------------- 鍵盤區塊 ---------------------
const keys = document.querySelectorAll('.key');

// --------------------- 佈局切換 ---------------------
const slider = document.getElementById('layoutSlider');
const output = document.querySelector('.slider-value');

const fullSizeLayout = document.querySelector('.full-size-layout');
const TKLLayout = document.querySelector('.tkl-layout');

const themeAndLayout = document.querySelector('.theme-and-layout');
const keyboard = document.querySelector('.keyboard');
// TKL 鍵盤佈局設定相關
const numpad = document.querySelector('.numpad');
// 75% 鍵盤佈局設定相關
const regions = document.querySelectorAll('.region');
const functionRegion = document.querySelector('.function');
const controlRegion = document.querySelector('.system-control');
const navigationRegion = document.querySelector('.navigation');
const fourthRow = document.querySelector('.fourth-row');
const fifthRow = document.querySelector('.fifth-row');
const secondRow = document.querySelector('.second-row');
const firstRow = document.querySelector('.first-row');

// 75% 需要刪除相關按鈕
const btnScrollLock = document.querySelector('.scrolllock');
const btnInsert = document.querySelector('.insert');
const btnContextMenu = document.querySelector('.contextmenu');

// 75% 重新配置位置
const btnDelete = document.querySelector('.delete');
const btnHome = document.querySelector('.home');
const btnEnd = document.querySelector('.end');
const btnPgUp = document.querySelector('.pageup');
const btnPgDn = document.querySelector('.pagedown');

// 65% 鍵盤佈局設定相關
const btnBackQuote = document.querySelector('.backquote')
const btnPageUp = document.querySelector('.pageup');
const btnPageDown = document.querySelector('.pagedown');
const btnPrintScreen = document.querySelector('.printscreen');
const btnPause = document.querySelector('.pause');
const btnMetaRight = document.querySelector('.metaright');
const btnControlRight = document.querySelector('.controlright');
const btnEscape = document.querySelector('.escape');
// 取得除了 ESC 之外的 F 鍵
const fKeys = document.querySelectorAll('.function .key:not(.escape)');
// 取得數字列
const numberRow = document.querySelector('.second-row');
const btnTab = document.querySelector('.tab');

// 根據滑桿更新佈局
function updateLayout() {
  const sliderValue = parseInt(slider.value);

  // 滑桿輸出文字
  switch (sliderValue) {
    case 1:
      output.textContent = '全尺寸';
      changeToFullSize();
      break;
    case 2:
      output.textContent = 'TKL';
      changeToTKL();
      break;
    case 3:
      output.textContent = '75%';
      changeTo75();
      break;
    case 4:
      output.textContent = '65%';
      changeTo65();
      break;
    default:
      break;
  }
}

const changeToFullSize = function () {
  undo75();
  undoTKL();
  undo65();
  themeAndLayout.style.maxWidth = '120rem';
  keyboard.classList.add('full-size');
};

const undoTKL = function () {
  keyboard.classList.remove('tkl');
  numpad.classList.remove('hidden--step1');
  numpad.classList.remove('hidden--step2');
};

const changeToTKL = function () {
  return new Promise(resolve => {
    undo75();
    undo65();

    numpad.classList.add('hidden--step1');
    themeAndLayout.style.maxWidth = '98rem';
    // 增加時間在 --step1 和 --step2 之間過渡
    setTimeout(function () {
      keyboard.classList.remove('full-size');

      keyboard.classList.add('tkl');
      numpad.classList.add('hidden--step2');
      resolve(); // Resolving the promise when transition is complete
    }, 150);
  });
};

const updateStylesFor75 = is75Percent => {
  const paddingValue = is75Percent ? '0.15rem' : '0.5rem';
  const displayValue = is75Percent ? 'none' : 'flex';
  const transformValue = is75Percent ? '-66.7%' : '0%';

  keyboard.classList.toggle('seventy-five-percent', is75Percent);
  regions.forEach(region => (region.style.padding = paddingValue));

  functionRegion.style.gridTemplateColumns = is75Percent
    ? '2fr 0 repeat(4, 2fr) 0 repeat(4, 2fr) 0 repeat(4,2fr)'
    : '2fr 2fr repeat(4, 2fr) 1fr repeat(4, 2fr) 1fr repeat(4,2fr)';
  functionRegion.style.width = is75Percent ? '86.7%' : '100%';

  controlRegion.style.width = is75Percent ? '95%' : '100%';
  controlRegion.style.transform = `translateX(${transformValue})`;
  btnScrollLock.style.display = displayValue;
  btnInsert.style.display = displayValue;
  btnContextMenu.style.display = displayValue;

  const btnDeleteTransform = is75Percent
    ? 'translateY(-106%)'
    : 'translateY(0%)';
  btnDelete.style.gridColumn = is75Percent ? 3 : 1;
  btnDelete.style.gridRow = is75Percent ? 1 : 2;
  btnDelete.style.transform = btnDeleteTransform;

  btnHome.style.gridColumn = is75Percent ? 3 : 2;
  btnHome.style.gridRow = is75Percent ? 1 : 1;

  btnEnd.style.gridColumn = is75Percent ? 3 : 2;
  btnEnd.style.gridRow = is75Percent ? 2 : 2;

  btnPgUp.style.gridColumn = is75Percent ? 3 : 3;
  btnPgUp.style.gridRow = is75Percent ? 3 : 1;

  btnPgDn.style.gridColumn = is75Percent ? 3 : 3;
  btnPgDn.style.gridRow = is75Percent ? 4 : 2;

  navigationRegion.style.transform = `translateX(${transformValue})`;

  fourthRow.style.gridTemplateColumns = is75Percent
    ? '2.29fr repeat(10, 1fr) 1.75fr 1.04fr'
    : '2.29fr repeat(10, 1fr) 2.79fr';

  const fifthRowColumns = is75Percent
    ? 'repeat(3, 1.29fr) 6.36fr repeat(3, 1fr) 2.15fr'
    : 'repeat(3, 1.29fr) 6.36fr repeat(4, 1.29fr)';
  fifthRow.style.gridTemplateColumns = fifthRowColumns;
};

const undo75 = () => {
  updateStylesFor75(false);
};

const changeTo75 = async () => {
  // changeToTKL() 核心隱藏去除動畫防止縮小放大問題
  numpad.classList.add('hidden--step1');
  keyboard.classList.remove('full-size');
  keyboard.classList.add('tkl');
  numpad.classList.add('hidden--step2');
  undo65();
  themeAndLayout.style.maxWidth = '85rem';
  updateStylesFor75(true);
};

// 儲存 Esc 鍵的原始父元素和下一個兄弟元素，以便還原
let originalFunctionRegion = null;
let originalNextSiblingEscape = null;

const changeTo65 = async () => {
  // changeToTKL() 核心隱藏去除動畫防止縮小放大問題
  numpad.classList.add('hidden--step1');
  keyboard.classList.remove('full-size');
  keyboard.classList.add('tkl');
  numpad.classList.add('hidden--step2');
  undo75();
  
  // 儲存 Esc 鍵的原始父元素和位置
  originalFunctionRegion = btnEscape.parentElement;
  originalNextSiblingEscape = btnEscape.nextElementSibling;

  // 設定 65% 佈局的鍵盤最大寬度
  themeAndLayout.style.maxWidth = '75rem';

  // 讓 75% 佈局的樣式生效
  updateStylesFor75(true);

  // 隱藏 F 鍵區
  functionRegion.style.display = 'none';
  keyboard.classList.add('sixty-five-percent');

  // 隱藏 65% 佈局下不需要的按鍵
  btnBackQuote.style.display = 'none'; // ~ 鍵
  btnPrintScreen.style.display = 'none';
  btnPause.style.display = 'none';
  btnMetaRight.style.display = 'none';
  btnHome.style.display = 'none'; //隱藏 Home 鍵
  // 有些佈局按鈕會不相同 可以依照需求調整
  // btnEnd.style.display = 'none'; //隱藏 End 鍵
  // btnPgUp.style.display = 'none'; //隱藏 PgUp 鍵
  // btnPgDn.style.display = 'none'; //隱藏 PgDn 鍵

  // 調整 Esc 鍵移動到數字行 first-row 的最前面
  firstRow.prepend(btnEscape);

  // 更改 Esc 字體顏色
  btnEscape.classList.add('key--accent-color');

  // 調整佈局 右邊的 Alt 和 Ctrl
  const fifthRowColumns = 'repeat(3, 1.29fr) 6.36fr 1.29fr 1.29fr 1.29fr 1.29fr';
  btnControlRight.style.paddingRight = '2.3rem';

  fifthRow.style.gridTemplateColumns = fifthRowColumns;

  // 調整 Delete 鍵的位置
  btnDelete.style.gridColumn = '3';
  btnDelete.style.gridRow = '1';
  btnDelete.style.transform = 'translateY(0)';

  // 調整 Tab 鍵位置
  btnTab.style.gridColumn = '1';
  btnTab.style.gridRow = '1';
};

const undo65 = () => {
  // 恢復被 65% 佈局隱藏的區域
  functionRegion.style.display = 'grid';
  keyboard.classList.remove('sixty-five-percent');
  // 恢復 65% 佈局下隱藏的按鍵
  btnBackQuote.style.display = 'grid';
  btnPrintScreen.style.display = 'grid';
  btnPause.style.display = 'grid';
  btnMetaRight.style.display = 'grid';
  btnHome.style.display = 'grid';
  // btnEnd.style.display = 'grid';
  // btnPgUp.style.display = 'grid';
  // btnPgDn.style.display = 'grid';
  // 恢復 Esc 鍵的位置
  if (originalFunctionRegion) {
    originalFunctionRegion.insertBefore(btnEscape, originalNextSiblingEscape);
  }
  // 恢復 Esc 顏色
  btnEscape.classList.remove('key--accent-color');
  // 恢復 Delete 鍵的樣式
  btnDelete.style.gridColumn = '';
  btnDelete.style.gridRow = '';
  btnDelete.style.transform = '';
  btnControlRight.style.paddingRight = '';
  // 恢復 Tab 鍵的樣式
  btnTab.style.gridRow = '';
  btnTab.style.transform = '';
  // 恢復第五行的佈局設定
  fifthRow.style.gridTemplateColumns = '';
};


// 禁用滑鼠右鍵選單
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// 防抖函數，確保在使用者停止動作後才觸發 防止縮減不完全的BUG
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    // 清除上一次的計時器
    clearTimeout(timeoutId);

    // 設定一個新的計時器
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}


// 清除觸發紀錄開關
function clearAllDisplays() {
  if (clearOnSwitchCheckbox.checked){
    // 清除鍵盤顯示
    for (const keyCode in keyHistory) {
      clearInterval(keyHistory[keyCode].timerId);
    }
    keyHistory = {};
    document.querySelectorAll('.key-pressing-simulation, .key--pressed').forEach(el => {
      el.classList.remove('key-pressing-simulation', 'key--pressed');
    });
    keyDisplay.textContent = '-';
    keyCodeDisplay.textContent = '-';
    codeDisplay.textContent = '-';
    durationDisplay.textContent = '-';

    // 清除滑鼠顯示
    down = 0;
    up = 0;
    document.querySelectorAll('#mouse-mode g.active, #mouse-mode g.visited').forEach(el => {
      el.classList.remove('active', 'visited');
      el.classList.add('non-active');
    });
  }
}

// 監聽滑桿
const debouncedUpdateLayout = debounce(updateLayout, 150);
if (slider) {
  slider.addEventListener('input', debouncedUpdateLayout);
}

// --------------------- 初始化 ---------------------
// 頁面載入時預設啟用鍵盤模式，並綁定所有監聽器
document.addEventListener('DOMContentLoaded', () => {
    // 綁定所有事件監聽器，但由變數控制其邏輯
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyPress);
    window.addEventListener('blur', handleBlur);


    // // 滑鼠事件監聽器
    // document.addEventListener('mousedown', handleMouseDown);
    // document.addEventListener('mouseup', handleMouseUp);
    // document.addEventListener('contextmenu', preventDefault, { passive: false });
    // document.addEventListener('mousedown', preventDefault, { passive: false });
    // document.addEventListener('mouseup', preventDefault, { passive: false });

    // const mouseContainer = document.getElementById('mouse-container');
    // if (mouseContainer) {
    //   mouseContainer.addEventListener('wheel', handleWheel, { passive: false });
    //   mouseContainer.addEventListener('mouseover', disableScroll);
    //   mouseContainer.addEventListener('mouseout', enableScroll);
    // }

    // // 滑鼠事件監聽器 (限定區塊) 上下頁會被觸發
    // const mouseContainer = document.getElementById('mouse-container');
    // if (mouseContainer) {
    //   // 將所有滑鼠事件監聽器綁定到 #mouse-container
    //   mouseContainer.addEventListener('mousedown', handleMouseDown);
    //   mouseContainer.addEventListener('mouseup', handleMouseUp);
    //   mouseContainer.addEventListener('contextmenu', preventDefault, { passive: false });
      
    //   mouseContainer.addEventListener('wheel', handleWheel, { passive: false });
    //   mouseContainer.addEventListener('mouseover', disableScroll);
    //   mouseContainer.addEventListener('mouseout', enableScroll);
    // }

    // 滑鼠事件監聽器 (不限制觸發區塊) 整個版面都可觸發
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('contextmenu', preventDefault, { passive: false });
    document.addEventListener('mousedown', preventDefault, { passive: false });
    document.addEventListener('mouseup', preventDefault, { passive: false });
    document.addEventListener('wheel', handleWheel, { passive: false });

    const mouseContainer = document.getElementById('mouse-container');
    if (mouseContainer) {
      mouseContainer.addEventListener('mouseover', disableScroll);
      mouseContainer.addEventListener('mouseout', enableScroll);
    }


    // 載入儲存的清除開關狀態
    const savedClearOnSwitch = localStorage.getItem('clearOnSwitch');
    if (savedClearOnSwitch !== null) {
      clearOnSwitchCheckbox.checked = savedClearOnSwitch === 'true';
    }
    // 清除開關的狀態儲存到 localStorage
    clearOnSwitchCheckbox.addEventListener('change', () => {
      localStorage.setItem('clearOnSwitch', clearOnSwitchCheckbox.checked);
    });

    // 頁面載入時，預設啟用鍵盤模式
    showKeyboardMode();

    // 初始化佈局和主題
    updateLayout();
    initializeTheme();
});




























