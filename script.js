function triggerUpload(id) { document.getElementById(id).click(); }

function loadImage(event, id) {
    const box = document.getElementById(id);
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            box.style.backgroundImage = `url(${e.target.result})`;
            // 내부 텍스트 숨김
            const span = box.querySelector('.placeholder');
            if(span) span.style.display = 'none';
        }
        reader.readAsDataURL(file);
    }
}

// 컬러피커 트리거
function triggerColor(id) {
    document.getElementById(id).click();
}

// 팔레트 색상 변경 시 원형 배경색 변경
function changeColor(input) {
    input.parentElement.style.backgroundColor = input.value;
}

// 말풍선 색상 변경
function changeBubbleColor(color) {
    const bubble = document.getElementById('speech-bubble');
    bubble.style.backgroundColor = color;
    
    // 말풍선 꼬리 색상도 같이 변경 (동적으로 스타일 주입)
    // 기존 스타일 시트에서 after의 border-color를 바꾸기 어려우므로 style 태그 추가 방식 사용
    let style = document.getElementById('bubble-style');
    if (!style) {
        style = document.createElement('style');
        style.id = 'bubble-style';
        document.head.appendChild(style);
    }
    style.innerHTML = `.bubble::after { border-color: ${color} transparent !important; }`;
}

// 그라데이션 업데이트
function updateGradient() {
    const start = document.getElementById('grad-start').value;
    const end = document.getElementById('grad-end').value;
    const bar = document.getElementById('gradient-bar');
    bar.style.background = `linear-gradient(to right, ${start}, ${end})`;
}

function saveImage() {
    const sheet = document.getElementById("sheet-container");
    // html2canvas 옵션: scale을 높여서 화질 개선
    html2canvas(sheet, { scale: 2 }).then(canvas => {
        const link = document.createElement("a");
        link.download = 'my_character_sheet_v2.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}
