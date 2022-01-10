import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import styles from './Chat.module.scss';

function Chat(props) {

    const [connection, setConnection] = useState(null);
    const [user, setUser] = useState("");
    const [message, setMessage] = useState("");
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState(null);
    const [messagesReceived, setMessagesReceived] = useState(0);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl("/chatHub")
            .withAutomaticReconnect()
            .build();
        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start().then(() => {
                setConnected(true);
                console.log('connection started!');

                connection.on("ReceiveMessage", (user, message) => {
                    console.log('message received.');

                    setNewMessage({ user, message });

                });

            }).catch(err => {
                console.error(err);
            });
        }
    }, [connection]);

    useEffect(() => {
        if (newMessage) {

            console.log(newMessage.message);
            setMessages([...messages, newMessage]);
            setMessagesReceived(messagesReceived + 1);

        }
    }, [newMessage]);

    function SendMessage(event) {

        event.preventDefault();

        if (!user || !message)
            return;

        connection.invoke("SendMessage", user, message).catch(err => {
            console.log(err);
        });

        console.log('message sent!');
    }

    return (
        <div className={styles.Chat}>
            <h1>This is the chat page</h1>
            <div className="Input">
                <label>User</label>
                <input type="text" value={user} onChange={e => setUser(e.target.value)} />
                <label>Message:</label>
                <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
                <button type="button" onClick={SendMessage} disabled={!connected}>Send</button>  
            </div>
            <div className="MessageList">
                <ul>
                {
                    messages.map((msg, index) => 
                        <li key={`m${index}`}>{`${msg.user}: ${msg.message}`}</li>
                    )
                }
                </ul>
            </div>
            <div>
                Messages Received: { messagesReceived }
            </div>
        </div>
        );
}

export { Chat };