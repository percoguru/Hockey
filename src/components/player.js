/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';

class Player extends Component {
  render() {
    const radius = this.props.radius;
    const x = this.props.body.position.x - radius;
    const y = this.props.body.position.y - radius;
    return (
      <View
        style={{
          left: x,
          top: y,
          position: 'absolute',
          backgroundColor: this.props.color || 'pink',
          width: radius * 2,
          height: radius * 2,
          borderRadius: radius * 2,
        }}
        className="player"
      />
    );
  }
}

export default Player;
