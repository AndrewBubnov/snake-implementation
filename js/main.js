
function Node(x,y) {
    this.x = x;
    this.y = y;

    this.getOutNodes = function() {
       let newX;
       let newY;
       let nodesArray = [];
        newX = x - 1;
        if (isAllowed(newX)) nodesArray.push(new Node(newX, y));
        newX = x + 1;
        if (isAllowed(newX)) nodesArray.push(new Node(newX, y));
        newY = y - 1;
        if (isAllowed(newY)) nodesArray.push(new Node(x, newY));
        newY = y + 1;
        if (isAllowed(newY)) nodesArray.push(new Node(x, newY));
        return nodesArray;
    };
    this.equals = function (object) {
        return (this.x === object.x && this.y === object.y);
    };
    // this.toString = function () {
    //     return this.x + " ; " + this.y;
    // };
}



function isAllowed(n) {
   return (!(n < 1 || n > 20));
}

function getByKey (map, key) {
    for (let k of map.entries()) {
        if (k[0].equals(key)) {
            return k[1];
        }
    }
}

function hasKey(set, key) {
    for (let k of set.keys()) {
        if (k.x === key.x && k.y === key.y) {
            return true;
        }
    }
    return false;
}


function bfs(start,finish, stone) {
    let visited = new Set();
    let nodeStory = new Map();
    let steps = [];
    let queue = [];
    let current = start;
    queue.push(start);
    visited.add(stone);
    visited.add(start);
    while(queue.length > 0){
        current = queue.shift();
        if (current.equals(finish)){
            break;
        } else {
            for (let node of current.getOutNodes()){
                if (!hasKey(visited, node)){
                    queue.push(node);
                    visited.add(node);
                    nodeStory.set(node, current);
                }
            }
        }
    }
    let node = finish;
    while(!node.equals(start)){
        steps.push(node);
        node = getByKey(nodeStory, node);
    }
    return steps.reverse();
}

for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
        $('<div>').addClass('cell').attr('id', (j + 1) + '_' + (i + 1)).appendTo($('.container'));
    }
}

let currentHead = new Node(5,5);
let headExists = false;
let moves = [];
let snakeBody = [];
let interval;
let snakeLength = 1;
function move(start, finish, stone) {
        if (!headExists) {
            $('<div>').addClass('head').appendTo($('#' + start.x + '_' + start.y));
            headExists = true;
        }
        interval = setInterval(function () {
            let temp = [start.x, start.y];
            moves.push(temp);
            if (moves.length > 100) {
                moves = moves.slice(50, 102);
                console.log(moves.length);
            }
            let nextStep = bfs(start, finish, stone)[0];
            $('.head').appendTo('#' + nextStep.x + '_' + nextStep.y);


            if (snakeBody.length > 0){
                for (let i = 0; i < snakeBody.length; i++) {
                    snakeBody[i][0] = moves[moves.length - (i + 1)][0];
                    snakeBody[i][1] = moves[moves.length - (i + 1)][1];
                    $('#' + (i + 1)).appendTo('#' + snakeBody[i][0] + '_' + snakeBody[i][1]);
                }
            }
            start = nextStep;
            currentHead = nextStep;
            if (start.equals(finish)) {
                $('.apple').remove();
                $('.stone').remove();
                clearInterval(interval);
                let bodyX = moves[moves.length - snakeLength][0];
                let bodyY = moves[moves.length - snakeLength][1];

                $('<div>').addClass('snake').attr('id', snakeLength).appendTo($('#' + bodyX + '_' + bodyY));
                snakeLength++;
                snakeBody.push([bodyX, bodyY]);
                main();
            }
     }, 300);

}

function main() {
    let appleX = Math.floor(Math.random()*20) + 1;
    let appleY = Math.floor(Math.random()*20) + 1;
    $('<div>').addClass('apple').appendTo($('#' + appleX + '_' + appleY));
    let stoneX = Math.floor(Math.random()*20) + 1;
    let stoneY = Math.floor(Math.random()*20) + 1;
    $('<div>').addClass('stone').appendTo($('#' + stoneX + '_' + stoneY));
    move(currentHead, new Node(appleX, appleY), new Node(stoneX, stoneY));
}
$('.stop').on('click', function () {
    clearInterval(interval);
});

main();


