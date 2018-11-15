# swagger_client.SparkAppsApi

All URIs are relative to *http://zest2:3000/api/v2*

Method | HTTP request | Description
------------- | ------------- | -------------
[**wordcount_search**](SparkAppsApi.md#wordcount_search) | **POST** /wordcount_search | Apps that count the number of specific characters


# **wordcount_search**
> wordcount_search(body)

Apps that count the number of specific characters

Apps that count the number of specific characters

### Example
```python
from __future__ import print_function
import time
import swagger_client
from swagger_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = swagger_client.SparkAppsApi()
body = swagger_client.JSON() # JSON | Arguments for running the app

try:
    # Apps that count the number of specific characters
    api_instance.wordcount_search(body)
except ApiException as e:
    print("Exception when calling SparkAppsApi->wordcount_search: %s\n" % e)
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**JSON**](JSON.md)| Arguments for running the app | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, application/xml
 - **Accept**: application/xml, application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

