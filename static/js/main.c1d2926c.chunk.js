(this["webpackJsonpcovid-queueing"]=this["webpackJsonpcovid-queueing"]||[]).push([[0],{162:function(e,t,a){e.exports=a.p+"static/media/logo.5691b2a9.svg"},181:function(e,t,a){e.exports=a(296)},187:function(e,t,a){},295:function(e,t,a){},296:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a.n(n),s=a(64),i=a.n(s),o=(a(186),a(187),a(45)),l=a(46),c=a(51),u=a(50),m=a(162),d=a.n(m),h=a(98),p=a(173),f=a(100),g=a(37),b=a(39),y=a(25),k=a(22),E=a(172),S=a(176),v=a(58),w=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(){return Object(o.a)(this,a),t.apply(this,arguments)}return Object(l.a)(a,[{key:"render",value:function(){return r.a.createElement(k.a.Group,{as:b.a,key:this.props.controlId,className:"model-param",controlId:this.props.controlId},r.a.createElement(y.a,{sm:4}),r.a.createElement(y.a,{sm:2},r.a.createElement(k.a.Control,{type:"number",defaultValue:this.props.defaultValue,onChange:this.props.onChange})),r.a.createElement(k.a.Label,{column:!0,sm:3},this.props.label))}}]),a}(r.a.Component),C=a(175),x=a(174),T=a(307),O=a(316),j=a(312),I=a(310),P=a(308),D=a(309),N=a(314);function A(e){for(var t=Math.exp(-e),a=0,n=1;n>t;)n*=Math.random(),a++;return a-1}var L=function(e,t,a,n,r){for(var s=6e4*r,i=Math.ceil((n-a)/s),o=a,l=Array(i),c=0,u=0;u<i;u++){for(;c<t.length-1&&t[c+1].start<=o;)c++;l[u]=t[c].demand,o=new Date(new Date(o).getTime()+s)}var m=e/l.reduce((function(e,t){return e+t}));return l.map((function(e){return e*m}))},M=function(e,t,a,n){for(var r=e.length,s=Array(r).fill(null).map((function(e,t){return new Map})),i=0;i<n;i++)for(var o=e.map(A),l=0,c=Array(t).fill(-1),u=0;l<r;u++)for(var m=0;m<t;m++){for(;0===o[l]&&l<r;)l++;if(l>u||l>=r)break;if(c[m]<=u){c[m]=u+a;var d=u-l;d in s[l]?s[l][d]+=1:s[l][d]=1,o[l]--}}return console.log(s),s},H="#d1352b",W="'HK Grotesk', Helvetica, sans-serif",G=[1,5,20,50,80,95,99],V=[.2,.35,.52,.52,.35,.2],z=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).getTicks=n.getTicks.bind(Object(g.a)(n)),n}return Object(l.a)(a,[{key:"bandsData",value:function(e){var t=[],a=[],n=Math.floor(7.5),r=0;if(void 0!==e){for(var s=e.map((function(e){return function(e,t){if(0===Object.keys(e).length)return null;t.sort((function(e,t){return e-t}));for(var a=Array(t.length).fill(0),n=Object.keys(e).sort((function(e,t){return e-t})),r=0,s=e[n[0]]-1,i=Object.values(e).reduce((function(e,t){return e+t})),o=0;o<t.length;o++){for(var l=Math.max(0,Math.ceil(i*t[o]/100)-1);s<l&&r<n.length-1;)s=s+1+e[n[r]]-1,r++;a[o]=n[r]}return a}(e,G)})),i=Array(G.length),o=function(e){var t=function(e,t){for(var a=Math.floor(t/2),n=e.length-2*a,r=Array(n),s=0;s<n;s++){var i=e.slice(s,s+2*a+1);r[s]=i.reduce((function(e,t){return parseInt(e)+parseInt(t)}))/t}return r}(s.map((function(t){return t[e]})),15);if(i[e]=t,50===G[e])for(var r=0;r<t.length;r++)a.push({x:r+n,y:t[r]})},l=0;l<G.length;l++)o(l);for(var c=0;c<V.length;c++){for(var u=i[c],m=i[c+1],d=Array(m.length),h=0;h<m.length;h++)d[h]={x:h+n,y:m[h],y0:u[h]},r=Math.max(m[h],r);t.push({xy:d,alpha:V[c]})}}return{median:a,percentiles:t,maxTime:r}}},{key:"getStyles",value:function(){return{timeAxis:{axis:{stroke:"black",strokeWidth:1},ticks:{size:function(e){var t=e.tick;return t%60===0?10:t%15===0?5:0},stroke:"black",strokeWidth:1},tickLabels:{fill:"black",fontFamily:W,fontSize:9}},minutesAxis:{axis:{stroke:"black",strokeWidth:1},ticks:{size:3,stroke:"black",strokeWidth:1},tickLabels:{fill:"black",fontFamily:W,fontSize:9}},axisLabel:{fill:"black",fontFamily:W,fontSize:10,fontWeight:500},legend:{labels:{fill:"black",fontFamily:W,fontSize:10}}}}},{key:"getTicks",value:function(){if(void 0!==this.props.startTime&&void 0!==this.props.endTime){var e=Math.ceil((this.props.endTime-this.props.startTime)/6e4);return Object(C.a)(Array(e+10).keys()).map((function(e){return e-5}))}return[]}},{key:"render",value:function(){var e,t,a,n,s,i,o,l,c,u,m,d=this,h=this.getStyles(),p=this.getTicks();return console.log("timeAxis:",h.timeAxis),!0===this.props.separateStudentsStaff?(n=this.bandsData(this.props.studentHists),s=n.median,i=n.percentiles,o=this.bandsData(this.props.staffHists),l=o.median,c=o.percentiles,u=Math.max(n.maxTime,o.maxTime)):(e=this.bandsData(this.props.peopleHists),t=e.median,a=e.percentiles,u=e.maxTime),u=Math.min(Math.max(u,10),120),m=u>=120,r.a.createElement(r.a.Fragment,null,function(){if(m)return r.a.createElement(x.a,{key:"unstable",variant:"danger"},r.a.createElement("strong",null,"This queue is unstable (wait times exceed ",2," hours).")," Add more testing lines or reduce the number of people.")}(),r.a.createElement(T.a,{width:600,height:250,domain:{y:[0,u]}},!0===d.props.separateStudentsStaff?[r.a.createElement(O.a,{style:{data:{strokeWidth:3.5}}},r.a.createElement(j.a,{style:{data:{stroke:H}},data:s})),i.map((function(e){return r.a.createElement(O.a,{style:{data:{strokeWidth:0,fillOpacity:e.alpha}}},r.a.createElement(I.a,{style:{data:{fill:H,stroke:H}},data:e.xy}))})),r.a.createElement(O.a,{style:{data:{strokeWidth:4}}},r.a.createElement(j.a,{style:{data:{stroke:"#87ca3f"}},data:l})),c.map((function(e){return r.a.createElement(O.a,{style:{data:{strokeWidth:0,fillOpacity:e.alpha}}},r.a.createElement(I.a,{style:{data:{fill:"#87ca3f",stroke:"#87ca3f"}},data:e.xy}))})),r.a.createElement(P.a,{x:235,y:10,orientation:"horizontal",gutter:20,style:h.legend,colorScale:[H,"#87ca3f"],data:[{name:"Students"},{name:"Staff"}]})]:[r.a.createElement(O.a,{style:{data:{strokeWidth:4}}},r.a.createElement(j.a,{style:{data:{stroke:"#4198c8"}},data:t})),a.map((function(e){return r.a.createElement(O.a,{style:{data:{strokeWidth:0,fillOpacity:e.alpha}}},r.a.createElement(I.a,{style:{data:{fill:"#4198c8",stroke:"#4198c8"}},data:e.xy}))}))],r.a.createElement(D.a,{x:275,y:240,text:"Arrival time",style:h.axisLabel}),r.a.createElement(D.a,{x:42,y:26,text:"Wait",style:h.axisLabel}),r.a.createElement(D.a,{x:33,y:38,text:"(minutes)",style:h.axisLabel}),r.a.createElement(N.a,{standalone:!1,style:h.timeAxis,tickValues:p,tickFormat:function(e){return e%60===0?new Date(new Date(d.props.startTime).getTime()+60*e*1e3).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!1}).replace(/^0+/,""):""}}),r.a.createElement(N.a,{dependentAxis:!0,orientation:"left",standalone:!1,style:h.minutesAxis})))}}]),a}(r.a.Component),F={8:{start:new Date(2020,1,1,8,0,0),end:new Date(2020,1,1,16,0,0)},10:{start:new Date(2020,1,1,8,0,0),end:new Date(2020,1,1,18,0,0)},12:{start:new Date(2020,1,1,8,0,0),end:new Date(2020,1,1,20,0,0)},14:{start:new Date(2020,1,1,8,0,0),end:new Date(2020,1,1,22,0,0)}},R=new Date(2020,1,1,8,0,0);function q(e){return[{start:R,demand:1},{start:new Date(2020,1,1,8,30,0),demand:e},{start:new Date(2020,1,1,9,30,0),demand:1},{start:new Date(2020,1,1,11,30,0),demand:e},{start:new Date(2020,1,1,12,30,0),demand:1},{start:new Date(2020,1,1,17,0,0),demand:e},{start:new Date(2020,1,1,18,0,0),demand:1}]}var B={"Uniform demand":[{start:R,demand:1}],"Peaks around mealtimes (3x increase)":q(3),"Peaks around mealtimes (5x increase)":q(5),"Peaks around mealtimes (7x increase)":q(7)},J="Peaks around mealtimes (5x increase)",U=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).state={numPeople:1500,numStudents:1200,numStaff:300,numPeopleTestingStations:30,numStudentTestingStations:22,numStaffTestingStations:8,minutesPerTest:8,peopleScenario:J,studentScenario:J,staffScenario:J,dayLength:12,separateStudentsStaff:!1,simRunning:!1},n.updateChart=n.updateChart.bind(Object(g.a)(n)),n.onSeparationChange=n.onSeparationChange.bind(Object(g.a)(n)),n.onParamChange=n.onParamChange.bind(Object(g.a)(n)),n.onSelectChange=n.onSelectChange.bind(Object(g.a)(n)),n}return Object(l.a)(a,[{key:"onSeparationChange",value:function(e){this.setState(Object(f.a)({},e.target.name,e.target.checked),(function(){void 0!==this.state.studentHists&&void 0!==this.state.staffHists&&void 0!==this.state.peopleHists||this.updateChart()}))}},{key:"onParamChange",value:function(e){console.log("id:",e.target.id),console.log("value:",e.target.value),this.setState(Object(f.a)({},e.target.id,e.target.value))}},{key:"onSelectChange",value:function(e){this.setState(Object(f.a)({},e.target.id,e.target.value))}},{key:"componentDidMount",value:function(){this.updateChart()}},{key:"updateChart",value:function(){this.setState({simRunning:!0});var e=F[this.state.dayLength].start,t=F[this.state.dayLength].end,a=this.state.minutesPerTest;if(!0===this.state.separateStudentsStaff){var n=parseInt(this.state.numStudents),r=parseInt(this.state.numStaff),s=B[this.state.studentScenario],i=B[this.state.staffScenario],o=parseInt(this.state.numStudentTestingStations),l=parseInt(this.state.numStaffTestingStations),c=L(n,s,e,t,1),u=L(r,i,e,t,1),m=M(c,o,a,200),d=M(u,l,a,200);this.setState({studentHists:m,staffHists:d})}else{var h=parseInt(this.state.numPeople),p=parseInt(this.state.numPeopleTestingStations),f=B[this.state.peopleScenario],g=L(h,f,e,t,1),b=M(g,p,a,200);this.setState({peopleHists:b})}this.setState({startTime:e,endTime:t,simRunning:!1})}},{key:"scenarioOptions",value:function(){return Object.keys(B).sort().map((function(e){return r.a.createElement("option",{key:e,value:e},e)}))}},{key:"render",value:function(){var e=this;return r.a.createElement(h.a,{className:"wait-time-interactive"},r.a.createElement("div",{className:"wait-time-chart"},e.state.simRunning?r.a.createElement("div",{class:"wait-time-progress"},r.a.createElement(S.a,{animated:!0,now:100})):r.a.createElement(z,{separateStudentsStaff:e.state.separateStudentsStaff,peopleHists:e.state.peopleHists,studentHists:e.state.studentHists,staffHists:e.state.staffHists,startTime:e.state.startTime,endTime:e.state.endTime})),r.a.createElement("div",{className:"wait-time-params"},r.a.createElement(k.a,null,r.a.createElement(k.a.Group,{as:b.a,className:"justify-content-center",controlId:"separateStudentsStaff"},r.a.createElement(y.a,{sm:4},r.a.createElement(k.a.Check,{type:"checkbox",name:"separateStudentsStaff",label:"Separate students and staff",checked:this.state.separateStudentsStaff,onChange:this.onSeparationChange}))),e.state.separateStudentsStaff?r.a.createElement(r.a.Fragment,null,r.a.createElement(w,{controlId:"numStudents",defaultValue:e.state.numStudents,onChange:e.onParamChange,label:"students per day"}),r.a.createElement(w,{controlId:"numStaff",defaultValue:e.state.numStaff,onChange:e.onParamChange,label:"staff per day"}),r.a.createElement(w,{controlId:"numStudentTestingStations",defaultValue:e.state.numStudentTestingStations,onChange:e.onParamChange,label:"student testing lines"}),r.a.createElement(w,{controlId:"numStaffTestingStations",defaultValue:e.state.numStaffTestingStations,onChange:e.onParamChange,label:"staff testing lines"})):r.a.createElement(r.a.Fragment,null,r.a.createElement(w,{controlId:"numPeople",defaultValue:e.state.numPeople,onChange:e.onParamChange,label:"people per day"}),r.a.createElement(w,{controlId:"numPeopleTestingStations",defaultValue:e.state.numPeopleTestingStations,onChange:e.onParamChange,label:"testing lines"})),r.a.createElement(w,{controlId:"minutesPerTest",defaultValue:this.state.minutesPerTest,onChange:this.onParamChange,label:"minutes per test"}),e.state.separateStudentsStaff?r.a.createElement(r.a.Fragment,null,r.a.createElement(k.a.Group,{as:b.a,controlId:"studentScenario"},r.a.createElement(y.a,{sm:4}),r.a.createElement(y.a,{sm:4},r.a.createElement(v.a,{as:"select",key:"studentScenario",defaultValue:e.state.studentScenario,onChange:e.onSelectChange},e.scenarioOptions())),r.a.createElement(k.a.Label,{column:!0,sm:3},"(students)")),r.a.createElement(k.a.Group,{as:b.a,controlId:"staffScenario"},r.a.createElement(y.a,{sm:4}),r.a.createElement(y.a,{sm:4},r.a.createElement(v.a,{as:"select",key:"staffScenario",defaultValue:e.state.staffScenario,onChange:e.onSelectChange},e.scenarioOptions())),r.a.createElement(k.a.Label,{column:!0,sm:3},"(staff)"))):r.a.createElement(k.a.Group,{as:b.a,className:"justify-content-center",controlId:"peopleScenario"},r.a.createElement(y.a,{sm:4},r.a.createElement(v.a,{as:"select",key:"peopleScenario",defaultValue:e.state.peopleScenario,onChange:e.onSelectChange},e.scenarioOptions()))),r.a.createElement(k.a.Group,{as:b.a,className:"justify-content-center",controlId:"dayLength"},r.a.createElement(y.a,{sm:4},r.a.createElement(v.a,{as:"select",key:"dayLength",defaultValue:this.state.dayLength,onChange:this.onSelectChange},function(){var e=Object.keys(F).map((function(e){return parseInt(e)}));return(e=e.sort((function(e,t){return e-t}))).map((function(e){return r.a.createElement("option",{key:e,value:e},e,"-hour day")}))}()))),r.a.createElement(k.a.Group,{as:b.a,className:"justify-content-center",controlId:"simulateButton"},r.a.createElement(y.a,{sm:4},r.a.createElement(E.a,{variant:"primary",type:"button",className:"simulate-button",onClick:this.updateChart},"Simulate"))))))}}]),a}(r.a.Component),Q=(a(295),function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).state={},n}return Object(l.a)(a,[{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"site-header"},r.a.createElement("nav",{className:"site-nav"},r.a.createElement("a",{href:"https://mggg.org"},r.a.createElement("img",{src:d.a,alt:"MGGG",className:"logo"})))),r.a.createElement("main",null,r.a.createElement("section",{className:"interactive"},r.a.createElement(p.a,{fluid:!0,className:"lead"},r.a.createElement(h.a,null,r.a.createElement("div",{className:"lead-text"},r.a.createElement("h1",null,"Queueing for Campus Coronavirus Testing"),r.a.createElement("h2",null,"or how to avoid long lines"),r.a.createElement("p",null,"Short explainer text here")),r.a.createElement("div",{className:"model-dropdown"}))),r.a.createElement(U,null)),r.a.createElement("hr",null),r.a.createElement("section",{className:"info"},r.a.createElement("h2",null,"How should I use this?"),r.a.createElement("p",null,"99th-percentile events might be important. Or they might not be. Who knows?"),r.a.createElement("p",null,"Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic."),r.a.createElement("p",null,"Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini."),r.a.createElement("p",null,"Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus winter purslane kale. Celery potato scallion desert raisin horseradish spinach carrot soko. Lotus root water spinach fennel kombu maize bamboo shoot green bean swiss chard seakale pumpkin onion chickpea gram corn pea. Brussels sprout coriander water chestnut gourd swiss chard wakame kohlrabi beetroot carrot watercress. Corn amaranth salsify bunya nuts nori azuki bean chickweed potato bell pepper artichoke.")),r.a.createElement("hr",null),r.a.createElement("section",{className:"info"},r.a.createElement("h2",null,"More about the model"),r.a.createElement("p",null,"Queueing theory bla bla bla..."),r.a.createElement("p",null,"Celery quandong swiss chard chicory earthnut pea potato. Salsify taro catsear garlic gram celery bitterleaf wattle seed collard greens nori. Grape wattle seed kombu beetroot horseradish carrot squash brussels sprout chard."),r.a.createElement("p",null,"Beetroot water spinach okra water chestnut ricebean pea catsear courgette summer purslane. Water spinach arugula pea tatsoi aubergine spring onion bush tomato kale radicchio turnip chicory salsify pea sprouts fava bean. Dandelion zucchini burdock yarrow chickpea dandelion sorrel courgette turnip greens tigernut soybean radish artichoke wattle seed endive groundnut broccoli arugula."))),r.a.createElement("footer",{className:"footer mt-auto py-3"},r.a.createElement("p",null,"This is a summer 2020 project of ",r.a.createElement("a",{href:"https://mggg.org"},"MGGG Redistricting Lab")," at Tufts University's ",r.a.createElement("a",{href:"https://tischcollege.tufts.edu/"},"Jonathan M. Tisch College of Civic Life")," with assistance from ",r.a.createElement("a",{href:"https://pjrule.github.io/"},"Parker J. Rule"),". We are grateful for the major support of the National Science Foundation through the RAPID award OIA-2029788, Campus Coronavirus Response.")))}}]),a}(r.a.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(Q,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[181,1,2]]]);
//# sourceMappingURL=main.c1d2926c.chunk.js.map