## Orchestration OpenAPIs 구현
-------------------------------------------------------
### 개발자 맞춤형 인프라(클라우드/네트워크) 슬라이싱을 위한 Orchestration OpenAPIs 기반 구현

![](https://github.com/KOREN-Platform/Platform/blob/master/Images/3-1.png)

Playground 인프라를 통해 여러 어플리케이션 개발자들에게 인프라를 제공하기 위해서는 서로 다른 개발자들이 자신들의 서비스를 실증하기 위해 할당받은 인프라 영역을 침범하지 않도록 적절하게 고립된 (Isolated) 된 형태의 인프라 모음을 제공해야 한다. 이를 위해 KOREN SmartX Playground 인프라에 위치하는 분산형태의 클라우드 및 SD-WAN과 SD-Access 영역에 위치하고 있는 네트워크를 각 개발자들에게 제공하기 위한 인프라 슬라이싱에 대해 단계적인 구현 계획을 설계하고, 이를 통해 점진적인 개발을 진행한다. 인프라 슬라이싱은 어플리케이션 개발자들이 손쉽게 사용할 수 있게끔 Orchestration OpenAPIs 형태로 제공된다.

### 요구 및 준비 사항
본 슬라이싱을 위한 Orchestration OpenAPI는 특정 하드웨어로 구성된 플랫폼에서 적용되는 제한적인 버전입니다. 2017년 KOREN Playground 인프라를 구성한 버전에서 동작을 검증했으며, 향후 변경된 KOREN Playground에서는 동작이 안될 수 있으므로 유의하시기 바랍니다. 2017년 KOREN Playground의 자세한 인프라 구성을 확인하고 싶으시면 다음의 링크에서 확인할 수 있습니다.

https://github.com/KOREN-Platform/SmartX_Open_Platform/tree/master/Playground_Infra_Platform_Operation


### 슬라이싱 예제
IoT 단말기와 클라우드의 인스턴스 간의 슬라이싱 연결을 위해서는 다음과 같은 절차로 진행합니다.

1. 슬라이싱 ID 생성
```
./Slice_create.sh
```

2. 슬라이싱 ID 기반의 클라우드 가상 머신 생성 (클라우드 슬라이싱)
```
./Cloud_Slicing.sh
```

3. IoT 기기 연결을 위한 슬라이싱 생성 (SD-Access 슬라이싱)

이를 진행하기 위해 IoT 기기들은 적절하게 배치된 KOREN Playground 내의 Type O에 물리적으로 연결되어야 합니다.
```
./SD_Access_Slicing.sh
```

슬라이싱에 대한 자세한 개념 설명 및 사용을 보시려면 다음의 기술문서를 확인 바랍니다.

[KOREN SmartX Platform 환경에서 개발자 맞춤형 인프라를 제공하기 위한 인프라 슬라이싱 설계 및 검증](https://github.com/KOREN-Platform/Technical_Documents/blob/master/KOREN%2305_KOREN%20SmartX%20Platform%20%ED%99%98%EA%B2%BD%EC%97%90%EC%84%9C%20%EA%B0%9C%EB%B0%9C%EC%9E%90%20%EB%A7%9E%EC%B6%A4%ED%98%95%20%EC%9D%B8%ED%94%84%EB%9D%BC%EB%A5%BC%20%EC%A0%9C%EA%B3%B5%ED%95%98%EA%B8%B0%20%EC%9C%84%ED%95%9C%20%EC%9D%B8%ED%94%84%EB%9D%BC%20%EC%8A%AC%EB%9D%BC%EC%9D%B4%EC%8B%B1%20%EC%84%A4%EA%B3%84%20%EB%B0%8F%20%EA%B2%80%EC%A6%9D(2017)-GIST.pdf)

  
Related Repository
----------------------------
https://github.com/KOREN-Platform/Platform/tree/master/Orchestration_OpenAPIs 
