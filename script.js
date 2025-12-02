
let isManualColor = { pair: false, p1Text: false, p2Text: false, p1Border: false, p2Border: false };
let isColorLinked = false;
let currentCropTargetId = null;
let cropperImage = new Image();
let cropperCanvas = null;
let cropperCtx = null;
let currentScale = 1;
let currentRotation = 0;
let imgPosX = 0, imgPosY = 0;
let isDragging = false;
let startX, startY;
let currentEmojiTargetId = null;
let fontIndex = 0; 
const fonts = ['font-style-1', 'font-style-2', 'font-style-3'];
let currentMode = 'save';
let isMultiplayer = false;
let cardCount = 0;
const maxCards = 7;


function toggleMultiplayerMode() {
    isMultiplayer = !isMultiplayer;
    const sheet = document.getElementById('sheet-container');
    const mpWrapper = document.getElementById('mp-wrapper');
    const btnText = document.querySelector('#mode-text');
    const body = document.body;

    if (isMultiplayer) {
        sheet.style.display = 'none';
        mpWrapper.classList.add('active');
        body.classList.add('multiplayer-active');
        btnText.textContent = '기본 모드로 전환';
        
        if(document.getElementById('multiplayer-container').children.length <= 1) { 
            if(document.querySelectorAll('.mp-card').length === 0) addCard();
        }
    } else {
        sheet.style.display = 'flex';
        mpWrapper.classList.remove('active');
        body.classList.remove('multiplayer-active');
        btnText.textContent = '다인용 모드로 전환';
    }
}

function addCard() {
    if (cardCount >= maxCards) return;
    cardCount++;
    const container = document.getElementById('multiplayer-container');
    const cardId = 'mp-card-' + Date.now();
    const imgId = 'mp-img-' + cardId;
    const card = document.createElement('div');
    card.className = 'mp-card';
    card.id = cardId;
    card.innerHTML = `
        <div class="delete-card-btn hide-on-save" onclick="removeCard('${cardId}')">
            <span class="material-icons" style="font-size: 16px;">close</span>
        </div>
        <div class="mp-header">
            <div class="mp-number-badge" style="background-color: #ddd;">
                <span class="mp-number-text">${cardCount}</span>
                <input type="color" oninput="changeMpBadgeColor(this)" class="hide-on-save">
            </div>
            <div class="mp-titles">
                <div class="mp-title-main" contenteditable="true" spellcheck="false" oninput="autoShrinkText(this)">한자/한글</div>
                <div class="mp-title-sub" contenteditable="true" spellcheck="false">NAME</div>
            </div>
        </div>
        <div class="mp-image-area" id="${imgId}" onclick="triggerMpUpload(this, event)">
            <div class="mp-placeholder">
                <span class="material-icons" style="font-size: 40px; color:#aaa;">add_a_photo</span><br>
                사진 등록
            </div>
            <input type="file" accept="image/*" onchange="openCropper(event, '${imgId}')" onclick="event.stopPropagation()">
        </div>
        <div class="mp-info">
            <div class="mp-name-kor" contenteditable="true" spellcheck="false" oninput="autoShrinkText(this)">한글이름</div>
            <div class="mp-palette">
                <div class="mp-color-dot">
                    <div class="mp-dot" style="background-color: #ffffff;">
                        <input type="color" value="#ffffff" oninput="changeDotColor(this)" class="hide-on-save">
                    </div>
                    <span class="mp-dot-label">HAIR</span>
                </div>
                <div class="mp-color-dot">
                    <div class="mp-dot" style="background-color: #ffffff;">
                        <input type="color" value="#ffffff" oninput="changeDotColor(this)" class="hide-on-save">
                    </div>
                    <span class="mp-dot-label">EYE(L)</span>
                </div>
                <div class="mp-color-dot">
                    <div class="mp-dot" style="background-color: #ffffff;">
                        <input type="color" value="#ffffff" oninput="changeDotColor(this)" class="hide-on-save">
                    </div>
                    <span class="mp-dot-label">EYE(R)</span>
                </div>
            </div>
            <div class="mp-stats" contenteditable="true" spellcheck="false">키cm/나이</div>
        </div>
        <div class="mp-desc-box" contenteditable="true" data-placeholder="설명을 입력하세요..."></div>
    `;
    container.appendChild(card);
    renumberCards();
    updateAddButtonVisibility();
}
function removeCard(id) {
    const card = document.getElementById(id);
    if(card) {
        card.remove();
        cardCount--;
        renumberCards();
        updateAddButtonVisibility();
    }
}
function renumberCards() {
    const badges = document.querySelectorAll('.mp-number-text');
    badges.forEach((span, index) => { span.textContent = index + 1; });
}
function updateAddButtonVisibility() {
    const addBtn = document.querySelector('.add-card-btn');
    addBtn.style.display = (cardCount >= maxCards) ? 'none' : 'flex';
}
function triggerMpUpload(div, event) { 
    if (event.target.tagName !== 'INPUT') {
        div.querySelector('input').click(); 
    }
}
function changeMpBadgeColor(input) { input.parentElement.style.backgroundColor = input.value; }
function changeDotColor(input) { input.parentElement.style.backgroundColor = input.value; }



