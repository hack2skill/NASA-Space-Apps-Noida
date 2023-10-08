const quizData = [{
        question: "The water cycle is the continuous movement of water on, above, and below the Earth's surface. What is another term for the water cycle?",
        a: "Hydrology",
        b: "Hydraulics",
        c: "Hydrogen",
        d: "Hydrologic",
        correct: "a",
    },
    {
        question: "Aquifers are categorized as either unconfined or confined based on what characteristic?",
        a: "Depth",
        b: "Permeability",
        c: "Pressure",
        d: "Saturation",
        correct: "c",
    },
    {
        question: "In the water cycle, water evaporates from Earth's surface and rises into the atmosphere. What is this process called?",
        a: "Precipitation",
        b: "Infiltration",
        c: "Evaporation",
        d: "Condensation",
        correct: "c",
    },
    {
        question: "When water vapour in the atmosphere cools and changes back into liquid water or ice, it forms tiny water droplets or ice crystals. What is this process known as in the water cycle?",
        a: "Transpiration",
        b: "Evaporation",
        c: "Condensation",
        d: "Precipitation",
        correct: "c",
    },
    {
        question: "How does increased atmospheric CO2 contribute to climate change?",
        a: "Causes global warming by trapping heatration",
        b: "Leads to global cooling",
        c: "Has no impact on climate",
        d: "Influences magnetic fields",
        correct: "a",
    },
    {
        question: "What natural process removes CO2 from the atmosphere, mitigating climate change?",
        a: "Fossil fuel combustion",
        b: "Deforestation",
        c: "Volcanic eruptions",
        d: "Photosynthesis by plants and phytoplankton",
        correct: "d",
    }
];
let index = 0;
let correct = 0,
    incorrect = 0,
    total = quizData.length;
let questionBox = document.getElementById("questionBox");
let allInputs = document.querySelectorAll("input[type='radio']")
const loadQuestion = () => {
    if (total === index) {
        return quizEnd()
    }
    reset()
    const data = quizData[index]
    questionBox.innerHTML = `${index + 1}) ${data.question}`
    allInputs[0].nextElementSibling.innerText = data.a
    allInputs[1].nextElementSibling.innerText = data.b
    allInputs[2].nextElementSibling.innerText = data.c
    allInputs[3].nextElementSibling.innerText = data.d
}

document.querySelector("#submit").addEventListener(
    "click",
    function() {
        const data = quizData[index]
        const ans = getAnswer()
        if (ans === data.correct) {
            correct++;
        } else {
            incorrect++;
        }
        index++;
        loadQuestion()
    }
)

const getAnswer = () => {
    let ans;
    allInputs.forEach(
        (inputEl) => {
            if (inputEl.checked) {
                ans = inputEl.value;
            }
        }
    )
    return ans;
}

const reset = () => {
    allInputs.forEach(
        (inputEl) => {
            inputEl.checked = false;
        }
    )
}

const quizEnd = () => {
    // console.log(document.getElementsByClassName("container"));
    document.getElementsByClassName("container")[0].innerHTML = `
        <div class="col">
            <h3 class="w-100"> Hii, you've scored ${correct} / ${total} </h3>
        </div>
    `
}
loadQuestion(index);