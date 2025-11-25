// ==========================================
// [기본 기능] 이미지 로드 및 설정
// ==========================================
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
            // 프로필 영역은 배경 투명화
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
    const sheet = document.getElementById('sheet-container');
    sheet.style.backgroundImage = 'none';
    sheet.style.backgroundColor = color;
}

function setMode(mode) {
    const sheet = document.getElementById('sheet-container');
    const p2Set = document.getElementById('p2-set');
    const p2Sidebar = document.getElementById('p2-sidebar');
    
    if (mode === 1) {
        sheet.classList.remove('mode-2'); 
        sheet.classList.add('mode-1');
        p2Set.style.opacity = '0'; 
        p2Set.style.width = '0';
        p2Sidebar.style.display = 'none';
        document.getElementById('pair-name-wrapper').style.display = 'none';
    } else {
        sheet.classList.remove('mode-1'); 
        sheet.classList.add('mode-2');
        p2Set.style.display = 'flex';
        setTimeout(() => { 
            p2Set.style.opacity = '1'; 
            p2Set.style.width = '640px'; 
        }, 10);
        p2Sidebar.style.display = 'flex';
        document.getElementById('pair-name-wrapper').style.display = 'flex';
    }
}

function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }
function toggleMusicPlayer() { 
    document.querySelectorAll('.music-box').forEach(p => {
        p.style.display = (p.style.display === 'none') ? 'flex' : 'none';
    });
}
function toggleLike(btn) { 
    btn.classList.toggle('active'); 
    btn.textContent = btn.classList.contains('active') ? 'favorite' : 'favorite_border'; 
}

function toggleColorMenu(id, event) { 
    event.stopPropagation();
    document.querySelectorAll('.color-pickers').forEach(el => { 
        if(el.id !== id) el.classList.remove('show'); 
    });
    document.getElementById(id).classList.toggle('show'); 
}

