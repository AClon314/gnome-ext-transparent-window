#!/bin/env python
import os
import glob


def get_dir():
    FULL_SH_PATH = os.path.realpath(__file__)
    FULL_SH_DIR = os.path.dirname(FULL_SH_PATH).removesuffix('/test')
    SH_DIR = os.path.basename(FULL_SH_DIR)
    return SH_DIR


def system(cmd):
    # print(cmd)
    os.system(cmd)


NAME = 'aclon'
EMAIL = 'nolca@qq.com'
OUT_DIR = 'po'
LANG = ['zh_CN']
CODE_LANG = 'JavaScript'
POT = 'temp.pot'
EXT_NAME = get_dir()


os.chdir('..') if os.path.basename(os.getcwd()) == 'test' else None
files = glob.glob('*.js')
files = ' '.join(files)
system(f'xgettext --keyword=_ --from-code=UTF-8 --language={CODE_LANG} --output={POT} {files}')
for lang in LANG:
    system(f'msginit --input={POT} --locale={lang}.UTF-8 --output={OUT_DIR}/{lang}.po --no-translator')
os.remove(POT)

os.chdir(os.path.expanduser('~/.local/share/gnome-shell/extensions'))
system(f'gnome-extensions pack --force --podir={OUT_DIR} {EXT_NAME} --out-dir={EXT_NAME}')
os.chdir(EXT_NAME)
ZIP_NAME = f'{EXT_NAME}.shell-extension.zip'
# 只解压locale目录
system(f'unzip -o {ZIP_NAME} locale/* -d .')
