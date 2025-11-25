function triggerUpload(id) { document.getElementById(id).click(); }

function loadImage(event, id) {
    const container = document.getElementById(id);
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            container.style.backgroundImage = `url(${e.target.result})`;
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
        reader.onload = function(e) { sheet.style.backgroundImage = `url(${e.target.result})`; }
        reader.readAsDataURL(file);
    }
}
function changeSheetColor(color) {
    document.getElementById('sheet-container').style.backgroundImage = 'none';
    document.getElementById('sheet-container').style.backgroundColor = color;
}
function setMode(mode) {
    const sheet = document.getElementById('sheet-container');
    const p2Set = document.getElementById('p2-set');
    const p2Sidebar = document.getElementById('p2-sidebar');
    if (mode === 1) {
        sheet.classList.remove('mode-2'); sheet.classList.add('mode-1');
        p2Set.style.opacity = '0'; p2Set.style.width = '0';
        p2Sidebar.style.display = 'none';
        document.getElementById('pair-name-container').style.display = 'none';
        updateBubbleTail('p1-bubble', 'left');
    } else {
        sheet.classList.remove('mode-1'); sheet.classList.add('mode-2');
        p2Set.style.display = 'flex';
        setTimeout(() => { p2Set.style.opacity = '1'; p2Set.style.width = '610px'; }, 10);
        p2Sidebar.style.display = 'flex';
        document.getElementById('pair-name-container').style.display = 'block';
        updateBubbleTail('p1-bubble', 'right');
    }
}
function updateBubbleTail(id, dir) { }
function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }
function toggleMusicPlayer() { document.querySelectorAll('.music-box').forEach(p => p.style.display = (p.style.display === 'none') ? 'flex' : 'none'); }
function toggleLike(btn) { btn.classList.toggle('active'); btn.textContent = btn.classList.contains('active') ? 'favorite' : 'favorite_border'; }
function toggleColorMenu(id, event) { 
    event.stopPropagation();
    document.querySelectorAll('.color-pickers').forEach(el => { if(el.id !== id) el.classList.remove('show'); });
    document.getElementById(id).classList.toggle('show'); 
}

