# Use cases with VUE.JS
This app is deployed in:
* https://antonelepfl.github.io/usecases/<usecase name in usecases.json>

# To run locally
``` $ npm run dev ```

# To deploy just commit and it will start a travis process

# If Single cell models change:
* Download the optimizations models locally.
* Copy the script located into config_files/**create_singlecellmodeling_structure.py** to this new local respository.
* ``` $ python create_singlecellmodeling_structure.py ```
* Copy back the created file **singlecellmodeling_structure.json** to config_files/ in the usecases repo.