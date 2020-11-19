class Paddle {
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
}

class Brick {
    private offsetLeft: number = 30;
    private offsetTop: number = 30;
    private padding: number = 10;
    private width: number = 75;
    private height: number = 20;
    private posX: number;
    private posY: number;
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
            alert('GAME OVER');
            document.location.reload();
            clearInterval(interval);
        }
        this.posX += this.dx;
        this.posY += this.dy;

    }
    private radius: number;
    private posX: number;
    private posY: number;
    private canvasWidth: number;
    private canvasHeight: number;
    private dx: number = -2;
    private dy: number = -2;
    constructor(x: number, y: number, radius: number, canvasWidth: number, canvasHeight: number) {
        this.radius = radius;
        this.posX = x;
        this.posY = y;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

}

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
const ballRadius: number = 10;
const brickRowCount: number = 3;
const brickColumnCount: number = 5;

let rightPressed: boolean;
let leftPressed: boolean;
let interval = setInterval(draw, 10);
let bricks: Brick[][] = createBricks();
const paddle: Paddle = new Paddle(canvas.width / 2, canvas.height - 20, canvas.width);
const ball: Ball = new Ball(canvas.width / 2, canvas.height - 40, 10, canvas.width, canvas.height);
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);


function draw(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw(ctx);
    paddle.draw(ctx);
    drawBricks();
    ball.move(paddle);
    if (rightPressed) {
        paddle.move(false);
    } else if (leftPressed) {
        paddle.move(true);
    }

}

function drawBricks(): void {
    for (var col = 0; col < brickColumnCount; col++) {
        for (var row = 0; row < brickRowCount; row++) {
            let brick = bricks[col][row];
            brick.draw(ctx);
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