// ==========================================
// [스타일 변경 기능]
// ==========================================
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
function changePairSize(delta) { 
    const el = document.getElementById('pair-name-container'); 
    let size = parseInt(window.getComputedStyle(el).fontSize); 
    el.style.fontSize = (size + delta) + 'px'; 
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

function changeP1TextColor(color) { document.documentElement.style.setProperty('--p1-text', color); }
function changeP2TextColor(color) { document.documentElement.style.setProperty('--p2-text', color); }
function changePhoneColor(color, frameId) { document.getElementById(frameId).style.backgroundColor = color; }

function changeMusicBg(color, playerId) { 
    const player = document.getElementById(playerId); 
    let r=0, g=0, b=0; 
    if (color.length == 7) { 
        r = parseInt(color.substr(1,2), 16); g = parseInt(color.substr(3,2), 16); b = parseInt(color.substr(5,2), 16); 
    }
    let opacity = player.dataset.opacity || 0.4; 
    player.style.background = `rgba(${r},${g},${b},${opacity})`;
    player.dataset.r = r; player.dataset.g = g; player.dataset.b = b;
}

function changeMusicOpacity(val, playerId) { 
    const player = document.getElementById(playerId); 
    player.dataset.opacity = val;
    let r = player.dataset.r || 0; let g = player.dataset.g || 0; let b = player.dataset.b || 0;
    player.style.background = `rgba(${r},${g},${b},${val})`;
}

function changeMusicText(color, playerId) { document.getElementById(playerId).style.color = color; }

function changeBoxBg(color, boxId) {
    const box = document.getElementById(boxId); 
    box.style.backgroundColor = color;
    if(boxId.includes('bubble')) {
        let styleId = 'style-' + boxId; 
        let style = document.getElementById(styleId); 
        if (!style) { style = document.createElement('style'); style.id = styleId; document.head.appendChild(style); }
        const isP1InMode2 = document.getElementById('sheet-container').classList.contains('mode-2') && boxId === 'p1-bubble';
        let tailCss = isP1InMode2 
            ? `#${boxId}::after { border-color: ${color} transparent transparent transparent !important; }` 
            : `#${boxId}::after { border-color: transparent ${color} transparent transparent !important; }`;
        style.innerHTML = tailCss;
    }
}

function changeBoxText(color, boxId) { document.getElementById(boxId).style.color = color; }

function changeColor(input) { 
    const target = input.parentElement.classList.contains('profile-color-trigger') 
                   ? input.parentElement.parentElement 
                   : input.parentElement; 
    target.style.backgroundColor = input.value; 
    if(target.id && target.id.includes('profile-bg')) target.style.backgroundImage = 'none'; 
}
function triggerColor(id) { document.getElementById(id).click(); }
function updateGradient(startId, endId, barId) { 
    const start = document.getElementById(startId).value; 
    const end = document.getElementById(endId).value; 
    document.getElementById(barId).style.background = `linear-gradient(to right, ${start}, ${end})`; 
}

// ==========================================
// [스티커 기능]
// ==========================================
function addSticker(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const layer = document.getElementById('sticker-layer'); 
            const sticker = document.createElement('div'); 
            sticker.className = 'sticker selected'; 
            sticker.style.top = '100px'; sticker.style.left = '100px';
            const img = new Image(); 
            img.src = e.target.result;
            img.onload = function() {
                const ratio = img.width / img.height; 
                sticker.style.width = '100px'; 
                sticker.style.height = (100 / ratio) + 'px';
                sticker.innerHTML = `<img src="${e.target.result}"><div class="control-btn delete-btn material-icons">close</div><div class="control-btn rotate-handle material-icons">refresh</div><div class="control-btn resize-handle material-icons">open_in_full</div>`;
                
                sticker.querySelector('.delete-btn').onclick = (ev) => { ev.stopPropagation(); sticker.remove(); };
                
                sticker.onmousedown = (ev) => { 
                    if(ev.target.className.includes('control-btn')) return; 
                    document.querySelectorAll('.sticker').forEach(s => s.classList.remove('selected')); 
                    sticker.classList.add('selected'); 
                    let shiftX = ev.clientX - sticker.getBoundingClientRect().left; 
                    let shiftY = ev.clientY - sticker.getBoundingClientRect().top; 
                    const moveAt = (pageX, pageY) => { 
                        sticker.style.left = (pageX - shiftX - layer.getBoundingClientRect().left) + 'px'; 
                        sticker.style.top = (pageY - shiftY - layer.getBoundingClientRect().top) + 'px'; 
                    }; 
                    const onMouseMove = (e) => moveAt(e.pageX, e.pageY); 
                    document.addEventListener('mousemove', onMouseMove); 
                    sticker.onmouseup = () => { document.removeEventListener('mousemove', onMouseMove); sticker.onmouseup = null; }; 
                };
                
                const rotator = sticker.querySelector('.rotate-handle'); 
                rotator.onmousedown = (e) => { 
                    e.stopPropagation(); e.preventDefault(); 
                    const rect = sticker.getBoundingClientRect(); 
                    const centerX = rect.left + rect.width/2; 
                    const centerY = rect.top + rect.height/2; 
                    const rotate = (ev) => { 
                        const angle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX) * 180 / Math.PI; 
                        sticker.style.transform = `rotate(${angle + 90}deg)`; 
                    }; 
                    const stopRotate = () => { document.removeEventListener('mousemove', rotate); document.removeEventListener('mouseup', stopRotate); }; 
                    document.addEventListener('mousemove', rotate); document.addEventListener('mouseup', stopRotate); 
                };

                const resizer = sticker.querySelector('.resize-handle'); 
                resizer.onmousedown = (e) => { 
                    e.stopPropagation(); e.preventDefault(); 
                    const startX = e.clientX; 
                    const startW = parseInt(getComputedStyle(sticker).width); 
                    const doDrag = (ev) => { 
                        let newW = startW + (ev.clientX - startX); 
                        if(newW < 30) newW = 30; 
                        sticker.style.width = newW + 'px'; 
                        sticker.style.height = (newW / ratio) + 'px'; 
                    }; 
                    const stopDrag = () => { document.removeEventListener('mousemove', doDrag); document.removeEventListener('mouseup', stopDrag); }; 
                    document.addEventListener('mousemove', doDrag); document.addEventListener('mouseup', stopDrag); 
                };
                layer.appendChild(sticker);
            }
        }
        reader.readAsDataURL(file);
    }
}

