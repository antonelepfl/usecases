### Create the routes:
  
* Create an entry in [main.js](/src/main.js) for the **models** route.
  For example 
  ```
  { path: '/singlecellmodeling/optimizeastriatalfast-spikinginterneuron',
    component: function (resolve) {
      require(['components/singlecellmodeling/striatal/striatal-container.vue'], resolve)
    },
    name: 'sc_striatal_models'
  },
  ```
  `path` represents the name of the category and
  the use case that was selected. This last will be used to retrieve the information of the models

  `component` is the element that is going to be rendered when this route is called.
  In this case [striatal-container.vue](/src/components/singlecellmodeling/striatal/striatal-container.vue)

  `name` is a unique name of the route that we will use in the `next` property of the
  usecase in [usecases.json](/src/assets/config_files/usecases.json)

* Create an entry in [main.js](/src/main.js) for the logic of the **replace**.
  For example 
  ```
  { path: '/singlecellmodeling/optimizeastriatalfast-spikinginterneuron/:folder_name',
    component: function (resolve) {
      require(['components/singlecellmodeling/striatal/form-replacing.vue'], resolve)
    },
    props: true,
    name: 'sc_striatal_form_replacing'
  },
  ```
  
### Associate the *use case* with the *model* route
  
As we mentioned above, add or modify the `next` attribute in [usecases.json](/src/assets/config_files/usecases.json)
of your use case. Now it should match with the name of the route that we created before
For example
```
{
  "title": "Optimize a striatal fast-spiking interneuron",
  ...
  "next": "sc_striatal_models",
  "files": [<file_usecases>, ...],
  "models" [<model_item>, ...]
}
```
See [file_usecases](/documentation/add_new_usecase.md#file_usecase)

See [model_item](/documentation/add_new_usecase.md#model_item)

### Associate the [*models*](/src/components/singlecellmodeling/striatal/striatal-container.vue) with the [*replace*](/src/components/singlecellmodeling/striatal/form-replacing.vue) component

Inside the model components when we click on one of the models, we should redirect the user to the
form to create/add this item to Collabs.
A method like for example
```
touched (modelItem) { // event when the model is clicked
  this.$router.push({
    name: 'sc_striatal_form_replacing', // name of the replace route we created in main.js
    params: {
      'folder_name': modelItem.modelName // pass the name of the model to be replaced
    }
  })
}
```
