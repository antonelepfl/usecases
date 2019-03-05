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

### To deploy in production (non notebook):
* The owner receives the confirmation from the tests and the user that everything works correctly.
* The owner create a pull request from `dev` environment to `master`.
* A [jenkins plan](https://bbpcode.epfl.ch/ci/job/nse.usecases-wizard/) is triggered.
* Go to [jenkins](https://bbpcode.epfl.ch/ci/job/nse.usecases-wizard/) and **Build with parameters** and select **release**
* The new changes appear in [Brain Simulation Platform](https://collab.humanbrainproject.eu/#/collab/1655/nav/28538)

### To deploy in production (notebook):

* The owners of the notebook should make fixes in their public notebook (linked to the `usecases.json` in `dev` environment).
* The owner is not able to deploy directly a notebook in production. If a notebook is ready to go on PROD, you need to notify the responsible person(s)
* After testing the current DEV version of the notebook, it will be copied to the PROD environment (the content will be copied to the Collab ["Production Notebooks"](https://collab.humanbrainproject.eu/#/collab/9494/nav/71623) . The `usecases.json` in `master` links to the notebooks on this Collab.)

#### Internal workflow to update PROD

 * Open the single notebook on the Collab ["Production Notebooks"](https://collab.humanbrainproject.eu/#/collab/9494/nav/71623)
 * Load the content of the file `prod_transform_notebooks.py` from this repository:
 * `%load https://raw.githubusercontent.com/antonelepfl/usecases/master/src/assets/config_files/prod_transform_notebooks.py`
 * Call this function on a list of notebooks that should be updated
 * If a new file is created, a PR to `master` has to be made changing the `id` of the notebook


### How to:
* Add new: [use case](/documentation/add_new_usecase.md) - [MOOC](/documentation/add_new_mooc.md) - [models](/documentation/add_new_model.md)

* If single cell models [change](/documentation/single_cell_model_change.md)

* The usual [path](/documentation/usual_path.md) the user follows
