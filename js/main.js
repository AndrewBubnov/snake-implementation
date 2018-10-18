function Node(x,y) {
    this.x = x;
    this.y = y;

    this.getOutNodes = function(preference) {
        let newX;
        let newY;
        let nodesArray = [];
        if (preference) {
            newX = this.x + 1;
            if (isAllowed(newX)) nodesArray.push(new Node(newX, this.y));
            newY = this.y + 1;
            if (isAllowed(newY)) nodesArray.push(new Node(this.x, newY));
            newX = this.x - 1;
            if (isAllowed(newX)) nodesArray.push(new Node(newX, this.y));
            newY = this.y - 1;
            if (isAllowed(newY)) nodesArray.push(new Node(this.x, newY));
            return nodesArray;
        }
        else {
            newX = this.x - 1;
            if (isAllowed(newX)) nodesArray.push(new Node(newX, this.y));
            newY = this.y + 1;
            if (isAllowed(newY)) nodesArray.push(new Node(this.x, newY));
            newX = this.x + 1;
            if (isAllowed(newX)) nodesArray.push(new Node(newX, this.y));
            newY = this.y - 1;
            if (isAllowed(newY)) nodesArray.push(new Node(this.x, newY));
            return nodesArray;
        }
    };

    this.equals = function (object) {
        return (this.x === object.x && this.y === object.y);
    }
}
Node.prototype.toString = function () {
    return this.x + " : " + this.y + " ";
};

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