function triggerUpload(id) { document.getElementById(id).click(); }
function loadImage(event, id) {
    const container = document.getElementById(id);
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            container.style.backgroundImage = 'url(' + e.target.result + ')';
            const ph = container.querySelector('.placeholder-text, .plus, .placeholder');
            const em = container.querySelector('.emoji-display');
            if(ph) ph.style.display = 'none';
            if(em) em.textContent = '';
            if(id.includes('profile-bg')) container.style.backgroundColor = 'transparent';
        }
        reader.readAsDataURL(file);
    }
}
function loadBackgroundImage(event) {
    const sheet = document.getElementById('sheet-container');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) { sheet.style.backgroundImage = 'url(' + e.target.result + ')'; }
        reader.readAsDataURL(file);
    }
}
function changeSheetColor(color) {
    document.getElementById('sheet-container').style.backgroundColor = color;
    document.getElementById('sheet-container').style.backgroundImage = 'none';
    document.getElementById('multiplayer-container').style.backgroundColor = color;
    document.getElementById('multiplayer-container').style.backgroundImage = 'none';
}
function changeBorderColor(color, frameId) {
    document.getElementById(frameId).style.borderColor = color;
}
function setMode(mode) {
    const sheet = document.getElementById('sheet-container');
    const p2Set = document.getElementById('p2-set');
    const p2Sidebar = document.getElementById('p2-sidebar');
    if (mode === 1) {
        sheet.classList.remove('mode-2'); sheet.classList.add('mode-1');
        p2Set.style.opacity = '0'; p2Set.style.width = '0';
        p2Sidebar.style.display = 'none';
        document.getElementById('pair-name-wrapper').style.display = 'none';
    } else {
        sheet.classList.remove('mode-1'); sheet.classList.add('mode-2');
        p2Set.style.display = 'flex';
        setTimeout(() => { p2Set.style.opacity = '1'; p2Set.style.width = '640px'; }, 10);
        p2Sidebar.style.display = 'flex';
        document.getElementById('pair-name-wrapper').style.display = 'flex';
    }
}

function toggleColorLink(btn) { isColorLinked = !isColorLinked; btn.classList.toggle('active-link'); }

function toggleDarkMode() { 
    document.body.classList.toggle('dark-mode'); 
    const isDark = document.body.classList.contains('dark-mode');
    const themeInputs = ['p1-gs', 'p1-ge', 'p2-gs', 'p2-ge'];
    themeInputs.forEach(id => {
        const el = document.getElementById(id);
        if(!el) return;
        if (isDark && el.value === '#333333') { el.value = '#e0e0e0'; } 
        else if (!isDark && el.value === '#e0e0e0') { el.value = '#333333'; }
        if(id.includes('p1')) updateGradient('p1-gs', 'p1-ge', 'p1-grad-bar');
        if(id.includes('p2')) updateGradient('p2-gs', 'p2-ge', 'p2-grad-bar');
    });
    const defaultLight = '#333333'; const defaultDark = '#eeeeee';
    if (!isManualColor.pair) { document.documentElement.style.setProperty('--pair-name-color', isDark ? defaultDark : defaultLight); }
    if (!isManualColor.p1Text) { document.documentElement.style.setProperty('--p1-text', isDark ? defaultDark : defaultLight); }
    if (!isManualColor.p2Text) { document.documentElement.style.setProperty('--p2-text', isDark ? defaultDark : defaultLight); }
}

function toggleMusicPlayer() { document.querySelectorAll('.music-box').forEach(p => { p.style.display = (p.style.display === 'none') ? 'flex' : 'none'; }); }
function toggleLike(btn) { btn.classList.toggle('active'); btn.textContent = btn.classList.contains('active') ? 'favorite' : 'favorite_border'; }
function toggleColorMenu(id, event) { 
    event.stopPropagation();
    document.querySelectorAll('.color-pickers').forEach(el => { if(el.id !== id) el.classList.remove('show'); });
    document.getElementById(id).classList.toggle('show'); 
}

function autoFitText(element) {
    let fontSize = parseFloat(window.getComputedStyle(element).fontSize);
    if (!element.dataset.originalSize) { element.dataset.originalSize = fontSize; }
    const maxFontSize = parseFloat(element.dataset.originalSize);
    const minFontSize = 8;
    element.style.fontSize = maxFontSize + 'px';
    fontSize = maxFontSize;
    while ( (element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight) && fontSize > minFontSize ) {
        fontSize -= 0.5;
        element.style.fontSize = fontSize + 'px';
    }
}
function autoShrinkText(element) {
    if (!element.dataset.originalSize) {
        let style = window.getComputedStyle(element, null).getPropertyValue('font-size');
        element.dataset.originalSize = parseFloat(style); 
    }
    const maxFontSize = parseFloat(element.dataset.originalSize);
    const minFontSize = 8; 
    let currentFontSize = maxFontSize;
    element.style.fontSize = maxFontSize + 'px';
    while (element.scrollWidth > element.clientWidth && currentFontSize > minFontSize) {
        currentFontSize -= 1;
        element.style.fontSize = currentFontSize + 'px';
    }
}



