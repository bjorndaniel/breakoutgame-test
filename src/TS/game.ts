class Paddle {

    private canvasWidth: number;
    private width: number = 75;
    private height: number = 10;
    private posX: number;
    private posY: number;
    constructor(x: number, y: number, canvasWidth: number) {
        this.posX = x;
        this.posY = y - this.height;
        this.canvasWidth = canvasWidth;
    }
    draw(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.rect(this.posX, this.posY, this.width, this.height);
        context.fillStyle = '#0095DD';
        context.fill();
        context.closePath();
    }
    bounce(x: number, y: number): boolean {
        if (x > this.posX && x < this.posX + this.width) {
            if (y - (ballRadius / 2) >= (this.posY - this.height) && y < this.posY) {
                return true;
            }
        }
        return false;
    }
    move(left: boolean) {
        this.posX += left ? -7 : 7;
        if (this.posX + this.width > this.canvasWidth) {
            this.posX = this.canvasWidth - this.width;
        }
        if (this.posX < 0) {
            this.posX = 0;
        }
    }
    moveX(relativeX: number) {
        paddle.posX = relativeX - this.width / 2;
    }

}

class Brick {
    private offsetLeft: number = 30;
    private offsetTop: number = 30;
    private padding: number = 10;
    width: number = 75;
    height: number = 20;
    posX: number;
    posY: number;
    removed: boolean = false;
    constructor(col: number, row: number) {
        this.posX = (col * (this.width + this.padding)) + this.offsetLeft;
        this.posY = (row * (this.height + this.padding)) + this.offsetTop;
    }
    draw(context: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.rect(this.posX, this.posY, this.width, this.height);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();

    }
}

class Ball {

    private radius: number;
    private posX: number;
    private posY: number;
    private canvasWidth: number;
    private canvasHeight: number;
    private dx: number = -2;
    private dy: number = -2;
    private startingPointX: number;
    private startingPointY: number;
    constructor(x: number, y: number, radius: number, canvasWidth: number, canvasHeight: number) {
        this.radius = radius;
        this.posX = x;
        this.posY = y;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.startingPointX = x;
        this.startingPointY = x;
    }
    draw(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        context.fillStyle = '#0095DD';
        context.fill();
        context.closePath();
    }
    move(paddle: Paddle) {
        if (this.posX > this.canvasWidth - this.radius || this.posX < this.radius) {
            this.dx = -this.dx;
        }
        if (this.posY < this.radius) {
            this.dy = - this.dy;
        } else if (paddle.bounce(this.posX, this.posY)) {
            this.dy = - this.dy;
        } else if (this.posY > this.canvasHeight + this.radius) {
            return true;
        }
        this.posX += this.dx;
        this.posY += this.dy;
        return false;
    }
    collision(brick: Brick): boolean {
        if (this.posX > brick.posX && this.posX < brick.posX + brick.width && this.posY > brick.posY && this.posY < brick.posY + brick.height) {
            this.dy = -this.dy;
            brick.removed = true;
            return true;
        }
        return false;
    }
    resetPosition(): void {
        this.posY = this.startingPointY;
        this.posX = this.startingPointX;
        this.dy = -2;
    }
}

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
const ballRadius: number = 10;
const brickRowCount: number = 3;
const brickColumnCount: number = 5;
const paddle: Paddle = new Paddle(canvas.width / 2, canvas.height - 20, canvas.width);
const ball: Ball = new Ball(canvas.width / 2, canvas.height - 50, 10, canvas.width, canvas.height);

let rightPressed: boolean;
let leftPressed: boolean;
let bricks: Brick[][] = createBricks();
let score: number = 0;
let lives: number = 3;
let countDown: boolean = false;
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);
draw();

function draw(): void {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    paddle.draw(ctx);
    drawBricks();
    drawScore(score);
    drawlives(lives);
    if (!countDown) {
        ball.draw(ctx);
        collisionDetection();
        if (ball.move(paddle)) {
            lives--;
            if (lives === 0) {
                alert('GAME OVER');
                document.location.reload();
            } else {
                countDown = true;
                setTimeout(() => {
                    countDown = false;
                    ball.resetPosition();
                }, 1500);
            }
        }
    }
    if (rightPressed) {
        paddle.move(false);
    } else if (leftPressed) {
        paddle.move(true);
    }
    requestAnimationFrame(draw);
}

function drawBricks(): void {
    for (var col = 0; col < brickColumnCount; col++) {
        for (var row = 0; row < brickRowCount; row++) {
            let brick = bricks[col][row];
            if (!brick.removed) {
                brick.draw(ctx);
            }
        }
    }
}

function keyDownHandler(e: KeyboardEvent): void {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = true;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e: KeyboardEvent): void {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = false;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = false;
    }
}

function createBricks(): Brick[][] {
    let result: Brick[][] = [[]];
    for (var col = 0; col < brickColumnCount; col++) {
        result[col] = [];
        for (var row = 0; row < brickRowCount; row++) {
            result[col][row] = new Brick(col, row);
        }
    }
    return result;
}

function collisionDetection() {
    for (var col = 0; col < brickColumnCount; col++) {
        for (var row = 0; row < brickRowCount; row++) {
            let brick: Brick = bricks[col][row];
            if (!brick.removed) {
                if (ball.collision(brick)) {
                    score++;
                    if (score == brickColumnCount * brickRowCount) {
                        alert('YOU WIN, CONGRATULATIONS!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore(score: number): void {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function mouseMoveHandler(e: MouseEvent): void {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.moveX(relativeX);
    }
}

function drawlives(lives: number): void {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}
