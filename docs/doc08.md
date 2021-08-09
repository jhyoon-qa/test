---
id: doc8
title: 레드마인 Plugin & Migration
---

## 레드마인 플러그인 설치 및 마이그레이션 하기 (bitnami)

레드마인은 좋은 오픈소스 도구이다.

하지만 오픈소스 이다보니 ALM 을 관리하는 사람에게는 여간 골치거리가 아닐 수 없다.

일반적으로 메이저 버전이 업데이트가 될 경우에는, 전사에서 사용중인 ALM 의 버전을 업그레이드 하기 때문에 충분한 테스트 후 진행하지만 현재는 각종 인트라넷에 API 연동을 해두었기 때문에 더 어렵고 힘든 작업일 수 밖에 없다.

Plugin 을 새로 설치한다던가 메이저 버전으로 레드마인 자체를 업그레이드 한다던가 할때는 DB 마이그레이션 그리고 레드마인 버전의 관계를 매우 따지기 때문에 항상, 버전 호환성을 체크해야만 한다.

이글에서는 레드마인 플러그인 설치 및 DB 와의 마이그레이션 방법을 설명하고자 한다.

#### 진행절차

:::info
● 레드마인 플러그인 경로 : 레드마인설치경로/apps/redmine/htdocs/plugin

● 레드마인 플러그인 주소 [클릭](https://www.redmine.org/plugins)
:::

1. 레드마인 플러그인을 레드마인 플러그인 경로에 폴더형태로 복사한다.
:::caution
● 플러그인 폴더명은 플러그인 명과 동일해야한다.
:::

2. 다음 폴더로 이동한다.
```shell
cd 레드마인설치경로/apps/redmine/htdocs
```

3. 다음 명령어로 마이그레이션을 진행한다.
```shell
sudo RAILS_ENV=production bundle exec rake db:migrate
```

4. 다음 명령어로 설정을 완료한다.
```shell
bundle install
```
:::info
● 특정 bundle 이 설치가 안된다면 다음 명령어으로 해당 플러그인을 무시한다.
```shell
 bundle install --without development bundle
```
:::



작성자 : 현의노래

작성일 : 2021년 02월 25일