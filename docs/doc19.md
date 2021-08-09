---
id: doc19
title: Locating Elements
---

## Selenium - 003 - 요소 찾기(Locating Elements)

Selenium 에서 어떤 액션을 수행할때는 항상 특정 엘레먼트를 찾고, 그 이후에 특정 액션을 수행하도록 구성되어 있다.

이번 주제는 바로 그 엘레먼트를 찾는 방법을 간략하게 설명하고자 한다.

엘레먼트를 찾는 방법은 단일과 다중 이렇게 2개로 나눌 수 있다.



### 단일요소

```단일요소 종류```

```python
find_element_by_id
find_element_by_name
find_element_by_xpath
find_element_by_link_text
find_element_by_partial_link_text
find_element_by_tag_name
find_element_by_class_name
find_element_by_css_selector
```

단일요소는 엘레먼트를 1개를 반환하기 떄문에 단일 이라는 표현을 사용한다.

여러개의 구분자가 있을 경우에는 맨 첫번째 엘레먼트를 반환하기 때문에 주로 1개로 존재하는 엘레먼트를 찾을 때 사용한다고 보면 될 것이다.

단일요소를 찾기 떄문에 만약, 해당 엘레먼트가 존재하지 않는다면 **NoSuchElementException **오류를 발생시킨다.



### 다중요소

```다중요소 종류```

~~~python
find_elements_by_name
find_elements_by_xpath
find_elements_by_link_text
find_elements_by_partial_link_text
find_elements_by_tag_name
find_elements_by_class_name
find_elements_by_css_selector
~~~

다중요소는 정의한 엘레먼트에 해당하는 모든 목록을 반환하기 떄문에 다중 이라는 표현을 사용한다.

여러개의 구분자가 있을 경우 주로 사용하며, 리스트로 받아 처리가 필요한 곳이 사용하는것이 가장 효율적이다.

단일요소가 아닌 다중요소의 리스트를 찾기 때문에 해당 엘레먼트가 존재하지 않는다면 단일요소와는 다르게 빈 리스트값 [] 을 반환하게 된다.





아래는 간략하게 엘레먼트를 찾는 예제를 설명한다.

element 와 elements 의 차이는 단일이나 다중이냐 차이이므로 element 를 기준으로 해당 로케이션의 엘레먼트가 어떤의미를 갖는지를 설명한다.



### **Locating by Id**

```html 예시```

~~~html
<html>
 <body>
  <form id="loginForm">
  </form>
 </body>
</html>
~~~

```코드 예시```

~~~python
login_form = driver.find_element_by_id('loginForm')
~~~

ID 를 부여하는 경우, 자동화 진행 시 특정 엘레먼트 지정이 가장 쉽기때문에 선호하는 방식이지만 개발자가 직접 엘레먼트별로 ID 를 부여해야 하고 UI 변경시에는 ID 에 대한 관리도 별도로 필요하기에 요즘 개발 트랜드에는 사실 맞지 않는 방법이기도 하다.

하지만 대부분 엘레먼트가 반드시 특정 되어야 하는 경우 (예를들어 로그인 페이지) 에는 어지간 하면 ID 로 구분자를 두고 있는 편이다.



### **Locating by name**

```html 예시```

~~~html
<html>
 <body>
   <input name="username" type="text" />
   <input name="password" type="password" />
   <input name="continue" type="submit" value="Login" />
   <input name="continue" type="button" value="Clear" />
</body>
</html>
~~~

```코드 예시```

~~~python
username = driver.find_element_by_name('username')
password = driver.find_element_by_name('password')
~~~

보통 웹에서, form 의 컨트롤 요소의 값을 전송하기위해 속성값으로 사용되는 경우가 많다.

그래서 인지 주로, input 에 해당 엘레먼트가 부여 되어 있는 경우가 꽤 있음을 알 수 있을 것이다.



### **Locating by Xpath**

```html 예시```

~~~html
<html>
 <body>
  <form id="loginForm">
   <input name="username" type="text" />
   <input name="password" type="password" />
   <input name="continue" type="submit" value="Login" />
   <input name="continue" type="button" value="Clear" />
  </form>
</body>
</html>
~~~

```코드 예시```

