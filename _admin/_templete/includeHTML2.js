function includeHTML2() { 
	var z, i, elmnt, file, xhttp; 
	z = document.getElementsByTagName("*");
	for (i = 0; i < z.length; i++) { 
	
	elmnt = z[i]; 
	
		file = elmnt.getAttribute("include-html-top");
 
		 if (file) { 		 
			xhttp = new XMLHttpRequest(); 
			xhttp.onreadystatechange = function() { 
					if (this.readyState == 4 && this.status == 200) { 
						elmnt.innerHTML = this.responseText; 
						elmnt.removeAttribute("include-html-top"); 
						includeHTML2();
					} 
				} 
				xhttp.open("GET", file, true); 
				xhttp.send(); 
				return; 
			} 
		} 
	}