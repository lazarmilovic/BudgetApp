import Income from "./js/modules/Income";
import Expense from "./js/modules/Expense";
import { data } from "./js/data";

const budgetControler = (function () {
  return {
    //function that will return the new item from user input. The new item will contain id, description and value
    getNewItem: (type, desc, val) => {
      let newItem, ID;

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1; //calculating the next id- getting the id from the last element in the array and making it +1
      } else {
        ID = 0;
      }

      if (type === "exp") {
        newItem = new Expense(ID, desc, val);
      } else {
        newItem = new Income(ID, desc, val);
      }

      data.allItems[type].push(newItem);
      data.totals[type] = data.totals[type] + val; //calculating the totals for the specific array (exp or inc) in the Data object.

      return newItem;
    },

    // function that will return the total for each Expanse and Income class
    calcBudget: (type) => {
      if (data.allItems[type].length > 0) {
        let sum = 0;
        data.allItems[type].forEach((curr) => {
          sum = sum + curr.value;
          data.totals[type] = sum;
        });
      } else {
        data.totals[type] = 0;
      }
    },

    getData: () => {
      return data;
    },
    //function that will add a new HTML element as a chiled to either Income or Expense
    getIncVsExp: function (type, obj) {
      let html, newHTML, element;

      if (type === "exp") {
        element = "expense";
        html =
          '<div class="item_exp" id="exp-%id%"><h4>%desc%</h4><h4>%value%</h4><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>';
      } else {
        element = "income";
        html =
          '<div class="item_inc" id="inc-%id%"><h4>%desc%</h4><h4>%value%</h4><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>';
      }

      newHTML = html.replace("%desc%", obj.desc);
      newHTML = newHTML.replace("%id%", obj.id);
      newHTML = newHTML.replace("%value%", obj.value);

      document.getElementById(element).insertAdjacentHTML("beforeend", newHTML);
    },

    calculateBuget: () => {
      data.budget = data.totals.inc - data.totals.exp;
    },
    //function that will remove the item from the data structure
    removeItem: function (type, id) {
      let newArray = data.allItems[type].map(function (curr) {
        return curr.id;
      });

      let ID = newArray.indexOf(id);

      if (ID !== -1) {
        data.allItems[type].splice(ID, 1);
      }
    },
  };
})();

export default budgetControler;
