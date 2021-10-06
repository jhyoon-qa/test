---
id: doc22
title: Page Object Model (POM)
---

## Selenium - 005 - Page Object Model (POM)

테스트 자동화를 도입 후, 서서히 사용하지 않거나 실패하는 경우 수많은 이유가 있겠지만

가장 큰 이유중에 하나는 "유지보수" 일 것이다.

트랜드에 맞춰 자주 바뀌는 UI/UX 특성상 지속적으로 유지보수를 해주지 않으면 결국 이전 만든 스크립트는 쓸모없는 리소스 낭비인 경우가 많다.

그렇기에 초반에 자동화의 범위, 설계가 중요하지만 그건 추후 다시 이야기 하기로 하고, 이번 글에서는

POM 에 대하여 설명을 하고자 한다.





### Page Object Model (POM) 이란 무엇인가 ?

Page Object Model  은 드라이버, 테스트 로케이터, 테스트 케이스, 스위트 등을 별도의 파일로 모듈화 하여 관리하는 디자인 패턴을 말한다.



Page Object Model 에는 다음과 같은 구성 요소를 포함한다.

- Page Object Element : 페이지 클래스는 페이지의 웹 UI 요소에 대한 객체 저장소
- Test Cases : Page Object Element 의 요소를 사용하여, 실제 테스트를 수행 페이지의 UI 가 변경된 경우, Page Object Element 만 변경





### Page Object Model (POM) 을 사용해야 하는 이유 ?

비단 Selenium 뿐만 아니라, 다른 테스트 도구로 테스트 자동화를 진행 시에도 타겟에 대한 정보는 계속 변경될 수 있다. 그만큼 회사에서 투자를 한다면 유지보수에 어려움이 없겠지만, 아쉽게도 우리에게는 넉넉한 리소스가 준비 되지 않는다.



그렇기에 한정된 리소스를 효율적으로 관리하고 커버리지를 보장하기 위해서는 Page Object Model (POM) 같은 오브젝트에 대한 디자인 패턴 적용으로 모듈화를 하여 효율성을 확보 해야 한다.

Page Object Model (POM) 로 구성하게 된다면 다음과 같은 장점이 있다.

- 테스트 자동화 코드 유지관리성 작업이 용이
- 테스트 자동화 코드에 대한 가독성 증가





### Page Object Model (POM) 예시

Selenium 및 Python에서 Page Object Model을 시연하기 위해 검색어가 LambaTest인 Google 검색을 예로 들어 본다. (Selenium POM 예시 참조)

하단의 예시는 Selenium 와 unittest 를  사용한 예시이다.



```python
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from time import sleep
import warnings
import urllib3
 
class GoogleSeachTest(unittest.TestCase):
    def setUp(self):
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
 
    def test_GoogleSearch(self):
        driver_chrome = webdriver.Chrome()
        self.driver = driver_chrome
        driver_chrome.maximize_window()
        driver_chrome.get('http://www.google.com')
 
        # 구글 검색창에 "Lambdatest" 입력 후, 검색
        elem = driver_chrome.find_element(By.NAME, "q")
        elem.send_keys("Lambdatest")
        elem.submit()
 
    def tearDown(self):
        # Close the browser.
        self.driver.close()
        self.driver.quit()
 
if __name__ == '__main__':
    unittest.main()
```



위 예시의 경우 현재는 코드가 많지 않지만 수많은 테스트 코드가 하나의 파일에 포함되어 있다고 가정을 해보자, 만약 UI 가 하나라도 변경 되었다면 우리는 그 변경된 부분을 일일히 찾아 수정을 해야하는 수고를 해야할 것이다.



그렇기에 아래 예시와 같은 POM 구조로 효율성을 확보할 필요가 있다.

```python
Project-Directory
     |- Src
    	|- PageObject
        	|- Pages
            	|- *Page.py (Locators.py 안에 선언된 각 로케이터를 사용하는 방법의 구현)
            |- Locators.py
        |- TestBase
        	|- WebDriverSetup.py
     |- Test
    	|- Scripts
        	|- test_*.py (테스트 코드를 구현)
            (*Page.py 및 test_.py의 매핑은 코드를 보다 모듈화하는데 도움이 되므로 1:1로 매핑)
        |- TestSuite
        	|- TestRunner.py (테스트 케이스의 모음 테스트 스위트가 존재)
```

위의 구조에서 볼 수 있듯이 Project-Directory\PageObject 디렉터리는 Locators.py를 포함하고 있으며, 여기서 요소 로케이터는 요구사항에 따라 추가된다.



다음은 Google 검색 예제를 위한 Locators.py 예시이다.

**FileName – Search\PageObject\Locators.py**

```python
class Locator(object):
 
    #구글 검색 페이지
    search_text="//input[@name='q']"
    submit="//div[@class='FPdoLc tfB0Bf']//input[@name='btnK']"
    logo="//*[@id='hplogo']"
```

: 로케이터는 테스트 대상 웹 페이지에 기초하여 추가되기 때문에 로케이터의 문제는 로케이터를 포함하는 파일(즉, Locators.py)의 변경과 테스트 코드 변경 구현이 요구되지 않는다.



