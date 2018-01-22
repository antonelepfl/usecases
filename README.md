# Blue Brain Project - Usecase Wizard
This repository contains all the information related to the use cases that are shown in the Brain Simulation Platform.
All the titles, images, descriptions, etc are described in [usecases.json](https://github.com/antonelepfl/usecases/blob/add-more-documentation/src/assets/config_files/usecases.json).
All the jupyter notebooks, applications and files related to the use case are described in [types_collabs_apps.json](https://github.com/antonelepfl/usecases/blob/add-more-documentation/src/assets/config_files/types_collabs_apps.json)

#### This app is deployed in:
* https://antonelepfl.github.io/usecases/#/{ usecase name in usecases.json }
* https://antonelepfl.github.io/usecases/#/traceanalysis (e.g)

# To run locally
``` $ npm install ``` (install dependencies)

``` $ npm run dev ``` (run server)

### To deploy in production: 
Merge to the master branch and commit. Travis process will start.
It will deploy in github pages

### To deploy in a dev environment:
For the *dev* branch a specific plan in this branch will be triggered adding a `dev` subfolder in the **gh-pages** branch. You can see the result under:
* https://antonelepfl.github.io/usecases/dev/#/traceanalysis (example)

### If Single cell models change:
* Download the optimizations models locally.
* Copy the script located into config_files/**create_singlecellmodeling_structure.py** to this new local respository.
* ``` $ python create_singlecellmodeling_structure.py ```
* Copy back the created file **singlecellmodeling_structure.json** to config_files/ in the usecases repo.
This [jenkins plan](https://bbpcode.epfl.ch/ci/job/platform.lbologna_update_data/) is executed when there is a change in the repo 

## The usual path that the user should follow is:
#### 1. Go to the *domain* [Trace Analysis, Morphology Analysis, Single Cell Building ... ]
You will see all the use cases related to this domain. Each of them containing:
- Image: representative representation of what you are able to achieve
- Title: Definition of the use case
- Description: detail information about what the use case does
- Maturity: the state of the use case such as Beta, Experimental, 
- Target User: which type of user is this use case recomended to be used by
- If the use case is not available yet it will have the Coming Soon label

![main page](https://raw.githubusercontent.com/antonelepfl/usecases/master/documentation/main.png)

#### 2. Select one *Use Case* [Feature extraction, Synaptic event fitting, ... ]
After you select one use case you will have 2 possibilities:

#### A). Search
Search in your Collabs and add this use case as a new entry (navigation item)
You just type one of your Collabs name in the search field and then click on the name from the list

![search](https://raw.githubusercontent.com/antonelepfl/usecases/master/documentation/search.png)

#### B). Create
Create a new Collab that will contain this use case
You just choose a name and click *Create* button.
Private or public Collabs could be created depending on the user credentials.

![create](https://raw.githubusercontent.com/antonelepfl/usecases/master/documentation/create.png)

#### 2.B. You are redirected to your Collab with the use case ready to be run
In some cases you need to choose different models for example to see a morphology you should select which morpphology you want to see (the image below)
![models](https://raw.githubusercontent.com/antonelepfl/usecases/master/documentation/models.png)

#### 3. You are redirected to your Collab with the use case ready to be run

### To [Add new use case(s)](https://github.com/antonelepfl/usecases/blob/master/add_new_usecase.md)
