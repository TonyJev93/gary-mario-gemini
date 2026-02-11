export class Mushroom {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.active = true;
    }

    draw(ctx) {
        ctx.fillStyle = '#FF6666';
        ctx.beginPath(); ctx.arc(this.x + 15, this.y + 12, 15, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#F5F5DC'; ctx.fillRect(this.x + 8, this.y + 12, 14, 18);
    }
}
