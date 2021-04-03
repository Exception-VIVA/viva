import React, {useState, createRef, useLayoutEffect, useEffect} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';
import Loader from '../Components/Loader';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';

const ProfileEditScreen = ({route, navigation}) => {
  const preURL = require('../../preURL/preURL');

  const nameInputRef = createRef();
  const gradeInputRef = createRef();

  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userGrade, setUserGrade] = useState('');
  const [userPhoto, setUserPhoto] = useState('');

  const getUserid = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    return userId;
  };

  const getUserdata = async (userId) => {
    const response = await fetch(
      preURL.preURL +
        '/api/home?' +
        new URLSearchParams({
          stu_id: userId,
        }),
      {
        method: 'GET',
      },
    );

    if (response.status === 200) {
      const responseJson = await response.json();
      return responseJson.data.retrievedUser;
    } else {
      throw new Error('unable to get your User');
    }
  };

  const placeholder = {
    label: '학년을 입력해주세요',
    value: null,
    color: '#9EA0A4',
  };

  const getMultidata = async () => {
    const userId = await getUserid();
    const userdata = await getUserdata(userId);
    setUserName(userdata.stu_nick);
    setUserGrade(userdata.stu_grade);
    setUserPhoto(userdata.stu_photo);

    setLoading(false);

    return userdata;
  };

  useEffect(() => {
    console.log(route.params);
    setLoading(true);
    getMultidata();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => <Text style={styles.title}>프로필 수정</Text>,
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
      headerRight: () => (
        <TouchableOpacity
          // style={{paddingRight: 20}}
          onPress={() => {
            {
              navigation.navigate('ProfileEdit');
            }
          }}>
          <Text style={styles.editbtn}>완료</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.imgContainer}>
        <Image source={{uri: userPhoto}} style={styles.profileimg} />
        <View style={styles.uploadBtn}>
          <TouchableOpacity
            // style={{paddingRight: 20}}
            onPress={() => {
              // navigation.navigate('ProfileEdit');
            }}>
            <Icon name="image-outline" size={25} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.formInfoTxt}>닉네임</Text>
        <TextInput
          editable={true}
          style={styles.textForm}
          placeholder={userName}
          placeholderTextColor="black"
          onChangeText={(userName) => setUserName(userName)}
          ref={nameInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            gradeInputRef.current && gradeInputRef.current.focus()
          }
          blurOnSubmit={false}
        />

        <Text style={styles.formInfoTxt}>학년</Text>

        <RNPickerSelect
          useNativeAndroidPickerStyle={false}
          style={pickerSelectStyles}
          onValueChange={(userGrade) => setUserGrade(userGrade)}
          placeholder={placeholder}
          items={[
            {label: '1학년', value: 1},
            {label: '2학년', value: 2},
            {label: '3학년', value: 3},
          ]}
        />
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
  },

  title: {
    fontSize: wp(4),
    fontWeight: 'bold',
  },

  editbtn: {
    fontSize: wp(4),
    paddingRight: wp(4),
  },

  imgContainer: {
    height: hp(30),
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileimg: {
    resizeMode: 'cover',
    width: wp(40),
    height: wp(40),
    borderRadius: 400,
    borderColor: '#E0E0E0',
  },

  uploadBtn: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 400,
    position: 'absolute',
    left: 210,
    top: 160,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8.3,

    elevation: 14,
  },

  formContainer: {
    marginBottom: hp(3),
    justifyContent: 'center',
  },

  textForm: {
    borderBottomWidth: 1,
    borderColor: 'black',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    width: '100%',
    height: hp(6),
    paddingRight: 10,
    fontSize: wp(4),
    marginBottom: 30,
  },

  formInfoTxt: {
    fontSize: wp(4),
    color: 'grey',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderBottomWidth: 1,
    borderColor: 'black',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    width: '100%',
    height: hp(6),
    paddingRight: 10,
    fontSize: wp(4),
    marginBottom: 30,
  },

  inputAndroid: {
    borderBottomWidth: 1,
    borderColor: 'black',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    width: '100%',
    height: hp(6),
    paddingRight: 10,
    fontSize: wp(4),
    marginBottom: 30,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});

export default ProfileEditScreen;