~~~python
login_form = driver.find_element_by_xpath("/html/body/form[1]")
login_form = driver.find_element_by_xpath("//form[1]")
login_form = driver.find_element_by_xpath("//form[@id='loginForm']")

username = driver.find_element_by_xpath("//form[input/@name='username']")
username = driver.find_element_by_xpath("//form[@id='loginForm']/input[1]")
username = driver.find_element_by_xpath("//input[@name='username']")

clear_button = driver.find_element_by_xpath("//input[@name='continue'][@type='button']")
clear_button = driver.find_element_by_xpath("//form[@id='loginForm']/input[4]")
~~~

우선,  **Xpath** 란 XML 문서의 특정 요소나 속성을 특정하기 위한 경로를 지정하는 언어라고 생각하면 될것같다.

위 예제는 각 ID 또는 NAME 에 해당하는 엘레먼트의 경로를 **Xpath** 로 어떻게 지정할 수 있는지 예제이다.

위 예제처럼 직접적으로 ID 나 NAME 을 관리하는 것보다는 이전에 설명한 [셀레니움이란?](./doc6.md) 에서 **Xpath** 나 **CSS Selector** 를 학습하여 로케이터를 관리하는 것이직접 ID 나 NAME 같은 방법으로 특정 엘레먼트를 찾는 것보다는 훨씬 효율적이라 한것이다.



### **Locating Hyperlinks by Link Text**

```html 예시```

~~~html
<html>
 <body>
  <p>Are you sure you want to do this?</p>
  <a href="continue.html">Continue</a>
  <a href="cancel.html">Cancel</a>
</body>
</html>
~~~

```코드 예시```

~~~python
continue_link = driver.find_element_by_link_text('Continue')
continue_link = driver.find_element_by_partial_link_text('Conti')
~~~

웹에서 link 로 구분되는 href 에 해당하는 문구를 찾는 방법이라고 생각하면 될 것 같다.

예시가 2개인 이유는 find_element_by_link_text 는 전 문구에 대한 조건이고, find_element_by_partial_link_text 는 일부분 단어가 만족하면 해당 엘레먼트는 존재한다고 인식한다는 차이이다.



### **Locating Elements by Tag Name**

```html 예시```

~~~html
<html>
 <body>
  <h1>Welcome</h1>
  <p>Site content goes here.</p>
</body>
</html>
~~~

```코드 예시```

~~~python
heading1 = driver.find_element_by_tag_name('h1')
~~~

웹 html 에서 태그로 구분되는 속성의 이름을 가지고 찾는 것이다. 코드 예시 처럼 'h1' 인것, 'p' 인것 등으로 해당 엘레먼트를 인식할 수 있다.



### **Locating Elements by Class Name**

```html 예시```

~~~html
<html>
 <body>
  <p class="content">Site content goes here.</p>
</body>
</html>
~~~

```코드 예시```

~~~python
content = driver.find_element_by_class_name('content')
~~~

웹 구분자에서 class 의 이름으로 해당 엘레먼트를 찾는 방법이다.



### **Locating Elements by CSS Selectors**

```html 예시```

~~~html
<html>
 <body>
  <p class="content">Site content goes here.</p>
</body>
</html>
~~~

```코드 예시```

~~~python
content = driver.find_element_by_css_selector('p.content')
~~~

위에서 말했듯이, **Xpath** 나 **CSS Selector** 를 학습하여 로케이터를 관리하는 것이 좋다.

Xpath 와 CSS Selector 가 각각 장단점이 있는 만큼 자신에게 맞는 방식으로 진행하는 것이 좋을 것이라 생각한다.

필자는 주로 Xpath 를 사용하고는 있다.



Xpath 의 가장 큰 장점은 CSS Selector 보다 유연하게 엘레먼트를 찾을 수 있다.

contains 나 문법안에 [x<=20] 같은 조건을 붙일 수 있어 로케이터를 운용하기에 필자는 더 편해서 Xpath 를 사용한다.



하지만 CSS Selector 도 강력한 장점이 있다.

Xpath 보다 문법을 배우는게 쉬운 편이고, 가독성이 매우 뛰어나다. 또한 Xpath 보다 빠르다. (이론상)





작성자 : 현의노래

작성일 : 2021년 07월 13일