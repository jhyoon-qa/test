---
id: doc24
title: Selenium 실전편 Part 02

---

## Selenium - 007 - Selenium 실전편 Part 02

이 글에서 예시로 사용되는 정보는 다음과 같다.

- Python 3.7.7
- Selenium 3.141.0
- Pytest 6.2.1





```목차```

1. [임의의 사이트 선정 및 자동화할 영역, 기능등에 대한 범위 선정](https://qa-linesong.netlify.app/docs/doc23)
2. **테스트 자동화 스크립트의 형상관리 & POM 구조 작성**
3. 로케이터 및 페이지 작성
4. 자동화 스크립트 작성 (테스트 케이스, 테스트 시나리오)





### 1) 테스트 자동화 스크립트 형상관리



테스트 자동화 스크립트 역시, 형상관리가 필요하다. 여러명이 협업하여 작성하는 경우도 있거니와

test, dev, master 같은 개발 브랜치 전략이 존재한다면 그에 따른 테스트 데이터 셋이나 여러 정보 또는

각 브랜치와 연동되어 있는 서버에 따라 테스트 범위가 달라질 수도 있기 때문이다.

상세한 내용은 추후 다시 다루도록 한다.





### 2) POM 구조 작성

이전에 설명한 POM 구조를 여기에서도 적용 해보고자 한다.

이전글 [Page Object Model (POM)](https://qa-linesong.netlify.app/docs/doc22) 은 개념을 설명하고자 Google 예시로 든 것이고 필자는 다른 형태의 POM 구조를 선호 한다. 

어차피, POM 이라는 개념은 동일하고 구조만 필자 편할대로 하는거라 크게 신경 쓸 필요는 없다.



필자는 하기 예시와 같은 방법으로 POM 구조를 구성하여 테스트 자동화를 구축하고 있다.



```POM 구조 예시```

```python
Project-Directory
     |- Config
		|- config.py
     |- Drivers
		|- chromedriver.exe
		|- geckodriver.exe
		|- ETC..
     |- Locator
		|- locator_ex_001.py
		|- locator_ex_002.py
		|- locator_ex_003.py
     |- Pages
		|- page_Base.py
		|- page_locator_ex_002.py
		|- page_locator_ex_002.py
     |- Tests
    	|- TEST_BASIC
        	|- BASIC_test_*.py
        |- TEST_SCENARIO
        	|- SCENARIO_test_*.py
```



- Config : 공통으로 사용하는 정보를을 모아 놓는 폴더라고 생각하면 될것 같다.  주로 계정정보, 사이트정보, 공통적으로 사용하는 정보가 있다.

- Drivers : Selenium 에서 사용되는 Driver 를 한곳에 모아 둔다. 추후 설명 하겠지만, pytest 에서 @fixture 를 사용하기 위해 만들어 두었다.

- Locator : 각 테스트 범위 페이지를 하나로 엘리먼트들을 정의 하지 않고, 분할하여 각 영역 또는 페이지 별로 엘리먼트를을 관리하기 위한 폴더이다.

- Pages : 추후, Locator 폴더에서 해당하는 엘리먼트에 대한 테스트 진행 시, 각 페이지에 대한 공용 함수를 쓰기 위한 폴더라고 생각하면 된다. 기본적으로 Base 에는 전체적으로 사용하는 공요 함수를 만들고 각 페이지 별로 해당 페이지에서만 사용하는 함수를 만들어 두는것이 편하다.

  예를들어, Base 에는 Locator 의 엘리먼트 유무를 판단하는 함수를 만들어 모든 테스트 케이스에서 호출을 하는 용도이고, Page_ .. 에는 각 페이지 별로 특별하게 사용하는 기능들을 함수로 만들어 해당 페이지에서만 호출하여 사용한다.

- Tests : 실제 테스트 스크립트를 작성하는 폴더라고 생각하면 될 것 같다.





전체적인 흐름을 설명하자면,

Tests 폴더의 test.py 에는 Config 에 선언된 정보 (ID/PW 또는 URL 또는 데이터 정보) 를 불러오고 @pytest.fixture 심볼릭 드라이버 정보를 수행하여 각 Locator 에 정의된 엘리먼트들을 Pages 에 정의된 함수들을 호출하여 TEST 를 진행하게 된다.





작성자 : 현의노래

작성일 : 2021년 10월 29일
