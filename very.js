var textClass = "border-2 text-center sm:text-3xl md:text-4xl lg:text-5xl font-bold font-serif";

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
        const response = await fetch("https://api.airtable.com/v0/appORCLNTiuF043RV/Database?api_key=keyTvRDFgxA3qsyDE", {
            method: "get",
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(response);
        const json = await response.json();

        /*json.then((value) => newprompts  = value)*/
        // console.log("Success:", JSON.stringify(json));
        return json["records"]
    } catch (error) {
        console.error("Error:", error);
    }
}
/*  callingFn().then((value) => var newprompts  = value)
  var newprompts = callingFn();
  console.log(newprompts[0])*/

(async () => {
    var res = await callingFn();
    console.log(res);

    async function fetch_concise_adjective(results, random=false) {
        const output = document.getElementById('output');
        const simple = document.getElementById('input').value.toUpperCase();
        var picked_prompt;
        if (random) {
            picked_prompt = get_random(results);
            document.getElementById('input').value = picked_prompt.fields.Simple;
        } else 
            picked_prompt = get_result(results, simple);
        if (picked_prompt == undefined) {
            output.innerHTML = "Not Yet Added";
            // Make the text red
            output.setAttribute("class", textClass + " text-red-400");
        } else {
            // There are multiple options for many of the adjectives
            // Each time we should get a random option
            const numOptions = Object.keys(picked_prompt.fields).length - 1;
            const selection = Math.floor(Math.random() * numOptions) + 1;
            output.innerHTML = picked_prompt["fields"]["Concise"+selection]; // The fields are labels 'Concise1' 'Concise2' etc...
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

    document.body.onkeyup = function(e){
      if(e.keyCode == 13){
          fetch_concise_adjective(res);
      }
    }
  })()