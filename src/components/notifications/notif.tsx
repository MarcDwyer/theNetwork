import React, { useState, useEffect, useRef } from 'react'
import { LSObj } from '../main/main'
import './notif_styles.scss'

interface Props {
    live: LSObj | null;
    setSelected: Function;
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

const Notifications = (props: Props): JSX.Element | null => {
    if (window.innerWidth <= 1000) return null
    const [trigger, setTrigger] = useState<boolean>(false)
    const [diff, setDiff] = useState<Checker[]>([])
    const [count, setCount] = useState<number>(0)

    let oldProps = useRef(props.live)
    console.log()
    useEffect(() => {
        const confirmed: string | null = localStorage.getItem("isClear") || null
        if (confirmed) return
        setTimeout(() => {
            setTrigger(true)
        }, 500);
    }, []);
    useEffect(() => {
        if (trigger) {
            setCount(count + 1)
            setTimeout(() => {
                setTrigger(false)
                setDiff([])
            }, 5000);
        }
    }, [trigger])
    useEffect(() => {
        if (oldProps.current && props.live) {
            const oldPrps = Object.values(oldProps.current)
            const newProps = Object.values(props.live)
            const give: Checker[] = difference(newProps, oldPrps)
            console.log(give)
            if (give.length === 0) return
            setDiff(give)
            setTrigger(true)
        }
        oldProps.current = props.live
    }, [props.live])
    return (
        <div className={`parent-notif ${trigger ? "prompt" : ""}`}>
            {trigger && diff.length > 0 && diff.map(({ name, channelId }, index: number) => {
                return (
                    <div className="notification">
                        <div className="islive" key={index}>
                            <span>{name} is live!</span>
                            <button
                                className="watch-now"
                                onClick={() => {
                                    setTrigger(false)
                                    props.setSelected(channelId)
                                }}
                            >Watch now</button>
                        </div>
                    </div>
                )
            })}
            {trigger && count <= 1 && (
                <div className="notification">
                    <div>
                        <span>I will notify you when streamers go live!</span>
                        <span className="clear"
                            onClick={() => {
                                setTrigger(false)
                                localStorage.setItem("isClear", JSON.stringify(true))
                            }}
                        >Ok</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications