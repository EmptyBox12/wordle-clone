import React, { useEffect, useState } from 'react';
import Tile from "./components/Tile";
import './App.css';
import Key from './components/Key';
import Modal from './components/Modal';

function App() {
  const [column, setColumn] = useState(0);
  const [row, setRow] = useState(0);
  const [board, setBoard] = useState([["","","","",""], ["","","","",""], ["","","","",""], ["","","","",""], ["","","","",""],["","","","",""]]);
  const [yellows, setYellows] = useState([]);
  const [greens, setGreens] = useState([]);
  const [count, setCount] = useState({});
  const [shake, setShake] = useState(false);
  const [clicked, setClicked] = useState();
  const [gameOver, setGameOver] = useState({over:false, win:false});
  const [copied, setCopied] = useState(false)
  const [answer, setAnswer] = useState("");
  const alphabet = ["A","B","C","D","E","F","G","H","I","İ","Ö","J","K","L","Ç","M","N","O","P","Q","R","Ü","S","T","U","V","Y","Z"];

  useEffect(() => {
    let answers = ["KÖPEK", "ABONE", "ÇİÇEK", "BİLEK", "FEYAZ", "ÇİÇEK", "BEYAZ", "KİRAZ", "BAHAR", "PAMUK", "ACEMİ", "ALEVİ", "BESİN", "KEMAN"]
    let newAnswer = answers[Math.floor(Math.random()*answers.length)];
    let newCount = {};
    newAnswer.split("").forEach(item => {
      if(newCount[item.toLocaleLowerCase()]){
        newCount[item.toLocaleLowerCase()] +=1;
      } else {
        newCount[item.toLocaleLowerCase()] = 1
      }
    })
    setCount(newCount);
    setAnswer(newAnswer);
  }, [])

  function copy() {
    let copyArray = [["","","","",""], ["","","","",""], ["","","","",""], ["","","","",""], ["","","","",""],["","","","",""]];
    greens.forEach(element => {
      copyArray[element[0]][element[1]] = "🟩";
    });
    yellows.forEach(element => {
      copyArray[element[0]][element[1]] = "🟨";
    })
    copyArray.forEach((element, x) => {
      element.forEach((item, y) => {
        if(item == ""){
          copyArray[x][y] = "⬜";
        }
      })
    })
    copyArray.forEach((item, index) => {
      copyArray[index] = copyArray[index].join("");
    })

    navigator.clipboard.writeText(copyArray.join("\n")).then(() => {
      setCopied(true);
    })
    setTimeout(() => {
      setCopied(false);
    }, 3000)
  }

  function handleKeyDown(e) {
    setClicked(e.key.toLocaleLowerCase());
    setTimeout(() => {setClicked(false)}, 200);
    if(gameOver.over) return;
    if(e.key === "Backspace"){
      let newBoard = [...board];
      if(column != 0){
        if(column === 4){
          newBoard[row][column] = "";
        } 
          newBoard[row][column-1] = "";
          setColumn(column-1);
        
      }
    }
    if(e.key === "Enter" && column === 4 && board[row][column] !== ""){
      if(board[row].join("").toLocaleLowerCase() === answer.toLocaleLowerCase()){
        let newGreens = [...greens];
        for(let i =0; i<board[row].length; i++){
            newGreens.push([row, i]);
        }
        setGreens(newGreens);
        setGameOver({over:true, win:true});
        return;
      } else {
        let newYellows = [...yellows];
        let newGreens = [...greens];
        let inputCount = {};
        for(let i =0; i<board[row].length; i++){
          for(let j=0; j<answer.length; j++){
            if(board[row][i].toLocaleLowerCase() === answer[j].toLocaleLowerCase() && i === j){
              newGreens.push([row, i]);
              if(inputCount[board[row][i].toLocaleLowerCase()]){
                inputCount[board[row][i].toLocaleLowerCase()] +=1;
              } else {
                inputCount[board[row][i].toLocaleLowerCase()] =1;
              }
            } 
          }
        }
        for(let i =0; i<board[row].length; i++){
          for(let j=0; j<answer.length; j++){
            if(board[row][i].toLocaleLowerCase() === answer[j].toLocaleLowerCase() && i !== j){
              if(newYellows.some(item => item[0] === row && item[1] === i) || newGreens.some(item => item[0] === row && item[1] === i)){
                continue;
              }
              if(count[board[row][i].toLocaleLowerCase()] && inputCount[board[row][i].toLocaleLowerCase()] && count[board[row][i].toLocaleLowerCase()] === inputCount[board[row][i].toLocaleLowerCase()]){
                continue;
              }
              newYellows.push([row, i]);
              if(inputCount[board[row][i].toLocaleLowerCase()]){
                inputCount[board[row][i].toLocaleLowerCase()] +=1;
              } else {
                inputCount[board[row][i].toLocaleLowerCase()] =1;
              }
            }
          }
        }
        setGreens(newGreens);
        setYellows(newYellows);
        setRow(row + 1);
        setColumn(0);
      
        if(row + 1 === 6){
          setGameOver({over:true, win:false});
          return;
        }
      }
    } else if(e.key === "Enter" && (column !== 4 || board[row][column] === "")) {
      setShake(true);
      setTimeout(() => {setShake(false)}, 200);
    }
    if(!alphabet.some(element => element.toLocaleLowerCase() === e.key.toLocaleLowerCase())) return;
    if(column < 5){
      let newBoard = [...board];
      if(column === 4){
        setColumn(4);
        newBoard[row][4] = e.key.toLocaleUpperCase();
        setBoard(newBoard);
      } else {
        newBoard[row][column] = e.key;
        setColumn(column + 1);

      }
    } 
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [column, row, yellows, greens, count])


  return (
    <div className="App">
      <div className={!gameOver.over ? "" : "over"}>
      <div className='title'>WORDLE</div>
      {board.map((element, x) => {
        return <div className={shake ? "row shaking" : "row"}>{element.map((item, y) => {
          if(greens.some(item => item[0] === x && item[1] === y)){
            return <Tile value = {item} active={false} green={true}/>
          } else if(x === row && y === column){
              return <Tile value = {item} active={true}/>
            } else if(yellows.some(item => item[0] === x && item[1] === y)){
              return <Tile value = {item} active={false} yellow={true} />
            } else if(row > x){
              return <Tile value = {item} passive={true} />
            }
            return <Tile value = {item} active={false} />
          }
        )}</div>
      })}
      <div className='keyboard'>
        {alphabet.map(element => {
          return <Key clicked={clicked === element.toLocaleLowerCase()} handleKeyDown={handleKeyDown} value={element} />
        })}
        <div  onClick={() => {handleKeyDown({key:"Backspace"})}} className={clicked === "backspace" ? "key clicked" : "key"}><svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
          <path fill="#e3e3e3" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path>
        </svg></div>
        <div className={clicked === "enter" ? "key clicked" : "key"} onClick={() => {handleKeyDown({key:"Enter"})}} style={{width:"100px"}}>Enter</div>
      </div>
      </div>
      <Modal answer={answer} copied={copied} open={gameOver.over} win={gameOver.win} copy={copy} />
    </div>
  );
}

export default App;
