import React from 'react';
import {Image} from 'react-native';
import App from '../../App';

const SearchAddBtn = () => {
  return (
    <Image
      source={require('../../src/back-btn.png')}
      style={{marginLeft: 10, width: 22, height: 22}}
    />
  );
};
export default SearchAddBtn;
