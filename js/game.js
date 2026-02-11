import { GRAVITY, FRICTION, JUMP_FORCE, MOVE_SPEED, TILE_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT, worldMap } from './constants.js';
import { Particle, TextParticle } from './classes/Particle.js';
import { Camera } from './classes/Camera.js';
import { Player } from './classes/Player.js';
import { Enemy } from './classes/Enemy.js';
import { Mushroom } from './classes/Mushroom.js';
import { setupControls } from './controls.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// 게임 상태
const keys = {};
let score = 0;
let isGameOver = false;
let isLevelCleared = false;
let screenShake = 0;

let particles = [];
let textParticles = [];

const camera = new Camera(canvas.width);
const player = new Player();

const platforms = [];
const coins = [];
const enemies = [];
const mushrooms = [];
let goal = { x: 0, y: 0, width: 10, height: 280 };

function createExplosion(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function createScoreText(x, y, scoreVal) {
    textParticles.push(new TextParticle(x, y, "+" + scoreVal, "#FFFF00"));
    score += scoreVal;
    document.getElementById('scoreVal').innerText = score;
}

function initLevel() {
    platforms.length = 0; coins.length = 0; enemies.length = 0; mushrooms.length = 0;
    particles = []; textParticles = [];
    isLevelCleared = false; isGameOver = false;
    player.isSuper = false; player.invincible = 0; player.updateSize();

    for (let r = 0; r < worldMap.length; r++) {
        for (let c = 0; c < worldMap[r].length; c++) {
            const type = worldMap[r][c];
            const x = c * TILE_SIZE; const y = r * TILE_SIZE;
            if (type === 1 || type === 2 || type === 6 || type === 7) platforms.push({ x, y, width: TILE_SIZE, height: TILE_SIZE, type, hit: false, broken: false });
            else if (type === 3) coins.push({ x: x + 10, y: y + 10, width: 20, height: 20, collected: false });
            else if (type === 4) enemies.push(new Enemy(x, y + 4));
            else if (type === 5) goal = { x: x + 15, y: y - 240, width: 10, height: 280 };
        }
    }
}

function update() {
    if (isGameOver || isLevelCleared) return;
    if (player.invincible > 0) player.invincible--;
    if (screenShake > 0) screenShake--;

    // 이동
    if (keys['ArrowLeft'] || keys['KeyA']) {
        if (player.velX > -MOVE_SPEED) player.velX -= 0.8;
        player.facingRight = false;
        if (!player.jumping && Math.random() > 0.7) particles.push(new Particle(player.x + player.width, player.y + player.height, '#fff'));
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
        if (player.velX < MOVE_SPEED) player.velX += 0.8;
        player.facingRight = true;
        if (!player.jumping && Math.random() > 0.7) particles.push(new Particle(player.x, player.y + player.height, '#fff'));
    }
    if ((keys['ArrowUp'] || keys['Space'] || keys['KeyW']) && !player.jumping) {
        player.jumping = true; player.velY = JUMP_FORCE;
        createExplosion(player.x + player.width / 2, player.y + player.height, '#fff', 5);
    }

    player.velX *= FRICTION;
    player.velY += GRAVITY;
    player.x += player.velX;
    player.y += player.velY;

    camera.update(player.x);

    // 플랫폼 충돌
    for (let plat of platforms) {
        if (player.x < plat.x + plat.width && player.x + player.width > plat.x &&
            player.y < plat.y + plat.height && player.y + player.height > plat.y) {
            if (player.velY > 0 && player.y + player.height - player.velY <= plat.y) {
                player.jumping = false; player.velY = 0; player.y = plat.y - player.height;
            } else if (player.velY < 0 && player.y - player.velY >= plat.y + plat.height) {
                player.velY = 0; player.y = plat.y + plat.height;
                if (plat.type === 6 && !plat.hit) {
                    plat.hit = true; screenShake = 5;
                    createExplosion(plat.x + plat.width / 2, plat.y, '#FFD700', 8);
                    mushrooms.push(new Mushroom(plat.x + 5, plat.y - 40));
                } else if (plat.type === 7 && !plat.broken) {
                    plat.broken = true; screenShake = 8;
                    createExplosion(plat.x + plat.width / 2, plat.y + plat.height / 2, '#b45309', 20);
                    platforms.splice(platforms.indexOf(plat), 1);
                    createScoreText(plat.x, plat.y, 50);
                }
            } else {
                if (player.velX > 0) player.x = plat.x - player.width;
                else if (player.velX < 0) player.x = plat.x + plat.width;
            }
        }
    }

    // 적 충돌
    enemies.forEach(enemy => {
        if (enemy.dead) return;
        enemy.update(platforms);
        if (player.x < enemy.x + enemy.width && player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height && player.y + player.height > enemy.y) {
            if (player.velY > 0 && player.y + player.height < enemy.y + 20) {
                enemy.dead = true; player.velY = JUMP_FORCE / 1.5;
                createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#8B4513', 15);
                createScoreText(enemy.x, enemy.y, 500);
                screenShake = 3;
            } else if (player.invincible === 0) {
                if (player.isSuper) {
                    player.isSuper = false; player.updateSize(); player.invincible = 60;
                    screenShake = 10; createExplosion(player.x, player.y, '#ff0000', 20);
                } else triggerGameOver();
            }
        }
    });

    // 버섯 & 코인
    mushrooms.forEach((m, i) => {
        if (player.x < m.x + m.width && player.x + player.width > m.x &&
            player.y < m.y + m.height && player.y + player.height > m.y) {
            mushrooms.splice(i, 1); player.isSuper = true; player.updateSize();
            createScoreText(m.x, m.y, 1000); createExplosion(m.x, m.y, '#FF6666', 15);
        }
    });

    coins.forEach(coin => {
        if (!coin.collected && player.x < coin.x + coin.width && player.x + player.width > coin.x &&
            player.y < coin.y + coin.height && player.y + player.height > coin.y) {
            coin.collected = true; createScoreText(coin.x, coin.y, 100);
            createExplosion(coin.x + 10, coin.y + 10, '#FFD700', 5);
        }
    });

    // 파티클 업데이트
    particles.forEach((p, i) => { p.update(); if (p.life <= 0) particles.splice(i, 1); });
    textParticles.forEach((tp, i) => { tp.update(); if (tp.life <= 0) textParticles.splice(i, 1); });

    if (player.x < goal.x + goal.width && player.x + player.width > goal.x &&
        player.y < goal.y + goal.height && player.y + player.height > goal.y) triggerClear();
    if (player.y > canvas.height) triggerGameOver();
}

function triggerGameOver() {
    isGameOver = true; document.getElementById('statusVal').innerText = "Game Over";
    document.getElementById('statusVal').className = "text-2xl font-black text-red-600";
    screenShake = 15; setTimeout(resetGame, 1500);
}

function triggerClear() {
    isLevelCleared = true; document.getElementById('statusVal').innerText = "Cleared!";
    document.getElementById('statusVal').className = "text-2xl font-black text-yellow-400 animate-pulse";
    setTimeout(resetGame, 3000);
}

function resetGame() {
    player.reset(); score = 0;
    document.getElementById('scoreVal').innerText = "0";
    document.getElementById('statusVal').innerText = "Adventure";
    document.getElementById('statusVal').className = "text-2xl font-black text-green-400";
    initLevel();
}

function draw() {
    ctx.save();
    if (screenShake > 0) ctx.translate((Math.random() - 0.5) * screenShake, (Math.random() - 0.5) * screenShake);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 배경 구름
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    for (let i = 0; i < 8; i++) {
        let cx = (i * 400 - camera.x * 0.2) % 3200;
        ctx.beginPath(); ctx.arc(cx, 80, 40, 0, Math.PI * 2); ctx.arc(cx + 30, 70, 30, 0, Math.PI * 2); ctx.fill();
    }

    ctx.save(); ctx.translate(-camera.x, 0);
    platforms.forEach(plat => {
        if (plat.type === 7) {
            ctx.fillStyle = '#d97706';
        } else if (plat.type === 6) {
            ctx.fillStyle = plat.hit ? '#475569' : '#fbbf24';
        } else {
            ctx.fillStyle = plat.type === 1 ? '#78350f' : '#b45309';
        }
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
        ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);
        if (plat.type === 6 && !plat.hit) { ctx.fillStyle = 'white'; ctx.font = 'bold 20px Arial'; ctx.fillText('?', plat.x + 14, plat.y + 27); }
    });

    ctx.fillStyle = '#1e293b'; ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
    ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.moveTo(goal.x + 10, goal.y); ctx.lineTo(goal.x + 60, goal.y + 25); ctx.lineTo(goal.x + 10, goal.y + 50); ctx.fill();

    coins.forEach(c => { if (!c.collected) { ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(c.x + 10, c.y + 10, 8, 0, Math.PI * 2); ctx.fill(); } });
    mushrooms.forEach(m => m.draw(ctx));
    ctx.restore();

    enemies.forEach(e => e.draw(ctx, camera.x));
    player.draw(ctx, camera.x);
    particles.forEach(p => p.draw(ctx, camera.x));
    textParticles.forEach(tp => tp.draw(ctx, camera.x));

    if (isGameOver || isLevelCleared) {
        ctx.fillStyle = 'rgba(15,23,42,0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white'; ctx.font = 'bold 50px Arial'; ctx.textAlign = 'center';
        ctx.fillText(isLevelCleared ? 'STAGED CLEARED' : 'YOU DIED', canvas.width / 2, canvas.height / 2);
    }
    ctx.restore();
}

function resizeCanvas() {
    const container = document.getElementById('gameContainer');
    if (!container) return;

    const maxW = container.clientWidth;
    const maxH = container.clientHeight;
    const ratio = CANVAS_WIDTH / CANVAS_HEIGHT;

    let w = maxW;
    let h = w / ratio;
    if (h > maxH) {
        h = maxH;
        w = h * ratio;
    }

    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('resize', resizeCanvas);

export function init() {
    setupControls(keys);
    initLevel();
    resizeCanvas();
    gameLoop();
}
