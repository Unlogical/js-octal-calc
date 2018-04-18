"use strict";

document.addEventListener("DOMContentLoaded", ready);

var paranthesesFlag = 0;

function isBinaryOperator(character) {
    return (character == "+" || character == "×" || character == "÷" || character == "-");
}

function isUnaryPreOperator(character) {
	return (character == "~" || character == "√" );
}

function isUnaryPostOperator(character) {
	return (character == "²" || character == "³" || character == "!" || character == "%");
}

function isDigit(character) {
	return (parseInt(character) < 10 && parseInt(character) >= 0 || character == "∞");
}

function isUnaryOperator(character) {
	return (isUnaryPostOperator(character) || isUnaryPreOperator(character));
}

function isOperator(character) {
	return (isBinaryOperator(character) || isUnaryOperator(character));
}

function hasPoint(currentString) {
  var numbers = currentString.split(/\+|\-|\×|\÷|\√|\²/g);
  var number = numbers[numbers.length - 1];
  return (number.indexOf(".") != -1);
}

function changeFontSize(input, currentString){
  if (currentString.length >= 15) {
      input.style.fontSize = "0.9rem";
    } else if (currentString.length >= 10) {
      input.style.fontSize = "1.5rem";
    } else {
      input.style.fontSize = "2.5rem";
    }
}

function isEmptyLike(currentString) {
	var lastChar = currentString[currentString.length - 1];
	return (currentString == "" || lastChar == "(");
}

function hasLastUnMinus(currentString){
	var lastChar = currentString[currentString.length - 1];
	var preLastChar =  currentString[currentString.length - 2]; 
	return (lastChar == "-" && (preLastChar === undefined || preLastChar == "("))
}

function changeMinuses(inputString) {
	if (inputString[0] == "-") {
		inputString = "~" + inputString.slice(1);
	}
	for (var i = 0; i < inputString.length - 1; i++) {
		if (inputString[i] == "(" && inputString[i + 1] == "-") {
			inputString = inputString.substr(0, i+1) + "~" + inputString.slice(i+2);
		}
	}
	return inputString;
}

function removeTrashOperators(currentString) {
	var lastChar = currentString[currentString.length - 1];
	while(isBinaryOperator(lastChar) || isUnaryPreOperator(lastChar)) {
		currentString = currentString.replace(lastChar, "");
		lastChar = currentString[currentString.length - 1];
	}
	return currentString;
}


function isPossible(character, currentString) {
	var lastChar = currentString[currentString.length - 1];
	if (isDigit(character)) {
		return !(lastChar == ")" || isUnaryPostOperator(lastChar));
	}
	if(character == ".") {
		return (isDigit(lastChar) && !hasPoint(currentString));
	}
	if (character == "-") {
		return (isEmptyLike(currentString) || isDigit(lastChar) || isUnaryPostOperator(lastChar) || lastChar == ")");
	}
	if(isBinaryOperator(character)) {
		return(isDigit(lastChar) || isUnaryPostOperator(lastChar) || lastChar == ")");
	}
	if(isUnaryPreOperator(character)) {
		return (isEmptyLike(currentString) || isBinaryOperator(lastChar) && !(hasLastUnMinus(currentString)))
	}
	if(isUnaryPostOperator(character)) {
		return (isDigit(lastChar) || lastChar == ")");
	}
	if(character == "(") {
		if (isEmptyLike(currentString) || isBinaryOperator(lastChar) || isUnaryPreOperator(lastChar) || hasLastUnMinus(currentString)) {
			paranthesesFlag++;
			return true;
		}
		return false;
	}
	if(character == ")") {
		if (paranthesesFlag > 0 && (isDigit(lastChar) || isUnaryPostOperator(lastChar) || lastChar == ")")) {
			paranthesesFlag--;
			return true;
		}
		return false;
	}
}

