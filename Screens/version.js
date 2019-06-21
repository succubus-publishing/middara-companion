import React from 'react'
import { Platform, Image, View, Text, StatusBar, SafeAreaView, TouchableHighlight } from 'react-native'
import Header from '../Components/header'
import DarkStatusBar from '../Components/darkStatusBar'
import Button from '../Components/button'
import BlueBar from '../Components/blueBar'

export default class VersionScreen extends React.Component {
  static navigationOptions = {
    title: 'Version',
  }

  constructor(props) {
    super(props)
    this.state = {
      novelPress: false, 
      summaryPress: false
    }
  }
  
  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <View style={{flex: 1}}>
        <DarkStatusBar />
        <SafeAreaView style={{flex: 1, backgroundColor: '#303030'}}>
          <Header goBack={() => goBack()} />
          <BlueBar style={{flex: 3}}>
            <Text style={{
              color: '#fff',
              fontFamily: 'Cinzel-Bold',
              fontSize: 16,
              zIndex: 10,
              alignSelf: 'center',
              margin: 8
            }}>
              Choose Your Book
            </Text>
          </BlueBar>
          <Image
            style={{
              position: 'absolute',
              top: '6%',
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
              resizeMode: 'cover',
              height: '100%',
              width: '100%',
            }}
            source={require('../assets/bg.png')}
          />
          <View style={{flex: 13, flexDirection: 'column', justifyContent: 'flex-start'}}>
            <Button
              style={{width: '100%', height: 60, justifyContent: 'center'}}
              onPress={() => {
                navigate('AdventureList', {version: 'novel'})
              }}
            >
             <Text style={{
               fontFamily: 'Mentor Sans Std',
               fontSize: 16,
               color: '#5a3719',
               top: Platform.OS === 'ios' ? '15%' : 0
             }}>
               FULL VERSION
             </Text>
            </Button>
            {/*
            <Button
              style={{width: '100%', height: 60, justifyContent: 'center'}}
              onPress={() => {
                navigate('AdventureList', {version: 'summary', backgroundMusic: backgroundMusic})
                navigate('AdventureList', {version: 'summary'})
              }}
            >
             <Text style={{
               fontFamily: 'Mentor Sans Std',
               fontSize: 16,
               color: '#5a3719',
               top: Platform.OS === 'ios' ? '15%' : 0
             }}>
               ABRIDGED VERSION
             </Text>
            </Button>
            */}
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

