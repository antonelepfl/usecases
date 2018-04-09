## To Reuse *Usecases-Wizard* from *Entity-Dashboard* a json encoded should be passed to:
`https://bbp.epfl.ch/public/usecases-wizard/index.html#/entitydashboard?<QUERY_PARAMS>`

### *<QUERY_PARAMS>*
`uri=VALUE&txtToReplace=VALUE&replaceText=VALUE&name=VALUE`

Param | Required | Description | Default
--- | --- | --- | --- |
`replaceText` | **True** | UUID of the element to put in the placeholder |
`uri` | False | url of the notebook | [link](https://raw.githubusercontent.com/antonelepfl/testvue/master/notebooks/test_replace.ipynb)
`txtToReplace` | False | placeholder in the notebook to be replaced | REPLACE_UUID |
`name` | False | Name of the nav item in collab | Trace_Analysis_Nexus |

*Each* **VALUE** should be `Encoded`
- Javascript
  ```
  var ENCODED = encodeURIComponent('Trace_Analysis_Nexus');
  ```
- Python
  ```
  import urllib
  JSON_ENCODED = urllib.quote('Trace_Analysis_Nexus')
  ```