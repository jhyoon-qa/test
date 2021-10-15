---
id: doc7
title: Commit 히스토리 이전
---

## SVN 에서 GIT 히스토리 이전하기



요즘 회사들은 애초에 형상관리를 git 으로 시작하지만 오래된 기업에서는 아직도 종종 SVN 을 많이 사용하고 있다.



commit 히스토리가 워낙 오래 쌓여있기도 하고, 사실 SVN 에서 git 으로 이전은 Branch 전략을 통해 개발의 생산성을 높이고자 함에 있는데



오랫동안 써온것에 대한 익숙함 떄문이지 엄청난 반대 세력(?) 에 부딫히고는 한다.

그 이유는.. 아마도 굳이 잘 쓰고 있는 형상도구를 바꿀 필요가 없다는 생각과 막상 바꾸면 적응해야 하니까 불편한 것이고, 다른 이유로는 그동안 쌓인 방대한 commit 히스토리가 아까워서 (?) 그런 것 같다.



2015년 회사에 이직 후, 장기 로드맵을 세워보라는 말에 5년짜리 품질 로드맵을 당당하게 만들고 아직까지도 순차적으로 진행하고 있지만...



그때 과감하게 진행한 것이 바로 형상관리 도구의 교체 였다.

물론 많은 반대가 있었지만 지겨울 떄까지 쫒아 다니면서 설득한 끝에 결국 변경을 하게 되었다.



하지만, 가장 반대 이슈가 나의 경우에는 commit 히스토리였다.

꽤 오래된 제품이 존재했고, 거의 십년이 넘는 세월동안 commit 히스토리가 쌓여 왔기에 해당 commit 을 이전하는 조건으로 결국 설득을 하게 되었다.

그렇게 비장한 마음으로 SVN 에 있는 모든 프로젝트들을 확인하고 있었는데..

#### SVN 일반적인 폴더 구조

```shell
├── branch
│   └── branch 1
├── trunk
│   └── trunk 1
├── tag
│   └── tag 1
```


#### SVN 멘붕오는 폴더 구조

```shell
├── trunk 1
├── trunk 2
├── trunk 3
```

갑자기 찾아온 **멘붕** 

그래도 뭐 설마 이전이 안되겠어 ? 라는 생각으로 이전 작업을 하였으나..

**error** **error** **error** **error** **error** **error** **error**  

그렇게 좌절을 통해 수많은 구글링을 통하여 조합한 겨우겨우 어찌 해낸 방법을 공유한다.

:::info
다음 프로그램이 기본적으로 설치되어 있을 것 : **git** **java**

다음 파일을 다운로드 받을 것 [svn-migration-scripts](https://bitbucket.org/atlassian/svn-migration-scripts/src/master/)
:::

#### 진행절차

1. svn-migration-scripts 다운로드한 폴더로 가서 하기 명령어를 수행한다.
```shell
java -jar svn-migration-scripts.jar authors SVN주소 username passwd > authors.txt
```
:::info
● username passwd 부분은 SVN 에 접속 시 ID/PW 묻는 경우에만 입력한다.

● 해당 SVN 에 접근 가능한 ID/PW 를 입력
:::

2. authors.txt 생성이 완료되면 해당 파일 열어 방식을 수정한다.
```shell
linesong<linesong@mycompany.com> -> linesong<linesong@iwantgohome.com>
```

:::info
● 일반적인 폴더 구조 일 경우
```shell
git svn clone --stdlayout --authors-file=authors.txt SVN주소 --username username directory
```

● 일반적인 폴더 구조는 아니지만, branch / trunk / tag 폴더가 있을 경우
```shell
git svn clone --trunk=/dir1 --branches=/dir2 --tags=/dir3 --authors-file=authors.txt SVN주소 --username username directory
```

● 멘붕오는 폴더 구조 일 경우
```shell
git svn clone --trunk / SVN주소 -A authors.txt --username username directory
```
:::

부디 나처럼 고생하는 사람이 없기를 바라며...

작성자 : 현의노래

작성일 : 2021년 02월 25일
