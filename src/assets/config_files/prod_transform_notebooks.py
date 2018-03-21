class Notebooks(object):

    def __init__(self):
        self.notebooks = {
            'SynEvFit_UserModel': 'edecb7f3-2a14-469a-abb0-40001c4152ab',
            'SynEvFit_UserModelAnalysis': '9f27fc5a-b2c7-4a4a-96c5-aeea52a67f02',
            'SynEvFit_UserData': '8ee1a349-fea9-4444-94fd-9d2dda45a828',
            'SynEvFit_UserDataAnalysis': '9f27fc5a-b2c7-4a4a-96c5-aeea52a67f02',
            'RebuildHippoCell_Config': '71260306-28bb-4613-b5c8-03554810df05',
            'RebuildHippoCell_Analysis': '66970e4e-8879-4f05-b669-d37c7bb69788',
            'RebuildHippoCell_JobManager': 'd4737dd8-1576-4f8d-ba4d-06b9e2c30ef7',
            'BuildOwnHippoCell_Config': 'f0889ca5-735d-4857-98e7-fb2e5630d503',
            'BuildOwnHippoCell_Analysis': '66970e4e-8879-4f05-b669-d37c7bb69788',
            'BuildOwnHippoCell_JobManager': 'd4737dd8-1576-4f8d-ba4d-06b9e2c30ef7',
            'GranuleMono': '38e3fae0-cd27-4924-a4bd-2244efb661f6',
            'GranuleMulti': '9dea71b0-e091-47ba-8db9-1eaa12ec9c46',
            'Purkinje': 'f3d66ad4-d646-42b8-ad5c-b3d6e67508bc',
            'BasalGanglia': '40754030-fe10-47de-ae04-f2bd4a48a8a2',
            'CellPlacementCereb': 'b0509c3f-3330-435d-87d2-d0940e98766c',
            'CellPlacementHippo': '00b83d98-0172-4825-b386-7671054cc31d',
            'ConnectomeCereb': '85354cea-5f47-4852-8c8f-8cacf5d38333',
            'MorphAnalysis': '915417d1-359f-4eab-bcb1-a0881dea8d7d',
            'ValidationDemo': '06f82f00-8895-4a2f-8d64-1d3208d8b6e1',
            'ValidationBG': 'e62f67fa-7831-496b-8b44-8bd16aaabc81',
            'ValidationBluePyOpt': '9b915d4d-c1d0-4d1a-9be9-a614ac305014',
            'ValidationHippo': 'acb94529-a85c-4a79-bcf5-920612c17d91',
            'SmallCircuitCereb': 'da012b41-4a6b-4b5d-9b71-869c1c68d731',
            'Striatal': '47557ac3-30c4-49d0-9d00-1a89d015e9e4'
          }
        self.client = get_hbp_service_client()

    def prod_transform_notebooks(self, keys = None):
        """Takes a list of alias names for the notebooks to be copied to PROD.
        If no list given, ALL notebooks will be updated.
        """

        # Get current collab id and client
        this_collab = get_collab_storage_path()
        dest_folder = "usecases"

        if keys is None:
            keys = self.notebooks.keys()

        # Loop over all usecases to copy
        for key in keys:
            id_ = self.notebooks[key]

            # Create the names
            try:
                path_source = str(self.client.storage.api_client.get_entity_path(id_))
            except StorageException:
                print "ERROR: Notebook '%s' with ID %s does NOT exist in DEV" % (key, id_)
                continue
            basename = os.path.basename(path_source)
            tmp_path = str(os.path.join('/tmp', basename))
            dest_path = str(os.path.join('/', this_collab, dest_folder, basename))

            # Do the copying
            print("Downloading file '%s' to '%s'" % (path_source, tmp_path))
            self.client.storage.download_file(path_source, tmp_path)
            if self.client.storage.exists(dest_path):
                entity = self.client.storage.api_client.get_entity_by_query(path=dest_path)
                print("Changing file '%s' with ID %s" % (dest_path, entity['uuid']))
                self.client.storage.api_client.upload_file_content(entity['uuid'], source=tmp_path)
            else:
                print("Uploading file '%s' to '%s'" % (tmp_path, dest_path))
                self.client.storage.upload_file(tmp_path, dest_path, "application/x-ipynb+json")

    def verify_notebooks(self):
        """Checks all notebooks and looks if they differ.
        """
        # Get current collab id and client
        this_collab = get_collab_storage_path()
        dest_folder = "usecases"

        # Loop over all usecases to copy
        for key in self.notebooks.keys():
            id_ = self.notebooks[key]

            # Create the names
            try:
                path_source = str(self.client.storage.api_client.get_entity_path(id_))
            except StorageException:
                print "Notebook '%s' with ID %s does NOT exist in DEV" % (key, id_)
                continue
            basename = os.path.basename(path_source)
            tmp_path = str(os.path.join('/tmp', basename))
            dest_path = str(os.path.join('/', this_collab, dest_folder, basename))
            tmp_dev = "/tmp/dev.ipynb"
            tmp_prod = "/tmp/prod.ipynb"

            # Do the copying
            self.client.storage.download_file(path_source, tmp_dev)
            self.client.storage.download_file(dest_path, tmp_prod)

            # Comparing the files
            files_same = filecmp.cmp(tmp_dev, tmp_prod)
            print "Notebook '%s' with ID %s is up-to-date: %s " % (key, id_, str(files_same))

            # Deleting the local copies
            os.remove(tmp_dev)
            os.remove(tmp_prod)

