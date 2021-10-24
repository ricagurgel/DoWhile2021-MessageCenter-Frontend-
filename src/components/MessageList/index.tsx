import styles from "./styles.module.scss"
import logoImg from "../../assets/logo.svg"
import { api } from "../../services/api"
import { useEffect, useState } from "react"
import io from 'socket.io-client'

type Message = {
  id: string;
  text: string;
  user_relation: {
    name: string;
    avatar_url: string;
  }
}

const messagesQueue: Message[] = [];


const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: Message) => {
  messagesQueue.push(newMessage)
}
)


export function MessageList() {

  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages(prevState =>
          [
            messagesQueue[0],
            prevState[0],
            prevState[1],
          ].filter(Boolean)
        );
        messagesQueue.shift();

      }
    }, 4000);

  }, [])


  useEffect(() => {
    api.get<Message[]>('last').then(response => {
      setMessages(response.data)

    })
  }, []) // useEffect(() => { chamada.api },[ quando.chamar ])



  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile2021" />
      <ul className={styles.messageList}>
        {messages.map(message => {
          return (
            <li key={message.id} className={styles.message}>
              <p className={styles.messageContent}>{message.text}</p>
              <div className={styles.messageUser}>
                <div className={styles.userImage}>
                  <img src={message.user_relation.avatar_url} alt={message.user_relation.name} />
                </div>
                <span className={styles.userName}>{message.user_relation.name}</span>
              </div>
            </li>
          )
        })}


      </ul>

    </div>



  )
}