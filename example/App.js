import React, { Component } from "react"
import { Platform, StyleSheet, Text, TextInput, View } from "react-native"

import KPV from "react-native-keyboard-padding-view"

export default class App extends Component {
    render() {
        return (
            <KPV style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to Keyboard Padding View!
                </Text>
                <TextInput style={{ width: 200 }} placeholder="Select me" />
            </KPV>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5
    }
})
