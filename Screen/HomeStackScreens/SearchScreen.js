import React, {useState, useEffect, createRef, useLayoutEffect} from 'react';

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
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

const SearchScreen = ({route, navigation}) => {
  const {stu_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [stuId, setStuId] = useState();

  const [resultBook, setResultBook] = useState([]);

  const hi = () => {
    alert('hi');
  };

  const getUserid = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    setStuId(userId);
    await console.log('===stu id ==');
    await console.log(stuId);
    return userId;
  };

  const getResult = (stu_id) => {
    fetch(
      'http://192.168.0.4:3001/api/search?' +
        new URLSearchParams({
          title: search,
          stu_id: stu_id,
        }),
      {
        method: 'GET',
      },
    )
      .then((response) => response.json())
      .then((responseJson) => {
        // If server response message same as Data Matched
        if (responseJson.status === 'success') {
          setResultBook(responseJson.data.bookInfo);
          console.log(resultBook);
        }
        //null일 때는 어떻게 해줄 것임?!!!??!?!!안해줘도 Flat list에서 알아서 해주나..
      })
      .catch((error) => {
        //Hide Loader
        // setLoading(false);
        console.error(error);
      });
  };

  useEffect(() => {
    const userId = getUserid();
  }, []);

  useLayoutEffect(() => {
    console.log(route.params);
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => (
        <TextInput
          autoFocus={true}
          blurOnSubmit={true}
          enablesReturnKeyAutomatically={true}
          // onSubmitEditing={alert('hi')}
          selectionColor={'black'}
          style={styles.searchInput}
          clearButtonMode={'while-editing'}
          placeholder={'검색어를 입력해주세요'}
          onChangeText={(search) => setSearch(search)}
          onSubmitEditing={hi}
        />
      ),
    });
  }, []);
  return (
    <View style={styles.container}>
      <Text>this is SearchScreen</Text>
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
  searchInput: {
    height: wp(8),
  },
});

export default SearchScreen;
