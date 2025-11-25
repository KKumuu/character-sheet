function triggerUpload(id) { document.getElementById(id).click(); }
function loadImage(event, id) {
    const container = document.getElementById(id);
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            container.style.backgroundImage = 'url(' + e.target.result + ')';
            const ph = container.querySelector('.placeholder-text, .plus, .placeholder');
            if(ph) ph.style.display = 'none';
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
    const sheet = document.getElementById('sheet-container');
    sheet.style.backgroundImage = 'none';
    sheet.style.backgroundColor = color;
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

// 커스텀 색상 여부
let isManualColor = {
    pair: false,
    p1Text: false,
    p2Text: false,
    p1Border: false,
    p2Border: false
};

let isColorLinked = false;
function toggleColorLink(btn) {
    isColorLinked = !isColorLinked;
    btn.classList.toggle('active-link');
}

// [수정] 다크모드: 커스텀 색상 완벽 보호 로직
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

    // 기본값
    const defaultLight = '#333333'; const defaultDark = '#eeeeee';

    // 사용자가 색을 바꾼 적이 없다면 기본 테마 색상 적용
    if (!isManualColor.pair) {
        document.documentElement.style.setProperty('--pair-name-color', isDark ? defaultDark : defaultLight);
    }
    if (!isManualColor.p1Text) {
        document.documentElement.style.setProperty('--p1-text', isDark ? defaultDark : defaultLight);
    }
    if (!isManualColor.p2Text) {
        document.documentElement.style.setProperty('--p2-text', isDark ? defaultDark : defaultLight);
    }
}

function toggleMusicPlayer() { 
    document.querySelectorAll('.music-box').forEach(p => { p.style.display = (p.style.display === 'none') ? 'flex' : 'none'; });
}
function toggleLike(btn) { 
    btn.classList.toggle('active'); btn.textContent = btn.classList.contains('active') ? 'favorite' : 'favorite_border'; 
}
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

let currentCropTargetId = null;
let cropperImage = new Image();
let cropperCanvas = null;
let cropperCtx = null;
let currentScale = 1;
let currentRotation = 0;
let imgPosX = 0, imgPosY = 0;
let isDragging = false;
let startX, startY;

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
    const ph = container.querySelector('.placeholder-text, .plus, .placeholder');
    if(ph) ph.style.display = 'none';
    if(currentCropTargetId.includes('profile-bg')) container.style.backgroundColor = 'transparent';
    closeCropper();
}
function closeCropper() {
    document.getElementById('cropper-modal').classList.remove('show');
    currentCropTargetId = null;
}

let fontIndex = 0; const fonts = ['font-style-1', 'font-style-2', 'font-style-3'];
function cyclePairFont() {
    const nameBox = document.getElementById('pair-name-container');
    nameBox.classList.remove(fonts[fontIndex]);
    fontIndex = (fontIndex + 1) % fonts.length;
    nameBox.classList.add(fonts[fontIndex]);
}

function changePairColor(color) { 
    document.documentElement.style.setProperty('--pair-name-color', color); 
    isManualColor.pair = true; // 수동 변경 체크
}

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
function togglePairSubLabel() { 
    const el = document.getElementById('pair-sub-label-box'); 
    el.style.display = (el.style.display === 'none') ? 'flex' : 'none'; 
}

