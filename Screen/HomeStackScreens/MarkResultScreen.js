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

const MarkResultScreen = ({route, navigation}) => {
  // get params
  const {book_sn, preparedImgages} = route.params;

  const preURL = require('../../preURL/preURL');
  const [loading, setLoading] = useState(false);
  const [s3List, setS3List] = useState([]);

  //이거 배열 하나로 해야갰다.
  const markResults = [
    {
      pb_sn: 6638,
      pb_code: 1,
      sol_sn: 6638,
      is_correct: true,
    },
    {
      pb_sn: 6639,
      pb_code: 2,
      sol_sn: 6639,
      is_correct: true,
    },
    {
      pb_sn: 6640,
      pb_code: 3,
      sol_sn: 6640,
      is_correct: true,
    },
    {
      pb_sn: 6641,
      pb_code: 4,
      sol_sn: 6641,
      is_correct: true,
    },
    {
      pb_sn: 6642,
      pb_code: 5,
      sol_sn: 6642,
      is_correct: true,
    },
    {
      pb_sn: 6643,
      pb_code: 6,
      sol_sn: 6643,
      is_correct: true,
    },
    {
      pb_sn: 6644,
      pb_code: 7,
      sol_sn: 6644,
      is_correct: true,
    },
    {
      pb_sn: 6645,
      pb_code: 8,
      sol_sn: 6645,
      is_correct: true,
    },
    {
      pb_sn: 6646,
      pb_code: 9,
      sol_sn: 6646,
      is_correct: true,
    },
    {
      pb_sn: 6647,
      pb_code: 10,
      sol_sn: 6647,
      is_correct: true,
    },
    {
      pb_sn: 6648,
      pb_code: 11,
      sol_sn: 6648,
      is_correct: true,
    },
    {
      pb_sn: 6649,
      pb_code: 12,
      sol_sn: 6649,
      is_correct: false,
    },
    {
      pb_sn: 6650,
      pb_code: 13,
      sol_sn: 6650,
      is_correct: true,
    },
    {
      pb_sn: 6651,
      pb_code: 14,
      sol_sn: 6651,
      is_correct: true,
    },
    {
      pb_sn: 6652,
      pb_code: 15,
      sol_sn: 6652,
      is_correct: false,
    },
    {
      pb_sn: 6653,
      pb_code: 16,
      sol_sn: 6653,
      is_correct: true,
    },
    {
      pb_sn: 6654,
      pb_code: 17,
      sol_sn: 6654,
      is_correct: true,
    },
    {
      pb_sn: 6655,
      pb_code: 18,
      sol_sn: 6655,
      is_correct: true,
    },
    {
      pb_sn: 6656,
      pb_code: 19,
      sol_sn: 6656,
      is_correct: true,
    },
    {
      pb_sn: 6657,
      pb_code: 20,
      sol_sn: 6657,
      is_correct: true,
    },
    {
      pb_sn: 6658,
      pb_code: 21,
      sol_sn: 6658,
      is_correct: true,
    },
    {
      pb_sn: 6659,
      pb_code: 22,
      sol_sn: 6659,
      is_correct: true,
    },
    {
      pb_sn: 6660,
      pb_code: 23,
      sol_sn: 6660,
      is_correct: false,
    },
    {
      pb_sn: 6661,
      pb_code: 24,
      sol_sn: 6661,
      is_correct: true,
    },
    {
      pb_sn: 6662,
      pb_code: 25,
      sol_sn: 6662,
      is_correct: true,
    },
    {
      pb_sn: 6663,
      pb_code: 26,
      sol_sn: 6663,
      is_correct: true,
    },
    {
      pb_sn: 6664,
      pb_code: 27,
      sol_sn: 6664,
      is_correct: false,
    },
    {
      pb_sn: 6665,
      pb_code: 28,
      sol_sn: 6665,
      is_correct: true,
    },
    {
      pb_sn: 6666,
      pb_code: 29,
      sol_sn: 6666,
      is_correct: false,
    },
    {
      pb_sn: 6667,
      pb_code: 30,
      sol_sn: 6667,
      is_correct: false,
    },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => <Text style={styles.title}>채점결과</Text>,
      headerRight: () => (
        <TouchableOpacity
          style={{paddingRight: wp(10)}}
          onPress={() => {
            {
              navigation.navigate('MarkResultSave', {
                // stu_id: stuId,
              });
            }
          }}>
          {/*<Icon name="search-outline" size={25} />*/}
          <Text style={styles.title}>다음</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  const makes3List = async () => {
    var s3List = [];

    s3List.push(book_sn);

    for (let i = 0; i < preparedImgages.length; i++) {
      console.log(preparedImgages[i].location);
      s3List.push(preparedImgages[i].location);
    }
    return s3List;
  };

  const markImages = async () => {
    setLoading(true);
    const s3List = await makes3List();
    setS3List(s3List);
    setLoading(false);
    //2. 그링크들로 scoring
  };

  useEffect(() => {
    setLoading(true);
    console.log('🥕🥕🥕🥕🥕param 확인!!🥕🥕🥕🥕🥕');
    console.log(book_sn);
    console.log(preparedImgages);
    markImages();
  }, []);

  useEffect(() => {
    console.log('🍟🍟🍟🍟s3List 확인!!🍟🍟🍟🍟');
    console.log(s3List);
  }, [s3List]);

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
      <View style={styles.result_container}>
        <View style={styles.result_container_inner_l}>
          <Text style={styles.tablefont}>문제번호</Text>
        </View>

        <View style={styles.result_container_inner_r}>
          <Text style={styles.tablefont}>결과</Text>
        </View>
      </View>
      <View style={styles.flat_container}>
        <FlatList
          style={styles.list}
          data={markResults}
          renderItem={markResultItems}
          keyExtractor={(item, index) => index.toString()}
        />
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
    fontSize: wp('4%'),
    fontWeight: 'bold',
    paddingLeft: wp(4),
  },

  tablefont: {
    fontSize: wp('4%'),
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
    paddingLeft: wp(7),
    paddingRight: wp(7),
    marginBottom: wp(20),
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
});

export default MarkResultScreen;
