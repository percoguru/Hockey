import React, {Component} from 'react';
import {View} from 'react-native';
import {array, object, string} from 'prop-types';

export default class Box extends Component {
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
          width: width,
          height: height,
          backgroundColor: this.props.color || 'pink',
        }}
      />
    );
  }
}

Box.propTypes = {
  size: array,
  body: object,
  color: string,
};
