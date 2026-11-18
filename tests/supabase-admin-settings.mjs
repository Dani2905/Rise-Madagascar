import {JSDOM} from 'jsdom';
import assert from 'node:assert/strict';
import React,{useState} from 'react';
import AdminProfileSettings from '../components/admin/AdminProfileSettings';
import {getAdminAvatar,getAdminFirstName} from '../utils/adminProfile';
const dom=new JSDOM('<html><body></body></html>',{url:'https://localhost/'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,navigator:dom.window.navigator,localStorage:dom.window.localStorage,HTMLElement:dom.window.HTMLElement,FormData:dom.window.FormData,StorageEvent:dom.window.StorageEvent,WebSocket:dom.window.WebSocket,IS_REACT_ACT_ENVIRONMENT:true});
const JPEG='data:image/jpeg;base64,/9j/AAAA';
URL.createObjectURL=()=> 'blob:mock'; URL.revokeObjectURL=()=>{};
globalThis.Image=class {naturalWidth=300;naturalHeight=200;set src(v){queueMicrotask(()=>this.onload())}};
dom.window.HTMLCanvasElement.prototype.getContext=function(){return {drawImage:()=>{}}};
dom.window.HTMLCanvasElement.prototype.toDataURL=function(){return JPEG};
const id='c0fd8b4d-3500-4cbe-a03c-15b577de4e31', user={id,email:'admin@example.mg',aud:'authenticated',role:'authenticated',app_metadata:{},user_metadata:{},created_at:'2025-01-01T00:00:00Z'};
const b64=o=>Buffer.from(JSON.stringify(o)).toString('base64url'),token=`${b64({alg:'HS256',typ:'JWT'})}.${b64({sub:id,exp:Math.floor(Date.now()/1000)+3600,role:'authenticated'})}.signature`;
let avatar=null,firstName='',calls=[],writes=0;const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json','x-supabase-api-version':'2024-01-01'}});
globalThis.fetch=async(input,opts={})=>{const url=String(input),body=opts.body?JSON.parse(opts.body):{};calls.push({url,method:opts.method,body});
 if(url.includes('/auth/v1/token?grant_type=password')) return body.password==='ancienpass'?json({access_token:token,token_type:'bearer',expires_in:3600,refresh_token:'temp-refresh',user}):json({code:400,error_code:'invalid_credentials',msg:'Invalid login credentials'},400);
 if(url.includes('/auth/v1/user') && opts.method==='PUT'){writes++;assert.equal(body.password,'nouveaupass');return json(user)}
 if(url.includes('/auth/v1/user'))return json(user);
 if(url.includes('/auth/v1/logout'))return json({});
 if(url.includes('/rpc/crm_get_own_first_name')){assert.equal(body.p_expected_uid,id);return json(firstName)}
 if(url.includes('/rpc/crm_set_own_first_name')){assert.equal(body.p_expected_uid,id);firstName=body.p_first_name.trim();return json(firstName)}
 if(url.includes('/rpc/crm_get_own_avatar'))return json(avatar);
 if(url.includes('/rpc/crm_set_own_avatar')){assert.equal(body.p_expected_uid,id);avatar=body.p_data_url;return json(null)}
 throw Error('unexpected fetch '+url);
};
localStorage.setItem('rise-supabase-auth',JSON.stringify({access_token:token,token_type:'bearer',expires_at:Math.floor(Date.now()/1000)+3600,expires_in:3600,refresh_token:'main-refresh',user}));
function Wrapper(){const [value,setValue]=useState(null),[name,setName]=useState('');return React.createElement(AdminProfileSettings,{userId:id,email:user.email,avatar:value,onAvatarChanged:setValue,firstName:name,firstNameError:'',onFirstNameChanged:setName,onRetryFirstName:()=>{}})}
async function main(){const {render,screen,fireEvent,waitFor,cleanup}=await import('@testing-library/react');render(React.createElement(Wrapper));
const name=screen.getByLabelText('Prénom');fireEvent.change(name,{target:{value:'  Tiana  '}});fireEvent.click(screen.getByRole('button',{name:'Enregistrer le prénom'}));await screen.findByText('Prénom enregistré.');assert.equal(name.value,'Tiana');assert.equal(await getAdminFirstName(id),'Tiana');
const photo=screen.getByLabelText('Choisir une photo');fireEvent.change(photo,{target:{files:[new dom.window.File(['x'],'bad.svg',{type:'image/svg+xml'})]}});await screen.findByText(/Choisissez une image JPEG/);assert.equal(calls.some(c=>c.url.includes('crm_set_own_avatar')),false);
fireEvent.change(photo,{target:{files:[new dom.window.File(['fake'],'photo.png',{type:'image/png'})]}});await screen.findByRole('button',{name:'Enregistrer la photo'});fireEvent.click(screen.getByRole('button',{name:'Enregistrer la photo'}));await screen.findByText('Photo de profil enregistrée.');assert.equal(avatar,JPEG);assert.equal(await getAdminAvatar(id),JPEG);assert.ok(screen.getByAltText('Votre photo administrateur'));
fireEvent.click(screen.getByRole('button',{name:'Supprimer la photo'}));await screen.findByText('Photo de profil supprimée.');assert.equal(avatar,null);
const current=screen.getByLabelText('Mot de passe actuel'),next=screen.getByLabelText('Nouveau mot de passe'),confirm=screen.getByLabelText('Confirmer le nouveau mot de passe');
fireEvent.change(current,{target:{value:'incorrect'}});fireEvent.change(next,{target:{value:'nouveaupass'}});fireEvent.change(confirm,{target:{value:'nouveaupass'}});fireEvent.submit(current.closest('form'));await screen.findByText('Le mot de passe actuel est incorrect.');assert.equal(writes,0);
fireEvent.change(current,{target:{value:'ancienpass'}});fireEvent.submit(current.closest('form'));await screen.findByText(/Mot de passe mis à jour/);assert.equal(writes,1);assert.equal(current.value,'');assert.equal(next.value,'');assert.equal(JSON.parse(localStorage.getItem('rise-supabase-auth')).refresh_token,'main-refresh');assert.equal(localStorage.getItem('rise-password-verification'),null);
cleanup();console.log('OK profil admin : photo privée, validation, suppression, mot de passe actuel et session isolée');}
main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)});
