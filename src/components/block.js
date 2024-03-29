import React, {Component} from 'react';
import {View} from 'react-native';

class Block extends Component {
  render() {
    const width = this.props.size[0];
    const height = this.props.size[1];
    const x = this.props.body.position.x - width / 2;
    const y = this.props.body.position.y - height / 2;
    return (
      <View
        style={{
          left: x,
          top: y,
          backgroundColor: this.props.color || 'pink',
          width: width,
          height: height,
        }}
      />
    );
  }
}

export default Block;
