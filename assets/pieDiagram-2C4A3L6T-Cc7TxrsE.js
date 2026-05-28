import{p as j}from"./chunk-6ZKBGPIT-zOJ1AV5O.js";import{p as H}from"./wardley-L42UT6IY-YAZPMKU5-CPfo7FjH.js";import{K as J,aC as Q,L as Y,aD as ee,O as te,aF as ae,b as s,af as w,N as ie,q as re,aA as se,al as ne,e as G,ak as oe,B as le,r as ce,an as de,G as pe}from"./Mermaid.vue_vue_type_script_setup_true_lang-xZ0KeRJI.js";import"./index-DfWs57p2.js";import"./modules/vue-mPEFS9mP.js";import"./modules/shiki-DqdPIzAT.js";import"./modules/file-saver-B7oFTzqn.js";var ge=pe.pie,C={sections:new Map,showData:!1},u=C.sections,D=C.showData,he=structuredClone(ge),ue=s(()=>structuredClone(he),"getConfig"),fe=s(()=>{u=new Map,D=C.showData,ce()},"clear"),me=s(({label:e,value:a})=>{if(a<0)throw new Error(`"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);u.has(e)||(u.set(e,a),w.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),ve=s(()=>u,"getSections"),xe=s(e=>{D=e},"setShowData"),Se=s(()=>D,"getShowData"),L={getConfig:ue,clear:fe,setDiagramTitle:ae,getDiagramTitle:te,setAccTitle:ee,getAccTitle:Y,setAccDescription:Q,getAccDescription:J,addSection:me,getSections:ve,setShowData:xe,getShowData:Se},we=s((e,a)=>{j(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),Ce={parse:s(async e=>{const a=await H("pie",e);w.debug(a),we(a,L)},"parse")},De=s(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),$e=De,ye=s(e=>{const a=[...e.values()].reduce((r,o)=>r+o,0),$=[...e.entries()].map(([r,o])=>({label:r,value:o})).filter(r=>r.value/a*100>=1);return de().value(r=>r.value).sort(null)($)},"createPieArcs"),Te=s((e,a,$,y)=>{w.debug(`rendering pie chart
`+e);const r=y.db,o=ie(),T=re(r.getConfig(),o.pie),A=40,n=18,p=4,c=450,d=c,f=se(a),l=f.append("g");l.attr("transform","translate("+d/2+","+c/2+")");const{themeVariables:i}=o;let[_]=ne(i.pieOuterStrokeWidth);_??=2;const b=T.textPosition,g=Math.min(d,c)/2-A,M=G().innerRadius(0).outerRadius(g),B=G().innerRadius(g*b).outerRadius(g*b);l.append("circle").attr("cx",0).attr("cy",0).attr("r",g+_/2).attr("class","pieOuterCircle");const h=r.getSections(),O=ye(h),N=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let m=0;h.forEach(t=>{m+=t});const k=O.filter(t=>(t.data.value/m*100).toFixed(0)!=="0"),v=oe(N).domain([...h.keys()]);l.selectAll("mySlices").data(k).enter().append("path").attr("d",M).attr("fill",t=>v(t.data.label)).attr("class","pieCircle"),l.selectAll("mySlices").data(k).enter().append("text").text(t=>(t.data.value/m*100).toFixed(0)+"%").attr("transform",t=>"translate("+B.centroid(t)+")").style("text-anchor","middle").attr("class","slice");const P=l.append("text").text(r.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText"),E=[...h.entries()].map(([t,S])=>({label:t,value:S})),x=l.selectAll(".legend").data(E).enter().append("g").attr("class","legend").attr("transform",(t,S)=>{const z=n+p,V=z*E.length/2,X=12*n,Z=S*z-V;return"translate("+X+","+Z+")"});x.append("rect").attr("width",n).attr("height",n).style("fill",t=>v(t.label)).style("stroke",t=>v(t.label)),x.append("text").attr("x",n+p).attr("y",n-p).text(t=>r.getShowData()?`${t.label} [${t.value}]`:t.label);const I=Math.max(...x.selectAll("text").nodes().map(t=>t?.getBoundingClientRect().width??0)),U=d+A+n+p+I,R=P.node()?.getBoundingClientRect().width??0,q=d/2-R/2,K=d/2+R/2,F=Math.min(0,q),W=Math.max(U,K)-F;f.attr("viewBox",`${F} 0 ${W} ${c}`),le(f,c,W,T.useMaxWidth)},"draw"),Ae={draw:Te},Ge={parser:Ce,db:L,renderer:Ae,styles:$e};export{Ge as diagram};
