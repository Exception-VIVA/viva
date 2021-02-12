import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';

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
  FlatList,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import RBSheet from 'react-native-raw-bottom-sheet';

const HomeScreen = ({navigation}) => {
  const preURL = require('../../preURL/preURL');

  const [userData, setUserData] = useState([]);
  const [workbookData, setWorkbookData] = useState([]);
  const [acabookData, setAcabookData] = useState([]);
  const [incornoteData, setIncornoteData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBook, setCurrentBook] = useState([]);
  const [stuId, setStuId] = useState('');

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

  const getWorkbookdata = async (userId) => {
    const response = await fetch(
      preURL.preURL +
        '/api/home/workbook?' +
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
        return responseJson.data.bookInfo;
      } else if (responseJson.status === 'null') {
        return [];
      }
    } else {
      throw new Error('unable to get your Workbook');
    }
  };

  const getAcabookdata = async (userId) => {
    const response = await fetch(
      preURL.preURL +
        '/api/home/academy?' +
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
        return responseJson.data.bookInfo;
      } else if (responseJson.status === 'null') {
        return [];
      }
    } else {
      throw new Error('unable to get your Workbook');
    }
  };
  const getIncornotedata = async (userId) => {
    const response = await fetch(
      preURL.preURL +
        '/api/home/incor-note?' +
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
        return responseJson.data.bookInfo;
      } else if (responseJson.status === 'null') {
        return [];
      }
    }
  };

  //assemble multi Apifetch functions
  const getMultidata = async () => {
    const userId = await getUserid();
    setStuId(userId);
    const userdata = await getUserdata(userId);
    setUserData(userdata);

    const workbookdata = await getWorkbookdata(userId);
    setWorkbookData(workbookdata);

    const acabookdata = await getAcabookdata(userId);
    setAcabookData(acabookdata);
    await getIncornotedata(userId);
    const incornotedata = await getIncornotedata(userId);
    setIncornoteData(incornotedata);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getMultidata();
  }, []);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     setLoading(true);
  //     getMultidata();
  //   });
  //   return unsubscribe;
  // }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{paddingRight: 20}}
          onPress={() => {
            {
              navigation.navigate('Search', {
                stu_id: stuId,
              });
            }
          }}>
          <Icon name="search-outline" size={25} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const refRBSheet = useRef();

  const workbookItems = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.book}
        onPress={() => {
          // console.log(userData);
          setCurrentBook(item);
          refRBSheet.current.open();
        }}>
        <Image source={{uri: item.workbook_photo}} style={styles.bookimg} />
      </TouchableOpacity>
    );
  };

  const academyItems = ({item}) => {
    return (
      <TouchableOpacity style={styles.book}>
        <Image source={{uri: item.workbook_photo}} style={styles.bookimg} />
      </TouchableOpacity>
    );
  };

  const incornoteItems = ({item}) => {
    return (
      <TouchableOpacity style={styles.book}>
        <Image source={{uri: item.note_photo}} style={styles.bookimg} />
      </TouchableOpacity>
    );
  };

  const plusBook = () => {
    return (
      <TouchableOpacity
        style={styles.book}
        onPress={() => {
          {
            navigation.navigate('Search', {
              stu_id: stuId,
            });
          }
        }}>
        <Image
          source={require('../../src/plus-book.png')}
          style={styles.bookimg}
        />
      </TouchableOpacity>
    );
  };

  const plusNote = () => {
    return (
      <TouchableOpacity style={styles.book}>
        <Image
          source={require('../../src/plus-book.png')}
          style={styles.bookimg}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.container_profile}>
        <View style={styles.container_profileimg}>
          <Image source={{uri: userData.stu_photo}} style={styles.profileimg} />
        </View>
        <View style={styles.container_profiletxt}>
          <View style={styles.profiletxt_name}>
            <Text style={{fontSize: wp('4.5'), fontWeight: 'bold'}}>
              {userData.stu_nick}
            </Text>
          </View>

          <View style={styles.profiletxt_grade}>
            {userData != [] && (
              <Text style={{fontSize: wp('4'), color: 'grey'}}>
                고등학교 {userData.stu_grade}학년
              </Text>
            )}
          </View>
        </View>
      </View>

      <ScrollView style={{flex: 1}}>
        {/*내 문제집*/}
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={hp(28)}
          animationType={'fade'}
          openDuration={30}
          closeDuration={30}
          customStyles={{
            wrapper: {
              backgroundColor: 'rgba(41, 41, 41, 0.5)',
            },
            container: {
              backgroundColor: 'white',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
          }}>
          <View style={styles.container}>
            <View style={styles.txtArea}>
              <Text style={{fontWeight: 'bold', fontSize: wp(4)}}>
                {currentBook.workbook_title}
              </Text>
            </View>
            <View style={styles.btnArea}>
              <TouchableOpacity
                style={styles.btnoutline}
                onPress={() => {
                  {
                    navigation.navigate('Mark', {
                      currentBooksn: currentBook.workbook_sn,
                    });
                    refRBSheet.current.close();
                  }
                }}>
                <Text>채점하기</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnArea}>
              <TouchableOpacity style={styles.btn}>
                <Text style={{color: 'white'}}>상세보기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
        <View style={styles.container_bookheader}>
          <View style={styles.container_bookctgtitle}>
            <Text style={styles.titleText}>내 문제집</Text>
          </View>
          <View style={styles.container_bookbtn}>
            <TouchableOpacity
              onPress={() => {
                {
                  navigation.navigate('MyBook', {
                    stu_id: stuId,
                  });
                }
              }}>
              <Icon name="chevron-forward-outline" size={25} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.container_book]}>
          <FlatList
            style={styles.list}
            horizontal={true}
            data={Object.values(workbookData)}
            renderItem={workbookItems}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={plusBook()}
          />
        </View>

        {/*학원 문제집*/}
        <View style={styles.container_bookheader}>
          <View style={styles.container_bookctgtitle}>
            <Text style={styles.titleText}>학원 문제집</Text>
          </View>
          <View style={styles.container_bookbtn}>
            <TouchableOpacity
              onPress={() => {
                {
                  navigation.navigate('AcademyBook', {
                    stu_id: stuId,
                  });
                }
              }}>
              <Icon name="chevron-forward-outline" size={25} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.container_book]}>
          <FlatList
            style={styles.list}
            horizontal={true}
            data={Object.values(acabookData)}
            renderItem={academyItems}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={plusBook()}
          />
        </View>

        {/*오답노트*/}
        <View style={styles.container_bookheader}>
          <View style={styles.container_bookctgtitle}>
            <Text style={styles.titleText}>오답노트</Text>
          </View>
          <View style={styles.container_bookbtn}>
            <TouchableOpacity
              onPress={() => {
                {
                  navigation.navigate('IncorNote', {
                    stu_id: stuId,
                  });
                }
              }}>
              <Icon name="chevron-forward-outline" size={25} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.container_book]}>
          <FlatList
            style={styles.list}
            horizontal={true}
            data={Object.values(incornoteData)}
            renderItem={incornoteItems}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={plusNote()}
          />
        </View>
      </ScrollView>
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
  container_profile: {
    // flex: 0.15,
    height: hp(10),
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  container_profileimg: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: wp(1),
  },
  profileimg: {
    resizeMode: 'cover',
    width: wp(15),
    height: wp(15),
    borderRadius: 400,
    borderColor: '#E0E0E0',
  },

  container_profiletxt: {
    flexDirection: 'column',
    flex: 4,
    paddingLeft: wp(2),
  },

  profiletxt_name: {
    justifyContent: 'center',
    flex: 1,
    // backgroundColor: 'pink',
    paddingTop: hp(2),
  },
  profiletxt_grade: {
    justifyContent: 'center',
    flex: 1,
    paddingBottom: hp(2),
  },

  container_book: {
    // flex: 3,
    height: hp(22),
    borderBottomColor: '#E0E0E0',
  },
  container_bookheader: {
    width: wp(100),
    flexDirection: 'row',
    height: hp(6),
    justifyContent: 'space-between',
  },

  container_bookctgtitle: {
    width: wp(30),
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: wp(7),
  },

  container_bookbtn: {
    paddingRight: wp(1),
    width: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },

  first: {
    backgroundColor: 'lightgoldenrodyellow',
  },
  second: {
    backgroundColor: 'lightgrey',
  },
  third: {
    backgroundColor: 'lightpink',
  },

  book: {
    flex: 1,
    alignItems: 'center',
    marginTop: 0,
    borderWidth: 0,
    borderRadius: 5,
    shadowColor: '#000',

    elevation: 7,

    ...Platform.select({
      ios: {
        margin: wp(3),
        marginBottom: wp(5),
        overflow: 'visible',
        width: wp(32),
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
        margin: wp(3),
        width: wp(29),
      },
    }),
  },
  bookimg: {
    resizeMode: 'cover',
    borderRadius: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.13,
    shadowRadius: 8,

    ...Platform.select({
      ios: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
      },
      android: {
        width: '100%',
        height: '100%',
      },
    }),
  },

  list: {
    paddingLeft: wp(3),
    paddingRight: wp(3),
  },

  titleText: {
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  txtArea: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnArea: {
    flex: 1,
    // height: hp(7),
    // backgroundColor: 'orange',
    // justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: hp(1.5),
  },

  btn: {
    margin: wp(6),
    marginTop: 0,
    flex: 1,
    width: wp(75),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  btnoutline: {
    margin: wp(6),
    marginBottom: 0,
    flex: 1,
    width: wp(75),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
  },
});
export default HomeScreen;
