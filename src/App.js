import './index.css'
import { useEffect, useState } from 'react';
import { db,doc,collection,setDoc,onSnapshot,updateDoc,getDoc,addDoc } from './firebase';
import { async } from '@firebase/util';
import CodeEditor from './CodeEditor';
import Player from './Player';
import Host from './Host';
function App() {
  const [count,setCount] = useState(0)
  const [name,Setname] = useState('')
  
  const [RoomCode,setRoomCode] = useState('')
  const [ErrorMsg,SetErrorMsg] = useState('')
  var Role = 0
  const [Current,SetCurrent] = useState()
  const [Qs,SetQs] = useState(['phxvHerN5Qrqy9NWXbP2'])
  const [image,SetImage] = useState("https://api.dicebear.com/9.x/big-smile/svg?seed=Jhon")
  var GameRef
  const [PIndex,SetPIndex] = useState()
  const endgame = ()=>{
    setCount(6)
  }


  if (count === 0){
  //Main, Sign in
  return (
    <div className="App">
      <header className="App-header">
        <p>Please select if you are a host or a player</p>
        <button onClick={()=>{setCount(1)}}>Player</button>
        <button onClick={()=>{setCount(2)}} style={{backgroundColor:'whitesmoke'}}>Host</button>
      </header>
    </div>
  );}


  //Student
  else if (count === 1){
    Role = 1
      return (
    
        <div className="App">
          <header className="App-header">
            <p>Player</p>
            <button onClick={()=>{setCount(0)}} style={{backgroundColor:'whitesmoke'}}>Back</button>
            <input maxLength={10} type="text" value={name} onChange={e =>{Setname(e.target.value); SetImage("https://api.dicebear.com/9.x/big-smile/svg?seed="+e.target.value)}}/>
            <p>{name}</p>
            <p>avatar:</p>
            <img 
            src={image}
            />
            <input type="number" value={RoomCode} onChange={e =>{setRoomCode(e.target.value)}}/>
            <button onClick={async()=>{
              console.log(RoomCode)
              GameRef = doc(db,"Games",RoomCode.toString())
              const docSnap = await getDoc(GameRef)
              if(docSnap.exists()){
                SetQs(docSnap.data().Questions)
                
                var Scores = []
                var Players = []
                var completion = []
                Players = docSnap.data().Players
                console.log(Players)
                console.log(name)
                if(Players.includes(name)){
                  SetErrorMsg("Name is already taken")
                }else{
                  SetPIndex(Players.length)
                  Players.push(name)
                  updateDoc(GameRef,{Players:Players,Scores:new Array(Players.length).fill(0),Completion:new Array(Players.length).fill(0)})
                  setCount(5)
                }

                
              }else{
                SetErrorMsg("Code not found")
                console.log(ErrorMsg)
              }
            }} style={{backgroundColor:'grey'}}>Join</button>  
            <p>{ErrorMsg}</p>
          </header>
        </div>
      );}
  else if(count === 5){
    console.log(PIndex)
    return(
    <Player RoomCode={RoomCode} PlayerIndex={PIndex} endgame={endgame}/>
    )

  }

  //host
  else if (count === 2 || count >= 99999){
    var Code= 0
    if (count === 2){
    Code=Math.floor(Math.random()*900000)+100000
    return (
      <div className="App">
        <header className="App-header">
        <p>Host</p>
        <p>{Code}</p>
        <button onClick={()=>{setCount(0)}} style={{backgroundColor:'whitesmoke'}}>Back</button>
        <button disabled={Qs.length === 0} onClick={async ()=>{
        try{GameRef = doc(db,"Games",Code.toString())}catch(e){console.warn(e)}
        console.log(GameRef);setDoc(GameRef,{Questions:Qs,Current:0,Players:[],Completion:[],Scores:[]});setCount(Code);SetCurrent(0)}
        } style={{backgroundColor:'whitesmoke'}}>Create</button>
        </header>
      </div>
    );}
    else if (count >= 99999){
      return(
      <Host RoomCode={count} endgame = {endgame}/>
      )
    }}
    // leaderboard
    else if(count ==6){
      return(
        <div>
          <h1>leaderboard here, game ended</h1>
          <button onClick={()=>setCount(0)}>Back to main menu</button>
        </div>
      )
    }
}

export default App;
