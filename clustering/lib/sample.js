function sample(arr, prob) {
    var smallerArr = [];
    for (var i = 0; i < arr.length; i++) {
        var rand = Math.random();
        if (rand <= prob) {
            smallerArr.push(arr[i]);
        }
    }
    return smallerArr;
}
