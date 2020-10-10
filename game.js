const $ = (selector) => { return document.querySelector(selector); };

const Keys = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 }, 
    player = { x: 10, y: 10 }, 
    apple = { x: 15, y: 15 }, 
    velocity = { x: 0, y: 0 },
    trail = [];

let context, canvas,
    lastKey = 0,
    gridSize = 20, 
    tileCount = 20,
    tail = 5,
    score = 0,
    scoreElem = $('#score'); 

window.onload = () => {
    canvas = $('#gc');
    context = canvas.getContext('2d');
    document.addEventListener('keydown', onKeyPressed);
    setInterval(game, 1000/15);
}

const isInvalid = (keyCode) => {
    switch (lastKey) {
        case 0: return false;
        case Keys.RIGHT:
        case Keys.LEFT: 
            return keyCode == Keys.LEFT || keyCode == Keys.RIGHT;
        case Keys.UP: 
        case Keys.DOWN: 
            return keyCode == Keys.DOWN || keyCode == Keys.UP;
        default: return true;
    }
}

const onKeyPressed = (event) => {
    const { keyCode } = event;
    if (isInvalid(keyCode)) return;

    lastKey = keyCode;
    switch (keyCode) {
        case Keys.LEFT:
            velocity.x = -1;
            velocity.y = 0;
            break;
        case Keys.UP:
            velocity.x = 0;
            velocity.y = -1;
            break;
        case Keys.RIGHT:
            velocity.x = 1;
            velocity.y = 0;
            break;
        case Keys.DOWN:
            velocity.x = 0;
            velocity.y = 1;
            break;
    }
}

const setScore = (scoreNr) => {
    score = scoreNr;
    tail = scoreNr + 5;
    scoreElem.innerHTML = score;
    console.log(`Current score: ${ score }`);
}
                
const game = () => {
    player.x += velocity.x;
    player.y += velocity.y;
    if (player.x < 0) { player.x = tileCount - 1; }
    if (player.x > tileCount - 1) { player.x = 0; }
    if (player.y < 0) { player.y = tileCount - 1; }
    if (player.y > tileCount - 1) { player.y = 0; }

    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = '#FF00E6';
    for (let i = 0; i < trail.length; i++) {
        context.fillRect(trail[i].x * gridSize, trail[i].y * gridSize, gridSize - 2, gridSize - 2);
        if (trail[i].x == player.x && trail[i].y == player.y) {
            setScore(0);
        }
    }

    trail.push({ x: player.x, y: player.y });
    while (trail.length > tail) trail.shift();

    if (apple.x == player.x && apple.y == player.y) {
        setScore(++score);
        apple.x = Math.floor(Math.random() * tileCount);
        apple.y = Math.floor(Math.random() * tileCount);
    }

    context.fillStyle = '#86b486';
    context.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 2, gridSize - 2);
}