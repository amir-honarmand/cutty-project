const jalali = require('jalali-moment');

exports.formatDate = (date)=>{
    return jalali(date).locale("fa").format("D MMM YYYY");
};