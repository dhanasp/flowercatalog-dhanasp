
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

const displayAllGuests=function(){
  let GuestData = JSON.parse(comments);
  let allComments = getHtmlFormOfContent(GuestData);
  console.log(allComments);
  commentBox=document.getElementById('commentBox');
  commentBox.appendChild(allComments);
}


window.onload=displayAllGuests;
