import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

class Block extends Component {
    

    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
    const y = this.props.body.position.y - height / 2;
    return(
        <View style={{ left: x, top: y, position: "absolute",
        backgroundColor: this.props.color || "pink",
        width: width,
        height: height,
        borderRadius: 25 }} />
    )
    }
};

export default Block;