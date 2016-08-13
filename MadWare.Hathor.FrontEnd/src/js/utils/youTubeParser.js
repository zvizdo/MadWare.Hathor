const parseYouTubeLink = function(link) {
  if (!link) {
    return null;
  } else if (link.length == 11) {
    return link;
  } else {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = link.match(regExp);
    return (match && match[7].length==11) ? match[7] : null;
  }
}

export default parseYouTubeLink;
