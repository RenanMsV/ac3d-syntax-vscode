# ac3d-syntax for vscode

[![ac3d-logo](/images/icon.png?raw=true)](https://github.com/RenanMsV/ac3d-syntax)

[![Version](https://vsmarketplacebadge.apphb.com/version-short/RenanMsV.ac3d-syntax.svg?logo=visual%20studio%20code)](https://marketplace.visualstudio.com/items?itemName=RenanMsV.ac3d-syntax) [![Rating](https://vsmarketplacebadge.apphb.com/rating-star/RenanMsV.ac3d-syntax.svg?logo=visual%20studio%20code)](https://marketplace.visualstudio.com/items?itemName=RenanMsV.ac3d-syntax) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/RenanMsV.ac3d-syntax.svg?logo=visual%20studio%20code)](https://marketplace.visualstudio.com/items?itemName=RenanMsV.ac3d-syntax) [![Downloads](https://vsmarketplacebadge.apphb.com/downloads-short/RenanMsV.ac3d-syntax.svg?logo=visual%20studio%20code)](https://marketplace.visualstudio.com/items?itemName=RenanMsV.ac3d-syntax) [![Build Status](https://img.shields.io/travis/com/RenanMsV/ac3d-syntax-vscode?logo=travis)](https://travis-ci.com/RenanMsV/ac3d-syntax-vscode) [![GNU General Public License](https://img.shields.io/github/license/RenanMsV/ac3d-syntax-vscode?logo=github)](http://www.gnu.org/licenses/gpl-3.0.en.html)

Basic syntax highlighting and snippets for [AC3D files](https://inivis.com).

AC3D file format:

```php
MATERIAL %s rgb %f %f %f  amb %f %f %f  emis %f %f %f  spec %f %f %f  shi %d  trans %f (used in AC3Db)
MAT %s (this block used in AC3Dc)
rgb %f %f %f
amb %f %f %f
emis %f %f %f
spec %f %f %f
shi %d
trans %f
data %d
lines of data
ENDMAT
OBJECT %s
*name %s
*data %d
*data lines of %s
*texture %s
*texrep %f %f
*texoff %f %f
*subdiv %d
*crease %f
*rot %f %f %f  %f %f %f  %f %f %f
*loc %f %f %f
*url %s
*hidden
*locked
*folded
*numvert %d
    numvert lines of %f %f %f
*numsurf %d
    *SURF %d
    *mat %d
    refs %d
    refs lines of %d %f %f
kids %d
```

More info:

* <https://sites.google.com/view/ac3dfileformat/home>

* <https://www.inivis.com/ac3d/man/ac3dfileformat.html>
