---
id: doc15
title: Leet Code - Longest Common Prefix
---

## 알고리즘 공부



**Leet Code Python - Longest Common Prefix**




### 문제 ###

Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string "".

> 주소 : https://leetcode.com/problems/longest-common-prefix/
>
> 의역 : 받은 문자열 중, 공통으로 들어가있는 문자열을 반환하라, 없을 경우 "" 를 반환하라.
>



### 예시 ###

```python
Input: strs = ["flower","flow","flight"]
Output: "fl"
```

```python
Input: strs = ["dog","racecar","car"]
Output: ""
Explanation: There is no common prefix among the input strings.
```


### 코드 ###

```python
class Solution(object):
    def longestCommonPrefix(self, strs):
        """
        :type strs: List[str]
        :rtype: str
        """
        
        wow = []
                              
        strs.sort(key=lambda x : len(x))

        for i in range(len(strs[0])):

            for j in range(1, len(strs)):

                if strs[0][i] != strs[j][i]:

                    wow.append(strs[0][:i])

        return wow[0]
```


### 풀이 ###


> 배열로 여러 문자열이 있을 때, 동일한 문자열을 어떻게 반환할 것인가 ? 곰곰히 생각해보니.. 다들 길이가 재각각 인데 가장 짧은 문자열 순으로 정렬해서 맨 앞에 있는 애랑 비교해서 같은것만 반환하면 되지 않을까 ?
>
> 라는 생각을 하게 되었다. lambda 와 map 을 예전에 써본 기억이 있기에 다시 한번 해당 내용을 찾았다.
>
> strs 배열로 문자열을 받으면 lambda 를 가장 짧은 순으로 sort 한 후, for 문으로 strs[0] 의 문자열 즉,
>
> 가장 짧은 문자열의 횟수만큼 반복을 하면서, strs 의 총 갯수 만큼 다시 for 문을 돌린다.
>
> 그렇게 비교하면서 strs 의 가장 짧은 문자열의 1..2... 번째 순으로 돌리면서 같지 않은 값이 나오면 그 전까지의 비교문은 동일하다고 생각하기에, 해당 값을 wow 라는 리스트에 저장을 한다.
>
> 그럼 결국 strs 의 가장 짧은 문자열을 기점으로 비교하여, 겹치는 문자열이 wow 에 저장된다.








작성자 : 현의노래

작성일 : 2021년 04월 12일