var myConnectionHub = new signalR.HubConnection('/asteroids');
myConnectionHub.on('PlayerButton', buttonAction);
myConnectionHub.on('PlayerMove', moveAction);
myConnectionHub.start().then(function () {
    console.log('started');
});
function buttonAction(button, isDown) {
    var input = window.Asteroids.GameScene.prototype.input;
    input.fireA = button === 'fireA' ? isDown : false;
    input.fireB = button === 'fireB' ? isDown : false;
    input.shield = button === 'shield' ? isDown : false;
}
function moveAction(direction, distance) {
    var input = window.Asteroids.GameScene.prototype.input;
    input.left = false;
    input.right = false;
    input.thrust = false;
    if (distance < 10) {
        return;
    }
    if (direction === 'thrust' && distance < 30) {
        return;
    }
    input[direction] = true;
}
;
