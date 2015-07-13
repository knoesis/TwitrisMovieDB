var buildChart = function(el, title, series, emo) {
	return {
	    chart: {
	        renderTo: el,
	        zoomType: 'x',
	        height: 350,
	        options3d: (emo ? {
                enabled: true,
                alpha: 45
            } : {}),
            backgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
			 	stops: [ [0, '#2a2a2b'], [1, '#3e3e40'] ]
			},
			style: {
		        fontFamily: "'Unica One', sans-serif"
		    },
		    plotBorderColor: '#606063'
	    },
	    labels: {
      		style: {
         		color: '#707073'
      		}
   		},
	    title: {
	        text: title,
	        style: {
		        color: '#E0E0E3',
		        textTransform: 'uppercase',
		        fontSize: '20px'
		    }
	    },
	    xAxis: [{
	        type: 'datetime',
	        minTickInterval: 24 * 3600 * 1000,
	        labels: {
	            rotation: -45,
	            align: 'right',
	            style: {
	                fontSize: '10px',
	                fontFamily: 'Verdana, sans-serif'
	            }
	        },
			gridLineColor: '#707073',
			labels: {
				style: {
					color: '#E0E0E3'
				}
			},
			lineColor: '#707073',
			minorGridLineColor: '#505053',
			tickColor: '#707073',
			title: {
				style: {
					color: '#A0A0A3'
				}
			}
	    }],
	    yAxis: [{ // Primary yAxis
	        title: {
	            text: '',
	            style: {
	                color: '#A0A0A3'
	            }
	        },
	        gridLineColor: '#707073',
		    labels: {
		        style: {
		            color: '#E0E0E3'
		        }
		    },
	    	lineColor: '#707073',
	    	minorGridLineColor: '#505053',
	    	tickColor: '#707073',
	    	tickWidth: 1
	    }, { // Secondary yAxis
	        gridLineWidth: 0,
	        minRange : 2,
	        title: {
	            text: 'sentiment',
	            style: {
	                color: '#4572A7'
	            }
	        }

	    }, { // Tertiary yAxis
	        gridLineWidth: 0,
	        title: {
	            text: '',
	            style: {
	                color: '#AA4643'
	            }
	        }
	    }],
	    tooltip: {
	        shared: false,
	        followPointer: true,
	    },
	    credits: {
	        enabled: false
	    },
	    navigation: {
	        menuItemStyle: {
	            fontWeight: 'normal',
	            background: 'none'
	        },
	        menuItemHoverStyle: {
	            fontWeight: 'bold',
	            background: 'none',
	            color: 'black'
	        }
	    },
	    plotOptions: {
	        pie: {
	        	options3d: {
	                enabled: true,
	                alpha: 45
	            },
	        	innerSize: 100,
				depth: 45,
	            allowPointSelect: true,
	            cursor: 'pointer',
	            dataLabels: {
	                enabled: true
	            }
	        },
	        areaspline: {
	            fillOpacity: 0.5
	        },
	        series: {
	        	dataLabels: {
	            	color: '#B0B0B3'
	        	},
	         	marker: {
	            	lineColor: '#333'
	         	}
	        }
	    },
	    series: series[0]
	}
}