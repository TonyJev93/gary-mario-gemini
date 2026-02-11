// 적 캐릭터
export class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 36;
        this.height = 36;
        this.velX = 1.8;
        this.dead = false;
    }

    update(platforms) {
        if (this.dead) return;
        this.x += this.velX;
        let hitWall = false;
        let onEdge = true;
        for (let plat of platforms) {
            if (this.x < plat.x + plat.width && this.x + this.width > plat.x &&
                this.y < plat.y + plat.height && this.y + this.height > plat.y) hitWall = true;
            let checkX = this.velX > 0 ? this.x + this.width : this.x;
            if (checkX >= plat.x && checkX <= plat.x + plat.width &&
                this.y + this.height + 2 >= plat.y && this.y + this.height + 2 <= plat.y + plat.height) onEdge = false;
        }
        if (hitWall || onEdge) this.velX *= -1;
    }

    draw(ctx, cameraX) {
        if (this.dead) return;
        ctx.save();
        ctx.translate(-cameraX, 0);
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height);
        ctx.quadraticCurveTo(this.x + this.width / 2, this.y - 10, this.x + this.width, this.y + this.height);
        ctx.fill();
        ctx.restore();
    }
}
