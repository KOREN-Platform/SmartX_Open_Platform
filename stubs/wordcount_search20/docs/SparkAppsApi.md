# SparkAppsApi

All URIs are relative to *http://zest2:3000/client/api/v2*

Method | HTTP request | Description
------------- | ------------- | -------------
[**wordcountSearch20**](SparkAppsApi.md#wordcountSearch20) | **POST** /wordcount_search20 | Apps that count the number of specific characters


<a name="wordcountSearch20"></a>
# **wordcountSearch20**
> wordcountSearch20(body)

Apps that count the number of specific characters

Apps that count the number of specific characters

### Example
```java
// Import classes:
//import io.swagger.client.ApiException;
//import io.swagger.client.api.SparkAppsApi;


SparkAppsApi apiInstance = new SparkAppsApi();
JSON body = new JSON(); // JSON | Data for running the app
try {
    apiInstance.wordcountSearch20(body);
} catch (ApiException e) {
    System.err.println("Exception when calling SparkAppsApi#wordcountSearch20");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**JSON**](JSON.md)| Data for running the app |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, application/xml
 - **Accept**: application/xml, application/json

