## To Reuse *Usecases-Wizard* from external *Dashboard* a json encoded should be passed to:
`https://bbp.epfl.ch/public/usecases-wizard/index.html#/entitydashboard?<QUERY_PARAMS>`

### *<QUERY_PARAMS>*
`uri=VALUE&txtToReplace=VALUE&replaceText=VALUE&name=VALUE`

Param | Required | Description | Default
--- | --- | --- | --- |
`replaceText` | **True** | UUID of the element to put in the placeholder |
`uri` | False | url of the notebook | [link](https://raw.githubusercontent.com/antonelepfl/testvue/master/notebooks/test_replace.ipynb)
`txtToReplace` | False | placeholder in the notebook to be replaced | REPLACE_UUID |
`name` | False | Name of the nav item in collab | Trace_Analysis_Nexus |
`appId` | False | Application ID of the nav item | 175 |

*Each* **VALUE** should be `Encoded` for example
- Javascript
  ```
  var ENCODED = encodeURIComponent('http://destination_file');
  // output: http%3A%2F%2Fdestination_file
  ```
- Python
  ```
  import urllib
  JSON_ENCODED = urllib.quote('http://destination_file')
  ```
