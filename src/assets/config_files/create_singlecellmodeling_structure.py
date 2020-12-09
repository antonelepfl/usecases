#!/usr/bin/env python

'''
This will generate files models files on the output directory passed as param
Usage: create_singlecellmodeling_structure.py output_dir/
'''

import collections
import json
import logging
import os
import requests
import sys

# MODEL_CATALOG_URL = 'https://validation-v2.brainsimulation.eu/models/'
REFRESH_ENDPOINT = 'https://services.humanbrainproject.eu/oidc/token'
MODEL_CATALOG_URL = os.environ['MODELS_URL']
REFRESH_TOKEN = os.environ['REFRESH_TOKEN']
CLIENT_ID = os.environ['CLIENT_ID']


FILES_TO_CREATE = {
    'granule_models.json': '?brain_region=cerebellum&cell_type=granule%20cell&model_scope=single%20cell&species=Rattus%20norvegicus&abstraction_level=spiking%20neurons%3A%20biophysical',
    'hippocampus_models.json': '?brain_region=hippocampus&organization=HBP-SP6&model_scope=single%20cell&species=Rattus%20norvegicus&collab_id=12027',
    'purkinje_models.json': '?brain_region=cerebellum&cell_type=Purkinje%20cell&model_scope=single%20cell&name=Purkinje%20cell%20-%20Multi%20compartmental',
}

OLD_LIST_NAME = 'old_model_list.json'

def get_id_list(models_list):
    def get_id(o):
        return o['id']

    x = list(map(get_id, models_list))
    x.sort()
    return x


def _check_models_modification(new_models, file_name):
    new_models_ids = get_id_list(new_models)
    old_model = None
    if os.path.isfile(OLD_LIST_NAME):
        with open(OLD_LIST_NAME) as fd:
            old_model = json.loads(fd.read())

        if file_name in old_model and old_model[file_name] == new_models_ids:
            logging.info('%s was not modified', file_name)
            return False

    logging.info('%s list was changed', file_name)

    # create or update file to compare next time
    if old_model:
        old_model.update({ file_name: new_models_ids })
    else:
        old_model = { file_name: new_models_ids }
    with open(OLD_LIST_NAME, 'w') as fd:
        fd.write(json.dumps(old_model))

    return True


def filter_meta(model_info):
    fields_to_save = ('name', 'author', 'cell_type', 'brain_region', 'species', 'description')
    x = {k: model_info[k] for k in fields_to_save}

    instance_to_zip = next((inst["source"] for inst in model_info['instances'] if inst["version"] == "2.0"), None)
    x['zip_url'] = instance_to_zip
    return x


def get_img(caption_to_find, model_info):
    img_list = model_info['images']

    def get_caption_img(img_list):
        if img_list['caption'] == caption_to_find:
            return True
        return False

    found = list(filter(get_caption_img, img_list))
    if len(found):
        return found[0]['url']

    logging.warning('%s image not found on %s', caption_to_find, model_info['name'])
    return None


def save_model_file(file_name, output_content):
    logging.info('Saving %s...', file_name)
    logging.debug('Current dir: %s', os.getcwd())
    output = sys.argv[1] if len(sys.argv) > 1 else '.'
    logging.debug('Output file: %s', output)

    with open(os.path.join(output, file_name), 'w') as fd:
        fd.write(json.dumps(output_content, indent=2))

def _get_token():
    data = {
        'client_id': CLIENT_ID,
        'refresh_token': REFRESH_TOKEN,
        'grant_type': 'refresh_token',
    }
    headers = {
        'Content-type': 'application/x-www-form-urlencoded',
    }
    final_req = requests.post(REFRESH_ENDPOINT, data=data, headers=headers)
    return final_req.json()['access_token']


def create_meta():
    headers = {
        'Authorization': 'Bearer {}'.format(_get_token())
    }

    for file_name, query_string in FILES_TO_CREATE.items():
        logging.info('Fetching %s:', file_name)
        response = requests.get(MODEL_CATALOG_URL + query_string, headers=headers)
        if not response.ok:
            logging.error('Failed to fetch data for %s', file_name)
            logging.error(response.text)
            continue
        models_list = response.json()
        logging.info('Models found: %s', len(models_list))
        if not _check_models_modification(models_list, file_name):
            continue # avoid creation

        output_content = []
        for model in models_list:
            model_name = model['name']
            cell_info = {
                model_name: {
                    'meta': filter_meta(model),
                    'responses': get_img('Responses', model),
                    'morph': get_img('Morphology', model),
                },
            }
            output_content.append(cell_info)

        save_model_file(file_name, output_content)

    logging.info('All done')


def main():
    create_meta()


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    main()
