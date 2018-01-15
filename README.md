# Blue Brain Project - Usecase Wizard
This app is deployed in:
* https://antonelepfl.github.io/usecases/#/{ usecase name in usecases.json }
* e.g: https://antonelepfl.github.io/usecases/#/traceanalysis

# To run locally
``` $ npm run dev ```

### To deploy in production: 
Merge to the master branch and commit. Travis process will start.
It will deploy in github pages

### To deploy in a dev environment:
* In the other branches that are not `master`, a travis plan will be triggered
* The deployment will on Firebase
* If you want to change the user to deploy in another place, just replace the FIREBASE_TOKEN in Travis Environment Variables by yours (after firebase login)

* The deployed page will appear in https://dev-usecases.firebaseapp.com/#/<usecase name in usecases.json>

### If Single cell models change:
* Download the optimizations models locally.
* Copy the script located into config_files/**create_singlecellmodeling_structure.py** to this new local respository.
* ``` $ python create_singlecellmodeling_structure.py ```
* Copy back the created file **singlecellmodeling_structure.json** to config_files/ in the usecases repo.
This [jenkins plan](https://bbpcode.epfl.ch/ci/job/platform.lbologna_update_data/) is executed when there is a change in the repo 

### [Add new usecases](https://github.com/antonelepfl/usecases/blob/master/add_new_usecase.md)