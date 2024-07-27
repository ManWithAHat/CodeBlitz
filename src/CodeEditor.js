import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { db,doc } from "./firebase";
import { getDoc, updateDoc } from "firebase/firestore";
import { Button, Spinner } from "@chakra-ui/react";

const CodeEditor = (lst) =>{
    const [EValue,SetEValue] = useState("def Answer(input):\n\t\n\treturn input")
    const [Score,setScore] = useState(0)
    const [Time,SetTime] = useState(30)
    const DocRef = doc(db,"Games",lst['RoomCode'].toString())

    const API = axios.create({
        baseURL:"https://emkc.org/api/v2/piston",
    });
    useEffect(()=>{
        if (Time<=0 && Score!=lst['Qlist'].length){
            const update = async()=>{
            var CurrentCompletion = []
            const docSnap = await getDoc(DocRef)
            if(docSnap.exists){
                CurrentCompletion = docSnap.data().Completion
                CurrentCompletion[lst['PlayerIndex']] = -5
                updateDoc(DocRef,{Completion:CurrentCompletion})
            }}
            update()
            return;
        }
        if (Time>0){
            const interval = setInterval(()=>{
                var seconds = Time-1
                SetTime(seconds)
            },1000)
            return ()=> clearInterval(interval)
        }
    },[Time])
    const runcode = async(language)=>{
        var score = 0
        setScore("Loading")
        console.log(EValue)
        if(EValue){
            console.log(lst['Qlist'])
            for (let i = 0; i < lst["Qlist"].length; i++) {
                const submission = "Input =\""+lst["Qlist"][i]+"\"\n"+EValue+"\nprint(Answer(Input))"
                const response = await API.post("/execute",{
                    language:'python',
                    version: '3.10.0',
                    files:[
                        {
                            content: submission
                        }, 
                    ],
                });
                if(response.data.run.output==lst["AList"][i].toString()+"\n"){
                    score = score+1
                }
                else{
                console.log(response.data.run.output)
                console.log(lst["AList"][i])}
            }
            setScore(score)
            var CurrentCompletion = []
            var CurrentScores = []
            const docSnap = await getDoc(DocRef)
            if(docSnap.exists){
                CurrentCompletion = docSnap.data().Completion
                CurrentScores = docSnap.data().Scores
                CurrentCompletion[lst['PlayerIndex']] = score
                updateDoc(DocRef,{Completion:CurrentCompletion})
            }
            console.log(CurrentCompletion)
            console.log(CurrentScores)
            if(score==lst['Qlist'].length){
                var S = Time *10
                console.log(S)
                CurrentScores[lst['PlayerIndex']] = S
                updateDoc(DocRef,{Scores:CurrentScores})
                console.log("Winner")
            }
        }
    }
    if(Score==lst['Qlist'].length){
        return(
            <div style={{display:'flex',margin:10,marginTop:50,borderRadius:20,flexDirection:'column',alignItems:'center',backgroundColor:'#38A169'}}>
                <h1 style={{color:'white',margin:20,fontSize:80,fontWeight:'bold'}}>
                    You Solved It!
                </h1>
                <p style={{color:'white',margin:20,fontSize:30}}>Waiting for others</p>
                <Spinner color='white' thickness='4px' margin={50} size='xl'/>
            </div>
        )
    }
    if (Time <= 0){
        return(
            <div style={{display:'flex',margin:10,marginTop:50,borderRadius:20,flexDirection:'column',alignItems:'center',backgroundColor:'#E53E3E'}}>
                <h1 style={{color:'white',margin:20,fontSize:80,fontWeight:'bold'}}>Time out</h1>
                <p style={{color:'white',margin:20,fontSize:30}}>Womp womp</p>
            </div>
        )
    }
    return(
        <div style={{alignSelf:'center',justifyContent:'center',marginTop:30,borderRadius:20,backgroundColor:'#8D99AE',width:'80%',display:'flex',flexDirection:'column'}}>
        <div style={{paddingLeft:10,height:'5vh',paddingRight:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
            {Score=='Loading'? <Spinner thickness={5} color='white' />:<p style={{flexGrow:0.5,fontSize:30,fontWeight:'bold',color:'white'}}>Cases Solved:{Score}/10</p>}
            <p style={{textAlign:'center',flexGrow:1,color:'white',fontSize:30}}><b>Time:{Time}</b></p>
            <div style={{display:'flex',flexGrow:1,justifyContent:'end'}}>
            <Button  borderRadius={15} colorScheme='green' marginRight={-1} onClick={()=>{runcode()}}>Submit</Button>
            </div>
            </div>
            <Editor
            height="90vh"
            theme="vs-dark"
            defaultLanguage="python"
            defaultValue={EValue}
            language="python"
            
            onChange = {(e)=>{SetEValue(e)
            }}
            />
        </div>
    )
}

export default CodeEditor;