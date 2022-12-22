get_random = function (list) {
  return list[Math.floor(Math.random() * list.length)];
};

get_result = function (list, simple) {
  // Regex to trim whitespace and any periods at the beggining and end
  const simpleStr = simple.replace(/^[\s\.]+|[\s\.]+$|\.*/g, "");
  document.getElementById("input").value = simpleStr;
  const regex = new RegExp("^" + simpleStr + "$", "i");
  for (let i in list) {
    if (regex.test(list[i].fields.Simple)) {
      return list[i];
    }
  }
};

async function callingFn() {
  try {
    // Accessing airtable api with read-only key
    var done = false;
    var toReturn = [];
    var offset = "";

    // Airtable only allows 100 records per response so we do a while loop until it is done
    // when we do a request but don't get all of the data airtable includes an offset in the response
    while (!done) {
      var response = await fetch(
        `https://api.airtable.com/v0/appHLMobCaTLuVQQy/Data?api_key=keyoFYTwLB0vomKLC&offset=${offset}`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      var json = await response.json();
      toReturn.push(...json.records);
      if (json.hasOwnProperty("offset")) {
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
  let currentSimple;
  let matching_row;
  let conciseWords = [];
  let conciseWordsIndex = 0;
  async function fetch_concise_adjective(results, random = false) {
    window._klOnsite = window._klOnsite || [];
    window._klOnsite.push(["openForm", "YbLLqL"]);
    let output = document.getElementById("output");
    let simple = document.getElementById("input");
    // If input is empty tell user that there is no input
    if (simple.value === "" && !random) {
      output.innerHTML = "No Input";
      output.classList.remove("text-green-400", "text-gray-400");
      output.classList.add("text-red-400");
    } else {
      // Get matching row
      if (random) {
        conciseWords = [];
        conciseWordsIndex = 0;
        matching_row = get_random(results);
        simple.value = matching_row.fields.Simple;
        for (const prop in matching_row.fields) {
          if (prop !== "Simple") {
            conciseWords.push(matching_row.fields[prop]);
          }
        }
        shuffle(conciseWords);
      } else if (
        !output.classList.contains("text-green-400") ||
        currentSimple !== simple.value.toLowerCase()
      ) {
        conciseWords = [];
        conciseWordsIndex = 0;
        // this block is for getting for when users provides a new simple adjective
        matching_row = get_result(results, simple.value);
        if (matching_row !== undefined) {
          for (const prop in matching_row.fields) {
            if (prop !== "Simple") {
              conciseWords.push(matching_row.fields[prop]);
            }
          }
        }
        shuffle(conciseWords);
      } else {
        conciseWordsIndex = (conciseWordsIndex + 1) % conciseWords.length;
      }

      currentSimple = simple.value.toLowerCase();
      if (matching_row == undefined) {
        output.innerHTML = "Not Yet Added";
        // Make the text red
        output.classList.remove("text-green-400", "text-gray-400");
        output.classList.add("text-red-400");
      } else {
        output.innerHTML = conciseWords[conciseWordsIndex];
        output.classList.add("text-green-400");
      }
    }
  }

  // Get the initial placeholder values
  const input = document.getElementById("input");
  const output = document.getElementById("output");
  const picked_word = get_random(res);
  input.setAttribute("placeholder", picked_word.fields.Simple);
  output.innerHTML = picked_word.fields["Concise1"];
  output.classList.add("text-gray-400");

  // Get a random word pair when the button is pressed
  $(document).ready(function () {
    $("#random-word").click(function () {
      fetch_concise_adjective(res, true);
    });
  });

  // Fetch result when 'Get Result' button is pressed
  $(document).ready(function () {
    $("#get-result").click(function () {
      fetch_concise_adjective(res);
    });
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "Enter") fetch_concise_adjective(res);
  });

  output.addEventListener("click", () => {
    window.open(
      `https://www.dictionary.com/browse/${output.innerText}`,
      "_blank"
    );
  });
})();

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
