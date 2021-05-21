import React, {useState, useLayoutEffect, useEffect, useRef} from 'react';

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
  FlatList,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';
import {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/Ionicons';

const TestReadScreen = ({navigation}) => {
  const preURL = require('../../preURL/preURL');
  const [loading, setLoading] = useState(false);
  const [incorPbData, setIncorPbData] = useState([]);

  const [delTestindex, setDelTestindex] = useState([]);
  const delNoterefRBSheet = useRef();

  const getUserid = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    return userId;
  };

  //미니모의고사 가져오기
  //localhost:3001/api/test/list?stu_id=samdol
  const getIncorPbdata = async (userId) => {
    const response = await fetch(
      preURL.preURL +
        '/api/test/list?' +
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
        // console.log('====fetch return result====');
        // console.log(responseJson);
        return responseJson.data.test_list;
      } else if (responseJson.status === 'null') {
        return [];
      }
    } else {
      throw new Error('unable to get your Workbook');
    }
  };

  const getIncorPbdataFull = async () => {
    setLoading(true);
    const userId = await getUserid();
    const incorpbData = await getIncorPbdata(userId);

    setIncorPbData(incorpbData);
    setLoading(false);
  };

  // Delete test
  //localhost:3001/api/test/list/'삭제할 미니모의고사 sn'?stu_id=samdol
  const delTest = (stuId, test_sn) => {
    fetch(
      preURL.preURL +
        '/api/test/list' +
        '/' +
        test_sn +
        '?' +
        new URLSearchParams({
          stu_id: stuId,
        }),
      {
        method: 'DELETE',
      },
    )
      .then((response) => response.json())
      .then((responseJson) => {
        //Hide Loader
        // setLoading(false);
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.status === 'success') {
          console.log('deleting test is Successful.');
        } else {
          console.log('deleting test is fail..');
        }
      })
      .catch((error) => {
        //Hide Loader
        // setLoading(false);
        console.error(error);
      });
  };

  const delTestFull = async (test_sn) => {
    setLoading(true);

    const userId = await getUserid();
    const what = await delTest(userId, test_sn);
    const incorpbData = await getIncorPbdata(userId);
    setIncorPbData(incorpbData);

    setLoading(false);

    showMessage({
      message: '선택한 오답노트가 삭제되었습니다.',
      type: 'default',
      duration: 2500,
      // autoHide: false,
    });
  };

  useEffect(() => {
    getIncorPbdataFull();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => (
        <Text style={styles.title}>미니 모의고사 문제보기</Text>
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

  const incorPbItems = ({item}) => {
    return (
      <View style={styles.resultitem_container}>
        <View style={styles.resultitem_title}>
          <Text style={{fontSize: wp(4.5)}}>{item.test_title}</Text>
        </View>

        <View style={styles.btn_container}>
          <TouchableOpacity
            // style={{paddingRight: 20}}
            onPress={() => {
              {
                // setDelPbindex(index);
                // delNoterefRBSheet.current.open();
              }
            }}>
            <Icon name="file-tray-full-outline" size={25} />
          </TouchableOpacity>
        </View>

        <View style={styles.btn_container}>
          <TouchableOpacity
            // style={{paddingRight: 20}}
            onPress={() => {
              {
                setDelTestindex(item.test_sn);
                delNoterefRBSheet.current.open();
              }
            }}>
            <Icon name="trash-outline" size={25} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const emptyPb = () => {
    return (
      <View style={styles.emptyResult}>
        <Icon
          name="warning-outline"
          size={wp(10)}
          style={{height: hp(8), color: 'grey'}}
        />
        <Text style={{fontSize: wp(4), color: 'grey'}}>
          생성된 미니모의고사가 없습니다.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        {/*<Loader loading={loading} />*/}

        {/*삭제 modal*/}
        <RBSheet
          ref={delNoterefRBSheet}
          closeOnDragDown={false}
          closeOnPressMask={true}
          height={hp(22)}
          animationType={'fade'}
          openDuration={30}
          closeDuration={0}
          customStyles={{
            wrapper: {
              backgroundColor: 'rgba(41, 41, 41, 0.5)',
            },
            container: {
              backgroundColor: 'white',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            },
          }}>
          <View style={styles.container}>
            <View style={styles.txtArea}>
              <Text style={{fontWeight: 'bold', fontSize: wp(4)}}>
                선택한 미니모의고사를 삭제하시겠어요?
              </Text>
            </View>
            <View style={styles.btnContainer}>
              <View style={styles.btnArea_l}>
                <TouchableOpacity
                  style={styles.delbtnoutline}
                  onPress={() => {
                    {
                      delNoterefRBSheet.current.close();
                    }
                  }}>
                  <Text>취소</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.btnArea_r}>
                <TouchableOpacity
                  style={styles.delbtn}
                  onPress={() => {
                    {
                      delTestFull(delTestindex);
                      delNoterefRBSheet.current.close();
                    }
                  }}>
                  <Text style={{color: 'white'}}>삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </RBSheet>

        <FlatList
          horizontal={false}
          data={incorPbData}
          renderItem={incorPbItems}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={emptyPb}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, //전체의 공간을 차지한다는 의미
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },

  emptyResult: {
    width: wp(100),
    height: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  item_container: {
    // justifyContent: 'center',
    // alignItems: 'center',
    flex: 1,
    // flexGrow: 0,
  },
  resultitem_container: {
    flex: 1,
    flexDirection: 'row',
    height: hp(9),
    width: wp(100),
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: 'lightgrey',
    paddingLeft: wp(10),
    paddingRight: wp(10),

    ...Platform.select({
      android: {
        width: '100%',
        height: hp(27),
      },
    }),
  },
  resultitem_title: {
    width: wp(63),
  },
  btn_container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(10),
    marginLeft: 2,
  },

  txtArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(2.5),
    ...Platform.select({
      ios: {
        paddingTop: hp(1),
      },
    }),
  },

  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: hp(1.5),

    ...Platform.select({
      ios: {
        paddingBottom: hp(4.5),
      },
    }),
  },
  btnArea_l: {
    // backgroundColor: 'orange',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  btnArea_r: {
    // backgroundColor: 'blue',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    // marginRight: wp(10),
  },

  delbtnoutline: {
    margin: wp(6),
    marginRight: wp(2),
    width: wp(33),
    height: hp(5),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  delbtn: {
    margin: wp(6),
    marginLeft: wp(2),
    width: wp(33),
    height: hp(5),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderWidth: 1,
  },
});

export default TestReadScreen;
