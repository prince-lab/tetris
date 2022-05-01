const width =10
let nextRandom =0
let timerId
let score = 0
const colors =[
    'green',
    'pink',
    'orange',
    'red',
    'blue'
]
const grid =document.querySelector('.grid')
let squares = Array.from(document.querySelectorAll('.grid div'))
// console.log(squares)
const scoreDisplay =document.querySelector('#score')
const ctr_btn =document.getElementById('stop')

const lt =[
    [1,width+1,width*2+1,2],
    [width,width+1,width+2,width*2+2],
    [1,width+1,width*2+1,width*2],
    [width,width*2,width*2+1,width*2+2]
]

const zt =[
    [0,width,width+1,width*2+1],
    [width+1,width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1,width+2,width*2,width*2+1]
]

const tt =[
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]

]

const ot =[
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
]

const it =[
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
]

const theTetrominos =[lt,tt,ot,zt,it]
// console.log(theTetrominos)

let currentPosition =4
let currentRotation =0
let random =Math.floor(Math.random()*theTetrominos.length)
let current =theTetrominos[random][currentRotation]
// console.log(random)
// draw the shapes

function draw() {
    current.forEach(index =>{
        squares[currentPosition+index].classList.add('tetromino');
       squares[currentPosition + index].style.backgroundColor=colors[random]
        // first.classlist('tetromino')
    } )
}


function undraw() {
    current.forEach(index =>{
       squares[currentPosition+index].classList.remove('tetromino');
       squares[currentPosition + index].style.backgroundColor=''
       
        // first.classlist('tetromino')
    } )
}

//  timerId =setInterval(moveDown,1000)
//  console.log(timerId)

//  assign key functions
// function control(e){
//     console.log('not here')
//     if (e.Key === 'z'){
//         moveLeft()
//     }else if (e.KeyCode===38){
//         // rotate()
//     }else if (e.KeyCode===39){
//         moveRight()
//     }else if (e.Key === 'u'){
//         moveDown()
//     }
// }

// document.addEventListener('keyDown',console.log('keyCode'))


function moveDown (){
    undraw()
    currentPosition += width
    draw()
    freeze()
}


function freeze(){
    if (current.some(index=> squares[currentPosition+index+width].classList.contains('taken'))){
        current.forEach(index=>squares[currentPosition+index].classList.add('taken'))
        random =nextRandom
        nextRandom =Math.floor(Math.random()*theTetrominos.length)
        current=theTetrominos[random][currentRotation]
        currentPosition=4
        draw()
       displayShape()
      addScore()
      gameOver()
    } 
}

// move left function for moving the shape to the left of the grid
function moveLeft (){
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width===0)
    if (!isAtLeftEdge) {currentPosition-=1
    }
if (current.some(index => squares[currentPosition + index ].classList.contains('taken'))) {
    currentPosition -=1
}
draw()
}

// move right function
function moveRight () {
    undraw()
    const isAtRightEdge = current.some(index => [currentPosition + index]% width==width -1)
    if (!isAtRightEdge) currentPosition+=1
    if(current.some(index=>squares[currentPosition + index].classList.contains('taken'))){
        currentPosition +=1
    }
    draw()
}
// rotation function
function rotate()  {
    undraw()
    currentRotation++
    if (currentRotation ===current.length){
    // if the current rotation gets to 4,make it back to intial state
    currentRotation =0
    }
    current =theTetrominos[random][currentRotation]
    draw()
}
// show up-next tetromino in mini-grid
const displaySquares =document.querySelectorAll('.mini-grid div')
const displayWidth =4
let displayIndex =0

// the tetrominos without rotations 
const upNextTetrominoes = [
    [1,displayWidth+1,displayWidth*2+1,2], //lt
    [1,displayWidth,displayWidth+1,displayWidth*2], //tt
    [0,1,displayWidth,displayWidth+1], //ot
    [0,displayWidth,displayWidth+1,displayWidth*2+1], //zt
    [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1]
]
//display the shape in  the mini-grid display
function displayShape() {
    // remove any trace of a tetromino from the entire grid 
    displaySquares.forEach(square =>{
        square.classList.remove('tetromino')
         square.style.backgroundColor=''
    })
    upNextTetrominoes[nextRandom].forEach(index =>{
        displaySquares[displayIndex + index].classList.add('tetromino');
        displaySquares[displayIndex + index].style.background =colors[nextRandom];

    })

}

// control button section 
ctr_btn.addEventListener('click',()=>{
    if (timerId){
        clearInterval(timerId)
        timerId = null
        ctr_btn.innerHTML ="resum"
    }else{
        draw()
        timerId = setInterval(moveDown,500)
        nextRandom=Math.floor(Math.random()*theTetrominos.length)
        displayShape()
        ctr_btn.innerHTML ="pause"
    }
})
//add score 
function addScore(){
    for (let i=0;i<199;i+=width){
        const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]
        console.log(row)
        if(row.every(index => squares [index].classList.contains('taken'))){
            score +=10
            scoreDisplay.innerHTML =   score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor =''
            })
            const squaresRemoved = squares.splice(1,width)
           squares =squaresRemoved.concat(squares)
           squares.forEach(cell=>grid.appendChild(cell))
        
        }
    }
}
// game over 
function gameOver() {