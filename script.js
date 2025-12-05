//query selectors
const start = document.querySelector('.btn-start');
const restart = document.querySelector('.btn-restart')
const startGame = document.querySelector('.start-game');
const restartGame = document.querySelector('.restart-game');
const board = document.querySelector('.board');
const modal = document.querySelector('.modal');
const highScoreElement = document.querySelector('#high-score');
const scoreElement = document.querySelector('#score');
const minElement = document.querySelector('#min');
const secElement = document.querySelector('#sec');
const button = document.querySelector('.btn');
const mute = document.querySelector('.mute');



// sound 

const foodSound = new Audio('./music/food.mp3');
const gameoverSound = new Audio('./music/gameover.mp3');
const moveSound = new Audio('./music/move.mp3');
const music = new Audio('./music/music.mp3');

//mute audio
music.volume = .3;
mute.addEventListener('click',()=>{
    if(music.volume){
        music.volume = 0;
        mute.setAttribute('src','./images/mute.png');
    }else{
        music.volume = .3;
        mute.setAttribute('src','./images/volume.png');

    }
})

const blockHeight = 50
const blockWidth = 50

/* calculating number of rows and cols */
const cols = Math.floor(board.clientWidth/blockWidth)
const rows = Math.floor(board.clientHeight/blockHeight)

// score wala system

//high score
let highscore =localStorage.getItem('highscore')??0;
highScoreElement.innerHTML = highscore;
// score
let Score =0;
//time
let time = "00:00";
let min = 0;
let sec = 0;
//time interval

let timeIntervalID = null;

// snake position
let snake = [
    {x:2,y:3},
    {x:2,y:2}
]

// direction
let direction = 'down';

//400 ms snake render and move track
let intervalID = null;

//food
let food = {x:Math.floor(Math.random()*rows),y:Math.floor( Math.random()*cols)};

/* grid blocks 2d array */
const blocks = [];

/* grid block printing */
for(let i =0;i<rows;i++){ 
    for(let j=0;j<cols;j++){
        const block = document.createElement('div'); // create kiya block 
        block.classList.add("block"); // add class to block
        board.appendChild(block); // append block to board
        blocks[`${i}-${j}`] = block; // add block location to blocks array
        // just to check grid memory address
        //block.innerHTML = `${i}-${j}`;  
    }
}


// render function for snake and food
function render(){

    //food render on screen
    blocks[`${food.x}-${food.y}`].classList.add('food');
    
    //snake render on screen
    snake.forEach(segment=>{
        // console.log(blocks[`${segment.x},${segment.y}`]);
        blocks[`${segment.x}-${segment.y}`].classList.add('fill'); // snake

    } )
}

//end game function

const endGame = ()=>{
        music.pause();
        music.currentTime = 0;
        gameoverSound.play();
        clearInterval(intervalID);
        clearInterval(timeIntervalID);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                blocks[`${i}-${j}`].classList.remove('fill');
                blocks[`${i}-${j}`].classList.remove('food');
            }
        }   
        highscore = highscore>Score?highscore:Score;
        localStorage.setItem('highscore',highscore)
        Score = 0;
        scoreElement.innerHTML = Score;
        highScoreElement.innerHTML = highscore;
        console.log('game over');
        //console.log(head)
        
        minElement.innerHTML = 0;
        secElement.innerHTML = 0;
        min = 0;
        sec =0;
        restartGame.style.display = 'flex';
        modal.style.display = 'flex';
        
}

/* move snake */
function move(){
    let head =null
    
    if(direction==='left'){
        head = {x:snake[0].x,y:snake[0].y-1};
    }else if(direction ==='right'){
        head = {x:snake[0].x,y:snake[0].y+1};
        
    }else if(direction ==='up'){
        head = {x:snake[0].x-1,y:snake[0].y};
        
    }else if(direction ==='down'){
        head = {x:snake[0].x+1,y:snake[0].y};
        
    }

    snake.forEach(segment => {
        if(head.x == segment.x && head.y == segment.y){
            endGame();
            return;
        }
    });

    //eat food
    if(food.x == head.x && food.y == head.y ){
        foodSound.currentTime = 0; // reset
        foodSound.play();         // play once  
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        food = {x:Math.floor(Math.random()*rows),y:Math.floor( Math.random()*cols)};
        //update score
        Score+=10;
        scoreElement.innerHTML = Score;
        // increase snake length
        snake.unshift(head);
    }

    //unfill the previous block
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
        //console.log(blocks[`${segment.x}-${segment.y}`])
        // console.log(blocks[`${segment.x}-${segment.y}`]);
    });

    //head ko add kro back ko pop kro
    // ye dono se snake move krte hue dikhta hai
    
    // end game 
    if(head.x <0||head.x>=rows || head.y<0||head.y>=cols){
        endGame();
        return;

    }
    
    snake.unshift(head);
    snake.pop();
    render();       
}


//startButton
start.addEventListener('click',()=>{
    music.play();
    intervalID=setInterval(()=>{
        move();
        },300);
    
    
    
    startGame.style.display = 'none';
    modal.style.display = 'none';
    timeIntervalID = setInterval(()=>{
    sec++;
    if(sec>59){
        sec=0;
        min++;
    }
    minElement.innerHTML = min;
    secElement.innerHTML = sec;
    },1000)
    })
//restart game
restart.addEventListener('click',()=>{
    music.play();
    for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        blocks[`${i}-${j}`].classList.remove('fill');
        blocks[`${i}-${j}`].classList.remove('food');
    }
    }
    blocks[`${food.x}-${food.y}`].classList.remove('food');
    food = {x:Math.floor(Math.random()*rows),y:Math.floor( Math.random()*cols)};
    snake = [
    {x:2,y:3},
    {x:2,y:2}
    ]
    direction = 'right';
    intervalID=setInterval(()=>{
        move();},300);
    
    restartGame.style.display = 'none';
    modal.style.display = 'none';
    timeIntervalID = setInterval(()=>{
    sec++;
    if(sec>59){
        min++;
    }
    minElement.innerHTML = min;
    secElement.innerHTML = sec;
    },1000)
})

// key move code
addEventListener("keydown",(event)=>{
    let played = false;
    

    if(event.key=='ArrowUp'){
        if(direction!='down'){
            direction = 'up';
            played= true;
        }
        
    }else if(event.key == 'ArrowDown'){
        if(direction!='up'){
            direction = 'down';
            played= true;
        }
    }else if(event.key == 'ArrowRight'){
        if(direction!='left'){
            direction = 'right';
            played= true;
        }
    }else if(event.key == 'ArrowLeft'){
        if(direction!='right'){
            direction = 'left';
            played= true;
        }
    }
    if(played){
        moveSound.currentTime = 0;   // reset audio = no delay
        moveSound.play();
    }
})



