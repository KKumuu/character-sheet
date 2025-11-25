function triggerUpload(id) { document.getElementById(id).click(); }
function loadImage(event, id) {
    const imageBox = document.getElementById(id).parentElement;
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageBox.style.backgroundImage = `url(${e.target.result})`;
            const span = imageBox.querySelector('span');
            if(span) span.style.display = 'none';
        }
        reader.readAsDataURL(file);
    }
}
function saveImage() {
    const sheet = document.getElementById("sheet-container");
    html2canvas(sheet).then(canvas => {
        const link = document.createElement("a");
        link.download = 'my_character_sheet.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}