function priority(operator) {
	switch (operator){
		case "(": return 1;
		case ")": return 1;
		case "+": return 2;
		case "-": return 2;
		case "×": return 4;
		case "÷": return 4;
		case "√": return 6;
		case "~": return 6;
		case "²": return 8;
		case "³": return 8;
		case "%": return 8;
		case "!": return 8;
	}
}
function changeNotation(currentString) {
	var stack = [];
	var output = [];
	var number = "";
	for (var i = 0; i < currentString.length; i++) {
		if (isDigit(currentString[i]) || currentString[i] == ".") {
			number += currentString[i];
			if(number != "" && (isOperator(currentString[i+1]) || currentString[i+1] === undefined || currentString[i+1] == ")")) {
				output.push(parseFloat(number));
				number = "";
			}
		} else if (currentString[i] == "(") {
			stack.push(currentString[i]);
		} else if (currentString[i] == ")") {
			var op = stack.pop();
			while (op != "(") {
				output.push(op);
				op = stack.pop();
			}
		} else if(isOperator(currentString[i])) {
			if (stack.length == 0 || priority(currentString[i]) > priority(stack[stack.length-1])) {
				stack.push(currentString[i]);
			} else {
          while (stack.length > 0 && priority(currentString[i]) <= priority(stack[stack.length-1])) {
				    var op = stack.pop();
				    output.push(op);
          }
				  stack.push(currentString[i]);
       } 
		}
 	}
 	while (stack.length > 0) {
    var op = stack.pop();
    output.push(op);
  }
  return output;
}

function factorial(number) {
  number = Math.floor(number);
  if (number <= 1) {
    return number;
  } else {
    return number * factorial(number - 1);;
  }
}

function performUnaryOperation(number, operator){
  number = parseFloat(number);
  switch (operator) {
    case "~": return -number;
    case "√": return Math.sqrt(number);
    case "²": return Math.pow(number, 2);
    case "³": return Math.pow(number, 3);
    case "!": return factorial(number);
    case "%": return number/100;
  }
}

function performBinaryOperation (a, b, operator) {
  a = parseFloat(a);
  b = parseFloat(b);
  switch (operator) {
    case "+": return a + b;
    case "-": return a - b;
    case "×": return a * b;
    case "÷": {
      if (b == 0) {
        if (a == 0) {
          console.log("unknown (0 divide by 0)")
          return "";
        } else {
          console.log("division by zero");
        }
      }
      return a / b;
    }
  }
}
function doCalculations(list) {
  for (var i = 0; i < list.length; i++) {
    if (isUnaryOperator(list[i])) {
      var result = performUnaryOperation(list[i-1], list[i]);
      list.splice(i-1, 2, result);
      i = 0;
    }
    if (isBinaryOperator(list[i])) {
      var result = performBinaryOperation(list[i-2], list[i-1], list[i]);
      list.splice(i-2, 3, result);
      i = 0;
    }
  }
  return list[0];
}

function searchForParanthesis(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == "(") {
      return i;
    }
  }
  return -1;
}

function removeTrashParantheses(currentString) {
  var flag = 0;
  var paranthesesIds = [];
  var arr = currentString.split("");
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == "(") {
      flag++;
      paranthesesIds.push(i);
    } 
    if (arr[i] ==")") {
      flag--;
      paranthesesIds.pop();
    }
  }
  while (flag > 0) {
    var index = paranthesesIds.pop();
    arr.splice(index, 1);
    flag--;
  }
  return arr.join("");
}

function parseDecimal(str) {
  var dotIndex = str.indexOf(".");
  var number = 0;
  if (dotIndex == -1) {
    return parseInt(str, 8);
  } else {
      var intPart = str.substring(0, dotIndex);
      var fractPart = str.substring(dotIndex +1);
      var maxPow = intPart.length - 1;
      str = intPart + fractPart;
      for (var i = 0; i < str.length; i++) {
        number += str[i] * Math.pow(8, maxPow-i); 
      }
  }
  return number;
}

