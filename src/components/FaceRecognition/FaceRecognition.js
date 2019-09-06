import React from 'react'
import './FaceRecognition.css'


const FaceRecognition =({imageUrl,box})=>{
    return(
        <div className="center ma">
            <div className="absolute mt2">
              <img id="inputimage" alt="img" src={imageUrl}  width="600px" height="auto" />
              <div className='bounding-box' style={{ bottom: box.bottomRow, left:box.leftCol, right: box.rightCol,top: box.topRow}}></div>
            </div>
           
        </div>
    )
}
export default FaceRecognition