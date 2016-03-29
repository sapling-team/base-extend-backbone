### Model


```JavaScript

//$get 包装器 使用
console.log('$get items',this.$get('items'))
console.log('$get debug',this.$get('debug'))
console.log('$get trace.warn',this.$get('trace.warn'))
console.log('$get 全部的数据',this.$get())

//$set包装器 使用
this.$set('trace.warn',{'msg':'msg'})

//$filter包装器 使用
var id1 = this.$filter('items',{"id":1})
console.log('$filter id=1',id1)
var id2 = this.$filter('items',function(v,i){
    if(v.id == 2){
        return true
    }
})
console.log('$filter id=2',id2)
var icepy = this.$filter('items2','icepy')
console.log('$filter icepy',icepy)

//$sort包装器 使用
var sort1 = this.$sort('items','id.<')
console.log('降序',sort1)
var sort2 = this.$sort('items','id.>')
console.log('升序',sort2)
var sort3 = this.$sort('items',function(){
    return true
});
```