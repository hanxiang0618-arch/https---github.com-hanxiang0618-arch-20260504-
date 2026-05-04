let capture;
let faceMesh;
let faces = [];
let isModelLoaded = false;

// 定義右眼的兩組點位編號
const rightEyeOuter = [130, 247, 30, 29, 27, 28, 56, 190, 243, 112, 26, 22, 23, 24, 110, 25]; // 包含 247 的外圈
const rightEyeInner = [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7]; // 包含 246 的內圈


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

    // 繪製右眼外圈 (包含 247)
    drawClosedLoop(faces[0].keypoints, rightEyeOuter, sx, sy);
    
    // 繪製右眼內圈 (包含 246)
    drawClosedLoop(faces[0].keypoints, rightEyeInner, sx, sy);
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

// 輔助函式：繪製封閉的線圈
function drawClosedLoop(keypoints, indices, sx, sy) {
  for (let i = 0; i < indices.length; i++) {
    let p1 = keypoints[indices[i]];
    let p2 = keypoints[indices[(i + 1) % indices.length]]; // 使用取餘數來連回第一個點

    if (p1 && p2) {
      line(p1.x * sx, p1.y * sy, p2.x * sx, p2.y * sy);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
