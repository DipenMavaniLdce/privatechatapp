import React,{useState,useEffect} from 'react'
import './Chat.css'
import io from 'socket.io-client';
import querySting from 'query-string'
import Infobar from '../Infobar/Infobar'
import Input from '../Input/Input';
import Messages from '../Messages/Messages'
import TextContainer from '../TextContainer/TextContainer'
let socket;
const Chat =({location})=>{
    const [name,setName]=useState('');
    const [room,setRoom]=useState('');
    const [users, setUsers] = useState('');
    const [message,setMessage]=useState('');
    const [messages,setMessages]=useState([]);
    const ENDPOINT='https://react-chat-app-af.herokuapp.com/'
    useEffect(()=>{
       
        const {name,room}=querySting.parse(location.search);
        socket=io(ENDPOINT);
        setName(name);
        setRoom(room);
        socket.emit('join',{name,room},()=>{

        });
        return()=>{
            socket.emit('disconnect');
            socket.off();
        }
    },[ENDPOINT,location.search])

    useEffect(() => {

        socket.on('message', (message)=>{
            setMessages([...messages,message])
        })
        socket.on("roomData", ({ users }) => {
            setUsers([users]);
          });
    },[messages,users])

    
  
    const sendMessage = (event)=>{
        event.preventDefault();
        if(message){
            socket.emit('sendMessage',message, () => setMessage('')) 
        }
    }
    console.log(message,messages);
    return(

        <div className='outerContainer'>
              <div className='container'>
                
                
                      <Infobar room = {room} />
                      
                      <Messages messages={messages} name={name}/>
                      <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
                  
                
                
             </div>  
             <TextContainer users={users}/>
        </div>
    );
}
export default Chat