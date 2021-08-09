---
id: doc11
title: Leet Code - Two sum
---

## 알고리즘 공부



**Leet Code Python - Two Sum**




### 문제 ###

Given an array of integers **nums** and an integer **target**, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

> 주소 : https://leetcode.com/problems/two-sum/
> 
> 의역 : **nums** 중에서 2가지 값을 더해, **target** 과 같으면 해당 **nums** 배열 값의 index 를 반환하라.



### 예시 ###

```python
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Output: Because nums[0] + nums[1] == 9, we return [0, 1].
```

```python
Input: nums = [3,2,4], target = 6
Output: [1,2]
```

```python
Input: nums = [3,3], target = 6
Output: [0,1]
```



### 코드 ###

```python
class Solution(object):
    def twoSum(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: List[int]
        """
        for i in range(len(nums) - 1):
            for j in range(i + 1, len(nums)):
                wow = nums[i] + nums[j]
                if wow == target:
                    return i,j
```



### 풀이 ###


> nums 에 [1,2,3,4,5] tartget 이 7 이라는 가정
> 
> i 는 for 문으로 nums 의 총갯수인 5개에서 1을 뺀 4번 반복 = 0,1,2,3
> 
> j 는 for 문으로 위의 i 값에 + 1을 더한 값부터 nums 의 총갯수인 5번 반복
> 
> nums[i] 값과 nums[j] 값을 더해 wow 라는 변수로 저장
> 
> wow 의 값이 target 값과 동일하면 i, j 값을 리턴








작성자 : 현의노래

작성일 : 2021년 03월 27일