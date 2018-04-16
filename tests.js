
describe ("changeScale", function() {
	it ("переводит в десятичную систему счисления 16-3", function() {
		assert.equal(changeScaleToDecimal("16-3"), "14-3");
	});
	it ("переводит в десятичную систему счисления 16.76-3", function() {
		assert.equal(changeScaleToDecimal("16.76-3"), "14.96875-3");
	})
	it ("переводит в десятичную систему счисления 16.6-3", function() {
		assert.equal(changeScaleToDecimal("16.6-3"), "14.75-3");
	})
	it ("переводит в восьмеричную систему счисления 14", function() {
		assert.equal(changeScaleToOctal("14"), "16");
	});
	it ("переводит в восьмеричную систему счисления 14.75", function() {
		assert.equal(changeScaleToOctal("14.75"), "16.6");
	});
	it ("переводит в восьмеричную систему счисления 14.96875", function() {
		assert.equal(changeScaleToOctal("14.96875"), "16.76");
	})
})



describe ("changeNotation", function() {
	it("переводит в обратную польскую нотацию 2+2", function() {
		assert.equal(String(changeNotation("2+2")), "2,2,+");
	});
	it("переводит в обратную польскую нотацию (2+2)/2", function() {
		assert.equal(String(changeNotation("(2+2)÷2")), "2,2,+,2,÷");
	});
	it("переводит в обратную польскую нотацию 5²-(-3+100%)+(4-2)×8!", function() {
		assert.equal(String(changeNotation("5²-(~3+100%)+(4-2)×8!")), "5,²,3,~,100,%,+,-,4,2,-,8,!,×,+");
	});
	it("переводит в обратную польскую нотацию 8+4-56.8", function() {
		assert.equal(String(changeNotation("8+4-56.8")), "8,4,+,56.8,-");
	});
	it("переводит в обратную польскую нотацию -3×(√9×2³+20×50%÷2×(1+1))", function() {
		assert.equal(String(changeNotation("~3×(√9×2³+20×50%÷2×(1+1))")), "3,~,9,√,2,³,×,20,50,%,×,2,÷,1,1,+,×,+,×");
	});
	it("переводит в обратную польскую нотацию √9×2³+20", function() {
		assert.equal(String(changeNotation("√9×2³+20")), "9,√,2,³,×,20,+");
	});
});

describe("doCalculations", function() {
	it("вычисляет 2,2,+", function() {
		assert.equal(String(doCalculations([2,2,"+"])), "4");
	});
	it("вычисляет 2,2,+,2,÷", function() {
		assert.equal(String(doCalculations([2,2,"+",2,"÷"])), "2");
	});
	it("вычисляет 5,²,3,~,100,%,+,-,4,2,-,8,!,×,+", function() {
		assert.equal(String(doCalculations([5,"²",3,"~",100,"%","+","-",4,2,"-",8,"!","×","+"])), "80667");
	});
	it("вычисляет 8,4,+,56.8,-", function() {
		assert.equal(String(doCalculations([8,4,"+",56.8,"-"])), "-44.8");
	});
	it("вычисляет 3,~,9,√,2,³,×,20,50,%,×,2,÷,1,1,+,×,+,×", function() {
		assert.equal(String(doCalculations([3,"~",9,"√",2,"³","×",20,50,"%","×",2,"÷",1,1,"+","×","+","×"])), "-102");
	});
	it("вычисляет 9,√,2,³,×,20,+", function() {
		assert.equal(String(doCalculations([9,"√",2,"³","×",20,"+"])), "44");
	});
});

describe ("changeNotation and doCalculations", function() {
	it("вычисляет 2+2", function() {
		var changedNotation = changeNotation("2+2");
		assert.equal(doCalculations(changedNotation), 4);
	});
	it("вычисляет (2+2)/2", function() {
		var changedNotation = changeNotation("(2+2)÷2");
		assert.equal(doCalculations(changedNotation), 2);
	});
	it("вычисляет 5²-(-3+100%)+(4-2)×8!", function() {
		var changedNotation = changeNotation("5²-(~3+100%)+(4-2)×8!");
		assert.equal(doCalculations(changedNotation), 80667);
	});
	it("вычисляет 8+4-56.8", function() {
		var changedNotation = changeNotation("8+4-56.8");
		assert.equal(doCalculations(changedNotation), -44.8);
	});
	it("вычисляет -3×(√9×2³+20×50%÷2×(1+1))", function() {
		var changedNotation = changeNotation("~3×(√9×2³+20×50%÷2×(1+1))");
		assert.equal(doCalculations(changedNotation), -102);
	});
	it("вычисляет √9×2³+20", function() {
		var changedNotation = changeNotation("√9×2³+20");
		assert.equal(doCalculations(changedNotation), 44);
	});
});

describe ("change input string", function() {
	it("преобразует в нормальный вид 2+(2", function() {
		assert.equal(String(clearString("2+(2")), "2+2");
	});
	it("преобразует в нормальный вид 2+(2×", function() {
		assert.equal(String(clearString("2+(2")), "2+2");
	});
	it("преобразует в нормальный вид 2+(2×(", function() {
		assert.equal(String(clearString("2+(2×(")), "2+2");
	});
	it("преобразует в нормальный вид 2+(2×(((3", function() {
		assert.equal(String(clearString("2+(2×(((3")), "2+2×3");
	});
	it("преобразует в нормальный вид 2×((3+((2×((6))))", function() {
		assert.equal(String(clearString("2×((3+((2×((6))))")), "2×3+((2×((6))))");
	});
})
