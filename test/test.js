// a = [1,2,3,4,5];
// b = [4,7,9,10];
// c = [2,3,4,6,8];
//
//
// ojb = new Object();
// ojb[a[0]] = 1;
// ojb[a[1]] = 1;
// ojb[a[2]] = 1;
//
//
// console.log(ojb[a[5]]);
//
// d = a.concat(b).concat(c);
// console.log(d)
//
//
//
//
//
// test = [ { time_id: 1 },
//     { time_id: 2 },
//     { time_id: 2 },
//     { time_id: 14 },
//     { time_id: 15 },
//     { time_id: 21 },
//     { time_id: 16 },
//     { time_id: 13 },
//     { time_id: 7 },
//     { time_id: 19 },
//     { time_id: 1 },
//     { time_id: 2 },
//     { time_id: 1 },
//     { time_id: 7 },
//     { time_id: 13 },
//     { time_id: 14 } ]
//
//
// function checkrepeat(list) {
//     array = []
//     for (var i in list) {
//         console.log(list[i]['time_id'])
//         array.unshift(list[i]['time_id'])
//     }
//     console.log(array);
//
//     ojb2 = new Object();
//     for (var j in array) {
//         //console.log("round",d[i]);
//         //console.log(ojb2[a[i]])
//         if (ojb2[array[j]] === undefined) {
//             ojb2[array[j]] = 1;
//         } else {
//             console.log("test:", ojb2[array[j]])
//             ojb2[array[j]]++;
//         }
//     }
//
//     console.log(ojb2)
//
//     for (var k in ojb2) {
//         if (ojb2[k] !== 1) {
//             return false
//         }
//     }
// }
//
// modules_id = [1,2,3];
// console.log(modules_id.map((modules_id) => '(?)').join(',')+','+ modules_id.map((modules_id) => '(?)').join(','));
//
// var repr = /@uts\.edu\.au\b/i;
//
// cooper = 'cooper@uts.edu.au';
//
// tian = 'cooper@lds.eds.ee'
//
// console.log(repr.test(cooper));
// console.log(repr.test(tian));

function level1(number, callback) {
    if (number === 1){
        callback("the number is wrong l1")
    }else{
        //read file -data
        callback(null, 4)
    }
}

function level2(number, callback) {
    if(number === 5){
        callback("the number is wrong l2")
    }else{
        callback(null, "this is callout")
    }

}

console.log("number is equal 2")
level1(2, function(err, number) {
    console.log("the number is :" , number)
    level2(number, function(err, data){
        console.log("level2 received number is: ",number)
        console.log("in level2 data: ",data)
    })
});

console.log("this is last line");

function cal(num1,num2,method) {
    return method(num1, num2)
}

cal(7,8,function(a,b) {
    return console.log(a+b)
});

cal(7,8,function(a,b) {
    return console.log(a*b)
});