document.addEventListener('mousedown', function(e){ 
    if(!e.target.closest('.sticker')) document.querySelectorAll('.sticker').forEach(s => s.classList.remove('selected')); 
    if (!e.target.closest('.color-pickers') && !e.target.closest('.inner-palette-btn') && !e.target.closest('.menu-item')) { 
        document.querySelectorAll('.color-pickers').forEach(el => el.classList.remove('show')); 
    } 
});

function showResetModal() { document.getElementById('reset-modal').classList.add('show'); }
function closeResetModal() { document.getElementById('reset-modal').classList.remove('show'); }

// [FIXED] HTML의 onclick="resetPage()"와 이름을 일치시켰습니다.
function resetPage() { 
    // 혹시 모를 로컬 데이터까지 정리
    try { localStorage.clear(); sessionStorage.clear(); } catch(e) {}
    location.reload(); 
}

// ==========================================
// [FIXED] 저장 기능 (오류 감지 및 안전 저장)
// ==========================================
function saveImage() {
    const body = document.body;
    const sheet = document.getElementById("sheet-container");

    // 1. 메뉴 및 선택해제
    document.querySelectorAll('.color-pickers').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('.sticker').forEach(s => s.classList.remove('selected'));
    
    // 2. 기본 문구 숨기기 (오류 방지를 위한 try-catch)
    const editables = document.querySelectorAll('[contenteditable]');
    try {
        editables.forEach(el => { 
            // 데이터가 없거나 비어있으면 패스
            if(!el.getAttribute('data-default')) return;
            
            const current = el.innerText.replace(/\s/g, ''); // 공백제거 비교
            const def = el.getAttribute('data-default').replace(/\s/g, '');
            
            if(current === def || current === '') {
                el.dataset.originalColor = el.style.color; 
                el.style.color = 'rgba(0,0,0,0)'; 
            }
        });
    } catch (e) { console.log("텍스트 처리 중 경미한 오류:", e); }

    // 3. 캡처 모드 진입
    body.classList.add('capturing');
    window.scrollTo(0,0); // 스크롤 초기화 (잘림 방지)

    // 4. 캡처 실행
    html2canvas(sheet, { 
        scale: 2, 
        useCORS: true, 
        allowTaint: false, // 보안 에러 방지
        backgroundColor: null,
        logging: true // 에러 확인용 로그
    }).then(canvas => {
        // 성공 시 다운로드
        try {
            const link = document.createElement("a");
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            link.download = `character_sheet_${timestamp}.png`;
            link.href = canvas.toDataURL("image/png");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            alert("이미지 변환 보안 오류가 발생했습니다.\n서버 없이 로컬 파일을 사용할 때 주로 발생합니다.\n(SecurityError: Tainted canvas)");
        }
        
        // 복구
        body.classList.remove('capturing');
        editables.forEach(el => { 
            if(el.style.color === 'rgba(0, 0, 0, 0)') {
                el.style.color = el.dataset.originalColor || ''; 
            }
        });
    }).catch(err => {
        // 실패 시
        console.error(err);
        body.classList.remove('capturing');
        editables.forEach(el => { if(el.style.color === 'rgba(0, 0, 0, 0)') el.style.color = ''; });
        alert('저장 실패!\n오류 내용: ' + err);
    });
}
