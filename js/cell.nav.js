/**
 * Created by Rocky on 2016/9/17.
 */
cell.nav=(function () {
    var stateMap={
        $container:null,
        container:null,
    },jqueryMap,onstart,onstop,onrestart,initnav;
    setjqueryMap=function () {
      jqueryMap.$steptextinput=$("#step-text-input");
    };
    onstart=function () {
        $steptextinput=$("#step-text-input");
        var stepcount=parseInt($steptextinput.val());
        // cell.view.initview({arrcount:stepcount,});
        cell.nash.initnash();
    };
    initnav=function () {
      // cell.view.initview();
      //   cell.view.simulate();
        $("#start").click(onstart);
    };
    return {initnav:initnav,};
}());