import React from 'react';
import { Platform, Image, View, Text, ScrollView, SafeAreaView } from 'react-native';
import Header from '../Components/header'
import DarkStatusBar from '../Components/darkStatusBar'
import Button from '../Components/button'
import BlueBar from '../Components/blueBar'
import GreyBar from '../Components/greyBar'

export default class ChapterListScreen extends React.Component {
  static navigationOptions = {
    title: 'ChapterList',
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.navigation.addListener('willBlur', payload => {
      if(payload.action.type === "Navigation/BACK") {
        global.backgroundMusic.fadeIn()
      }
    })
  }

  render() {
    const { navigate, goBack } = this.props.navigation
    const version = this.props.navigation.getParam('version', 'novel')
    const adventure = this.props.navigation.getParam('adventure', {})

    const chapters = []
    for(var i = 1; i<=adventure.numChapters; i++) {
      chapters[i-1] = i;
    }

    return (
      <View style={{flex: 1}}>
        <DarkStatusBar />
        <SafeAreaView style={{flex: 1, backgroundColor: '#303030'}}>
          <Image
            style={{
              position: 'absolute',
              top: '6%',
              alignSelf: 'flex-end',
              resizeMode: 'cover',
              justifyContent: 'flex-end',
              height: '100%',
              width: '100%',
            }}
            source={require('../assets/bg.png')}
          />
          <Header goBack={() => goBack()} />
          <GreyBar style={{flex: 3}}>
            <Text style={{
              fontFamily: 'Mentor Sans Std',
              fontSize: 14,
              color: '#fff',
              includeFontPadding: false,
              alignSelf: 'center',
              textAlign: 'center',
              textAlignVertical: 'bottom',
              zIndex: 10,
              margin: 4
            }}>
              {adventure.title}
            </Text>
          </GreyBar>
          <BlueBar style={{flex: 3}}>
            <Text style={{
              color: '#fff',
              fontFamily: 'Cinzel-Bold',
              fontSize: 16,
              zIndex: 10,
              alignSelf: 'center',
              margin: 8
            }}>
              Choose A Chapter
            </Text>
          </BlueBar>
          <View style={{flex: 13}}>
            <ScrollView style={{flex: 1}}>
              {chapters.map(chapter =>
                <View key={chapter} style={{flex: 1}}>
                  <Button
                    style={{width: '100%', height: 60, justifyContent: 'center'}}
                    onPress={() => navigate('SceneList', { adventure: adventure, version: version, chapter: chapter })}
                  >
                    <Text style={{
                      fontFamily: 'Mentor Sans Std',
                      fontSize: 16,
                      color: '#5a3719',
                      top: Platform.OS === 'ios' ? '15%' : 0
                    }}>
                      {'CHAPTER ' + chapter}
                    </Text>
                  </Button>
                </View>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