function changeP1TextColor(color) { 
    document.documentElement.style.setProperty('--p1-text', color); 
    isManualColor.p1Text = true; 
    if(isColorLinked) {
        document.documentElement.style.setProperty('--p2-text', color);
        isManualColor.p2Text = true;
    }
}
function changeP2TextColor(color) { 
    document.documentElement.style.setProperty('--p2-text', color); 
    isManualColor.p2Text = true; 
}
function changeP1BorderColor(color) {
    changeBorderColor(color, 'p1-frame');
    isManualColor.p1Border = true;
    if(isColorLinked) {
        changeBorderColor(color, 'p2-frame');
        isManualColor.p2Border = true;
    }
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
function addSticker(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const layer = document.getElementById('sticker-layer'); 
            const sticker = document.createElement('div'); sticker.className = 'sticker selected'; 
            sticker.style.top = '100px'; sticker.style.left = '100px';
            const img = new Image(); img.src = e.target.result;
            img.onload = function() {
                const ratio = img.width / img.height; 
                sticker.style.width = '100px'; sticker.style.height = (100 / ratio) + 'px';
                sticker.innerHTML = '<img src="' + e.target.result + '"><div class="control-btn delete-btn material-icons">close</div><div class="control-btn rotate-handle material-icons">refresh</div><div class="control-btn resize-handle material-icons">open_in_full</div>';
                sticker.querySelector('.delete-btn').onclick = (ev) => { ev.stopPropagation(); sticker.remove(); };
                sticker.onmousedown = (ev) => { 
                    if(ev.target.className.includes('control-btn')) return; 
                    document.querySelectorAll('.sticker').forEach(s => s.classList.remove('selected')); sticker.classList.add('selected'); 
                    let shiftX = ev.clientX - sticker.getBoundingClientRect().left; let shiftY = ev.clientY - sticker.getBoundingClientRect().top; 
                    const moveAt = (pageX, pageY) => { sticker.style.left = (pageX - shiftX - layer.getBoundingClientRect().left) + 'px'; sticker.style.top = (pageY - shiftY - layer.getBoundingClientRect().top) + 'px'; }; 
                    const onMouseMove = (e) => moveAt(e.pageX, e.pageY); 
                    document.addEventListener('mousemove', onMouseMove); 
                    sticker.onmouseup = () => { document.removeEventListener('mousemove', onMouseMove); sticker.onmouseup = null; }; 
                };
                sticker.querySelector('.rotate-handle').onmousedown = (e) => { e.stopPropagation(); e.preventDefault(); const rect = sticker.getBoundingClientRect(); const centerX = rect.left + rect.width/2; const centerY = rect.top + rect.height/2; const rotate = (ev) => { const angle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX) * 180 / Math.PI; sticker.style.transform = 'rotate(' + (angle + 90) + 'deg)'; }; const stopRotate = () => { document.removeEventListener('mousemove', rotate); document.removeEventListener('mouseup', stopRotate); }; document.addEventListener('mousemove', rotate); document.addEventListener('mouseup', stopRotate); };
                sticker.querySelector('.resize-handle').onmousedown = (e) => { e.stopPropagation(); e.preventDefault(); const startX = e.clientX; const startW = parseInt(getComputedStyle(sticker).width); const doDrag = (ev) => { let newW = startW + (ev.clientX - startX); if(newW < 30) newW = 30; sticker.style.width = newW + 'px'; sticker.style.height = (newW / ratio) + 'px'; }; const stopDrag = () => { document.removeEventListener('mousemove', doDrag); document.removeEventListener('mouseup', stopDrag); }; document.addEventListener('mousemove', doDrag); document.addEventListener('mouseup', stopDrag); };
                layer.appendChild(sticker);
            }
        }
        reader.readAsDataURL(file);
    }
}
document.addEventListener('mousedown', function(e){ if(!e.target.closest('.sticker')) document.querySelectorAll('.sticker').forEach(s => s.classList.remove('selected')); if (!e.target.closest('.color-pickers') && !e.target.closest('.inner-palette-btn') && !e.target.closest('.menu-item')) { document.querySelectorAll('.color-pickers').forEach(el => el.classList.remove('show')); } });
function showResetModal() { document.getElementById('reset-modal').classList.add('show'); }
function closeResetModal() { document.getElementById('reset-modal').classList.remove('show'); }
function resetPage() { try { localStorage.clear(); sessionStorage.clear(); } catch(e) {} location.reload(); }
function saveImage() {
    const body = document.body; const sheet = document.getElementById("sheet-container");
    document.querySelectorAll('.color-pickers').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('.sticker').forEach(s => s.classList.remove('selected'));
    const editables = document.querySelectorAll('[contenteditable]');
    try { editables.forEach(el => { if(!el.getAttribute('data-default')) return; const current = el.innerText.replace(/\s/g, ''); const def = el.getAttribute('data-default').replace(/\s/g, ''); if(current === def || current === '') { el.dataset.originalColor = el.style.color; el.style.color = 'rgba(0,0,0,0)'; } }); } catch (e) {}
    body.classList.add('capturing'); window.scrollTo(0,0); 
    html2canvas(sheet, { scale: 2, useCORS: true, allowTaint: false, backgroundColor: null }).then(canvas => {
        try { const link = document.createElement("a"); const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19); link.download = 'character_sheet_' + timestamp + '.png'; link.href = canvas.toDataURL("image/png"); document.body.appendChild(link); link.click(); document.body.removeChild(link); } catch (err) { alert("저장 오류 (SecurityError)"); }
        body.classList.remove('capturing'); editables.forEach(el => { if(el.style.color === 'rgba(0, 0, 0, 0)') el.style.color = el.dataset.originalColor || ''; });
    }).catch(err => { body.classList.remove('capturing'); editables.forEach(el => { if(el.style.color === 'rgba(0, 0, 0, 0)') el.style.color = ''; }); alert('저장 실패: ' + err); });
}

// [추가] 미니멀 모드 토글 함수
function toggleMinimalMode() {
    const sheet = document.getElementById('sheet-container');
    const btn = document.getElementById('btn-minimal');
    
    // 클래스 토글 (ON/OFF)
    sheet.classList.toggle('minimal-mode');
    
    // 버튼 활성화 스타일 표시 (선택 사항)
    if (sheet.classList.contains('minimal-mode')) {
        btn.classList.add('active-link');
        btn.querySelector('.material-icons').textContent = 'crop_square'; // 아이콘 변경 (꽉 찬 네모)
    } else {
        btn.classList.remove('active-link');
        btn.querySelector('.material-icons').textContent = 'crop_portrait'; // 아이콘 복구
    }
}
