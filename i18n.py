#!/bin/env python
import os
import glob

NAME = 'aclon'
EMAIL = 'nolca@qq.com'
OUT_DIR = 'i18n'
LANG = ['zh_CN']
CODE_LANG = 'JavaScript'
POT = 'temp.pot'

files = glob.glob('*.js')
files = ' '.join(files)
os.system(f'xgettext --keyword=_ --from-code=UTF-8 --language={CODE_LANG} --output={POT} {files}')
for lang in LANG:
    os.system(f'msginit --input={POT} --locale={lang}.UTF-8 --output={OUT_DIR}/{lang}.po --no-translator')
os.remove(POT)
