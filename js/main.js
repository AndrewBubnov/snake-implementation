function Node(x,y) {
    this.x = x;
    this.y = y;

    this.getOutNodes = function(preference) {
        let newX;
        let newY;
        let nodesArray = [];
        if (preference === "x-y-") {
            newX = this.x - 1;
            if (isAllowed(newX)) nodesArray.push(new Node(newX, this.y));
            newY = this.y - 1;
            if (isAllowed(newY)) nodesArray.push(new Node(this.x, newY));
            newX = this.x + 1;
            if (isAllowed(newX)) nodesArray.push(new Node(newX, this.y));
            newY = this.y + 1;
            if (isAllowed(newY)) nodesArray.push(new Node(this.x, newY));
            return nodesArray;
        }
        else if (preference === "x-y+") {
            newX = this.x - 1;
            if (isAllowed(newX)) nodesArray.push(new Node(newX, this.y));
            newY = this.y + 1;
            if (isAllowed(newY)) nodesArray.push(new Node(this.x, newY));
            newY = this.y - 1;
            if (isAllowed(newY)) nodesArray.push(new Node(this.x, newY));
            newX = this.x + 1;
            if (isAllowed(newX)) nodesArray.push(new Node(newX, this.y));
            return nodesArray;
        }
        else if (preference === "x+y-") {
            newY = this.y - 1;
            if (isAllowed(newY)) nodesArray.push(new Node(this.x, newY));
            newX = this.x + 1;
            if (isAllowed(newX)) nodesArray.push(new Node(newX, this.y));
            newX = this.x - 1;
            if (isAllowed(newX)) nodesArray.push(new Node(newX, this.y));
            newY = this.y + 1;
            if (isAllowed(newY)) nodesArray.push(new Node(this.x, newY));
            return nodesArray;
        }
        else {
            newX = this.x + 1;
            if (isAllowed(newX)) nodesArray.push(new Node(newX, this.y));
            newY = this.y + 1;
            if (isAllowed(newY)) nodesArray.push(new Node(this.x, newY));
            newY = this.y - 1;
            if (isAllowed(newY)) nodesArray.push(new Node(this.x, newY));
            newX = this.x - 1;
            if (isAllowed(newX)) nodesArray.push(new Node(newX, this.y));
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

function getPreference(start, finish) {
    let preference;
    if (finish.x >= start.x &&  finish.y >= start.y) preference = "x+y+";
    else if (finish.x < start.x &&  finish.y >= start.y) preference = "x-y+";
    else if (finish.x >= start.x &&  finish.y < start.y) preference = "x+y-";
    else preference = "x-y-";
    return preference;
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
            for (let node of current.getOutNodes(getPreference(start, finish))){
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

let currentHead = new Node(5,5);
let headExists = false;
let moves = [];
let snakeBody = [];
let interval;
let snakeLength = 1;
function indexOfElement(array, value) {
    for (let i = 0; i < array.length; i++) {
        if(array[i].equals(value)) return i;
    }
}

let apple;
function move(start, finish, stone) {
    if (!headExists) {
        $('<div>').addClass('head').appendTo($('#' + start.x + '_' + start.y));
        headExists = true;
    }

        interval = setInterval(function () {

        moves.push(start);
        if (moves.length > 200) {
            moves = moves.slice(100, 202);
        }
        let steps = bfs(start, finish, stone);


        let tail = moves.concat(steps[0]);

        let tempStone = tail.slice(tail.length - snakeLength + 1);
        tempStone.push(stone[0]);

        let tempSearch;

        if (snakeLength > 1){
            if (snakeBody.length > 0 && steps[0].x === - 1 && steps[0].y === - 1){

                console.log("can't reach apple, going after tail");
                finish = new Node(snakeBody[snakeBody.length - 1].x, snakeBody[snakeBody.length - 1].y);
                let array = snakeBody.slice(0, snakeBody.length - 2);
                array.push(stone[0]);
                steps = bfs(start, finish, array);

            } else {
                tempSearch = bfs(finish, tail[tail.length - snakeLength], tempStone);

                if (tempSearch[0].x === -1 && tempSearch[0].y === -1){
                    console.log("can't reach tail after reaching apple, going after tail");

                    finish = new Node(snakeBody[snakeBody.length - 1].x, snakeBody[snakeBody.length - 1].y);
                    let array = snakeBody.slice();
                    array.splice(-2, 2).push(stone[0]);
                    steps = bfs(start, finish, array);

                } else {
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
        currentHead = nextStep;
        if (start.equals(finish)) {

            if ($('#' + finish.x + '_' + finish.y).children().first().hasClass('apple')){
            $('.apple').remove();

            clearInterval(interval);

            let bodyX = moves[moves.length - snakeLength].x;
            let bodyY = moves[moves.length - snakeLength].y;

            $('<div>').addClass('snake').attr('id', snakeLength).appendTo($('#' + bodyX + '_' + bodyY));



            $('.head').addClass('green');
            $('.snake').addClass('green');
            setTimeout(function () {
                $('.head').removeClass('green');
                $('.snake').removeClass('green');
            }, 200);
            $('.score').text(snakeLength);
            snakeLength++;
            snakeBody.push(new Node(bodyX, bodyY));

            main(start);
            } else {

                clearInterval(interval);

                let bodyX = moves[moves.length - snakeLength].x;
                let bodyY = moves[moves.length - snakeLength].y;
                console.log('line 307: finish(start) = ' + finish);
                console.log('line 307: apple = ' + apple);
                console.log('line 307: BFS = ' + bfs(finish, apple, stone));

                if (bfs(finish, apple, stone)[0] !== -1){
                    move(finish, apple, stone);
                } else {
                    move(finish, new Node(snakeBody[snakeBody.length - 1].x, snakeBody[snakeBody.length - 1].y), stone);
                }
            }
        }
    }, 100);
}

// function allowedPlace(start) {
//     let node;
//     if (start.x < 20 && !restrictedLocked(start.x + 1, start.y)) node = new Node(start.x + 1, start.y);
//     else if (start.x > 1 && !restrictedLocked(start.x - 1, start.y)) node = new Node(start.x - 1, start.y);
//     else if (start.y < 20 && !restrictedLocked(start.x, start.y + 1)) node = new Node(start.x, start.y + 1);
//     else if (start.y > 1 && !restrictedLocked(start.x, start.y - 1))node = new Node(start.x, start.y - 1);
//     else node = start;
//     return node;
// }


// function defineDirection(moves, currentStep) {
//     if (moves[currentStep - 1][0] === moves[currentStep][0] && moves[currentStep - 1][1] < moves[currentStep][1]) return "down";
//     if (moves[currentStep - 1][0] === moves[currentStep][0] && moves[currentStep - 1][1] > moves[currentStep][1]) return "up";
//     if (moves[currentStep - 1][0] < moves[currentStep][0] && moves[currentStep - 1][1] === moves[currentStep][1]) return "right";
//     if (moves[currentStep - 1][0] > moves[currentStep][0] && moves[currentStep - 1][1] === moves[currentStep][1]) return "left";
// }
let stoneSet = new Set();
let stoneArray;
function main(start) {
    if (start === undefined) {
        start = currentHead;
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
    stoneArray = stoneArray.concat(snakeBody);
    let appleX;
    let appleY;
    while(true) {
        appleX = Math.floor(Math.random() * 20) + 1;
        appleY = Math.floor(Math.random() * 20) + 1;
        if (!restrictedPlace(appleX, appleY, start)) break;
    }
    $('<div>').addClass('apple').appendTo($('#' + appleX + '_' + appleY));
    apple = new Node(appleX, appleY);
    move(currentHead, new Node(appleX, appleY), stoneArray);
}


function restrictedPlace(x, y, start) {
    return stoneArray.some(function (element) {
        return element.x === x && element.y === y;
    }) || snakeBody.some(function (element) {
        return element[0] === x && element[1] === y;
    }) || (start.x === x && start.y === y);
}

// function restrictedLocked(x, y) {
//     return stoneArray.some(function (element) {
//         return element.x === x && element.y === y;
//     }) || snakeBody.some(function (element) {
//         return element[0] === x && element[1] === y;
//     });
// }


$('.button-container').on('click', function (e) {
    if (e.target.id === 'start'){
        main();
    }
    if (e.target.id === 'stop'){
        clearInterval(interval);
    }
});