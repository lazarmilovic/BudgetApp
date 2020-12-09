import Income from "./js/modules/Income";
import Expense from "./js/modules/Expense";
import { data } from "./js/data";
import { budgetControler } from "./js/budgetControler";
import Dom from "./js/Dom";

const Controler = (function (BudCRTL, UICRTL) {
  const setUpEventListener = () => {
    Dom.start.addEventListener("click", () => {
      crtl();
    });

    Dom.items.addEventListener("click", ctrlDeleteItem);
  };

  const crtl = () => {
    //get the input from the UI
    let newItem = UICRTL.getTheNewItem();

    if (newItem.desc !== "") {
      if (newItem.val != 0 && !isNaN(newItem.val)) {
        //add new item to the data structure
        let input = BudCRTL.getNewItem(newItem.type, newItem.desc, newItem.val);

        //display newItem on the Income or Expense side
        let addNewItem = BudCRTL.getIncVsExp(newItem.type, input);

        //clear the input fields
        let clear = UICRTL.clearFields();

        //calculate the budget
        BudCRTL.calculateBuget();

        //update fields
        UICRTL.updateFields(BudCRTL.getData());
      } else {
        alert("value must be a number and cannot be zero ");
      }
    } else {
      alert("description cannot be empty");
    }
  };

  const ctrlDeleteItem = (event) => {
    let itemId = event.target.parentNode.parentNode.id;
    if (itemId && itemId !== "income" && itemId !== "expense") {
      let splitId = itemId.split("-");
      let type = splitId[0];
      let Id = parseInt(splitId[1]);

      //deleting the item from data structure
      BudCRTL.removeItem(type, Id);

      //deleting the item from UI controler
      UICRTL.deleteField(itemId);

      //upadate budget
      BudCRTL.calcBudget(type);
      BudCRTL.calculateBuget();

      //update UI fields
      UICRTL.updateFields(BudCRTL.getData());
    }
  };

  return {
    init: () => {
      return setUpEventListener();
    },
  };
})(budgetControler, UIControler);

Controler.init();
