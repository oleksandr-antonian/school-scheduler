import{u as E,r as y,c as u,a as v,b as o,w as p,F as B,f as d,g as m}from"./index-CkQGRKbG.js";import{u as I}from"./classStore-DQ1Ihgyy.js";import{v as U}from"./v4-C6aID195.js";const j={class:"flex items-center justify-between"},N={key:0,class:"card"},S={key:0,class:"flex items-center justify-end gap-3"},T={key:1,class:"flex items-center justify-end gap-3"},$={key:1,class:"flex items-center flex-col bg-gray-100 my-8 rounded p-8"},M={__name:"ClassListView",setup(L){const g=E(),a=I(),C=y(a.classes),c=y([]),r=(e,s=!0)=>{c.value=s?[...c.value,a.classes.find(n=>n.id===e)]:c.value.filter(n=>n.id!==e)},x=({newData:e,index:s})=>{a.updateClass(s,e),r(e.id,!1)},b=({data:e})=>{r(e.id,!1)},k=e=>r(e.id),_=()=>{const e={id:U(),name:"",maxLessonsPerDay:6};a.addClass(e),r(e.id)},w=(e,s)=>{g.require({target:e.target,message:`Ви впевнені, що хочете видалити клас "${s.name}"?`,icon:"pi pi-exclamation-triangle",rejectProps:{label:"Ні",severity:"secondary",outlined:!0},acceptProps:{label:"Так"},accept:()=>h(s.id)})},h=e=>{const s=a.classes.findIndex(n=>n.id===e);s!==-1&&a.removeClass(s),r(e,!1)},V=e=>c.value.some(s=>s.id===e);return(e,s)=>{const n=d("Button"),P=d("InputText"),f=d("Column"),R=d("InputNumber"),z=d("ConfirmPopup"),D=d("DataTable");return m(),u(B,null,[v("div",j,[s[1]||(s[1]=v("h1",{class:"text-2xl font-bold"},"Класи",-1)),o(n,{onClick:_,icon:"pi pi-plus",label:"Додати клас",iconPos:"right",size:"small"})]),C.value.length?(m(),u("div",N,[o(D,{editingRows:c.value,"onUpdate:editingRows":s[0]||(s[0]=l=>c.value=l),value:C.value,editMode:"row",dataKey:"id"},{default:p(()=>[o(f,{field:"name",header:"Назва класу",style:{width:"25%"}},{editor:p(({data:l,field:i})=>[o(P,{modelValue:l[i],"onUpdate:modelValue":t=>l[i]=t,placeholder:"Введіть назву класу",fluid:""},null,8,["modelValue","onUpdate:modelValue"])]),_:1}),o(f,{field:"maxLessonsPerDay",header:"Макс. кількість уроків на день",style:{width:"25%"}},{editor:p(({data:l,field:i})=>[o(R,{modelValue:l[i],"onUpdate:modelValue":t=>l[i]=t,placeholder:"Макс. кількість уроків",min:"3",max:"7",fluid:""},null,8,["modelValue","onUpdate:modelValue"])]),_:1}),o(f,{header:"",style:{width:"20%","text-align":"center"}},{body:p(({data:l,index:i})=>[V(l.id)?(m(),u("div",T,[o(n,{onClick:t=>x({newData:l,index:i}),severity:"secondary",icon:"pi pi-check",size:"small","aria-label":"Save"},null,8,["onClick"]),o(n,{onClick:t=>b({data:l}),severity:"secondary",icon:"pi pi-times",size:"small","aria-label":"Cancel"},null,8,["onClick"])])):(m(),u("div",S,[o(z),o(n,{onClick:t=>k(l),severity:"secondary",icon:"pi pi-pencil",size:"small","aria-label":"Edit"},null,8,["onClick"]),o(n,{onClick:t=>w(t,l),severity:"secondary",icon:"pi pi-trash",size:"small","aria-label":"Delete"},null,8,["onClick"])]))]),_:1})]),_:1},8,["editingRows","value"])])):(m(),u("div",$,[s[2]||(s[2]=v("p",{class:"mb-4"},"Ви ще не додали жодного класу",-1)),o(n,{onClick:_,icon:"pi pi-plus",label:"Додати клас",iconPos:"right",size:"small"})]))],64)}}};export{M as default};
