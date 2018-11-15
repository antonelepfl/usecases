#!/usr/bin/env python
'''
Usage: create_singlecellmodeling_structure.py output.json
'''

import json
import requests
import logging
import os
import sys

logging.basicConfig(level=logging.DEBUG)

CSCS_OBJECT_STORAGE = os.environ['MODELS_URL']

REQUIRED_FILES_NAME = {
    'morph': '_morph.jpeg',
    'responses': '_responses.png',
    'meta': 'meta.json',
}


def _check_consistency(base_url, metadata, assets_list):
    for required in ('responses', 'morph'):
        asset = os.path.join(base_url, metadata[required])
        if asset not in assets_list:
            logging.warning('ERROR in cell. Plot not found %s', asset)


def _check_models_modification(response):
    old_list_name = 'old_model_list.txt'
    if os.path.isfile(old_list_name):
        x = open(old_list_name).read()
        if x == response.text:
            logging.debug('No model modified')
            return False
        else:
            logging.debug('Model list was changed')

    # create temp file to compare next time
    with open(old_list_name, 'w') as fd:
        fd.write(response.text)
    return True


def create_meta():
    response = requests.get(CSCS_OBJECT_STORAGE)
    was_modified = _check_models_modification(response)

    if not was_modified: return

    files_url_list = response.text.split('\n')

    output_content = []
    logging.debug('Fetching metadata files...')

    for file_url in files_url_list:
        # filter only meta.json files
        if REQUIRED_FILES_NAME['meta'] not in file_url: continue

        model_name = file_url.split('/')[1]
        # get the folder
        base_url = '/'.join(file_url.split('/')[:-1])
        logging.debug('Generating {0}'.format(model_name))
        response = requests.get(CSCS_OBJECT_STORAGE + file_url)
        metadata_info = response.json()
        cell_info = {model_name: {
            'meta': metadata_info,
            'responses': '{0}{1}'.format(model_name, REQUIRED_FILES_NAME['responses']),
            'morph': '{0}{1}'.format(metadata_info['morphology'], REQUIRED_FILES_NAME['morph'])
        }}
        output_content.append(cell_info)
        _check_consistency(base_url, cell_info[model_name], files_url_list)
    return output_content


if __name__ == '__main__':
    metadata = create_meta()
    if metadata:
        output = sys.argv[1]
        with open(output, 'w') as fd:
            fd.write(json.dumps(metadata, indent=2))
