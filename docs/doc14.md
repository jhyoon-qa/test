---
id: doc14
title: Leet Code - Roman to Integer
---

## 알고리즘 공부



**Leet Code Python - Roman to Integer**




### 문제 ###

Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.

|Symbol| Value|
|:--------:|:--------:|
|I|1|
|V|5|
|X|10|
|L|50|
|C|100|
|D|500|
|M|1000|

For example, 2 is written as II in Roman numeral, just two one's added together. 12 is written as XII, which is simply X + II. The number 27 is written as XXVII, which is XX + V + II.

Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not IIII. Instead, the number four is written as IV. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as IX. There are six instances where subtraction is used:

* I can be placed before V (5) and X (10) to make 4 and 9. 
* X can be placed before L (50) and C (100) to make 40 and 90. 
* C can be placed before D (500) and M (1000) to make 400 and 900.

Given a roman numeral, convert it to an integer.

> 주소 : https://leetcode.com/problems/roman-to-integer/
>
> 의역 : 로마 숫자 I, V, X, L, C, D, M 의 입력값을 숫자로 변경하라, 단 몇개의 조건이 존재한다.
>
> IV 는 숫자 4 / IX 는 숫자 9 / XL 은 숫자 40 / XC 는 숫자 90 / CD 는 숫자 400 / CM 은 숫자 900 이다.
>
> s 의 길이는 1보다 크거나 같고, 15보다 작거나 같다.
>
> s 의 문자열은 ('I', 'V', 'X', 'L', 'C', 'D', 'M') 이다.
>
> s 의 범위는 1 부터 3999 까지이다.



### 예시 ###

```python
Input: s = "III"
Output: 3
```

```python
Input: s = "IV"
Output: 4
```

```python
Input: s = "IX"
Output: 9
```

```python
Input: s = "LVIII"
Output: 58
Explanation: L = 50, V= 5, III = 3.
```

```python
Input: s = "MCMXCIV"
Output: 1994
Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.
```

### 코드 ###

```python
class Solution(object):
    def romanToInt(self, s):
        """
        :type s: str
        :rtype: int
        """
        
        symbols_Value = {'I' : 1,'IV' : 4,'V' : 5,'IX' : 9,
                         'X' : 10,'XL' : 40,'L' : 50,'XC' : 90,
                         'C' : 100,'CD' : 400,'D' : 500,'CM' : 900,'M': 1000}
        
        wow = 0
        count = 0
        
        if 1 <= len(s) <= 15:
            while count < len(s):
                if (count + 1) != len(s) and s[count] + s[count + 1] in symbols_Value:
                        wow+=symbols_Value[s[count] + s[count + 1]]
                        count = count + 2
                else:
                    wow+=symbols_Value[s[count]]
                    count = count +1
                    
            return wow
                    
        else:
            return False  
```


### 풀이 ###


> 처음에는 두개의 리스트로 문자와 숫자를 치환하려 하였으나, 생각해보니 딕셔너리가 있는데 굳이 그럴 필요가 없을 것 같아서, 합쳤다. 
>
> 각 예시에 나와있는 값 빼고 중간에 총 6가지의 조건이 있어서 해당 내용을 그냥 딕셔너리에 넣어버렸다.
>
> wow 는 리턴할 값으로 선언하고, 각 나온 값들을 최종적으로 더해서 반환한다.
>
> count 는 그냥 숫자 카운트 용이다.
>
> 조건 1인 문자열의 길이를 확인하기 위해, 1 <=  s 의 문자열의 길이 <= 15 로 조건문을 만들고, 아닐 경우 False 를 리턴
>
> count 가 s 의 문자열보다 작으면 계속 돌리면서, count + 1 의 값이 s 의 문자열 길이값과 같지 않고, s 의 문자열의 [count] 와 문자열 [count + 1] 을 합쳐서 symbols_Value 안에 있는 값이면 wow 에 그것을 숫자로 치환하여 더하고, 2칸 앞의 있는 s 의 문자열을 비교한다.
>
> 아닐 경우에는, 한자리 숫자의 조건에 해당함으로 그냥 wow 에 해당 값만 더해서 저장하고, 1칸 앞의 있는 s 의 문자열을 비교한다.








작성자 : 현의노래

작성일 : 2021년 04월 02일