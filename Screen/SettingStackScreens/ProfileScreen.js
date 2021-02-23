import React, {Component, seState, createRef, useRef} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';
import Loader from '../Components/Loader';
import {StyleSheet, View, Text} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Scanner from 'react-native-rectangle-scanner';

// const ProfileScreen = ({navigation}) => {
//   const camera = useRef();
//
//   const handleOnPictureProcessed = ({croppedImage, initialImage}) => {
//     this.props.doSomethingWithCroppedImagePath(croppedImage);
//     this.props.doSomethingWithOriginalImagePath(initialImage);
//   };
//
//   return (
//     <View style={styles.container}>
//       <Text>this is ProfileScreen</Text>
//       <Scanner
//         onPictureProcessed={handleOnPictureProcessed}
//         ref={camera}
//         style={{flex: 1}}
//       />
//     </View>
//   );
// };

class ProfileScreen extends Component {
  handleOnPictureProcessed = ({croppedImage, initialImage}) => {
    this.props.doSomethingWithCroppedImagePath(croppedImage);
    this.props.doSomethingWithOriginalImagePath(initialImage);
  };

  onCapture = () => {
    this.camera.current.capture();
  };

  render() {
    return (
      <Scanner
        onPictureProcessed={this.handleOnPictureProcessed}
        ref={this.camera}
        style={{flex: 1}}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, //전체의 공간을 차지한다는 의미
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingLeft: wp(7),
    paddingRight: wp(7),
  },
});

export default ProfileScreen;
