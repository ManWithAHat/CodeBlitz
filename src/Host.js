import { onSnapshot } from 'firebase/firestore'
import React,{useState,useEffect} from 'react'
import { db,doc,getDoc,updateDoc } from './firebase'
import { TextEditor } from './TextEditor'

const Host = ({RoomCode,endgame}) => {

  const [PlayerGroup,SetPlayerGroup] = useState([])
  const [Q,SetQ] = useState(0)
  const [curr,Setcurr] = useState(0)
  const [totalindex,Settotalindex] = useState(0)
  useEffect(()=>{
      const unsub = onSnapshot(doc(db,"Games",RoomCode.toString()),async(snap)=>{
          var p =[]
          console.log(snap.data())
          for(let i = 0; i<snap.data().Players.length;i++){
              console.log(i)
              p.push([snap.data().Players[i],snap.data().Scores[i],snap.data().Completion[i]])
          }
          SetPlayerGroup(p)
          Setcurr(snap.data().Current)
          var y = (snap.data().Questions.length)
          Settotalindex(y)
          if(snap.data().Current>0){
            console.log(snap.data().Current)
            console.log(totalindex)
            var Qi = snap.data().Questions[snap.data().Current-1]
            const Qd = await getDoc(doc(db,"Questions",Qi.toString()))
            if (Qd.exists()){
              SetQ([Qd.data().Title,Qd.data().Desc,Qd.data().Questions,Qd.data().Ans])
            }}

      })
      return(()=>{
          unsub()
      })
  },[])
  const nextQ =async()=>{
    console.log('Hello')
    console.log(curr)
    console.log(totalindex)
    if(curr >= totalindex){
      console.log("Hi")
      updateDoc(doc(db,"Games",RoomCode.toString()),{
        "Current":-1
      })
      endgame()
    }
    else{
      updateDoc(doc(db,"Games",RoomCode.toString()),{
        "Current":curr+1
      })
    }
  }
  if(curr === 0){
  return (
    <div>
    <p>
        {RoomCode}
    </p>
    {
        PlayerGroup.map((player)=>{
            return(
            <div>
            <p>{player[0]}</p>
            </div>)
        })
    }
    <button onClick={()=>updateDoc(doc(db,"Games",RoomCode.toString()),{Current:curr+1})}>Next</button>
    </div>
  )}
  else if(curr>0 && Q!=0){
    return(<div>
      <h1>{Q[0]}</h1>
      <p>{Q[1]}</p>
      <p>Case #1: <b>{Q[2][0]}</b> will return <b>{Q[3][0]}</b></p>
      {
          PlayerGroup.map((player)=>{
              return(
                  <div>
                      <p>{player[0]}</p>
                      <p>{player[1]}</p>
                      <p>{player[2]}/10</p>
                  </div>
              )
          })
      }
      <TextEditor/>
      <button onClick={()=>{nextQ()}}>Next</button>
    </div>)
  }
  }
export default Host;