function openCropper(event, targetId) {
    const file = event.target.files[0];
    if(!file) return;
    currentCropTargetId = targetId;
    const reader = new FileReader();
    reader.onload = function(e) {
        cropperImage.src = e.target.result;
        cropperImage.onload = function() {
            document.getElementById('cropper-modal').classList.add('show');
            initCanvas(targetId);
        }
    }
    reader.readAsDataURL(file);
    event.target.value = ''; 
}
function initCanvas(targetId) {
    cropperCanvas = document.getElementById('cropper-canvas');
    cropperCtx = cropperCanvas.getContext('2d');
    const targetEl = document.getElementById(targetId);
    const rect = targetEl.getBoundingClientRect();
    const ratio = rect.width / rect.height;
    const baseWidth = 600;
    cropperCanvas.width = baseWidth;
    cropperCanvas.height = baseWidth / ratio;
    currentScale = 1; currentRotation = 0;
    imgPosX = cropperCanvas.width / 2; imgPosY = cropperCanvas.height / 2;
    document.getElementById('crop-zoom').value = 1;
    drawCanvas();
    const container = document.querySelector('.canvas-container');
    container.onmousedown = startDrag; container.onmousemove = drag; container.onmouseup = endDrag; container.onmouseleave = endDrag;
    container.ontouchstart = (e) => { const touch = e.touches[0]; startDrag({ clientX: touch.clientX, clientY: touch.clientY }); };
    container.ontouchmove = (e) => { if(!isDragging) return; e.preventDefault(); const touch = e.touches[0]; drag({ clientX: touch.clientX, clientY: touch.clientY }); };
    container.ontouchend = endDrag;
}
function drawCanvas() {
    if(!cropperCtx) return;
    cropperCtx.clearRect(0,0, cropperCanvas.width, cropperCanvas.height);
    cropperCtx.fillStyle = '#ffffff'; 
    cropperCtx.fillRect(0, 0, cropperCanvas.width, cropperCanvas.height);
    cropperCtx.save();
    cropperCtx.translate(imgPosX, imgPosY);
    cropperCtx.rotate(currentRotation * Math.PI / 180);
    cropperCtx.scale(currentScale, currentScale);
    cropperCtx.drawImage(cropperImage, -cropperImage.width/2, -cropperImage.height/2);
    cropperCtx.restore();
}
function startDrag(e) { isDragging = true; startX = e.clientX; startY = e.clientY; }
function drag(e) {
    if(!isDragging) return;
    const dx = e.clientX - startX; const dy = e.clientY - startY;
    const canvasEl = document.getElementById('cropper-canvas');
    const scaleFactor = cropperCanvas.width / canvasEl.clientWidth;
    imgPosX += dx * scaleFactor; imgPosY += dy * scaleFactor;
    startX = e.clientX; startY = e.clientY;
    drawCanvas();
}
function endDrag() { isDragging = false; }
document.getElementById('crop-zoom').addEventListener('input', function(e) {
    currentScale = parseFloat(e.target.value); drawCanvas();
});
function rotateImage(deg) {
    currentRotation = (currentRotation + deg) % 360; drawCanvas();
}
function applyCrop() {
    if(!currentCropTargetId) return;
    const container = document.getElementById(currentCropTargetId);
    const dataUrl = cropperCanvas.toDataURL('image/png');
    container.style.backgroundImage = 'url(' + dataUrl + ')';
    
    if (currentCropTargetId.startsWith('mp-img-')) {
        const ph = container.querySelector('.mp-placeholder');
        if(ph) ph.style.display = 'none';
    } else {
        const ph = container.querySelector('.placeholder-text, .plus, .placeholder');
        const em = container.querySelector('.emoji-display');
        if(ph) ph.style.display = 'none';
        if(em) em.textContent = '';
        if(currentCropTargetId.includes('profile-bg')) container.style.backgroundColor = 'transparent';
    }
    closeCropper();
}
function closeCropper() {
    document.getElementById('cropper-modal').classList.remove('show');
    currentCropTargetId = null;
}

function cyclePairFont() {
    const nameBox = document.getElementById('pair-name-container');
    nameBox.classList.remove(fonts[fontIndex]);
    fontIndex = (fontIndex + 1) % fonts.length;
    nameBox.classList.add(fonts[fontIndex]);
}
function changePairColor(color) { document.documentElement.style.setProperty('--pair-name-color', color); isManualColor.pair = true; }
function changePairSize(delta) { 
    const el = document.getElementById('pair-name-container'); 
    let size = parseInt(window.getComputedStyle(el).fontSize); 
    el.style.fontSize = (size + delta) + 'px'; 
    el.dataset.originalSize = size + delta; 
}
function changePairPos(delta) { 
    const el = document.getElementById('pair-name-wrapper'); 
    let top = parseInt(window.getComputedStyle(el).top); 
    el.style.top = (top + delta) + 'px'; 
}
function changeSubTextColor(color) { document.documentElement.style.setProperty('--sub-text-color', color); }
function togglePairSubLabel() { const el = document.getElementById('pair-sub-label-box'); el.style.display = (el.style.display === 'none') ? 'flex' : 'none'; }
function changeP1TextColor(color) { 
    document.documentElement.style.setProperty('--p1-text', color); 
    isManualColor.p1Text = true; 
    if(isColorLinked) { document.documentElement.style.setProperty('--p2-text', color); isManualColor.p2Text = true; }
}
function changeP2TextColor(color) { document.documentElement.style.setProperty('--p2-text', color); isManualColor.p2Text = true; }
function changeP1BorderColor(color) {
    changeBorderColor(color, 'p1-frame');
    isManualColor.p1Border = true;
    if(isColorLinked) { changeBorderColor(color, 'p2-frame'); isManualColor.p2Border = true; }
}
function changeMusicBg(color, playerId) { 
    const player = document.getElementById(playerId); 
    let r=0, g=0, b=0; 
    if (color.length == 7) { r = parseInt(color.substr(1,2), 16); g = parseInt(color.substr(3,2), 16); b = parseInt(color.substr(5,2), 16); }
    let opacity = player.dataset.opacity || 0.4; 
    player.style.background = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
    if(isColorLinked && playerId === 'p1-music') { changeMusicBg(color, 'p2-music'); }
}
function changeMusicText(color, playerId) { 
    document.getElementById(playerId).style.color = color; 
    if(isColorLinked && playerId === 'p1-music') { changeMusicText(color, 'p2-music'); }
}
function changeBoxBg(color, boxId) {
    const box = document.getElementById(boxId); box.style.backgroundColor = color;
    if(boxId.includes('bubble')) {
        let styleId = 'style-' + boxId; let style = document.getElementById(styleId); 
        if (!style) { style = document.createElement('style'); style.id = styleId; document.head.appendChild(style); }
        const isP1InMode2 = document.getElementById('sheet-container').classList.contains('mode-2') && boxId === 'p1-bubble';
        let tailCss = isP1InMode2 ? '#' + boxId + '::after { border-color: ' + color + ' transparent transparent transparent !important; }' : '#' + boxId + '::after { border-color: transparent ' + color + ' transparent transparent !important; }';
        style.innerHTML = tailCss;
    }
    if(isColorLinked && boxId === 'p1-bubble') changeBoxBg(color, 'p2-bubble');
}
function changeBoxText(color, boxId) { 
    document.getElementById(boxId).style.color = color; 
    if(isColorLinked && boxId === 'p1-bubble') changeBoxText(color, 'p2-bubble');
}
function changeColor(input) { 
    const target = input.parentElement.classList.contains('profile-color-trigger') ? input.parentElement.parentElement : input.parentElement; 
    target.style.backgroundColor = input.value; 
    if(target.id && target.id.includes('profile-bg')) target.style.backgroundImage = 'none'; 
}
function triggerColor(id) { document.getElementById(id).click(); }
function updateGradient(startId, endId, barId) { 
    const start = document.getElementById(startId).value; 
    const end = document.getElementById(endId).value; 
    document.getElementById(barId).style.background = 'linear-gradient(to right, ' + start + ', ' + end + ')'; 
}

