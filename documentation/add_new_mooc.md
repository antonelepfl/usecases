## To add a new MOOC
In the [usecases.json](/src/assets/config_files/usecases.json)
there is a key called `mooc` that contains an array of all the moocs.

To add a new one just create a new json object in that array. The structure should be like:
```
"mooc": [
  ...
  {
    "title": (string) title,
    "description": (string) description,
    "experience": (array) possible values ['all', 'power', 'experts', 'code'],
    "disabled": (boolean) if the complete mooc is accessible or not,
    "picture": {
      "src": url of the image,
      "alt": description of the image (for accessibility)
    },
    "next": "weeks_container", // leave it as it is
    "config_url": link to the week configuration file (it is explained later)
  },
  ...
]
```

### The week configuration file
This file is an array [] of objects {} that (ideally) should be in your own repository placed where
you have all the ipython notebooks. Each object represents a `week`and it will
contain information about the week and the files that are going to be copied to the Collab.
The structure should be like:
```
[
  ...
  {
    "title": (string) title,
    "description": (string) description,
    "experience": (array) possible values ['all', 'power', 'experts', 'code'],
    "disabled": (boolean) if the week is accessible or not,
    "picture": {
      "src": url of the image,
      "alt": description of the image (for accessibility)
    },
    "next": "mooc_form", // leave it as it is
    "files": [
      { // for example week 1, exercise 1
        "entryname": (string) name of the new nav item in the student's collab,
        "file": (url) to the .ipynb in a public location (github for example)
      },
      { ... week 1 exercise 2 ... }
    ]
  },
  { ... week 2 ... },
  ...
]
```
If you want more information just check [file_usecase](/documentation/add_new_usecase.md#file_usecase)
### When is this configuration retrieved?
Each time that the student selects the mooc, the weeks are rendered allowing the users to
get the latest version of this configuration file so if the creator enable a week the student will
see that change.
