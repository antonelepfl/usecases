import os
import sys
import json
# print 'hello'
rootdir = './optimizations'
from UserString import MutableString
out_str = MutableString()
complete = []
out_str += '[]'
for root, subFolders, files in os.walk(rootdir):
   if root != rootdir:
      obj = {}
      for file in files:
         if 'meta.json' in file:
            filePath = root + '/' + file
            f = open( filePath, 'r' )
            obj[file] = json.loads(f.read())
            f.close()
            # print 'into meta'
         elif 'responses' in file:
            obj['responses'] = file
            # print 'into responses'
         elif 'morph' in file:
            obj['morph'] = file
            # print 'into morph'
      entry = {}
      lastPath = root.split('/').pop()
      entry[lastPath] = obj
      complete.append(entry)

f = open( 'singlecellmodeling_structure.json', 'w' )
f.write( json.dumps(complete) )
f.close()