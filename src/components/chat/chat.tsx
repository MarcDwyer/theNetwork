import React, { Component } from 'react'
import './chat_styles.scss'

interface State {
    chat: Array<string>;
    message: string;
    ws: WebSocket;
    isAuth: boolean;
    open: boolean;
    name: string;
}
class Chat extends Component<{}, State> {
    state = {
        chat: [],
        message: '',
        open: false,
        isAuth: false,
        name: '',
        ws: new WebSocket(`ws://${document.location.hostname}:5000/sockets/`)
    }
    componentDidMount() {
        const { ws, name } = this.state
        ws.addEventListener('message', this.getMessages)

        const localName = localStorage.getItem("name")
        if (localName) {
            this.setState({ isAuth: true, name: localName })
        }
    }
    getMessages = (msg: any) => {
        const { chat } = this.state
        console.log(msg.data)
        this.setState({ chat: [...chat, JSON.parse(msg.data)] })
    }
    render() {
        const { chat, message, ws, open, name, isAuth } = this.state
        return (
            <div className={`top-chat ${open ? 'open' : ''}`}>
                <div className="nav-buttons"
                    onClick={() => this.setState({ open: !open })}
                >
                    {open && (<i className="fas fa-minus" />)}
                    <span>Chat</span>
                </div>
                {open && !isAuth && (
                    <div className="get-name">
                        <form
                            onSubmit={() => {
                                if (name.length <= 3) return
                                this.setState({ isAuth: true }, () => {
                                    localStorage.setItem("name", name)
                                })
                            }}
                        >
                            <label>
                                Enter a name
                            <input
                                    value={name}
                                    placeholder='Enter a name...'
                                    onChange={(e) => this.setState({ name: e.target.value })}
                                />
                            </label>
                        </form>
                    </div>
                )}
                {open && isAuth && (
                    <div className="second-chat">
                        <div className="messages">
                            {chat.length > 0 && chat.map(({ name, message }, index) => {
                                return (
                                    <span key={index}>{name}: {message}</span>
                                )
                            })}
                        </div>
                        <div className="send-message">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    this.setState({ message: '' })
                                    ws.send(JSON.stringify({ message: message, name: name }))
                                }}
                            >
                                <input type="text"
                                    value={message}
                                    onChange={(e) => this.setState({ message: e.target.value })}
                                    placeholder="Send a message..."
                                />
                            </form>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}


export default Chat