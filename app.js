/**
 * Budget Controller - Model
 */
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round(this.value / totalIncome * 100);
        } else {
            this.percentage = -1;
        }

    }

    Expense.prototype.getExpensePercentage = function () {
        return this.percentage;
    }
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
        return sum;
    }
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: function (typ, des, val) {
            var addedItem;
            if (data.allItems[typ].length > 0)
                ID = data.allItems[typ][data.allItems[typ].length - 1].id + 1;
            else
                ID = 0;
            if (typ == 'inc') {
                addedItem = new Income(ID, des, val);
            } else if (typ == 'exp') {
                addedItem = new Expense(ID, des, val);
            }

            data.allItems[typ].push(addedItem);
            return addedItem;
        },
        deleteItem: function (type, ID) {
            var idArray = data.allItems[type].map(function (current) {
                return current.id;
            });

            var index = idArray.indexOf(ID);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },
        calculateBudget: function () {
            //calculate total income, expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate budget: Income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate expense percentage
            if (data.totals.inc > 0) {
                data.percentage = (data.totals.exp / data.totals.inc) * 100;
            } else {
                data.percentage = -1;
            }
        },
        calculatePercentages: function () {

            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);

            });
        },
        getExpensePercentages: function () {

            var eps = data.allItems.exp.map(function (cur) {
                return cur.getExpensePercentage();
            });
            return eps;
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function () {
            console.log(data);
        }
    }
})();

/**
 * UI Handler
 */
var UIController = (function () {
    var DOMStrings = {
        addedDesc: '.add__description',
        addedValue: '.add__value',
        addedType: '.add__type',
        addBtn: '.add__btn',
        incomesContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    }

    var formatNumber = function (num, type) {
        var finalNumber, splitNum, integerPart, sign;
        finalNumber = Math.abs(num);
        finalNumber = finalNumber.toFixed(2);
        splitNum = finalNumber.split('.');
        // integer part splitNum[0], decimal part splitNum[1]
        integerPart = splitNum[0];

        if (integerPart.length > 3) {
            integerPart = integerPart.substr(0, integerPart.length - 3) + ',' + integerPart.substr(integerPart.length - 3, integerPart.length);
        }

        sign = (type == 'exp') ? '-' : '+';

        return sign + ' ' + integerPart + '.' + splitNum[1];
    };

    function incomeStringBuilder(item) {
        var html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        var h1 = html.replace('%id%', item.id);
        var h2 = h1.replace('%description%', item.description);
        var h3 = h2.replace('%value%', formatNumber(item.value, 'inc'));
        return h3;
    }
    function expenseStringBuilder(item) {
        var html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        var h1 = html.replace('%id%', item.id);
        var h2 = h1.replace('%description%', item.description);
        var h3 = h2.replace('%value%', formatNumber(item.value, 'exp'));
        return h3;
    }
    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    return {
        getInput: function () {
            var addedDesc = document.querySelector(DOMStrings.addedDesc).value;
            var addedValue = parseFloat(document.querySelector(DOMStrings.addedValue).value);
            var addedType = document.querySelector(DOMStrings.addedType).value;
            return { description: addedDesc, value: addedValue, type: addedType };
        },
        getDOMStrings: function () {
            return DOMStrings;
        },
        addListItem: function (item, type) {
            var html, el;

            if (type == 'exp') {
                el = DOMStrings.expensesContainer;
                html = expenseStringBuilder(item);
            } else if (type == 'inc') {
                el = DOMStrings.incomesContainer;
                html = incomeStringBuilder(item);
            }

            document.querySelector(el).insertAdjacentHTML('beforeend', html);


        },
        deleteListItem: function (selectorID) {
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);

        },
        clearFields: function () {

            var fields = document.querySelectorAll(DOMStrings.addedDesc + ',' + DOMStrings.addedValue);

            var fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, i, array) {
                current.value = "";
            });
            fieldsArr[0].focus();
        },
        displayBudget: function (obj) {
            var type = (obj.budget > 0) ? 'inc' : 'exp';

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage.toFixed(2) + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '-';
            }
        },
        displayExpensePercentages: function (percentages) {
            var plabels = document.querySelectorAll(DOMStrings.expensesPercLabel);
            //returns nodeList


            nodeListForEach(plabels, function (cur, i) {
                if (percentages[i] > 0) {
                    cur.textContent = percentages[i] + '%';
                } else {
                    cur.textContent = '-';
                }

            });
        },
        displayDate: function () {
            var now, months;
            months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];

            now = new Date();
            document.querySelector(DOMStrings.dateLabel).textContent = months[now.getMonth()] + ' ' + now.getFullYear();

        },
        changedType: function () {
            var textFields = document.querySelectorAll(DOMStrings.addedType + ',' +
                DOMStrings.addedDesc + ',' +
                DOMStrings.addedValue);
            //returns nodeList

            nodeListForEach(textFields, function(cur){
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.addBtn).classList.toggle('red');
        }




    }

})();

/**
 * App Controller
 */
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var UIDom = UICtrl.getDOMStrings();
        document.querySelector(UIDom.addBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (e) {
            if (e.keyCode == 13 || e.which == 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(UIDom.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(UIDom.addedType).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function () {
        //1. Calculate budget
        //2. return budget
        //3. Display budget on UI
        budgetCtrl.calculateBudget();
        var budget = budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);


    }

    var updatePercentages = function () {
        //1. Calculate the percentages
        budgetCtrl.calculatePercentages();
        //2. Read from budget controller
        var expensePercentages = budgetCtrl.getExpensePercentages();
        UICtrl.displayExpensePercentages(expensePercentages);
        //3. Update UI with new percs
    }
    var ctrlAddItem = function () {
        var input, newItem;
        //TODO
        //1. Get field input value
        //2. Add item to budget controller
        //3. Add item to UI

        input = UICtrl.getInput();
        if (!isNaN(input.value) && input.value != "" && (input.value > 0) && input.description !== "") {
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            UICtrl.addListItem(newItem, input.type);
            //clear the fields
            UICtrl.clearFields();

            // Calculate and update budget
            updateBudget();
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function (event) {
        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        var splitID, type;
        if (itemID) {
            //E.g.inc-1
            itemArr = itemID.split('-');

            type = itemArr[0];
            splitID = parseInt(itemArr[1]);

            budgetCtrl.deleteItem(type, splitID);

            //delete the item from ds

            //delete from UI
            UICtrl.deleteListItem(itemID);
            //update and recalculate budget
            updateBudget();
            updatePercentages();
            //update UI
        }
    }

    return {
        init: function () {
            setupEventListeners();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });

            UICtrl.displayDate();
        }
    }

})(budgetController, UIController);

controller.init();