function changeScaleToDecimal(inputString) {
  var outputString = "";
  var number = "";
  for (var i = 0; i < inputString.length; i++) {
    if(inputString[i] == "." || isDigit(inputString[i])) {
      number += inputString[i];
    } else if (isOperator(inputString[i]) || inputString[i] == "(" || inputString[i] == ")") {
      outputString += parseDecimal(number) + inputString[i];
      number = "";
    }
  }
  outputString += parseDecimal(number);
  return outputString;
}

function fractOctal(number) {
  var a = number -  Math.floor(number);
  var b = "0.";
  while (a > 0) {
    var c = a * 8;
    b += Math.floor(c);
    a = c - Math.floor(c);
  }
  return b;
}

function intOctal(number) {
  var a = Math.floor(number);
  var b = [];
  number = "";
  while (a >= 8) {
    var c = Math.floor(a / 8);
    b.push(a % 8);
    a = c; 
  }
  b.push(a);
  while (b.length > 0) {
    number += b.pop();
  }
  return number;
}

function changeScaleToOctal(number) {
  if (!isFinite(number)) {
    return "∞";
  }
  return +intOctal(number) + +fractOctal(number);
}

function clearString(inputString) {
  return removeTrashOperators(removeTrashParantheses(changeMinuses(inputString)));
}

function calculate(inputString) {
  return changeScaleToOctal(doCalculations(changeNotation(changeScaleToDecimal(clearString(inputString)))));
}


function ready(){
  var input = document.getElementById('input'),
    result = document.getElementById('result'), 
    clear = document.getElementById('clear'), 
    numbers = document.querySelectorAll('.numbers div'),
    operators = document.querySelectorAll('.operators div'),
    resultDisplayed = false; 

    for (var i = 0; i < numbers.length; i++) {
      numbers[i].addEventListener("click", function(e){
        var number = e.target.innerHTML;
        var currentString = input.innerHTML;
        var lastChar = currentString[currentString.length - 1];
        if (isPossible(number, currentString)) {
          if (resultDisplayed) {
            input.innerHTML = "";
            resultDisplayed = false;
          }
          if(number != ".") {
            changeFontSize(input, currentString+number);
            input.innerHTML += number;
          } else {
            changeFontSize(input, currentString+"0.");
            input.innerHTML +="0.";
          } 
        } else if (number == "." && (isEmptyLike(currentString) || isBinaryOperator(lastChar))) {
          changeFontSize(input, currentString+"0.");
          input.innerHTML +="0.";
        }
      })
    }

    for (var i =0; i < operators.length; i++){
      operators[i].addEventListener("click", function(e){
        var operator = e.target.innerHTML;
        operator = operator.replace("x", "");
        var currentString = input.innerHTML;
          var lastChar = currentString[currentString.length - 1];
          if(isPossible(operator, currentString)) {
            if (resultDisplayed) {
              resultDisplayed = false;
            }
            changeFontSize(input, currentString+operator);
            input.innerHTML +=operator;
          } else if (isBinaryOperator(operator) && isBinaryOperator(lastChar) && !hasLastUnMinus(currentString)
            || isUnaryPostOperator(operator) && (isUnaryPostOperator(lastChar) || hasLastUnMinus(currentString))) {
            currentString = currentString.substring(0, currentString.length - 1);
            input.innerHTML = currentString;
            changeFontSize(input, currentString+operator);
            input.innerHTML +=operator;
          }
      })
    }

    result.addEventListener("click", function(e) {
      var inputString = input.innerHTML;
      var outcome = calculate(inputString);
      changeFontSize(input, String(outcome));
      input.innerHTML = outcome;
      resultDisplayed = true; 
    })

    clear.addEventListener("click", function(e) {
      input.innerHTML = "";
      paranthesesFlag = 0;
    })

    deleteLast.addEventListener("click", function(e) {
      input.innerHTML = input.innerHTML.substr(0, input.innerHTML.length - 1);
    })
}