다음은 로케이터가 사용되는 페이지(HomePage.py) 이다.

**FileName – Search\PageObject\Pages\HomePage.py**

```python
import sys
sys.path.append(sys.path[0] + "/....")
 
from selenium.webdriver.common.by import By
from Src.PageObject.Locators import Locator
 
class Home(object):
    def __init__(self, driver):
        self.driver = driver
        self.logo = driver.find_element(By.XPATH, Locator.logo)
        self.search_text = driver.find_element(By.XPATH, Locator.search_text)
        self.submit = driver.find_element(By.XPATH, Locator.submit)
 
    def getSearchText(self):
        return self.search_text
 
    def getSubmit(self):
        return self.submit
 
    def getWebPageLogo(self):
        return self.logo
```

: Selenium Webdriver의 초기화 및 설정은 코드의 관리 용이성과 이식성을 개선하기 위한 테스트 제품군 및 테스트 시나리오와 구분 된다.

: 원격 웹 드라이버를 사용하여 자동 브라우저 테스트를 수행하려는 경우 WebDriver 설정에서만 변경이 필요하다.

나머지 구현은 변경되지 않는다.



다음은 Selenium Webdriver의 setup() & tearDown() 방법의 구현이다.

**FileName – Search\Src\TestBase\ WebDriverSetup.py**

```python
import unittest
from selenium import webdriver
import time
from time import sleep
import warnings
import urllib3
 
class WebDriverSetup(unittest.TestCase):
    def setUp(self):
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
        self.driver = webdriver.Chrome()
        self.driver.implicitly_wait(10)
        self.driver.maximize_window()
 
    def tearDown(self):
        if (self.driver != None):
            print("Cleanup of test environment")
            self.driver.close()
            self.driver.quit()
```

POM(Page Object Model)을 사용하는 목적은 반복 코드를 최소화하고 구현을 다음 섹션으로 분리하여 코드를 보다 쉽게 관리할 수 있게 한다.

- Locators, Pages
- Test scripts
- Test suites



이제 WebDriver 설정 및 필수 페이지 구현이 준비되었으므로 해당 테스트케이스를 구현해보자.

**FileName – Search\Test\Scripts\ test_Home_Page.py**

```python
import sys
sys.path.append(sys.path[0] + "/...")
 
from Src.TestBase.WebDriverSetup import WebDriverSetup
from Src.PageObject.Pages.HomePage import Home
import unittest
from selenium import webdriver
 
class Google_HomePage(WebDriverSetup):
 
    def test_Home_Page(self):
        driver = self.driver
        self.driver.get("https://www.google.com/")
        self.driver.set_page_load_timeout(30)
 
        web_page_title = "Google"
 
        try:
            if driver.title == web_page_title:
                print("WebPage loaded successfully")
                self.assertEqual(driver.title,web_page_title)
        except Exception as error:
            print(error+"WebPage Failed to load")
 
        
        home_page = Home(driver)
 
if __name__ == '__main__':
    unittest.main()
```



**FileName – Search\Test\Scripts\ test_Google_Search.py**

```python
import sys
sys.path.append(sys.path[0] + "/...")
 
import unittest
from time import sleep
from Src.TestBase.WebDriverSetup import WebDriverSetup
from Src.PageObject.Pages.HomePage import Home
 
class Google_Search(WebDriverSetup):
    def test_GoogleSearch(self):
 
        driver = self.driver
        self.driver.get("https://www.google.com/")
        self.driver.set_page_load_timeout(30)
 
        home = Home(driver)
        home.search_text.send_keys("LambdaTest")
        sleep(5)
        home.search_text.submit()
        sleep(10)
 
if __name__ == '__main__':
    unittest.main()
```



**FileName – Search\Test\TestSuite\TestRunner.py**

```python
import sys
import os
sys.path.append(sys.path[0] + "/...")
 
from unittest import TestLoader, TestSuite, TextTestRunner
from Test.Scripts.test_Home_Page import Google_HomePage
from Test.Scripts.test_Google_Search import Google_Search
 
import testtools as testtools
 
if __name__ == "__main__":
 
    test_loader = TestLoader()
    # 테스트 스위트 선언 및 테스트 케이스 호출
    test_suite = TestSuite((
        test_loader.loadTestsFromTestCase(Google_HomePage),
        test_loader.loadTestsFromTestCase(Google_Search),
        ))
 
    test_runner = TextTestRunner(verbosity=2)
    test_runner.run(test_suite)
 
    parallel_suite = testtools.ConcurrentStreamTestSuite(lambda: ((case, None) for case in test_suite))
    parallel_suite.run(testtools.StreamResult())
        self.driver.set_page_load_timeout(30))
```



이렇게 하나의 파일로 구성 했던 케이스는 각 로케이터, 드라이버, 테스트, 스위트로 분류가 되어 모듈화로 구현이 되었다. 

UI 변경시에는 해당 로케이터에서 변경을, 테스트 케이스 추가/삭제 시에는 각 테스트에 해당하는 스크립트에서 진행을 하면 우리는 조금 더 효율적으로 테스트 자동화를 관리할 수 있을 것 이다.





작성자 : 현의노래

작성일 : 2021년 08월 23일
