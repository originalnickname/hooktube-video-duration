// ==UserScript==
// @name     hooktube video duration
// @version  0.1
// @grant    none
// @include  *hooktube.com/*
// ==/UserScript==

//bugs:
//it only works with annoying alert (maybe the alert reloads the page or something) without the alert all global_yttime become 'undefined' rendering this script useless
//it does not yet work on any other page than homepage because hooktube loads links to new videos in javascript instead of html
//some video's dont show the correct play time: eg 25 or 07 instead of 1:03 or 2:51 --> cause may be youtube api or covtime() function, I suspect covtime function..
//the time does not get displayed over the thumbnail but underneath it. --> fixable in css

//personal youtube api key
var api_key='AIzaSyDfR4f43kxH2DrYhPlit88Yt6Z8R1ZmEUw';

//global variable to store youtube time from inside function
var global_yttime='';

//function to rewrite raw youtube time to more normal readable format
function covtime(youtube_time){
  if(typeof youtube_time !== 'undefined')
  {
    if(youtube_time=='PT0S')
    {
      formatted='live';
    }else{
      array = youtube_time.match(/(\d+)(?=[MHS])/ig)||[];
        var formatted = array.map(function(item){
            if(item.length<2) return '0'+item;
            return item;
        }).join(':');
    }
    
    if(formatted=='00')
    {
      formatted='live';
    }
    
    return formatted;
  }else{
    return '';
  }
}

//json function to fetch json object from api
var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
};


//retrieving all <a> links from document
//elements=document.getElementsByTagName('a');
elements=document.links;

//loop through <a> links
for (var i = 0; i < elements.length; i++) {
  
  //href
  var href=elements[i].href;
  
  //filter all links: we only want the links that open a video with thumbnails images
  if( href.indexOf("/watch?v=") != -1 && elements[i].innerHTML.indexOf("<img") != -1 )
  {
    
    //youtube video ID
    var ytid=href.split("/watch?v=").pop();
    
    //make json request to youtube API to fetch json object from api
getJSON('https://www.googleapis.com/youtube/v3/videos?id='+ytid+'&part=contentDetails&key='+api_key, function(err, data) {
  if (err != null) {
    alert('Something went wrong: ' + err);
  } else {
    
    //raw youtube time from json object
    yt_time=data.items[0].contentDetails.duration;
    
    //put raw video time in global variable
    this.global_yttime=yt_time;
  }
}); 

    //BUG: if you turn the alerts below off, all this.global_yttime become undefined. (WTF?), it only works with this annoying alert.
    alert(0);
    //filter out all undefined video times --> covtime does not work if youtube_time is undefined 
    if(typeof this.global_yttime!== "undefined")
    {
      //append formatted video time under thumbnails
    	elements[i].innerHTML=elements[i].innerHTML+'<div style="background-color:#000;color:white;font-size:10px;display:inline-block">' + covtime(this.global_yttime) + '</div>';
    }
  }
}
