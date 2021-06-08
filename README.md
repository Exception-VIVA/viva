# 🥣 프로젝트 개요
> 딥러닝 기반 언택트 학습 도우미 - 자동 채점 및 오답노트 생성

## 개발 배경

언택트시대에 선생님-학생 사이에서 숙제검사를 할 때 다음과 같은 프로세스로 진행됩니다.

1. 학생 : 문제집 촬영, 메신저를 통해 전송
2. 선생님 : 사진 다운로드 후 채점
3. 선생님 : 채점 후 학생의 학습 데이터 수집 및 피드백 전송
4. 학생 : 피드백에 대해 오답노트를 작성하는 등 추후 학습

이는 불필요한 과정이 중복되며 인력낭비를 발생시킵니다.
따라서 인적 자원을 절약하고 학원의 학생 관리가 용이할 수 있도록
수학 문제집 자동채점 및 오답노트 생성 앱 서비스(이하 `VIVA`)를 제안하게 되었습니다.


## 주요 기능

- 문제집 검색 및 추가
- 카메라 촬영을 통한 문서 스캔, 자동 채점
- 자동 오답노트 생성
- 개인 데이터를 이용한 맞춤형 문제 추천


<br/>

# 🥣 프론트 엔드 기능 구현 사항

`React Native`를 이용하여 `프론트엔드`를 개발하였습니다.


- **백엔드 연결**
    - `fetch`, `await/async` 이용

- **Splash 페이지**
    - 앱 실행 시, 회원가입 & 로그인페이지로 갈 지, Main페이지로 갈 지 결정
    - `ActivityIndicator`를 이용하여 로딩 애니메이션 구현
    - `AsyncStorage`를 이용한 로그인 여부 확인
- **Main 페이지** <br/>
  문제집 검색 및 추가, 채점하기 등의 전반적인 모든 기능
    - 내 문제집, 학원 교재, 오답노트 레이아웃
    - 내 문제집 리스트, 학원 교재 리스트
    - 오답노트 보기
    - 문제집 검색 및 추가
    - 오답노트 생성 `react-native-raw-bottom-sheet`
    - 확인 메세지 출력 `react-native-flash-message`
    - 문제집 채점하기
        - 카메라를 이용해 스캔
        - [react native rectangle scanner](https://www.npmjs.com/package/react-native-rectangle-scanner) 를 이용해 직사각형 인식 후 촬영
- **회원가입 & 로그인 페이지**

    - 로그인, 회원가입
- **맞춤형 문제 추천 (=미니 모의고사) 페이지**

    - 오답노트 선택 하여 그 기반으로 문제 추천, 미니모의고사 생성
    - 내 미니모의고사 리스트
- **마이페이지**
    - 내 정보 확인
    - 내 정보 수정
        - 사진 : `FormData`로 전송하여 AWS S3에 업로드
        - 닉네임
        - 학년


# 🥣 React Native navigator 구조, Screen 구성

root가 되는 StackNavigator안에 `Stack Navigator`와 `Tab Navigator`을 쌓는 구조입니다.
이때 `Tab Navigator`내부는 `Stack Navigator` 3가지로 이루어지며, 각 `Stack Navigator`안에 `Screen`이 존재합니다.
> code : https://github.com/Inryu/viva/blob/main/App.js

![](https://images.velog.io/images/inryu/post/4eaae849-0b34-4a4e-b52c-2745b68596cd/image.png)

![](https://images.velog.io/images/inryu/post/b6a15cf6-52f6-4536-a8e6-09950379216f/image.png)


# 🥣 결과 화면

### 회원가입, 로그인
![1  회원가입, 로그인](https://user-images.githubusercontent.com/55133794/121141251-bc406e00-c875-11eb-965a-acbf7739f31c.gif)


### 마이 VIVA
![2  마이비바](https://user-images.githubusercontent.com/55133794/121141114-91eeb080-c875-11eb-8b66-1c3fc1f3c631.gif)


### 문제집 검색, 추가
![3  문제집 추가](https://user-images.githubusercontent.com/55133794/121141857-628c7380-c876-11eb-984a-b5ea748c1655.gif)





>  ✨[demo video](https://youtu.be/8xtAMVeu-S0 )<br/>
>  ✨[기술블로그](https://velog.io/@inryu?tag=%EC%A1%B8%EC%97%85%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8) 
