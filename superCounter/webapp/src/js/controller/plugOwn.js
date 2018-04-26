;(function(){
	var commonUseTools = {};
	
	//check bank card num isRight
	//cardNo  银行卡卡号  摸10法
	commonUseTools.isValidityByCardNo = function(CardNo){
	    var id = trim(CardNo.replace(/ /g, ""));
	    var idLen = id.length;
	    if(idLen == 0){
	        alert("卡号不能为空");
	        return false;
	    }else {
	        var sum = 0;
	        var count = 0;
	        var num;
	        for(var i = idLen-1 ; i>= 0 ; i-- ){
	            num = parseInt(id.charAt(i));
	            count++;
	            if(count%2==0){
	                num *= 2 ;
	                if(num>9){
	                    num = num%10+Math.floor(num/10);
	                }
	            }
	            sum += num;
	        }
	
	    }
	
	    if(sum%10==0){
	        return true;
	    }else{
	        return false;
	    }
	}
	
	commonUseTools.changeBankCardNumStyle = function(cardNum){
		var firstSix = cardNum.slice(0,6);
		var lastFour = cardNum.slice(-4);
		var starCount = cardNum.length-10;

		var starString = "";
		for (var i = 0; i < starCount; i++) {
		   	starString =starString + "*"    	    
		}
		var numStyle = firstSix+starString+lastFour;
		return numStyle;
	}
	
	
	window.commonUseTools = commonUseTools;
})(window)
