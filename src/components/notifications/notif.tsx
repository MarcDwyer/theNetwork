import React, { Component } from 'react'
import { LSObj } from '../main/main'
import _ from 'lodash';
import './notif_styles.scss'
interface Props{
    live: LSObj
}
interface State {
    loaded: boolean;
    times: number;
    difference: Array<string>;
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
      }, 5000)
   }
   componentDidUpdate(prevProps: Props) {
       const { times } = this.state
       if (prevProps !== this.props) {
            this.setState({times: times + 1})
            if (times > 1) {
                const oldNames: Array<string> = Object.values(prevProps.live).map(stream => stream.name)
                const newNames: Array<string> = Object.values(this.props.live).map(stream => stream.name)

                const diff = _.difference(newNames, oldNames);

                return diff.length > 0 ? this.setState({difference: diff})
            }
       }
   }
    render() {
        const { times, loaded } = this.state
        console.log(loaded)
        if (loaded) {
            return (
                <div className="notification prompt"
                >
                hello?
                </div>
            )
        }
        return (
            <div className="notification"
            >
            </div>
        )
    }
}