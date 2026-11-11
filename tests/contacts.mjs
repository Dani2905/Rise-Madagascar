import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { MessagingProvider } from '../context/MessagingContext';
import Messages from '../pages/Messages';
const dom=new JSDOM('<html><body></body></html>',{url:'http://localhost/'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,navigator:dom.window.navigator,localStorage:dom.window.localStorage,HTMLElement:dom.window.HTMLElement,FormData:dom.window.FormData,StorageEvent:dom.window.StorageEvent,IS_REACT_ACT_ENVIRONMENT:true});window.scrollTo=()=>{};window.confirm=()=>true;
const a={id:1,email:'alice@exemple.mg',firstName:'Alice',lastName:'A',role:'student'},b={id:2,email:'bob@exemple.mg',firstName:'Bob',lastName:'B',role:'student'},c={id:3,email:'co@exemple.mg',companyName:'Entreprise C',role:'company'},d={id:4,email:'dan@exemple.mg',firstName:'Dan',lastName:'D',role:'individual'},e={id:5,email:'eve@exemple.mg',firstName:'Eve',lastName:'E',role:'student'};
const m=(id,s,r,status)=>({id,senderId:s,receiverId:r,subject:'Échange '+id,content:'Contenu '+id,timestamp:'2026-01-01T00:00:00Z',read:false,requestStatus:status});
let render;const mount=()=>render(React.createElement(MemoryRouter,{initialEntries:['/messages']},React.createElement(AuthProvider,null,React.createElement(MessagingProvider,null,React.createElement(Routes,null,React.createElement(Route,{path:'/messages',element:React.createElement(Messages)}))))));
const session=u=>{localStorage.setItem('rise_user_data',JSON.stringify(u));localStorage.setItem('rise_session_token','test')};
async function main(){const {screen,fireEvent,cleanup,within}=await import('@testing-library/react');render=(await import('@testing-library/react')).render;
localStorage.setItem('rise_db_users',JSON.stringify([a,b,c,d,e]));localStorage.setItem('rise_messages',JSON.stringify([m('1',1,2,'accepted'),m('2',3,1,'accepted'),m('3',1,4,'pending'),m('4',1,5,'declined'),m('5',1,2,'accepted')]));session(a);mount();await screen.findByRole('heading',{name:'Boîte de réception'});fireEvent.click(screen.getByRole('button',{name:/Mes contacts/}));await screen.findByRole('heading',{name:'Mes contacts'});let section=screen.getByRole('heading',{name:'Mes contacts'}).parentElement;assert.equal(within(section).getAllByRole('listitem').length,2);assert.ok(within(section).getAllByText('Entreprise C').length);assert.equal(within(section).queryByText('Dan D'),null);assert.equal(within(section).queryByText('Eve E'),null);assert.equal(within(section).queryByText('bob@exemple.mg'),null);
fireEvent.change(screen.getByLabelText('Filtrer les contacts'),{target:{value:'student'}});assert.ok(within(section).getAllByText('Bob B').length);assert.equal(within(section).queryByText('Entreprise C'),null);fireEvent.change(screen.getByLabelText('Rechercher un contact'),{target:{value:'sans résultat'}});assert.ok(screen.getByText('Aucun contact ne correspond aux filtres'));fireEvent.change(screen.getByLabelText('Rechercher un contact'),{target:{value:'bob'}});
fireEvent.click(screen.getByRole('button',{name:'Bloquer Bob B'}));assert.ok(screen.getByText(/Bloqué par vous/));assert.ok(screen.getByRole('button',{name:'Débloquer Bob B'}));fireEvent.click(screen.getByRole('button',{name:'Débloquer Bob B'}));assert.equal(screen.queryByText(/Bloqué par vous/),null);fireEvent.click(screen.getByRole('button',{name:'Voir l’échange'}));await screen.findByRole('heading',{name:/Échange/});cleanup();
// La relation est réciproque ; les messages anciens seuls ne créent pas de contact.
session(b);mount();await screen.findByRole('heading',{name:'Boîte de réception'});fireEvent.click(screen.getByRole('button',{name:/Mes contacts/}));await screen.findAllByText('Alice A');cleanup();
session(d);mount();await screen.findByRole('heading',{name:'Boîte de réception'});fireEvent.click(screen.getByRole('button',{name:/Mes contacts/}));assert.ok(screen.getByText('Aucun contact accepté pour le moment'));cleanup();
// Naviguer depuis un brouillon demande confirmation et ne perd rien en cas de refus.
session(a);mount();await screen.findByRole('heading',{name:'Boîte de réception'});fireEvent.click(screen.getByRole('button',{name:'Nouveau message'}));fireEvent.change(screen.getByLabelText('Message'),{target:{value:'Brouillon'}});window.confirm=()=>false;fireEvent.click(screen.getByRole('button',{name:/Mes contacts/}));assert.equal(screen.getByLabelText('Message').value,'Brouillon');cleanup();
console.log('OK contacts : acceptation réciproque, catégories, recherche, blocage, échanges et brouillon');}
main().catch(e=>{console.error(e);process.exit(1)});
