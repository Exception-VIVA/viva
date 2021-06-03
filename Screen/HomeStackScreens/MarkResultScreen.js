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
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';

const MarkResultScreen = ({route, navigation}) => {
  // get params
  const {book_sn, preparedImgages} = route.params;

  const preURL = require('../../preURL/preURL');
  const [loading, setLoading] = useState(false);
  const [s3List, setS3List] = useState([]);
  const [markResults, setMarkResults] = useState([]);
  const [incorrectPbs, setIncorrectPbs] = useState('');
  const [incorrectPbs2, setIncorrectPbs2] = useState('');

  const gosavepage = () => {
    navigation.navigate('MarkResultSave', {
      s3List: s3List,
      markResults: markResults,
      book_sn: book_sn,
      incorrectPbs: incorrectPbs,
    });
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => <Text style={styles.title}>채점결과</Text>,
      // headerRight: () => (
      //   <TouchableOpacity
      //     style={{paddingRight: wp(10)}}
      //     onPress={() => {
      //       {
      //         gosavepage();
      //       }
      //     }}>
      //     {/*<Icon name="search-outline" size={25} />*/}
      //     <Text style={styles.title}>다음</Text>
      //   </TouchableOpacity>
      // ),
    });
  }, []);

  const makes3List = async () => {
    var s3List = '';

    // s3List = s3List.concat(book_sn);

    for (let i = 0; i < preparedImgages.length; i++) {
      s3List = s3List.concat(',', preparedImgages[i].location);
    }

    s3List = s3List.substr(1);
    setS3List(s3List);
    return s3List;
  };

  // http://192.168.0.3:3001/api/scoring
  const markUsingYOLO = async (s3List) => {
    var dataToSend = {
      workbook_sn: book_sn,
      file_name: s3List,
    };
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    const response = await fetch(preURL.preURL + '/api/scoring', {
      method: 'POST',
      body: formBody,
      headers: {
        //Header Defination
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // If server response message same as Data Matched
        if (responseJson.status === 'success') {
          console.log('✨✨✨✨responseJson.data.to_front✨✨✨✨');
          console.log(responseJson.data.to_front);

          var markResultList = [];
          var incorrectPbList = '';

          for (let i = 0; i < responseJson.data.to_front.length; i++) {
            if (responseJson.data.to_front[i].is_correct == false) {
              incorrectPbList = incorrectPbList.concat(
                ',',
                responseJson.data.to_front[i].pb_sn,
              );
            }

            markResultList.push({
              pb_code: responseJson.data.to_front[i].pb_code,
              is_correct: responseJson.data.to_front[i].is_correct,
            });
          }
          // incorrectPbList = incorrectPbList.substr(1);

          setMarkResults(markResultList);
          setIncorrectPbs(incorrectPbList);

          setLoading(false);
          return responseJson.data.to_front;
        } else {
          setLoading(false);
          console.log('yolo Mark is failed..');
        }
      })
      .catch((error) => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };

  const makeMarkResultList = async (markresult) => {
    var markResultList = [];

    for (let i = 0; i < markresult.length; i++) {
      markResultList.push({
        pb_code: markresult[i].pb_code,
        is_correct: markresult[i].is_correct,
      });
    }
    return markResultList;
  };

  const markImages = async () => {
    const s3List = await makes3List();

    const yoloresult = await markUsingYOLO(s3List);
    console.log('==yoloresult');
    console.log(yoloresult);

    // const markresultList = await makeMarkResultList(yoloresult);
    // setMarkResults(markresultList);
    //2. 그링크들로 scoring
  };

  useEffect(() => {
    console.log('==booksn');
    console.log(book_sn);
    setLoading(true);
    markImages();
  }, []);

  //flat list item
  const markResultItems = ({item, index}) => {
    return (
      <View style={styles.tablerow}>
        <View style={styles.tablecol_l}>
          <Text
            style={{
              fontSize: wp(4),
            }}>
            {item.pb_code}
          </Text>
        </View>
        <View style={styles.tablecol_r}>
          {item.is_correct == true && (
            <Text
              style={{
                fontSize: wp(5),
                fontWeight: 'bold',
                color: '#1976D2',
              }}>
              O
            </Text>
          )}
          {item.is_correct == false && (
            <Text
              style={{
                fontSize: wp(5),
                fontWeight: 'bold',
                color: '#E53935',
              }}>
              X
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} />

      {loading && (
        <View
          style={{
            height: hp(100),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.title}>채점중...</Text>
        </View>
      )}

      {!loading && (
        <View style={styles.result_container}>
          <View style={styles.result_container_inner_l}>
            <Text style={styles.tablefont}>문제번호</Text>
          </View>

          <View style={styles.result_container_inner_r}>
            <Text style={styles.tablefont}>결과</Text>
          </View>
        </View>
      )}

      {!loading && (
        <View style={styles.flat_container}>
          <FlatList
            style={styles.list}
            data={markResults}
            renderItem={markResultItems}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}

      <View style={styles.createbtnContainer}>
        <TouchableOpacity
          style={styles.btn_round}
          onPress={() => {
            {
              gosavepage();
            }
          }}>
          <Text style={{fontSize: wp(4), fontWeight: 'bold', color: 'white'}}>
            다음
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    fontSize: wp('5'),
    fontWeight: 'bold',
    paddingLeft: wp(4),
  },

  tablefont: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },

  result_container: {
    height: hp(6),
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: wp(7),
    marginLeft: wp(7),
    marginTop: wp(5),
  },
  result_container_inner_l: {
    width: wp(25),
    borderRightWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  result_container_inner_r: {
    width: wp(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  flat_container: {
    height: hp(60),
    paddingLeft: wp(7),
    paddingRight: wp(7),
    marginBottom: wp(10),
  },

  tablerow: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: hp(7),
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  tablecol_l: {
    width: wp(25),
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#E0E0E0',
  },
  tablecol_r: {
    width: wp(60),

    alignItems: 'center',
    justifyContent: 'center',
  },
  btn_round: {
    height: wp(10),
    width: wp(30),
    borderRadius: 400,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'black',
  },
  createbtnContainer: {
    height: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MarkResultScreen;
