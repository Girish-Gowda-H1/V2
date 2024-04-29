import React from 'react'
import "./services.less"
const ActionHeader = ({text, style}) => {
  return (
    <div className="header" style={style} >
            <p>{text}</p>
          </div>
  )
}

export default ActionHeader