import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";


function Home({ navigation }) {
return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('Game')} >
                <Text style={styles.fullScreenButton} > Start
                </Text>
                </TouchableOpacity>
      </View>
    )}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ebeb34',
    },
    fullScreenButton: {
        fontSize: 100
    }
});