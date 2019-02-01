import React, { Component } from 'react'
import { LSObj } from '../main/main'
import './notif_styles.scss'
interface Props{
    live: LSObj
}
interface State {
    loaded: boolean;
    times: number;
    difference: Checker[];
}
interface Checker {
    name: string;
    channelId: string;
}
export default class Notifications extends Component <Props, State> {
    state: State = {
        loaded: false,
        times: 0,
        difference: []
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({loaded: true})
      }, 500)
   }
   componentDidUpdate(prevProps: Props) {
       const { times, loaded } = this.state
       
       if (loaded) {
            setTimeout(() => {
                this.setState({loaded: false})
            }, 3000)
       }
       if (prevProps.live !== this.props.live) {
            this.setState({times: times + 1})
            if (times > 1) {
                const oldNames: Checker[] = Object.values(prevProps.live).map(stream => {
                    return {name: stream.name, channelId: stream.channelId}
                })
                const newNames: Checker[] = Object.values(this.props.live).map(stream => {
                   return {name: stream.name, channelId: stream.channelId}
                })

                const diff = this.difference(newNames, oldNames)
                console.log(diff)
                if (diff.length > 0) {
                    return this.setState({difference: diff})
                } else {
                    return
                }
            }
       }
   }
    render() {
        const { times, loaded, difference } = this.state
        if (loaded) {
            return (
                <div className="notification prompt"
                >
                <span>I will notify you when streamers go live!</span>
                </div>
            )
        } else if (!loaded && difference.length > 0) {
            <div className="notification prompt"
            >
            {(() => {
                return difference.map(({name, channelId}) => {
                    return (
                        <div className="islive">
                        <span>{name} is live!</span>
                        <button
                        onClick={() => {
                            console.log(channelId)
                        }}
                        >Watch now</button>
                        </div>
                    )
                })
            })()}
            </div>
        }
        return (
            <div className="notification"
            >
            </div>
        )
    }
    difference(newNames: Checker[], old: Checker[]): Checker[] {
        let ch: Checker[] = []
        console.log('is this even running')
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
}
