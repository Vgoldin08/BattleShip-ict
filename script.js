const WATER_COLOR = 'blue';
const HIT_COLOR = 'red';
const INITIAL_COLOR = 'gray';
let currentLevel = 0;
let torpedo;
let bombUses = 1;
let score = 300;

$(document).ready(function() {
    let gridStates = [];
    let boatPositions = [];

    function createGrid(n) {
        $('#level').html(currentLevel);
        bombUses = 1;
        var gridSize = 500;
        var itemSize = gridSize / n;
        $('#grid').empty().css({'width': gridSize + 'px', 'height': gridSize + 'px'});
        gridStates = new Array(n * n).fill(INITIAL_COLOR);
        boatPositions = placeBoats(n);
        torpedo = Math.ceil(n * n / 3 + 5); 
        $('#torpedoCount').html(torpedo);
        updateBoatCount();
        updatePowerUpsCount();
        updateScore();

        for (var i = 0; i < n * n; i++) {
            $('<div />', {
                'id': 'gridItem-' + i,
                'data-type': 'gridItemClick',
                'class': 'grid-item',
                'css': {
                    'width': itemSize + 'px',
                    'height': itemSize + 'px',
                    'line-height': itemSize + 'px',
                    'background-color': gridStates[i],
                    'text-align': 'center'
                }
            }).appendTo('#grid');
        }

        $('div[data-type="gridItemClick"]').click(function(e) {
            handleItemClick(e);
        });
    }

    function placeBoats(n) {
        let boats = new Array(n * n).fill(0);
        let totalBoats = 2 + currentLevel; 

        while (totalBoats > 0) {
            let size = Math.min(totalBoats, Math.floor(Math.random() * 3) + 1); 
            let start = Math.floor(Math.random() * boats.length);

            if (canPlaceBoat(boats, n, start, size)) {
                for (let i = start; i < start + size; i++) {
                    boats[i] = 1;
                }
                totalBoats -= size;
            }
        }
        return boats;
    }

    function canPlaceBoat(boats, n, start, size) {
        let row = Math.floor(start / n);
        for (let i = start; i < start + size; i++) {
            if (i >= boats.length || boats[i] === 1 || Math.floor(i / n) !== row) {
                return false;
            }
        }
        return true;
    }

    function updateBoatCount() {
        let boatsLeft = boatPositions.filter(position => position === 1).length - gridStates.filter(color => color === HIT_COLOR).length;
        $('#boatCount').html(boatsLeft);
    }

    function updateScore() {
        $('#score').html(score);
    }

    function handleItemClick(e) {
        if (torpedo > 0) {
            torpedo--;

            if (torpedo === 0) {
                gameOver();
                return;
            }

            let targetIndex = parseInt(e.currentTarget.id.split('-')[1]);
            processHit(targetIndex);

            $('#torpedoCount').html(torpedo);
            checkWinCondition();
            updateBoatCount();
        } else {
            gameOver();
        }
    }

    function processHit(index) {
        if (!gridStates[index] || gridStates[index] === INITIAL_COLOR) {
            if (boatPositions[index]) {
                score += 104 +(currentLevel *15);
                gridStates[index] = HIT_COLOR;
            } else {
                score -= 47 +(currentLevel *4);
                gridStates[index] = WATER_COLOR;
            }
            $('#gridItem-' + index).css('background-color', gridStates[index]);
            updateScore();
        }
    }

    function checkWinCondition() {
        let hitCount = gridStates.filter(color => color === HIT_COLOR).length;
        let requiredHits = boatPositions.filter(position => position === 1).length;

        if (hitCount === requiredHits) {
            score += 486 + (currentLevel * 115);
            updateBoatCount();
            gridStates.forEach((state, index) => {
                if (boatPositions[index] === 1 && state !== HIT_COLOR) {
                    gridStates[index] = HIT_COLOR;
                    $('#gridItem-' + index).css('background-color', HIT_COLOR);
                }
            });

            setTimeout(function() {
                alert("Congratulations! You won!");
                updateScore();
                currentLevel++;
                createGrid(currentLevel + 3);
            }, 100);
        }
    }

    function gameOver() {
        setTimeout(function() {
            score -= 147 +(currentLevel *4)
            alert("No more torpedoes left! You lost!");
            createGrid(currentLevel + 3);
        }, 300);
    }

    function useBomb() {
        if (bombUses > 0) {
            bombUses--;
            updatePowerUpsCount();
            let bombTargets = [];

            while (bombTargets.length < 5) {
                let randomIndex = Math.floor(Math.random() * gridStates.length);
                if (!bombTargets.includes(randomIndex)) {
                    bombTargets.push(randomIndex);
                }
            }

            bombTargets.forEach(index => processHit(index));
            checkWinCondition();
            updateBoatCount();
        }
    }

    function updatePowerUpsCount() {
        $('#bombCount').html(bombUses);
    }

    $('#useBomb').click(function() {
        useBomb();
    });

    createGrid(currentLevel + 3);
});