document.addEventListener('mousedown', function(e){ if(!e.target.closest('.sticker')) document.querySelectorAll('.sticker').forEach(s => s.classList.remove('selected')); if (!e.target.closest('.color-pickers') && !e.target.closest('.inner-palette-btn') && !e.target.closest('.menu-item') && !e.target.closest('.round-btn')) { document.querySelectorAll('.color-pickers').forEach(el => el.classList.remove('show')); } });
function showResetModal() { document.getElementById('reset-modal').classList.add('show'); }
function closeResetModal() { document.getElementById('reset-modal').classList.remove('show'); }
function resetPage() {
    try {
        sessionStorage.clear(); 
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key.startsWith('sheetData_')) { keysToRemove.push(key); }
        }
        keysToRemove.forEach(key => { localStorage.removeItem(key); });
    } catch(e) {} 
    location.reload(); 
}
function saveImage() {
    const body = document.body;
    const targetId = isMultiplayer ? 'multiplayer-container' : 'sheet-container';
    const originalElement = document.getElementById(targetId);

    document.querySelectorAll('.color-pickers').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('.sticker').forEach(s => s.classList.remove('selected'));
    
    const editables = document.querySelectorAll('[contenteditable]');
    try { editables.forEach(el => { if(!el.getAttribute('data-default')) return; const current = el.innerText.replace(/\s/g, ''); const def = el.getAttribute('data-default').replace(/\s/g, ''); if(current === def || current === '') { el.dataset.originalColor = el.style.color; el.style.color = 'rgba(0,0,0,0)'; } }); } catch (e) {}
    
    body.classList.add('capturing'); window.scrollTo(0,0); 
    

    const clone = originalElement.cloneNode(true);
    clone.style.transform = "none";
    clone.style.position = "absolute";
    clone.style.top = "0";
    clone.style.left = "0";
    clone.style.zIndex = "-9999";
    clone.style.width = "fit-content"; 
    clone.style.height = "auto";
    clone.style.margin = "0";
    clone.style.overflow = "visible"; 
    clone.style.zoom = "1"; 

    document.body.appendChild(clone);

    html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true, 
        backgroundColor: null
    }).then(canvas => {
        const link = document.createElement("a");
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        link.download = 'character_sheet_' + timestamp + '.png';
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        document.body.removeChild(clone);
        body.classList.remove('capturing');
        editables.forEach(el => { if(el.style.color === 'rgba(0, 0, 0, 0)') el.style.color = el.dataset.originalColor || ''; });
    }).catch(err => {
        console.error(err);
        alert('저장 실패: ' + err);
        if(clone.parentNode) document.body.removeChild(clone);
        body.classList.remove('capturing');
        editables.forEach(el => { if(el.style.color === 'rgba(0, 0, 0, 0)') el.style.color = ''; }); 
    });
}
function toggleMinimalMode() {
    const sheet = document.getElementById('sheet-container');
    const btn = document.getElementById('btn-minimal');
    sheet.classList.toggle('minimal-mode');
    if (sheet.classList.contains('minimal-mode')) {
        btn.classList.add('active-link');
        btn.querySelector('.material-icons').textContent = 'crop_square';
    } else {
        btn.classList.remove('active-link');
        btn.querySelector('.material-icons').textContent = 'crop_portrait';
    }
}

function openEmojiPicker(event, targetDisplayId) {
    event.stopPropagation();
    currentEmojiTargetId = targetDisplayId;
    document.getElementById('emoji-modal').classList.add('show');
}
function closeEmojiModal(event) { if (event.target.id === 'emoji-modal') { document.getElementById('emoji-modal').classList.remove('show'); } }
document.addEventListener('DOMContentLoaded', () => {
    const picker = document.querySelector('emoji-picker');
    if(picker) {
        picker.addEventListener('emoji-click', event => {
            if(currentEmojiTargetId) {
                const display = document.getElementById(currentEmojiTargetId);
                if(display) {
                    display.textContent = event.detail.unicode;
                    const container = display.parentElement;
                    container.style.backgroundImage = 'none';
                    const ph = container.querySelector('.plus');
                    if(ph) ph.style.display = 'none';
                }
            }
            document.getElementById('emoji-modal').classList.remove('show');
        });
    }
    updateSlotInfo();
});
function toggleUI() {
    document.body.classList.toggle('ui-hidden');
    const icon = document.getElementById('ui-icon');
    if (document.body.classList.contains('ui-hidden')) { icon.textContent = 'visibility_off'; } else { icon.textContent = 'visibility'; }
}
function closeModalOnClickOutside(event, modalId) { if (event.target.id === modalId) { document.getElementById(modalId).classList.remove('show'); } }
document.addEventListener('keydown', function(e) { if (e.target.isContentEditable && e.key === 'Enter') { e.preventDefault(); document.execCommand('insertLineBreak'); } });

