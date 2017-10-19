## Orchestration OpenAPIs 구현
-------------------------------------------------------
### 개발자 맞춤형 인프라(클라우드/네트워크) 슬라이싱을 위한 Orchestration OpenAPIs 기반 구현

![](https://github.com/KOREN-Platform/Platform/blob/master/Images/3-1.png)

Playground 인프라를 통해 여러 어플리케이션 개발자들에게 인프라를 제공하기 위해서는 서로 다른 개발자들이 자신들의 서비스를 실증하기 위해 할당받은 인프라 영역을 침범하지 않도록 적절하게 고립된 (Isolated) 된 형태의 인프라 모음을 제공해야 한다. 이를 위해 KOREN SmartX Playground 인프라에 위치하는 분산형태의 클라우드 및 SD-WAN과 SD-Access 영역에 위치하고 있는 네트워크를 각 개발자들에게 제공하기 위한 인프라 슬라이싱에 대해 단계적인 구현 계획을 설계하고, 이를 통해 점진적인 개발을 진행한다. 인프라 슬라이싱은 어플리케이션 개발자들이 손쉽게 사용할 수 있게끔 Orchestration OpenAPIs 형태로 제공된다.

  
Related Repository
----------------------------
https://github.com/KOREN-Platform/Platform/tree/master/Orchestration_OpenAPIs 
