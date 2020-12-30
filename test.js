function myfun (){
    let x = "*"
    let y = " "
    let treesize = 20
    let tree = ""
    let trunk = ""
    for (let i=0; i<treesize; i++){
        if (i>0){
             tree = tree + "\n"
        }
        tree = tree + y.repeat(treesize-i-1)+ x.repeat(2*i+1) + y.repeat(treesize-i-1) //+ "\n"
    }

    // console.log(tree.split('\n')[0].length)
    let idx = Math.floor(treesize/3) 
    if (idx % 2==0){
        ++idx
    }
    let l = (tree.split('\n')[0].length - idx)/2
 
    
    for (let i=0; i<idx; i++){
        trunk = trunk + y.repeat(l) + x.repeat(idx) + y.repeat(l) + '\n'
    }

    console.log(tree)
    console.log(trunk)

}

myfun()