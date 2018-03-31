$(()=>{
  let nowPage = 1 , pageCount = 0 , actCode = '59_02';
  $('.searchBtn').click((e)=>{
    let request = {
      "actCode": actCode,
      "actTimes": "",
      "fromSys": "",
      "hcodeList": [
        {
          "hcode": "",
          "type": ""
        }
      ],
      "mcode": "",
      "outtype": "",
      "phone": localStorage.getItem('phone'),
      "storeid": localStorage.getItem('storeid')
    };
    // restFulApiPost('getStoreMcodeList' , request , 'actMcodeService' , {authorization:localStorage.getItem('authorizationShop')} , {page:nowPage,lines:7} , function (res) {
    //   if(res.code === 100){
    //     if(res.content.rowcount === 0){
    //       $('.listHead').after('<div>你没有任何的记录</div>')
    //     }else {
    //
    //     }
    //   }else {
    //     alert(res.msg);
    //   }
    // });
    $.ajax({
      url:'http://johnzian.cn/php/route/cake_list.php?&pnum='+ nowPage
    }).then((res)=>{
      let html = '' , obj;
      for(let i = 0; i<res.data.length; i++){
        obj = res.data[i];
        if( i%2 === 0){
          html += `        <li class="listBody line1">
          <div class="listDetails">${obj.pid}</div>
          <div class="listDetails">${obj.title}</div>
          <div class="listDetails">${obj.mprice}</div>
          <div class="listDetails">${obj.nprice}</div>
        </li>`
        }else{
          html += `        <li class="listBody line2">
          <div class="listDetails">${obj.pid}</div>
          <div class="listDetails">${obj.title}</div>
          <div class="listDetails">${obj.mprice}</div>
          <div class="listDetails">${obj.nprice}</div>
        </li>`
        }
      }
      $('.listHead').after(html);
      $('.listBody:last').addClass('listBottomBody').children(':first').addClass('listBottomLeft').parent().children(':last').addClass('listBottomRight');
    })
  })
});