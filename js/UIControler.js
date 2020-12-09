import { Dom } from "./Dom";

//this function will handle all user-related activities
const UIControler = (function () {
  let numberFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return {
    //getting the info from user input
    getTheNewItem: () => {
      return {
        type: Dom.select.value,
        desc: Dom.desc.value,
        val: parseFloat(Dom.value.value),
      };
    },

    //clear all input fields after a new item is added
    clearFields: () => {
      let filedsArr = Array.from(Dom.fields);
      filedsArr.forEach((curr) => (curr.value = ""));

      filedsArr[0].focus();
    },

    //update total exp and inc field as well as total budget
    updateFields: (obj) => {
      Dom.red.textContent = `Expense: ${numberFormat.format(obj.totals.exp)}`;
      Dom.green.textContent = `Income: ${numberFormat.format(obj.totals.inc)}`;
      Dom.diff.textContent = numberFormat.format(obj.budget);
    },
    //remove selected HTML element
    deleteField: (id) => {
      let el = document.getElementById(id);

      el.parentNode.removeChild(el);
    },
  };
})();
