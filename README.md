# Blue Brain Project - Usecase Wizard
This repository contains all the information related to the use cases that are shown in the Brain Simulation Platform.

All the titles, images, descriptions, etc are described in [usecases.json](/src/assets/config_files/usecases.json)

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

### [Add new use case](/documentation/add_new_usecase.md)

### [Add new MOOC](/documentation/add_new_mooc.md)

### If Single cell models [change](/documentation/single_cell_model_change.md)

### The usual [path](/documentation/usual_path.md) the user follows
