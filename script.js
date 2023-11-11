const WATER_COLOR = 'blue';
const HIT_COLOR = 'red';
const INITIAL_COLOR = 'gray';
let currentLevel = 1;
let torpedo;

$(document).ready(function() {
    $('#previousLevelBtn').click(function() {
        if (currentLevel > 1) {
            currentLevel--;
            createGrid(currentLevel + 3);
        }
    });

    $('#nextLevelBtn').click(function() {
        if (currentLevel < 10) {
            currentLevel++;
            createGrid(currentLevel + 3);
        }
    });

    $('#restartLevelBtn').click(function() {
        createGrid(currentLevel + 3);
    });

    let gridStates = [];
    let boatPositions = [];

    function createGrid(n) {
        $('#level').html(currentLevel);

        var gridSize = 500;
        var itemSize = gridSize / n;
        $('#grid').empty().css({'width': gridSize + 'px', 'height': gridSize + 'px'});

        gridStates = new Array(n * n).fill(INITIAL_COLOR);
        boatPositions = placeBoats(n);

        torpedo = Math.ceil(n * n / 3 + 5); // Adjusting torpedo count based on grid size
        $('#torpedoCount').html(torpedo);
        updateBoatCount();

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
            if (torpedo > 0) {
                torpedo--;

                let targetIndex = e.currentTarget.id.split('-')[1];
                gridStates[targetIndex] = (boatPositions[targetIndex]) ? HIT_COLOR : WATER_COLOR;
                $('#' + e.currentTarget.id).css('background-color', gridStates[targetIndex]);

                $('#torpedoCount').html(torpedo);
                updateNextLevelButton();
                updateBoatCount();
            } else {
                console.log("No more torpedoes left.");
            }
        });
    }

    function placeBoats(n) {
        let boats = new Array(n * n).fill(0);
        let totalBoats = 2 + currentLevel; // Number of boats increases with level

        while (totalBoats > 0) {
            let size = Math.min(totalBoats, Math.floor(Math.random() * 3) + 1); // Random boat size 1-3
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

    function updateNextLevelButton() {
        let hitCount = gridStates.filter(color => color === HIT_COLOR).length;
        let requiredHits = boatPositions.filter(position => position === 1).length;
        $('#nextLevelBtn').prop('disabled', hitCount !== requiredHits);
    }

    function updateBoatCount() {
        let boatsLeft = boatPositions.filter(position => position === 1).length - gridStates.filter(color => color === HIT_COLOR).length;
        $('#boatCount').html(boatsLeft);
    }

    createGrid(currentLevel + 3);
    updateNextLevelButton();
});
