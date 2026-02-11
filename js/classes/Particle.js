// 파티클 시스템
export class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = (Math.random() - 0.5) * 8;
        this.color = color;
        this.life = 1.0;
        this.decay = Math.random() * 0.05 + 0.02;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
    }

    draw(ctx, cameraX) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - cameraX, this.y, this.size, this.size);
        ctx.globalAlpha = 1.0;
    }
}

// 텍스트 파티클 (점수 표시)
export class TextParticle {
    constructor(x, y, text, color) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        this.life = 1.0;
        this.speedY = -1;
    }

    update() {
        this.y += this.speedY;
        this.life -= 0.02;
    }

    draw(ctx, cameraX) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.font = "bold 16px Arial";
        ctx.fillText(this.text, this.x - cameraX, this.y);
        ctx.globalAlpha = 1.0;
    }
}
