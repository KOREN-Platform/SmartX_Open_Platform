# SparkSubmitApi

All URIs are relative to *http://zest3:3000/client/v2*

Method | HTTP request | Description
------------- | ------------- | -------------
[**sparkSubmit**](SparkSubmitApi.md#sparkSubmit) | **POST** /sparkSubmit | You can running spark application by this API


<a name="sparkSubmit"></a>
# **sparkSubmit**
> sparkSubmit(body)

You can running spark application by this API



### Example
```java
// Import classes:
//import io.swagger.client.ApiClient;
//import io.swagger.client.ApiException;
//import io.swagger.client.Configuration;
//import io.swagger.client.auth.*;
//import io.swagger.client.api.SparkSubmitApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure OAuth2 access token for authorization: petstore_auth
OAuth petstore_auth = (OAuth) defaultClient.getAuthentication("petstore_auth");
petstore_auth.setAccessToken("YOUR ACCESS TOKEN");

SparkSubmitApi apiInstance = new SparkSubmitApi();
Spark body = new Spark(); // Spark | spark object that needs to be needed to the run
try {
    apiInstance.sparkSubmit(body);
} catch (ApiException e) {
    System.err.println("Exception when calling SparkSubmitApi#sparkSubmit");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**Spark**](Spark.md)| spark object that needs to be needed to the run |

### Return type

null (empty response body)

### Authorization

[petstore_auth](../README.md#petstore_auth)

### HTTP request headers

 - **Content-Type**: application/json, application/xml
 - **Accept**: application/xml, application/json

