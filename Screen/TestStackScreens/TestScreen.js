import React, {
  useState,
  createRe,
  useLayoutEffect,
  useEffect,
  useRef,
} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/Ionicons';

const TestScreen = ({navigation}) => {
  const preURL = require('../../preURL/preURL');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => <Text style={styles.title}>미니 모의고사</Text>,
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topdesc}>
        <Text style={{fontSize: wp(5), fontWeight: 'bold'}}>VIVA를 통해</Text>
        <Text style={{fontSize: wp(5), fontWeight: 'bold'}}>
          나만의 미니모의고사를 만들어보세요.{' '}
        </Text>
        <Text style={{fontSize: wp(4), paddingTop: hp(1.5)}}>
          만들었던 미니 모의고사들을 모아볼 수도 있어요:)
        </Text>
      </View>

      <View
        style={{
          flex: 1.5,
        }}>
        <View style={styles.btnArea}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              navigation.navigate('TestCreate');
            }}>
            <Text style={{fontSize: wp(4.5), fontWeight: 'bold'}}>
              모의고사 생성
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btnArea}>
          <TouchableOpacity
            style={[styles.btn, styles.filledbtn]}
            onPress={() => {
              navigation.navigate('TestRead');
            }}>
            <Text
              style={{fontSize: wp(4.5), fontWeight: 'bold', color: 'white'}}>
              모의고사 보기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingLeft: wp(10),
    paddingRight: wp(10),
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  topdesc: {
    justifyContent: 'flex-end',
    flex: 1,
    paddingBottom: hp(5),
  },

  btnArea: {
    height: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp(2),
  },
  btn: {
    height: hp(7),
    width: wp(80),
    borderRadius: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  filledbtn: {
    backgroundColor: 'black',
  },

  btnL: {marginRight: 10},
  title: {
    fontSize: wp(5),
    fontWeight: 'bold',
    paddingLeft: wp(2),
  },
});

export default TestScreen;
