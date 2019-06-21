import React from 'react'
import {Text} from 'react-native'

export default class Time extends React.Component {
  render() {
    return (
      <Text style={this.props.style}>
        {this.props.seconds != null ? Math.floor(this.props.seconds/60) : '?'}
        :
        {this.props.seconds != null ? String(Math.round(this.props.seconds%60)).padStart(2, '0') : '??'}
      </Text>
    )
  }
}

