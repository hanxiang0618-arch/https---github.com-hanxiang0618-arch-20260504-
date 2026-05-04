let capture;
let faceMesh;
let faces = [];
let isModelLoaded = false;
let stars = []; // 存放星星座標

// 定義右眼的兩組點位編號
const rightEyeOuter = [130, 247, 30, 29, 27, 28, 56, 190, 243, 112, 26, 22, 23, 24, 110, 25]; // 包含 247 的外圈
const rightEyeInner = [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7]; // 包含 246 的內圈

// 定義左眼的兩組點位編號
const leftEyeOuter = [359, 467, 260, 259, 257, 258, 286, 414, 463, 341, 256, 252, 253, 254, 339, 255];
const leftEyeInner = [263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249];

// 定義臉部外層輪廓點位 (Face Oval)
const faceOval = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

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

  // 初始化 100 顆星星的座標 (相對於影像寬高)
  for (let i = 0; i < 100; i++) {
    stars.push({ x: random(1), y: random(1), size: random(1, 3) });
  }
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

    // 1. 繪製黑色遮罩：將臉部輪廓外的區域塗黑
    fill(0);
    noStroke();
    beginShape();
    // 外部矩形：涵蓋整個 50% 的影像區域
    vertex(0, 0);
    vertex(w, 0);
    vertex(w, h);
    vertex(0, h);
    
    // 內部孔洞：根據臉部外層輪廓挖洞
    beginContour();
    for (let i = 0; i < faceOval.length; i++) {
      let p = faces[0].keypoints[faceOval[i]];
      if (p) vertex(p.x * sx, p.y * sy);
    }
    endContour();
    endShape(CLOSE);

    // 1.1 在黑色背景上畫星星
    fill(255);
    noStroke();
    for (let star of stars) {
      ellipse(star.x * w, star.y * h, star.size);
    }

    // 2. 繪製眼睛特效
    // 設定霓虹燈發光效果 (shadowBlur)
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(255, 0, 0);

    stroke(255, 0, 0);       // 設定線條為紅色
    strokeWeight(1);         // 設定粗細為 1
    strokeJoin(ROUND);       // 使線條轉折處較圓滑
    noFill();

    // 繪製右眼內外圈
    drawClosedLoop(faces[0].keypoints, rightEyeOuter, sx, sy);
    drawClosedLoop(faces[0].keypoints, rightEyeInner, sx, sy);

    // 繪製左眼內外圈
    drawClosedLoop(faces[0].keypoints, leftEyeOuter, sx, sy);
    drawClosedLoop(faces[0].keypoints, leftEyeInner, sx, sy);

    // 繪製臉部最外層輪廓線
    drawClosedLoop(faces[0].keypoints, faceOval, sx, sy);
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