function openSlotModal(mode) {
    currentMode = mode;
    document.getElementById('slot-modal-title').textContent = mode === 'save' ? '저장할 슬롯 선택' : '불러올 슬롯 선택';
    updateSlotInfo();
    document.getElementById('slot-modal').classList.add('show');
}
function closeSlotModal() { document.getElementById('slot-modal').classList.remove('show'); }
function showToastModal(message) {
    document.getElementById('toast-message').textContent = message;
    document.getElementById('toast-modal').classList.add('show');
    setTimeout(closeToastModal, 1500); 
}
function closeToastModal() { document.getElementById('toast-modal').classList.remove('show'); }
function updateSlotInfo() {
    for (let i = 1; i <= 3; i++) {
        const data = localStorage.getItem('sheetData_' + i);
        const infoSpan = document.getElementById('slot-info-' + i);
        if (data) { const parsed = JSON.parse(data); infoSpan.textContent = parsed.timestamp || '저장됨'; infoSpan.style.color = '#4CAF50'; } else { infoSpan.textContent = '비어있음'; infoSpan.style.color = '#888'; }
    }
}
function processSlot(slotNum) { if (currentMode === 'save') { saveToSlot(slotNum); } else { loadFromSlot(slotNum); } closeSlotModal(); }
function clearSlot(slotNum, event) {
    event.stopPropagation();
    if (confirm('Slot ' + slotNum + '을(를) 비우시겠습니까?')) { localStorage.removeItem('sheetData_' + slotNum); updateSlotInfo(); showToastModal('Slot ' + slotNum + '이(가) 비워졌습니다.'); }
}
function saveToSlot(slotNum) {
    const data = { timestamp: new Date().toLocaleString(), texts: [], colors: [], bgImages: [], mode: document.getElementById('sheet-container').classList.contains('mode-2') ? 2 : 1, isDark: document.body.classList.contains('dark-mode') };
    document.querySelectorAll('[contenteditable]').forEach((el, index) => { data.texts.push({ index: index, html: el.innerHTML, id: el.id, className: el.className }); });
    document.querySelectorAll('input[type=color]').forEach((el, index) => { data.colors.push({ index: index, value: el.value, id: el.id, name: el.name }); });
    const imgContainers = document.querySelectorAll('.sub-img, .main-pic-area, .album-art, .profile-image-area, #sheet-container'); 
    imgContainers.forEach((el, index) => {
        if (el.style.backgroundImage && !el.style.backgroundImage.includes('none')) { data.bgImages.push({ index: index, id: el.id, bg: el.style.backgroundImage }); }
        const em = el.querySelector('.emoji-display');
        if(em && em.textContent) { data.bgImages.push({ index: index, id: el.id, emoji: em.textContent }); }
    });
    try { localStorage.setItem('sheetData_' + slotNum, JSON.stringify(data)); showToastModal('Slot ' + slotNum + '에 저장되었습니다.'); } catch (e) { alert('저장 용량이 부족합니다. (사진이 너무 큽니다)'); }
}
function loadFromSlot(slotNum) {
    const json = localStorage.getItem('sheetData_' + slotNum);
    if (!json) { alert('해당 슬롯에 저장된 데이터가 없습니다.'); return; }
    const data = JSON.parse(json);
    setMode(data.mode);
    const isDark = document.body.classList.contains('dark-mode');
    if (data.isDark && !isDark) toggleDarkMode();
    if (!data.isDark && isDark) toggleDarkMode();
    const textEls = document.querySelectorAll('[contenteditable]');
    data.texts.forEach(item => { if(textEls[item.index] && textEls[item.index].id === item.id) { textEls[item.index].innerHTML = item.html; autoFitText(textEls[item.index]); } });
    const colorInputs = document.querySelectorAll('input[type=color]');
    data.colors.forEach(item => { if(colorInputs[item.index]) { colorInputs[item.index].value = item.value; colorInputs[item.index].dispatchEvent(new Event('input', { bubbles: true })); } });
    const imgContainers = document.querySelectorAll('.sub-img, .main-pic-area, .album-art, .profile-image-area, #sheet-container');
    imgContainers.forEach((el, index) => {
        el.style.backgroundImage = 'none';
        const ph = el.querySelector('.placeholder-text, .plus, .placeholder');
        if(ph) ph.style.display = 'block';
        const em = el.querySelector('.emoji-display');
        if(em) em.textContent = '';
    });
    data.bgImages.forEach(item => {
        const containerIndex = Array.from(imgContainers).findIndex(el => el.id === item.id);
        if(containerIndex !== -1) {
            const el = imgContainers[containerIndex];
            if(item.bg) { el.style.backgroundImage = item.bg; const ph = el.querySelector('.placeholder-text, .plus, .placeholder'); if(ph) ph.style.display = 'none'; if(el.id.includes('profile-bg')) el.style.backgroundColor = 'transparent'; }
            if(item.emoji) { const em = el.querySelector('.emoji-display'); if(em) { em.textContent = item.emoji; el.style.backgroundImage = 'none'; const ph = el.querySelector('.plus'); if(ph) ph.style.display = 'none'; } }
        }
    });
    showToastModal('데이터를 불러왔습니다.');
}
function createStickerFromUrl(url) {
    const layerId = isMultiplayer ? 'mp-sticker-layer' : 'sticker-layer';
    const layer = document.getElementById(layerId); 
    const sticker = document.createElement('div'); 
    sticker.className = 'sticker selected'; 
    sticker.style.top = '100px'; 
    sticker.style.left = '100px';
    
    const img = new Image(); 
    img.src = url;
    img.onload = function() {
        const ratio = img.width / img.height; 
        sticker.style.width = '150px'; 
        sticker.style.height = (150 / ratio) + 'px';
        img.setAttribute('draggable', 'false');
        img.ondragstart = () => false;
        sticker.innerHTML = '<img src="' + url + '"><div class="control-btn delete-btn material-icons">close</div><div class="control-btn rotate-handle material-icons">refresh</div><div class="control-btn resize-handle material-icons">open_in_full</div>';
        sticker.querySelector('.delete-btn').onclick = (ev) => { ev.stopPropagation(); sticker.remove(); };
        
sticker.onmousedown = (ev) => { 

            if(ev.target.className.includes('control-btn')) return; 
            
            document.querySelectorAll('.sticker').forEach(s => s.classList.remove('selected')); 
            sticker.classList.add('selected'); 
            

            let shiftX = ev.clientX - sticker.getBoundingClientRect().left; 
            let shiftY = ev.clientY - sticker.getBoundingClientRect().top; 
            
            const moveAt = (clientX, clientY) => { 

                let newLeft = clientX - shiftX - layer.getBoundingClientRect().left; 
                let newTop = clientY - shiftY - layer.getBoundingClientRect().top; 
                
                sticker.style.left = newLeft + 'px'; 
                sticker.style.top = newTop + 'px'; 
            }; 
            
            const onMouseMove = (e) => {

                moveAt(e.clientX, e.clientY); 
            }; 
            
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp); 
        };
        
        sticker.querySelector('.rotate-handle').onmousedown = (e) => { 
            e.stopPropagation(); e.preventDefault(); 
            const rect = sticker.getBoundingClientRect(); 
            const centerX = rect.left + rect.width/2; 
            const centerY = rect.top + rect.height/2; 
            const rotate = (ev) => { 
                const angle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX) * 180 / Math.PI; 
                sticker.style.transform = 'rotate(' + (angle + 90) + 'deg)'; 
            }; 
            const stopRotate = () => { 
                document.removeEventListener('mousemove', rotate); 
                document.removeEventListener('mouseup', stopRotate); 
            }; 
            document.addEventListener('mousemove', rotate); 
            document.addEventListener('mouseup', stopRotate); 
        };
        
        sticker.querySelector('.resize-handle').onmousedown = (e) => { 
            e.stopPropagation(); e.preventDefault(); 
            const startX = e.clientX; 
            const startW = parseInt(getComputedStyle(sticker).width); 
            const doDrag = (ev) => { 
                let newW = startW + (ev.clientX - startX); 
                if(newW < 30) newW = 30; 
                sticker.style.width = newW + 'px'; 
                sticker.style.height = (newW / ratio) + 'px'; 
            }; 
            const stopDrag = () => { 
                document.removeEventListener('mousemove', doDrag); 
                document.removeEventListener('mouseup', stopDrag); 
            }; 
            document.addEventListener('mousemove', doDrag); 
            document.addEventListener('mouseup', stopDrag); 
        };
        layer.appendChild(sticker);
    }
}

