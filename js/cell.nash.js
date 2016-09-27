/**
 * Created by Rocky on 2016/9/26.
 */
cell.nash = (function () {
    var initnash, Block, Cell, simulate, initcar, shuffle, choice, Simu,
        stateMap = {
            $container: null,
            container: null,
            cellarr: null,
            index: 0,
            simuncheck: 0,
            L: 1000,
            R: 0.2,
            CarRowList: [],
            CarList: [],
        },
        paramsMap = {
            count: null,
        }
    //从一数组中选取n个数据返回一个新的随机数组
    choice = function (arr, n) {
        arr_return = [];
        arrtemp = arr.slice();
        for (var i = 0; i < n; i++) {
            num = parseInt(Math.random() * (arrtemp.length - 1));
            arr_return.push(arrtemp[num]);
            arrtemp.splice(num, 1);
        }
        return arr_return;
    };
    //洗牌数组
    shuffle = function (arr) {
        arr_return = [];
        while (arr.length > 0) {
            n = parseInt(Math.random() * (arr.length - 1));
            arr_return.push(arr[n]);
            arr.splice(n, 1);
        }
        return arr_return;
    };
    simulate = function (stepcount) {
        var list = document.getElementById("list");

        var dt = document.createElement("dt");
        list.appendChild(dt);
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("id", String() + "svgline" + 0);
        svg.setAttribute("width", "2005");
        svg.setAttribute("height", "5");
        svg.setAttribute("style", "background-color: white");
        list.lastChild.appendChild(svg);
        for (var i = 0; i < paramsMap.count; i++) {
            var cell = new Cell({x: 5 * i, y: 0, index: stateMap.index, container: svg,});
            stateMap.cellarr[0].push(cell);
            stateMap.index++;
        }
        //初始化中间元素设置为生存
        var num = parseInt(stateMap.cellarr[0].length / 2);
        stateMap.cellarr[0][num].Alive();
        var arrayold = stateMap.cellarr[0];
        for (var i = 1; i < stepcount; i++) {
            dt = document.createElement("dt");
            list.appendChild(dt);
            svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("id", String() + "svgline" + i);
            svg.setAttribute("width", "2005");
            svg.setAttribute("height", "5");
            svg.setAttribute("style", "background-color: white");
            list.lastChild.appendChild(svg);
            for (var j = 0; j < arrayold.length; j++) {
                var strrule;
                if (j == 0) {
                    strrule = String() + arrayold[arrayold.length - 1].alive
                        + String() + arrayold[0].alive
                        + String() + arrayold[1].alive;
                }
                else if (j == arrayold.length - 1) {
                    strrule = String() + arrayold[arrayold.length - 2].alive
                        + String() + arrayold[arrayold.length - 1].alive
                        + String() + arrayold[0].alive;
                }
                else {
                    strrule = String() + arrayold[j - 1].alive
                        + String() + arrayold[j].alive
                        + String() + arrayold[j + 1].alive;
                }
                var cell = new Cell({x: 5 * j, y: 0, index: stateMap.index, container: svg,});
                if (rule[strrule] == 1) {
                    cell.Alive();
                }
                else {
                    cell.Die();
                }

                stateMap.cellarr[i].push(cell);
                stateMap.index++;
            }
            arrayold = stateMap.cellarr[i];
        }

    };
    function Car() {
        this.x = 0;
        this.y = 0;
        this.v = 0;//速度;
        this.dsum = 0;
        this.beforenode = null;
        this.nextnode = null;
        this.p = 0.3;//随机慢化概率
        this.vmax = 5;
        this.alive = 0;
    };
    Car.prototype.Alive = function () {
        this.alive = 1;
    }
    Car.prototype.Die = function () {
        this.alive = 0;
    }
    Car.prototype.Acc = function () {
        this.v = Math.min(this.v + 1, this.vmax);
    };
    Car.prototype.Slow = function () {
        if (this.nextnode.x > this.x) {
            this.v = Math.min(this.v, this.nextnode.x - this.x);
        }
        else {
            this.v = Math.min(this.v, this.nextnode.x + (stateMap.L - 1 - this.x))
        }
    };
    Car.prototype.Random = function () {
        var v = this.v;
        this.v = (function () {
            if (Math.random() < 0.3) {
                return Math.max(v - 1, 0);
            }
            else {
                return v;
            }
        })(v);
    };
    Car.prototype.Move = function () {
        if (this.x <= stateMap.L - 1) {
            this.x = this.x + this.v;
        }

        else {
            this.x = this.x + this.v;
            this.x = this.x - (stateMap.L - 1);
        }
    };
    Car.prototype.MoveSum = function () {
        oldx = this.x;
        if (this.x <= stateMap.L - 1) {
            this.x = this.x + this.v;
            this.dsum += this.x - oldx;
        }
        else {
            this.x = this.x + this.v
            this.dsum += this.x - oldx;
            this.x = this.x - (stateMap.L - 1)
        }
    };
    Car.prototype.simu = function () {
        this.Acc();
        this.Slow();
        this.Random();
        this.Move();
    };

    initcar = function () {
        var car_num = parseInt(stateMap.L * stateMap.R);
        //生成所有的车 并存在list里面
        for (var i = 0; i < car_num; i++) {
            stateMap.CarRowList.push(new Car());
        }
        //生成一个同样数量的随机数列表 也就是初始车列的坐标
        var c_list = choice(function () {
            var l = [];
            for (var i = 0; i < stateMap.L; i++) {
                l.push(i);
            }
            return l;
        }(), car_num).sort(function (a, b) {
            return a - b;
        });
        for (var i = 0; i < stateMap.CarRowList.length; i++) {
            stateMap.CarRowList[i].x = c_list[i];
            stateMap.CarRowList[i].alive = 1;//这个位置的单元格显示
        }
        //设置前后节点
        for (var i = 0; i < stateMap.CarRowList.length; i++) {
            if (i == 0) {
                stateMap.CarRowList[i].nextnode = stateMap.CarRowList[i + 1];
            }
            else if (i > 0 && i < stateMap.CarRowList.length - 1) {
                stateMap.CarRowList[i].beforenode = stateMap.CarRowList[i - 1];
                stateMap.CarRowList[i].nextnode = stateMap.CarRowList[i + 1];
            }
            else if (i == stateMap.CarRowList.length - 1) {
                stateMap.CarRowList[i].beforenode = stateMap.CarRowList[i - 1]
                stateMap.CarRowList[i].nextnode = stateMap.CarRowList[0]
                stateMap.CarRowList[0].beforenode = stateMap.CarRowList[i]
            }
        }

    };
    Simu = function () {
        initcar();
        stateMap.CarList.push(function () {
            var list_return = [];
            for (var i = 0; i < stateMap.CarRowList.length; i++) {
                list_return.push($.extend(true, {}, stateMap.CarRowList[i]));
            }
            return list_return;
        }());
        for (var i = 0; i < 100; i++) {
            stateMap.CarRowList.forEach(function (c) {
                c.simu();
            });
            stateMap.CarList.push(function () {
                var list_return = [];
                for (var i = 0; i < stateMap.CarRowList.length; i++) {
                    list_return.push($.extend(true, {}, stateMap.CarRowList[i]));
                }
                return list_return;
            }());
        }
    };
    function Cell(params) {
        this.width = 5;
        this.height = 5;
        this.x = params.x;
        this.y = params.y;
        this.index = params.index;
        this.alive = 0;
        this.container = params.container;
        this.element = this.Element();
    };
    Cell.prototype.Alive = function () {
        this.alive = 1;
        this.element.setAttribute("style", "x:" + this.x + ";y:" + this.y + ";width:" + this.width + ";height:" + this.height + ";fill:black;");
        // rect.style.x = this.x;
        // rect.style.y = this.y;
        // rect.style.width = this.width;
        // rect.style.height = this.height;
        // setTimeout(Cell.prototype.Alive,1000);

    };
    Cell.prototype.Die = function () {
        this.alive = 0;
        this.element.setAttribute("style", "x:" + this.x + ";y:" + this.y + ";width:" + this.width + ";height:" + this.height + ";fill:white;");
    };
    Cell.prototype.Element = function () {
        var node = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.container.appendChild(node);
        var rect = this.container.lastChild;
        rect.style.x = this.x;
        rect.style.y = this.y;
        rect.style.width = this.width;
        rect.style.height = this.height;
        rect.setAttribute("class", "cell");
        return rect;
        // setTimeout(Cell.prototype.Element,100);
        // var node=document.createElement("<rect class='cell' x='" + this.x + "' y='" + this.y
        //     + "' width='" + this.width + "' height='" + this.height + "'></rect>\n");

    };

    initnash = function () {
        Simu();
        // stateMap.cellarr = Array(params.arrcount);
        // for (var i = 0; i < params.arrcount; i++) {
        //     stateMap.cellarr[i] = Array();
        // }
        // paramsMap.count = 1000;
        // simulate(params.arrcount);
        // stateMap.$container = $("#list");
        // stateMap.container = document.getElementById("svgline1");
        // paramsMap.count = 401;
        // var htmldata = String();
        // var carr = new Array();
        // for (var i = 0; i < paramsMap.count; i++) {
        //     var cell = new Cell({x: 5 * i, y: 0, index: i, container: stateMap.container,});
        //     carr.push(cell);
        //     // stateMap.container.appendChild(node);
        //     // htmldata += "<rect class='cell' x='" + cell.x + "' y='" + cell.y
        //     //     + "' width='" + cell.width + "' height='" + cell.height + "'></rect>\n";
        // }
        // stateMap.cellarr.push(carr);
        // var ncount=0;
        // var SetOut=function () {
        //     stateMap.cellarr[0][ncount].Alive();
        //     ncount++;
        //     alert(ncount);
        //     // for (var i = 0; i < stateMap.cellarr[0].length; i++) {
        //     //     // var c = stateMap.cellarr[0][i];
        //     //     // alert(c.element.getAttribute("x"));
        //     //     stateMap.cellarr[0][i].Alive();
        //     //     // function mysettimeout(cell) {
        //     //     //     setTimeout(cell.Alive,100);
        //     //     // };
        //     //     // mysettimeout(stateMap.cellarr[0][i]);
        //     // }
        //     if(ncount<10)
        //     { setTimeout(SetOut,10);}
        //
        // };
        // SetOut();

        // stateMap.container.innerHTML=htmldata;
        // $("<rect class='cell' x='100' y='0' width='100' height='100'></rect>").appendTo("#svgline1");
    };
    return {
        initnash: initnash,
        Cell: Cell,
        array: stateMap.cellarr,
        simulate: simulate,
    };
}());