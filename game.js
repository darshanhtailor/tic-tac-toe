const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext('2d')
ctx.translate(0.5,0.5)
const wd = canvas.width
const ht = canvas.height

// Setting initial score values
xScore = document.getElementById('xScore').getElementsByTagName('span')[0]
oScore = document.getElementById('oScore').getElementsByTagName('span')[0]
drawScore = document.getElementById('drawScore').getElementsByTagName('span')[0]

xval = localStorage.getItem('X')
xScore.innerHTML = xval ? xval : 0

oval = localStorage.getItem('O')
oScore.innerHTML = oval ? oval : 0

dval = localStorage.getItem('Draw')
drawScore.innerHTML = dval ? dval : 0

// Drawing the grid
ctx.beginPath()
ctx.strokeStyle = "black"
ctx.lineWidth = 5
ctx.lineCap = "round"

ctx.moveTo(wd/2-83, ht/2-250)
ctx.lineTo(wd/2-83, ht/2+250)

ctx.moveTo(wd/2+83, ht/2-250)
ctx.lineTo(wd/2+83, ht/2+250)

ctx.moveTo(wd/2-250, ht/2-83)
ctx.lineTo(wd/2+250, ht/2-83)

ctx.moveTo(wd/2-250, ht/2+83)
ctx.lineTo(wd/2+250, ht/2+83)
ctx.stroke()

// Draw X or O
function draw(ch,boxNum,xc,yc) {
    if(typeof mp[boxNum] == 'undefined'){
        op ^= 1
        mp[boxNum] = {ch,xc,yc}
        if(ch == 'X'){
            ctx.strokeStyle = "red"
            ctx.moveTo(xc - 40, yc - 40);
            ctx.lineTo(xc + 40, yc + 40);
        
            ctx.moveTo(xc + 40, yc - 40);
            ctx.lineTo(xc - 40, yc + 40);

        }
        else{
            ctx.strokeStyle = "blue"
            ctx.arc(xc,yc,45,0,2*Math.PI)
        }
        ctx.stroke()
    }
}

// Draw winning line
function draWinLine(p1, p2){
    if(p1.ch == 'X'){
        ctx.strokeStyle = "red"
        ctx.shadowBlur = 15
        ctx.shadowColor = "red"
    }
    else{
        ctx.strokeStyle = "blue"
        ctx.shadowBlur = 15
        ctx.shadowColor = "blue"
    }

    if(p1.xc == p2.xc){
        ctx.moveTo(p1.xc, p1.yc-65)
        ctx.lineTo(p2.xc, p2.yc+65)
    }
    else if(p1.yc == p2.yc){
        ctx.moveTo(p1.xc-65, p1.yc)
        ctx.lineTo(p2.xc+65, p2.yc)
    }
    else{
        if(p1.xc < p2.xc){
            ctx.moveTo(p1.xc-65, p1.yc-65)
            ctx.lineTo(p2.xc+65, p2.yc+65)
        }
        else{
            ctx.moveTo(p1.xc+65, p1.yc-65)
            ctx.lineTo(p2.xc-65, p2.yc+65)
        }
    }
    ctx.stroke()
}

// Check boxes
const cb = function checkBox(p,q,r,ch){
    if(mp[p] && mp[q] && mp[r]){
        if(mp[p].ch == ch && mp[q].ch == ch && mp[r].ch == ch){
            return true
        }
    }
    return false
}

// Update Score
function updateScore(ch){
    val = localStorage.getItem(ch)
    val++
    localStorage.setItem(ch, val)
    if(ch == 'X'){       
        xScore.innerHTML = val        
    }
    else if(ch == 'O'){
       oScore.innerHTML = val
    }
    else{
        drawScore.innerHTML = val
    }
}

// Reset Score
function resetScore(){
    localStorage.clear()
    xScore.innerHTML = oScore.innerHTML = drawScore.innerHTML = 0
}

// Check game over
function gameOver(ch){
    for(let i = 1; i < 9; i+=3){
        if(cb(i,i+1,i+2,ch)){
            winner = ch
            draWinLine(mp[i], mp[i+2])
            canvas.classList.add('noClick')
            updateScore(ch)
            return
        }
    }
    for(let i = 1; i < 4; i++){
        if(cb(i,i+3,i+6,ch)){
            winner = ch
            draWinLine(mp[i], mp[i+6])
            canvas.classList.add('noClick')
            updateScore(ch)
            return
        }
    }
    if(cb(1,5,9,ch)){
        winner = ch
        draWinLine(mp[1], mp[9])
        canvas.classList.add('noClick')
        updateScore(ch)
        return;
    }
    else if(cb(3,5,7,ch)){
        winner = ch
        draWinLine(mp[3], mp[7])
        canvas.classList.add('noClick')
        updateScore(ch)
        return;
    }
    else if(Object.keys(mp).length == 9 && !winner){
        winner = -1
        updateScore('Draw')
    }
}

// Detect click on board and play game
const canvasLeft = scrollX + canvas.getBoundingClientRect().left
const canvasTop = scrollY + canvas.getBoundingClientRect().top
let op = 1, ch = 'X', mp = {}, winner = 0
canvas.addEventListener('click', function(event){
    const x = event.clientX-canvasLeft
    const y = event.clientY-canvasTop
    let centreX, centreY, boxNum

    ctx.beginPath()
    if(x < wd/2-83 && y < ht/2-83){
        centreX = wd/2-166
        centreY = ht/2-166
        boxNum = 1
    } 
    else if(x > wd/2-83 && x < wd/2+83 && y < ht/2-83){
        centreX = wd/2
        centreY = ht/2-166
        boxNum = 2
    }
    else if(x > wd/2+83 && y < ht/2-83){
        centreX = wd/2+166
        centreY = ht/2-166
        boxNum = 3
    }
    else if(x < wd/2-83 && y > ht/2-83 && y < ht/2+83){
        centreX = wd/2-166
        centreY = ht/2
        boxNum = 4
    }
    else if(x > wd/2-83 && x < wd/2+83 && y > ht/2-83 && y < ht/2+83){
        centreX = wd/2
        centreY = ht/2
        boxNum = 5
    }
    else if(x > wd/2+83 && y > ht/2-83 && y < ht/2+83){
        centreX = wd/2+166
        centreY = ht/2
        boxNum = 6
    }
    else if(x < wd/2-83 && y > ht/2+83){
        centreX = wd/2-166
        centreY = ht/2+166
        boxNum = 7
    } 
    else if(x > wd/2-83 && x < wd/2+83 && y > ht/2+83){
        centreX = wd/2
        centreY = ht/2+166
        boxNum = 8
    }
    else if(x > wd/2+83 && y > ht/2+83){
        centreX = wd/2+166
        centreY = ht/2+166
        boxNum = 9
    }

    ch = op ? 'X':'O'
    draw(ch,boxNum,centreX,centreY)
    gameOver('X')
    gameOver('O')
})