let fontIndex = 0;
const fonts = ['font-style-1', 'font-style-2', 'font-style-3'];
function cyclePairFont() {
    const nameBox = document.getElementById('pair-name-container');
    nameBox.classList.remove(fonts[fontIndex]);
    fontIndex = (fontIndex + 1) % fonts.length;
    nameBox.classList.add(fonts[fontIndex]);
}
let globalFontIndex = 0;
const globalFonts = ['font-sans', 'font-serif', 'font-pixel'];
function cycleGlobalFont() {
    const sheet = document.getElementById('sheet-container');
    sheet.classList.remove(globalFonts[globalFontIndex]);
    globalFontIndex = (globalFontIndex + 1) % globalFonts.length;
    sheet.classList.add(globalFonts[globalFontIndex]);
}
function changePairColor(color) { document.documentElement.style.setProperty('--pair-name-color', color); }
function changeSubTextColor(color) { document.documentElement.style.setProperty('--sub-text-color', color); }
function changeP1TextColor(color) { document.documentElement.style.setProperty('--p1-text', color); }
function changeP2TextColor(color) { document.documentElement.style.setProperty('--p2-text', color); }
function changeBorderColor(color, frameId) { document.getElementById(frameId).style.borderColor = color; }
function changeMusicBg(color, playerId) { document.getElementById(playerId).style.background = color; }
function changeMusicText(color, playerId) { document.getElementById(playerId).style.color = color; }
function changeBoxBg(color, boxId) {
    const box = document.getElementById(boxId); box.style.backgroundColor = color;
    if(boxId.includes('bubble')) {
        let styleId = 'style-' + boxId; let style = document.getElementById(styleId); if (!style) { style = document.createElement('style'); style.id = styleId; document.head.appendChild(style); }
        const isP1InMode2 = document.getElementById('sheet-container').classList.contains('mode-2') && boxId === 'p1-bubble';
        let tailCss = isP1InMode2 ? `#${boxId}::after { border-color: ${color} transparent transparent transparent !important; }` : `#${boxId}::after { border-color: transparent ${color} transparent transparent !important; }`;
        style.innerHTML = tailCss;
    }
}
function changeBoxText(color, boxId) { document.getElementById(boxId).style.color = color; }
function changeColor(input) { const target = input.parentElement.classList.contains('profile-color-trigger') ? input.parentElement.parentElement : input.parentElement; target.style.backgroundColor = input.value; if(target.id && target.id.includes('profile-bg')) target.style.backgroundImage = 'none'; }
function triggerColor(id) { document.getElementById(id).click(); }
function updateGradient(startId, endId, barId) { const start = document.getElementById(startId).value; const end = document.getElementById(endId).value; document.getElementById(barId).style.background = `linear-gradient(to right, ${start}, ${end})`; }
function addSticker(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const layer = document.getElementById('sticker-layer'); const sticker = document.createElement('div'); sticker.className = 'sticker selected'; sticker.style.top = '100px'; sticker.style.left = '100px';
            const img = new Image(); img.src = e.target.result;
            img.onload = function() {
                const ratio = img.width / img.height; sticker.style.width = '100px'; sticker.style.height = (100 / ratio) + 'px';
                sticker.innerHTML = `<img src="${e.target.result}"><div class="control-btn delete-btn material-icons">close</div><div class="control-btn rotate-handle material-icons">refresh</div><div class="control-btn resize-handle material-icons">open_in_full</div>`;
                sticker.querySelector('.delete-btn').onclick = (ev) => { ev.stopPropagation(); sticker.remove(); };
                sticker.onmousedown = (ev) => { if(ev.target.className.includes('control-btn')) return; document.querySelectorAll('.sticker').forEach(s => s.classList.remove('selected')); sticker.classList.add('selected'); let shiftX = ev.clientX - sticker.getBoundingClientRect().left; let shiftY = ev.clientY - sticker.getBoundingClientRect().top; const moveAt = (pageX, pageY) => { sticker.style.left = (pageX - shiftX - layer.getBoundingClientRect().left) + 'px'; sticker.style.top = (pageY - shiftY - layer.getBoundingClientRect().top) + 'px'; }; const onMouseMove = (e) => moveAt(e.pageX, e.pageY); document.addEventListener('mousemove', onMouseMove); sticker.onmouseup = () => { document.removeEventListener('mousemove', onMouseMove); sticker.onmouseup = null; }; };
                const rotator = sticker.querySelector('.rotate-handle'); rotator.onmousedown = (e) => { e.stopPropagation(); e.preventDefault(); const rect = sticker.getBoundingClientRect(); const centerX = rect.left + rect.width/2; const centerY = rect.top + rect.height/2; const rotate = (ev) => { const angle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX) * 180 / Math.PI; sticker.style.transform = `rotate(${angle + 90}deg)`; }; const stopRotate = () => { document.removeEventListener('mousemove', rotate); document.removeEventListener('mouseup', stopRotate); }; document.addEventListener('mousemove', rotate); document.addEventListener('mouseup', stopRotate); };
                const resizer = sticker.querySelector('.resize-handle'); resizer.onmousedown = (e) => { e.stopPropagation(); e.preventDefault(); const startX = e.clientX; const startW = parseInt(getComputedStyle(sticker).width); const doDrag = (ev) => { let newW = startW + (ev.clientX - startX); if(newW < 30) newW = 30; sticker.style.width = newW + 'px'; sticker.style.height = (newW / ratio) + 'px'; }; const stopDrag = () => { document.removeEventListener('mousemove', doDrag); document.removeEventListener('mouseup', stopDrag); }; document.addEventListener('mousemove', doDrag); document.addEventListener('mouseup', stopDrag); };
                layer.appendChild(sticker);
            }
        }
        reader.readAsDataURL(file);
    }
}
document.addEventListener('mousedown', function(e){ if(!e.target.closest('.sticker')) document.querySelectorAll('.sticker').forEach(s => s.classList.remove('selected')); if (!e.target.closest('.color-pickers') && !e.target.closest('.inner-palette-btn') && !e.target.closest('.menu-item')) { document.querySelectorAll('.color-pickers').forEach(el => el.classList.remove('show')); } });

function showResetModal() { document.getElementById('reset-modal').classList.add('show'); }
function closeResetModal() { document.getElementById('reset-modal').classList.remove('show'); }
function resetSheet() { location.reload(); }

function saveImage() {
    const body = document.body;
    const sheet = document.getElementById("sheet-container");

    // 1. 화면 정리
    document.querySelectorAll('.color-pickers').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('.sticker').forEach(s => s.classList.remove('selected'));
    
    // 2. 기본 문구 투명 처리
    const editables = document.querySelectorAll('[contenteditable]');
    editables.forEach(el => { 
        if(el.innerText.trim() === el.getAttribute('data-default').trim()) {
            el.dataset.originalColor = el.style.color; 
            el.style.color = 'rgba(0,0,0,0)'; 
        }
    });

    // 3. 캡처 모드 진입 (스크롤 맨 위로)
    window.scrollTo(0, 0);
    body.classList.add('capturing');

    // 4. 이미지 생성
    html2canvas(sheet, { 
        scale: 2, 
        useCORS: true, 
        allowTaint: false, 
        backgroundColor: null,
        scrollX: 0,
        scrollY: 0
    }).then(canvas => {
        const link = document.createElement("a");
        // 타임스탬프 적용
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        link.download = `character_sheet_${timestamp}.png`;
        link.href = canvas.toDataURL();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 6. 원상 복구
        body.classList.remove('capturing');
        editables.forEach(el => { 
            if(el.style.color === 'rgba(0, 0, 0, 0)') {
                el.style.color = el.dataset.originalColor || ''; 
            }
        });
    }).catch(err => {
        console.error(err);
        body.classList.remove('capturing');
        editables.forEach(el => el.style.color = '');
        alert('저장 중 오류가 발생했습니다: ' + err);
    });
}
