import { Button, CircularProgress } from '@chakra-ui/react'
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
          if(snap.data()!=null){
            console.log(snap.data().Players)
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
            }}}

      })
      return(()=>{
          unsub()
      })
  },[])
  const nextQ =async()=>{
    if(curr >= totalindex){
      updateDoc(doc(db,"Games",RoomCode.toString()),{
        "Current":-1
      })
      endgame(RoomCode)
    }
    else{
      updateDoc(doc(db,"Games",RoomCode.toString()),{
        "Current":curr+1
      })
    }
  }
  if(curr === 0){
  return (
    <div style={{display:'flex',alignItems:'center',flexDirection:'column',justifyContent:'center'}}>
    <p style={{color:'white',fontSize:40,marginTop:20,paddingRight:250}}>Room code:</p>
    <p style={{color:'white',fontSize:150}}>
        <b>{RoomCode}</b>
    </p>
    <p style={{color:'white',fontSize:40,marginTop:20}}>Enter this code in the Player screen</p>
    <div style={{alignItems:'center',backgroundColor:'rgba(243, 0, 40,0.75)',borderColor:'#F30028',borderWidth:'5px',display:'flex',borderRadius:30,flexDirection:'column',width:'130vh',minHeigh:'53vh'}}>
      <div style={{marginTop:20,flexGrow:1,display:'flex',flexWrap:'wrap',width:'98%',justifyContent:'center'}}>
      {
        PlayerGroup.map((player)=>{
            return(
            <div style={{margin:20,borderRadius:15,display:'flex',justifyContent:'center',backgroundColor:'#E16060',height:'8vh',minWidth:'25vh'}}>
              <img
              src={"https://api.dicebear.com/9.x/big-smile/svg?seed="+player[0]}
              style={{flexGrow:1,}}
              />
            <p style={{flexGrow:1,alignSelf:'center',fontSize:30,color:'white'}}><b>{player[0]}</b></p>
            </div>)
        })
      }
      </div>
    <Button height='10vh' width='30vh' colorScheme='green' fontSize={40} margin={10} justifySelf='end' onClick={()=>updateDoc(doc(db,"Games",RoomCode.toString()),{Current:curr+1})}>Next</Button>
    </div>
    </div>
  )}
  else if(curr>0 && Q!=0){
    return(
    <div>
    <div style={{alignItems:'center',flexDirection:'row',display:'flex'}}>
      
      <h1 style={{color:'white',flexGrow:1,fontWeight:'bold',margin:10,fontSize:60}}>{Q[0]}</h1>
      <Button  marginRight={5} colorScheme='green' onClick={()=>{nextQ()}}>Next</Button>
      </div>
      <p style={{color:'white',fontWeight:'bold',marginLeft:10}}>{Q[1]}</p>
      <p style={{color:'white',fontWeight:'bold',marginLeft:10,marginBottom:20}}>Case #1: <b>{Q[2][0]}</b> will return <b>{Q[3][0]}</b></p>
      {
          PlayerGroup.map((player)=>{
            if(player[2]==10)
              {return(
                <div style={{display:'flex',backgroundColor:'#48BB78',borderRadius:10,margin:10,alignItems:'center'}}>
                <CircularProgress thickness={12} marginStart={3} value={player[2]*10} color='blue'/>
                <img style={{height:50,width:50}}src={'https://api.dicebear.com/9.x/big-smile/svg?seed='+player[0]}/>
                <p style={{fontWeight:'bold',width:'40%',fontSize:30}}>{player[0]}</p>
                <p style={{alignSelf:'center',width:'20%',textAlign:'center',fontWeight:'bold',fontSize:30}}>Score:{player[1]}</p>
                <p style={{textAlign:'end',width:'40%',marginRight:20,fontWeight:'bold',fontSize:30}}>
                  {player[2]>=0?<p>{player[2]}/10</p>:<p>Timeout</p>}
                  </p>
                </div>
              )}
            else if(player[2]==-5)
              {return(
                <div style={{display:'flex',backgroundColor:'#E53E3E',borderRadius:10,margin:10,alignItems:'center'}}>
                  <img style={{height:50,width:50}}src={'https://api.dicebear.com/9.x/big-smile/svg?seed='+player[0]}/>
                  <p style={{fontWeight:'bold',width:'40%',fontSize:30}}>{player[0]}</p>
                  <p style={{alignSelf:'center',width:'20%',textAlign:'center',fontWeight:'bold',fontSize:30}}>Score:{player[1]}</p>
                  <p style={{textAlign:'end',width:'40%',marginRight:20,fontWeight:'bold',fontSize:30}}>
                  {player[2]>=0?<p>{player[2]}/10</p>:<p>Timeout</p>}
                  </p>
                </div>
              )}
            else
              {return(
                  <div style={{display:'flex',backgroundColor:'#ECC94B',borderRadius:10,margin:10,alignItems:'center'}}>
                      <CircularProgress thickness={12} marginStart={3} value={player[2]*10} color='blue'/>
                      <img style={{height:50,width:50}}src={'https://api.dicebear.com/9.x/big-smile/svg?seed='+player[0]}/>
                      <p style={{fontWeight:'bold',width:'40%',fontSize:30}}>{player[0]}</p>
                      <p style={{alignSelf:'center',width:'20%',textAlign:'center',fontWeight:'bold',fontSize:30}}>Score:{player[1]}</p>
                      <p style={{textAlign:'end',width:'40%',marginRight:20,fontWeight:'bold',fontSize:30}}>
                        {player[2]>=0?<p>{player[2]}/10</p>:<p>Timeout</p>}
                        </p>
                  </div>
              )}
          })
      }

    </div>)
  }
  }
export default Host;