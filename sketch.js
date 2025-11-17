// sketch.js - 包含效能優化的動畫、彈跳文字特效和 iframe 彈窗邏輯

var ranges;
let seed = Math.random() * 134; 
var mySize, margin;
let str_wei = 0;

// 顏色定義
let colors0 = "281914-1a1a1a-202020-242e30".split("-").map((a) => "#" + a);
let colors1 = "fef9fb-fafdff-ffffff-fcfbf4-f9f8f6".split("-").map((a) => "#" + a);
let colors2 = "8c75ff-c553d2-2dfd60-2788f5-23054f-f21252-8834f1-c4dd92-184fd3-f9fee2-2E294E-541388-F1E9DA-FFD400-D90368-e9baaa-ffa07a-164555-ffe1d0-acd9e7-4596c7-6d8370-e45240-21d3a4-3303f9-cd2220-173df6-244ca8-a00360-b31016".split("-").map((a) => "#" + a);
let pastel_bg = "ccd4bf-e7cba9-eebab2-f5f3f7-f5e2e4-f4c815-f9cad7-A57283-c1d5de-deede6-AAD9CD-E8D595-E9BBB5-E7CBA9-8DA47E-f7f6cf-b6d8f2-f4cfdf-9ac8eb".split("-").map((a) => "#" + a);

let colorselet = [];
let unit;
let count;
let Cubes = []; 
let overAllTexture; 

// ===================================
// P5.js 核心函數
// ===================================

function setup() {
    randomSeed(seed);
    
    createCanvas(windowWidth, windowHeight); 
    
    mySize = max(width, height); 
    margin = mySize / 100; 

    colorselet[0] = random(colors1);
    colorselet[1] = random(colors2);
    colorselet[2] = random(pastel_bg);
    colorselet[3] = random(pastel_bg);
    colorselet[4] = random(pastel_bg);
    
    initCubes();
    makeFilter(); 
    
    colorMode(RGB, 255); 
    background(random(colors1));
    textFont("Chiron GoRound TC");
}

function initCubes() {
    Cubes = []; 
    unit = int(random(5, 40));

    noStroke();
    let wideCount = width / unit;
    let highCount = height / unit;
    count = wideCount * highCount;

    let index = 0;
    for (let y = 0; y < highCount; y++) {
        for (let x = 0; x < wideCount; x++) {
            Cubes[index++] = new Brush(
                x * unit,
                y * unit,
                random(unit),
                random(unit),
                random(2, 0.5),
                6 * unit / random(0.5, 2)
            );
        }
    }
}

function draw() {
    // 動畫持續播放
    for (let i = 0; i < count; i++) {
        Cubes[i].update(); 
        Cubes[i].draw();
    }
    
    // ===================================
    // 網頁中央的文字繪製 (含彈跳特效)
    // ===================================
    
    let centerText = "你好！我是教科系1B 葉亭妤！";
    
    // 設定文字大小、粗細、對齊
    textSize(40); 
    textStyle(NORMAL); 
    textAlign(CENTER, CENTER);
    
    // 1. 設定白色邊框
    stroke(255);       
    strokeWeight(2);   
    
    // 2. 設定黑色文字顏色
    fill(0);           
    
    // 彈跳動畫邏輯
    let bounceAmplitude = 5;    // 彈跳幅度 (輕微 5 像素)
    let bounceFrequency = 0.05; // 彈跳速度 (適中)
    
    let bounceOffset = sin(frameCount * bounceFrequency) * bounceAmplitude;
    
    // 3. 繪製文字到畫布中央，加上彈跳位移
    text(centerText, width / 2, height / 2 + bounceOffset); 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  mySize = max(windowWidth, windowHeight);
  margin = mySize / 100;

  initCubes();

  makeFilter(); 
  
  colorMode(RGB, 255);
  background(random(colors1));
}

// ===================================
// Brush 類別 (動畫邏輯 - 已優化)
// ===================================

