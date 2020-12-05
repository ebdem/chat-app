import React,{useState, useEffect} from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";

let socket;


const Chat = ({location}) => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const ENDPOINT = 'https://react-chatapp-ebdem.herokuapp.com/'


    useEffect(() => {
       const {name , room} = queryString.parse(location.search);

       socket = io(ENDPOINT);

       setName(name);
       setRoom(room);
       //console.log(name);
       //console.log(room);

       //console.log(ENDPOINT)

      // console.log(socket);

        //location search URL without https cause queryString
        //console.log("location.search = ",location.search);
        //it returns object with params
        //console.log("data", data);
        socket.emit('join', { name, room }, () => {

        });

        return () => {
            socket.emit('disconnect');

            socket.off();
        }
    }, [ENDPOINT, location.search]);


    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, [messages]);

    const sendMessage = (event) => {

        event.preventDefault();

        if (message) {
          socket.emit('sendMessage', message, () => setMessage('') )
        }
    }

    console.log(message, messages);

    return(
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name}/>
                <Input sendMessage={sendMessage} message={message} setMessage={setMessage}/>
            </div>
            <TextContainer users={users} />
        </div>
    )
}

export default Chat;
