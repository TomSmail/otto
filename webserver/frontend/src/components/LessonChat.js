import React, {useCallback, useState, useRef, useEffect} from "react";
import { useForm } from "react-hook-form";
import './LessonChat.css'

const initialMessages = [{message: 'User Message Example', sender: 'user'},
                         {message: 'AI Message example', sender: 'assistant'}]

export default function LessonChat() {
    // initialMessages should be a list of objects, each containing the sender 
    // of the message and the message itself
    
    const [submitting, setSubmitting] = useState(false)
    const [prevMessages, setPrevMessages] = useState(initialMessages)

    const addMessages = (messageObjects) => {
        setPrevMessages(
            [...prevMessages, ...messageObjects]
        )
    }

    const onSubmit =  async data => { 

        setSubmitting(true)

        const newMessageObject = {
            sender: 'user',
            message: data.userInput
        }
        
        const resp = await sendUserInput(data)

        console.log(resp)
        console.log(resp.data.choices[0].message.content)

        const newResponseObject = {
            sender: resp.data.choices[0].message.role,
            message: resp.data.choices[0].message.content
        }

        const newMessages = [newMessageObject, newResponseObject]

        addMessages(newMessages)

        setSubmitting(false)
    }

    const {register, handleSubmit} = useForm({
        defaultValues: {
            userInput: ''
        }
    })

    // Scroll to bottom on message update
    const anchor = useRef(null);

    useEffect(() => {
        if (prevMessages.length) {
          anchor.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          })
        }
      }, [prevMessages.length])
    
    return (
            
            <div className={'form-box'}>
                <div className="message-history">
                    {prevMessages.map((message, index) => {
                        const sender = message.sender
                        const text = message.message
                        if (sender === 'user') {
                            return (
                            <div className="user-message" key={index}>
                                {text}
                            </div>
                                )  
                        } else {
                            return (
                            <div className="ai-message" key={index}>
                                {text}
                            </div>
                                )
                        }
                    }
                    )
                    }
                    {submitting && <div className="dot-flashing"></div>}
                    <div ref={anchor} />
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" placeholder="Enter Your Question" {...register("userInput")}/>
                    <input type="submit"/>
                </form>
            </div>
    );

    function sendUserInput(data) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({userInput: data.userInput})
        }
        return fetch('http://127.0.0.1:5000/lesson', requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            return data
        })
    }
}