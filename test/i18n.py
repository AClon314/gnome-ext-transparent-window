#!/bin/env python
import os
import glob
import shutil
import argparse


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
LANG = ['zh']
CODE_LANG = 'JavaScript'
POT = 'en.pot'
EXT_NAME = get_dir()


def gen():
    files = glob.glob('*.js')
    files = ' '.join(files)
    system(f'xgettext --keyword=_ --from-code=UTF-8 --language={CODE_LANG} --output={OUT_DIR}/{POT} {files}')
    for lang in LANG:
        system(f'msginit --input={OUT_DIR}/{POT} --locale={lang}.UTF-8 --output={OUT_DIR}/{lang}.po --no-translator')


def pack():
    shutil.rmtree('locale') if os.path.exists('locale') else None
    os.chdir(os.path.expanduser('~/.local/share/gnome-shell/extensions'))
    system(f'gnome-extensions pack --force --podir={OUT_DIR} {EXT_NAME} --out-dir={EXT_NAME}')
    os.chdir(EXT_NAME)
    ZIP_NAME = f'{EXT_NAME}.shell-extension.zip'
    # 只解压locale目录
    system(f'unzip -o {ZIP_NAME} locale/* -d .')


def main():
    os.chdir('..') if os.path.basename(os.getcwd()) == 'test' else None
    arg = argparse.ArgumentParser()
    arg.add_argument('-g', '--gen', action='store_true', help='Generate pot and po files')
    arg.add_argument('-p', '--pack', action='store_true', help='Pack extension')
    args = arg.parse_args()
    if args.gen:
        gen()
    if args.pack:
        pack()


if __name__ == '__main__':
    main()
