> viva의 프론트엔드 리포지토리입니다.

# 🥣 프로젝트 개요
<img src="https://user-images.githubusercontent.com/55133794/121149497-ac2c8c80-c87d-11eb-9084-1a158cdecb50.png" width="200">

> 딥러닝 기반 언택트 학습 도우미 - 자동 채점 및 오답노트 생성
> 
> 

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

# 🥣 프론트엔드 기능 구현 사항

`React Native`를 이용하여 `프론트엔드`를 개발하였습니다.

>  ✨[demo video](https://youtu.be/8xtAMVeu-S0 )<br/>
>  ✨[기술블로그](https://velog.io/@inryu?tag=%EC%A1%B8%EC%97%85%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8)


## 주요 기능
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
    - 오답노트 생성 
    - 확인 메세지 출력
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

## 주요 기술
- `react native rectangle scanner`
- `react-native-responsive-screen`
- `async-storage`
- `react-native-raw-bottom-sheet`
- `react-native-flash-message`
- `react-native-auto-height-image`
- `react-native-html-to-pdf`
- `react-native-share`
<br/>
  
# 🥣 React Native navigator 구조, Screen 구성

root가 되는 StackNavigator안에 `Stack Navigator`와 `Tab Navigator`을 쌓는 구조입니다.
이때 `Tab Navigator`내부는 `Stack Navigator` 3가지로 이루어지며, 각 `Stack Navigator`안에 `Screen`이 존재합니다.
> code : https://github.com/Inryu/viva/blob/main/App.js

![](https://images.velog.io/images/inryu/post/4eaae849-0b34-4a4e-b52c-2745b68596cd/image.png)

![](https://images.velog.io/images/inryu/post/b6a15cf6-52f6-4536-a8e6-09950379216f/image.png)


# 🥣 결과 화면

### ✨회원가입, 로그인
![1  회원가입, 로그인](https://user-images.githubusercontent.com/55133794/121143232-cd8a7a00-c877-11eb-94c9-5fb4b0d44036.gif)
### ✨마이 VIVA
![2  마이비바](https://user-images.githubusercontent.com/55133794/121143304-e135e080-c877-11eb-931d-8b3a77680d89.gif)
### ✨문제집 검색, 추가
![3  문제집 추가](https://user-images.githubusercontent.com/55133794/121143377-f579dd80-c877-11eb-80ba-33d8cf7863f8.gif)
### ✨오답노트 생성
![4 오답노트생성(320](https://user-images.githubusercontent.com/55133794/121143037-9025ec80-c877-11eb-8f7f-aae3c6925cbd.gif)
### ✨채점 과정
![5  채점과정](https://user-images.githubusercontent.com/55133794/121144158-b730ee00-c878-11eb-95e8-72a86bb664b9.gif)
### ✨채점결과 확인
![6  채점결과 확인](https://user-images.githubusercontent.com/55133794/121144154-b6985780-c878-11eb-8502-c913570fdfd5.gif)
### ✨채점결과 오답노트로 내보내기, pdf 내보내기
![7 채점결과 오답노트 저장, pdf 내보내기 gif](https://user-images.githubusercontent.com/55133794/121145251-b77db900-c879-11eb-9e41-5fb85924f382.gif)
### ✨오답노트 확인
![8  오답노트 확인](https://user-images.githubusercontent.com/55133794/121146244-b39e6680-c87a-11eb-8b86-8af8031a671d.gif)
### ✨오답노트 pdf 내보내기
![9  오답노트 pdf 내보내기](https://user-images.githubusercontent.com/55133794/121146251-b4cf9380-c87a-11eb-9f4f-1c3daec747c8.gif)
### ✨미니모의고사 생성
![10  미니 모의고사 생성](https://user-images.githubusercontent.com/55133794/121148061-658a6280-c87c-11eb-9768-df04186543b7.gif)
### ✨미니모의고사 확인
![11  미니모의고사 문제 확인](https://user-images.githubusercontent.com/55133794/121148063-6622f900-c87c-11eb-876e-f8795c72f4cd.gif)
### ✨미니모의고사 pdf 내보내기
![12  미니모의고사 pdf 내보내기](https://user-images.githubusercontent.com/55133794/121148065-66bb8f80-c87c-11eb-9ee9-eabce874b56c.gif)