function addSticker(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            createStickerFromUrl(e.target.result);
        }
        reader.readAsDataURL(file);
        event.target.value = ''; 
    }
}

function openKakaoModal() {
    document.getElementById('kakao-modal').classList.add('show');
    drawKakao();
}

function closeKakaoModal() {
    document.getElementById('kakao-modal').classList.remove('show');
}

function addKakaoToSheet() {
    const canvas = document.getElementById('kt-canvas');
    if(canvas.width > 0 && canvas.height > 0) {
        createStickerFromUrl(canvas.toDataURL());
        closeKakaoModal();
    }
}

function parseKtTime(timeStr) {
    const regex = /(오전|오후)?\s*(\d{1,2}):(\d{2})/;
    const match = timeStr.match(regex);
    if (!match) return null;
    let period = match[1];
    let hour = parseInt(match[2]);
    let minute = parseInt(match[3]);
    if (period === '오후' && hour !== 12) hour += 12;
    else if (period === '오전' && hour === 12) hour = 0;
    return hour * 60 + minute;
}

function formatKtTime(totalMinutes) {
    totalMinutes = totalMinutes % 1440;
    if (totalMinutes < 0) totalMinutes += 1440;
    let hour = Math.floor(totalMinutes / 60);
    let minute = totalMinutes % 60;
    let period = "오전";
    if (hour >= 12) { period = "오후"; if (hour > 12) hour -= 12; }
    if (hour === 0) hour = 12; 
    return `${period} ${hour}:${minute.toString().padStart(2, '0')}`;
}

