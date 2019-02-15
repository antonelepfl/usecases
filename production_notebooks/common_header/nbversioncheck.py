import os
import copy
import json
import base64
import urllib
import requests
import ipywidgets as widgets
from IPython.display import HTML, display

class NBVersionCheck(object):
    
    temp_name = "new.ipynb"
    url_header = "https://api.github.com/repos/antonelepfl/usecases/contents/production_notebooks/common_header/common_headers.ipynb?ref=master"
    
    def __init__(self, sha, url, client, this_path):
        """Initializes the object with the SHA and the URL of this notebook.
        """
        self.sha = sha
        self.url = url
        self.client = client
        self.this_path = this_path
        
        url1 = urllib.unquote(url).decode('utf8')
        self.basename = os.path.basename(url1.split('?')[0])
        
        self.content = None
        
    def download_file(self, url):
        """Downloads the file at the given URL and returns the SHA and the content.
        """
        data = requests.get(url).json()
        sha = data['sha']
        content = json.loads(base64.b64decode(data['content']))
        return sha, content
        
    def check(self):
        """Compares the current SHA and the actual on the master branch. 
        Creates a GUI to ask the user to replace the notebook.
        """
        sha_new, self.content = self.download_file(self.url)  
        print("SHA this notebook: {}".format(self.sha))
        print("SHA new notebook:  {}".format(sha_new))

        if sha_new != self.sha:           
            self.create_gui()       
        
    def create_gui(self):
        """This function creates a GUI where the user can choose if to update this notebook. 
        """
        button_replace = widgets.Button(
            description='Replace current notebook?',
            disabled=False,
            button_style='', # 'success', 'info', 'warning', 'danger' or ''
            tooltip='Replaces the current version of the notebook with a newer one.',
            icon='check'
        )        
        button_replace.on_click(self.replace_notebook)
        display(button_replace)
        
    def replace_notebook(self, button):
        """Function to replace the notebook
        """
        self.insert_header()
        self.update_notebook()    
        
    def insert_header(self):
        """Inserts the header and writes the notebook to file
        """
        # Downloads the header
        _ , header = self.download_file(self.url_header)        
      
        # Inserts the header in the downloaded content
        new_content = copy.deepcopy(self.content)
        new_content['cells'] = header['cells'] + self.content['cells']
        
        # Writes the new content to a file
        with open(self.temp_name, 'w') as fileout:
            fileout.write(json.dumps(new_content))
    
    def update_notebook(self):
        """Uploads the new content of the notebook and restarts kernel.
        """
        api = self.client.storage.api_client

        # Get the current collab
        collab = api.get_entity_by_query(path=self.this_path)
        project = api.list_project_content(collab['uuid'])

        # Tries to find the correct file in the collab
        found = False
        for entry in project['results']:            
            if entry['entity_type']=="file" and entry['name'] == self.basename:
                found = True
                break               
                
        if not found:
            text = "No file found with name {}".format(basename)
            display(HTML('<script>window.alert("{}");</script>'.format(text)))        
            return 
        
        # Replace the notebook content
        api.upload_file_content(entry['uuid'], source=self.temp_name)
        
        # Restart the kernel
        display(HTML('''<script>window.requestAnimationFrame(() => { Jupyter.notebook.kernel.restart(); \
        Jupyter.notebook.dirty = false; window.location.reload(); })</script>'''))
        
