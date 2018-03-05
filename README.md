# Blue Brain Project - Usecase Wizard
This repository contains all the information related to the use cases that are shown in the Brain Simulation Platform.

All the titles, images, descriptions, files, etc are described in [usecases.json](/src/assets/config_files/usecases.json)

### This app is deployed in [HBP Collab](https://collab.humanbrainproject.eu/#/collab/1655/nav/66850)

### To run locally
``` npm install ``` (install dependencies)

``` npm run dev ``` (run server)

### To deploy in a dev environment:
* The user make a pull request to the `dev` branch
* A travis plan is triggered to look for any error in the files.
* When the plan finishes, the owners of the repo can merge the new pull request to `dev`.
* The user receives the notification that his/her pull request was merged.
* A [jenkins plan](https://bbpcode.epfl.ch/ci/job/nse.usecases-wizard.github/) is triggered.
* The new changes appear in [Online Use Cases DEV](https://collab.humanbrainproject.eu/#/collab/8444/nav/64015)

### To deploy in production: 
* The owner receives the confirmation from the tests and the user that everything works correctly.
* The owner create a pull request from `dev` environment to `master`.
* A [jenkins plan](https://bbpcode.epfl.ch/ci/job/nse.usecases-wizard/) is triggered.
* The new changes appear in [Brain Simulation Platform](https://collab.humanbrainproject.eu/#/collab/1655/nav/28538)

### How to:
* Add new [use case](/documentation/add_new_usecase.md)

* Add new [MOOC](/documentation/add_new_mooc.md)

* Add [models](/documentation/add_new_model.md)

* If single cell models [change](/documentation/single_cell_model_change.md)

* The usual [path](/documentation/usual_path.md) the user follows
