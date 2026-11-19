// Native Higgsedit composition. Original MOVA wordmark is imported separately.
export default async ({project,frame,rect,text,path,media})=>{
  const p=await project({dir:'/home/user/mova-network',size:'1280x800',fps:24,background:'#111512'});
  const logo=await p.add('/home/user/mova-logo.png');
  const orange='#e45831',sand='#f6f2ee',ink='#111512';
  const drift=(n)=>[{property:'offsetY',keyframes:[{at:0,value:0},{at:6,value:n},{at:12,value:0}],easing:'ease-in-out'}];
  const pulse=(delay=0)=>[{property:'opacity',keyframes:[{at:0,value:.22},{at:delay+.8,value:.22},{at:delay+1.6,value:1},{at:delay+2.6,value:.22},{at:12,value:.22}],easing:'ease-in-out'}];
  const label=(s,x,y,w=250,size=22,color=ink)=>text(s,{x,y,width:w,height:48,fontFamily:'DM Sans',fontSize:size,fontWeight:700,color,lineHeight:1.1});
  const bar=(x,y,w,h=8,fill='#d8d0c6',anim)=>rect({x,y,width:w,height:h,fill,radius:4,animate:anim});
  const nodes=[];
  // Soft editorial grid, deliberately free of human figures and emoji icons.
  for(let x=70;x<1280;x+=76)for(let y=50;y<800;y+=76)nodes.push(rect({x,y,width:2,height:2,radius:1,fill:'#364037'}));
  const panels=[
    {x:68,y:62,title:'Foto + video',type:'photo'},
    {x:884,y:62,title:'Branding',type:'brand'},
    {x:68,y:302,title:'Marketing',type:'marketing'},
    {x:884,y:302,title:'Sitios web',type:'web'},
    {x:68,y:542,title:'Chatbots',type:'chat'},
    {x:884,y:542,title:'Automatizaciones',type:'flow'}
  ];
  panels.forEach((panel,i)=>{
    const cx=panel.x+164,cy=panel.y+94,edgeX=i%2?884:396;
    const d=`M 640 400 C ${i%2?800:480} 400 ${edgeX} ${cy} ${edgeX} ${cy}`;
    nodes.push(path({d,width:1280,height:800,fill:'none',stroke:{color:'#5d493b',width:2,cap:'round'}}));
    nodes.push(path({d,width:1280,height:800,fill:'none',stroke:{color:orange,width:3,cap:'round'},animate:pulse(i*.75)}));
    const content=[rect({width:328,height:190,radius:24,fill:sand}),label(panel.title,25,20,280,22)];
    if(panel.type==='photo'){
      content.push(rect({x:24,y:74,width:128,height:92,radius:10,fill:'#d99877'}),rect({x:168,y:74,width:136,height:92,radius:10,fill:'#242e29'}));
      content.push(path({x:24,y:74,d:'M 0 92 L 46 40 L 81 69 L 110 21 L 128 92 Z',width:128,height:92,fill:'#ad5c40'}));
      content.push(rect({x:184,y:130,width:12,height:18,fill:orange,radius:3}),bar(206,134,78,9,'#e8d9c5'));
    }
    if(panel.type==='brand'){
      content.push(label('Aa',25,74,145,67,orange),bar(185,87,104,10,'#111512'),bar(185,109,80),bar(185,132,104,22,orange));
    }
    if(panel.type==='marketing'){
      content.push(bar(25,145,42,18,orange),bar(83,118,42,45,'#b4bfb0'),bar(141,95,42,68,orange),bar(199,77,42,86,'#111512'));
    }
    if(panel.type==='web'){
      content.push(rect({x:25,y:72,width:278,height:92,fill:'#fff',radius:8}),bar(39,85,247,5,'#dfd8d1'));
      content.push(bar(39,106,113,13,orange,[{property:'scaleX',keyframes:[{at:0,value:.65},{at:4,value:1},{at:8,value:1},{at:12,value:.65}]}]),bar(39,129,96,5),bar(39,143,73,5),rect({x:181,y:102,width:108,height:49,radius:5,fill:'#e3ab8b'}));
    }
    if(panel.type==='chat'){
      content.push(rect({x:25,y:77,width:210,height:32,radius:12,fill:'#ded8ce'}),rect({x:82,y:123,width:221,height:34,radius:12,fill:orange}));
      content.push(bar(40,91,140,6,'#8d8b81'),bar(99,137,172,6,'#fff'));
    }
    if(panel.type==='flow'){
      content.push(bar(49,118,226,2,'#b6a293'));
      [42,143,244].forEach((x,j)=>content.push(rect({x,y:95,width:43,height:46,radius:12,fill:j===1?orange:'#d9d1c5',animate:pulse(j*.7)})));
    }
    nodes.push(frame({x:panel.x,y:panel.y,width:328,height:190,layout:'none',animate:drift(i%2?6:-6)},content));
  });
  nodes.push(frame({x:456,y:294,width:368,height:212,layout:'none',animate:drift(-4)},[
    rect({width:368,height:212,radius:40,fill:sand,shadow:{x:0,y:18,blur:45,color:'#00000055'}}),
    media({file:logo,x:42,y:52,width:284,height:76,fit:'contain'}),
    label('Tu marca, conectada.',31,150,306,20,'#59584f')
  ]));
  p.compose(nodes,{at:0,dur:12,name:'MOVA conecta todos tus servicios'});
  await p.frame(3,'renders/frame-3.png');
  await p.frame(8,'renders/frame-8.png');
  await p.render('renders/MOVA_Conecta_Servicios.mp4',{bitrate:1700000,shards:2,concurrency:2});
};
