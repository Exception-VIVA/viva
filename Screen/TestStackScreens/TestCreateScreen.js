import React, {useState, createRef} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

const TestCreateScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>this is TestCreateScreen</Text>
      <View style={styles.btnArea}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            AsyncStorage.clear();
            navigation.replace('Auth');
          }}>
          <Text style={{color: 'white'}}>LOGOUT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.btnArea}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            AsyncStorage.clear();
            navigation.navigate('TestRead');
          }}>
          <Text style={{color: 'white'}}>테스트스크린으로</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'center',
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
  TextRegister: {
    fontSize: wp('3.5%'),
    color: 'grey',
    textDecorationLine: 'underline',
    paddingTop: wp(2),
  },
  formArea: {
    justifyContent: 'center',
    // paddingTop: wp(10),
    flex: 1.5,
  },
  textFormTop: {
    borderWidth: 2,
    borderBottomWidth: 1,
    borderColor: 'black',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    width: '100%',
    height: hp(6),
    paddingLeft: 10,
    paddingRight: 10,
  },
  textFormBottom: {
    borderWidth: 2,
    borderTopWidth: 1,
    borderColor: 'black',
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    width: '100%',
    height: hp(6),
    paddingLeft: 10,
    paddingRight: 10,
  },
  btnArea: {
    height: hp(8),
    // backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp(1.5),
  },
  btn: {
    flex: 1,
    width: '100%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});

export default TestCreateScreen;
