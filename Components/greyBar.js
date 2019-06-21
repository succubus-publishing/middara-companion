import React from 'react'
import { View, StatusBar, Platform } from 'react-native'

export default class GreyBar extends React.Component {
  render() {
    return (
      <View style={this.props.style, {
        backgroundColor: '#555',
        zIndex: 4,
      }}>
          {this.props.children}
      </View>
    )
  }
}

