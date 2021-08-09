---
id: doc12
title: Leet Code - Palindrome Number
---

## 알고리즘 공부



**Leet Code Python - Palindrome Number**




### 문제 ###

Given an integer x, return true if x is palindrome integer.

An integer is a **palindrome** when it reads the same backward as forward. For example, 121 is palindrome while 123 is not.

> 주소 : https://leetcode.com/problems/palindrome-number/
> 
> 의역 : **x** 값을 입력 받아, **palindrome ** 에 따라 맞으면 True 아니면 False 를 반환하라



### 예시 ###

```python
Input: x = 121
Output: true
```

```python
Input: x = -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.
```

```python
Input: x = 10
Output: false
Explanation: Reads 01 from right to left. Therefore it is not a palindrome.
```

```python
Input: x = -101
Output: false
```


### 코드 ###

```python
class Solution(object):
    def isPalindrome(self, x):
        """
        :type x: int
        :rtype: bool
        """
        if x < 0:
            return False
        
        elif (x - int(str(x)[::-1])) == 0:
            return True
        
        elif (x - int(str(x)[::-1])) != 0:
            return False        
```



### 풀이 ###


> 예시대로 2가지 조건에 만족하면 되는 것 같다.
>
> 첫번째는, 정수일 것
>
> 두번째는, 받은 x 의 값이 되돌렸을때(?) 동일할 것
>
> 첫번째는 x 값을 받아 0 과 비교하여, 작으면 그냥 False 반환
>
> 0 보다 클 경우에는 x 의 값과 x 을 str 로 변환하여, 역산하고 그 값을 다시 int 로 변경
>
> 그 둘의 값을 빼서 0 이면 True 아니면 False 반환








작성자 : 현의노래

작성일 : 2021년 03월 31일