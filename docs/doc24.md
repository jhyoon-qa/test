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
3. 로케이션 및 페이지 작성
4. 자동화 스크립트 작성 (테스트 케이스, 테스트 시나리오)





### 테스트 자동화 스크립트 형상관리 & POM 구조 작성

이전에 설명한 POM 구조를 여기에서도 적용 해보고자 한다.

이전글 [Page Object Model (POM)](https://qa-linesong.netlify.app/docs/doc22) 은 개념을 설명하고자 Google 예시로 든 것이고 필자는 다른 형태의 POM 구조를 선호 한다. 

어차피, POM 이라는 개념은 동일하고 구조만 필자 편할대로 하는거라 크게 신경 쓸 필요는 없다.





### POM 구조

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
		|- page_locator_ex_001.py
		|- page_locator_ex_002.py
		|- page_locator_ex_003.py
     |- Tests
    	|- TEST_BASIC
        	|- BASIC_test_*.py
        |- TEST_SCENARIO
        	|- SCENARIO_test_*.py
```



- Config : 공통으로 사용하는 정보를을 모아 놓는 폴더라고 생각하면 될것 같다.  주로 계정정보, 사이트정보, 공통적으로 사용하는 정보가 있다.
- Drivers : Selenium 에서 사용되는 Driver 를 한곳에 모아 둔다. 추후 설명 하겠지만, pytest 에서 @fixture 를 사용하기 위해 만들어 두었다.
- Locator : TODO











작성자 : 현의노래

작성일 : 2021년 10월 29일
