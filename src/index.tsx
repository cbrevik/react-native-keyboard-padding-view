import React, { Component } from "react"
import {
    View,
    Platform,
    Keyboard,
    LayoutAnimation,
    ViewProperties,
    EmitterSubscription
} from "react-native"

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
    isAutoResize?: boolean
}

export interface State {
    bottom: number
}

export default class KeyboardPaddingView extends Component<Props, State> {
    static defaultProps = {
        isAutoResize: Platform.OS === "android"
    }

    state: State = {
        bottom: 0
    }

    subscriptions: EmitterSubscription[] = []
    endCoordinates?: ScreenRect
    frame?: any

    private relativeKeyboardHeight(
        frame: any,
        keyboardFrame: ScreenRect
    ): number {
        if (!frame || !keyboardFrame) {
            return 0
        }

        if (this.props.isAutoResize) {
            return Math.max(
                frame.y +
                    (keyboardFrame.screenY -
                        this.props.keyboardVerticalOffset) -
                    keyboardFrame.screenY,
                0
            )
        } else {
            return Math.max(
                frame.y +
                    (frame.height + this.props.keyboardVerticalOffset) -
                    keyboardFrame.screenY,
                0
            )
        }
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

        this.endCoordinates = endCoordinates
        this.updateLayout()
    }

    private keyboardAndroidHide = () => {
        this.setState({bottom: 0})
    }

    onLayout = (event: any) => {
        this.frame = event.nativeEvent.layout
        this.updateLayout()
    }

    updateLayout = (): void => {
        const height = this.relativeKeyboardHeight(
            this.frame,
            this.endCoordinates
        )

        this.setState({ bottom: height })
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
                Keyboard.addListener("keyboardDidHide", this.keyboardAndroidHide),
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
