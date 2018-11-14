# swagger_client.SparkAppsApi

All URIs are relative to *http://zest3:3000/client/api/v2/sparkSubmit*

Method | HTTP request | Description
------------- | ------------- | -------------
[**wordcount_search14**](SparkAppsApi.md#wordcount_search14) | **POST** /wordcount_search14 | app meta datas


# **wordcount_search14**
> wordcount_search14(body)

app meta datas



### Example
```python
from __future__ import print_function
import time
import swagger_client
from swagger_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = swagger_client.SparkAppsApi()
body = swagger_client.Spark() # Spark | apps desemailcription

try:
    # app meta datas
    api_instance.wordcount_search14(body)
except ApiException as e:
    print("Exception when calling SparkAppsApi->wordcount_search14: %s\n" % e)
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**Spark**](Spark.md)| apps desemailcription | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, application/xml
 - **Accept**: application/xml, application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

