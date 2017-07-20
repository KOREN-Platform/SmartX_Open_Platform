## Visibility OpenAPIs for OF@KOREN Playground Users!

![](https://github.com/KOREN-Platform/Open-Platform/blob/master/Visibility_OpenAPIs/visibility.png)

본 페이지에서는 OF@KOREN Playground 사용자들의 편의성을 위한 모니터링 지원 기능에 대한
Open API를 제공합니다.

사용자 여러분께서는 아래 제공되는 Open API를 활용해

OpenStack 기반의 OF@KOREN Playground 환경의 상태를 실시간으로 감시할 수 있습니다.

Open API들은 요청(Request)에 대한 응답으로 JSON 방식의 데이터를 응답(Response)합니다.

해당 API들은 Python 언어와 Django 프레임워크, pymongo 라이브러리 및 MongoDB를 활용하여 제작했습니다.



***

### REST APIs for OF@KOREN Playground Visibility


* MongoDB Collection List Data [GET]: 103.22.221.55:8181/mongodb_collection_list

* Multiview User List Data [GET]: 103.22.221.55:8181/configuration_multiview_users

* Physical Box List Data [GET]: 103.22.221.55:8181/configuration_pbox_list

* Virtual Switch List Data [GET]: 103.22.221.55:8181/configuration_vswitch_list

* Virtual Box List Data [GET]: 103.22.221.55:8181/configuration_vbox_list

* Service List Data [GET]: 103.22.221.55:8181/configuration_service_list

* Physical Box Path Status Data [GET]: 103.22.221.55:8181/configuration_pbox_path_status

* Virtual Switch Status Data [GET]: 103.22.221.55:8181/configuration_vswitch_status

* Flow Configuration Data [GET]: 103.22.221.55:8181/flow_configuration_sdn_controller_rt

* Flow Status Data [GET]: 103.22.221.55:8181/flow_stats_sdn_controller_rt



***

질문이나 피드백은 언제나 환영합니다. 아래의 메일 주소나 issues 페이지를 통해 소중한 의견 부탁드립니다.

문의: ops@smartx.kr, [Playground issues](https://github.com/SmartX-Labs/KOREN-Playground/issues)
