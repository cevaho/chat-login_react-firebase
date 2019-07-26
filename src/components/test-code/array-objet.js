var items = []

for(var i = 0; i < 1000; i++) {
    items.push({id: i + 1})
}
console.log(JSON.stringify(items));
var find = 523

var index = -1
for(var i = 0; i < items.length; i++) {
    if(items[i].id === find) {
        index = i;
        break;
    }
}
