/**
 * Budget Controller - Model
 */
var budgetController = (function(){


})();

/**
 * UI Handler
 */
var UIController = (function(){
    var DOMStrings = {
        addedDesc:'.add__description',
        addedValue:'.add__value',
        addedType:'.add__type',
        addBtn:'.add__btn'
        
    }
   
    
    return{
        getInput:function(){
            var addedDesc = document.querySelector(DOMStrings.addedDesc).value;
            var addedValue = document.querySelector(DOMStrings.addedValue).value;
            var addedType = document.querySelector(DOMStrings.addedType).value;
            return {description:addedDesc, value:addedValue, type:addedType};
        },
        getDOMStrings: function(){
            return DOMStrings;
        }


    }

})();

/**
 * App Controller
 */
var controller = (function(budgetCtrl, UICtrl){
    var UIDom = UICtrl.getDOMStrings();
    var ctrlAddItem = function(){
        //TODO
        //1. Get field input value
        //2. Add item to budget controller
        //3. Add item to UI
        //4. Calculate the budget
        //5. Display budget on UI

       var input = UICtrl.getInput();
       console.log(input);
    }

    document.querySelector(UIDom.addBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(e){
        if(e.keyCode == 13 || e.which == 13){
            ctrlAddItem();
        }
    });

})(budgetController, UIController);