function drawKakao() {
    const canvas = document.getElementById('kt-canvas');
    const ctx = canvas.getContext('2d');
    const theme = document.getElementById('kt-theme').value;
    const rawText = document.getElementById('kt-message').value;
    const startTimeStr = document.getElementById('kt-time').value;

    document.getElementById('kt-custom-colors').style.display = (theme === 'custom') ? 'block' : 'none';

    const fontSize = 16;
    const lineHeight = 24; 
    const fontFamily = "'Pretendard', sans-serif";
    ctx.font = `${fontSize}px ${fontFamily}`;

    let currentMinutes = parseKtTime(startTimeStr);
    let isTimeParsable = (currentMinutes !== null);
    let lastDirection = null;

    const dialogueLines = rawText.split('\n');
    const bubblesData = [];
    const maxLineWidth = 240;
    const bubbleMargin = 10;
    let totalHeight = 20;
    const paddingX = 12; 
    const paddingY = 10; 

    dialogueLines.forEach((line) => {
        line = line.trim();
        if (line === "") return;

        let manualTimeStr = null;
        let contentText = line;
        const pipeIndex = line.lastIndexOf('|');
        if (pipeIndex !== -1 && pipeIndex < line.length - 1) {
            const textPart = line.substring(0, pipeIndex).trim();
            const timePart = line.substring(pipeIndex + 1).trim();
            if (textPart !== "") { contentText = textPart; manualTimeStr = timePart; }
        }

        let direction, bubbleText;
        const quoteMatch = contentText.match(/^"(.*)"$/);
        if (quoteMatch) { direction = 'right'; bubbleText = quoteMatch[1]; } 
        else { direction = 'left'; bubbleText = contentText; }

        let displayTimeStr = "";
        if (manualTimeStr) {
            displayTimeStr = manualTimeStr;
            if (isTimeParsable) {
                const parsed = parseKtTime(manualTimeStr);
                if (parsed !== null) currentMinutes = parsed;
            }
        } else {
            if (isTimeParsable) {
                if (lastDirection !== null && lastDirection !== direction) currentMinutes += 1;
                displayTimeStr = formatKtTime(currentMinutes);
            } else { displayTimeStr = startTimeStr; }
        }
        lastDirection = direction;

        let bubbleColor, textColor;
        if (direction === 'right') {
             if (theme === 'basic') { bubbleColor = '#FEE500'; textColor = '#000000'; } 
             else { bubbleColor = document.getElementById('kt-my-bg').value; textColor = document.getElementById('kt-my-text').value; }
        } else {
            if (theme === 'basic') { bubbleColor = '#FFFFFF'; textColor = '#000000'; } 
            else { bubbleColor = document.getElementById('kt-other-bg').value; textColor = document.getElementById('kt-other-text').value; }
        }

        const words = bubbleText.split('');
        const lines = [];
        let curLine = '';
        for (let n = 0; n < words.length; n++) {
            const testLine = curLine + words[n];
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxLineWidth && curLine !== '') { lines.push(curLine); curLine = words[n]; } 
            else { curLine = testLine; }
        }
        lines.push(curLine);

        let textWidth = 0;
        lines.forEach(l => { const w = ctx.measureText(l).width; if (w > textWidth) textWidth = w; });
        const bubbleWidth = textWidth + (paddingX * 2);
        const bubbleHeight = (lines.length * lineHeight) + (paddingY * 2);

        bubblesData.push({ direction, lines, bubbleColor, textColor, bubbleWidth, bubbleHeight, timeStr: displayTimeStr, paddingX, paddingY });
        totalHeight += bubbleHeight + bubbleMargin;
    });

    if (bubblesData.length === 0) { canvas.width = 300; canvas.height = 150; ctx.clearRect(0, 0, canvas.width, canvas.height); return; }

    totalHeight += 10;
    const margin = 20; 
    canvas.width = 400; 
    canvas.height = totalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let currentY = margin;
    bubblesData.forEach(bubble => {
        const { direction, lines, bubbleColor, textColor, bubbleWidth, bubbleHeight, timeStr, paddingX, paddingY } = bubble;
        const tailSize = 6;
        let bubbleX, tailX, timeX, timeY;

        ctx.font = `11px ${fontFamily}`;
        const timeWidth = ctx.measureText(timeStr).width;

        if (direction === 'right') {
            bubbleX = canvas.width - margin - bubbleWidth;
            tailX = bubbleX + bubbleWidth;
            timeX = bubbleX - timeWidth - 6;
            timeY = currentY + bubbleHeight - 3;
        } else {
            bubbleX = margin + tailSize;
            tailX = bubbleX;
            timeX = bubbleX + bubbleWidth + 6;
            timeY = currentY + bubbleHeight - 3;
        }

        ctx.fillStyle = bubbleColor;
        ctx.beginPath();
        if (direction === 'right') {
            ctx.moveTo(tailX - 2, currentY + 8);
            ctx.lineTo(tailX + tailSize, currentY + 13);
            ctx.lineTo(tailX - 2, currentY + 18);
        } else {
            ctx.moveTo(tailX + 2, currentY + 8);
            ctx.lineTo(tailX - tailSize, currentY + 13);
            ctx.lineTo(tailX + 2, currentY + 18);
        }
        ctx.fill();

        const r = 14; 
        ctx.beginPath();
        ctx.moveTo(bubbleX + r, currentY);
        ctx.lineTo(bubbleX + bubbleWidth - r, currentY);
        ctx.quadraticCurveTo(bubbleX + bubbleWidth, currentY, bubbleX + bubbleWidth, currentY + r);
        ctx.lineTo(bubbleX + bubbleWidth, currentY + bubbleHeight - r);
        ctx.quadraticCurveTo(bubbleX + bubbleWidth, currentY + bubbleHeight, bubbleX + bubbleWidth - r, currentY + bubbleHeight);
        ctx.lineTo(bubbleX + r, currentY + bubbleHeight);
        ctx.quadraticCurveTo(bubbleX, currentY + bubbleHeight, bubbleX, currentY + bubbleHeight - r);
        ctx.lineTo(bubbleX, currentY + r);
        ctx.quadraticCurveTo(bubbleX, currentY, bubbleX + r, currentY);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = textColor;
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.textBaseline = 'middle'; 
        lines.forEach((line, index) => {
            const textY = currentY + paddingY + (index * lineHeight) + (lineHeight / 2);
            ctx.fillText(line, bubbleX + paddingX, textY + 1);
        });

        ctx.fillStyle = '#666666';
        ctx.font = `11px ${fontFamily}`;
        ctx.textBaseline = 'bottom';
        ctx.fillText(timeStr, timeX, timeY);

        currentY += bubbleHeight + bubbleMargin;
    });
}


function openKakaoModal() {
    document.getElementById('kakao-modal').classList.add('show');

    setTimeout(drawKakao, 100); 
}

function closeKakaoModal() {
    document.getElementById('kakao-modal').classList.remove('show');
}

function addKakaoToSheet() {
    const canvas = document.getElementById('kt-canvas');
    if(canvas.width > 0 && canvas.height > 0) {
        createStickerFromUrl(canvas.toDataURL());
        closeKakaoModal();
    }
}

function parseKtTime(timeStr) {
    const regex = /(오전|오후)?\s*(\d{1,2}):(\d{2})/;
    const match = timeStr.match(regex);
    if (!match) return null;
    let period = match[1];
    let hour = parseInt(match[2]);
    let minute = parseInt(match[3]);
    if (period === '오후' && hour !== 12) hour += 12;
    else if (period === '오전' && hour === 12) hour = 0;
    return hour * 60 + minute;
}

function formatKtTime(totalMinutes) {
    totalMinutes = totalMinutes % 1440;
    if (totalMinutes < 0) totalMinutes += 1440;
    let hour = Math.floor(totalMinutes / 60);
    let minute = totalMinutes % 60;
    let period = "오전";
    if (hour >= 12) { period = "오후"; if (hour > 12) hour -= 12; }
    if (hour === 0) hour = 12; 
    return `${period} ${hour}:${minute.toString().padStart(2, '0')}`;
}

