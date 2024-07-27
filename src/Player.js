
import React,{useEffect,useState} from 'react'
import { onSnapshot,getDoc,doc } from 'firebase/firestore'
import { db } from './firebase'
import CodeEditor from './CodeEditor'
import { Spinner } from '@chakra-ui/react'
const Player = ({RoomCode,PlayerIndex,endgame}) => {
  const [curr,Setcurr] = useState(0)
  const [Q,SetQ] = useState(0)
  useEffect(()=>{
    const unsub = onSnapshot(doc(db,"Games",RoomCode.toString()),async(snap)=>{
      console.log()
        if(snap.data().Current == -1){
          console.log("Hell0")
          endgame(RoomCode)
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
    <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
    <p style={{color:'white',margin:40,fontSize:200}}>
        <b>You're in!</b>
    </p>
    <p style={{color:'white',margin:20,fontSize:100}}>Your player index is: {PlayerIndex}</p>
    <p style={{color:'white',fontSize:25}}>Wait for the game to start</p>
    <Spinner color='red' thickness='4px' margin={50} size='xl'/>
    </div>
  )}
  else if(curr>0 && Q!=0){
    return(
    <div style={{display:'flex',flexDirection:'column'}}>
      <h1 style={{color:'white',fontWeight:'bold',margin:10,fontSize:60}}>{Q[0]}</h1>
      <p style={{color:'white',fontWeight:'bold',marginLeft:10}}>{Q[1]}</p>
      <p style={{color:'white',fontWeight:'bold',marginLeft:10}}>Case #1: <b>{Q[2][0]}</b> will return <b>{Q[3][0]}</b></p>
      <CodeEditor Qlist ={Q[2]} AList = {Q[3]} RoomCode = {RoomCode} PlayerIndex ={PlayerIndex}/>
    </div>)
  }
  }
export default Player;