import React, { Component } from "react"
import {
    View,
    Platform,
    Keyboard,
    LayoutAnimation,
    ViewProperties,
    EmitterSubscription
} from "react-native"

import Bridge from "./bridge"

export interface ScreenRect {
    screenX: number
    screenY: number
    width: number
    height: number
}

interface KeyboardChangeEvent {
    startCoordinates?: ScreenRect
    endCoordinates: ScreenRect
    duration?: number
    easing?: string
}

export interface Props extends ViewProperties {
    keyboardVerticalOffset?: number
}

export interface State {
    bottom: number
    endCoordinates?: ScreenRect
    frame?: any
}

export default class KeyboardPaddingView extends Component<Props, State> {
    state: State = {
        bottom: 0
    }

    subscriptions: EmitterSubscription[] = []

    private relativeKeyboardHeight(
        frame: any,
        keyboardFrame: ScreenRect
    ): number {
        if (!frame || !keyboardFrame) {
            return 0
        }

        const keyboardY =
            keyboardFrame.screenY - this.props.keyboardVerticalOffset

        return Math.max(frame.y + frame.height - keyboardFrame.screenY, 0)
    }

    private onKeyboardChange = (event: KeyboardChangeEvent) => {
        if (!event) {
            this.setState({ bottom: 0 })
            return
        }

        const { duration, easing, endCoordinates } = event

        if (duration && easing) {
            LayoutAnimation.configureNext({
                duration: duration,
                update: {
                    duration: duration,
                    type: LayoutAnimation.Types[easing] || "keyboard"
                }
            })
        }

        console.log("keyboard", endCoordinates)

        this.setState({
            endCoordinates
        })
    }

    onLayout = (event: any) => {
        console.log("onLayout ", event.nativeEvent.layout)
        this.setState({
            frame: event.nativeEvent.layout
        })
    }

    componentWillUpdate(
        nextProps: Props,
        nextState: State,
        nextContext?: Object
    ): void {
        const height = this.relativeKeyboardHeight(
            nextState.frame,
            nextState.endCoordinates
        )

        console.log("update", nextState)
        console.log("heightUpdate", height)

        nextState.bottom = nextState.endCoordinates
            ? nextState.endCoordinates.height
            : 0
    }

    componentWillMount() {
        if (Platform.OS === "ios") {
            this.subscriptions = [
                Keyboard.addListener(
                    "keyboardWillChangeFrame",
                    this.onKeyboardChange
                )
            ]
        } else {
            this.subscriptions = [
                Keyboard.addListener(
                    "keyboardDidHide",
                    this.onKeyboardChange.bind(this, { height: 0 })
                ),
                Keyboard.addListener("keyboardDidShow", this.onKeyboardChange)
            ]
        }
    }

    componentWillUnmount() {
        this.subscriptions.forEach(sub => sub.remove())
    }

    render() {
        const { children, style, ...props } = this.props

        return (
            <View
                style={[style, { paddingBottom: this.state.bottom }]}
                onLayout={this.onLayout}
                {...props}
            >
                {children}
            </View>
        )
    }
}
