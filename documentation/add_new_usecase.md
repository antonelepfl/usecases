# Add a new Domain

(optional) Like (Trace analysis, Morphology, Circuit building, etc)
Create a new entry (json) to the usecases.json (src/assets/config_files):
```
[
   {
      "traceanalysis": [{<usecase_information_see_above>}],
      "singlecellmodeling": [{<usecase_information_see_above>}],
      ...
      "<your_new_domain>: [{<usecase_information_see_above>}],
      ...
   }
]
```
Remember that `your_new_domain` should be in lowercase and no spaces.
# Add new Usecase in an existing domain

#### 1) Add the Usecase information
Create a new entry (json) to the usecases.json (src/assets/config_files) inside an existing domain with the following information:
```
[
  {
    "<existing_domain>": [
      {<existing_usecase>},
      ...
      {
        "title": title of the usecase,
        "description": description of the usecase,
        "experience": (array) possible values ['all', 'power', 'experts', 'code'],
        "maturity":  (array) ['beta', 'experimental']
        "access": (array) possible values ['hpc', 'byor'],
        "disabled": boolean if the usecases is accessible or not,
        "picture": {
        "src": url of the image,
        "alt": description of the image (for accessibility)
        },
        "dataprotected": if the user should accept terms and conditions [true, false]
        "next": name the route that you want to open when the uc is clicked
      },
      ...
    ],
  }
]
```

// Explanation of the values of experience, maturity and access:
###### "experience" :
* `"all"` ("Everybody") - "Easily accessible use case"
* `"power"` ("Power users") - "Advanced use case"
* `"experts"` ("Experts") - "Use case for contributors and tools experts"
* `"code"` ("Developers") - "Use case for tools developers"
 
###### "maturity":
* `"beta"` ("Beta") - A service of this maturity level has reached a certain robustness and may be used by early adopters.
* `"experimental"` ("Experimental") - A service of this maturity level is under heavy development and recommended only for specialists’ use or use for co-design partners.
###### "access":
* `"hpc"` ("HPC") - Requires high-performance computing resources access
* `"byor"` ("BYOR") - (Bring Your Own Resources) Services of this type allow you to delegate the execution to resources provided by the user. This is subject to technical compatibility.
###### "next":
Use the default `ta_form` to show the form or create / reuse one of the existing routes in the 'routes' object in main.js for custom steps.

#### 2) Add the files that are going to be copy
In src/assets/config_files/types_collabs_apps.json add a new entry like:
```
"title of the UC in lowercase and together": {
    "entryname": name to be added in the navigation item when the usecase is created/added ,
    "appid": (number) possible values [175 (ipython notebboks), 6 (external html)],
    "contenttype": (string) possible values ["x-ipynb+json", "text/html"],
    "extension": (string) extension with "." like ".ipynb",
    "file": UUID of the file in collab storage (more information see below) OR raw file URL
},
```
**Note:** if the title of the use case in step 1 (Add the Usecase information) was set to, e.g, `This is a UseCase - Type 1`, then here in step 2 this would be specified as: `thisisausecase-type1`. Remove all spaces, and have everything in lowercase.

##### To get the raw file url
For example in github just look for the file and click on the button to visualize it RAW and copy that URL to the "file" attribute
 
##### To get the UUID in collab
* Go to the collab storage where the file is located.
* Click on the file and the URL bar will change from something like:
    `https://collab.humanbrainproject.eu/#/collab/<collab_number>/nav/<nav_number>"`
    to
    `https://collab.humanbrainproject.eu/#/collab/<collab_number>/nav/<nav_number>?state=uuid%3D915417d1-359f-4eab-bcb1-a0881dea8d7d`
    so now we have to take the last part `after` "state=uuid%3D" from the URL. Like:
    `915417d1-359f-4eab-bcb1-a0881dea8d7d`

#### 3) Add to the collab
If you added a uc inside an existing domain the usecase should appear in the list.
If you created a new domain you just need to pull request the changes in the usecases.json and types_collabs_apps.json and then create a new Markdown item in the collab with the link of the domain name. 
Example: https://antonelepfl.github.io/usecases/#/your_new_domain
