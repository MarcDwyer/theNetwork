import React, { Component } from 'react'
import './chat_styles.scss'
interface User {
    id: string;
    name: string;
    type: string;
}
interface State {
    chat: Array<string>;
    message: string;
    ws: WebSocket;
    isAuth: boolean;
    open: boolean;
    users: User[] | null;
    name: string;
    error: string | null;
}
class Chat extends Component<{}, State> {
    private chatRef: React.RefObject<HTMLInputElement> | null;

    constructor(props: any) {
        super(props)
        this.chatRef = React.createRef()
    }
    state = {
        chat: [],
        message: '',
        open: false,
        isAuth: false,
        name: '',
        users: null,
        error: null,
        ws: new WebSocket(`ws://${document.location.hostname}:5000/sockets/`)
    }
    componentDidMount() {
        const { ws } = this.state
        ws.addEventListener('message', this.getMessages)
        const localName = localStorage.getItem("name")
        if (localName) {
            this.setState({ isAuth: true, name: localName })
        }
    }
    componentDidUpdate(prevProps: {}, prevState: State) {
        if (prevState.chat !== this.state.chat || prevState.open !== this.state.open) {
            if (!this.chatRef || !this.chatRef.current) return
            this.chatRef.current.scrollTop = this.chatRef.current.scrollHeight;
        }
    }
    getMessages = (msg: any) => {
        const { chat } = this.state
        const data = JSON.parse(msg.data)
        console.log(data)
        if (Array.isArray(data)) {
            this.setState({users: data})
        } else {
            this.setState({chat: [...chat, data]})
        }
    }
    setErr = (err: string) => {
        this.setState({ error: err }, () => {
            setTimeout(() => this.setState({ error: null }), 4000)
        })
    }
    render() {
        const { chat, message, ws, open, name, isAuth, users, error } = this.state
        return (
            <div className={`top-chat ${open ? "open" : ""}`}>
                <div className="nav-buttons"
                    onClick={() => this.setState({ open: !open })}
                >
                    {open ? <i className="fas fa-minus" /> : <i className="fas fa-plus" />}
                    <span>Chat</span>
                    <div className="online">
                        <span>{users ? `${users.length} online` : ""}</span>
                    </div>
                </div>
                {open && !isAuth && (
                    <div className="get-name">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                try {
                                    if (name.length <= 3) throw "Must be longer than 3 characters"
                                    this.setState({ isAuth: true }, () => {
                                        localStorage.setItem("name", name)
                                    })
                                } catch (err) {
                                    this.setErr(err)
                                }
                            }}
                        >
                            <label style={error ? { color: 'red' } : {}}>
                                {error ? error : "Enter a name"}
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
                        <div className="messages" ref={this.chatRef}>
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
                                    try {
                                        if (message.length === 0) throw "Message cannot be empty"
                                        const obj = {
                                            message,
                                            name,
                                            type: "message"
                                        }
                                        ws.send(JSON.stringify(obj))
                                        this.setState({ message: '' })
                                    } catch (err) {
                                        this.setErr(err)
                                    }
                                }}
                            >
                                <input type="text"
                                    value={message}
                                    onChange={(e) => this.setState({ message: e.target.value })}
                                    placeholder={error ? error : "Send a message..."}
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