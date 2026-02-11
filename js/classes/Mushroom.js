import { GRAVITY } from '../constants.js';

// 아이템 (버섯)
export class Mushroom {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.velX = 2.5;
        this.velY = -5; // 나올 때 튀어오름
        this.active = true;
    }

    update(platforms) {
        this.velY += GRAVITY;
        this.x += this.velX;
        this.y += this.velY;
        for (let plat of platforms) {
            if (this.x < plat.x + plat.width && this.x + this.width > plat.x &&
                this.y < plat.y + plat.height && this.y + this.height > plat.y) {
                if (this.velY > 0) { this.y = plat.y - this.height; this.velY = 0; }
                else { this.velX *= -1; }
            }
        }
    }

    draw(ctx, cameraX) {
        ctx.save();
        ctx.translate(-cameraX, 0);
        ctx.fillStyle = '#FF6666';
        ctx.beginPath(); ctx.arc(this.x + 15, this.y + 12, 15, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#F5F5DC'; ctx.fillRect(this.x + 8, this.y + 12, 14, 18);
        ctx.restore();
    }
}
