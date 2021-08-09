---
id: doc9
title: 레드마인 권한도구 만들기
---

## 레드마인 권한 도구



**레드마인** 을 사내 ALM 으로 쓰고 있고, 매년 ISMS 심사를 받다보니 해당 근거를 위해 반기마다 사용자의 권한을 초기화 이후, 기안을 받아 권한을 매번 재 갱신하는데..

여간 귀찮을 수가 없다.

마침  **Python** 을 사내 스터디를 하면서 이후에도 계속 독학을 하고 있었으니
만들어 보기로 하고 만들어 보았다.

사내 기안을 엑셀로 정리하고  그 엑셀을 대상으로 자동으로 해당 권한을 설정하고
또, 반기마다 새롭게 권한 초기화를 하는 기능을 생각해보았다.

**PS** 그때는 2017년 도였기에.. 정말 생각없이 의식의 흐름대로 만들어서 .. 지금은 쓰지 않는다.
(PyQT 라이선스 이슈도 있어 결국 사용하지 않음)

**PS** 현 글 작성 시점에는.. 사내 인트라넷과 API 를 연동하여 기안승인시 자동으로 권한 설정하게 변경하였다. 



> 언어 : python (PyQT5, redmineapi)
>
> 구조 : 생략




### Redmine access control tool

