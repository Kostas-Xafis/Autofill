let k = (ind) => `"Κωνσταντίνος${ind}": {"First_Name": "Κωνσταντίνος", "Last_Name": "Χαφής", "Phone": 6978096018, "Country": 86, "City": "Αθήνα", "Address_1": "Πλάτωνος 14","Job_Function": 18,"Company": "Hua Dit"},`

let big_string = "{"
for(let i = 0; i <= 10000; i++){
    big_string+= k(i);
}
big_string.trim()
big_string = big_string.slice(0, big_string.length-1);
big_string += "}"

const fs = require("fs")

fs.writeFileSync("./db/smthing.json", big_string)