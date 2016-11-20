$(document).ready(function() {
  		$("select").change(function() {
    		$("select option:selected").each(function() {
      		if ($(this).attr("value") == "Oone") {
        		$(".box").hide();
        		$(".firstship").show();
      		}
      		if ($(this).attr("value") == "Otwo") {
        		$(".box").hide();
        		$(".secondship").show();
      		}
      		if ($(this).attr("value") == "Othree") {
        		$(".box").hide();
        		$(".thirdship").show();
      		}
    	});
  	}).change();
});