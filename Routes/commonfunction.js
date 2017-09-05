var checkBlank = function(arr, req, res)
{
    var arrlength = arr.length;
    for (var i = 0; i < arrlength; i++)
    {
        if (arr[i] === undefined) {
            arr[i] = "";
        } else {
            arr[i] = arr[i];
        }
        arr[i] = arr[i].trim();
        if (arr[i] === '' || arr[i] === "" || arr[i] == undefined)
        {
            return 1;
            
        }
    }
    return 0;
};
exports.checkBlank = checkBlank;