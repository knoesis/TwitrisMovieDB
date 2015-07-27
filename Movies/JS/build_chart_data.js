var graph_data = function( name_point_data, graph_type ) {

	var CSS_COLOR_NAMES = ["#66CC33","#9999CC","#CC0066","#99CCFF","#330000","#66FFCC","#FF3399","#CCFF66","#99FF33","#993300","#FFFFCC","#CCFF00","#66CCFF","#663399","#99FF99","#FFFF33","#666633","#66CC99","#3300FF","#006699","#669966","#66FF99","#0066FF","#9933CC","#00CCCC","#CCFFCC","#FF6600","#CC9900","#990099","#990000","#3366CC","#CC9999","#CC6666","#00FF66","#996600","#FF66FF","#9966CC","#CCCC99","#996633","#FF9933","#993333","#663333","#333333","#00FF00","#993366","#660066","#CCCC00","#336600","#660000","#339933","#6633FF","#6633CC","#0099FF","#66FF66","#330099","#CC99CC","#99FF66","#CC3399","#6699CC","#003333","#CC6699","#99FFFF","#339966","#003366","#66FFFF","#666600","#CCCC33","#99CC99","#CC0033","#99CC66","#999966","#00CC99","#0033FF","#660033","#FFCC66","#CCFFFF","#99FFCC","#009900","#CCCC66","#3366FF","#669933","#009933","#33CC99","#9900CC","#FF66CC","#336699","#FFCC33","#333399","#33CC33","#FF33CC","#99CCCC","#99FF00","#CCFF33","#33CC66","#FF6699","#FFFF00","#FF0000","#FFCC00","#FF99CC","#666699","#CC0000","#CC3366","#CC33FF","#0066CC","#CC3300","#9966FF","#33CCFF","#CC6600","#669999","#FF00CC","#3300CC","#FFCC99","#9900FF","#6666CC","#33FF99","#669900","#00FF99","#FF99FF","#66CCCC","#CC3333","#CCCCFF","#66CC00","#FFCCFF","#990066","#6600CC","#990033","#3399FF","#FFFF66","#3333CC","#666666","#FF0033","#FF9966","#9999FF","#CC0099","#000099","#00CCFF","#66FF00","#FF3333","#000033","#FF9999","#006633","#CCFF99","#663366","#999999","#FF6633","#0033CC","#6699FF","#00CC33","#3399CC","#00CC00","#6600FF","#00FF33","#663300","#CC9966","#CC6633","#33FFFF","#336633","#330033","#66CC66","#9933FF","#009999","#CC33CC","#006600","#999933","#339900","#FF3300","#0099CC","#CC00CC","#FFCCCC","#99CC33","#33FF33","#FF33FF","#660099","#33FFCC","#CCCCCC","#996666","#6666FF","#3333FF","#333300","#FF0066","#33CC00","#00FFCC","#CC00FF","#0000FF","#33CCCC","#FF00FF","#FFFF99","#339999","#999900","#006666","#CC66CC","#CC99FF","#FF0099","#99CC00","#996699","#003399","#336666","#66FF33","#0000CC","#330066","#003300","#CC66FF","#33FF66","#333366","#993399","#33FF00","#00CC66","#FF3366","#000000","#FF6666","#00FFFF","#009966","#CC9933","#FF9900","#000066"]

	var seriesArray = [],
		data_array = [],
		length = ( name_point_data === undefined ) ? 2 : name_point_data.length,
		i; 

	if( graph_type === 'pie')
	{
		// reg ex explanation
		// everything between "/" IS the reg ex 
		// "\(" means that we are going to escape the reg ex meaning of "(" and look for an actual exsisting "("
		// the yellow () mean that we want to save what is found 
		// . means any char
		// + means one or more of the preceeding chars 	
		var re = RegExp(/\((.+)\)/);
		for ( i = 0; i < name_point_data.length; i++)
		{
			var datum = {
				name:name_point_data[i].name.match(re)[1],
				y: 0,
                color: Highcharts.getOptions().colors[i],
                sliced: false,
            	selected: false
			}
			for (var j = 0; j < name_point_data[i]['data'].length; j++)
			{
				datum['y']+=name_point_data[i]['data'][j]['count'];
			}		
			data_array.push(datum)
		}		
		
		seriesArray.push( new Array({ 
			name: 'Total',
            type: 'pie',
            data: data_array ,
            showInLegend: false
        }));

		return seriesArray;	
	}
	else
	{ 
		for ( i = 0; i < length ; i++)
		{
            var data_points = [];
            for ( var j = 0; j < name_point_data[i].data.length; j++)
		    {
		    	var date = [];
		    	date = name_point_data[i].data[j].date;
		    	var yymmdd = date.split('T')[0].split('-');

		    	var correctForMonth = yymmdd[1]-1 < 10 ? '0'+parseInt(yymmdd[1]-1) : parseInt(yymmdd[1]-1); 

		    	var emo = _.isUndefined(name_point_data[i].keyword)
				var name = ((!emo)?name_point_data[i].keyword:name_point_data[i].name);
                data_points.push( [ Date.UTC( yymmdd[0], correctForMonth , yymmdd[2] ) , 
	                	!emo ? parseFloat( name_point_data[i].data[j].sentiment ):
	                	 						   parseFloat( name_point_data[i].data[j].count ) ] ) ;
            }

			var obj = { 
				name: name,
                color: CSS_COLOR_NAMES[i+seriesArray.length*data_array.length],
                data : data_points
			};
			if(graph_type !== 'table') {
				obj.type = graph_type;
			}

			data_array.push(obj);
		}

		seriesArray.push( data_array );
		return seriesArray;
	}	
};
