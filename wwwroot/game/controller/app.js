var myConnectionHub = new signalR.HubConnection('/asteroids');
myConnectionHub.start().then(function () {
    console.log('started');
});
var state = {};
function initController() {
    var nipple = nipplejs.create({
        zone: document.body.querySelector('.controller .target'),
        mode: 'static',
        position: { left: '0', top: '50%' },
        color: '#397cd4'
    });
    var btnFireA = document.querySelector('button.fire-a');
    var btnFireB = document.querySelector('button.fire-b');
    var btnShield = document.querySelector('button.shield');
    var buttons = document.querySelectorAll('.buttons button');
    nipple.on('move', function (ev, args) {
        var directions = {
            up: 'thrust',
            left: 'left',
            right: 'right'
        };
        if (!args.direction)
            return;
        var dir = directions[args.direction.angle];
        if (!dir)
            return;
        myConnectionHub.invoke('SendMove', dir, Math.round(args.distance));
    });
    nipple.on('end', function () {
        myConnectionHub.invoke('SendMove', 'thrust', 0);
    });
    for (var i = 0; i < buttons.length; i++) {
        var btn = buttons[i];
        btn.addEventListener('touchstart', function (ev) {
            sendButtonAction(ev, true);
        });
        btn.addEventListener('touchend', function (ev) {
            sendButtonAction(ev, false);
        });
    }
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    }, false);
    function sendButtonAction(ev, on) {
        var el = ev.target.closest('button');
        var prop = el.getAttribute('data');
        state[prop] = on;
        myConnectionHub.invoke('SendButton', prop, on);
    }
    function sendMove(direction, distance) {
        if ((distance < 10) && (direction === 'thrust' && distance < 30)) {
            myConnectionHub.invoke('SendMove', 'thrust', 0);
        }
        else {
            myConnectionHub.invoke('SendMove', direction, 100);
        }
    }
}
;
;
window.addEventListener('load', initController);