function drawKakao() {
    const canvas = document.getElementById('kt-canvas');
    if (!canvas) return; // 캔버스가 없으면 중단
    const ctx = canvas.getContext('2d');
    

    const themeEl = document.getElementById('kt-theme');
    const msgEl = document.getElementById('kt-message');
    const timeEl = document.getElementById('kt-time');
    
    if (!themeEl || !msgEl || !timeEl) return;

    const theme = themeEl.value;
    const rawText = msgEl.value;
    const startTimeStr = timeEl.value;

    const customColors = document.getElementById('kt-custom-colors');
    if(customColors) {
        customColors.style.display = (theme === 'custom') ? 'block' : 'none';
    }

    const fontSize = 16;
    const lineHeight = 24; 
    const fontFamily = "'Pretendard', sans-serif";
    ctx.font = `${fontSize}px ${fontFamily}`;

    let currentMinutes = parseKtTime(startTimeStr);
    let isTimeParsable = (currentMinutes !== null);
    let lastDirection = null;

    const dialogueLines = rawText.split('\n');
    const bubblesData = [];
    const maxLineWidth = 240;
    const bubbleMargin = 10;
    let totalHeight = 20;
    const paddingX = 12; 
    const paddingY = 10; 

    dialogueLines.forEach((line) => {
        line = line.trim();
        if (line === "") return;

        let manualTimeStr = null;
        let contentText = line;
        const pipeIndex = line.lastIndexOf('|');
        if (pipeIndex !== -1 && pipeIndex < line.length - 1) {
            const textPart = line.substring(0, pipeIndex).trim();
            const timePart = line.substring(pipeIndex + 1).trim();
            if (textPart !== "") { contentText = textPart; manualTimeStr = timePart; }
        }

        let direction, bubbleText;
        const quoteMatch = contentText.match(/^"(.*)"$/);
        if (quoteMatch) { direction = 'right'; bubbleText = quoteMatch[1]; } 
        else { direction = 'left'; bubbleText = contentText; }

        let displayTimeStr = "";
        if (manualTimeStr) {
            displayTimeStr = manualTimeStr;
            if (isTimeParsable) {
                const parsed = parseKtTime(manualTimeStr);
                if (parsed !== null) currentMinutes = parsed;
            }
        } else {
            if (isTimeParsable) {
                if (lastDirection !== null && lastDirection !== direction) currentMinutes += 1;
                displayTimeStr = formatKtTime(currentMinutes);
            } else { displayTimeStr = startTimeStr; }
        }
        lastDirection = direction;

        let bubbleColor, textColor;
        if (direction === 'right') {
             if (theme === 'basic') { bubbleColor = '#FEE500'; textColor = '#000000'; } 
             else { 
                 bubbleColor = document.getElementById('kt-my-bg').value; 
                 textColor = document.getElementById('kt-my-text').value; 
             }
        } else {
            if (theme === 'basic') { bubbleColor = '#FFFFFF'; textColor = '#000000'; } 
            else { 
                bubbleColor = document.getElementById('kt-other-bg').value; 
                textColor = document.getElementById('kt-other-text').value; 
            }
        }

        const words = bubbleText.split('');
        const lines = [];
        let curLine = '';
        for (let n = 0; n < words.length; n++) {
            const testLine = curLine + words[n];
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxLineWidth && curLine !== '') { lines.push(curLine); curLine = words[n]; } 
            else { curLine = testLine; }
        }
        lines.push(curLine);

        let textWidth = 0;
        lines.forEach(l => { const w = ctx.measureText(l).width; if (w > textWidth) textWidth = w; });
        const bubbleWidth = textWidth + (paddingX * 2);
        const bubbleHeight = (lines.length * lineHeight) + (paddingY * 2);

        bubblesData.push({ direction, lines, bubbleColor, textColor, bubbleWidth, bubbleHeight, timeStr: displayTimeStr, paddingX, paddingY });
        totalHeight += bubbleHeight + bubbleMargin;
    });

    if (bubblesData.length === 0) { canvas.width = 300; canvas.height = 150; ctx.clearRect(0, 0, canvas.width, canvas.height); return; }

    totalHeight += 10;
    const margin = 20; 
    canvas.width = 400; 
    canvas.height = totalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let currentY = margin;
    bubblesData.forEach(bubble => {
        const { direction, lines, bubbleColor, textColor, bubbleWidth, bubbleHeight, timeStr, paddingX, paddingY } = bubble;
        const tailSize = 6;
        let bubbleX, tailX, timeX, timeY;

        ctx.font = `11px ${fontFamily}`;
        const timeWidth = ctx.measureText(timeStr).width;

        if (direction === 'right') {
            bubbleX = canvas.width - margin - bubbleWidth;
            tailX = bubbleX + bubbleWidth;
            timeX = bubbleX - timeWidth - 6;
            timeY = currentY + bubbleHeight - 3;
        } else {
            bubbleX = margin + tailSize;
            tailX = bubbleX;
            timeX = bubbleX + bubbleWidth + 6;
            timeY = currentY + bubbleHeight - 3;
        }

        ctx.fillStyle = bubbleColor;
        ctx.beginPath();
        if (direction === 'right') {
            ctx.moveTo(tailX - 2, currentY + 8);
            ctx.lineTo(tailX + tailSize, currentY + 13);
            ctx.lineTo(tailX - 2, currentY + 18);
        } else {
            ctx.moveTo(tailX + 2, currentY + 8);
            ctx.lineTo(tailX - tailSize, currentY + 13);
            ctx.lineTo(tailX + 2, currentY + 18);
        }
        ctx.fill();

        const r = 14; 
        ctx.beginPath();
        ctx.moveTo(bubbleX + r, currentY);
        ctx.lineTo(bubbleX + bubbleWidth - r, currentY);
        ctx.quadraticCurveTo(bubbleX + bubbleWidth, currentY, bubbleX + bubbleWidth, currentY + r);
        ctx.lineTo(bubbleX + bubbleWidth, currentY + bubbleHeight - r);
        ctx.quadraticCurveTo(bubbleX + bubbleWidth, currentY + bubbleHeight, bubbleX + bubbleWidth - r, currentY + bubbleHeight);
        ctx.lineTo(bubbleX + r, currentY + bubbleHeight);
        ctx.quadraticCurveTo(bubbleX, currentY + bubbleHeight, bubbleX, currentY + bubbleHeight - r);
        ctx.lineTo(bubbleX, currentY + r);
        ctx.quadraticCurveTo(bubbleX, currentY, bubbleX + r, currentY);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = textColor;
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.textBaseline = 'middle'; 
        lines.forEach((line, index) => {
            const textY = currentY + paddingY + (index * lineHeight) + (lineHeight / 2);
            ctx.fillText(line, bubbleX + paddingX, textY + 1);
        });

        ctx.fillStyle = '#666666';
        ctx.font = `11px ${fontFamily}`;
        ctx.textBaseline = 'bottom';
        ctx.fillText(timeStr, timeX, timeY);

        currentY += bubbleHeight + bubbleMargin;
    });
}

function loadMpBackgroundImage(event) {
    const container = document.getElementById('multiplayer-container');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            container.style.backgroundImage = 'url(' + e.target.result + ')';
            container.style.backgroundSize = 'cover';     
            container.style.backgroundPosition = 'center';
             container.style.backgroundRepeat = 'no-repeat';
        }
        reader.readAsDataURL(file);
        event.target.value = '';     }
}