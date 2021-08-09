---
id: doc10
title: 깃랩 권한도구 만들기
---

## 깃랩 권한 도구



**깃랩** 을 사내 현상관리 도구로 쓰고 있고, **레드마인** 과 마찬가지로, 사내의 LDAP 와 연동하여 권한을 설정하여 사용하고 있어 ISMS 심사 때문에 보안상 분기별로 권한 설정을 해야하기에 여간 귀찮을 수가 없다.

마침  **Python** 을 사내 스터디를 하면서 이후에도 계속 독학을 하고 있었고, **레드마인** 권한 도구를 만들고 나서 이것도 만들어 보자고 만들어 보았다.

**레드마인** 과는 다르게 그냥 엑셀을 읽어 권한 설정을 하는것과 권한 초기화 하는 기능만 간단하게 만들었다.

**PS** 현재는 사용하지 않는다.

**PS** 현 글 작성 시점에는.. 사내 인트라넷과 API 를 연동하여 기안승인시 자동으로 권한 설정하게 변경하였다. 



> 언어 : python (PyQT5, gitlab)
>
> 구조 : 생략




### Gitlab  access control tool

```python
# -*- coding: utf8 -*-

import sys
from PyQt5.QtWidgets import *
from PyQt5.QtGui import *
from PyQt5 import uic
from src import Base_info
import gitlab
import win32com.client

#UI 파일 로드 설정
form_0, base_0 = uic.loadUiType(Base_info.UI_008_gitlab_login)
form_1, base_1 = uic.loadUiType(Base_info.UI_009_gitlab_menu)

# Gitlab 로그인 팝업
class login(base_0, form_0):
    def __init__(self):
        super(base_0,self).__init__()
        self.setupUi(self)

        # PW 입력 영역의 마스킹 처리를 위한 함수
        self.input_pw.setEchoMode(QLineEdit.Password)

        # 로그인 버튼 클릭 시, 기능 동작
        self.login_B.clicked.connect(self.login_check) # 로그인 여부에 따라 처리 해야함

    # Gitlab 로그인 로직
    def login_check(self):
        global gl
        info_url = self.input_url.text()
        info_id = self.input_id.text()
        info_pw = self.input_pw.text()
        gl = gitlab.Gitlab('{}'.format(info_url), email=info_id, password=info_pw)
        try:
            gl.auth()
            if gl.projects.list():
                self.gitlab_menu_connect()
            else:
                QMessageBox.about(self, "알림", '권한 설정이 불가능한 계정 입니다.')
                self.close

        # ID, PW, URL 유효성 체크 후, 해당 예외 코드 발생 시 알럿 노출
        except gitlab.exceptions.GitlabAuthenticationError:
            QMessageBox.about(self, "알림", 'ID, PW 정보를 확인 후, 재 입력 하세요')
        except gitlab.exceptions.GitlabConnectionError:
            QMessageBox.about(self, "알림", 'URL 정보를 확인 후, 재 입력 하세요.Base')

    def gitlab_menu_connect(self):
        self.main = gitlab_menu()
        self.main.show()
        self.close()

class gitlab_menu(base_1, form_1):
    def __init__(self):
        super(base_1,self).__init__()
        self.setupUi(self)

        # Gitlab 화면 로딩 시, 무조건 전체 권한, 유저 정보, 권한정보 읽어옴
        all_info_get()

        # 권한 초기화 버튼 클릭 시, 기능
        self.A_reset_B.clicked.connect(self.reset_result)

        # 화면 초기화 버튼 클릭 시, 기능
        self.V_reset_B.clicked.connect(self.gitlab_menu_re)

        # 파일열기 버튼 클릭 시, 기능
        self.fileload_B.clicked.connect(self.openFileNameDialog)
        
        # 파일적용 버튼 클릭 시, 기능
        self.fileopen_B.clicked.connect(self.tableWidget_view_itemget)
        self.fileopen_B.clicked.connect(self.view_result_return)

        # 적용 버튼 클릭 시, 기능
        self.apply_B.clicked.connect(self.gitlab_acs_result)
    
    # 권한 초기화 버튼 클릭 시, 기능 함수
    def reset_result(self):
        Reply = QMessageBox.question(self, '확인', "모든 권한을 초기화 하시겠습니까 ?", QMessageBox.Yes | QMessageBox.No, QMessageBox.No)
        if Reply == QMessageBox.Yes:
            if all_reset_result():
                QMessageBox.about(self, "알림", '모든 프로젝트 멤버의 권한이 삭제 되었습니다.')
                self.gitlab_menu_re
            else:
                QMessageBox.about(self, "알림", '모든 프로젝트 멤버의 권한 삭제 작업 중 오류가 발생 하였습니다.')

    # 파일 다이얼로그 함수
    def openFileNameDialog(self):
        global fileName
        global ws
        global excel
        options = QFileDialog.Options()
        options |= QFileDialog.DontUseNativeDialog
        fileName, _ = QFileDialog.getOpenFileName(self,"QFileDialog.getOpenFileName()", "","Excel Files (*.xlsx);;Excel Files (*.xls)", options=options)
        if fileName:
            # 엑셀 파일의 각 필드값을 가져와, 정의된 필드 값이 맞는지 확인
            excel = win32com.client.Dispatch("Excel.Application")
            excel.Visible = False
            wb = excel.Workbooks.Open('{}'.format(fileName))
            ws = wb.ActiveSheet

            # 각 엑셀 파일의 셀이 지정된 값과 동일한지 비교 로직
            Cells_count = 1
            tableWidget_item_count = 0

            try:
                while ws.Cells(1,Cells_count).Value == Base_info.tableWidget_item[tableWidget_item_count]:
                    Cells_count = Cells_count + 1
                    tableWidget_item_count = tableWidget_item_count + 1
                    if ws.Cells(1,Cells_count).Value == Base_info.tableWidget_item[tableWidget_item_count]:
                        self.lineEdit.setText(fileName)
                        return True
                    else:
                        QMessageBox.about(self, "알림", '지정된 엑셀 파일이 아닙니다. 파일을 확인 해 주세요.')
                        excel.Quit()
            except:
                excel.Quit()
        else:
            return False
    
    # 엑셀 파일의 속성 값을 테이블 리스트에 그려주는 함수
    def tableWidget_view_itemget(self):
        # 테이블 위젯에 그려줄 각 필드값 정의 및 카운트 변수 정의
        tableWidget_f = 1
        global tableWidget_list_001, tableWidget_list_002, tableWidget_list_003, tableWidget_list_004, tableWidget_list_005, tableWidget_list_006
        tableWidget_list_001 = []
        tableWidget_list_002 = []
        tableWidget_list_003 = []
        tableWidget_list_004 = []
        tableWidget_list_005 = []
        tableWidget_list_006 = []
        try:
            if fileName:
                # 각 리스트에 엑셀 각 셀에 대한 내용 저장하는 로직
                while  ws.Cells(tableWidget_f,1).Value != None:
                    tableWidget_f = tableWidget_f + 1
                    if ws.Cells(tableWidget_f,1).Value != None:
                        for i in ws.Cells(tableWidget_f,1):
                            tableWidget_list_001.append(i.Value)
                        for i in ws.Cells(tableWidget_f,2):
                            tableWidget_list_002.append(i.Value)
                        for i in ws.Cells(tableWidget_f,3):
                            tableWidget_list_003.append(i.Value)
                        for i in ws.Cells(tableWidget_f,4):
                            tableWidget_list_004.append(i.Value)
                        for i in ws.Cells(tableWidget_f,5):
                            tableWidget_list_005.append(i.Value)
                        for i in ws.Cells(tableWidget_f,6):
                            tableWidget_list_006.append(i.Value)
                    else:
                        break

        except NameError as e:
            QMessageBox.about(self, "알림", '엑셀 파일을 먼저 선택 해 주세요.')
        
        # 엑셀 값 읽어온 리스트를 테이블 뷰에 보여주는 로직
        view_table_item_count = -1
        if tableWidget_list_001 != []:
            self.tableWidget.setRowCount(tableWidget_f -2) # None 값을 제외 한 로우 값을 표시
            self.tableWidget.setColumnCount(6) # 필드 항목 갯수만큼 수동으로 지정
            self.tableWidget.setEditTriggers(QAbstractItemView.NoEditTriggers)
            while view_table_item_count < 10000:
                view_table_item_count = view_table_item_count + 1
                try:
                    self.tableWidget.setItem(view_table_item_count, 0, QTableWidgetItem("{}".format(tableWidget_list_001[view_table_item_count])))
                    self.tableWidget.setItem(view_table_item_count, 1, QTableWidgetItem("{}".format(tableWidget_list_002[view_table_item_count])))
                    self.tableWidget.setItem(view_table_item_count, 2, QTableWidgetItem("{}".format(tableWidget_list_003[view_table_item_count])))
                    self.tableWidget.setItem(view_table_item_count, 3, QTableWidgetItem("{}".format(tableWidget_list_004[view_table_item_count])))
                    self.tableWidget.setItem(view_table_item_count, 4, QTableWidgetItem("{}".format(tableWidget_list_005[view_table_item_count])))
                    self.tableWidget.setItem(view_table_item_count, 5, QTableWidgetItem("{}".format(tableWidget_list_006[view_table_item_count])))
                except:
                    continue
            return True
    
    # 모든 값 불러온 후, 열려있는 엑셀 파일 종료 함수
    def view_result_return(self):
        try:
            if self.tableWidget_view_itemget:
                excel.Quit()
        except NameError:
            pass

    # 적용 버튼 클릭 시, gitlab_acs() 값 받아오는 함수
    def gitlab_acs_result(self):
        if gitlab_acs():
            QMessageBox.about(self, "알림", '엑셀 파일의 모든 권한이 설정 되었습니다.')
        else:
            QMessageBox.about(self, "알림", '엑셀 파일 중, 정보가 잘못 되었습니다. 확인 해 주세요.')
 
    # 전체 권한 설정 화면으로 이동하는 함수
    def gitlab_menu_re(self):
        self.main = gitlab_menu()
        self.main.show()
        self.close()

# Gitlab 모든 사용 정보 얻어오는 함수
def all_info_get():
    # Gitlab 모든 프로젝트 정보 읽어옴
    global all_projects
    all_projects = []
    projects = gl.projects.all()
    #projects = gl.projects.list()
    for project in projects:
        all_projects.append(project)

    # Gitlab 모든 유저 정보 읽어옴
    global all_users
    all_users = []
    users = gl.users.list()
    for user in users:
        all_users.append(user)
    
    # Gitlab 권한 정보를 리스트로 저장 (Gitlab Acess Guide 참조)
    # http://python-gitlab.readthedocs.io/en/stable/gl_objects/access_requests.html
    # gitlab.GUEST_ACCESS : 10
    # gitlab.REPORTER_ACCESS : 20
    # gitlab.DEVELOPER_ACCESS : 30
    # gitlab.MASTER_ACCESS : 40
    # gitlab.OWNER_ACCESS : 50
    global all_acess
    all_acess = [gitlab.GUEST_ACCESS, gitlab.REPORTER_ACCESS, gitlab.DEVELOPER_ACCESS, gitlab.MASTER_ACCESS, gitlab.OWNER_ACCESS]

# 모든 권한 초기화 함수
def all_reset_result():
    project_count = -1
    for i in range(len(all_projects)):
        project_count = project_count + 1
        for i in range(len(all_projects[project_count].members.list())):
            members = all_projects[project_count].members.list()
            try:
                members[0].delete()
            except IndexError:
                continue
    return True

def gitlab_acs():
    # tableWidget_list_001 을 all_projects 와 비교하여, 해당 프로젝트를 리스트로 저장
    project_count = -1
    tableWidget_list_001_count = 0
    project_set = []

    while project_count < len(tableWidget_list_001):
        for i in range(len(all_projects)):
            project_count = project_count + 1
            try:
                if all_projects[project_count].name == tableWidget_list_001[tableWidget_list_001_count]:
                    project_set.append(all_projects[project_count])
                    tableWidget_list_001_count = tableWidget_list_001_count + 1
                    project_count = -1
            except IndexError:
                pass
        

    # tableWidget_list_002 값 을 비교하여, 리스트로 저장
    acs = ['GUEST', 'REPORTER', 'DEVELOPER', 'MASTER', 'OWNER']
    acs_count = -1
    tableWidget_list_002_count = 0
    set_acs = []
    try:
        while acs[acs_count] != tableWidget_list_002[tableWidget_list_002_count]:
            acs_count = acs_count + 1
            if acs[acs_count] == tableWidget_list_002[tableWidget_list_002_count]:
                set_acs.append(all_acess[acs_count])
                tableWidget_list_002_count = tableWidget_list_002_count + 1
                acs_count = -1
                continue
            if tableWidget_list_002 == []:
                break
    except IndexError:
        pass
    
    # tableWidget_list_003 값 user 값과 비교하여, id 로 변경 후, 리스트로 저장
    user_count = -1
    tableWidget_list_003_count = 0
    set_user = []
    try:      
        while all_users[user_count].name != tableWidget_list_003[tableWidget_list_003_count]:
            user_count = user_count + 1
            if all_users[user_count].name == tableWidget_list_003[tableWidget_list_003_count]:
                set_user.append(all_users[user_count].id)
                tableWidget_list_003_count = tableWidget_list_003_count + 1
                user_count = -1
                continue
            if tableWidget_list_003 == []:
                break
    except IndexError:
        pass


    # 권한 설정 로직
    acs_setting = 0
    if project_set and set_user and set_acs != []:
        for i in range(len(project_set)):
            #project_item = project_set[acs_setting]
            project_set[acs_setting].members.create({'user_id': set_user[acs_setting], 'access_level': set_acs[acs_setting]})
            #project_item.members.create({'user_id': set_user[acs_setting], 'access_level': set_acs[acs_setting]})
            acs_setting = acs_setting + 1
            continue
        return True


```



작성자 : 현의노래

작성일 : 2021년 03월 02일