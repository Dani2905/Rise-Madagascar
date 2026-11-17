import {JSDOM} from 'jsdom';
import assert from 'node:assert/strict';
import React from 'react';
import {MemoryRouter,Routes,Route} from 'react-router-dom';
import {AuthProvider,useAuth} from '../context/AuthContext';
import Login from '../pages/Login';
import Register from '../pages/Register';
const dom=new JSDOM('<html><body></body></html>',{url:'https://localhost/'});Object.assign(globalThis,{window:dom.window,document:dom.window.document,navigator:dom.window.navigator,localStorage:dom.window.localStorage,HTMLElement:dom.window.HTMLElement,FormData:dom.window.FormData,StorageEvent:dom.window.StorageEvent,WebSocket:dom.window.WebSocket,IS_REACT_ACT_ENVIRONMENT:true});window.scrollTo=()=>{};
let api, calls=[],failLogin=false, loggedOut=false;
const uid='c0fd8b4d-3500-4cbe-a03c-15b577de4e31';
const profile={id:uid,role:'individual',registration_data:{firstName:'Aina',lastName:'R',phone:'0340000000',city:'Tana'}};
const authUser={id:uid,email:'aina@test.mg',aud:'authenticated',role:'authenticated',app_metadata:{},user_metadata:{},created_at:'2025-01-01T00:00:00Z'};
const b64=o=>Buffer.from(JSON.stringify(o)).toString('base64url');
const token=`${b64({alg:'HS256',typ:'JWT'})}.${b64({sub:uid,exp:Math.floor(Date.now()/1000)+3600,role:'authenticated'})}.signature`;
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json','x-supabase-api-version':'2024-01-01'}})}
globalThis.fetch=async (input, options={})=>{const url=String(input);const body=options.body?JSON.parse(options.body):null;calls.push({url,method:options.method||'GET',body});
  if(url.includes('/auth/v1/signup')) return json({user:{...authUser,email:body.email},session:null});
  if(url.includes('/auth/v1/token?grant_type=password')) {if(failLogin)return json({code:400,error_code:'invalid_credentials',msg:'Invalid login credentials'},400);return json({access_token:token,token_type:'bearer',expires_in:3600,refresh_token:'test-refresh',user:authUser});}
  if(url.includes('/auth/v1/user')) return loggedOut?json({code:401,msg:'expired'},401):json(authUser);
  if(url.includes('/rest/v1/profiles')) return json(profile);
  if(url.includes('/auth/v1/logout')) {loggedOut=true;return json({});}
  throw Error('unexpected fetch '+url);
};
const Capture=()=>{api=useAuth();return React.createElement('span',{'data-testid':'state'},api.isLoading?'loading':api.user?`${api.user.email}:${api.user.role}`:'visitor')};
const Home=()=>React.createElement('p',null,'Profil ouvert');
let render;const mount=path=>render(React.createElement(MemoryRouter,{initialEntries:[path]},React.createElement(AuthProvider,null,React.createElement(Capture),React.createElement(Routes,null,React.createElement(Route,{path:'/login',element:React.createElement(Login)}),React.createElement(Route,{path:'/register',element:React.createElement(Register)}),React.createElement(Route,{path:'/profile',element:React.createElement(Home)})))));
async function main(){const {screen,fireEvent,cleanup,waitFor,act}=await import('@testing-library/react');render=(await import('@testing-library/react')).render;
// La fausse session locale ne doit jamais être considérée comme authentification Supabase.
localStorage.setItem('rise_session_token','forged');localStorage.setItem('rise_user_data',JSON.stringify({id:5,role:'company',firstName:'fake'}));mount('/login');await screen.findByText('visitor');assert.equal(localStorage.getItem('rise_session_token'),null);assert.equal(screen.queryByText('Comptes de démonstration'),null);assert.ok(screen.getByText(/Connexion Supabase/));
failLogin=true;fireEvent.change(screen.getByLabelText('E-mail'),{target:{value:'aina@test.mg'}});fireEvent.change(screen.getByLabelText('Mot de passe'),{target:{value:'wrongpassword'}});fireEvent.submit(screen.getByLabelText('Mot de passe').closest('form'));await screen.findByRole('alert');assert.match(screen.getByRole('alert').textContent,/incorrect/);assert.equal(screen.getByTestId('state').textContent,'visitor');
failLogin=false;fireEvent.change(screen.getByLabelText('Mot de passe'),{target:{value:'goodpassword'}});fireEvent.submit(screen.getByLabelText('Mot de passe').closest('form'));await screen.findByText('Profil ouvert');await waitFor(()=>assert.equal(screen.getByTestId('state').textContent,'aina@test.mg:individual'));assert.equal(JSON.parse(localStorage.getItem('rise_user_data')).id,uid);assert.equal(localStorage.getItem('rise_user_data').includes('goodpassword'),false);
act(()=>api.updateUser({firstName:'Local',role:'company',id:'forged'}));assert.equal(api.user.role,'individual');assert.equal(api.user.id,uid);assert.equal(api.user.firstName,'Local');
cleanup();mount('/profile');await waitFor(()=>assert.equal(screen.getByTestId('state').textContent,'aina@test.mg:individual'));assert.equal(api.user.firstName,'Local');await act(async()=>{api.logout();});await waitFor(()=>assert.equal(screen.getByTestId('state').textContent,'visitor'));assert.equal(localStorage.getItem('rise_user_data'),null);cleanup();
// Une inscription n'enregistre aucun mot de passe dans les métadonnées et attend la confirmation.
loggedOut=false;calls=[];mount('/register?type=individual');await screen.findByRole('heading',{name:/Rejoignez/});await waitFor(()=>assert.equal(screen.getByTestId('state').textContent,'visitor'));const change=(label,value)=>fireEvent.change(screen.getByLabelText(label),{target:{value}});
change(/Prénom/,'Lala');change(/^Nom/,'Raja');change(/Email de contact/,'lala@test.mg');change(/Téléphone/,'0340000000');change(/Ville/,'Antananarivo');change(/Quartier/,'Centre');change(/^Mot de passe/,'secretpass');change(/Confirmer/,'secretpass');fireEvent.click(screen.getByRole('checkbox'));fireEvent.submit(screen.getByRole('checkbox').closest('form'));await screen.findByRole('status');const signup=calls.find(c=>c.url.includes('/auth/v1/signup'));assert.ok(signup);assert.equal(signup.body.data.role,'individual');assert.equal(signup.body.data.registration.firstName,'Lala');assert.equal(JSON.stringify(signup.body.data).includes('secretpass'),false);assert.equal(screen.getByTestId('state').textContent,'visitor');cleanup();console.log('OK authentification Supabase simulée : inscription, confirmation, connexion, restauration, déconnexion, données locales et session forgée');}
main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)});
