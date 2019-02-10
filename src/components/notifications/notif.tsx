import React, { useState, useEffect, useRef } from 'react'
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

const Notifications = (props: Props): JSX.Element => {
    const [loaded, setLoaded] = useState<boolean>(false)
    const [diff, setDiff] = useState<Checker[]>([]) 
    const [count, setCount] = useState<number>(0)

    let oldProps = useRef(props.live)

    useEffect(() => {
        const confirmed: string | null = localStorage.getItem("isClear") || null
        if (confirmed) return
        setTimeout(() => {
            setLoaded(true)
      }, 500);
    }, []);

    console.log(diff)
    useEffect(() => {
        setCount(count + 1)
        if (count >= 1) {
            console.log(count)
            console.log('is this running')
            const oldPrps = Object.values(oldProps.current)
            const newProps = Object.values(props.live)
            oldProps.current = props.live

            setDiff(difference(newProps, oldPrps))
        }
    }, [props.live])

    return (
        <span>hello</span>
    );
};

export default Notifications