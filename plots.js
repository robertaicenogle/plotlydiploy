function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
})}

// Initialize the dashboard
init();

// Use the first sample from the list to build the initial plots
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildBarChart(newSample);
  buildGaugeChart(newSample);
  buildBubbleChart(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(key.toUpperCase() + ': ' + value); 
    })


  });
}

// 1. Create the buildCharts function.
function buildBarChart(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
  
    // 3. Create a variable that holds the samples array. 
    var resultArray = data
    .samples
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    .filter(sampleObj => {
      return sampleObj.id == sample
    });
    
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var top_ten_otu_ids = result.otu_ids.slice(0, 10).map(numericIds => {
      return 'OTU ' + numericIds;
    }).reverse();
    
    // 7. Create the yticks for the bar chart.
    var top_ten_sample_values = result.sample_values.slice(0, 10).reverse();
    var top_ten_otu_labels = result.otu_labels.slice(0, 10).reverse();
    
    // 8. Create the trace for the bar chart.
    var barData = [
      {
        x: top_ten_sample_values,  
        y: top_ten_otu_ids,
        text: top_ten_otu_labels,
        name: "Top 10",
        type: 'bar',
        orientation: 'h'
      }
      ];

      var data = [barData];

      // 9. Create the layout for the bar chart.
      var barLayout = {
        title: "Top 10 OTUs",
   
      };
      // 10. Use Plotly to plot the data with the layout.
      Plotly.newPlot('bar', barData, barLayout)
    
    });
  }
  
  // 1. Create the buildCharts function.
  function buildGaugeChart(sample) {
    
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      
      // 3. Create a variable that holds the samples array.
      var resultArray = metadata
      
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      .filter(sampleObj => {
        return sampleObj.id == sample
      });
      console.log(resultArray);

      //  5. Create a variable that holds the first sample in the array.
      var result = resultArray[0];
      console.log(result);
      var wash_freq = result.wfreq;
      console.log(wash_freq);

      // 5.1. Create the trace for the gauge chart.
      var gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: wash_freq,
          title: {text: "Belly Button Washing Frequency <br> Scrubs per Week", font: {size: 18}},
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [null, 10]},
            bar: { color: "steelblue" },
            steps: [
              { range: [0, 1], color: 'rgba(0, 0, 0, 0.5)' },
              { range: [1, 2], color: 'rgba(0, 0, 0, 0.5)' },
              { range: [2, 3], color: 'rgba(183,28,28, .5)' },
              { range: [3, 4], color: 'rgba(183,28,28, .5)' },
              { range: [4, 5], color: 'rgba(249, 168, 37, .5)' },
              { range: [5, 6], color: 'rgba(249, 168, 37, .5)' },
              { range: [6, 7], color: 'rgba(110, 154, 22, .5)' },
              { range: [7, 8], color: 'rgba(110, 154, 22, .5)' },
              { range: [8, 9], color: 'rgba(14, 127, 0, .5)' },
              { range: [9, 10], color: 'rgba(14, 127, 0, .5)' }
            ],
          }  
        }
      ];
      
      // 6. Create the layout for the gauge chart.
      var gaugeLayout = {
        
        
        width: 600, 
        height: 500, 
        margin: { t: 0, b: 0 }
      };
      
      // 6.1. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot('gauge', gaugeData, gaugeLayout)
    
    });
  
  }

    function buildBubbleChart(sample) {
      d3.json("samples.json").then((data) => {
        var resultArray = data
        .samples
        .filter(sampleObj => {
          return sampleObj.id == sample
        });
        
        var result = resultArray[0];
        
        var otu_ids = result.otu_ids.map(numericIds => {
          return numericIds;
        }).reverse();
        
        var sample_values = result.sample_values.reverse();
        var otu_labels = result.otu_labels.reverse();
        
        // 1. Create the trace for the bubble chart.
        var bubbleData = {
          
          x: otu_ids,  
          y: sample_values,
          text: otu_labels,
          mode: 'markers',
          marker: {
            color: otu_ids,
            size: sample_values

          }
        };
    
          var data = [bubbleData];
    
          // 2. Create the layout for the bubble chart.
          var bubbleLayout = {
            title: "OTU ID",
            showlegend: false,

          };
          
          // 3. Use Plotly to plot the data with the layout.
          Plotly.newPlot('bubble', data, bubbleLayout)
        
        });
      }