function ExpenseModel() {

  const expenseMap = new Map();

  return {

    add : function( description, date, amount ) {
      if ( description && date && amount ) {

        const expenseObject = {
            date: date,
            amount: parseFloat(amount).toFixed(2);
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

    renderTotal : function() {
      console.log("Total!");
    },

    getMap : function() {
      return expenseMap;
    }
  }
}

const model = new ExpenseModel();

function parseInput() {

  const inputArray = [];
  let value;

  $.each( $("#ec-summary input"), function( key, element ) {
    value = $(element).val();
    inputArray.push(value);
  });

  return inputArray;

}


$("#ec-summary-submitbutton").click( function( e ) {
  const inputArray = parseInput();
  model.add( inputArray[0], inputArray[1], inputArray[2] );
  console.log( model.getMap() );
});