---
id: doc27
title: Selenium 실전편 Part 04
---

## Selenium - 010 - Selenium 실전편 Part 04 자동화 스크립트 작성

이 글에서 예시로 사용되는 정보는 다음과 같다.

- Python 3.7.7
- Selenium 3.141.0
- Pytest 6.2.1





```목차```
1. [임의의 사이트 선정 및 자동화할 영역, 기능등에 대한 범위 선정](https://qa-linesong.netlify.app/docs/doc23)
2. [테스트 자동화 스크립트의 형상관리 & POM 구조 작성](https://qa-linesong.netlify.app/docs/doc24)
3. [로케이터 및 페이지 작성](https://qa-linesong.netlify.app/docs/doc26)
4. **자동화 스크립트 작성 (테스트 케이스, 테스트 시나리오)**
### 1) 자동화 스크립트 작성
드디어 우리는 로케이터도 취득을 하였고, 각 페이지 또는 공용으로 사용할 페이지도 작성을 하였다.

이전에 설명한 기본 노출 / 기본 기능을 확인할 수 있는 각 페이지에 대한 로케이터, 페이지에 대한 기능 함수, 테스트에 대한 스크립트를 전체적으로 설명 하고자 한다.





**(1) Page Object Model**

- 효울적으로 관리하기 위한 POM 에 대한 설명을 이전에 하였다.
- Google 신께 물어보면 이미 좋은 레퍼런스의 POM 구조가 있으니 참조 하여도 되고, 각자 상황에 맞게 변경해서 사용을 해도 무방하다.
- 중요한것은 이 모든 행위는 효율성을 위한 것이란 것만 잊지 말도록 하자.



```POM_Example```

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





**(2) Locator**

- 각 페이지의 로케이터를 저장하는 곳으로 페이지 별로 관리를 하는것이 유지보수성에 유리하다.



```locator_Example```

```python
# 메인페이지의 로케이터를 정의 한다.


class locator_Front_MainPage:
    메인링크_아이콘 = '//a[@id="kakaoServiceLogo"]'

    메뉴_GNB = '//div[@id="kakaoGnb"]'
    메뉴_피드 = 메뉴_GNB + '//a[contains(text(), "피드")]'
    메뉴_스토리 = 메뉴_GNB + '//a[contains(text(), "스토리")]'
    메뉴_스킨 = 메뉴_GNB + '//a[contains(text(), "스킨")]'
    메뉴_포럼 = 메뉴_GNB + '//a[contains(text(), "포험")]'

    시작하기_버튼 = '//a[@class="btn_tistory btn_log_info" and contains(text(), "시작하기")]'
```





**(3) Pages**

- 각 페이지에 사용되는 함수들을 저장하는 곳으로 필자는 기본적으로 Base_Page 에는 Selenium 같은 라이브러리의 명령어와 예외처리 기능등을 별도로 정의한다.
- 그외 Page 에는 각 페이지에서만 주로 사용되는 기능들을 정의하는 것이 좋다.
  - 예시1) 로그인 페이지라면 로그인 여부를 체크하여 로그인을 하는 함수
  - 예시2) 메인 페이지라면 불필요한 팝업들을 다 닫아버리고, 메인 페이지만 남기는 함수 등



```Pages_Example```

```python
from selenium.webdriver import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By


class BasePage:

    def __init__(self, driver):
        self.driver = driver

    # 모든 by_locator 는 받기 이전에 Xpath 또는 css 등으로 정의가 되어야 한다. By 를 사용 하던가 Web driver 를 사용 하여 정의

    # 엘러먼트를 클릭한다.
    def do_click(self, by_locator):
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located(by_locator)).click()

    # 엘러먼트에 키를 입력한다.
    def do_send_keys(self, by_locator, text):
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located(by_locator)).send_keys(text)
```





**(4) Tests**

- 실제로 테스트 스크립트를 작성하는 곳이다. 필자는 Pytest 를 사용하기 때문에 그것을 기준으로 설명한다.
- 필자는 보통 기본 기능은 BASIC 이라는 폴더로 구분하고, 시나리오 케이스는 SCENARIO 라는 폴더로 구분한다.
- Pytest 를 사용할 경우, class 와 def 에는 test_ 라는 명시를 꼭 주도록 하자.
- 참고로 html 로 결과를 생성할 경우에는 한글은 깨진다. xml 은 한글이 노출되는 Jenkins 같은 도구와 연동 또는 대시보드 라이브러리 등을 사용하여 결과를 관리하자.



```Tests_Example```

```python
# -*- coding:utf-8 -*-

import sys
import os
import time

sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

from selenium.webdriver.common.by import By

from Tests.test_Base import BaseTest
from Pages.Main_Page import MainPage_Not_Login

from Locator.locator_Front_MainPage import locator_Front_MainPage


""" 비 로그인
비 로그인 상태 에서 메인 페이지 노출을 확인 한다.
"""

class Test_메인페이지_비로그인(BaseTest):

    def test_메인링크아이콘_노출확인(self):
        self.MainPage_Not_Login = MainPage_Not_Login(self.driver)
        assert self.MainPage_Not_Login.is_visible((By.XPATH, locator_Front_MainPage.메인링크_아이콘), 3)

    def test_메뉴_노출확인(self):
        self.MainPage_Not_Login = MainPage_Not_Login(self.driver)
        assert self.MainPage_Not_Login.is_visible((By.XPATH, locator_Front_MainPage.메뉴_피드), 3)
```



자동화를 어떻게 해야할지 어떤 개념을 잡아야 할지 잘 모르는 사람들에게 부디 작은 도움이 되었기를 희망하며..







작성자 : 현의노래
작성일 : 2022년 02월 08일