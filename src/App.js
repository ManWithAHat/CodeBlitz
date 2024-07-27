import './index.css'
import { useEffect, useState } from 'react';
import { db,doc,collection,setDoc,onSnapshot,updateDoc,getDoc,addDoc } from './firebase';
import { async } from '@firebase/util';
import CodeEditor from './CodeEditor';
import Player from './Player';
import { Alert, AlertIcon, Button, Input } from '@chakra-ui/react';
import Host from './Host';
import { deleteDoc } from 'firebase/firestore';
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
  const [pdict,SetP] = useState([])
  const endgame = async(code)=>{
    var c = code*-1
    setCount(c)
    const gameref = doc(db,'Games',code.toString())
    const docSnap = await(getDoc(gameref))
    if(docSnap.exists()){
      var pdit =(docSnap.data().Players.map((name,index)=>{
        return {name:name,score:docSnap.data().Scores[index]}
      }))
      pdit.sort((a,b)=>b.score-a.score)
      SetP(pdit)
    }

  }
  
  if (count === 0){
  //Main, Sign in
  return (
    <div className="App" style={{alignItems:'center',justifyContent:'center',display:'flex',flexDirection:'column',height:'100vh',width:'100%'}}>
      <p style={{fontSize:150,margin:0,color:'white'}}>C0deBlitz</p>
        <div style={{alignItems:'center',backgroundColor:'rgba(243, 0, 40,0.75)',borderColor:'#F30028',justifyContent:'center',borderWidth:'5px',display:'flex',borderRadius:30,flexDirection:'column',width:'130vh',height:'70vh'}}>
          <p style={{fontSize:80,color:'white',marginBottom:'5vh'}}>Join as a </p>
          <Button colorScheme='red' fontSize={50} onClick={()=>{setCount(1)}} height={'10vh'} width={'50vh'}>Player</Button>
          <p style={{fontSize:80,color:'white',marginBottom:'5vh'}}>or as a</p>
          <Button colorScheme='red' fontSize={50} onClick={()=>{setCount(2)}} height={'10vh'} width={'50vh'}>Host</Button>
        </div>
    </div>
  );}


  //Student
  else if (count === 1){
    Role = 1
      return (
    
        <div className="App">
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'#8D99AE',height:'7vh'}}>
          <p style={{justifyContent:'end',color:'white',fontSize:40,marginLeft:'20px',flexGrow:1}}>C0deBlitz</p>
          </div>
          <header className="App-header" style={{justifyContent:'center',display:'flex',flexDirection:'column',alignItems:'center'}}>
            <Button variant='outline' margin={3} alignSelf='start' colorScheme='red' onClick={()=>{setCount(0)}}>Back</Button>
            <h1 style={{color:'white',fontSize:80}}><b>Player</b></h1>
            <Input marginBottom={10} width={300} backgroundColor='white' placeholder='Enter your name here' type="text" value={name} onChange={e =>{Setname(e.target.value); SetImage("https://api.dicebear.com/9.x/big-smile/svg?seed="+e.target.value)}}/>
            
            <img 
            src={image}
            style={{
              width:300,
              height:300,
              marginLeft:10
            }}
            />
            <p style={{color:'white'}}>This is your avatar!</p>
            <div>
            <Input backgroundColor='white' placeholder='Enter room code here' width={300} margin={10} type="number" value={RoomCode} onChange={e =>{setRoomCode(e.target.value)}}/>
            <Button onClick={async()=>{
              console.log(RoomCode)
              GameRef = doc(db,"Games",RoomCode.toString())
              if(name.length == 0){
                SetErrorMsg("Name cannot be empty")
              }
              else{
              const docSnap = await getDoc(GameRef)
              if(docSnap.exists()){
                SetQs(docSnap.data().Questions)
                if(docSnap.data().Current>0){
                  SetErrorMsg("Game is underway")
                }
                else{
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
                }}

                
              }else{
                SetErrorMsg("Code not found")
                console.log(ErrorMsg)
              }
            }}} colorScheme='green'>Join</Button>  
            {ErrorMsg?<Alert status='error' marginTop={3} width={600}>
              <AlertIcon/> {ErrorMsg}
            </Alert>:<p></p>}
            </div>
          </header>
        </div>
      );}
  else if(count === 5){
    console.log(PIndex)
    return(
      <div><div style={{display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'#8D99AE',height:'7vh'}}>
          <p style={{justifyContent:'end',color:'white',fontSize:40,marginLeft:'20px',flexGrow:1}}>C0deBlitz</p>
          <p style={{justifyContent:'end',color:'white',fontSize:40,paddingLeft:'200px',flexGrow:1}}> {name}</p>
          <p style={{justifyContent:'end',color:'white',fontSize:40,marginRight:'20px'}}>Room Code:{RoomCode}</p>
        </div>
    <Player RoomCode={RoomCode} PlayerIndex={PIndex} endgame={endgame}/></div>
    )

  }

  //host
  else if (count === 2 || count >= 99999){
    var Code= 0
    if (count === 2){
    Code=Math.floor(Math.random()*900000)+100000
    return (
      <div className="App">
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'#8D99AE',height:'7vh'}}>
          <p style={{justifyContent:'end',color:'white',fontSize:40,marginLeft:'20px',flexGrow:1}}>C0deBlitz</p>
          {RoomCode>0?<p style={{justifyContent:'end',color:'white',fontSize:40,marginRight:'20px'}}>Room Code:{RoomCode}</p>:<p></p>}
          </div>
        <header className="App-header" style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
        <Button onClick={()=>{setCount(0)}} alignSelf='start' margin={3} variant='outline' colorScheme='red' >Back</Button>
        <p style={{color:'white',fontSize:80}}><b>Host</b></p>
        <p style={{color:'white',fontSize:40}}>Pick the Questions and start a game!</p>
        <p style={{color:'white',fontSize:40,paddingRight:300,marginTop:80}}><b>Room Code:{Code}</b></p>
        <Alert status='warning' marginTop={10} width={600}>
          <AlertIcon/>
          The question selection feature is under development
        </Alert>
        <Button disabled={Qs.length === 0} onClick={async ()=>{
        try{GameRef = doc(db,"Games",Code.toString())}catch(e){console.warn(e)}
        console.log(GameRef);setDoc(GameRef,{Questions:Qs,Current:0,Players:[],Completion:[],Scores:[]});setCount(Code);SetCurrent(0)}
        } colorScheme='green' marginTop={100} height={200} fontSize={50} width={400}>Create</Button>
        </header>
      </div>
    );}
    else if (count >= 99999){
      return(
      <div>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'#8D99AE',height:'7vh'}}>
          <p style={{justifyContent:'end',color:'white',fontSize:40,marginLeft:'20px',flexGrow:1}}>C0deBlitz</p>
          {count>=99999?<p style={{justifyContent:'end',color:'white',fontSize:40,marginRight:'20px'}}>Room Code:{count}</p>:<p></p>}
          </div>
        <Host RoomCode={count} endgame = {endgame}/></div>
      )
    }}
    // leaderboard
    else if(count < -100){
      var Lcount = 0
      return(
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',minHeight:'100vh'}}>
          <h1 style={{color:'white',margin:20,fontSize:80,fontWeight:'bold'}}>leaderboard</h1>
          <div style={{flexGrow:1,width:'100%'}}>
          {
            pdict.map((dict)=>{
              var color = 'white'
              if (Lcount == 0){
                color='#F6E05E'
              }
              else if (Lcount == 1){
                color='#A0AEC0'
              }
              else if (Lcount == 2){
                color='#9C4221'
              }
              Lcount = Lcount+1
              return(
                <div style={{display:'flex',justifyContent:'center'}}>
                  <div style={{borderRadius:10,backgroundColor:color,display:'flex',width:'90%',alignItems:'center',height:'7vh',margin:10}}>
                <p style={{width:'10%',textAlign:'center',fontSize:40,fontWeight:'bold'}}>{Lcount}.</p>
                <p style={{width:'45%',textAlign:'center',fontSize:40,fontWeight:'bold'}}>{dict.name}</p>
                <p style={{width:'45%',textAlign:'center',fontSize:40,fontWeight:'bold'}}>{dict.score}</p>
                </div>
                </div>
              )
            })
          }
          </div>
          <Button marginTop={10} marginBottom={10} colorScheme='green' justifyContent='end' onClick={async ()=>{
            try{
            var k = count*-1
            const docsnap = await getDoc(doc(db,'Games',k.toString()))
            if(docsnap.exists()){
              deleteDoc(doc(db,'Games',k.toString()))
            }}
            catch(e){console.log('del')
            }
            setCount(0)
          }}>Back to main menu</Button>
        </div>
      )
    }
}

export default App;
