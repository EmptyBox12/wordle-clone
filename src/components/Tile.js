import React from 'react'

export default function Tile({value, active, yellow, green, passive}) {
  return (
    <div className='tile' 
    style={green ? {border:"3px solid rgb(1 144 1)"} : active ? {border:"3px solid white"} :
    yellow ?  {border:"3px solid #B8860B"} :  passive ?
    {border:"3px solid #666565"}
    :
     {border:"3px solid #999494"}}>{value.toLocaleUpperCase()}</div>
  )
}
