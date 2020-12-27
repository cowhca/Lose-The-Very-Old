get_random = function (list) {
    return list[Math.floor((Math.random()*list.length))];
} 

get_result = function (list, simple) {
    // Regex to trim whitespace and any periods at the beggining and end
    const simpleStr = simple.replace(/^[\s\.]+|[\s\.]+$|\.*/g, '');
    document.getElementById('input').value =simpleStr;
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
        var done = false;
        var toReturn = [];
        var offset = "";

        // Airtable only allows 100 records per response so we do a while loop until it is done
        // when we do a request but don't get all of the data airtable includes an offset in the response
        while (!done) {
            var response = await fetch("https://api.airtable.com/v0/appHLMobCaTLuVQQy/Data?api_key=keyoFYTwLB0vomKLC&offset="+offset, {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            var json = await response.json();
            toReturn.push(...json.records)
            if (json.hasOwnProperty("offset")){
                offset = json.offset;
            } else {
                done = true;
            }
        }
        return toReturn;
    } catch (error) {
        console.error("Error:", error);
    }
}

(async () => {
    var res = await callingFn();
    // Class attributes for output (doesn't include color)
    // var textClass = "text-center sm:text-3xl md:text-4xl lg:text-5xl font-bold font-serif";

    async function fetch_concise_adjective(results, random=false) {
        const output = document.getElementById('output');
        const simple = document.getElementById('input').value;
        var matching_row;
        // If input is empty tell user that there is no input
        if (simple === "" && !random) {
            output.innerHTML = "No Input"
            output.classList.remove("text-green-400", "text-gray-400")
            output.classList.add("text-red-400")
        } else {
            // Get matching row
            if (random) {
                matching_row = get_random(results);
                document.getElementById('input').value = matching_row.fields.Simple;
            } else {
                matching_row = get_result(results, simple);

            // Outputting result
            } if (matching_row == undefined) {
                output.innerHTML = "Not Yet Added";
                // Make the text red
                output.classList.remove("text-green-400", "text-gray-400");
                output.classList.add("text-red-400");
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
                output.classList.remove("text-red-400", "text-gray-400");
                output.classList.add("text-green-400");
            }
        }
        
    }

    // Get the initial placeholder values
    const input = document.getElementById("input");
    const output = document.getElementById('output');
    const picked_word = get_random(res);
    input.setAttribute("placeholder", picked_word.fields.Simple);
    output.innerHTML = picked_word.fields["Concise1"];
    output.classList.add("text-gray-500");
    

    // Get a random word pair when the button is pressed
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
})()