const Guest=function(){
  this.name='';
  this.comment='';
  this.DateAndTime=new Date().toLocaleString();
}

Guest.prototype={
  seperateGuestData:function(GuestData){
    let startingIndex=GuestData.lastIndexOf('name');
    let lastGuestData=GuestData.slice(startingIndex);
    let guestData=lastGuestData.replace(/\+/g,' ');
    let guestInfoParts=guestData.split('&');
    this.name=guestInfoParts[0].split('=')[1];
    this.comment=guestInfoParts[1].split('=')[1];
  }
}

const GuestBook=function(){
  this.Guests=[];
}

GuestBook.prototype={
  addGuests:function(guestData){
    guest=new Guest();
    guest.seperateGuestData(guestData);
    this.Guests.push(guest);
  },
}
module.exports=GuestBook;
