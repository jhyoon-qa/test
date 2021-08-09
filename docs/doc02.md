---
id: doc2
title: 레드마인 Gantt 한글
---

## 레드마인 Gantt 한글 안나올 때



**Redmine** 에서 버전을 가지고 일정을 확인할때, 주로 이미지로 Gantt 를 출력하여 보고할때 주로 쓰곤 하였다.

하지만 **Redmine** 버그인지는 몰라도 Gantt 를 이미지로 저장할때 한글이 ????? 로 표시되는 이슈가 있어 해당 방법을 찾다가 알게되어 공유한다. 



#### 1. 폰트 다운로드

[무료나눔고딕](https://www.wfonts.com/font/nanumgothic)

###### ※ ttf 파일을 다운로드 받는다.



#### 2. Redmine의 configuration.yml 파일을 찾아 수정한다.



#### 3. configuration.yml 파일 안의 "rmagick_font_path" 부분을 검색 후, 글씨체 경로를 입력한다.

예시) rmagick_font_path: /usr/share/fonts/truetype/nanum/[NanumGothic.ttf](https://jhyoon-repository.tistory.com/NanumGothic.ttf)



#### 4. Redmine 을 재 시작 한다.



작성자 : 현의노래

작성일 : 2021년 02월 23일