
const getFullGuestDataAndStore = function(url) {
  let GuestData = qs.parse(url);
  GuestData.DateAndTime = getTimeAndDate();
  collectionOfData.unshift(GuestData);
  let data = JSON.stringify(collectionOfData);
  fs.writeFileSync('./data/comments.json', data);
  return;
}

const getHtmlFormOfContent = function(GuestData) {
  let startingContent = '<div><br>';
  let endingContent = '</div></br>';
  collectionOfDataWithHtml = collectionOfData.map(function(GuestData) {
    let nameInHtml = 'Name: ' + GuestData.name + '<br>';
    let commentInHtml = 'Comment: ' + GuestData.comment + '<br>';
    let DateAndTime = 'DateAndTime:' + GuestData.DateAndTime + '<br>';
    return startingContent + nameInHtml + commentInHtml + DateAndTime + endingContent;
  });
  return collectionOfDataWithHtml;
}

const displayAllGuestsInfo = function(req, res) {
  let comments = fs.readFileSync('./data/comments.JSON', 'utf8');
  let guestBookContents = fs.readFileSync('./public/guestBook.html', 'utf8');
  let fileContents = guestBookContents.split('</body>');
  let GuestData = JSON.parse(comments);
  let allComments = getHtmlFormOfContent(GuestData);
  res.write(fileContents[0] + allComments.join('') + '</body></html>');
  res.end();
}
