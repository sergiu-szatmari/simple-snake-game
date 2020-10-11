const $ = (selector) => { return document.querySelector(selector); };

const Keys = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 }, 
    player = { x: 10, y: 10 }, 
    trail = [],
    direction = { x: 0, y: 0, set: (newX, newY) => { direction.x = newX; direction.y = newY; } },
    apple = { x: 15, y: 15, spawn: () => { apple.x = apple.y = Math.floor(Math.random() * tileCount); } }, 
    highscore = { score: 0, player: null, get: () => { const hs = getHighscore(); if (hs) { highscore.score = hs.score; highscore.player = hs.player; } } };

let context, canvas, 
    lastKey = 0,
    gridSize = 20, 
    tileCount = 20,
    tail = 5,
    score = 0,

    scoreElem = $('#score'),
    highScoreElem = $('#high-score'),
    hsScoreElem = $('#hs'),
    hsPlayerElem = $('#name'); 

window.onload = () => {
    canvas = $('#gc');
    context = canvas.getContext('2d');

    document.addEventListener('keydown', onKeyPressed);
    $('#reset').addEventListener('click', resetHighScore);

    setTimeout(game, 1000/15);
    setTimeout(clearInstructions, 5000);
    
    highscore.get();
    if (!highscore.player) { highScoreElem.classList.add('invisible'); }
    else setHighscore(highscore.score, highscore.player);
}

const clearInstructions = () => {
    const elem = $('.how-to');
    elem.classList.add('hidden');
    setTimeout(() => { elem.remove(); }, 1000);
}

const resetHighScore = () => {
    localStorage.removeItem('snakeHighScore');
    highScoreElem.classList.add('invisible');
}

const setHighscore = (score, player) => {
    localStorage.setItem('snakeHighScore', JSON.stringify({ score, player }));
    hsScoreElem.innerHTML = highscore.score; 
    hsPlayerElem.innerHTML = highscore.player;
    highScoreElem.classList.remove('invisible');
}

const getHighscore = () => {
    const json = localStorage.getItem('snakeHighScore');
    return !json ? null : JSON.parse(json);
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
        case Keys.LEFT: direction.set(-1, 0); break;
        case Keys.UP: direction.set(0, -1); break;
        case Keys.RIGHT: direction.set(1, 0); break;
        case Keys.DOWN: direction.set(0, 1); break;
    }
}

const setScore = (scoreNr) => {
    score = scoreNr;
    tail = scoreNr + 5;
    scoreElem.innerHTML = score;
    console.log(`Current score: ${ score }`);
}

const nonUnique = a => new Set(a).size !== a.length;
                
const game = () => {
    player.x += direction.x;
    player.y += direction.y;
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
            if (!nonUnique(trail) && trail.length > 2 && (score > highscore.score)) {
                const name = prompt('New high score! Enter your name');
                setHighscore(score, name);
                location.reload();
            }
            setScore(0);
            trail.length = 0;
            direction.set(0, 0);
        }
    }

    trail.push({ x: player.x, y: player.y });
    while (trail.length > tail) trail.shift();

    if (apple.x == player.x && apple.y == player.y) {
        setScore(++score);
        apple.spawn();
    }

    context.fillStyle = '#86b486';
    context.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 2, gridSize - 2);
    setTimeout(game, 1000/15);
}