```python
import sys
from PyQt5.QtWidgets import *
from PyQt5.QtGui import *
from PyQt5 import uic
from redminelib import Redmine
from src import Base_info
import win32com.client

#UI 파일 로드 설정
form_0, base_0 = uic.loadUiType(Base_info.UI_000_action)
form_2, base_2 = uic.loadUiType(Base_info.UI_002_redmine_login)
from_3, base_3 = uic.loadUiType(Base_info.UI_003_redmine_menu)
from_4, base_4 = uic.loadUiType(Base_info.UI_004_redmine_single)
from_5, base_5 = uic.loadUiType(Base_info.UI_005_redmine_single_create_user)
from_6, base_6 = uic.loadUiType(Base_info.UI_006_redmine_single_create_project)
from_7, base_7 = uic.loadUiType(Base_info.UI_007_redmine_multi)

# 레드마인 로그인 팝업
class redmine_login(base_2, form_2):
    def __init__(self):
        super(base_2, self).__init__()
        self.setupUi(self)
        self.SAVE.clicked.connect(self.gettext)
        self.SAVE.clicked.connect(self.logincheck)

        # PW 입력 영역의 마스킹 처리를 위한 함수
        self.input_pw.setEchoMode(QLineEdit.Password)

# 로그인 정보에 대한 전역변수 정의
    def gettext(self):
        global redmine_url
        global redmine_id
        global redmine_pw
        redmine_url = self.input_url.text()
        redmine_id = self.input_id.text()
        redmine_pw = self.input_pw.text()
    
    # 로그인 시도 시, 로그인 유효성 여부를 확인하는 함수    
    def logincheck(self):
        global redmine
        # 레드마인 API 접속 여부를 위한 URL, ID, PW request
        redmine = Redmine(redmine_url + Base_info.urlinfo, requests={'verify': False}, username=redmine_id, password=redmine_pw)
        global pj_name
        global pj_list
        global pj_id
        pj_list = []
        pj_name = []
        pj_id = []
        try:
            # Admin 권한 조회 여부를 위한 프로젝트 정보 조회 (조회 하고자 하는 프로젝트의 식별자 명을 입력)
            check = redmine.project.get('r-e')
            for project in redmine.project.all():
                # 프로젝트 이름을 pj_name 전역 변수에 추가
                pj_name.append(project.name)
                pj_list.append(project.identifier)
                pj_id.append(project.id)
            self.change_002()
        except:
            # 권한이 없거나, HTTP 정보가 잘못되었을 경우 처리
            # Redminelib Error 에 대한 코드 예외처리 못하여 except 발생시 무조건 로그인 불가 처리
            QMessageBox.about(self, "알림", 'URL, ID, PW 정보 또는 접속 권한을 확인 후, 재 입력 하세요')

        # 권한정보 검색
        global role_list
        role_list = []
        for role in redmine.role.all():
            role_list.append(role)
            
    def change_002(self):
        self.main = redmine_menu()
        self.main.show()
        self.close()

# 레드마인 첫 메뉴 화면
class redmine_menu(base_3, from_3):
    def __init__(self):
        super(base_3, self).__init__()
        self.setupUi(self)
        self.reset_B.clicked.connect(self.reset)
        # 개별, 전체 권한 설정 수정 필요
        self.single_B.clicked.connect(self.change_003)
        self.multi_B.clicked.connect(self.change_013)

    # 준비중 메뉴 클릭 시 이벤트
    def not_ready(self):
        QMessageBox.about(self, "알림", "준비중 입니다.")

    # 레드마인 권한 전체 초기화 함수
    def reset(self):
        # 메시지 박스 변수 선언
         Reply = QMessageBox.question(self, '확인', "모든 권한을 초기화 하시겠습니까 ?", QMessageBox.Yes | QMessageBox.No, QMessageBox.No)
         if Reply == QMessageBox.Yes:
             self.change_004() # 작업중 알림 팝업 노출
             if groups_projectlist():
                if projectlist():
                    QMessageBox.about(self, "알림", '모든 프로젝트 멤버의 권한이 삭제 되었습니다.')
                    self.change_005() # 화면을 다시 메뉴로 돌리기 위한 방법
                else:
                    QMessageBox.about(self, "알림", '모든 프로젝트 멤버의 권한 삭제 작업 중 오류가 발생 하였습니다.')
    
    # 전체 권한 설정 화면으로 이동하는 함수
    def change_013(self):
        self.main = redmine_multi()
        self.main.show()
        self.close()

    # 개인 권한 설정 화면으로 이동하는 함수         
    def change_003(self):
        self.main = redmine_menu_single()
        self.main.show()
        self.close()
    
    # 전체 권한 초기화 중, 다른 작업 하지 못하게 하기 위한 대기 팝업 함수
    def change_004(self):
        self.main = action()
        self.main.show()
        self.close()
    
    # 이전 버튼 클릭시 레드마인 메뉴 화면으로 이동하는 함수
    def change_005(self):
        self.main = redmine_menu()
        self.main.show()
        self.close()
    
# UBcare 접속 권한 관리 도구 메인
class redmine_menu_single(base_4, from_4):
    def __init__(self):
        super(base_4,self).__init__()
        self.setupUi(self)
        # 이번 버튼 클릭 시, 기능
        self.back_B.clicked.connect(self.change_006)
        
        # 유저 > 조회 버튼 클릭 시, 기능
        self.search_B.clicked.connect(self.get_search_mail)
        self.search_B.clicked.connect(self.search_result)
        
        # 유저 > 신규 버튼 클릭 시, 기능
        self.new_B.clicked.connect(self.change_008)
        
        # 프로젝트 선택  버튼 클릭 시, 기능
        self.new_B_3.clicked.connect(self.get_project_name)
        
        # 프로젝트 신규 버튼 클릭 시, 기능
        self.new_B_2.clicked.connect(self.change_011)
        
        # 권한정보 선택 버튼 클릭 시, 기능
        self.new_B_5.clicked.connect(self.get_role_name)
        
        # 적용 버튼 클릭 시, 기능
        self.ok_B.clicked.connect(self.apply)
        
        # 프로젝트 리스트 뷰
        self.model = QStandardItemModel(self.PJ_list)
        project_list_count = -1
        try:
            while project_list_count < 1000:
                project_list_count = project_list_count + 1
                self.model.appendRow(QStandardItem(pj_name[project_list_count]))
        except:
            pass
        self.PJ_list.setModel(self.model)
        
        # 권한정보  리스트 뷰
        self.model = QStandardItemModel(self.rl_list)
        global role_list_count
        role_list_count = -1
        try:
            while role_list_count < 1000:
                role_list_count = role_list_count + 1
                self.model.appendRow(QStandardItem('{}'.format(role_list[role_list_count])))
                #print(role_list[role_list_count])
        except:
            pass
        self.rl_list.setModel(self.model)
    
    # 개인 권한 설정 [적용] 버튼 클릭 시 동작하는 함수
    def apply(self):
        if add_result():
            select = QMessageBox.question(self, '알림', "[{}] 님의 [{}] 프로젝트 [{}] 권한을 부여 합니다.".format(user_name[count_num],pj_name[projectview_num.row()],role_list[roleview_num.row()]), QMessageBox.Yes | QMessageBox.No, QMessageBox.No)
            if select == QMessageBox.Yes:
                # 권한 부여 작업이 후, redmine_menu_single Class 로 값을 돌려보냄
                if add_acs_single():
                    QMessageBox.about(self, "알림", '선택한 정보의 권한이 적용 되었습니다.')
                    self.change_007()
                else:
                    QMessageBox.about(self, "알림", '이미 해당 권한이 존재 합니다. 확인 해 주세요')
        else:
            QMessageBox.about(self, "알림", '선택한 정보를 확인 해 주세요.')
        
    # 권한정보 리스트의 선택한 권한정보 이름 얻어오는 함수
    def get_role_name(self):
        global roleview_num
        select_listview = self.rl_list.selectedIndexes()
        for roleview_num in select_listview:
            self.select_id_5.setText('{}'.format(role_list[roleview_num.row()]))
        
    # 프로젝트 리스트의 선택한 프로젝트 이름 얻어오는 함수
    def get_project_name(self):
        global projectview_num
        select_listview = self.PJ_list.selectedIndexes()
        for projectview_num in select_listview:
            self.select_id_4.setText('{}'.format(pj_name[projectview_num.row()]))
        
    # 이메일 입력 값 전역 변수 저장    
    def get_search_mail(self):
        global search_mail    
        search_mail = self.input_mail.text() # + '@ubcare.co.kr' // 계약, 파견의 경우 ubware 만 발급 되는 경우가 있어 해당 내용 제외 이메일로 검색
        
    # 유저 검색 결과 처리 함수    
    def search_result(self):
        if user_list():
            QMessageBox.about(self, "알림", '일치하는 유저가 없습니다.')
        else:
            # 검색 결과가 있을 경우, 기능
            Reply = QMessageBox.question(self, '경고', "일치하는 유저가 있습니다. 해당 유저를 선택하시겠습니까 ?", QMessageBox.Yes | QMessageBox.No, QMessageBox.No)
            # Yes 클릭 시, 해당 유저의 이메일 기준으로 이름과 유저 아이디를 검색 후, 변수 저장 label 영역에는 선택된 유저 정보를 노출
            if Reply == QMessageBox.Yes:
                self.select_id.setText('- 유저 [{}] 이 선택 되었습니다.'.format(user_name[count_num]))
                        
    # 레드마인 메인 메뉴를 불러오는 함수    
    def change_006(self):
        self.main = redmine_menu()
        self.main.show()
        self.close()
    
    # 레드마인 개인 권한 설정 화면을 불러오는 함수    
    def change_007(self):
        self.main = redmine_menu_single()
        self.main.show()
        self.close()
        
    # 회원 > 신규 버튼 클릭 시, 불러오는 함수    
    def change_008(self):
        self.main = redmine_single_create_user()
        self.main.show()
        self.close()
        
    def change_011(self):
        self.main = redmine_single_create_project()
        self.main.show()
        self.close()

# 레드마인 신규 유저 생성 클레스
class redmine_single_create_user(base_5, from_5):
    def __init__(self):
        super(base_5,self).__init__()
        self.setupUi(self)
        
        # 이번 버튼 클릭 시, 기능
        self.back_B.clicked.connect(self.change_009)
        
        # 생성 버튼 클릭 시, 기능
        self.create_B.clicked.connect(self.redmine_single_create_user_get_info)
        
        # 초기화 버튼 클릭 시, 기능
        self.view_reset_B.clicked.connect(self.change_010)
        
        # 인증 공급자 속성 값 전역 변수 정의
        global select_auth_list
        select_auth_list = ['AD 도메인', '내부']

        # 인증 공급자 화면 세팅
        self.model = QStandardItemModel(self.listView_auth)
        self.model.appendRow(QStandardItem(select_auth_list[0]))
        self.model.appendRow(QStandardItem(select_auth_list[1]))
        self.listView_auth.setModel(self.model)
        
    def redmine_single_create_user_get_info(self):
        # 아이디 생성 시, 필요한 변수값 전역변수로 정의
        global create_id
        global create_lastname
        global create_firstname
        global create_mail
        global check_auth
        
        create_id = self.lineEdit_id.text()
        create_lastname = self.lineEdit_lastname.text()
        create_firstname = self.lineEdit_firstname.text()
        create_mail = self.lineEdit_id.text() + '@ubcare.co.kr'
        
        select_auth = self.listView_auth.selectedIndexes()
        for check_auth in select_auth:
            pass
        
        if redmine_create_user_info_check():
            if redmine_create_user():
                Reply = QMessageBox.about(self, '알림', "유저가 정상적으로 생성 되었습니다.")
                self.change_010()  
            else:
                QMessageBox.about(self, "알림", '이미 등록 유저이거나, UBWARE 에 존재하지 않는 ID 입니다.')
        else:
            QMessageBox.about(self, "알림", '모든 입력 정보를 입력 해 주세요.')              
 
    # 레드마인 개인 권한 설정 화면을 불러오는 함수    
    def change_009(self):
        self.main = redmine_menu_single()
        self.main.show()
        self.close()
    
    # 신규 유저 등록 화면 리셋 하는 함수  
    def change_010(self):
        self.main = redmine_single_create_user()
        self.main.show()
        self.close()

# 레드마인 신규 프로젝트 생성 클레스
class redmine_single_create_project(base_6, from_6):
    def __init__(self):
        super(base_6,self).__init__()
        self.setupUi(self)
        
        # 프로젝트 이름 > 조회 버튼 클릭 시, 기능
        self.p_name_search_B.clicked.connect(self.project_search_get)
        self.p_name_search_B.clicked.connect(self.project_name_search_result)
        
        # 프로젝트 식별자 > 조회 버튼 클릭 시, 기능
        self.p_identifier_search_B.clicked.connect(self.project_search_get)
        self.p_identifier_search_B.clicked.connect(self.project_identifier_search_result)
        
        # 생성 버튼 클릭 시, 기능
        self.create_B.clicked.connect(self.project_create_result)
        
        # 초기화 버튼 클릭 시, 기능
        self.view_reset_B.clicked.connect(self.change_012)
        
        # 이전 버튼 클릭 시, 기능
        self.back_B.clicked.connect(self.change_013)

        # 상위 프로젝트 선택 리스트 뷰
        self.model = QStandardItemModel(self.listView_project)
        project_list_count = -1
        try:
            while project_list_count < 1000:
                project_list_count = project_list_count + 1
                self.model.appendRow(QStandardItem(pj_name[project_list_count]))
        except:
            pass
        self.listView_project.setModel(self.model)
            
    # 프로젝트 이름, 식별자 얻어오는 함수
    def project_search_get(self):
        global lineEdit_pname_get
        global lineEdit_pidentifier_get
        global proejct_descriptions_get
        global lineEdit_phomepage_get
        
        # 프로젝트 이름, 식별자, 설명, 홈페이지 정보 얻어오는 로직
        lineEdit_pname_get = self.lineEdit_pname.text()
        lineEdit_pidentifier_get = self.lineEdit_pidentifier.text()
        proejct_descriptions_get = self.textEdit_pdescription.toPlainText()
        lineEdit_phomepage_get = self.lineEdit_phomepage.text()

    # 프로젝트 이름 조회 함수
    def project_name_search_B(self):
        name_count = -1
        try:
            while name_count < 1000:
                while pj_name[name_count] != lineEdit_pname_get:
                    name_count = name_count + 1
                    if pj_name[name_count] == lineEdit_pname_get:
                        return True
        except:
            return False
                
    # 프로젝트 이름 조회 결과       
    def project_name_search_result(self):
        if self.project_name_search_B():
            QMessageBox.about(self, "알림", '일치하는 프로젝트 이름이 있습니다.')
        else:
            if lineEdit_pname_get != '':
                Reply = QMessageBox.question(self, '경고', "일치하는 프로젝트가 없습니다. 적용 하시겠습니까 ?", QMessageBox.Yes | QMessageBox.No, QMessageBox.No)
                # Yes 클릭 시, 프로젝트 명을 label 에 노출
                if Reply == QMessageBox.Yes:
                    self.label_h_001.setText('- 프로젝트 이름 [{}] 이 설정 되었습니다.'.format(lineEdit_pname_get))
            else:
                QMessageBox.about(self, "알림", '프로젝트 이름을 입력 해 주세요.')

    # 프로젝트 식별자 조회 함수
    def project_identifier_search_B(self):
        try:
            identifier_count = -1
            while  identifier_count < 1000:
                while lineEdit_pidentifier_get != pj_list[identifier_count]:
                    identifier_count = identifier_count + 1
                    if lineEdit_pidentifier_get == pj_list[identifier_count]:
                        return True
        except:
            return False
    
    # 프로젝트 식별자 조회 결과
    def project_identifier_search_result(self):
        if self.project_identifier_search_B():
            QMessageBox.about(self, "알림", '일치하는 프로젝트 식별자가 있습니다.')
        else:
            if lineEdit_pidentifier_get != '':
                Reply = QMessageBox.question(self, '경고', "일치하는 프로젝트 식별자가 없습니다. 적용 하시겠습니까 ?", QMessageBox.Yes | QMessageBox.No, QMessageBox.No)
                # Yes 클릭 시, 프로젝트 식별자를 label 에 노출
                if Reply == QMessageBox.Yes:
                    self.label_h_002.setText('- 프로젝트 식별자 [{}] 가 설정 되었습니다.'.format(lineEdit_pidentifier_get))
            else:
                QMessageBox.about(self, "알림", '프로젝트 식별자를 입력 해 주세요.')
                
                
    def is_public_get_result(self):
        # 프로젝트 공개여부 리턴 값에 대한 정의 
        if self.checkBox_all.isChecked():
            return True
        else:
            return False        

    def inherit_members_get_result(self):
        # 상위 프로젝트 상속 여부에 대한 정의 
        if self.checkBox_member.isChecked():
            return True
        else:
            return False
    
    # 프로젝트 생성 함수
    def project_create(self):
        # 상위 프로젝트 선택 여부에 따라, 상위 아이디 값을 치환해주는 로직
        if self.listView_project.selectedIndexes():
            parent_id = self.listView_project.selectedIndexes()
            for parent_id_get in parent_id:
                parent_id_get_setting = pj_id[parent_id_get.row()]
        else:
            parent_id_get_setting = ''
        
        # 레드마인 프로젝트 생성 로직
        redmine_proejct_create = redmine.project.create(name = '{}'.format(lineEdit_pname_get), 
                                                        identifier = '{}'.format(lineEdit_pidentifier_get), 
                                                        description = '{}'.format(proejct_descriptions_get), 
                                                        homepage = lineEdit_phomepage_get,
                                                        parent_id = parent_id_get_setting,
                                                        is_public = self.is_public_get_result(),
                                                        inherit_members = self.inherit_members_get_result())
        
        # 생성 요청한 프로젝트 생성 여부에 대한 조회 이후, 생성 결과를 리턴해주는 로직
        if redmine.project.get(lineEdit_pidentifier_get):
            return True
        else:
            return False
      
    def project_create_result(self):
        if self.project_create():
            QMessageBox.about(self, "알림", '프로젝트가 정상적으로 생성 되었습니다.')
            self.change_012()
        else:
            QMessageBox.about(self, "알림", '프로젝트 생성에 실패 하였습니다.')
          
    # 신규 프로젝트 화면 리셋 함수  
    def change_012(self):
        self.main = redmine_single_create_project()
        self.main.show()
        self.close()
        
    # 이전 버튼 클릭 시, 이전 화면 호출하는 함수  
    def change_013(self):
        self.main = redmine_menu_single()
        self.main.show()
        self.close()           

# 레드마인 전체 권한 설정 클레스
class redmine_multi(base_7, from_7):
    def __init__(self):
        super(base_7, self).__init__()
        self.setupUi(self)

        # 테이블 리스트 뷰 수정 불가 로직
        self.tableWidget.setEditTriggers(QAbstractItemView.NoEditTriggers)

        # 파일열기 버튼 클릭 시, 기능
        self.fileload_B.clicked.connect(self.openFileNameDialog)

        # 파일적용 버튼 클릭 시, 기능
        self.fileopen_B.clicked.connect(self.tableWidget_view_itemget)
        self.fileopen_B.clicked.connect(self.view_result_return)

        # 이전 버튼 클릭 시, 기능
        self.back_B.clicked.connect(self.change_014)

        # 화면 초기화 버튼 클릭 시, 기능
        self.reset_B.clicked.connect(self.change_015)

        # 적용 버튼 클릭 시, 기능
        self.apply_B.clicked.connect(self.redmine_acs_multi_result)

    # 파일 다이얼로그 함수
    def openFileNameDialog(self):
        global fileName
        global ws
        global excel
        options = QFileDialog.Options()
        options |= QFileDialog.DontUseNativeDialog
        fileName, _ = QFileDialog.getOpenFileName(self,"QFileDialog.getOpenFileName()", "","Excel Files (*.xlsx);;Excel Files (*.xls)", options=options)
        print(fileName)
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
            self.tableWidget.setEditTriggers(QAbstractItemView.NoEditTriggers) # 테이블 뷰 내용 수정 불가 기능
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

    # 에러 메시지 함수
    def error_QMessageBox(self):
        QMessageBox.about(self, "알림", '권한 설정 엑셀이 아닙니다. 파일을 확인 해 주세요.')

    # 레드마인 메뉴 클레스 호출 함수
    def change_014(self):
        self.main = redmine_menu()
        self.main.show()
        self.close() 
    
    # 레드마인 전체 권한 클레스 호출 함수
    def change_015(self):
        self.main = redmine_multi()
        self.main.show()
        self.close()

    # 적용 버튼 클릭 시, redmine_acs_multi() 값 받아오는 함수
    def redmine_acs_multi_result(self):
        if redmine_acs_multi():
            QMessageBox.about(self, "알림", '엑셀 파일의 모든 권한이 설정 되었습니다.')
        else:
            QMessageBox.about(self, "알림", '엑셀 파일 중, 정보가 잘못 되었습니다. 확인 해 주세요.') 
            

# 프로젝트 멤버 중, 그룹에 속해 있는 멤버 삭제 함수
def groups_projectlist():
    count_groups = -1
    count_memberships = -1
    project_list = []
    groups = redmine.group.all()
    try:
        while count_groups < 10000:
            count_groups = count_groups + 1
            print(groups[count_groups])
            try:
                while count_memberships < 10000:
                    count_memberships = count_memberships + 1
                    redmine.project_membership.delete(groups[count_groups].memberships[0])
                    print('Delete Groups User')
            except:
                continue
    except:
        return True

# 프로젝트 멤버 중, 일반 유저 권한 삭제 함수
def projectlist():
    count_project = -1
    count_member = -1
    project_list = []
    for project in redmine.project.all(status=1):
        project_list.append(project.identifier)
    try:
        while count_project < 10000:
            count_project = count_project + 1
            search = project_list.pop(0)
            print(search)
            try:
                while count_member < 10000:
                    member = redmine.project.get(search)
                    count_member + count_member + 1
                    redmine.project_membership.delete(member.memberships[0])
                    print('Delete User')
            except:
                continue              
    except:
        return True

# 유저의 모든 정보를 받아오기 위한 함수 mail, id, name 으로 해당 정보 얻어옴
def user_list():
    global count_num, user_name, user_id, userlist
    count_user = -1
    userlist = []
    user_id = []
    user_name = []
    for users in redmine.user.all(status=1):
        userlist.append(users.mail)
        user_id.append(users.id)
        user_name.append(users)
    try:
        while search_mail != userlist[count_user]:
            count_user = count_user + 1
            count_num = count_user
    except:
        return True

# 레드마인 개인 권한 설정 필수 입력값을 확인하기 위한 함수
def add_result():
    try:
        if user_name[count_num] and pj_name[projectview_num.row()] and role_list[roleview_num.row()]:
            return True        
    except:
        return False

# 레드마인 개인 권한 설정 적용을 위한 함수
def add_acs_single():
    try:
        if redmine.project_membership.create(project_id=pj_list[projectview_num.row()], user_id=user_id[count_num],role_ids=[role_list[roleview_num.row()].id]):
            return True

    except:
        mem_update = []
        memberships = redmine.project_membership.filter(project_id=pj_list[projectview_num.row()])
        for mem in memberships:
            mem_update.append(mem)
        try:
            check_mem = -1
            while check_mem < 1000:
                mem_id_search = []
                check_mem = check_mem + 1
                membership = redmine.project_membership.get(mem_update[check_mem])
                for i in membership:
                    mem_id_search.append(i)
                mem_id_search.sort()
                if mem_id_search[3][1]['id'] == user_id[count_num]:
                    role = mem_id_search[2][1]
                    role = list(map(lambda x: x['id'], role))
                    role.append(role_list[roleview_num.row()].id)
                    redmine.project_membership.update(mem_update[check_mem], role_ids=role)
                    return True        
        except:
            return False
        
# 레드마인 유저 정보 유효성 검사 함수
def redmine_create_user_info_check():
    global set_auth
    try:
        if create_id and create_lastname and create_firstname and create_mail and select_auth_list[check_auth.row()]:
            if select_auth_list[check_auth.row()] == select_auth_list[0]:
                set_auth = 1
            elif select_auth_list[check_auth.row()] == select_auth_list[1]:
                set_auth = 2
            return True
    except: 
        return False

# 레드마인 유저 생성 함수    
def redmine_create_user():
    try:
        if redmine.user.create(login=create_id, firstname=create_firstname, lastname=create_lastname, mail=create_mail, auth_source_id=set_auth, mail_notification='only_my_events'):
            return True
    except:
        return False

# 엑셀 업로드 전체 권한 설정 함수    
def redmine_acs_multi():
    tableWidget_list_001_count = 0
    tableWidget_list_002_count = 0
    tableWidget_list_005_count = 0
    projecj_name_search_count = -1
    project_role_search_count = -1
    project_usermail_search_count = -1
    project_name_search_list = []
    project_role_search_list = []
    project_usermail_list = []
    
    # tableWidget_list_001 의 프로젝트 이름 조회 하여 프로젝트 ID 로 치환 후, 리스트로 저장
    try:
        while pj_name[projecj_name_search_count] != tableWidget_list_001[tableWidget_list_001_count]:
            projecj_name_search_count = projecj_name_search_count + 1
            if str(pj_name[projecj_name_search_count]) == tableWidget_list_001[tableWidget_list_001_count]:
                project_name_search_list.append(pj_list[projecj_name_search_count])
                tableWidget_list_001_count = tableWidget_list_001_count + 1
                projecj_name_search_count = -1
                continue
            if tableWidget_list_001 == []:
                break
    except:
        pass
        
    # tableWidget_list_002 의 권한 조회 하여, role ID 로 치환 후, 리스트로 저장
    try:
        while role_list[project_role_search_count] != tableWidget_list_002[tableWidget_list_002_count]:
            project_role_search_count = project_role_search_count + 1
            if str(role_list[project_role_search_count]) == tableWidget_list_002[tableWidget_list_002_count]:
                project_role_search_list.append(role_list[project_role_search_count].id)
                tableWidget_list_002_count = tableWidget_list_002_count + 1
                project_role_search_count = -1
                continue
            if tableWidget_list_002 == []:
                break
    except:
        pass

    # tableWidget_list_005 의 이메일 정보 조회 하여, 유저 ID 로 치환 후, 리스트로 저장
    try:
        # user_list 함수를 돌려서 유저 리스트 전역 변수에 해당 값들을 우선 저장
        user_list() 
        while userlist[project_usermail_search_count] != tableWidget_list_005[tableWidget_list_005_count]:
            project_usermail_search_count = project_usermail_search_count + 1
            if userlist[project_usermail_search_count] == tableWidget_list_005[tableWidget_list_005_count]:
                project_usermail_list.append(user_id[project_usermail_search_count])
                tableWidget_list_005_count = tableWidget_list_005_count + 1
                project_usermail_search_count = -1
                continue
            if tableWidget_list_005 == []:
                break
    except:
        pass    

    # 모든 리스트 값의 공백 여부 판단하여 권한 작업 진행
    if project_name_search_list and project_role_search_list and project_usermail_list != []:
        redmine_acs_multi_count = -1
        try:

            while project_name_search_list[redmine_acs_multi_count] and project_role_search_list[redmine_acs_multi_count] and project_usermail_list[redmine_acs_multi_count]:
                redmine_acs_multi_count = redmine_acs_multi_count + 1
                try:
                    if redmine.project_membership.create(project_id=project_name_search_list[redmine_acs_multi_count], user_id=project_usermail_list[redmine_acs_multi_count], role_ids=[project_role_search_list[redmine_acs_multi_count]]):
                        continue
                except:
                    mem_update = []
                    memberships = redmine.project_membership.filter(project_id=project_name_search_list[redmine_acs_multi_count])
                    for mem in memberships:
                        mem_update.append(mem)
                        try:
                            check_mem = -1
                            while check_mem < 1000:
                                mem_id_search = []
                                check_mem = check_mem + 1
                                membership = redmine.project_membership.get(mem_update[check_mem])
                                for i in membership:
                                    mem_id_search.append(i)
                                mem_id_search.sort()
                                if mem_id_search[3][1]['id'] == project_usermail_list[redmine_acs_multi_count]:
                                    role = mem_id_search[2][1]
                                    role = list(map(lambda x: x['id'], role))
                                    role.append(project_role_search_list[redmine_acs_multi_count])
                                    redmine.project_membership.update(mem_update[check_mem], role_ids=role)
                        except:
                            continue

        except:
            return True

# 처리중 화면
class action(base_0, form_0):
    def __init__(self):
        super(base_0,self).__init__()
        self.setupUi(self)


```



작성자 : 현의노래

작성일 : 2021년 02월 26일