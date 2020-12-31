function myFun() {
    let arr = [];
    
    for(let i = 0; i < 10; i++){
          arr[i] = Math.random()*100;  
    }
    arr.sort(my_cmp_fun);

    /* shift: Remove the first element of the array
       unshift: Add an element to the front of the array
       pop: Remove the last element of the array
       push: Add an element to the end of the array    
       length: Outputs the length of the elements of the array but (Remind me to show you why it doesn't have parenthesis)
       sort: Sorts the array and swaps them depending on comparison function that you give it.
             Takes 2 elements of the array as Arguments and if the return value is > 0 it swaps the elements 

       Next-up: Slice, Filter, forEach, Find, Prototypes
    

       Note: Anonymous functions can be written like function(){} or () => {}. Either way they are the exact same
       reverse: Does what it says. No arguments

       slice:   RETURNS a specific part of the array.
                Takes 2 indexes as Arguments for the starting and end(-1) point of the part that you want to slice
                   (i.e. my_array = array.slice(0, 2) -> Returns the first 2 elements)

       filter:  RETURNS the elements of the array that satisfies a given statement
                Takes a callback function as Argument that returns true or false. 
                This function takes up to 3 Arguments (1:The i-th element of the array, 
                                                       2:The current index of the array as you loop through it
                                                       3:The actual array (a bit useless though))
                   (i.e. my_array = array.filter( function(elem, ind, arr) {
                                                    return elem > 10 && ind > 5 })
                   -> Returns all the elements of the array that are greater than 10 and have an index greater than 5)
       Note: You do not have to reference the (ind) and (arr) arguments since they are optional.

       forEach: It does a for-loop (But it is made in one line +).
                It has the same structure as filter but the callback function doesn't return anything

       find & : They RETURN the first value(1)-index(2) that satisfies a given statement
     findIndex: They both have the same structure as filter
                   (i.e. value (or) index = array.find(or).findIndex( (elem,val,arr) => {
                                                                 return elem > 15 })
                    -> Returns the value(1)-index(2) of the first element that is greater than 15)
    */
}
  
myFun()