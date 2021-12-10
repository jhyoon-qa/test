---
id: doc26
title: Selenium 실전편 Part 03-02
---

## Selenium - 009 - Selenium 실전편 Part 03 페이지 작성

이 글에서 예시로 사용되는 정보는 다음과 같다.

- Python 3.7.7
- Selenium 3.141.0
- Pytest 6.2.1





```목차```

1. [임의의 사이트 선정 및 자동화할 영역, 기능등에 대한 범위 선정](https://qa-linesong.netlify.app/docs/doc23)
2. [테스트 자동화 스크립트의 형상관리 & POM 구조 작성](https://qa-linesong.netlify.app/docs/doc24)
3. **로케이터 및 페이지 작성**
4. 자동화 스크립트 작성 (테스트 케이스, 테스트 시나리오)





### 2) 페이지 작성



이번 글에서는 페이지 작성에 대하여 내용을 다루고자 한다.

페이지에서는 이전 글, [Selenium 실전편 Part 02](https://qa-linesong.netlify.app/docs/doc24) 에서 설명한 **Pages** 을 다룬다.

각 페이지에서 공용으로 사용할 수 있는 함수를 사전에 미리 정의 하는 것이다.



예를들어, **Base** 이라는 Page 를 만든다면, 이 Page 에는 Selenium 의 명령어 중, 자주 사용하는 명령어를 함수로 모아 둔다.

엘리먼트를 클릭하는 액션, 특정 속성값을 가져오는 함수 등등을 말이다.

Selenium 에서 제공하는 명령어도 이렇게 **POM** 방식으로 하는 이유는,

Selenium 자체 버전 업데이트 등을 통해 기존 명령어나 속성값이 변경 될 수 있기 때문이다.

해당 경우가 발생 했을 경우, **Base** 에 정의된 Selenium 관련 함수만 변경하면 추가로 변경이 필요 없다.



```예시```

```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class BasePage:

    def __init__(self, driver):
        self.driver = driver


    # 엘러먼트를 클릭한다.
    def do_click(self, by_locator):
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located(by_locator)).click()
```



그리고 각 **Locator** 에 해당 하는, **Page** 에서는 각 페이지 별로 정의된 영역에서 공용으로 사용할 수 있는 함수를 정의하면 된다.



※ 모든 페이지에서 공통적으로 적용되는 것이라면 **Common** 같은 별도의 **Pages** 를 생성하여 관리하는 것이 편하다.





페이지를 작성하기에 앞서, 이전 ```기본 노출``` 에 정의된 로케이터를 우리는 작성 하였다. 그리고 작성한 로케이터를 기준으로 우리는 ```기본 기능``` 을 확인 할 예정이다.



그 기능을 다시 한번 확인하면 다음과 같다.





```기본 기능```

1. 비 로그인 시, 메뉴 클릭 시 로그인 페이지 노출 기능
2. 비 로그인 시, 시작하기 클릭 시 로그인 페이지 노출 기능
3. 로그인 후, 글쓰기 기능



위 기본 기능을 확인하였을때 우리가 Selenium 을 이용하여, 우리가 수행하는 액션은 크게 **클릭** , **글쓰기** 이다.

그것을 Base 라는 Page 로 사전에 정의하면 다음과 같다.



```Base_Page.py```

```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC



class BasePage:

    def __init__(self, driver):
        self.driver = driver


    # 엘러먼트를 클릭한다.
    def do_click(self, by_locator):
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located(by_locator)).click()

    # 엘러먼트에 키를 입력한다.
    def do_send_keys(self, by_locator, text):
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located(by_locator)).send_keys(text)

```



이제 이것을 기준으로 우리는 어느 케이스에서든, 동일한 **do_click** , **do_send_keys** 라는 기능을 불러 쓸 수 있게 되었다.








작성자 : 현의노래

작성일 : 2021년 12월 07일