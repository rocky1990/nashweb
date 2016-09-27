/**
 * Created by Rocky on 2016/9/13.
 */
cell.view = (function () {
    var initview, Block, Cell, simulate,
        stateMap = {
            $container: null,
            container: null,
            cellarr: null,
            index: 0,
            simuncheck:0,
        },
        paramsMap = {
            count: null,
        }
    rule = {
        '111': 1,
        '110': 0,
        '101': 1,
        '100': 1,
        '011': 1,
        '010': 0,
        '001': 0,
        '000': 0,
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

    initview = function (params) {

        stateMap.cellarr = Array(params.arrcount);
        for (var i = 0; i < params.arrcount; i++) {
            stateMap.cellarr[i] = Array();
        }
        paramsMap.count = 401;
        simulate(params.arrcount);
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
        initview: initview,
        Cell: Cell,
        array: stateMap.cellarr,
        simulate: simulate,
    };
}());