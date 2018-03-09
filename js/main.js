function ExpenseModel() {

  //Encapsulated Map
  const expenseMap = new Map();

  return {

    add : function( inputObject, amount, date, description) {
      if ( inputObject && description && date && amount ) {

        const expenseObject = {
            dom: inputObject,
            date: date,
            amount: amount,
            hidden: false
        };

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

$("#ec-summary-submitbutton").click( function( e ) {
  const inputArray = controller.parseInputs();
  if ( inputArray ) {
    controller.addDataRow( inputArray );
  }
  controller.renderTotal();

});