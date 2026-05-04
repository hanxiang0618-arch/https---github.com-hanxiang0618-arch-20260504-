let capture;
let faceMesh;
let faces = [];
// 指定要串接的點位編號
const lipIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(640, 480); // 設定擷取解析度以確保運算穩定
  capture.hide(); // 隱藏預設產生的 HTML 影片元件

  // 初始化 ml5 FaceMesh
  faceMesh = ml5.faceMesh(capture, () => {
    console.log("FaceMesh Model Loaded");
  });

  // 開始偵測臉部
  faceMesh.detectStart(capture, (results) => {
    faces = results;
  });
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

  // 如果有偵測到臉部，則繪製指定編號的連線
  if (faces.length > 0 && capture.width > 0) {
    let sx = w / capture.width;
    let sy = h / capture.height;

    stroke(255, 0, 0); // 設定線條為紅色
    strokeWeight(15);  // 設定粗細為 15
    noFill();

    for (let i = 0; i < lipIndices.length - 1; i++) {
      let p1 = faces[0].keypoints[lipIndices[i]];
      let p2 = faces[0].keypoints[lipIndices[i + 1]];
      if (p1 && p2) {
        line(p1.x * sx, p1.y * sy, p2.x * sx, p2.y * sy);
      }
    }
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
