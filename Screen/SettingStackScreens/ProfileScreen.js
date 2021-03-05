import React, {useState, createRef} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';
import Loader from '../Components/Loader';
import {StyleSheet, View, Text, Image} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

const ProfileScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>this is ProfileScreen</Text>
      <Image
        source={{
          uri:
            '/var/mobile/Containers/Data/Application/C2EFE133-6E0D-4E10-9B63-09D6A073B6FB/Library/Caches/RNRectangleScanner/O1614959311.jpeg',
        }}
        style={{width: wp(80), height: hp(80)}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, //전체의 공간을 차지한다는 의미
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingLeft: wp(7),
    paddingRight: wp(7),
  },
  topArea: {
    flex: 1,
    paddingTop: wp(2),
  },
  titleArea: {
    flex: 0.7,
    justifyContent: 'center',
    paddingTop: wp(3),
  },
  TextArea: {
    flex: 0.3,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  Text: {
    fontSize: wp('4%'),
    paddingBottom: wp('1%'),
  },
  TextValidation: {
    fontSize: wp('4%'),
    color: 'red',
    paddingTop: wp(2),
  },
});

export default ProfileScreen;
