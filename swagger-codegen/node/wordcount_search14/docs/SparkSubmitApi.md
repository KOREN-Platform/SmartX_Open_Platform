# swagger_client.SparkSubmitApi

All URIs are relative to *http://zest3:3000/client/v2*

Method | HTTP request | Description
------------- | ------------- | -------------
[**spark_submit**](SparkSubmitApi.md#spark_submit) | **POST** /sparkSubmit | You can running spark application by this API


# **spark_submit**
> spark_submit(body)

You can running spark application by this API



### Example
```python
from __future__ import print_function
import time
import swagger_client
from swagger_client.rest import ApiException
from pprint import pprint

# Configure OAuth2 access token for authorization: petstore_auth
configuration = swagger_client.Configuration()
configuration.access_token = 'YOUR_ACCESS_TOKEN'

# create an instance of the API class
api_instance = swagger_client.SparkSubmitApi(swagger_client.ApiClient(configuration))
body = swagger_client.Spark() # Spark | spark object that needs to be needed to the run

try:
    # You can running spark application by this API
    api_instance.spark_submit(body)
except ApiException as e:
    print("Exception when calling SparkSubmitApi->spark_submit: %s\n" % e)
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**Spark**](Spark.md)| spark object that needs to be needed to the run | 

### Return type

void (empty response body)

### Authorization

[petstore_auth](../README.md#petstore_auth)

### HTTP request headers

 - **Content-Type**: application/json, application/xml
 - **Accept**: application/xml, application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

