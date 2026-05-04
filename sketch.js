let capture;

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.hide(); // 隱藏預設產生的 HTML 影片元件
}

function draw() {
  background('#e7c6ff');

  let w = width * 0.5;
  let h = height * 0.5;
  let x = (width - w) / 2;
  let y = (height - h) / 2;

  push();
  // 將原點移至影像顯示區域的右側，並水平翻轉達成「左右顛倒」的效果
  translate(x + w, y);
  scale(-1, 1);
  image(capture, 0, 0, w, h);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
