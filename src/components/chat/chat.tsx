import React, { Component } from 'react'
import './chat_styles.scss'

interface State {
    chat: Array<string>;
    message: string;
    ws: WebSocket;
    isAuth: boolean;
    open: boolean;
    count: number | null;
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
        count: null,
        error: null,
        ws: new WebSocket(`wss://${document.location.host}/sockets/`)
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
        if (data.total) {
            this.setState({ count: data.total })
            return
        }
        this.setState({ chat: [...chat, JSON.parse(msg.data)] })
    }
    setErr = (err: string) => {
        this.setState({ error: err }, () => {
            setTimeout(() => this.setState({ error: null }), 4000)
        })
    }
    render() {
        const { chat, message, ws, open, name, isAuth, count, error } = this.state
        return (
            <div className={`top-chat ${open ? 'open' : ''}`}>
                <div className="nav-buttons"
                    onClick={() => this.setState({ open: !open })}
                >
                    {open ? <i className="fas fa-minus" /> : <i className="fas fa-plus" />}
                    <span>Chat</span>
                    <div className="online">
                        <span>{count} online</span>
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
                                        ws.send(JSON.stringify({ message: message, name: name }))
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