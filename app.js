
//BUDGET CONTROLLER
var budgetController = (function() {

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems.forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
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
    budget: 0
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      //CREATE NEW ID
      //[1,2,3,4,5]
      //if delete some, the array becomes [1,3,5,6,8]
      //to make sure there is no repetition, the id should always be (last id (in the array) + 1 )

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }



      //CREATE NEW ITEM BASED ON 'INC' OR 'EXP' TYPE
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      //PUSH IT INTO OUR DATA STRUCTURE
      data.allItems[type].push(newItem);

      //RETURN THE NEW ELEMENT
      return newItem;
    },

    calculateBudget: function() {
      //calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      //calculate the budget: income, expenses
      data.budget = data.totals.inc = data.totals.exp;

      //calculate the percentage
    },

    testing: function() {
      console.log(data);
    }

}

})();



//UI CONTROLLER
var UIController = (function() {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list'
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      }
    },

    addListItem: function(obj, type) {
      //create HTML string with placeholder text
      var html, newHtml, element;
      if (type === 'inc'){
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expenseContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //NOTES: SINGLE QUOTES VS DOUBLE QUOTES --> MAKE SURE DINSTINGUISH THE TWO WITHOUT OVERLAPS


      //replace the placeholder with real DATA
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      //insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },

    clearFields: function() {
      var field, fieldArr;
      field = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
      fieldArr = Array.prototype.slice.call(field);
      fieldArr.forEach(function(current, index, array){
        current.value = '';
      })
      fieldArr[0].focus();
    },

    getDOMstrings: function() {
      return DOMstrings;
    }

  }
})();


//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(e) {
      if (e.keyCode === 13) {
        ctrlAddItem();
      }
    });
  }

var updateBudget = function() {
  //calculate the budget

  //return the budget

  //display the budget

};

  var ctrlAddItem = function() {
    var input, newItem;

    //get the input data
    input = UICtrl.getInput();

    //make sure input only registers when it's not empty
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      //add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      console.log(input);
      //add the item to the UI & remove the input section
      UICtrl.addListItem(newItem, input.type);
      UICtrl.clearFields();

      //calculate and update budget
      updateBudget();
    }
  }

//public initialization function
  return {
    init: function() {
      setupEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();
