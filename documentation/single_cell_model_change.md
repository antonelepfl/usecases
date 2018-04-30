This [jenkins plan](https://bbpcode.epfl.ch/ci/job/platform.lbologna_update_data/) is executed when there is a change in the repo.

Otherwise, for manual step:

* Download the optimizations models locally.
* Copy the script located into config_files/**create_singlecellmodeling_structure.py** to this new local respository.
* ``` $ python create_singlecellmodeling_structure.py ```
* Copy back the created file **singlecellmodeling_structure.json** to config_files/ in the usecases repo.
