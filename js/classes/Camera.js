import { TILE_SIZE, worldMap } from '../constants.js';

// 카메라
export class Camera {
    constructor(canvasWidth) {
        this.x = 0;
        this.canvasWidth = canvasWidth;
    }

    update(playerX) {
        let targetX = playerX - this.canvasWidth / 3;
        if (targetX < 0) targetX = 0;
        const worldWidth = worldMap[0].length * TILE_SIZE;
        if (targetX > worldWidth - this.canvasWidth) targetX = worldWidth - this.canvasWidth;
        this.x = targetX;
    }
}
