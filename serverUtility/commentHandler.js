const fs = require('fs');
const CommentHandler=function(path){
  this.path=path;
}

CommentHandler.prototype.getTimeAndDate = function () {
  let time=new Date();
  return time.toLocaleString();
};

CommentHandler.prototype.getHtmlFormOfContent = function(allGuestData) {
  let startingContent = '<div><br>';
  let endingContent = '</div></br>';
  collectionOfDataWithHtml =allGuestData.map(function(GuestData) {
    let nameInHtml = 'Name: ' + GuestData.name + '<br>';
    let commentInHtml = 'Comment: ' + GuestData.comment + '<br>';
    let DateAndTime = 'DateAndTime:' + GuestData.DateAndTime + '<br>';
    return startingContent + nameInHtml + commentInHtml + DateAndTime + endingContent;
  });
  return collectionOfDataWithHtml;
}

CommentHandler.prototype.loadComments = function() {
  let guestBookContents = fs.readFileSync('./templates/guestLogin.html','utf8');
  let comments = fs.readFileSync(this.path,'utf8');
  let allGuestData = JSON.parse(comments);
  let allCommentsInHtml = this.getHtmlFormOfContent(allGuestData);
  guestBookContents=guestBookContents.replace('comments',allCommentsInHtml);
  return guestBookContents;
}


CommentHandler.prototype.postGuestBook = function (name) {
  GuestbookWithCommentBox=fs.readFileSync('./templates/guestBook.html','utf8');
  GuestbookWithCommentBox=GuestbookWithCommentBox.replace('${name}',name);
  let comments = fs.readFileSync(this.path,'utf8');
  let allGuestData = JSON.parse(comments);
  let allCommentsInHtml = this.getHtmlFormOfContent(allGuestData);
  GuestbookWithCommentBox=GuestbookWithCommentBox.replace('allComments',allCommentsInHtml);
  return GuestbookWithCommentBox;

};

CommentHandler.prototype.storeComment= function (comment) {
  comment.DateAndTime=this.getTimeAndDate();
  let comments = fs.readFileSync(this.path,'utf8');
  let allGuestData = JSON.parse(comments);
  allGuestData.unshift(comment);
  allComments=JSON.stringify(allGuestData);
  fs.writeFileSync(this.path,allComments);
};

module.exports=CommentHandler;
