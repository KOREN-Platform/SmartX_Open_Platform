<<<<<<< HEAD
# KOREN SmartX_Open_Platform

KOREN 기반의 정보 기술 및 서비스 개발/운영을 위한 KOREN 사용자 중심의 오픈 플랫폼

## System Architecture
  * Main Architecture
    - 오픈소스 소프트웨어 기반으로 SDN/NFV/Cloud를 통합한 소프트웨어-정의 (Software-Defined) 인프라의 구축과 운용을 위한 오픈 플랫폼
    - ONOS/OpenStack 기반 SD-Access/Cloud/SD-WAN 제어와 종단간 가시화가 이뤄지는 관제타워를 구성하여 Visibility/Orchestration를 활용할 수 있는 OpenAPIs 제공
![Architecture](./Images/Architecture.png)

  * Network Architecture
    - Box : 오픈 플랫폼을 활용하여 서비스 시스템을 구축하기 위해 필요한 자원(컴퓨팅/네트워킹)을 가상화된 수준에서 제공
    - Box는 OpenStack 기반의 클라우드에 대응하는 Type C(Cloud Box), Server와 Switch를 한 박스에 담고 있는 Type S(Server/Switch Box), IoT-Cloud에 대응하는 Type O(SD-Access Box)로 구성
![Boxes](./Images/Boxes.png)

### Component Links
  
  * Service
     - [Smart Air IoT-Cloud Service](https://github.com/KOREN-Platform/IoT-Cloud_Services/tree/master/Smart_Air_IoT_Cloud_Service)
     - [Smart Campus Safety Service](https://github.com/KOREN-Platform/Smart-Campus-Safety-Service)
     - Smart Disaster Safety Service
  
  * Control Tower
     - [O+P Center](https://github.com/KOREN-Platform/SmartX_Open_Platform/tree/master/Centers/P%2BO%20Center)
     - [S Center](https://github.com/KOREN-Platform/SmartX_Open_Platform/tree/master/Centers/S%20Center)
     - [V Center](https://github.com/KOREN-Platform/SmartX_Open_Platform/tree/master/Centers/V%20Center)
    - [A Center](https://github.com/KOREN-Platform/SmartX_Open_Platform/tree/master/Centers/A%20Center)

  * Boxes
    - [O-Box](https://github.com/KOREN-Platform/SmartX_Playground/blob/master/Playground_Introduction_Guide/User_Guide/Type-O%20%EB%82%B4%EB%B6%80%20%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC%20%EC%84%A4%EC%A0%95%20%EB%B0%8F%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%20%EC%84%B8%EB%B6%80%20%EC%84%A4%EB%AA%85.pdf)
    - C-Box
    - S-Box

### Links
  - [Playground User Guide](https://github.com/KOREN-Platform/SmartX_Playground/blob/master/Playground_Introduction_Guide/User_Guide/readme.md)
  - [상세가이드](https://goo.gl/xyXfpd)
  - [Collaboration_2017](https://github.com/KOREN-Platform/Collaboration_2017)
  - [Technical_Documents](https://github.com/KOREN-Platform/Technical_Documents)
=======
# Intelligence OpenAPI

## Summary

Spark에 OpenAPI를 통해 접근이 가능한, Data Scientist를 위한 새로운 Spark 사용법

![Intelligence OpenAPI](./public/images/Intelligence_OpenAPI.jpg)

Developer를 위한 Swagger codegen 제공
>>>>>>> dev
