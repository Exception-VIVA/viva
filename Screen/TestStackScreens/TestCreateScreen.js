import React, {useState, useLayoutEffect, useEffect} from 'react';

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
  TextInput,
} from 'react-native';
import Loader from '../Components/Loader';

import Icon from 'react-native-vector-icons/dist/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import {showMessage} from 'react-native-flash-message';

const TestCreateScreen = ({navigation}) => {
  const preURL = require('../../preURL/preURL');

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [incorNoteList, setIncorNoteList] = useState([]);
  const [minitestName, setMinitestName] = useState('미니 모의고사');

  const getUserid = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    return userId;
  };

  const makeIncorNoteList = async (note_list) => {
    var incornoteList = [];

    for (let i = 0; i < note_list.length; i++) {
      incornoteList.push({
        label: note_list[i].note_name,
        value: note_list[i].note_sn,
      });
    }
    return incornoteList;
  };

  const getMultidata = async () => {
    const userId = await getUserid();
    const incornotedata = await getIncorNotedata(userId);
    const incornotelist = await makeIncorNoteList(incornotedata.note_list);

    setIncorNoteList(incornotelist);
    setLoading(false);
  };

  const getIncorNotedata = async (userId) => {
    const response = await fetch(
      preURL.preURL +
        '/api/test/form?' +
        new URLSearchParams({
          stu_id: userId,
        }),
      {
        method: 'GET',
      },
    );
    if (response.status === 200) {
      const responseJson = await response.json();
      if (responseJson.status === 'success') {
        console.log('====fetch return result====');
        console.log(responseJson.data);
        return responseJson.data;
      } else if (responseJson.status === 'null') {
        return [];
      }
    } else {
      throw new Error('unable to get your Workbook');
    }
  };

  //모의고사 생성하기
  //localhost:3001/api/test/form
  // body : test_title
  //         note_sn
  //        stu_id
  const createMinitest = (stuId) => {
    console.log(value);
    console.log(minitestName);
    var dataToSend = {
      stu_id: stuId,
      test_title: minitestName,
      note_sn: value,
    };
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch(preURL.preURL + '/api/test/form', {
      method: 'POST',
      body: formBody,
      headers: {
        //Header Defination
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //Hide Loader
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.status === 'success') {
          setLoading(false);
          console.log('✨create minitest is Successful.');
          showMessage({
            message: '미니모의고사가 생성되었습니다.',
            type: 'default',
            duration: 2500,
            // autoHide: false,
          });
        } else {
          setLoading(false);
          console.log('create minitest is fail..');
        }
      })
      .catch((error) => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };

  const createMiniTestFull = async () => {
    setLoading(true);
    const userId = await getUserid();
    const what = await createMinitest(userId);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getMultidata();
    setLoading(false);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => (
        <Text style={styles.title}>미니 모의고사 생성하기</Text>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            {
              navigation.goBack();
            }
          }}>
          <Icon
            name="chevron-back-outline"
            size={33}
            style={{paddingLeft: 10}}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.topdesc}>
        <Text style={{fontSize: wp(4), fontWeight: 'bold'}}>
          미니모의고사 이름과, 오답노트를 정해주세요
        </Text>
        <Text style={{fontSize: wp(3.5), paddingTop: hp(1.5)}}>
          나의 오답노트를 기반으로,
        </Text>
        <Text style={{fontSize: wp(3.5), paddingTop: hp(0.5)}}>
          나만의 맞춤 미니 모의고사를 제공받을 수 있어요!
        </Text>
      </View>

      <View style={styles.namecontainer}>
        <Text style={{fontSize: wp(5), fontWeight: 'bold'}}>
          미니모의고사 이름
        </Text>
        <TextInput
          style={styles.textFormMiddle}
          placeholder={'미니모의고사 이름을 입력해주세요.'}
          onChangeText={(name) => setMinitestName(name)}
          returnKeyType="next"
          blurOnSubmit={false}
        />
      </View>

      <View style={styles.notecontainer}>
        <Text style={{fontSize: wp(5), fontWeight: 'bold', paddingBottom: 20}}>
          오답노트
        </Text>

        <DropDownPicker
          open={open}
          value={value}
          items={incorNoteList}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setIncorNoteList}
          placeholder="오답노트를 선택해주세요."
          zIndex={5000}
          maxHeight={200}
        />
      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={[styles.btn]}
          onPress={() => {
            createMiniTestFull();
          }}>
          <Text style={{fontSize: wp(4), fontWeight: 'bold', color: 'white'}}>
            생성하기
          </Text>
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
    // justifyContent: 'center',
  },

  title: {
    fontSize: wp(4),
    fontWeight: 'bold',
    paddingLeft: wp(2),
  },
  topdesc: {
    justifyContent: 'center',
    marginTop: hp(3),
    height: hp(10),
  },
  levelcontainer: {
    justifyContent: 'space-around',
    marginTop: hp(3),
    height: hp(10),
  },
  btn: {
    height: wp(10),
    width: wp(30),
    borderRadius: 400,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'black',
  },

  btnContainer: {
    paddingTop: hp(3),
    height: hp(20),
    alignItems: 'center',
    justifyContent: 'center',
  },

  namecontainer: {
    justifyContent: 'space-around',
    marginTop: hp(2),
    height: hp(15),
  },
  notecontainer: {
    justifyContent: 'flex-start',
    marginTop: hp(2),
    height: hp(20),
  },
  textFormMiddle: {
    borderWidth: 1,
    borderRadius: 7,
    width: '100%',
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default TestCreateScreen;
