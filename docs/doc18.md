---
id: doc18
title: Waits
---

## Selenium - 002 - 대기(Waits)


Selenium 에서 제공하는 액션 의 경우, 사전 조건이 필요하다.
바로, 엘레먼트를 인식 또는 판별된 상태에서 해당 액션이 수행될 수 있다는 점이다.

Selenium 에서는 이에 따라 엘레먼트를 인식 또는 판별하거나 특정 액션을 수행하기 위하여 일종의 사전조건이 유효한지를 판단하기 위한 대기를 지원한다.



### 대기(Waits) 가 필요한 이유 ?

``` 기본예제 ```
```python
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

driver = webdriver.Firefox()
driver.get("http://www.python.org")
assert "Python" in driver.title
driver.close()
```

위의 예제를 보면 각 한줄 한줄 하나의 기능을 수행하고 있음을 알고 있다.



하나의 예를 들어 보자면, "http://www.python.org" 라는 사이트에 driver 가 접속을 시도하는데 인터넷이 느리거나, 해당 사이트가 점검중이거나 해당 사이트의 도메인이 기간만료 또는 디도스 공격으로 접속할 수 없다고 가정해보자.



"http://www.python.org" 라는 사이트에 접속하는 driver.get("http://www.python.org") 기능은 수행되었으나 해당 페이지의 타이틀이 "Python" 이라는 문구가 있는지 확인하는 assert "Python" in driver.title 행에서는 Selenium 에서 기본으로 제공하는 대기 시간으로 assert 여부를 체크 하겠지만

실 서비스 입장에서는 **경우에 따라 PASS, FAIL** 이 달라질 수 있는 것이다.

예를들어 위에 든 예시 중 

1) 인터넷이 느려 해당 타이틀 정보를 늦게 가져왔을 경우

2) 해당 사이트가 점검중이라 타이틀 정보가 변경 되었을 경우

3) 해당 사이트의 도메인이 기간만료로 노출되지 않는 경우

4) 디도스 공격으로 해당사이트의 서버가 내려가 있는 경우





모두 Selenium 에서 제공하는 대기 시간을 지나면 False 로 반환이 된다.
하지만 **1)** 의 경우는 테스트 하는 환경에 따라 늦게라도 타이틀 정보를 가져올수도 있다.

이렇듯, 기계적인 조건이 아닌 실 서비스에서의 특정 환경이나 조건에 따라 **PASS** , **FAIL** 을 결정하는 구분을 만들기 위해, Selenium 에서는 대기(Waits) 에 대한 TIP 을 제공한다.



### 대기 (Waits) 란 ?

간단하게, "요소가 아직 로딩되지 않는 경우 등을 가정하여 요소를 찾는 시간을 정함" 을 대기 (Waits) 라고 정의할 수 있다.

**Selenium 공식 문서**에서는 2가지의 Waits 를 예를 들어 표현하고 있지만 해당 개념에 대한 원활한 이해를 위해 이 문서를 작성한다.





### 암시적대기 (**Implicit  Waits**)

암시적(暗示的, implicit) 이란 어학사전에 다음과 같이 정의되어 있다.

```
1.암시된, 내포된
2.(직접 표현되지 않더라도) 내포되는
3.절대적인, 무조건적인
```

즉,  정의한 시간만큼 대기하는 것을 암시적대기 라고 한다.



``` 암시적대기 예제 ```

```python
from selenium import webdriver

driver = webdriver.Firefox()
driver.implicitly_wait(10) # seconds
driver.get("http://www.python.org")
assert "Python" in driver.title
driver.close()
```

위와 같은 코드가 있다고 가정하자, 여기에서 암시적 대기는 driver.implicitly_wait(10) 이부분이다. 

간략하게 설명을 하자면,

파이어폭스 Driver 를 구동하여 10초 대기후, "http://www.python.org" 사이트를 이동한후, 타이틀의 정보중에 "Python" 이 존재하는지를 확인한다.

즉,  정의한 문법과 문법 사이에 암시적으로 대기시간을 만들어 내는 것이다.



예를들면, 특정한 옵션을 선택하면 많은 데이터들이 계산되어 표 형식으로 노출되는 어떤 페이지가 존재한다고 가정시 Selenium 에서 **데이터들이 계산되어 표 형식** 으로 노출되는 표에 대한 엘레먼트는 바로 찾을 수 있을 것이다.

하지만 **데이터들이 계산** 되어 유의미한 값을 표에서 얻고자 할 때는 임의적으로 계산이 가능한 시간만큼 대기해야 한다는 것이다.





### 명시적대기 (**Explicit  Waits**)

명시적(明示的, explicit) 이란 어학사전에 다음과 같이 정의되어 있다.
```
1.내용이나 뜻을 분명하게 드러내 보이는 것
```

즉, 정의한 시간안에 특정 조건이 만족하기 전까지 대기하는 것을 명시적대기 라고 한다.



``` 명시적대기 예제 ```

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Firefox()
driver.get("http://www.python.org")
WebDriverWait(driver,10).until(EC.text_to_be_present_in_element((By.XPATH,"/html/head/title"), "Python"))
driver.close()
```

위와 같은 코드가 존재한다는 가정시, 여기에서 명시적 대기는 WebDriverWait(driver,10).until(EC.text_to_be_present_in_element((By.XPATH,"/html/head/title"), "Python")) 이부분이다.

위와 마찬가지로 간략하게 설명을 하자면,

파이어폭스 Driver 를 구동하여 , "http://www.python.org" 사이트를 이동한후, 해당 엘레먼트가 만족할때까지 "최대" 10초를 대기하는 것이다.

즉, 특정 조건이 만족하기위한 최대 대기시간을 정의하는 것이다.



예를들면, 특정한 버튼의 조합 또는 선택의 조합이 엘레먼트의 변경을 만들어 냈을 경우 (그래프 변경 같은..) **해당 엘레먼트의 변경이 되어 노출**되어야하는 최대 시간을 기다리는 것이다.

그전에 변경이 되었을 경우에는 True 로 다음 작업으로 진행 최대시간을 초과하였을 경우에는 False 로 처리된다.



이렇듯, 각 상황과 조건에 따라 암시와 명시에 대한 대기를 적절하게 사용한다면 효율적인 자동화 스크립트를 구현하고 관리할 수 있을 것이다.





작성자 : 현의노래

작성일 : 2021년 07월 05일
