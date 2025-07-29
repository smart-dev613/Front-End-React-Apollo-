import React, { Component } from 'react'
import styled from "styled-components"

interface Props {
    name: string,
    image: string,
    date: string,
    time: string,
    eventType: string,
    roomName: string
}
interface State {
    
}

export default class CalendarModal extends Component<Props, State> {
    state = {}

    render() {
        return (
            <div>
                <p>{this.props.name}</p>
                <p>{this.props.date}</p>
                <p>{this.props.time}</p>
                <p>{this.props.eventType}</p>
                <p>{this.props.roomName}</p>
            </div>
        )
    }
}

