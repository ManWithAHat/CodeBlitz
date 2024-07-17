
import React,{useEffect,useState} from 'react'
import { onSnapshot,getDoc,doc } from 'firebase/firestore'
import { db } from './firebase'
import CodeEditor from './CodeEditor'
const Player = ({RoomCode,PlayerIndex,endgame}) => {
  const [curr,Setcurr] = useState(0)
  const [Q,SetQ] = useState(0)
  useEffect(()=>{
    const unsub = onSnapshot(doc(db,"Games",RoomCode.toString()),async(snap)=>{
      console.log()
        if(snap.data().Current == -1){
          console.log("Hell0")
          endgame()
        }
        Setcurr(snap.data().Current)
        if(snap.data().Current>0){
        var Qi = snap.data().Questions[snap.data().Current-1]
        const Qd = await getDoc(doc(db,"Questions",Qi.toString()))
        if (Qd.exists()){
          SetQ([Qd.data().Title,Qd.data().Desc,Qd.data().Questions,Qd.data().Ans])
        }
      }
    })
    return(()=>{
        unsub()
    })
},[])
  
  if(curr === 0){return (
    <div>
    <p>
        You're in the waiting Room
    </p>
    <p>{PlayerIndex}</p>
    </div>
  )}
  else if(curr>0 && Q!=0){
    console.log(curr)
    return(<div>
      <h1>{Q[0]}</h1>
      <p>{Q[1]}</p>
      <p>Case #1: <b>{Q[2][0]}</b> will return <b>{Q[3][0]}</b></p>
      <CodeEditor Qlist ={Q[2]} AList = {Q[3]} RoomCode = {RoomCode} PlayerIndex ={PlayerIndex}/>
    </div>)
  }
  }
export default Player;