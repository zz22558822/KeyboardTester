'use strict';

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
  themes[theme].addEventListener('click', function () {
    changeTheme(themes[theme].className);
  });
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

initializeTheme();

// ------------------- 按鍵觸發相關 -------------------

// 新增變數來追蹤按鍵時長
let keyHistory = {};

// 取得新增的顯示元素
const keyDisplay = document.getElementById('keyDisplay');
const keyCodeDisplay = document.getElementById('keyCodeDisplay');
const codeDisplay = document.getElementById('codeDisplay');
const durationDisplay = document.getElementById('durationDisplay');

const handleKeyPress = function (e) {
  console.log(e);

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

    keyElement.classList.add('key-pressing-simulation');
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
    keyElement.classList.remove('key-pressing-simulation');
  }

  if (!keyElement.classList.contains('key--pressed')) {
    keyElement.classList.add('key--pressed');
  }

  // 處理特殊的 Meta/OS 按鈕
  if (e.key === 'Meta' || e.key === 'OS') {
    keyElement.classList.remove('key-pressing-simulation');
  }
};

document.addEventListener('keydown', handleKeyPress);
document.addEventListener('keyup', handleKeyPress);


// --------------------- 頁面失去焦點時處理 ---------------------
// 當視窗失去焦點時（例如彈出視窗、切換分頁），停止所有計時器
window.addEventListener('blur', () => {
  // 遍歷所有正在計時的按鍵
  for (const keyCode in keyHistory) {
    // 停止對應的計時器
    clearInterval(keyHistory[keyCode].timerId);
  }
  // 清空計時歷史記錄
  keyHistory = {};
  // 清除鍵盤上所有正在按下的模擬樣式
  document.querySelectorAll('.key-pressing-simulation').forEach(el => {
    el.classList.remove('key-pressing-simulation');
  });
  // 重置顯示框內容
  keyDisplay.textContent = '-';
  keyCodeDisplay.textContent = '-';
  codeDisplay.textContent = '-';
  durationDisplay.textContent = '-';
});


// --------------------- 更改佈局 ---------------------

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
const btnPageUp = document.querySelector('.pageup');
const btnPageDown = document.querySelector('.pagedown');
const btnPrintScreen = document.querySelector('.printscreen');
const btnPause = document.querySelector('.pause');
const btnMetaRight = document.querySelector('.metaright');
const btnControlRight = document.querySelector('.controlright');

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

const changeTo65 = async () => {
  // changeToTKL() 核心隱藏去除動畫防止縮小放大問題
  numpad.classList.add('hidden--step1');
  keyboard.classList.remove('full-size');
  keyboard.classList.add('tkl');
  numpad.classList.add('hidden--step2');
  undo75();

  // 設定 65% 佈局的鍵盤最大寬度
  themeAndLayout.style.maxWidth = '75rem';

  // 讓 75% 佈局的樣式生效
  updateStylesFor75(true);

  // 隱藏 F 鍵區
  functionRegion.style.display = 'none';
  keyboard.classList.add('sixty-five-percent');

  // 隱藏 65% 佈局下不需要的按鍵
  btnPrintScreen.style.display = 'none';
  btnPause.style.display = 'none';
  btnMetaRight.style.display = 'none';
  btnHome.style.display = 'none'; //隱藏 Home 鍵
  // 有些布局按鈕會不相同 可以依照需求調整
  // btnEnd.style.display = 'none'; //隱藏 End 鍵
  // btnPgUp.style.display = 'none'; //隱藏 PgUp 鍵
  // btnPgDn.style.display = 'none'; //隱藏 PgDn 鍵

  // 調整佈局 右邊的 Alt 和 Ctrl
  // const fifthRowColumns = 'repeat(3, 1.29fr) 6.36fr 1fr 1fr 1fr 1.29fr';
  const fifthRowColumns = 'repeat(3, 1.29fr) 6.36fr 1.29fr 1.29fr 1.29fr 1.29fr';
  btnControlRight.style.paddingRight = '2.3rem';

  fifthRow.style.gridTemplateColumns = fifthRowColumns;

  // 調整 Delete 鍵的位置
  btnDelete.style.gridColumn = '3';
  btnDelete.style.gridRow = '1';
  btnDelete.style.transform = 'translateY(0)';
};

const undo65 = () => {
  // 恢復被 65% 佈局隱藏的區域
  functionRegion.style.display = 'grid';
  keyboard.classList.remove('sixty-five-percent');

  // 恢復 65% 佈局下隱藏的按鍵
  btnPrintScreen.style.display = 'grid';
  btnPause.style.display = 'grid';
  btnMetaRight.style.display = 'grid';
  btnHome.style.display = 'grid';
  // btnEnd.style.display = 'grid';
  // btnPgUp.style.display = 'grid';
  // btnPgDn.style.display = 'grid';

  // 恢復 Delete 鍵的樣式
  btnDelete.style.gridColumn = '';
  btnDelete.style.gridRow = '';
  btnDelete.style.transform = '';

  btnControlRight.style.paddingRight = '';

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

// 監聽滑桿
const debouncedUpdateLayout = debounce(updateLayout, 150);
slider.addEventListener('input', debouncedUpdateLayout);

// 初始化
updateLayout();