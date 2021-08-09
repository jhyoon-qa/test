---
id: doc3
title: 레드마인 백업하기
sidebar_label: 레드마인 백업하기
---

## 레드마인 DB 백업(bitnami)



**bitnami** 제품에는 꽤 쓸만한것들이 많다. 아무래도 원패키지로 설치가 가능하다보니 예전까지 자주 사용 했지만, 요즘은 cloud 로 많이 제공을 하고 버전 업그레이드에 있어 순정을 쓸 때보다 에로 사항이 많아 쓰지는 않는다.

예전에 등록해 둔 블로글 이전을 위해 간략하게 적어두는 레드마인 DB 백업 방법



:::info

현재는 bitnami 에서는 설치용 파일을 제공하지 않는다.

:::



### Redmine 첨부파일 백업

```shell
cd 레드마인설치경로/apps/redmine/htdocs
tar cvfz redmine-files-20120627.tgz ./files/
```



### Redmine의 MySQL bitnami 계정의 비밀번호 확인

```shell
cat 레드마인설치경로/apps/redmine/htdocs/config/database.yml
```



### Bitnami Redmine Mysql DB 백업

```shell
cd 레드마인설치경로/mysql/bin
./mysqldump -u root -p bitnami_redmine > 백업할파일명.sql
```



작성자 : 현의노래

작성일 : 2021년 02월 23일