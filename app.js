const input = document.getElementById("word");
const canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
const size = canvas.width;
let margin = 30;

let dots = [];
let words = [];
let word = input.value;


placeDots();
updateCanvas();
console.log(dots)

input.addEventListener('input', function () {
    if (words.length !== 0 && input.value.length < 1) {
        input.value = words.pop();
        document.getElementById("words").innerHTML = words.join('-');
    }
    word = input.value;
    updateCanvas();
})

input.addEventListener('keypress', function (e) {
    if (e.key === "Enter") {
        words.push(word);
        word = input.value = word.charAt(word.length - 1);
        updateCanvas();
    }
    document.getElementById("words").innerHTML = words.join('-');
})

canvas.addEventListener('mousedown', function (e) {
    const rect = canvas.getBoundingClientRect()
    const click = {x: e.clientX - rect.left, y: e.clientY - rect.top, r: 10};

    for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        if (circleCollision(click, dot)) {
            input.value += dot.l;
            word = input.value;
            updateCanvas();
        }
    }

    function circleCollision(c1, c2) {
        const a = c1.r + c2.r,
            x = c1.x - c2.x,
            y = c1.y - c2.y;
        return a > Math.sqrt((x * x) + (y * y));
    }
})

function placeDots() {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    const spacing = (size) / 4

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            let varAxis = spacing + j * spacing;
            let constAxis = margin;

            if (i % 2 === 0) {
                constAxis += (size - 2*margin);
            }

            let x = varAxis, y = constAxis;
            if (i > 1) {
                x = constAxis;
                y = varAxis;
            }

            dots.push({
                x, y, r: 8,
                l: letters.pop()
            })
        }
    }
}

function updateCanvas() {
    //Rectangle
    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.rect(margin, margin, size - 2 * margin, size - 2 * margin);
    ctx.stroke()
    //Dots
    for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, 2*Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();

        //Letters
        ctx.font = "20px Arial";
        if (dot.x === margin) {
            ctx.fillText(dot.l, dot.x - 30, dot.y + 5)
        }
        if (dot.x === size - margin) {
            ctx.fillText(dot.l, dot.x + 14, dot.y + 5)
        }
        if (dot.y === margin) {
            ctx.fillText(dot.l, dot.x - 6, dot.y - 14);
        }
        if (dot.y === size - margin) {
            ctx.fillText(dot.l, dot.x - 6, dot.y + 30);
        }
        ctx.fillStyle = "black";
    }

    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        drawWord(word)
    }
    //Word
    drawWord(word, 4);
}

function findDot(letter) {
    for (let i = 0; i < dots.length; i++) {
        if (dots[i].l === letter) {
            return dots[i];
        }
    }
}

function drawWord(wordToDraw, width) {
    for (let i = 1; i < wordToDraw.length; i++) {
        const fromDot = findDot(wordToDraw.charAt(i - 1)), toDot = findDot(wordToDraw.charAt(i));
        drawLine(fromDot, toDot, width);
    }
}

function drawLine(fromDot, toDot, width) {
    ctx.beginPath();
    ctx.moveTo(fromDot.x, fromDot.y);
    ctx.lineTo(toDot.x, toDot.y);
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.closePath();
    ctx.lineWidth = 1;
}