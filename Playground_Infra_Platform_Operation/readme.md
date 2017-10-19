## Playground Infrastructure & Platform: Operation 
-----------------------------------------------
### IoT-Cloud 대응형 SmartX Playground 인프라로의 보완 및 SDN/Cloud 기반 관제타워 정비

![](https://github.com/KOREN-Platform/Platform/blob/master/Images/2-1.png)

- IoT-Cloud 대응형 SmartX Playground 인프라의 설계 및 구축  
  본 과제에서 구축되고 활용되는 SmartX Playground 인프라에서 핵심 역할을 하는 SmartX Box (Server 및 Switch)는 미래형 서비스 실증에 필요한 각종 융합형 컴퓨팅/네트워킹 자원들을 가상화된 수준에서 지능적으로 제공하는 독자적인 자원 집합이다. 현재 KOREN에 분포되어 있는 SmartX 자원 중 KOREN-NOC, 고려대, 제주대, GIST에 설치된 Type C(Server) Smart Box를 활용한 OpenStack 기반의 클라우드 SmartX Type C Playground와 Server와 Switch 파트를 한 하드웨어에 담고 있는 다른 형태의 융합형 자원 Box인 Type S(Server Switch) SmartX Box가 KOREN-NOC, 성균관대, GIST에 배치되어 ONOS SDN 제어기 기반의 SmartX Type S Playground를 구성하고 있다. 상기한 기존 SmartX Playground 인프라를 새로이 정비하기 위해 총 4개의 Type C Box와 Type S Box를 KOREN-NOC, 성균관대, 제주대, GIST 4개 사이트에 각각 재배치한다.
  
 - SDN/Cloud 기반 관제 타워 설계 및 구축  
  앞서 각기 다른 멀티 사이트에 분포되어 있는 SmartX Box를 통해 구성된 IoT-Cloud 대응형 SmartX Playground 인프라의 중앙 관제가 가능토록 지원하기 위해, KOREN SmartX 하부 오픈 플랫폼에 SDN/Cloud 기반의 관제 타워를 구축할 계획이다. 관제 타워를 통한 SmartX Playground 인프라의 관제를 위해서는 관제 타워 내부에 SDN/Cloud 제어기의 제어 권한이 부여되어야 한다. 이를 위해 SmartX Playground 인프라에 존재하는 다수의 SDN/Cloud 제어기를 하나의 ID로 관리함으로써 다수의 클라우드 Box를 중앙에서 제어할 수 있도록 지원하는 ID Federation 기능의 개발을 진행한다. ID Federation 기능의 개발을 위해서는 OpenLDAP(Lightweight Directory Access Protocol)와 같은 오픈소스를 활용해 OpenStack 기반의 분산 클라우드의 인증 서비스를 담당하는 Keystone과, ONOS 제어기를 연동하여 관제 타워에서 다수의 SDN/Cloud 환경의 관제를 가능토록 설계한다. 최종적으로 개발된 ID Federation 기능을 적용해 관제 타워 내부에서 SDN/Cloud 제어기 연동 기반의 SmartX 하부 오픈 플랫폼을 통한 SmartX Playground 인프라의 관제가 가능하다.
  
Related Repository
----------------------------
https://github.com/KOREN-Platform/Platform/tree/master/Playground_Infra_Platform_Operation 

