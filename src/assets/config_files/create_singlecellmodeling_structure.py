#!/usr/bin/env python
'''
Usage: create_singlecellmodeling_structure.py output.json
'''

import collections
import json
import logging
import os
import requests
import sys

CSCS_OBJECT_STORAGE = os.environ['MODELS_URL']

REQUIRED_FILES_NAME = {
    'morph': '_morph.jpeg',
    'responses': '_responses.png',
    'meta': 'meta.json',
}
OLD_LIST_NAME = 'old_model_list.txt'


def _check_consistency(base_url, metadata, required_names):
    for required in ('responses', 'morph'):
        asset = os.path.join(base_url, metadata[required])
        if asset not in required_names[required]:
            logging.warning('ERROR in cell. Plot not found %s', asset)


def _check_models_modification(new_text):
    new_text = list(sorted(new_text))
    if os.path.isfile(OLD_LIST_NAME):
        with open(OLD_LIST_NAME) as fd:
            old_text = list(sorted(fd.read().split()))

        if old_text == new_text:
            logging.debug('Models were not modified')
            return False

    logging.debug('Model list was changed')

    # create file to compare next time
    with open(OLD_LIST_NAME, 'w') as fd:
        fd.write('\n'.join(new_text))

    return True


def filter_required_names(names, required):
    ret = collections.defaultdict(set)
    for name in names:
        for k, ending in required.items():
            if not name.endswith(ending):
                continue
            ret[k].add(name)
    return ret



def create_meta():
    response = requests.get(CSCS_OBJECT_STORAGE)
    contents = response.text.split()

    if not _check_models_modification(contents):
        return

    required_names = filter_required_names(contents, required=REQUIRED_FILES_NAME)

    logging.debug('Fetching metadata files...')

    output_content = []
    for file_url in required_names['meta']:
        model_name = file_url.split('/')[1]
        base_url = os.path.dirname(file_url)

        logging.debug('Generating %s', model_name)

        response = requests.get(CSCS_OBJECT_STORAGE + file_url)
        metadata_info = response.json()

        cell_info = {
            model_name: {
                'meta': metadata_info,
                'responses': '{0}{1}'.format(model_name, REQUIRED_FILES_NAME['responses']),
                'morph': '{0}{1}'.format(metadata_info['morphology'], REQUIRED_FILES_NAME['morph'])
            },
        }
        _check_consistency(base_url, cell_info[model_name], required_names)
        output_content.append(cell_info)
    return output_content


def main():
    metadata = create_meta()
    if metadata:
        logging.debug('Current dir: %s', os.getcwd())
        output = sys.argv[1]
        logging.debug('Output file: %s', output)

        with open(output, 'w') as fd:
            fd.write(json.dumps(metadata, indent=2))


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    main()
