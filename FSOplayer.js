$(document).ready(function() {
  		$("select").change(function() {
    		$("select option:selected").each(function() {
      		if ($(this).attr("value") == "RedRover") {
        		$(".box").hide();
        		$(".firstship").show();
      		}
      		if ($(this).attr("value") == "YellowFever") {
        		$(".box").hide();
        		$(".secondship").show();
      		}
      		if ($(this).attr("value") == "GreenSwarm") {
        		$(".box").hide();
        		$(".thirdship").show();
      		}
    	});
  	}).change();
});