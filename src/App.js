import React, {useRef} from 'react'
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import Webcam from "react-webcam";
import { type } from '@testing-library/user-event/dist/type';
import { drawHand } from './utlities';

export default function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runHandpose = async () =>{
    const net = await handpose.load()
    console.log('HandPose model loaded.')
    // loop and detect hands
    setInterval(() =>{
      detect(net)
    },100)
  };

  const detect = async (net) =>{
    // Check data is available
    if(
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4

    )
    {
    // Get video properties
    const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;
    // Set video height and width
    webcamRef.current.video.width = videoWidth;
    webcamRef.current.video.height = videoHeight;
    // Set video height and width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    // Make Detection
    const hand = await net.estimateHands(video);
    console.log(hand);
    // Draw mesh
    const ctx = canvasRef.current.getContext("2d");
    drawHand(hand, ctx);
    }
  };
  runHandpose();

  return (
    <div>
      <Webcam ref={webcamRef}
      style={{
        position:"absolute",
        marginLeft:"auto",
        marginRight:"auto",
        left:0,
        right:0,
        textAlign:"center",
        zIndex:9,
        width:640,
        height:480
      }}
      />
      <canvas ref={canvasRef}
      style={{
        position:"absolute",
        marginLeft:"auto",
        marginRight:"auto",
        left:0,
        right:0,
        textAlign:"center",
        zIndex:9,
        width:640,
        height:480

      }}
      
        
      />
    </div>
  )
}
