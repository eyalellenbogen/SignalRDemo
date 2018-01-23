var myConnectionHub = new signalR.HubConnection('/sketch');
myConnectionHub.on('Draw', renderLine);
myConnectionHub.start().then(() => {
    console.log('started');
});


declare var chroma: any;

var canvas,
    ctx,
    isDrawing,
    color,
    oldPosition,
    thickness = 20,
    maxThickness = 40,
    minThickness = 2;

window.addEventListener('load', init);


function init() {
    setColor();
    setThickness(false);
    canvas = document.querySelector('#canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('touchstart', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('touchend', endDraw);
    document.addEventListener('keydown', (ev) => {
        if (ev.keyCode === 27) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        if (ev.keyCode === 32) {
            setColor();
        }
    });
    document.addEventListener('mousewheel', ev => {
        setThickness(ev.wheelDeltaY > 0);
    });
}

function renderLine(color, thickness, from, to) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.closePath();
}

function draw(ev) {
    if (!isDrawing) return;
    var pointer = ev.touches ? ev.touches[0] : ev;
    let currentPosition = { x: pointer.clientX, y: pointer.clientY };

    renderLine(color, thickness, oldPosition, currentPosition);
    myConnectionHub.invoke('NotifyClients', color, thickness, oldPosition, currentPosition);

    oldPosition = currentPosition;
}



function startDraw(ev) {
    isDrawing = true;
    var pointer = ev.touches ? ev.touches[0] : ev;
    oldPosition = {
        x: pointer.clientX,
        y: pointer.clientY
    };
}

function endDraw(ev) {
    isDrawing = false;
    oldPosition = null;
}

function setColor() {
    color = chroma.random().hex();
    (<HTMLElement>document.querySelector('.controls .brush .dot')).style.backgroundColor = color;
}

function setThickness(thicker) {
    if (thicker) {
        thickness++;
        if (thickness > maxThickness) {
            thickness = maxThickness;
        }
    } else {
        thickness--;
        if (thickness < minThickness) {
            thickness = minThickness;
        }
    }
    var dot = document.querySelector('.controls .brush .dot') as HTMLElement;
    dot.style.width = thickness + 'px';
    dot.style.height = thickness + 'px';
}

