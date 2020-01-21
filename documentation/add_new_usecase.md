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

## Add the Usecase information
Create a new entry (json) to the [usecases.json](/src/assets/config_files/usecases.json) inside an existing domain with the following information:
```
[
  {
    "<existing_domain>": [
      {<existing_usecase>},
      ...
      {
        "title": title of the usecase,
        "description": description of the usecase,
        "experience": [<experience_choice>, ... ],
        "maturity":  [<maturity_choice>, ...],
        "access": [<access_choice>, ...],
        "type": how the use case is implemented [webapp, ipynb],
        "disabled": boolean if the usecases is accessible or not,
        "picture": {
           "src": url of the image,
           "alt": description of the image (for accessibility)
        },
        "dataprotected": if the user should accept terms and conditions [true, false]
        "next": <next_choice>,
        "files": [<file_usecase>, ...],
        "models": [<model_item>, ...],
        "tutorial": url of the interactive tutorial,
        "contributors": [
          {
            "name": name of the contributor,
            "email": email of the contributor
          }
        ],
      },
      ...
    ],
  }
]
```

## Explanation of some of the values:

* #### experience_choice:
   * `"all"` ("Everybody") - "Easily accessible use case"
   * `"power"` ("Power users") - "Advanced use case"
   * `"experts"` ("Experts") - "Use case for contributors and tools experts"
   * `"code"` ("Developers") - "Use case for tools developers"
 
* #### maturity_choice:
   * `"beta"` ("Beta") - A service of this maturity level has reached a certain robustness and may be used by early adopters.
   * `"experimental"` ("Experimental") - A service of this maturity level is under heavy development and recommended only for specialists’ use or use for co-design partners.

* #### access_choice:
   * `"hpc"` ("HPC") - Requires high-performance computing resources access
   * `"byor"` ("BYOR") - (Bring Your Own Resources) Services of this type allow you to delegate the execution to resources provided by the user. This is subject to technical compatibility.

* #### next_choice:
   Name the route that you want to open when the uc is clicked.
   Use the default `ta_form` to show the form or create / reuse one of the existing routes in the 'routes' object in main.js for custom steps.

* #### file_usecase:
   This array will contain the apps or files that they are going to be copied to the new Collab. The format should be something like
   ```
   {
      "entryname": name to be added in the navigation item when the usecase is created/added ,
      "appid": (number) possible values [175 (ipython notebboks), 6 (external html)],
      "contenttype": (string) possible values ["x-ipynb+json", "text/html"],
      "extension": (string) extension with "." like ".ipynb",
      "file": UUID of the file in collab storage (more information see below) OR raw file URL,
      "file_prod": (optional*) Github file url using API,
      "initial": (boolean) if true this nav item will be shown when redirect to collab,
      "justcopy": (boolean) if true, it will avoid creating a nav item,
   }
   ```
   \* This can be added later when the notebook is tested 
* #### model_item:
  ```
  {
    "title": (string) title of the model
    "modelName": (string) text that is going to replace the placeholder in the notebook,
    "description": (string) description of the model,
    "contributors": [
      {
        "name": name of the contributor,
        "email": email of the contributor
      }
    ],
    "img": (url) link to the image for that model
  }
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

# Add to the collab
If you added a uc inside an existing domain the usecase should appear in the list.
If you created a new domain you just need to pull request the changes in the usecases.json and then create a new Markdown item in the collab with the link of the domain name. 
Example: https://bbp.epfl.ch/public/usecases-wizard/index.html#/<your_new_domain>

# Notebook Development

This section is explaining the procedure to develop notebooks. 

### Procedure:

1) You create a public Collab, in which you will develop your notebooks
2) You add notebooks to your Collab, depending on your use cases. 
3) You edit and update the notebook in your Collab

That’s it. 

### Explanation:

You have a notebook in your Collab , which is represented by a path (like /9876/myusecases/brainsim.ipynb) and an unique ID (for example cdd7d4ba-8432-4172-8e3f-06fa18993242). 

This ID is written to the usecase.json file in the antonepfl/usecases repository. Whenever someone now clones this notebook from the DEV environment, the user gets a copy of the current version of the notebook at the location /9876/myusecases/brainsim.ipynb. No need to change the notebook and/or the location. You just keep updating your notebook in your Collab. 

When the notebook is tested and works as expected, the content of the notebook is copied to some other place (e.g. /8888/production/brainsim.ipynb), and gets a different ID, like b20ac676-5858-40c4-884b-aa1620463e33. Now whenever someone is cloning the notebook on the PROD environment, it is copied from the PROD location (/8888/production/brainsim.ipynb). 

That way, whenever errors or bugs are introduced in the original notebook (/9876/myusecases/brainsim.ipynb) it does not affect the PROD version. All you have to do is to update/change the one local notebook in your Collab (/9876/myusecases/brainsim.ipynb) and let me know when I can copy it to the PROD side. 


### Collab

A ‘Collab’ is a place for collaboration, in which a user can create ‘clones’ of other notebooks. 

It is important to understand, that when a user clones another notebook, the content of that notebook is copied into the user’s Collab. If a change is made to the original notebook it was cloned from, the notebook in the user’s Collab will not be updated. It will remain an older copy of the original notebook all the time. 

In order to get the latest version: 
Delete the notebook and clone it again in the same Collab
Create a new Collab and clone the notebook in that Collab.

