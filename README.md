# Blue Brain Project - Usecase Wizard
This repository contains all the information related to the use cases that are shown in the Brain Simulation Platform.

All the titles, images, descriptions, etc are described in [usecases.json](/src/assets/config_files/usecases.json).

All the jupyter notebooks, applications and files related to the use case are described in [types_collabs_apps.json](/src/assets/config_files/types_collabs_apps.json)

### This app is deployed in [Collab](https://collab.humanbrainproject.eu/#/collab/1655/nav/66850)

# To run locally
``` npm install ``` (install dependencies)

``` npm run dev ``` (run server)

### To deploy in a dev environment:
* The user make a pull request to the dev branch
* A travis plan is triggered to look for any error in the files.
* When the plan finishes, you can merge to dev.
* A [jenkins plan](https://bbpcode.epfl.ch/ci/job/nse.usecases-wizard.github/) is triggered.
* The new changes appear in [Online Use Cases DEV](https://collab.humanbrainproject.eu/#/collab/8444/nav/64015)

### To deploy in production: 
* The user create a pull request from `dev` environment (previously tested) to `master`.
* A [jenkins plan](https://bbpcode.epfl.ch/ci/job/nse.usecases-wizard/) is triggered.
* The new changes appear in [Brain Simulation Platform](https://collab.humanbrainproject.eu/#/collab/1655/nav/28538)


### If Single cell models change:
This [jenkins plan](https://bbpcode.epfl.ch/ci/job/platform.lbologna_update_data/) is executed when there is a change in the repo.

Otherwise, for manual step:

* Download the optimizations models locally.
* Copy the script located into config_files/**create_singlecellmodeling_structure.py** to this new local respository.
* ``` $ python create_singlecellmodeling_structure.py ```
* Copy back the created file **singlecellmodeling_structure.json** to config_files/ in the usecases repo.


### To [Add new use case](/documentation/add_new_usecase.md)

### To [Add new MOOC](/documentation/add_new_mooc.md)

# The usual path that the user should follow is:
#### 1. Go to the *domain* [Trace Analysis, Morphology Analysis, Single Cell Building ... ]
You will see all the use cases related to this domain. Each of them containing:
- Image: representative representation of what you are able to achieve
- Title: Definition of the use case
- Description: detail information about what the use case does
- Maturity: the state of the use case such as Beta, Experimental, 
- Target User: which type of user is this use case recomended to be used by
- If the use case is not available yet it will have the Coming Soon label

![main page](/documentation/main.png?raw=true)

#### 2. Select one *Use Case* [Feature extraction, Synaptic event fitting, ... ]
After you select one use case you will have 2 possibilities:

#### A). Search
Search in your Collabs and add this use case as a new entry (navigation item)
You just type one of your Collabs name in the search field and then click on the name from the list

![search](/documentation/search.png?raw=true)

#### B). Create
Create a new Collab that will contain this use case
You just choose a name and click *Create* button.
Private or public Collabs could be created depending on the user credentials.

![create](/documentation/create.png?raw=true)

#### 2.B. You are redirected to your Collab with the use case ready to be run
In some cases you need to choose different models for example to see a morphology you should select which morpphology you want to see (the image below)
![models](/documentation/models.png?raw=true)

#### 3. You are redirected to your Collab with the use case ready to be run

