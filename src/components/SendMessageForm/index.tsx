import React, { createRef, FormEvent, useRef, useState } from 'react'


import { api } from '../../services/api'
import { Header } from '../Header'
import styles from './styles.module.scss'





const UseFocus = () => {


  const htmlElRef = useRef<HTMLTextAreaElement>(null); // <HTMLDivElement> entre useRef e (null) é a declaração do tipo do conteúdo para o typescript

  const setFocus = () => { htmlElRef.current && htmlElRef.current.focus() } //descobrir porque dá esse "problem" **descoberto acima**

  return [htmlElRef, setFocus] as const // definir como constante pode ser chamada, se não definir não pode ser chamada.... ??!?!
}


export function SendMessageForm() {









  const [message, setMessage] = useState('')

  const [inputRef, setFocus] = UseFocus()






  async function handleMessage(event: FormEvent) {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    await api.post('messages', { message })
    setMessage('')
  }



  return (
    <div className={styles.sendMessageFormWrapper} >
      <Header />

      <form onSubmit={handleMessage} className={styles.sendMessageForm} action="">
        <label htmlFor="message">Mensagem</label>

        <textarea

          ref={inputRef}//{input1Ref}
          autoFocus
          name="message"
          id="message"
          placeholder="Qual sua expectativa para o evento"
          onChange={event => setMessage(event.target.value)}
          value={message}
        />
        <button
          onClick={() => setFocus()}//{() => setInput1Focus()}
          type="submit">Enviar mensagem
        </button>
      </form>
    </div>
  )



}