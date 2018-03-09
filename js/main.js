function ExpenseModel( map ) {

  //Private Variables
  const expenseMap = loadFromCache();
  const expenseObjectArray = JSON.parse(localStorage.getItem("expenseArray")) || [];

  //Private Methods
  function loadFromCache() {
    if ( localStorage.length == 0 ) {
      return new Map();
    } else {

      const expenseMap = new Map();
      const expenseObjectArray = JSON.parse( localStorage.getItem("expenseArray") );
      let description = null;
      expenseObjectArray.forEach(function( expenseObject ) {
        description = expenseObject.description;
        if ( expenseMap.has( description ) ) {
          expenseMap.get( description ).push( expenseObject );
        } else {
          const expenseArray = [];
          expenseArray.push( expenseObject );
          expenseMap.set( description, expenseArray );
        }
      })
      return expenseMap;
    }
  }

  return {

    //Public Methods
    add : function( inputObject, amount, date, description) {
      if ( inputObject && description && date && amount ) {

        const expenseObject = {
            dom: inputObject,
            description: description,
            date: date,
            amount: amount,
            hidden: false
        };

        expenseObjectArray.push(expenseObject);
        localStorage.setItem("expenseArray", JSON.stringify(expenseObjectArray));

        if ( expenseMap.has( description ) ) {
          expenseMap.get( description ).push( expenseObject );
        } else {
          const expenseArray = [];
          expenseArray.push( expenseObject );
          expenseMap.set( description, expenseArray );
        }


      }
    },

    getTotal : function() {
      let totalBalance = 0;
      expenseMap.forEach( function ( value, key ) {
        value.forEach( function( expenseObject ) {
          totalBalance += parseFloat(expenseObject.amount);
        });
      });
      return totalBalance.toFixed(2);
    },

    getMap : function() {
      return expenseMap;
    }
  }
}

function ExpenseController( model ) {

  //Prviate Methods
  function renderFromCache( model ) {
    const map = model.getMap();
    if ( map.size != 0 ) {

      map.forEach(function(value, key) {
        value.forEach(function ( expenseObject ) {
          const inputObject = $("#ec-activitiy-table-tbody").append(
            "<tr>" +
            "<td>" + expenseObject.description + "</td>" +
            "<td>" + expenseObject.date + "</td>" +
            "<td>" + expenseObject.amount.toFixed(2) + "</td>" +
            "</tr>"
          );          
        });
      });
    }
  }

  renderFromCache( model );

  return {

    parseInputs: function() {
      let inputArray = [];
      let value = 0;

      $.each( $("#ec-summary input"), function( key, element ) {
        value = $(element).val();
        if ( value ) {
          inputArray.push(value);
        } else {
          inputArray = null;
          return null;
        }
      });

      return inputArray;
    },

    addDataRow: function( inputArray ) {
      const money = parseFloat(inputArray[0]);
      const inputObject = $("#ec-activitiy-table-tbody").append(
        "<tr>" +
        "<td>" + inputArray[2] + "</td>" +
        "<td>" + inputArray[1] + "</td>" +
        "<td>" + money.toFixed(2) + "</td>" +
        "</tr>"
      );
      model.add( inputObject, money, inputArray[1], inputArray[2] );      
    },

    renderTotal: function() {
      $("#ec-summary-balance").html("$" + model.getTotal());
    }

  }
}



const model = new ExpenseModel();
const controller = new ExpenseController( model );
controller.renderTotal();
//localStorage.clear();
console.log(localStorage);


$("#ec-summary-submitbutton").click( function( e ) {
  e.preventDefault();
  const inputArray = controller.parseInputs();
  if ( inputArray ) {
    controller.addDataRow( inputArray );
  }
  controller.renderTotal();

});