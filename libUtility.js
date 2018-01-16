const getContentType = function(file) {
  fileExtension = file.slice(file.lastIndexOf('.'));
  allExtensionsWithContentType = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.jpg': 'image/png',
    '.gif': 'img/gif',
    '.pdf': 'document/pdf',
    '.js': 'text/javascript',
    '.ico': 'image/png'

  }
  return allExtensionsWithContentType[fileExtension];
}

exports.getContentType=getContentType;
