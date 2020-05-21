let budgetControler= (function (){

	class Income {

		constructor(id,desc, value){

		this.id= id;
		this.desc= desc;
		this.value= value;
		}
	}

	class Expense {

		constructor(id,desc, value){
			
		this.id= id;
		this.desc= desc;
		this.value= value;
		}
	};

	let data= {

		allItems: {
			exp: [],
			inc: [],
		},

		totals: {
			exp: 0,
			inc: 0
		},

		budget: 0,
	};


	return {
		//function that will return the new item from user input. The new item will contain id, description and value
		getNewItem: function(type, desc, val){

			let newItem, ID;

			if(data.allItems[type].length > 0){
				ID= data.allItems[type][data.allItems[type].length-1].id+1; //calculating the next id- getting the id from the last element in the array and making it +1
			} else {
				ID= 0;
			}
			
			if(type==='exp'){

				newItem= new Expense(ID,desc, val);
			}
			else {
				newItem= new Income(ID,desc, val);
			}

			data.allItems[type].push(newItem);
			data.totals[type] = data.totals[type] + val; //calculating the totals for the specific array (exp or inc) in the Data object. 

			return newItem;
		}, 

		// function that will return the total for each Expanse and Income class
		calcBudget: function(type){
			if(data.allItems[type].length>0){
				let sum= 0;
				data.allItems[type].forEach((curr)=>{
				sum = sum+curr.value;
				data.totals[type]= sum;
			})
			} else {
				data.totals[type]= 0;
			}
		},  

		getData: function(){
			return data;
		},
		//function that will add a new HTML element as a chiled to either Income or Expense 
		getIncVsExp: function(type,obj){
			let html, newHTML, element;

			if(type ==='exp'){
				element= 'expense';
				html= '<div class="item_exp" id="exp-%id%"><h4>%desc%</h4><h4>%value%</h4><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>';
			}
			else {
				element= 'income';
				html= '<div class="item_inc" id="inc-%id%"><h4>%desc%</h4><h4>%value%</h4><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>';
			}

			newHTML= html.replace('%desc%', obj.desc);
			newHTML= newHTML.replace('%id%', obj.id);
			newHTML= newHTML.replace('%value%', obj.value);

			document.getElementById(element).insertAdjacentHTML('beforeend', newHTML);
		},

		calculateBuget: function(){

			 data.budget= data.totals.inc- data.totals.exp;
			 
		},
		//function that will remove the item from the data structure
		removeItem: function(type,id){
			let newArray= data.allItems[type].map(function(curr){
				return curr.id;
			});

			let ID= newArray.indexOf(id);

			if(ID !== -1){
				data.allItems[type].splice(ID,1);
			}
		}



	}

})();



let UIControler= (function (){

	let numberFormat= new Intl.NumberFormat('en-US',{
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2
	})

	return {
		//getting the info from user input
		getTheNewItem: function(){

			return {
			type: document.getElementById('select').value,
			desc: document.getElementById('desc').value,
			val: parseFloat(document.getElementById('value').value)
			}

		},

		//clear all input fields after a new item is added
		clearFields: function(){

			let fields=document.querySelectorAll('#desc, #value');

			let filedsArr=Array.from(fields);
			filedsArr.forEach(curr=>curr.value=''); 
				
			filedsArr[0].focus();
		},
		//updateing total exp and inc field as well as total budget
		updateFields: function(obj){
			document.getElementById('red').textContent=`Expense: ${numberFormat.format(obj.totals.exp)}`;
			document.getElementById('green').textContent=`Income: ${numberFormat.format(obj.totals.inc)}`;
			document.querySelector('.difference').textContent= numberFormat.format(obj.budget);
		},
		//remove selected HTML element
		deleteField: function(id){

			let el= document.getElementById(id);

			el.parentNode.removeChild(el);
	
		}

	}

})();



let Controler= (function (BudCRTL, UICRTL){

	let setUpEventListener= function(){
		document.getElementById('btn-start').addEventListener('click', function(){
			crtl();
		})

		document.querySelector('.items').addEventListener('click', ctrlDeleteItem);
	};

	let crtl= function(){
		//get the input from the UI
		let newItem= UICRTL.getTheNewItem();

		if(newItem.desc !== '') {

			if(newItem.val != 0 && !isNaN(newItem.val) ){

				//add new item to the data structure
				let input= BudCRTL.getNewItem(newItem.type, newItem.desc, newItem.val);
				
				//display newItem on the Income or Expense side 
				let addNewItem= BudCRTL.getIncVsExp(newItem.type, input);

				//clear the input fields
				let clear= UICRTL.clearFields();

				//calculate the budget
				BudCRTL.calculateBuget();

				//update fields
				UICRTL.updateFields(BudCRTL.getData());


			} else {
				alert('value must be a number and cannot be zero ');
			}

		}else{
			alert('description cannot be empty');
		}
		
		
	};

	let ctrlDeleteItem= function(event){
		let itemId= event.target.parentNode.parentNode.id;
		if(itemId && itemId !== 'income' && itemId !=='expense'){
			let splitId= itemId.split('-');
			let type=splitId[0];
			let Id= parseInt(splitId[1]);

			//deleting the item from data structure
			BudCRTL.removeItem(type,Id);


			//deleting the item from UI controler
			UICRTL.deleteField(itemId);

			//upadate budget
			BudCRTL.calcBudget(type);
			BudCRTL.calculateBuget();

			//update UI fields
			UICRTL.updateFields(BudCRTL.getData());

		}
	}


	return {
		init: function(){
			return setUpEventListener();
		}
	}


})(budgetControler, UIControler);

Controler.init();