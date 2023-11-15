const WATER_COLOR = 'blue';
const HIT_COLOR = 'red';
const INITIAL_COLOR = 'gray';
const BOMB_COLOR = 'black';
let currentLevel = 0;
let torpedo;


let score = 300;




$(document).ready(function() {
    let gridStates = [];
    let boatPositions = [];
    let radarCount = 0; 

    function createGrid(n) {
        $('#level').html(currentLevel);
        var gridSize = 570;
        var itemSize = gridSize / n;
        $('#grid').empty().css({'width': gridSize + 'px', 'height': gridSize + 'px'});
        gridStates = new Array(n * n).fill(INITIAL_COLOR);
        boatPositions = placeBoats(n);
        torpedo = Math.ceil(n * n / 3 + 5); 
        $('#torpedoCount').html(torpedo);
        updateBoatCount();
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
                    'text-align': 'center',
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
    
            let targetIndex = parseInt(e.currentTarget.id.split('-')[1]);
            processHit(targetIndex);
    
            $('#torpedoCount').html(torpedo);
            checkWinCondition();
            updateBoatCount();
    
            if (torpedo === 0) {
                setTimeout(gameOver, 300);
            }
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
            tryAcquireRadar();
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
        
        updateGridForGameOver();
    
       
        setTimeout(function() {
            score -= 147 + (currentLevel * 4);
            updateScoreDisplay();
            alert("No more torpedoes left! You lost!");
            createGrid(currentLevel + 3);
        }, 1000); 
    }
    
    function gameOver() {
    
    updateGridForGameOver();

    
    setTimeout(function() {
        score -= 147 + (currentLevel * 4);
        updateScoreDisplay();
        alert("No more torpedoes left! You lost!");
        createGrid(currentLevel + 3);
    }, 300); 
}

function updateGridForGameOver() {
    
    const BOAT_COLOR = 'yellow'; 

    
    gridStates.forEach((state, index) => {
        if (!state || state === INITIAL_COLOR) {
            if (boatPositions[index]) {
                
                gridStates[index] = BOAT_COLOR;
                $('#gridItem-' + index).css('background-color', BOAT_COLOR);
            }
        }
    });
}



function updateScoreDisplay() {
    $('#score').html(score);
}

    
    
    function updateScoreDisplay() {
        $('#score').html(score);
    }

    function updateRadarDisplay() {
        $('#radarNumber').html(radarCount);
    }

    function useRadar() {
        if (radarCount > 0) {
            radarCount--;
            updateRadarDisplay();
            revealBoatsTemporarily();
            
        } else {
            alert("No radars available!");
        }
    }

    
    $('#useRadarButton').click(function() {
        useRadar();
    });

    function tryAcquireRadar() {
        if (Math.random() < 0.01) { 
            radarCount++;
            updateRadarDisplay();
        }
    }

    function useRadar() {
        if (radarCount > 0) {
            radarCount--;
            updateRadarDisplay();
            revealBoatsTemporarily();
        }
    }

    function revealBoatsTemporarily() {
        const originalColors = gridStates.slice(); 

        boatPositions.forEach((isBoat, index) => {
            if (isBoat && gridStates[index] !== HIT_COLOR) {
                $('#gridItem-' + index).css('background-color', 'green');
            }
        });

        setTimeout(() => {
            
            gridStates.forEach((state, index) => {
                $('#gridItem-' + index).css('background-color', state);
            });
        }, 60); 
    }

    
    tryAcquireRadar();
    

    createGrid(currentLevel + 3);
});

