import React, { Component, useState, useEffect } from 'react'
import { LSObj } from '../main/main'
import './notif_styles.scss'
interface Props{
    live: LSObj;
    select: Function;
}
interface State {
    loaded: boolean;
    difference: Checker[];
}
interface Checker {
    name: string;
    channelId: string;
}
const difference = (newNames: Checker[], old: Checker[]): Checker[] => {
    let ch: Checker[] = []
    for (let x = 0; x < newNames.length; x++) {
        let match: boolean = false
        for (let i = 0; i < old.length; i++) {
            if (newNames[x].name === old[i].name) {
                match = true
                break
            }
            if (i === old.length && !match) {
                ch.push(newNames[x])
            }
        }
        if (!match) {
            ch.push(newNames[x])
        }
    }
    return ch
}

const Notifications: JSX.Element = (props: Props) => {
    const [loaded, setLoaded] = useState<boolean>(false)
    const [diff, setDiff] = useState<Array<string>>([])

    useEffect(() => {
        const confirmed: string | null = localStorage.getItem("isClear") || null
        if (confirmed) return
        setTimeout(() => {
            setLoaded(true)
      }, 500)
    }, [])

    useEffect(() => {
        
    }, [props.live])
}
export default class Notifications extends Component <Props, State> {
    state: State = {
        loaded: false,
        difference: []
    }
    componentDidMount() {
        const confirmed = localStorage.getItem("isClear") || null
        if (confirmed) return
        setTimeout(() => {
            this.setState({loaded: true})
      }, 500)
   }
   componentDidUpdate(prevProps: Props) {
       const { loaded } = this.state
       if (loaded) {
            setTimeout(() => {
                this.setState({loaded: false})
            }, 3000)
       }
       if (prevProps.live !== this.props.live) {
                const oldNames: Checker[] = Object.values(prevProps.live).map(stream => {
                    return {name: stream.name, channelId: stream.channelId}
                })
                const newNames: Checker[] = Object.values(this.props.live).map(stream => {
                   return {name: stream.name, channelId: stream.channelId}
                })

                const diff = this.difference(newNames, oldNames)
                if (diff.length > 0) {
                 this.setState({difference: diff})
                }
       }
   }
    render() {
        const { loaded, difference } = this.state
        if (window.innerWidth < 1000) return null
        if (loaded) {
            return (
                <div className="parent-notif prompt">
                <div className="notification"
                >
                <span>I will notify you when streamers go live!</span>
                <span className="clear"
                onClick={(e) => {
                    this.setState({loaded: false}, () => {
                        localStorage.setItem("isClear", JSON.stringify(true))
                    })
                }}
                >OK</span>
                </div>
                </div>
            )
        } else if (!loaded && difference.length > 0) {
           setTimeout(() => {
               this.setState({difference: []})
            }, 9000)
            return (
                <div className="parent-notif prompt">
                {(() => {
                    return difference.map(({name, channelId}) => {
                        return (
                            <div className="notification">
                            <div className="islive">
                            <span>{name} is live!</span>
                            <button
                            className="watch-now"
                            onClick={() => {
                                this.setState({difference: []}, () => {
                                    this.props.select(channelId)
                                })
                            }}
                            >Watch now</button>
                            </div>
                            </div>
                        )
                    })
                })()}
                </div>
            )
        }
        return (
            <div className="parent-notif">
            <div className="notification"
            >
            </div>
            </div>
        )
    }
}
