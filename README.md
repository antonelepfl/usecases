# Blue Brain Project - Usecase Wizard
This repository contains all the information related to the use cases that are shown in the Brain Simulation Platform.

All the titles, images, descriptions, files, etc are described in [usecases.json](/src/assets/config_files/usecases.json)

### This app is deployed in [HBP Collab](https://collab.humanbrainproject.eu/#/collab/1655/nav/66850)

### To run locally
- Install [docker](https://docs.docker.com/install/)
- Clone your fork using: `git clone https://github.com/YOUR_GITHUB_ACCOUNT/usecases.git`
- Move to the repo `cd usecases`
- Sync branches:
  - Add base repo: `git remote add upstream https://github.com/antonelepfl/usecases.git`
  - Get latest changes: `git fetch --all`
  - Reset branches:
    - Go to DEV `git checkout dev`
    - Replace with original changes `git reset --hard upstream/dev`
- Make your changes on DEV branch
- ....
- Build contaienr `docker build -t usecases-local .`
- Run container `docker run -it -p 8282:8282 usecases-local:latest`
- Open in the browser to check your `http://localhost:8282/#/traceanalysis`

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
* Go to jenkins [Build with Parameters](https://bbpcode.epfl.ch/ci/job/nse.usecases-wizard/build?delay=0sec) and check **release**
* The new changes appear in [Brain Simulation Platform](https://collab.humanbrainproject.eu/#/collab/1655/nav/28538)

### To deploy in production (notebook):
* Download the notebook that is pointed in the `file` field in **usecases.json** (Collab UUID)
* Add this notebook into *usecases/production_notebooks* folder
* Add a new field on the **usecases.json** next to `file` called `file_prod` that points to ```https://api.github.com/repos/antonelepfl/usecases/contents/production_notebooks/<category>/<notebook_name>.ipynb?ref=master``` (\*)
* Create a Pull Request to *dev* branch with this 2 changes
* After aproved in *dev* create a new Pull Request merging *dev* into *master*
* After *dev* is merged into *master* this jenkin [plan](https://bbpcode.epfl.ch/ci/job/nse.usecases-wizard/) is triggered
* To release the new version of the site, tick **release** checkbox on this [plan](https://bbpcode.epfl.ch/ci/job/nse.usecases-wizard/build?delay=0sec)

### How to:
* Add new: [use case](/documentation/add_new_usecase.md) - [MOOC](/documentation/add_new_mooc.md) - [models](/documentation/add_new_model.md)
* If single cell models [change](/documentation/single_cell_model_change.md)
* The usual [path](/documentation/usual_path.md) the user follows

(\*) We are using the Github API and not the raw content because we need the SHA to compare using the [common header](https://github.com/antonelepfl/usecases/blob/dev/production_notebooks/common_header/common_headers.ipynb) snippet
