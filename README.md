# AC3D Syntax and Snippets for Visual Studio Code

[![ac3d-logo](/images/icon.png?raw=true)](https://github.com/RenanMsV/ac3d-syntax-vscode)

[![Version](https://img.shields.io/visual-studio-marketplace/v/Renan-MsV.ac3d-syntax.svg?logo=visual%20studio%20code)](https://marketplace.visualstudio.com/items?itemName=Renan-MsV.ac3d-syntax) [![Rating](https://img.shields.io/visual-studio-marketplace/stars/Renan-MsV.ac3d-syntax.svg?logo=visual%20studio%20code)](https://marketplace.visualstudio.com/items?itemName=Renan-MsV.ac3d-syntax) [![Downloads](https://img.shields.io/visual-studio-marketplace/d/Renan-MsV.ac3d-syntax.svg?logo=visual%20studio%20code)](https://marketplace.visualstudio.com/items?itemName=Renan-MsV.ac3d-syntax) [![Build Status](https://img.shields.io/travis/com/RenanMsV/ac3d-syntax-vscode?logo=travis)](https://travis-ci.com/RenanMsV/ac3d-syntax-vscode) [![GNU General Public License](https://img.shields.io/github/license/RenanMsV/ac3d-syntax-vscode?logo=github)](http://www.gnu.org/licenses/gpl-3.0.en.html)

Basic LSP, syntax highlighting and snippets for [AC3D files](https://inivis.com). Supports AC3Db and AC3Dc file formats.

AC3D is mostly used for making 3d models of aircrafts and buildings for [X-Plane](https://www.xcrafts.com/tutorial-ac3d-blender-to-x-plane) and [FlightGear](https://wiki.flightgear.org/AC3D_file_format) flight simulators.

The AC3D file format is ascii text and is very simple to parse. It's also very easy to generate AC3D files from your own data. This extension highlights the structure of AC3D files. AC3D filenames usually have a '.ac' suffix.

## Features

**Hover**: Hover elements to see more info about them

![hover for info](/images/hoverForInfo.png?raw=true)

**Color Picker**: Easily change the Material colors with a simple picker

![color picker](/images/colorProvider.png?raw=true)

**Link Provider**: Easily locate textures used in the 3D model by pressing CTRL and clicking it

![link provider](/images/linkProvider.png?raw=true)

**Folding Provider**: Use folding to hide element groups

![folding provider](/images/foldingProvider.png?raw=true)

## The AC3D file format:

```php
AC3Db
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

## More info:

* <https://sites.google.com/view/ac3dfileformat/home>

* <https://www.inivis.com/ac3d/man/ac3dfileformat.html>

## For extension developers

To build the extension, first run `npm install` to install all development dependencies.

Then run `npm run package` and it will compile, lint, test, and package the extension into a .vsix file located in the root folder.
