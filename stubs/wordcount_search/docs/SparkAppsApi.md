# SparkAppsApi

All URIs are relative to *http://zest2:3000/client/api/v2*

Method | HTTP request | Description
------------- | ------------- | -------------
[**wordcountSearch**](SparkAppsApi.md#wordcountSearch) | **POST** /wordcount_search | Apps that count the number of specific characters


<a name="wordcountSearch"></a>
# **wordcountSearch**
> wordcountSearch(body)

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
    apiInstance.wordcountSearch(body);
} catch (ApiException e) {
    System.err.println("Exception when calling SparkAppsApi#wordcountSearch");
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

