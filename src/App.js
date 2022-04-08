// Date : April 8, 2022
/*
- Expected Output: Creates a sliddding puzzle with the ability to shuffle and increase the difficulty process
*/

//Import libraries 
import React, {useState} from "react";
//Motion and Spring are used for the movement for the tiles
import { Motion, spring } from "react-motion";

//Initializiation and setup for board
let size_board = 200; // board size
let numberofTiles = 9; // Initial number of tiles
let size_box = 3; //Number of tiles in col and row
let counter = 0; 
let message_counter = 10; // Counter for displaying messages
let message_index = 0;

//Swap tiles where it is stored into an array where tiles are switched according to the position
function swapping_tiles(boxes, initial,final) {
  let after_swap = [...boxes];
  [after_swap[final],after_swap[initial]] = [after_swap[initial],after_swap[final]];
  return after_swap;
}

//generateRandom: Generate random numbers to be displayed for the user 
function generateRandom() {
    //Create a list of numbers in order
    let array = [];
    for (let i = 0; i < numberofTiles; i++){
      array.push(i)
    }
    
    //Use those list of numbers and randomize it 
    for (let i = 0; i < array.length; i++) {
        let k = Math.floor((i) * Math.random());
        //Swap values, pass by reference
        let temp_val = array[k];
        array[k] = array[i];
        array[i] = temp_val;
    }
  return array;
}

//Created a function to identify if the user entered numbers are in order
function solved_matrix(tiles) {
    let length_array = tiles.length;

    for (let i = 0; i < length_array; i++)
    {
        // Checking if the user entered number in that index matches with the one with computer. If not return false
        if (length_array[i] !== i)
        {
            return false;
        }
    }
    return true;
}

//Function checks if the tiles can be swapped or not based on its positioning.
function swap_tiles(initial, final) {
  let {col: final_column , level: final_row} = {level: Math.floor(final / size_box),col: final % size_box};
  let {col: initial_column ,level: initial_row} = {col: initial % size_box, level: Math.floor(initial / size_box)};
  // It will check if the value is either 1 or 0 based on the following calculations made. 
  return 1=== Math.abs(initial_column - final_column) + Math.abs(initial_row - final_row);
}

//Function is created to display the tile and to create movement between them. 
function LogicTile(props) {

  let { col, row } = {col: props.idx % size_box,row: Math.floor(props.idx / size_box)};

  //Calculating the size of the tile 
  let tile = {height: `calc(100% / ${size_box})`,width: `calc(100% / ${size_box})`};
  
  let position = {y: row * props.height, x: col * props.width};
  
  //Using the postion calculated for x and y to determine how much the movement there should be between tiles
  let movement = {y_direction: spring(position.y),x_direction: spring(position.x)};
  
  return (
      //Using motion to move the tile by using movement variable created above
      //Display the tiles in a list using translate 3d and the list command. Removing one tile by applying opacity
      <Motion style={movement}>
        
      {({x_direction, y_direction}) => (
          <li className="tiledisplay"
          //Create a 3D matrix 
          style={{opacity: props.tile === numberofTiles - 1 ? 0: 1,...tile,transform: `translate3d(${x_direction}px, ${y_direction}px,0)`}}
          onClick={() => props.click(props.idx)}>
          {`${props.tile + 1}`}
          </li>
      )}
      </Motion>
  );
}

//Using all the functions to compile it into one where all of them work together
function Board_Game() {
  
  //Display motivational message to the user every 5 moves. 
  let motivational_message = ["Hola, keep going!","You are doing great.","Keep on going.","You are doing fanatastic.","Amazing work", "Keep on trying", "Keep on going, you are going in the direction!"]
  
  //***************************/
  //This block of code is written to increase the difficulty of the game
  let prev_num = size_box;
  let current_num = 0;
  const next_level = () => {size_box+=1} ;
  current_num = size_box;
  
  if(prev_num === current_num)
  {
    numberofTiles = Math.pow(size_box,2);
    size_board+=1;
    
  }
  //***************************/
  
  //Generate random numbers
  let shuffle_number = generateRandom();
  //Assigning a list of random numbers to a variable number
  let [number, setNumber] = useState([...Array(numberofTiles).keys()]);

  //Calculating the width and height of the tile to make it a square
  let width_tile = Math.round(size_board / size_box);
  let height_tile = Math.round(size_board / size_box);
  let board_style = {height: size_board,width: size_board};

  let start = () => {setNumber(shuffle_number)};

  //Onece the tile is clicked, it will check if it can be swapped and if yes, it will swap the tile. 
  let click = (idx) => {swapping(idx)};
  let swapping = (indx_tile) => {if (swap_tiles(indx_tile, number.indexOf(number.length - 1))) {setNumber(swapping_tiles(number, indx_tile, number.indexOf(number.length - 1)))}}
  
  //Display motivational messages to the user every 5 moves
  if (counter === message_counter)
  {
    if(message_index === motivational_message.length)
    {
      message_index=0;
    }
    //Change the element ID
    document.getElementById("heading1").innerHTML = `${motivational_message[message_index]}`;
    message_counter+=10;
    message_index+=1;
  }
  counter++;
  
  //Checks if the puzzle is solved
  let solved = solved_matrix(number)

  if (solved){
    document.getElementById("solved").innerHTML = "Congratulations, you solved the puzzle!";
  }
  return (
    //Created button to perform the correct actions
    <React.Fragment>
      <ul className="gameboard" style={board_style} >
        {number.map((box, idx) => (<LogicTile width={width_tile} height={height_tile} idx={idx} key={box}  tile={box}  click={click}/>))}
      </ul>
      <section>
        <h1 id="solved"> </h1>
        <button onClick={next_level} >Next Level</button> 
        <button onClick={() => start()}>Shuffle</button>
      </section>
    </React.Fragment>
  );
} 

function App() {

  return (
    <div className="App">
      <h1>Sliding Puzzle</h1>
      <h2 id="heading1">Welcome</h2>
      <Board_Game />
      <hr />
      <h2>Instructions</h2>
      <ul id="unordered_list">
        <li>Goal: Order tiles from 1 to Maximum order to finish the puzzle.</li>
        <li>Click on a specific tile where there is space for the tile to move.</li>
        <li>After clicking on next level, click on shuffle twice to increase the difficulty of level.</li>
      </ul>
    </div>
  );
}
export default App;

