import React, {useState, useEffect, createRef, useLayoutEffect} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import {showMessage, hideMessage} from 'react-native-flash-message';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  FlatList,
  SafeAreaView,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

const SearchScreen = ({navigation}) => {
  const preURL = require('../../preURL/preURL');

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [stuId, setStuId] = useState();
  const [isClick, setIsClick] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

  const [resultBook, setResultBook] = useState([]);

  const getUserid = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    setStuId(userId);
    // console.log(stuId);
    return userId;
  };

  const getResult = () => {
    setLoading(true);

    fetch(
      preURL.preURL +
        '/api/search?' +
        new URLSearchParams({
          title: search,
          stu_id: stuId,
        }),
      {
        method: 'GET',
      },
    )
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);

        // If server response message same as Data Matched
        if (responseJson.status === 'success') {
          // console.log(responseJson);
          // console.log(responseJson.data.search_result);
          setResultBook(responseJson.data.search_result);

          console.log('==test==');
          for (var i in resultBook) {
            resultBook[i].isClick = false;
          }
          console.log(resultBook);
        } else if (responseJson.status === 'null') {
          setResultBook([]);
          console.log('null');
        }
      })
      .catch((error) => {
        //Hide Loader
        // setLoading(false);
        console.error(error);
      });
    setLoading(false);
  };

  useEffect(() => {
    const userId = getUserid();
    navigation.setOptions({
      // tabBarVisible: false,
      headerTitleAlign: 'left',
      headerTitle: () => (
        <TextInput
          autoFocus={true}
          blurOnSubmit={true}
          enablesReturnKeyAutomatically={true}
          selectionColor={'black'}
          style={styles.searchInput}
          clearButtonMode={'while-editing'}
          placeholder={'검색어를 입력해주세요'}
          onChangeText={(search) => setSearch(search)}
          onSubmitEditing={getResult}
        />
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            {
              navigation.replace('Home');
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
  });

  const resultBookItems = ({item}) => {
    return (
      <View style={styles.resultitem_container}>
        <View style={styles.resultitem_book_container}>
          <View style={styles.book}>
            <Image source={{uri: item.workbook_photo}} style={styles.bookimg} />
          </View>
        </View>

        <View style={styles.resultitem_info_container}>
          <View style={styles.info_top}>
            <Text style={{fontSize: wp(4.5)}}>{item.workbook_title}</Text>
          </View>
          <View style={styles.info_bottom}>
            {item.isClick && (
              <TouchableOpacity
                style={[styles.btn, styles.grey]}
                disabled={true}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: wp('4%'),
                    fontWeight: 'bold',
                  }}>
                  추가완료
                </Text>
              </TouchableOpacity>
            )}

            {!item.isClick && (
              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  {
                    item.isClick = true;
                    setIsClick(!isClick); //re-render를 위해 넣음! 의미 없음
                    setIsAdd(true);
                    console.log(item);
                    addBook(item.workbook_sn);
                  }
                }}>
                {/*onPress={addBook(item.workbook_sn)}>*/}
                <Text
                  style={{
                    color: 'white',
                    fontSize: wp('4%'),
                    fontWeight: 'bold',
                  }}>
                  추가
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const addBook = (workbook_sn) => {
    setLoading(true);

    var dataToSend = {
      stu_id: stuId,
      workbook_sn: workbook_sn,
    };
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch(preURL.preURL + '/api/search', {
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
        setLoading(false);
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.status === 'success') {
          console.log('inserting book is Successful.');

          //flash message 띄우기
          if (responseJson.data.isWorkbook === true) {
            showMessage({
              message: '"내 문제집"에 문제집이 담겼습니다.',
              type: 'default',
              duration: 2500,
              // autoHide: false,
            });
          } else {
            showMessage({
              message: '"학원 문제집"에 문제집이 담겼습니다.',
              type: 'default',
              duration: 2500,
              // autoHide: false,
            });
          }
        } else {
          console.log('inserting book is fail..');
        }
      })
      .catch((error) => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };

  const emptyBook = () => {
    return (
      <View style={styles.emptyResult}>
        <Icon
          name="warning-outline"
          size={wp(10)}
          style={{height: hp(8), color: 'grey'}}
        />
        <Text style={{fontSize: wp(4), color: 'grey'}}>
          검색결과가 존재하지 않습니다.
        </Text>
      </View>
    );
  };

  //
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitleAlign: 'left',
  //     headerTitle: () => (
  //       <TextInput
  //         autoFocus={true}
  //         blurOnSubmit={true}
  //         enablesReturnKeyAutomatically={true}
  //         selectionColor={'black'}
  //         style={styles.searchInput}
  //         clearButtonMode={'while-editing'}
  //         placeholder={'검색어를 입력해주세요'}
  //         onChangeText={(search) => setSearch(search)}
  //         onSubmitEditing={getResult}
  //       />
  //     ),
  //   });
  // }, []);
  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <View>
          <FlatList
            style={styles.list}
            horizontal={false}
            data={resultBook}
            renderItem={resultBookItems}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={emptyBook()}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, //전체의 공간을 차지한다는 의미
    flexDirection: 'column',
    backgroundColor: 'white',
    // paddingLeft: wp(7),
    // paddingRight: wp(7),
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
    ...Platform.select({
      ios: {
        height: wp(8),
      },
      android: {},
    }),
  },
  list: {
    // paddingLeft: wp(3),
    // paddingRight: wp(3),
  },

  resultitem_container: {
    flex: 1,
    flexDirection: 'row',
    height: hp(25),
    borderBottomWidth: 0.5,
    borderColor: 'lightgrey',
    padding: wp(7),

    ...Platform.select({
      android: {
        width: '100%',
        height: hp(27),
      },
    }),
  },
  resultitem_book_container: {
    flex: 1,
  },
  resultitem_info_container: {
    flex: 2,
    flexDirection: 'column',
  },
  info_top: {
    paddingLeft: wp(4),
    flex: 5,
  },
  info_bottom: {
    flex: 1.3,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  book: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    borderWidth: 0,
    borderRadius: 5,
    shadowColor: '#000',

    elevation: 7,

    ...Platform.select({
      ios: {
        overflow: 'visible',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.15,
        shadowRadius: 9.51,
      },
      android: {
        overflow: 'visible',
      },
    }),
  },
  bookimg: {
    resizeMode: 'cover',
    borderRadius: 5,
    ...Platform.select({
      ios: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
      },
      android: {
        width: '100%',
        height: hp(20),
      },
    }),
  },
  btn: {
    width: wp(25),
    height: '100%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  grey: {
    backgroundColor: '#C1C2CA',
  },

  emptyResult: {
    height: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchScreen;
