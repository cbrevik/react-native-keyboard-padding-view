## react-native-keyboard-padding-view

Yet another package trying to solve problems with Keyboards popping up in React Native.

All I needed myself was a simple View adding padding when Keyboard pops up.

Set `isAutoResize={true}` for Android if the window resizes (e.g. `windowSoftInputMode="adjustResize"`)
Tried to get this natively, but seems like this is sometimes set dynamically as well.