class Brush {
    constructor(xOff, yOff, x, y, speed, unit) {
        this.xOff = xOff * 2;
        this.yOff = yOff * 2;
        this.x = x;
        this.y = y;
        this.speed = speed * 2;
        this.unit = unit;
        this.xDir = 1;
        this.yDir = 1;
        
        // 效能優化：在創建時就固定顏色和透明度
        this.fixedColor = random(colorselet) + "1a"; 
    }

    update() {
        this.x = this.x + this.speed * this.xDir;
        if (this.x >= this.unit || this.x <= 0) {
            this.xDir *= -1;
            this.x = this.x + 1 * this.xDir;
            this.y = this.y + 1 * this.yDir;
        }
        if (this.y >= this.unit || this.y <= 0) {
            this.yDir *= -1;
            this.y = this.y + 1 * this.yDir;
        }
    }

    draw() {
        noStroke();
        fill(this.fixedColor); 
        
        let y_size = random(30) * noise(sin(this.x), cos(this.y), frameCount * 0.01);
        rect(this.xOff + this.x, this.yOff + this.y, 10 * random(random(random())), y_size);
    }
}

// ===================================
// 濾鏡 (makeFilter)
// ===================================

function makeFilter() {
    randomSeed(seed);
    
    colorMode(HSB, 360, 100, 100, 100);
    
    let shadowColor = color(0, 0, 5, 5); 
    drawingContext.shadowColor = shadowColor.toString(); 
    
    overAllTexture = createGraphics(width, height);
    
    overAllTexture.colorMode(HSB, 360, 100, 100, 100); 
    overAllTexture.loadPixels();
    
    for (var i = 0; i < width; i++) {  // noprotect
        for (var j = 0; j < height; j++) { // noprotect
            overAllTexture.set(
                i,
                j,
                overAllTexture.color(0, 10, 70, noise(i / 3, j / 3, (i * j) / 50) * random(10, 25))
            );
        }
    }
    overAllTexture.updatePixels();
    
    colorMode(RGB, 255); 
}

// ===================================
// iframe 彈窗功能
// ===================================

const LECTURE_URL = "https://hackmd.io/@Ps5VCl_ESoGUUSDJGZ9QpA/ByEIDQRsll";
const WORKS_URL = "https://jingyu127.github.io/20251020/";
const QUIZ_URL = "https://jingyu127.github.io/text/"; 

/**
 * 通用函數：顯示指定的 URL 於 iframe 中。
 */
function showIframe(event, url) {
    if (event) {
        event.preventDefault(); // 阻止連結跳轉
    }
    
    const display = document.getElementById('iframe-display');
    const iframe = document.getElementById('lecture-iframe');

    iframe.src = url;
    display.classList.add('visible');
}

// 綁定到 HTML 的具體函數：
function showLectureIframe(event) {
    showIframe(event, LECTURE_URL);
}

function showWorksIframe(event) {
    showIframe(event, WORKS_URL);
}

function showQuizIframe(event) {
    showIframe(event, QUIZ_URL);
}

/**
 * 點擊關閉按鈕時調用此函數 (隱藏 iframe)。
 */
function hideLectureIframe() {
    const display = document.getElementById('iframe-display');
    const iframe = document.getElementById('lecture-iframe');

    display.classList.remove('visible');
    
    // 清空 iframe 來源，停止任何潛在的播放
    iframe.src = "";
}

// 確保這些函數是全域的
window.showLectureIframe = showLectureIframe;
window.showWorksIframe = showWorksIframe; 
window.showQuizIframe = showQuizIframe; 
window.hideLectureIframe = hideLectureIframe;

// ===================================
// 儲存功能
// ===================================

function keyTyped() {
    if (key === "s" || key === "S") {
        image(overAllTexture, 0, 0);
        noFill();
        stroke("#202020");
        strokeWeight(margin);
        rect(0, 0, width, height);
        noLoop();
        saveCanvas("Mosaic Square_3", "png");
    }
}