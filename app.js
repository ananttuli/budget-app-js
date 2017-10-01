/**
 * Budget Controller - Model
 */
var budgetController = (function(){
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        }
    }

    return{
        addItem: function(typ, des, val){
            var addedItem;
            if(data.allItems[typ].length >0)
            ID = data.allItems[typ][data.allItems[typ].length-1].id + 1;
            else
            ID = 0;
            if(typ == 'inc'){
                addedItem = new Income(ID, des, val);
            }else if(typ == 'exp'){
                addedItem = new Expense(ID, des, val);
            }

            data.allItems[typ].push(addedItem);
            return addedItem;
        },
        testing: function(){
            console.log(data);
        }
    }
})();

/**
 * UI Handler
 */
var UIController = (function(){
    var DOMStrings = {
        addedDesc:'.add__description',
        addedValue:'.add__value',
        addedType:'.add__type',
        addBtn:'.add__btn',
        incomesContainer:'.income__list',
        expensesContainer:'.expenses__list'
        
    }
   
    function incomeStringBuilder(item){
        var html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        var h1 = html.replace('%id%', item.id);
        var h2 = h1.replace('%description%', item.description);
        var h3 = h2.replace('%value%', item.value);
        return h3;
    }
    function expenseStringBuilder(item){
        var html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        var h1 = html.replace('%id%', item.id);
        var h2 = h1.replace('%description%', item.description);
        var h3 = h2.replace('%value%', item.value);
        return h3;
    }
    return{
        getInput:function(){
            var addedDesc = document.querySelector(DOMStrings.addedDesc).value;
            var addedValue = parseFloat(document.querySelector(DOMStrings.addedValue).value);
            var addedType = document.querySelector(DOMStrings.addedType).value;
            return {description:addedDesc, value:addedValue, type:addedType};
        },
        getDOMStrings: function(){
            return DOMStrings;
        },
        addListItem: function(item, type){
            var html, el;
        
            if(type == 'exp'){
                el = DOMStrings.expensesContainer;
                html = expenseStringBuilder(item);
            }else if(type == 'inc'){
                el = DOMStrings.incomesContainer;
                html = incomeStringBuilder(item); 
            }

            document.querySelector(el).insertAdjacentHTML('beforeend', html);
    
        
        },
        clearFields: function(){
            var fieldsArr;
            var fields = document.querySelectorAll(DOMStrings.addedDesc + ',' + DOMStrings.addedValue);
            console.log('fields list :');
            console.log(fields);
            console.log('fields array:');
            fieldsArr = Array.prototype.slice.call(fields);
            console.log(fieldsArr);
            fieldsArr.forEach(function(current, i, array){
                current.value = "";
            });
            fieldsArr[0].focus();
        }

        


    }

})();

/**
 * App Controller
 */
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){
        var UIDom = UICtrl.getDOMStrings();
        document.querySelector(UIDom.addBtn).addEventListener('click', ctrlAddItem);
        
            document.addEventListener('keypress', function(e){
                if(e.keyCode == 13 || e.which == 13){
                    ctrlAddItem();
                }
            });
        
    };
    
    var updateBudget = function(){
        //1. Calculate budget
        //2. return budget
        //3. Display budget on UI
    }

    var ctrlAddItem = function(){
        var input, newItem;
        //TODO
        //1. Get field input value
        //2. Add item to budget controller
        //3. Add item to UI

       input = UICtrl.getInput();
       if(!isNaN(input.value) && input.value != "" && (input.value > 0) && input.description !== ""){
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        UICtrl.addListItem(newItem, input.type);
            //clear the fields
            UICtrl.clearFields();
        
            // Calculate and update budget
            updateBudget();
       }
    };

    return{
        init: function(){
            setupEventListeners();
        }
    }
    
})(budgetController, UIController);

controller.init();