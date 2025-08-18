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

// ------------------- HANDLING KEY PRESS -------------------

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
    keyElement.classList.add('key-pressing-simulation');
  } else if (e.type === 'keyup') {
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
    default:
      break;
  }
}

const changeToFullSize = function () {
  undo75();
  undoTKL();
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
  await changeToTKL(); // 等待 changeToTKL() 中的轉換完成
  themeAndLayout.style.maxWidth = '85rem';
  updateStylesFor75(true);
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
// slider.addEventListener('input', updateLayout); // 原本的容易觸發縮減不完全的BUG
const debouncedUpdateLayout = debounce(updateLayout, 150);
slider.addEventListener('input', debouncedUpdateLayout);

// 初始化
updateLayout();
