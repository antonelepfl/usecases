## To Reuse *Usecases-Wizard* from *Entity-Dashboard* a json encoded should be passed to:
`https://bbp.epfl.ch/public/usecases-wizard/index.html#/entitydashboard/<JSON_ENCODED>`
#### An Example of the object param that has to be encoded and passed
```
json_params = {
  "uri": "https://raw.githubusercontent.com/.../test_replace.ipynb",
  "txtToReplace": "REPLACE_UUID",
  "replaceText": "1233455566",
  "name": "Analysis_plots"
}
```
### Generate *JSON_ENCODED*
- Javascript
  ```
  var JSON_ENCODED = encodeURIComponent(btoa(JSON.stringify(json_params)));
  ```

- Python
  ```
  import urllib, json, base64
  params_string = json.dumps(json_params)
  params_encoded = base64.b64encode(params_string)
  JSON_ENCODED = urllib.quote(params_encoded)
  ```

#### Decode *JSON_ENCODED*
- Javascrip
  ```
  var decoded = atob(decodeURIComponent(JSON_ENCODED))
  var parsed = JSON.parse(decoded);
  ```

- Python
  ```
  url_decoded = urllib.unquote(JSON_ENCODED)
  params_decoded = base64.b64decode(url_decoded)
  params_json = (json.loads(params_decoded))
  ```
