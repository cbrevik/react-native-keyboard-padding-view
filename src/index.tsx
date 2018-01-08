import React, { Component } from "react"
import {
    View,
    Platform,
    Keyboard,
    LayoutAnimation,
    ViewProperties,
    EmitterSubscription
} from "react-native"

let autoResize = false
import Bridge from "./bridge"
Bridge.autoResizeWindow().then(auto => {
    autoResize = auto
})

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

        return Math.max(
            frame.y +
                (autoResize ? keyboardY : frame.height) -
                keyboardFrame.screenY,
            0
        )
    }

    private onKeyboardChange = async (event: KeyboardChangeEvent) => {
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

        this.setState({
            endCoordinates
        })
    }

    onLayout = (event: any) => {
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

        nextState.bottom = height
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
                Keyboard.addListener("keyboardDidHide", this.onKeyboardChange),
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
