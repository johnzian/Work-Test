$(()=>{
  let hash = getHashObj(), storeid = "";
  restFulApiGet('login', {uName:hash.phone, uPwd:hash.pcode}, 'authService', {}, function(json)  {
    if(json.code === 100){
      localStorage.setItem("authorizationShop", json.content.token);
      localStorage.setItem("storeid", json.content.fid);
      localStorage.setItem("phone", hash.phone);
    }else{
      alert(json.msg);
    }
  })
});

$(()=>{
  
  let controlSuccess = false;
  
  let $phone = $('.phone') , $exCode = $('.exchangeCode') , $pcode = $('.productTransCode') , $mask = $('.mask') , actCode = "59_02";
  
  $exCode.blur(()=>{                //检查兑换码
    if(!$exCode.val()|| !$phone.val()){
      return;
    }
    let request={
      "actCode": actCode,
      "actTimes": "1",
      "fromSys": "门店APP",
      "hcodeList": [
        {
          "hcode": $pcode.val(),//运输码
          "type": 1
        }
      ],
      "mcode": $exCode.val(),//兑换码
      "outtype": "",
      "phone": localStorage.getItem('phone'),
      "storeid": localStorage.getItem('storeid')
    };
    restFulApiPost('checkMcode',request,'actMcodeService',{authorization:localStorage.getItem('authorizationShop')},{},function (res) {
      console.log(res);
      $('.nowState').html(res.content.msg);
    })
  });
  
  
  
  
  
  
  $('.sureBtn').click(()=>{
    if(!$phone.val() || !$exCode.val() || !$pcode.val()){
      alert('手机号、兑换码、物流码不能为空');
      return;
    }
    request={
      "actCode": actCode,
      "actTimes": "1",
      "fromSys": "门店APP",
      "hcodeList": [
        {
          "hcode": $pcode.val(),
          "type": "3",
        }
      ],
      "mcode": $exCode.val(),
      "outtype": "3",
      "phone": localStorage.getItem('phone'),
      "storeid": localStorage.getItem('storeid')
    };
    restFulApiPost('useMcode',request,'actMcodeService',{authorization:localStorage.getItem('authorizationShop')},{},function (res) {
      if(controlSuccess){
        $('.warningPic').attr({src: "images/兑换成功，会员可从门店领取兑换礼品！.png"});
        $('.warningBtn').html('确定');
        $mask.fadeIn();
      }else{
        $('.warningPic').attr({src: "images/兑换失败！兑换码错误，请检查重新输入。.png"});
        $('.warningBtn').html('返回');
        $mask.fadeIn();
      }
    })
  });
  
  
  $mask.on('click','.warningBtn , .closeBtn',()=>{
    $mask.fadeOut();
  })
});