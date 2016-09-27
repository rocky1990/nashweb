/**
 * Created by Rocky on 2016/9/26.
 */
var test = (function () {
    var init, addtest,shuffle;
    addtest = function () {
        $m = $("#map");
        m = document.getElementById("map");
        function f() {
            for (var i = 0; i < 2; i++) {
                p = document.createElement("p");
                p.innerHTML = i.toString();
                m.appendChild(p);
            }
        };
        setTimeout(f, 10);
    };
    shuffle=function (arr) {
        arr_return=[];
        while(arr.length>0)
        {
            n=parseInt(Math.random()*(arr.length-1));
            arr_return.push(arr[n]);
            arr.splice(n,1);
        }
        return arr_return;
    };
    init = function () {
        // addtest();
        var l=[];
        for(var i=0;i<11;i++)
        {
            l.push(i);
        }
        var choice = function (arr, n) {
            arr_return = [];
            arrtemp = arr.slice();
            for (var i = 0; i < n; i++) {
                num = parseInt(Math.random() * (arrtemp.length - 1));
                arr_return.push(arrtemp[num]);
                arrtemp.splice(num, 1);
            }
            return arr_return;
        };
        var c_list = choice(function () {
            var l = [];
            for (var i = 0; i <1000; i++) {
                l.push(i);
            }
            return l;
        }(), 200);
        c_list.sort();
        var lll=shuffle(l);
        var x=10;
    };
    return {init: init};
}());