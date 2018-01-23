var myConnectionHub = new signalR.HubConnection('/asteroids');
myConnectionHub.on('PlayerButton', buttonAction);
myConnectionHub.on('PlayerMove', moveAction);

myConnectionHub.start().then(() => {
    console.log('started');
});

function buttonAction(button: Button, isDown: boolean) {
    let input = (<any>window).Asteroids.GameScene.prototype.input as IInput;

    input.fireA = button === 'fireA' ? isDown : false;
    input.fireB = button === 'fireB' ? isDown : false;
    input.shield = button === 'shield' ? isDown : false;
}

function moveAction(direction: Direction, distance: number) {
    let input = (<any>window).Asteroids.GameScene.prototype.input as IInput;

    input.left = false;
    input.right = false;
    input.thrust = false;
    if (distance < 10) {
        return;
    }
    if (direction === 'thrust' && distance < 30) {
        return
    }
    input[direction] = true;
}

type Button = 'fireA' | 'fireB' | 'shield';
type Direction = 'thrust' | 'left' | 'right';
interface IInput {
    fireA: boolean;
    fireB: boolean;
    shield: boolean;
    left: boolean;
    right: boolean;
    thrust: boolean;
};
