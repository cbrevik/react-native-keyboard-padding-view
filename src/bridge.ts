import { NativeModules } from "react-native"

export interface Bridge {
    autoResizeWindow: () => Promise<boolean>
}

let { KeyboardPaddingView } = NativeModules as any

if (!KeyboardPaddingView) {
    KeyboardPaddingView = {
        autoResizeWindow: () => {
            return Promise.resolve(false)
        }
    } as Bridge
}

export default KeyboardPaddingView as Bridge
