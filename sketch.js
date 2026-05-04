let capture;
let faceMesh;
let faces = [];
let isModelLoaded = false;

// 指定要串接的點位編號
const lipIndices = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(640, 480); // 設定擷取解析度以確保運算穩定
  capture.hide(); // 隱藏預設產生的 HTML 影片元件

  // 初始化 ml5 FaceMesh
  faceMesh = ml5.faceMesh(capture, () => {
    console.log("FaceMesh Model Loaded");
    isModelLoaded = true;
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

  // 檢查是否有偵測到臉部資料
  if (faces.length > 0 && faces[0].keypoints) {
    let sx = w / capture.width;
    let sy = h / capture.height;

    stroke(255, 0, 0);       // 設定線條為紅色
    strokeWeight(1);         // 設定粗細為 1
    strokeJoin(ROUND);       // 使線條轉折處較圓滑
    noFill();

    // 開始繪製線段
    for (let i = 0; i < lipIndices.length - 1; i++) {
      let idx1 = lipIndices[i];
      let idx2 = lipIndices[i + 1];

      let p1 = faces[0].keypoints[idx1];
      let p2 = faces[0].keypoints[idx2];

      // 確保點位存在才繪製
      if (p1 && p2) {
        line(p1.x * sx, p1.y * sy, p2.x * sx, p2.y * sy);
      }
    }
  }
  pop();

  // 如果模型還沒載入，在畫面上顯示提示字樣
  if (!isModelLoaded) {
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text("FaceMesh 模型載入中...", width / 2, height / 2 + h / 2 + 30);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
