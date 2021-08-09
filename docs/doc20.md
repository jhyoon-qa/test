---
id: doc20
title: Exceptions
---

## Selenium - 004 - 예외 처리(Exceptions)

테스트 자동화에서 예외 처리는 왜 필요한 것일까 ?

이 의문은 이제 막 도구 사용법을 익히고 TC 에 있는 내용을 이제 막 구현 한다면 이해하기 어려울 수 있다.

하지만, TC 의 내용들을 옮기거나 새로운 TS 를 기준으로 테스트 자동화 스크립트를 구현하다 보면..

직접 했을때와는 다른 결과값을 내거나 의도치 않은 방향으로 테스트 자동화가 수행되는 경우가 생길 것이다.



테스트 자동화를 구현시에는 복잡한 사전조건을 가진 케이스 일수록 원하던 원치않던 다양한 경우가 발생 될 수 있다.

예를들어, 특정 사이트의 **마이페이지** 중 특정 내역을 확인하는 TC 라는 가정을 해보자.

이것을 테스트 자동화 스크립트로 구현하였다면 다음과 같을 것이다.



```자동화 예시```

1. 메인 페이지에서 마이페이지라는 문구를 찾아 클릭
2. 마이 페이지 화면에서 배송중인 아이템 클릭
3. 배송중 아이템의 구매 상세 페이지에서 다음을 확인
   * 구매 상세 페이지에서 클릭하여 구매한 제품에 맞는 상품 상세 페이지가 노출되는지 확인
   * 구매 상세 페이지에서 배송중 아이템의 배송확인 버튼을 클릭하여 배송중 상태를 확인



```자동화 예시``` 에서 1 번을 수행하고자 할때 아직 자동화 설계 또는, 도구 사용법이 익숙하지 않다면 보통은 하나의 스크립트에 로그인 부터 주르륵 한줄한줄 스크립트를 작성했을 것이다.



그렇다면 해당 TC 는 3번의 내용을 확인하는 TC 이지만 로그인이 안된 상태이라면, 1번부터 막히게 되고 FAIL 로 반환 될 것이다. 원래대로라면 예시로 든 TC 는 수행이 되지 않아야 하는것이 맞다.



매뉴얼 테스트 진행시에도 사전조건이 FAIL 인 경우에 그와 연관되는 TC 들은 우리는 보통 N/A (해당없음) 같은 기록을 하고 별도로 수행을 하지 않는 것처럼 말이다.

테스트 자동화 역시, 로그인에서 이미 FAIL 이라는 결과값이 나왔다면 그 뒤 동작은 수행하지 않거나, 다른 동작하기 위한 행동을 진행해야 한다.



**바로 이럴때 사용하기 위한 것이 예외 처리**이다.

간략하게 정리하면 테스트 자동화에서 예외 처리의 목적은 크게 2가지이다.



1. **사전 조건** 에 해당하는 **TC 수행의 결과 값이 FAIL 이라 해당 TC 의 수행이 의미**가 없을 경우
2. **특정 조건** 이 **발생 하여도 이를 이미 인지**하고 있거나 **해당 조건을 제거 후, 정상적으로 TC 를 수행** 하고자 할 경우



그렇다면 실제로 어떻게 사용될까 ?

아래 예제로 간략하게 설명 하고자 한다.



예전에 필자가 마스크를 구매하고자 만들었던, 코드를 예제로 보자.



```예시 코드```

