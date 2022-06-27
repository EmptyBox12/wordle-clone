import React from 'react'

export default function Key({value, handleKeyDown, clicked}) {
  let keyObject = {key:value}
  return (
    <div onClick={() => {handleKeyDown(keyObject)}} className={clicked ? "key clicked" : "key"}>{value}</div>
  )
}
