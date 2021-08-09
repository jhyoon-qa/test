---
id: doc16
title: Leet Code - Valid Parentheses
---

## 알고리즘 공부



**Leet Code Python - Valid Parentheses**




### 문제 ###

Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:

1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.



> 주소 : https://leetcode.com/problems/valid-parentheses/
>
> 의역 : 받은 문자열이 유효한지 결과값을 반환하라.
>
> 그 조건은 아래와 같다.
>
> 1. 열린 브레킷은 동일한 브레킷으로 닫아야 한다.
> 2. 열린 브레킷은 올바른 순서로 닫혀야 한다.



### 예시 ###

```python
Input: s = "()"
Output: true
```

```python
Input: s = "()[]{}"
Output: true
```

```python
Input: s = "{[]}"
Output: true
```

```python
Input: s = "(]"
Output: false
```

```python
Input: s = "([)]"
Output: false
```


### 코드 ###

```python
# 첫번째 시도
class Solution(object):
    def isValid(self, s):
        """
        :type s: str
        :rtype: bool
        """
        
        characters = {'(' : ')', '{' : '}', '[' : ']'}
        
        if 1 <= len(s) <= 10**4:
            
            if 1 == len(s) or 3 == len(s) or 5 == len(s):
                return False
            
            elif len(s) == 2:
                if s[0] in characters and s[1] == characters['{}'.format(s[0])]:
                    return True
                else:
                    return False
                
            elif len(s) == 4 or len(s) == 6:
                if s[0] in characters:
                    num = s.index(characters[s[0]]) - s.index(s[0])
                    if num == 1 or num == 3 or num == 5:
                        return True
                    else:
                        return False
            
            
        
        else:
            return False
```

```python
# 두번째 시도
class Solution(object):
    def isValid(self, s):
        """
        :type s: str
        :rtype: bool
        """
        
        character_start = ['(', '[', '{']
        
        character_end = [')', ']', '}']
        
        character_list = []
        
        if 2 <= len(s) <= 10**4:
            
            for s in list(s):
                if s in character_start:
                    character_list.append(s)

                elif len(character_list) != 0:
                    if (s == character_end[0] and character_list[-1] == character_start[0]) or (s == character_end[1] and character_list[-1] == character_start[1]) or (s == character_end[2] and character_list[-1] == character_start[2]):
                        character_list.pop()

                    else:
                        return False

                else:
                    return False
                
            if len(character_list) != 0:
                return False


            return True
```


### 풀이 ###


> 처음에는 문자열의 길이를 받아, 짝이 지어지려면 어차피 무조건 짝수여야 함으로 2,4,6 에 대해서만 판별을 하고, 첫번째 문자열의 index 와 해당 매칭되는 문자열의 index 를 찾아 뺀 값으로 결과를 구하였다.
>
> 하지만 이럴 경우에는 "(){}[{" 라던가 "[{]}" 같은 중간에 값이 다른 경우를 판별할 수 없다는 것을 돌려보고 알았다...
>
> 그래서 두번째 시도한 코드는... 문자열의 시작과 끝을 list 로 미리 저장 해두고 s 를 리스트로 만들어 s 로 돌리면서 character_start 안에 해당 값이 있다면 character_list 에 저장 후, s 값에 브레킷 매칭되는 끝 문자열이 나오면  저장된 character_list 의 마지막 값과 character_start 의 값이 각 매칭되는 값이 있을 경우에만 character_list 에서 해당 값을 제외 하였으며 결국 character_list 값이 0 이되면 True 를 반환
>
> character_list 의 마지막 값과 character_start 의 값이 각 매칭되는 값이 없을 경우에는 False
>
> s 값이 character_start 에 매칭되는 문자열이 없는 이상한 문자열이 있을 경우 False
>
> character_list  의 최종 길이가 0이 아니면 매칭되는 문자열이 없다는 의미이기 떄문에 False 를 반환
>
> 이런식으로 변경 하였다.








작성자 : 현의노래

작성일 : 2021년 04월 13일