function bfs(start,finish, stones) {
    let visited = new Set();
    let nodeStory = new Map();
    let steps = [];
    let queue = [];
    let current = start;
    queue.push(start);
    for(let stone of stones) {
        visited.add(stone);
    }
    visited.add(start);
    while(queue.length > 0){
        current = queue.shift();
        if (current.equals(finish)){
            break;
        } else {
            for (let node of current.getOutNodes(variables.preference)){
                if (!hasKey(visited, node)){
                    queue.push(node);
                    visited.add(node);
                    nodeStory.set(node, current);
                }
            }
        }
    }
    if (!current.equals(finish)) {
        steps.push(new Node(-1, -1));
        return steps;
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


function move(start, finish, stone) {
    if (!variables.headExists) {
        $('<div>').addClass('head').appendTo($('#' + start.x + '_' + start.y));
        variables.headExists = true;
    }

    let interval = setInterval(function () {
        variables.setSnakeInterval(interval);
        let moves = variables.getMoves();
        let snakeBody = variables.getSnakeBody();
        let snakeLength = variables.getSnakeLength();
        moves.push(start);
        if (moves.length > 200) {
            moves = moves.slice(100, 202);
        }
        variables.setMoves(moves);
        let steps = bfs(start, finish, stone);

        if (steps[0].x !== -1) moves.concat(steps[0]);
        else start = moves[moves.length - 1];

        let tempStone = moves.slice(moves.length - snakeLength + 1);
        tempStone.push(stone[0]);

        let tempSearch;

        if (snakeLength > 1){
            if (snakeBody.length > 0 && steps[0].x === - 1){
                console.log("can't reach apple, going after tail");
                variables.preference = !variables.preference;
                steps = stepsAfterTail(start, moves, snakeBody, snakeLength, stone[0]);

            } else {
                tempSearch = bfs(finish, moves[moves.length - snakeLength], tempStone);

                if (tempSearch[0].x === -1 && tempSearch[0].y === -1){
                    console.log("can't reach tail after reaching apple, going after tail");
                    variables.preference = !variables.preference;
                    steps = stepsAfterTail(start, moves, snakeBody, snakeLength, stone[0]);

                }
                else {
                    console.log("plain search for the apple");
                }
            }
        }

        let nextStep = steps[0];

        $('.head').appendTo('#' + nextStep.x + '_' + nextStep.y);
        if (nextStep.x < start.x) $('.head').removeClass('turnUp').removeClass('turnDown').addClass('flipLeft');
        else if (nextStep.y < start.y) $('.head').removeClass('flipLeft').removeClass('turnDown').addClass('turnUp');
        else if (nextStep.y > start.y) $('.head').removeClass('flipLeft').removeClass('flipLeft').addClass('turnDown');
        else $('.head').removeClass('flipLeft').removeClass('turnUp').removeClass('turnDown');
        if (snakeBody.length > 0){
            for (let i = 0; i < snakeBody.length; i++) {
                let currentStep = moves.length - (i + 1);
                snakeBody[i].x = moves[currentStep].x;
                snakeBody[i].y = moves[currentStep].y;
                $('#' + (i + 1)).appendTo('#' + snakeBody[i].x + '_' + snakeBody[i].y);
            }
        }
        start = nextStep;
        variables.setCurrentHead(nextStep);

        let currentStart = $('#' + start.x + '_' + start.y);
        if (start.equals(finish) || currentStart.children().first().hasClass('apple')) {
            clearInterval(interval);

            let bodyX = moves[moves.length - snakeLength].x;
            let bodyY = moves[moves.length - snakeLength].y;
            if (currentStart.children().first().hasClass('apple')){
                $('.apple').remove();
                $('<div>').addClass('snake').attr('id', snakeLength).appendTo($('#' + bodyX + '_' + bodyY));
                snakeBody.push(new Node(bodyX, bodyY));

                $('.head').addClass('green');
                $('.snake').addClass('green');
                setTimeout(function () {
                    $('.head').removeClass('green');
                    $('.snake').removeClass('green');
                }, 200);
                $('.score').text(++variables.counter);
                snakeLength++;
                variables.setSnakeLength(snakeLength);

                if (snakeLength > 80){
                    for (let i = snakeBody.length - 1; i >= 75; i--) {
                        $('#' + snakeBody[i].x + '_' + snakeBody[i].y).children().first().remove();
                    }
                    snakeBody.splice(-5, 5);
                    variables.setSnakeLength(snakeLength - 5);
                }
                variables.setSnakeBody(snakeBody);
                main(start);
            } else {
                move(finish, variables.getApple(), stone);
            }
        }
    }, 100);
}

function stepsAfterTail(start, moves, snakeBody, snakeLength, stone) {
    let finish = moves[moves.length - snakeLength];
    let array = snakeBody.slice(0, snakeBody.length - 1);
    array.push(stone);
    return bfs(start, finish, array);
}



let Variables = function () {
    let stoneSet = new Set();
    let stoneArray;
    let currentHead = new Node(5,5);
    let apple;
    let moves = [];
    let snakeBody = [];
    let interval;
    let snakeLength = 1;
    this.counter = 0;
    this.preference = true;
    this.getStoneSet = function () {
        return stoneSet;
    }
    this.setStoneSet = function (_stoneSet) {
        stoneSet = _stoneSet;
    }
    this.getStoneArray = function () {
        return stoneArray;
    }
    this.setStoneArray = function (_stoneArray) {
        stoneArray = _stoneArray;
    }
    this.getCurrentHead = function () {
        return currentHead;
    }
    this.setCurrentHead = function (_currentHead) {
        currentHead = _currentHead;
    }
    this.getApple = function () {
        return apple;
    }
    this.setApple = function (_apple) {
        apple = _apple;
    }
    this.getMoves = function () {
        return moves;
    }
    this.setMoves = function (_moves) {
        moves = _moves;
    }
    this.getSnakeBody = function () {
        return snakeBody;
    }
    this.setSnakeBody = function (_snakeBody) {
        snakeBody = _snakeBody;
    }
    this.getSnakeInterval = function () {
        return interval;
    }
    this.setSnakeInterval = function (_interval) {
        interval = _interval;
    }
    this.getSnakeLength = function () {
        return snakeLength;
    }
    this.setSnakeLength = function (_snakeLength) {
        snakeLength = _snakeLength;
    }
}

let variables = new Variables();

function main(start) {
    let stoneSet = variables.getStoneSet();
    let stoneArray = variables.getStoneArray();

    if (start === undefined) {
        start = variables.getCurrentHead();
        while (true) {
            let stoneX = Math.floor(Math.random()*20) + 1;
            let stoneY = Math.floor(Math.random()*20) + 1;
            if (stoneX !== start.x && stoneY !== start.y) {
                $('<div>').addClass('stone').appendTo($('#' + stoneX + '_' + stoneY));
                stoneSet.add(new Node(stoneX, stoneY));
            }
            if (stoneSet.size === 1) break;
        }
    }
    stoneArray = Array.from(stoneSet);
    stoneArray = stoneArray.concat(variables.getSnakeBody());
    variables.setStoneSet(stoneSet);
    variables.setStoneArray(stoneArray);
    let appleX;
    let appleY;
    while(true) {
        appleX = Math.floor(Math.random() * 20) + 1;
        appleY = Math.floor(Math.random() * 20) + 1;
        if (!restrictedPlace(appleX, appleY, start, stoneArray)) break;
    }
    $('<div>').addClass('apple').appendTo($('#' + appleX + '_' + appleY));
    variables.setApple(new Node(appleX, appleY));
    move(start, new Node(appleX, appleY), stoneArray);
}

function restrictedPlace(x, y, start,stoneArray) {
    return stoneArray.some(function (element) {
        return element.x === x && element.y === y;
    }) || variables.getSnakeBody().some(function (element) {
        return element[0] === x && element[1] === y;
    }) || (start.x === x && start.y === y) || !isAllowed(x) || !isAllowed(y);
}


$('.button-container').on('click', function (e) {
    if (e.target.id === 'start'){
        clearInterval(variables.getSnakeInterval());
        location.reload();

    }
    if (e.target.id === 'stop'){
        clearInterval(variables.getSnakeInterval());
    }
});

main();