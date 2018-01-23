var myConnectionHub = new signalR.HubConnection('/asteroids');
myConnectionHub.start().then(() => {
    console.log('started');
});

const state: {
    direction?: 'left' | 'right' | 'thrust',
    distance?: 0 | 1 | 2
} = {};



function initController() {
    let nipple = nipplejs.create({
        zone: document.body.querySelector('.controller .target'),
        mode: 'static',
        position: { left: '0', top: '50%' },
        color: '#397cd4'
    });

    let btnFireA = document.querySelector('button.fire-a');
    let btnFireB = document.querySelector('button.fire-b');
    let btnShield = document.querySelector('button.shield');
    let buttons = document.querySelectorAll('.buttons button');

    nipple.on('move', (ev, args) => {
        let directions = {
            up: 'thrust',
            left: 'left',
            right: 'right'
        };
        if (!args.direction) return;
        let dir = directions[args.direction.angle];
        if (!dir) return;
        myConnectionHub.invoke('SendMove', dir, Math.round(args.distance));
    });
    nipple.on('end', () => {
        myConnectionHub.invoke('SendMove', 'thrust', 0);
    });

    for (let i = 0; i < buttons.length; i++) {
        let btn = buttons[i];
        btn.addEventListener('touchstart', ev => {
            sendButtonAction(ev, true);
        });
        btn.addEventListener('touchend', ev => {
            sendButtonAction(ev, false);
        });
    }

    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    }, false);

    function sendButtonAction(ev: Event, on: boolean) {
        let el = (<HTMLElement>ev.target).closest('button');
        let prop = el.getAttribute('data');
        state[prop] = on;
        myConnectionHub.invoke('SendButton', prop, on);
    }

    function sendMove(direction: Direction, distance: number) {
        if ((distance < 10) && (direction === 'thrust' && distance < 30)) {
            myConnectionHub.invoke('SendMove', 'thrust', 0);
        } else {
            myConnectionHub.invoke('SendMove', direction, 100);
        }
    }
};

interface INipple {
    create(opts: any);
    on(ev: string, callback: (args: any) => void);
}

declare var nipplejs: INipple;
interface IInput {
    fireA: boolean;
    fireB: boolean;
    shield: boolean;
    left: boolean;
    right: boolean;
    thrust: boolean;
};

window.addEventListener('load', initController);