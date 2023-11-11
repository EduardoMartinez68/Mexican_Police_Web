//with this function we will can return the time of start
const {format}=require('timeago.js');
const helpers={};
helpers.timeago=(timestamp)=>{
    return format(timestamp);
};
module.exports=helpers;