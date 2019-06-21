import React from 'react'
import { Image, View, TouchableHighlight } from 'react-native'

export default class Header extends React.Component {
  render() {
    return (
      <View style={{
        backgroundColor: '#303030',
        justifyContent: 'space-between',
        flexDirection: 'row',
        flex: 1,
        zIndex: 5
      }}>
        <View style={{
          alignSelf: 'flex-start',
          flex: 1,
          padding: 1
        }}>
          {this.props.goBack ?
          (<TouchableHighlight
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            onPress={this.props.goBack}
            underlayColor={'rgba(0,0,0,0)'}
          >
            <Image
              style={{
                resizeMode: 'contain',
                width: '80%',
                height: '80%'
              }}
              source={require('../assets/back.png')}
            />
          </TouchableHighlight>) : null}
        </View>
        <Image
          style={{
            flex: 5,
            resizeMode: 'contain',
            alignSelf: 'center',
            height: '100%',
            width: '50%'
          }}
          source={require('../assets/middara-text-header.png')}
        />
        <View style={{flex: 1}} />
      </View>
    )
  }
}
