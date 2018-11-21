![](https://github.com/KOREN-Platform/SmartX_Open_Platform/blob/master/Images/platform_home.PNG)

# Platform
----------
  
## 하부 오픈 플랫폼

![](https://github.com/KOREN-Platform/Platform/blob/master/Images/lower.png)

KOREN 상에 배치되어 운용되고 있는 기존의 SmartX Playground 인프라 자원을 활용하는 KOREN 클라우드 인프라를 고도화하기 위해 SmartX Playground 인프라를 IoT-Cloud에 대응 가능한 형태로 발전시키기 위한 연구를 수행한다. 이를 위해 기존 배치된 SD-WAN Box 및 Cloud Box와 새로이 추가된 SD-Access Box의 기능을 수행할 미니 서버-스위치 장비를 이용해 SmartX Playground 인프라를 IoT-Cloud 대응형 인프라로 고도화한다. 더불어 KOREN SmartX 오픈 플랫폼의 구축을 통해 하부 오픈 플랫폼 상에서 SmartX Playground 인프라의 Visibility(가시성) Data 및 IoT-SDAccess-Cloud-SDWAN- Tower의 각 계층을 연계하는 종단 간 인프라 자원상태의 Visibility Data 및 가시화 UI(User Interface)를 제공한다. 이를 위해 IoT-Cloud 대응 SmartX Playground 인프라에 존재하는 SDN 제어기 및 클라우드 제어기를 중앙에서 효율적으로 연동할 수 있도록 ID Federation 기능을 개발하고, 이를 활용해 Visibility OpenAPIs 및 가시화 UI를 개발 및 제공한다. 결과적으로 향후 KOREN SDI와의 연동을 통해 KOREN SmartX 오픈 플랫폼 기반의 SDN/Cloud 통합 SmartX Playground 인프라가 다양한 서비스를 지원할 수 있다.

## 상부 오픈 플랫폼
![](https://github.com/KOREN-Platform/Platform/blob/master/Images/upper.png)
 
 KOREN SmartX Playground 인프라를 통해 사물인터넷, 기가인터넷, 모바일 등을 포함하는 다양한 분야의 서비스를 실증하고 KOREN SmartX 상부 오픈 플랫폼에서 개발자 맞춤형 Orchestration을 지원하기 위해서, 인프라 슬라이싱에 대해서 단계적으로 구현 계획을 설계하고 이를 개발자들에게 개방된 형태의 OpenAPI로 제공하는 것을 목표로 한다. 이를 위해 SmartX 하부 오픈 플랫폼에 위치한 Playground 제어기를 활용하여 클라우드/네트워크에 대한 인프라 슬라이싱을 설계 및 구현한다. 인프라 슬라이싱의 대상을 분산 형태의 OpenStack 기반의 클라우드와 서로 다른 사이트를 연결해주는 SD-WAN 네트워크, 그리고 분산 형태 클라우드와 IoT를 연결해주는 SD-Access 네트워크 영역으로 한정하여 연구를 진행한다. 이에 따라 각 개발자들이 슬라이싱 된 클라우드 자원과, SDN 및 자체적으로 개발한 OvN을 통해 네트워크 슬라이스를 포함하는 인프라 슬라이스를 제공 받도록 한다. 이러한 기능들을 어플리케이션 개발자가 사용할 수 있도록 인프라 슬라이싱 중심의 Orchestration OpenAPIs를 개발하여 지원한다. 해당 OpenAPI들을 활용한 다양한 응용서비스를 실증하기 위하여, 레퍼런스 모델 차원의 컨테이너 기반의 응용서비스 실증 워크플로우 또한 단계적으로 설계하고 지원한다. 마이크로서비스 아키텍처 구조에 따라 서비스를 컨테이너화된 요소 기능(Function)으로 나누고, 이러한 기능들과 기능들의 연결 (Stitching)을 통해 최종적으로 서비스 합성에 의한 서비스 수행 결과를 실증하는 것을 목표로 한다. 일련의 과정들은 워크플로우 형태로 정리함으로써 어플리케이션 개발자가 자신들의 서비스를 OpenAPI를 활용하여 손쉽게 실증할 수 있는 기반을 마련한다.
