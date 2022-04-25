function qs(selector, parent = document) {
    return parent.querySelector(selector);
}

const API = "https://mock-api.driven.com.br/api/v6/buzzquizz";
let inputQuizzData = "";
let basicInfoQuizz = [];

const screenChange = screen => {
    qs('.page.active').classList.remove('active');
    qs(`.${screen}`).classList.add('active');
    const stepTop = qs('.pages');
    stepTop.scrollIntoView({ block: "start", behavior: "smooth" });
}

//VERIFICAR A PARTIR DAQUI
const nextStep = step => {
    qs('.step.active').classList.remove('active');
    document.getElementById(`${step}`).classList.add('active');
    const stepTop = qs('.pages');
    stepTop.scrollIntoView({ block: "start", behavior: "smooth" });
}

const createQuizz = object => axios.post(API + "/quizzes", object);

const getQuizzes = () => axios.get(API + "/quizzes");

const isURL = (url) => url.includes('http');

function checkBasicData(input) {
    const charQty = input.value.length;

    if (input.name === "quizz-title") {
        if (charQty < 20 || charQty > 65)
            return false;
        return true;
    }
    if (input.name === "qty-questions") {
        if (Number(input.value) < 3)
            return false;
        return true;
    }
    if (input.name === "qty-levels") {
        if (Number(input.value) < 2)
            return false;
        return true;
    }
    return isURL(input.value);
}

function checkQuestionData(input) {
    const charQty = input.value.length;
    let isHex = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i;
    if (input.name === "question-text") {
        if (charQty < 20)
            return false;
        return true;
    }
    if (input.name === "question-color") {
        return isHex.test(input.value);
    }
    return isURL(input.value);
}

const formValidation = (input) => {
    const parentId = input.parentElement.parentElement.parentElement.id;
    let isValid = false;

    if (input.value !== "") {
        input.classList.remove("error");
        if (parentId === "1") {
            isValid = checkBasicData(input);
        }
        if (parentId === "2") {
            isValid = checkQuestionData(input);
        }
        if (parentId === "3") {
            isValid = checkLevelData(input)
        }
        if (isValid) {
            return input.value;
        }
    }
    if (input.name === "answer") {
        return {answer: input.value};
    }
    input.classList.add("error");
}

function isEmpty(arr) {
    return arr.every(element => element);
}

function createQuizzQuestionsInput(numberInput) {
    inputQuizzData = document.querySelector(".addhere");
    inputQuizzData.innerHTML = "";
    for (let i = 0; i < numberInput; i++) {
        let questionNumber = i + 1;
        inputQuizzData.innerHTML += `
        <div onclick="openQuestionInput(this)" class="form-container questionNumber${questionNumber}">
            <div class="form-content">
                <div class="question-top">
                    <label for="question">Pergunta ${questionNumber}</label>
                    <img src="./Images/edit-icon.svg" alt="">
                </div>
                <div class="textAreaInput hide">
                    <input name="question-text" type="text" placeholder="Texto da pergunta">
                    <input name="question-color" type="text" placeholder="Cor de fundo da pergunta">
                    <label for="question">Resposta correta</label>
                    <input type="text" placeholder="Resposta correta">
                    <input name="url" type="text" placeholder="URL da imagem">
                    <label for="question">Respostas incorretas</label>
                    <input name="answer" type="text" placeholder="Resposta incorreta 1">
                    <input name="url" type="text" placeholder="URL da imagem 1">
                    <input name="answer" type="text" placeholder="Resposta incorreta 2">
                    <input name="url" type="text" placeholder="URL da imagem 2">
                    <input name="answer" type="text" placeholder="Resposta incorreta 3">
                    <input name="url" type="text" placeholder="URL da imagem 3">       
                </div>
            </div>
        </div>
        `;
    }
    openQuestionInput(document.querySelector(".questionNumber1"));
    console.log("foi");
}

function openQuestionInput(object) {
    let allTextAreas = document.querySelectorAll(".textAreaInput");
    for (let i = 0; i < allTextAreas.length; i++) {
        allTextAreas[i].classList.add("hide");
    }
    let textAreaInput = object.querySelector(".textAreaInput");
    textAreaInput.classList.remove("hide");
    object.querySelector(".question-top").scrollIntoView({ block: "center", behavior: "smooth" });
}

function createQuizzHandler() {
    const activeStep = qs(".step.active");
    const formData = activeStep.querySelectorAll(".form-content input");
    const next = Number(activeStep.id) + 1;
    const validForm = [...formData].map(formValidation);
    console.log(validForm)
    if (isEmpty(validForm)) {
        for (let x = 0; x < validForm.length; x++) {
            basicInfoQuizz.push(validForm[x]);
        }
        const numberQuestions = Number(basicInfoQuizz[2]);
        createQuizzQuestionsInput(numberQuestions);
        nextStep(next);
        return
    }
    alert("Algo deu errado! Tente novamente!");
}
