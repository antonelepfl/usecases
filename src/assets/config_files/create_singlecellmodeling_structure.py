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

MODEL_CATALOG_URL = os.environ['MODELS_URL']
# MODEL_CATALOG_URL = 'https://validation-v1.brainsimulation.eu/models/'

FILES_TO_CREATE = {
    'hippocampus_models.json': '?species=Rat%20(Rattus%20rattus)&brain_region=Hippocampus&organization=HBP-SP6&model_scope=Single%20cell%20model',
    'granule_models.json': '?species=Mouse%20(Mus%20musculus)&brain_region=Cerebellum&cell_type=Granule%20Cell',
    'purkinje_models.json': '?brain_region=Cerebellum&cell_type=Purkinje%20Cell&model_scope=Single%20cell%20model&name=Purkinje%20cell%20-%20Multi%20compartmental',
}

OLD_LIST_NAME = 'old_model_list.json'

def get_id_list(models_list):
    def get_id(o):
        return o['id']

    x = map(get_id, models_list)
    x.sort()
    return x


def _check_models_modification(new_models, file_name):
    new_models_ids = get_id_list(new_models)
    old_model = None
    # new_text = list(sorted(new_text))
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

    instance_to_zip = model_info['instances'][0]['source']
    x['zip_url'] = instance_to_zip
    return x


def get_img(caption_to_find, model_info):
    img_list = model_info['images']

    def get_caption_img(img_list):
        if img_list['caption'] == caption_to_find:
            return True
        return False

    found = filter(get_caption_img, img_list)
    if len(found):
        return found[0]['url']

    logging.warning('%s image not found on %s', caption_to_find, model_info['name'])
    return None


def save_model_file(file_name, output_content):
    logging.info('Saving %s...', file_name)
    logging.debug('Current dir: %s', os.getcwd())
    # output = sys.argv[1]
    output = '.'
    logging.debug('Output file: %s', output)

    with open(os.path.join(output, file_name), 'w') as fd:
        fd.write(json.dumps(output_content, indent=2))


def create_meta():
    for file_name, query_string in FILES_TO_CREATE.iteritems():
        response = requests.get(MODEL_CATALOG_URL + query_string)
        models_list = response.json()['models']
        logging.info('Fetching %s', file_name)
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
    logging.basicConfig(level=logging.INFO)
    main()
