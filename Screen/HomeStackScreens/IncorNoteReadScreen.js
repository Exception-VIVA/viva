import React, {
  useState,
  createRef,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';

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
  SafeAreaView,
  Dimensions,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/Ionicons';

import RBSheet from 'react-native-raw-bottom-sheet';
import {showMessage} from 'react-native-flash-message';
import 'react-native-gesture-handler';
import AutoHeightImage from 'react-native-auto-height-image';

const IncorNoteReadScreen = ({route, navigation}) => {
  const {note_sn, note_name} = route.params;

  const preURL = require('../../preURL/preURL');
  const [loading, setLoading] = useState(false);
  const [incorPbData, setIncorPbData] = useState([]);
  const [delPbindex, setDelPbindex] = useState([]);

  const delNoterefRBSheet = useRef();

  const getUserid = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    return userId;
  };

  const getIncorPbdata = async (userId) => {
    const response = await fetch(
      preURL.preURL +
        '/api/incor-note-content?' +
        new URLSearchParams({
          stu_id: userId,
          note_sn: note_sn,
        }),
      {
        method: 'GET',
      },
    );
    if (response.status === 200) {
      const responseJson = await response.json();
      if (responseJson.status === 'success') {
        // console.log('====fetch return result====');
        // console.log(responseJson.data.pb_info);
        return responseJson.data.pb_info;
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

  //localhost:3001/api/incor-note-content/0?note_sn=1&stu_id=samdol
  //문제 삭제하기
  const delPb = (stuId) => {
    fetch(
      preURL.preURL +
        '/api/incor-note-content' +
        '/' +
        delPbindex +
        '?' +
        new URLSearchParams({
          stu_id: stuId,
          note_sn: note_sn, //navigation param으로 받아온
        }),
      {
        method: 'DELETE',
      },
    )
      .then((response) => response.json())
      .then((responseJson) => {
        //Hide Loader
        // setLoading(false);
        // console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.status === 'success') {
          console.log('deleting pb is Successful.');
        } else {
          console.log('deleting pb is fail..');
        }
      })
      .catch((error) => {
        //Hide Loader
        // setLoading(false);
        console.error(error);
      });
  };

  const delPbFull = async () => {
    setLoading(true);

    const userId = await getUserid();
    const what = await delPb(userId);

    //rerender
    const incorpbData = await getIncorPbdata(userId);
    setIncorPbData(incorpbData);
    setLoading(false);

    setLoading(false);

    showMessage({
      message: '문제가 삭제되었습니다.',
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
      headerTitle: () => <Text style={styles.ft_title2}>{note_name}</Text>,
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
  }, []);

  const incorPbItems = ({item, index}) => {
    return (
      <View nestedScrollEnabled={true} style={styles.item_container}>
        <View style={styles.item_title_pb}>
          <Text style={styles.ft_title2}>문제</Text>
          <TouchableOpacity
            // style={{paddingRight: 20}}
            onPress={() => {
              {
                setDelPbindex(index);
                delNoterefRBSheet.current.open();
              }
            }}>
            <Icon name="trash-outline" size={27} style={{}} />
          </TouchableOpacity>
        </View>

        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={{
            alignItems: 'center',
          }}
          contentInset={{top: 0}}
          style={styles.pb_container}>
          <AutoHeightImage
            source={{uri: item.pb_img}}
            style={styles.pb_img}
            width={wp(90)}
          />
        </ScrollView>

        <View style={styles.item_title}>
          <Text style={styles.ft_title2}>답</Text>
        </View>

        <View style={styles.ans_container}>
          <Text style={{fontSize: wp(5)}}>{item.sol_ans}</Text>
        </View>

        <View style={styles.item_title}>
          <Text style={styles.ft_title2}>풀이</Text>
        </View>

        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={{
            alignItems: 'center',
          }}
          contentInset={{top: 0}}
          style={styles.pb_container}>
          <AutoHeightImage
            source={{uri: item.sol_img}}
            style={styles.pb_img}
            width={wp(90)}
          />
        </ScrollView>

        <View style={styles.page_indicatorContainer}>
          <View style={styles.page_indicator}>
            <Text style={styles.ft_pageIC}>
              {index + 1} / {incorPbData.length}
            </Text>
          </View>
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
          오답노트가 비어있습니다.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <FlatList
        style={styles.list}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        data={incorPbData}
        renderItem={incorPbItems}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={emptyPb}
      />
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
              이 문제를 오답노트에서 삭제하시겠어요?
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
                    delPbFull();
                    delNoterefRBSheet.current.close();
                  }
                }}>
                <Text style={{color: 'white'}}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexGrow: 0,
    backgroundColor: 'white',
    paddingTop: wp(4),
  },

  item_container: {
    // justifyContent: 'center',
    // alignItems: 'center',
    flex: 1,
    // flexGrow: 0,
  },

  item_title_pb: {
    flexDirection: 'row',
    paddingLeft: wp(4),
    paddingRight: wp(4),
    marginBottom: hp(1),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item_title: {
    paddingLeft: wp(4),
    paddingRight: wp(4),
    marginBottom: hp(1),
    height: hp(3),
    justifyContent: 'center',
  },
  pb_container: {
    marginRight: wp(4),
    marginLeft: wp(4),
    marginBottom: hp(2),
    paddingTop: hp(1),
    width: wp(92),
    height: hp(25),
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'rgba(0,0,0,0.3)',
  },
  pb_img: {
    // paddingTop: hp(1),
    // resizeMode: 'contain',
    // width: wp(90),
    // height: wp(200),
    // justifyContent: 'flex-start',
    // alignContent: 'flex-start',
  },

  ans_container: {
    justifyContent: 'center',
    paddingLeft: wp(3),
    marginRight: wp(4),
    marginLeft: wp(4),
    marginBottom: hp(2),
    width: wp(92),
    height: hp(5),
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'rgba(0,0,0,0.3)',
  },

  page_indicatorContainer: {
    flex: 1.5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  page_indicator: {
    backgroundColor: 'black',
    width: wp(20),
    height: wp(7),
    borderRadius: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ft_title: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
  ft_title2: {
    fontSize: wp('5'),
    fontWeight: 'bold',
  },
  ft_pageIC: {
    color: 'white',
    fontSize: wp(4),
  },

  emptyResult: {
    width: wp(100),
    height: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
  },

  //삭제 modal
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

export default IncorNoteReadScreen;
