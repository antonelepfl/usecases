# Add a new Usecase
#### 1) Add the Usecase information
Create a new entry (json) to the usecases.json (src/assets/config_files) with the following information:
```
{
    "title": title of the usecase,
    "description": description of the usecase,
    "experience": (array) possible values ['all', 'power', 'experts', 'code'],
    "maturity":  (array) ['beta', 'experimental',
    "access": (array) possible values ['hpc', 'byor'],
    "disabled": boolean if the usecases is accessible or not,
    "picture": {
        "src": url of the image,
        "alt": description of the image (for accessibility)
        },
    "next": name the route that you want to open when the uc is clicked. Use the default "ta_form" to show the form or See the 'routes' object in main.js for custom steps.
},
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

#### 2) Add the files that are going to be copy
In src/assets/config_files/types_collabs_apps.json add a new entry like:
```
"title of the UC in lowercase and together": {
    "entryname": name to be added in the navigation item when the usecase is created/added ,
    "appid": (number) possible values [69 (ipython notebboks), 6 (external html)],
    "contenttype": (string) possible values ["x-ipynb+json", "text/html"],
    "extension": (string) extension with "." like ".ipynb",
    "file": UUID of the file in collab storage (more information see below) OR raw file URL
},
```
 
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
