import './index.css'
import { useEffect, useState } from 'react';
import { db,doc,collection,setDoc,onSnapshot,updateDoc,getDoc,addDoc } from './firebase';
import { async } from '@firebase/util';
import CodeEditor from './CodeEditor';
function App() {
  const [count,setCount] = useState(0)
  const [name,Setname] = useState('')
  const [PlayerGroup,SetPlayerGroup] = useState([])
  const [RoomCode,setRoomCode] = useState('')
  const [ErrorMsg,SetErrorMsg] = useState('')
  var Role = 0
  const [Current,SetCurrent] = useState()
  const [Qs,SetQs] = useState(['phxvHerN5Qrqy9NWXbP2'])
  const [image,SetImage] = useState("https://api.dicebear.com/9.x/big-smile/svg?seed=Jhon")
  var GameRef
  var PlayerIndex = 0


  useEffect(()=>{
    console.log(1)
    if(Role!=0 && GameRef){
      const unsub = onSnapshot(
        doc(GameRef),(snap)=>{
          if(Role ===1){
            if (Current != snap.data().Current){
            SetCurrent(snap.data().Current)}
          }
          else if(Role === 2){
            var P = []
            for(let i = 0;i < snap.data().Players.length;i++){
              P.push([snap.data().Players[i],snap.data().Scores[i],snap.data().Completion[i]])
            }
            console.log(P)
            if (PlayerGroup != P){
            SetPlayerGroup(P)}
          }
        }
      )
      return ()=>{
        unsub()
      }
    }
  },[Role])


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
                setCount(5)
                var Scores = []
                var Players = []
                var completion = []
                Players = docSnap.data().Players
                if(Players.includes(name)){
                  SetErrorMsg("Name is already taken")
                }else{
                  PlayerIndex = Players.length
                  Players.push(name)
                }
                updateDoc(GameRef,{Players:Players,Scores:new Array(Players.length).fill(0),Completion:new Array(Players.length).fill(0)})
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
    var GameRef = doc(db,"Games",RoomCode.toString())
    return(
      <div>
        <h1>You're in the waiting room</h1>
        <p>{Qs}</p>
      </div>
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
      Role = 2
      console.log(Role)
      if(Current ===0){
      return(
      <div className="App"> 
        <header>
        <h1>{count}</h1>
          <ul>
            {PlayerGroup.map(player =>(
              <div style={{display:'flex'}}>
                <h2>{player[0]}</h2>
                <img
                style={{width:100,height:100}}
                src = {"https://api.dicebear.com/9.x/big-smile/svg?seed="+player[0]}
                />
              </div>
            ))}
          </ul>
        <button onClick={()=>{updateDoc(doc(db,"Games",count.toString()),{Current:1});SetCurrent(1)}}>Start</button>
        </header>
      </div>)}
      else if(Current === -1){
        return(
          <p>Leaderboard</p>
        )
      }
      else{
        var Desc
        var Title
        const GetQ =async() =>{
        const Snap = await getDoc(doc(db,"Questions",Qs[Current]))
        console.log(Snap)
        Desc = Snap.data().Desc
        Title = Snap.data().Title
        }
        GetQ()
        return(
        <div className="App"> 
          <header>
            <div>
              <h1>{Title}</h1>
              <p>{Desc}</p>
              {PlayerGroup.map(player=>{
                <div>
                <p>{player[0]}</p>
                <p>{player[3]}</p>
                </div>
              })}
              <button onClick={
              ()=>{
                if(Current===Qs.length){
                  updateDoc(doc(db,"Games",count.toString()),{Current:-1})
                  SetCurrent(-1)
                }
                else{
                  SetCurrent(Current+1)
                  updateDoc(doc(db,"Games",count.toString()),{Current:Current})
                }
              }
              }>Next</button>
            </div>
          </header>
        </div>)}
    }}
}

export default App;
