(this["webpackJsonpcovid-queueing"]=this["webpackJsonpcovid-queueing"]||[]).push([[0],{145:function(e,t,a){e.exports=a.p+"static/media/logo.5691b2a9.svg"},161:function(e,t,a){e.exports=a(275)},167:function(e,t,a){},274:function(e,t,a){},275:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a.n(n),o=a(144),s=a.n(o),l=(a(166),a(167),a(45)),c=a(46),i=a(53),u=a(52),m=a(145),h=a.n(m),d=a(77),p=a(156),g=a(103),f=a(43),E=a(29),b=a(26),y=a(157),k=a(63),v=function(e){Object(i.a)(a,e);var t=Object(u.a)(a);function a(){return Object(l.a)(this,a),t.apply(this,arguments)}return Object(c.a)(a,[{key:"render",value:function(){return r.a.createElement(b.a.Group,{as:f.a,className:"model-param",controlId:this.props.controlId},r.a.createElement(E.a,{sm:4}),r.a.createElement(E.a,{sm:2},r.a.createElement(b.a.Control,{type:"number",defaultValue:this.props.defaultValue,onChange:this.props.onChange})),r.a.createElement(b.a.Label,{column:!0,sm:3},this.props.label))}}]),a}(r.a.Component),S=a(284),w=a(289),C=a(282),N=function(e){Object(i.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(l.a)(this,a),(n=t.call(this,e)).onCheckChange=function(e){return n.setState(Object(g.a)({},e.target.name,e.target.checked))},n.onFormChange=function(e){return n.setState(Object(g.a)({},e.target.controlId,e.target.value))},n.state={numStudents:4e3,numStaff:1e3,numUnifiedTestingStations:10,numStudentTestingStations:8,numStaffTestingStations:2,minutesPerTest:5,separateStudentsStaff:!1},n}return Object(c.a)(a,[{key:"simulate",value:function(){}},{key:"updateChart",value:function(){alert("ello")}},{key:"render",value:function(){var e=this;return r.a.createElement(d.a,{className:"wait-time-interactive"},r.a.createElement("div",{className:"wait-time-chart"},r.a.createElement(S.a,{width:800,height:400},r.a.createElement(w.a,{style:{data:{strokeWidth:3,fillOpacity:.4}}},r.a.createElement(C.a,{style:{data:{fill:"cyan",stroke:"cyan"}},data:[{x:1,y:2},{x:2,y:3},{x:3,y:5},{x:4,y:4},{x:5,y:7}]}),r.a.createElement(C.a,{style:{data:{fill:"magenta",stroke:"magenta"}},data:[{x:1,y:3},{x:2,y:2},{x:3,y:6},{x:4,y:2},{x:5,y:6}]})))),r.a.createElement("div",{className:"wait-time-params"},r.a.createElement(b.a,null,r.a.createElement(b.a.Group,{as:f.a,className:"justify-content-center",controlId:"separateStudentsStaff"},r.a.createElement(E.a,{sm:4},r.a.createElement(b.a.Check,{type:"checkbox",name:"separateStudentsStaff",label:"Separate students and staff",checked:this.state.separateStudentsStaff,onChange:this.onCheckChange}))),r.a.createElement(v,{controlId:"numStudents",defaultValue:this.state.numStudents,onChange:this.onFormChange,label:"students"}),r.a.createElement(v,{controlId:"numStaff",defaultValue:this.state.numStaff,onChange:this.onFormChange,label:"staff"}),e.state.separateStudentsStaff?r.a.createElement(r.a.Fragment,null,r.a.createElement(v,{controlId:"numStudentTestingStations",defaultValue:e.state.numStudentTestingStations,onChange:e.onFormChange,label:"student testing stations"}),r.a.createElement(v,{controlId:"numStaffTestingStations",defaultValue:e.state.numStaffTestingStations,onChange:e.onFormChange,label:"staff testing stations"})):r.a.createElement(v,{controlId:"numUnifiedTestingStations",defaultValue:e.state.numUnifiedTestingStations,onChange:e.onFormChange,label:"testing stations"}),r.a.createElement(v,{controlId:"minutesPerTest",defaultValue:this.state.minutesPerTest,onChange:this.onFormChange,label:"minutes per test"}),r.a.createElement(b.a.Group,{as:f.a,className:"justify-content-center",controlId:"scenario"},r.a.createElement(E.a,{sm:4},r.a.createElement(k.a,{as:"select"},r.a.createElement("option",null,"Uniform demand"),r.a.createElement("option",null,"Spikes around mealtimes")))),r.a.createElement(b.a.Group,{as:f.a,className:"justify-content-center",controlId:"dayLength"},r.a.createElement(E.a,{sm:4},r.a.createElement(k.a,{as:"select"},r.a.createElement("option",null,"8-hour day"),r.a.createElement("option",null,"10-hour day"),r.a.createElement("option",null,"12-hour day"),r.a.createElement("option",null,"14-hour day")))),r.a.createElement(b.a.Group,{as:f.a,className:"justify-content-center",controlId:"simulateButton"},r.a.createElement(E.a,{sm:4},r.a.createElement(y.a,{variant:"primary",type:"submit",className:"simulate-button",onClick:this.updateChart},"Simulate"))))))}}]),a}(r.a.Component),j=(a(274),function(e){Object(i.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(l.a)(this,a),(n=t.call(this,e)).state={},n}return Object(c.a)(a,[{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"site-header"},r.a.createElement("nav",{className:"site-nav"},r.a.createElement("a",{href:"https://mggg.org"},r.a.createElement("img",{src:h.a,alt:"MGGG",className:"logo"})))),r.a.createElement("main",null,r.a.createElement("section",{className:"interactive"},r.a.createElement(p.a,{fluid:!0,className:"lead"},r.a.createElement(d.a,null,r.a.createElement("div",{className:"lead-text"},r.a.createElement("h1",null,"Queueing for Campus Coronavirus Testing"),r.a.createElement("p",null,"or how to avoid long lines")),r.a.createElement("div",{className:"model-dropdown"}))),r.a.createElement(N,null)),r.a.createElement("hr",null),r.a.createElement("section",{className:"info"},r.a.createElement("h2",null,"How should I use this?"),r.a.createElement("p",null,"99th-percentile events might be important. Or they might not be. Who knows?"),r.a.createElement("p",null,"Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic."),r.a.createElement("p",null,"Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini."),r.a.createElement("p",null,"Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus winter purslane kale. Celery potato scallion desert raisin horseradish spinach carrot soko. Lotus root water spinach fennel kombu maize bamboo shoot green bean swiss chard seakale pumpkin onion chickpea gram corn pea. Brussels sprout coriander water chestnut gourd swiss chard wakame kohlrabi beetroot carrot watercress. Corn amaranth salsify bunya nuts nori azuki bean chickweed potato bell pepper artichoke.")),r.a.createElement("hr",null),r.a.createElement("section",{className:"info"},r.a.createElement("h2",null,"More about the model"),r.a.createElement("p",null,"Queueing theory bla bla bla..."),r.a.createElement("p",null,"Celery quandong swiss chard chicory earthnut pea potato. Salsify taro catsear garlic gram celery bitterleaf wattle seed collard greens nori. Grape wattle seed kombu beetroot horseradish carrot squash brussels sprout chard."),r.a.createElement("p",null,"Beetroot water spinach okra water chestnut ricebean pea catsear courgette summer purslane. Water spinach arugula pea tatsoi aubergine spring onion bush tomato kale radicchio turnip chicory salsify pea sprouts fava bean. Dandelion zucchini burdock yarrow chickpea dandelion sorrel courgette turnip greens tigernut soybean radish artichoke wattle seed endive groundnut broccoli arugula."))),r.a.createElement("footer",{className:"footer mt-auto py-3"},r.a.createElement("p",null,"This is a summer 2020 project of ",r.a.createElement("a",{href:"https://mggg.org"},"MGGG Redistricting Lab")," at Tufts University's ",r.a.createElement("a",{href:"https://tischcollege.tufts.edu/"},"Jonathan M. Tisch College of Civic Life")," with assistance from ",r.a.createElement("a",{href:"https://pjrule.github.io/"},"Parker J. Rule"),". We are grateful for the major support of the National Science Foundation through the Convergence Accelerator award OIA-1937095, Network Science of Census Data. (TODO: more recent grant here!)")))}}]),a}(r.a.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(j,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[161,1,2]]]);
//# sourceMappingURL=main.604fb8b6.chunk.js.map