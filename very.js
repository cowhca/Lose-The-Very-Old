get_random = function (list) {
    return list[Math.floor((Math.random()*list.length))];
} 
get_result = function (list, simple) {
    const simpleStr = simple.trim();
    const regex = new RegExp("^" + simpleStr +"$", "i");
    for (let i in list) {
        if(regex.test(list[i].fields.Simple)) {
            return list[i];
        }
    }
} 

async function callingFn() {
    try {
        // Accessing airtable api with read-only key
        const response = await fetch("https://api.airtable.com/v0/appORCLNTiuF043RV/Database?api_key=keyoFYTwLB0vomKLC", {
            method: "get",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const json = await response.json();

        return json["records"]
    } catch (error) {
        console.error("Error:", error);
    }
}

(async () => {
    var res = await callingFn();
    // Class attributes for output (doesn't include color)
    var textClass = "text-center sm:text-3xl md:text-4xl lg:text-5xl font-bold font-serif";

    async function fetch_concise_adjective(results, random=false) {
        const output = document.getElementById('output');
        const simple = document.getElementById('input').value.toUpperCase();
        var matching_row;
        if (random) {
            matching_row = get_random(results);
            document.getElementById('input').value = matching_row.fields.Simple;
        } else 
            matching_row = get_result(results, simple);
        if (matching_row == undefined) {
            output.innerHTML = "Not Yet Added";
            // Make the text red
            output.setAttribute("class", textClass + " text-red-400");
        } else {
            // There are multiple options for many of the adjectives
            // Each time we should get a random option
            const numOptions = Object.keys(matching_row.fields).length - 1;
            const selectedNumber = Math.floor(Math.random() * numOptions) + 1;
            let selection = matching_row.fields["Concise"+selectedNumber];

            // Find a new response if there are more than 1 options
            while(numOptions > 1 && selection == output.innerHTML)
                selection = matching_row.fields["Concise"+(Math.floor(Math.random() * numOptions) + 1)];
            
            output.innerHTML = selection; // The fields are labels 'Concise1' 'Concise2' etc...
            // Make the text green
            output.setAttribute("class", textClass + " text-green-400");
        }
        
    }

    const input = document.getElementById("input");
    const output = document.getElementById('output');
    const picked_word = get_random(res);
    input.setAttribute("placeholder", picked_word.fields.Simple);
    output.innerHTML = picked_word.fields["Concise1"];
    output.setAttribute("class", "text-center sm:text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-gray-500");
    

    // Get a random word pair when the button is pressed

    $(function() {
        $("#input").focus();
    });

    $(document).ready(function(){
      $('#random-word').click(function(){
         fetch_concise_adjective(res, true);
      });
    });

    // Fetch result when 'Get Result' button is pressed
    $(document).ready(function(){
        $('#get-result').click(function(){
            fetch_concise_adjective(res);
        });
    })

    document.body.onkeyup = function(e){
      if(e.keyCode == 13){
          fetch_concise_adjective(res);
      }
    }
  })()