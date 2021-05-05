import React, {useState, createRe, useLayoutEffect, useEffect} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/Ionicons';

const TestScreen = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => <Text style={styles.title}>미니 모의고사</Text>,
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.btnArea}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            navigation.replace('TestCreate');
          }}>
          <Text style={{fontSize: wp(5)}}>미니 모의고사 생성</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.btnArea}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            navigation.navigate('TestRead');
          }}>
          <Text style={{fontSize: wp(5)}}>내 미니 모의고사 보기</Text>
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
    height: hp(30),
    // backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp(2),
  },
  btn: {
    flex: 1,
    width: hp(30),
    borderRadius: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  title: {
    fontSize: wp(4),
    fontWeight: 'bold',
    paddingLeft: wp(2),
  },
});

export default TestScreen;
