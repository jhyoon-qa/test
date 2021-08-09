---
id: doc13
title: Leet Code - Reverse Integer
---

## 알고리즘 공부



**Leet Code Python - Reverse Integer**




### 문제 ###

Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-231, 231 - 1], then return 0.

**Assume the environment does not allow you to store 64-bit integers (signed or unsigned).**

> 주소 : https://leetcode.com/problems/reverse-integer/
> 
> 의역 : **32-bit integer x** 값을 입력 받아, 뒤집어서 출력해라. 단, -2의 31승, 2의 31승, -1 은 0 을 반환하라



### 예시 ###

```python
Input: x = 123
Output: 321
```

```python
Input: x = -123
Output: -321
```

```python
Input: x = 120
Output: 21
```

```python
Input: x = 0
Output: 0
```


### 코드 ###

```python
# 첫번째 시도
class Solution(object):
    def reverse(self, x):
        """
        :type x: int
        :rtype: int
        """
        if x == 0:
            wow = x
        if x > 0:
            wow = int(str(x)[::-1])
        if x < 0:
            wow = int(str(x*-1)[::-1])*-1
            
        return wow       
```




```python
# 두번째 시도
class Solution(object):
    def reverse(self, x):
        """
        :type x: int
        :rtype: int
        """
        if x > 0:
            wow = int(str(x)[::-1])
            
        else:
            wow = -1*int(str(x*-1)[::-1])
            
        if -2**31 < wow < 2**31:
            return wow
        
        else:
            return 0 
```


### 풀이 ###


> 처음에는 4번째 예시를 보고, 0 일 경우에만 처리하고, 나머지에 대해서 구현 했으나 
>
> 각 최대 최소 값이 존재 하였다... 그래서 변경한 코드는 0보다 큰 경우는 정수로 생각하여...
>
> 그냥 받는 값을 역순해서 wow 로 저장하고, 아닐 경우에는 x 에 -1 을 곱해 양수로 변경 후 역순으로 치환
>
> 다시 -1 을 곱하여 음수값을 만들어 wow 로 저장한다. 
>
> 그런다음 설명에 존재하는 범위안의 값일 경우에는 wow 를 반환 아니면 그냥 0 를 반환하게 하였다.








작성자 : 현의노래

작성일 : 2021년 03월 31일