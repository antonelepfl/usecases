# Online Use cases with VUE.JS
This app is deployed in:
* https://antonelepfl.github.io/usecases/#/{ usecase name in usecases.json }
* e.g: https://antonelepfl.github.io/usecases/#/traceanalysis

# To run locally
``` $ npm run dev ```

### To deploy in production: 
Merge to the master branch and commit. Travis process will start.
It will deploy in github pages

### To deploy in a dev environment:
* Go to gitlab and mirror the repo: https://antonelepfl.github.io/usecases
* In gitlab got to commits and update the repo
* Then, go to pipeline and run the pipeline. It will deploy the page into https://antonelepfl.gitlab.io/usecases/#/<usecase name in usecases.json>

### If Single cell models change:
* Download the optimizations models locally.
* Copy the script located into config_files/**create_singlecellmodeling_structure.py** to this new local respository.
* ``` $ python create_singlecellmodeling_structure.py ```
* Copy back the created file **singlecellmodeling_structure.json** to config_files/ in the usecases repo.