```python
import time

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from threading import Thread
import getpass
import pyautogui

# 페이지 정보

로그인페이지 = 'https://www.welkeepsmall.com/shop/member.html?type=login'
테스트상품 = 'http://www.welkeepsmall.com/shop/shopdetail.html?branduid=985344&xcode=002&mcode=001&scode=&type=X&sort=order&cur_code=002001&GfDT=bmx4W1w%3D'
F94_대형 = 'http://www.welkeepsmall.com/shop/shopdetail.html?branduid=997662&xcode=023&mcode=002&scode=&special=1&GfDT=bmx1W1w%3D'
F94_중형 = 'http://www.welkeepsmall.com/shop/shopdetail.html?branduid=997667&xcode=023&mcode=002&scode=&special=1&GfDT=bmh8W10%3D'
아이템선택_Xpath = '//*[@id="form1"]/div/div[1]/table/tbody/tr[3]/td/div/dl/dd/select/option[2]'
아이템수량_Xpath = '//input[@id="MS_amount_basic_0"]'
구매버튼_Xpath = '//a[@class="btn_buy fe"]'

# 배송지 정보
이름 = '//*[@id="receiver"]'
연락처1_001 = '//*[@id="emergency21"]'
연락처1_002 = '//*[@id="emergency22"]'
연락처1_003 = '//*[@id="emergency23"]'
주문하기버튼 = '//img[@title="주문하기"]'

# 주문정보 (무조건 무통장 입금)
약관동의 ='//label[.="상기 결제정보를 확인하였으며, 구매진행에 동의합니다."]'
입금계좌 = '//select[@name="paydata1"]/option[2]' #국민은행 831801-04-083808 (예금주:웰킵스(주))
결제하기 = '//*[@id="orderbutton"]/a[1]/img'
금액정보 = '/html/body/div[3]/form/table/tbody/tr[6]/td[2]/font[1]/b'


id = input('웰킵스 ID 를 입력 하세요. * 간편 로그인 불가능 * : ')
pw = getpass.getpass('웰킵스 PW 를 입력 하세요. : ')
set_product = int(input('상품을 선택 하세요. 1: F94_대형 2: F94_중형 3: 테스트 : '))
buycount = int(input('총 구매 횟수를 입력 하세요. * 1박스에 25개 * : '))
name = input('주문자 이름을 입력하세요. : ')
mobile_1 = int(input('연락처 첫번째를 입력하세요. ex) 010 : '))
mobile_2 = int(input('연락처 두번째를 입력하세요. ex) 1234 : '))
mobile_3 = int(input('연락처 세번째를 입력하세요. ex) 5678 : '))


options = Options()
options.headless = True
br = webdriver.Chrome(executable_path="chromedriver.exe", options=options)

# 로그인 페이지 접속
br.get(로그인페이지)

# ID 입력
loginID = br.find_element_by_name("id")
loginID.send_keys(id)

# PW 입력
loginPW = br.find_element_by_name("passwd")
loginPW.send_keys(pw)
loginPW.send_keys(Keys.RETURN)

if set_product == 1:
    br.get(F94_대형)

if set_product == 2:
    br.get(F94_중형)

if set_product == 3:
    br.get(테스트상품)

# 품절 여부 확인 및, 상품 있을 경우 구매 함수
def Buy():

    # 품절 영역이 노출되면 처리
    try:
        if br.find_element_by_class_name('soldout'):
    
            print('현재 상품은 품절 입니다.')

            br.refresh()

            time.sleep(2)

            return False

    except:
        # 품절이 아니라면, 아이템 셀렉트 박스에서 해당 아이템 선택 (무조건 2번째)
        try:
            # 입력받은 수량많은 값을 입력
            if br.find_element_by_xpath(아이템선택_Xpath).click():
                br.find_element_by_xpath(아이템수량_Xpath).send_keys(buycount)
        except:
            pass

        # 구매버튼 클릭
        br.find_element_by_xpath(구매버튼_Xpath).click()

        # 구매화면
        # 입력받은 구매자 정보를 입력 (이름, 연락처)
        # 기존 정보는 미리 내정보 > 정보 변경에서 입력 해놔야함
        br.find_element_by_xpath(이름).click()
        br.find_element_by_xpath(이름).send_keys(name)

        br.find_element_by_xpath(연락처1_001).click()
        br.find_element_by_xpath(연락처1_001).send_keys(mobile_1)

        br.find_element_by_xpath(연락처1_002).click()
        br.find_element_by_xpath(연락처1_002).send_keys(mobile_2)

        br.find_element_by_xpath(연락처1_003).click()
        br.find_element_by_xpath(연락처1_003).send_keys(mobile_3)

        br.find_element_by_xpath(주문하기버튼).click()

        # 팝업창에서 결제 창 선택 후, 결제 진행
        time.sleep(2)

        br.switch_to_window(br.window_handles[-1])

        br.get_window_position(br.window_handles[-1])

        br.find_element_by_xpath(약관동의).click()

        금액 = br.find_element_by_xpath(금액정보).text

        br.find_element_by_xpath(입금계좌).click()

        br.find_element_by_xpath(결제하기).click()

        br.quit()

        now = time.localtime()

        buytime = "%04d-%02d-%02d %02d:%02d:%02d" % (now.tm_year, now.tm_mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec)

        print('구매 성공 {}'.format(buytime))
        print('무통장 입급하세요.국민은행 831801-04-083808 (예금주:웰킵스(주)) {} 원'.format(금액))

        return True

while Buy() != True:
    Buy()
```





### 사전 조건의 FAIL 로 인하여 하위 TC 수행의 의미가 없는 경우

위의 자동화 예시에서 설명한, 배송중이나 구매 상품의 상세 내역을 확인하고자 할 경우, 로그인이 실패한다면 그 하위의 TC 는 수행하는 의미가 없다.

예외처리가 없다면 로그인에서 발생한 FAIL 이외에도 하위 assert 에 대한 FAIL 이 발생하게 되고 그로인한 쓸대없는 수행시간과 결과 보고에 대한 분석 시간이 쓸대없이 더 들어갈 것이다.

로그인 단계인, loginPW.send_keys(Keys.RETURN) 항목에서 로그인 실패 한다면, 분기 부분인 br.find_element_by_class_name('soldout') 부분부터 FAIL 이 계속 발생하게 될 것이다.

그렇기에 loginPW.send_keys(Keys.RETURN) 이후, 로그인 이후 페이지에 대한 엘레먼트 체크 부분을 만든 후, 해당 참/거짓 에 대한 예외처리를 하게 되면 불필요한 수행을 하지 않아도 된다.



### 특정 조건에서 FAIL 처리가 아닌 다른 행동이 필요한 경우

위의 예시코드 내용 처럼, 상품페이지의 물품을 선택해서 구매하는 케이스가 존재한다고 가정할 경우, 해당 상품이  품질되어 있는 상황을 생각해보자.



TC 의 내용대로 매뉴얼 테스트를 진행 할 경우에는 다른 상품을 검색하거나, 해당 상품은 품절이니 예상 결과에 따라 PASS 를 결정하겠지만, 자동화된 상태에서는 이런 분기에 대하여 사전에 정의를 해야한다.



```예시 코드```

```python
    try:
        if br.find_element_by_class_name('soldout'):
    
            print('현재 상품은 품절 입니다.')

            br.refresh()

            time.sleep(2)

            return False

    except:
        # 품절이 아니라면, 아이템 셀렉트 박스에서 해당 아이템 선택 (무조건 2번째)
        try:
            # 입력받은 수량많은 값을 입력
            if br.find_element_by_xpath(아이템선택_Xpath).click():
                br.find_element_by_xpath(아이템수량_Xpath).send_keys(buycount)
        except:
            pass
```



그렇기에 예시코드 처럼 예외처리를 통하여, 품절일 경우 또는 상품이 있을 경우에 따라 분기로 진행하게 되는 것이다.







작성자 : 현의노래

작성일 : 2021년 07월 21일