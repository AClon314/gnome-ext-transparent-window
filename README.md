## Usage 用法


## Develop 开发
本项目也可以做为gnome-extension调试模板，修改[`run.sh`](test/run.sh)，在vscode按下<kbd>F5</kbd>即可调试。

- [`git-init.sh`](test/git-init.sh): 执行`git clone`后，再执行本脚本，就能仅拉取`gnome-shell/js`而非整个仓库。

- [`i18n.py --gen --pack`](test/i18n.py): 生成[`po/en.pot`](po/en.pot)并**覆盖**[`po/*.po`](po/zh.po)，然后打包`*.shell-extension.zipo`

每当项目结构发生改变，就需要重新运行一次`gnome-extensions enable ext@author`