import React from 'react'
import { Platform, Dimensions, Image, Text, View, StatusBar, SafeAreaView } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import FastImage from 'react-native-fast-image'
import Sound from 'react-native-sound'
import Header from '../Components/header'
import Button from '../Components/button'
import DarkStatusBar from '../Components/darkStatusBar'

export default class TitleScreen extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      splashFading: true,
      splashAlpha: 1.0
    }
  }

  componentDidMount() {
    global.adventures = null

    Sound.setCategory('Playback')

    const sound = new Sound('middara_theme.mp3', Sound.MAIN_BUNDLE, (error) => {
      console.log('Loaded background music')
      if(error) {
        console.log('Failed to load background music', error)
        return
      }
      global.backgroundMusic.fadeIn()
    })
    sound.setNumberOfLoops(-1)

    global.backgroundMusic = {
      volume: 0.0,
      playing: false,
      interval: null,
      sound: sound,
      fadeIn: function() {
        if(this.playing) return
        this.sound.play((success) => {
          if(success) {
            console.log('finished playing')
          } else {
            console.log('playback failed')
          }
        })
        this.playing = true
        this.interval = setInterval(() => {
          this.sound.setVolume(this.volume)
          if(this.volume < 1.0) {
            this.volume += 0.02
          }
          if(this.volume >= 1.0) {
            clearInterval(this.interval)
          }
        }, 50)
      },
      fadeOut: function() {
        if(this.interval) clearInterval(this.interval)
        this.interval = setInterval(() => {
          this.sound.setVolume(this.volume)
          if(this.volume > 0.0) {
            this.volume -= 0.02
          }
          if(this.volume <= 0.0) {
            this.sound.stop(() => {})
            this.playing = false
            clearInterval(this.interval)
            this.interval = null
          }
        }, 50)
      }
    }

    const url = 'https://middara-bc364.firebaseapp.com/adventures/index.json'
    const adventures = fetch(url)
      .then((response) => response.json())
      .then((data) => {
        data.adventures[0].img = require('../assets/adventure-buttons/01.png')
        global.adventures = data.adventures
        return data.adventures.map((adventure, index) => {
          const _pad = (num, size) => {
            var s = num+""
            while (s.length < size) {s = "0" + s};
            return s
          }

          var indices = []
          adventure.abridged = new Array(adventure.numChapters)
          adventure.full = new Array(adventure.numChapters)
          for(var ch = 0; ch < adventure.numChapters; ch++) {
            const urlFull = 'https://middara-bc364.firebaseapp.com/adventures/'
              + adventure.directory + '/chapter-' + _pad(ch+1, 2) + '/full.json'
            const urlAbridged = 'https://middara-bc364.firebaseapp.com/adventures/'
              + adventure.directory + '/chapter-' + _pad(ch+1, 2) + '/abridged.json'
            indices.push(
              function(i) {
                return fetch(urlFull)
                  .then((response) => response.json())
                  .then((data) => {
                    adventure.full[i] = data.scenes.map((scene, index) => {
                      var obj = scene
                      obj.key = index
                      return obj
                    })
                  })
              }(ch))
            indices.push(
              function(i) {
                return fetch(urlAbridged)
                  .then((response) => response.json())
                  .then((data) => {
                    adventure.abridged[i] = data.scenes.map((scene, index) => {
                      var obj = scene
                      obj.key = index 
                      return obj
                    })
                  })
              }(ch))
          }


          const uri = 'https://middara-bc364.firebaseapp.com/adventures/' + adventure.directory
            + (adventure.numChapters ? '/button.png' : '/button-greyed.png')
          adventure.uri = uri
          FastImage.preload([{ uri: uri }])
        })
      })

    //setTimeout(() => {
      SplashScreen.hide()
    //}, 300)
    this.splashInterval = setInterval(() => {
      if(this.state.splashAlpha > 0.0) {
        this.setState({ splashAlpha: this.state.splashAlpha-0.01 })
      } else {
        clearInterval(this.splashInterval)
        this.setState({ splashFading: false })
      }
    }, 10)
  }

  render() {

    const { navigate } = this.props.navigation
    return (
      <View style={{flex: 1}}>
        {this.state.splashFading && (<View style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            zIndex: 10,
            opacity: this.state.splashAlpha,
            backgroundColor: '#000'
          }}>
          <Image
            style={{
              resizeMode: 'contain',
              width: '100%'
            }}
            source={require('../assets/splash/splash.png')}
          />
        </View>)}
        <DarkStatusBar />
        <SafeAreaView style={{flex: 1, backgroundColor: '#303030', zIndex: 5}}>
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
          <Image
            style={{
              position: 'absolute',
              top: '6%',
              resizeMode: 'cover',
              alignSelf: 'center',
              height: '100%',
              width: '100%',
            }}
            source={require('../assets/title/overlay.png')}
          />
          <Header />
          <View style={{flex: 13, marginBottom: 50, justifyContent: 'flex-end'}}>
            <Button style={{width: '100%', height: 60, justifyContent: 'center'}}
              onPress={() => {
                navigate('AdventureList', {version: 'novel'})
                // navigate('Version')
              }}
            >
              <Text style={{
                fontFamily: 'Mentor Sans Std',
                fontSize: 16,
                color: '#5a3719',
                top: Platform.OS === 'ios' ? '15%' : 0
              }}>
                NEW ADVENTURE
              </Text>
            </Button>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

