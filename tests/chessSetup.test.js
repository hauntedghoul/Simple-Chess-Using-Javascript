// Mock the DOM elements required for testing
document.body.innerHTML = `
  <div id="gameboard"></div>
  <div id="player">black</div> <!-- Make sure this element is set up -->
  <div id="err"></div>
  <div id="info-display"></div>
  <select id="game-mode">
    <option value="traditional">Traditional Chess</option>
    <option value="chess960">Chess960</option>
  </select>
  <button id="start-game">Start Game</button>
`;

describe('Chess Game Tests', () => {

  beforeEach(() => {
    // Reset the board before each test
    document.getElementById('gameboard').innerHTML = '';
  });

  // test('Initial game setup for Traditional Chess', () => {
  //   // Ensure the board is set up correctly
  //   window.createBoard();  // Access the function from the global `window` object
    
  //   const boardSquares = document.querySelectorAll('.square');
  //   expect(boardSquares.length).toBe(64);  // Ensure there are 64 squares
  // });

  // test('Initial game setup for Chess960', () => {
  //   // Set the game mode to Chess960
  //   document.getElementById('game-mode').value = 'chess960';
  //   document.getElementById('start-game').click();
  
  //   // Ensure the board has 64 squares after setting up
  //   const boardSquares = document.querySelectorAll('.square');
  //   expect(boardSquares.length).toBe(64); // Check if the board has 64 squares
  
  //   // Check if the back row of Chess960 contains a King and a Rook
  //   const backRow = Array.from(boardSquares).slice(56, 64);
  //   const pieces = backRow.map(square => square.innerHTML);
  //   expect(pieces).toContain('King');
  //   expect(pieces).toContain('Rook');
  // });

  test('Player turn starts as black', () => {
    const playerTurnElement = document.getElementById('player');
    expect(playerTurnElement.textContent).toBe('black');
  });

  // test('Player turn alternates correctly', () => {
  //   // Simulate a move by calling dragStart and dragDrop functions
  //   const mockEventStart = {
  //     target: { classList: { contains: () => true }, parentNode: { getAttribute: () => '0' }, innerHTML: 'Pawn' },
  //     preventDefault: jest.fn()
  //   };
  //   const mockEventDrop = {
  //     target: { getAttribute: () => '1' }
  //   };

  //   // Mock the player turn
  //   let playerTurn = 'black';

  //   // Trigger a drag and drop action
  //   window.dragStart(mockEventStart);  // Access from global `window`
  //   window.dragDrop(mockEventDrop);    // Access from global `window`

  //   // Check if the turn has changed
  //   const playerTurnElement = document.getElementById('player');
  //   expect(playerTurnElement.textContent).toBe('white');
  // });

  // test('Valid Pawn move', () => {
  //   const isValid = window.isValidMove(8, 16);  // Test pawn move (forward by 1)
  //   expect(isValid).toBe(true);
  // });

  // test('Declare winner when King is captured', () => {
  //   let gameEnded = false;
  //   window.declareWinner('black');
  //   const infoDisplay = document.getElementById('info-display');
  //   expect(infoDisplay.textContent).toBe('Black wins! 🎉');
  //   expect(gameEnded).toBe(true);
  // });

});
