// 플레이어
export class Player {
    constructor() {
        this.x = 80;
        this.y = 200;
        this.width = 30;
        this.height = 38;
        this.velX = 0;
        this.velY = 0;
        this.jumping = false;
        this.facingRight = true;
        this.isSuper = false;
        this.invincible = 0;
    }

    updateSize() {
        const oldHeight = this.height;
        if (this.isSuper) {
            this.height = 56;
            this.y -= (56 - oldHeight);
            document.getElementById('formVal').innerText = "Super";
            document.getElementById('formVal').className = "text-2xl font-black text-red-500";
        } else {
            this.height = 38;
            this.y += (oldHeight - 38);
            document.getElementById('formVal').innerText = "Small";
            document.getElementById('formVal').className = "text-2xl font-black text-blue-400";
        }
    }

    draw(ctx, cameraX) {
        if (this.invincible % 4 > 1) return;
        ctx.save();
        ctx.translate(-cameraX, 0);

        // 캐릭터 본체
        ctx.fillStyle = this.isSuper ? '#CC0000' : '#FF3333';
        // 점프 시 약간 길어지는 연출
        let drawH = this.height;
        let drawY = this.y;
        if (this.jumping) {
            drawH += 4;
            drawY -= 4;
        }
        ctx.fillRect(this.x, drawY, this.width, drawH);

        // 모자
        ctx.fillStyle = '#880000';
        ctx.fillRect(this.x - 2, drawY, this.width + 4, 10);

        // 눈
        ctx.fillStyle = 'white';
        let eyeX = this.facingRight ? this.x + 20 : this.x + 4;
        ctx.fillRect(eyeX, drawY + 12, 6, 8);

        ctx.restore();
    }

    reset() {
        this.x = 80;
        this.y = 200;
        this.velX = 0;
        this.velY = 0;
        this.jumping = false;
        this.facingRight = true;
        this.isSuper = false;
        this.invincible = 0;
    }
}
