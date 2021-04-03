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

const ProfileScreen = ({navigation}) => {
  const preURL = require('../../preURL/preURL');

  const nameInputRef = createRef();
  const gradeInputRef = createRef();

  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const getMultidata = async () => {
    const userId = await getUserid();
    const userdata = await getUserdata(userId);
    setUserData(userdata);

    setLoading(false);

    return userdata;
  };

  useEffect(() => {
    setLoading(true);
    getMultidata();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => <Text style={styles.title}>마이 VIVA</Text>,
      headerRight: () => (
        <TouchableOpacity
          // style={{paddingRight: 20}}
          onPress={() => {
            {
              navigation.navigate('ProfileEdit');
            }
          }}>
          <Text style={styles.editbtn}>수정하기</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.imgContainer}>
        <Image source={{uri: userData.stu_photo}} style={styles.profileimg} />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.formInfoTxt}>닉네임</Text>
        <TextInput
          editable={false}
          style={styles.textForm}
          placeholder={userData.stu_nick}
          placeholderTextColor="black"
          // onChangeText={(userId) => setUserId(userId)}
          ref={nameInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            gradeInputRef.current && gradeInputRef.current.focus()
          }
          blurOnSubmit={false}
        />

        <Text style={styles.formInfoTxt}>학년</Text>
        <TextInput
          editable={false}
          style={styles.textForm}
          placeholder={userData.stu_grade.toString() + '학년'}
          placeholderTextColor="black"
          // onChangeText={(userId) => setUserId(userId)}
          ref={nameInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            gradeInputRef.current && gradeInputRef.current.focus()
          }
          blurOnSubmit={false}
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
    paddingLeft: wp(2),
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

export default ProfileScreen;
