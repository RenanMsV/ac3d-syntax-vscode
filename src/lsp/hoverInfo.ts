export const hoverInfo: Record<string, string> = {
  AC3Db: 'The first four characters are always \'AC3D\', followed immediately by a hexadecimal number\
    that defines the internal version of the file (0xb == 11).\
    If the version is newer than what the program supports, it may refuse\
    to load the file. This number is used to ensure backward compatibility\
    as new versions of the AC3D format are developed.',

  AC3Dc: 'The first four characters are always \'AC3D\', followed immediately by a hexadecimal number\
    that defines the internal version of the file (0xc == 12).\
    If the version is newer than what the program supports, it may refuse\
    to load the file. This number is used to ensure backward compatibility\
    as new versions of the AC3D format are developed.',

  MATERIAL: '(name) **rgb** %f %f %f **amb** %f %f %f **emis** %f %f %f **spec** %f %f %f **shi** %d **trans** %f\
    \n\n\
    A single line describing a material. These are referenced by the "mat"\
    token of a surface. The first "MATERIAL" in the file is indexed as\
    zero. Materials are typically listed at the beginning of the file,\
    immediately after the header.',

  MAT: '%s\
    \n\n\
    A block used in files with the AC3Dc heading.',

  ENDMAT: 'Marks the end of a MAT block. Used in files with the AC3Dc heading.',

  OBJECT: '%s\
    \n\n\
    Indicates the start of an object. The object section must end with\
    a "kids" line, which specifies how many child objects (possibly zero)\
    follow. The parameter defines the object type - one of: world, poly,\
    or group.',

  name: '%s\
    \n\n\
    Optional - a name assigned to the object.',

  data: '%d\
    \n\n\
    Optional - object-specific data. Usually a data string associated with the object.\
    The parameter is an integer indicating the number of characters\
    (starting on the next line) to read.',

  texture: '%s\
    \n\n\
    Optional - defaults to no texture. Specifies the path to the bitmap file used as\
    the texture for the current object.',

  texrep: '%f %f\
    \n\n\
    Optional - default is 1.0,1.0. Defines how many times the texture is repeated\
    (tiled) on the object\'s surfaces.',

  rot: '%f %f %f  %f %f %f  %f %f %f\
    \n\n\
    A 3x3 rotation matrix for the object\'s vertices. The rotation is relative\
    to the object\'s parent, not global. If not specified, the default\
    matrix is the identity matrix: 1 0 0, 0 1 0, 0 0 1.',

  loc: '%f %f %f\
    \n\n\
    Specifies the translation (position) of the object, effectively defining\
    its center. This position is relative to the parent, not global.\
    If not present, the default center is at 0, 0, 0.',

  url: '%s\
    \n\n\
    The URL associated with the object. Defaults to an empty string.',

  numvert: '%d\
    \n\
        numvert lines of %f %f %f\
    \n\n\
    The number of vertices in the object. This value specifies how many\
    lines follow, each containing a local coordinate (%f %f %f) for a vertex.\
    Some objects, such as groups, may not include a numvert token.',

  numsurf: '%d\
    \n\n\
    Specifies the number of surfaces the object contains. This value\
    determines how many surface blocks follow.',

  crease: '%f\
    \n\n\
    Defines the maximum angle (in degrees) between adjacent polygon normals\
    at which smoothing will be applied. Useful for controlling shading\
    on curved versus hard-edged models.',

  SURF: '%d\
    \n\n\
    Marks the beginning of a surface. The parameter defines the surface type and flags.\
    The first 4 bits (flags & 0xF) indicate the type (0 = polygon, 1 = closedline,\
    2 = line). The next 4 bits (flags >> 4) define shading and backface properties:\
    bit1 = shaded, bit2 = two-sided.',

  mat: '%d\
    \n\n\
    The index of the material assigned to this surface.',

  refs: '%d\
    \n\
        refs lines of %d %f %f\
    \n\n\
    Specifies the number of vertices used by the surface. This value\
    determines how many lines follow, each containing a vertex index\
    and its texture coordinates.',

  kids: '%d\
    \n\n\
    This token must be the last line of an object section. If the value\
    is greater than 0, that many child objects will be recursively loaded\
    as children of the current object.',

  rgb: '%f %f %f\
    \n\n\
    The RGB color values, each normalized between 0 and 1.',

  amb: '%f %f %f\
    \n\n\
    The ambient color values, each normalized between 0 and 1.',

  emis: '%f %f %f\
    \n\n\
    The emissive color values, each normalized between 0 and 1.',

  spec: '%f %f %f\
    \n\n\
    The specular color values, each normalized between 0 and 1.',

  shi: '%d\
    \n\n\
    The shininess value. An integer from 0 to 128.',

  trans: '%f\
    \n\n\
    The transparency value, normalized between 0 and 1.',
};
