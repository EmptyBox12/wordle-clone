import React from 'react'
import Tile from './Tile'

export default function Modal({open, win, copy, copied, answer}) {
  return (
   open && 
    <div className='modal'>
      <div className='win' style={win ? {color:"green"} : {color:"#db0707"}}>{win ? "You Won!" : "You Lost!"}</div>
      <div className='row' style={{marginTop:"30px"}}>
      {answer.split("").map(element => {
        return <Tile passive={!win} green={win} value={element} />
      })}
      </div>
      <div style={{display:"flex"}}>
        <div className='playButton' onClick={() => window.location.reload()}>Play Again</div>
        <div className='playButton' style={{marginLeft:"20px"}} onClick={copy}>Copy</div>
      </div>
     <div className={copied ? "copyText copy" : "copyText"}>Copied to clipboard</div>
    </div>
  )
}
