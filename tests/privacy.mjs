import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { MessagingProvider, useMessaging } from '../context/MessagingContext';
import Messages from '../pages/Messages';
const dom = new JSDOM('<html><body></body></html>',{url:'http://localhost/'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,navigator:dom.window.navigator,localStorage:dom.window.localStorage,HTMLElement:dom.window.HTMLElement,FormData:dom.window.FormData,StorageEvent:dom.window.StorageEvent,IS_REACT_ACT_ENVIRONMENT:true});
window.confirm=()=>true;window.scrollTo=()=>{};
const a={id:11,email:'alice@test.mg',firstName:'Alice',lastName:'A',role:'student'},b={id:22,email:'bob@test.mg',firstName:'Bob',lastName:'B',role:'student'},c={id:33,email:'co@test.mg',companyName:'Co',role:'company'},d={id:44,email:'d@test.mg',firstName:'Dan',role:'individual'};
const read=k=>JSON.parse(localStorage.getItem(k)||'[]');const session=u=>{localStorage.setItem('rise_user_data',JSON.stringify(u));localStorage.setItem('rise_session_token','test');};
let api,render;const Capture=()=>{api=useMessaging();return null};
const mount=path=>render(React.createElement(MemoryRouter,{initialEntries:[path||'/messages']},React.createElement(AuthProvider,null,React.createElement(MessagingProvider,null,React.createElement(React.Fragment,null,React.createElement(Capture),React.createElement(Routes,null,React.createElement(Route,{path:'/messages',element:React.createElement(Messages)})))))));
async function main(){const {screen,fireEvent,cleanup,act}=await import('@testing-library/react');render=(await import('@testing-library/react')).render;
localStorage.setItem('rise_db_users',JSON.stringify([a,b,c,d]));session(a);mount();await screen.findByRole('heading',{name:'Boîte de réception'});
let r;act(()=>{r=api.sendMail('22','Collaboration','Bonjour Bob')});assert.equal(r.ok,true);const id=r.id;assert.equal(read('rise_messages')[0].requestStatus,'pending');act(()=>{r=api.sendMail('22','Suite','Encore')});assert.equal(r.ok,false);act(()=>{r=api.decideRequest(id,true)});assert.equal(r.ok,false);cleanup();
session(b);mount();await screen.findByText('Collaboration');fireEvent.click(screen.getByText('Collaboration'));assert.ok(screen.getByText('Demande de contact en attente'));fireEvent.click(screen.getByRole('button',{name:'Accepter la demande'}));assert.equal(read('rise_messages')[0].requestStatus,'accepted');fireEvent.click(screen.getByRole('button',{name:'Répondre'}));fireEvent.change(screen.getByLabelText('Message'),{target:{value:'Avec plaisir'}});fireEvent.submit(screen.getByLabelText('Message').closest('form'));await screen.findByText('Avec plaisir');assert.equal(read('rise_messages')[1].requestStatus,undefined);
act(()=>{r=api.setBlocked('11',true)});assert.equal(r.ok,true);act(()=>{r=api.sendMail('11','Test','Bloqué')});assert.equal(r.ok,false);cleanup();session(a);mount();await screen.findByRole('heading',{name:'Boîte de réception'});act(()=>{r=api.sendMail('22','Test','Bloqué aussi')});assert.equal(r.ok,false);cleanup();
session(b);mount();await screen.findByRole('heading',{name:'Boîte de réception'});fireEvent.click(screen.getByText('Réglages de confidentialité'));assert.ok(screen.getAllByText('Alice A').length);fireEvent.click(screen.getByRole('button',{name:'Débloquer'}));act(()=>{r=api.sendMail('11','Reprise','Bonjour')});assert.equal(r.ok,true);act(()=>{r=api.setPrivacy('nobody')});assert.equal(r.ok,true);cleanup();
session(c);mount();await screen.findByRole('heading',{name:'Boîte de réception'});act(()=>{r=api.sendMail('22','Demande','Bonjour')});assert.equal(r.ok,false);cleanup();
session(b);mount();await screen.findByRole('heading',{name:'Boîte de réception'});act(()=>{r=api.setPrivacy('projects')});assert.equal(r.ok,true);localStorage.setItem('rise_custom_projects',JSON.stringify([{id:101,ownerId:22,title:'Projet de Bob'}]));cleanup();
session(c);mount('/messages?partner=22&project=101');await screen.findByText('Projet de Bob');act(()=>{r=api.sendMail('22','Question','Bonjour')});assert.equal(r.ok,false);act(()=>{r=api.sendMail('22','Question','Bonjour',undefined,'999')});assert.equal(r.ok,false);act(()=>{r=api.sendMail('22','Question','Bonjour',undefined,'101')});assert.equal(r.ok,true);const request=r.id;cleanup();
session(b);mount();await screen.findByText('Question');fireEvent.click(screen.getByText('Question'));assert.ok(screen.getByText('Projet de Bob'));fireEvent.click(screen.getByRole('button',{name:'Signaler'}));assert.equal(read('rise_mail_reports').length,1);assert.match(screen.getByRole('status').textContent,/Aucune équipe/);fireEvent.click(screen.getByRole('button',{name:'Refuser la demande'}));assert.equal(read('rise_messages').find(m=>m.id===request).requestStatus,'declined');cleanup();
session(c);mount();await screen.findByRole('heading',{name:'Boîte de réception'});act(()=>{r=api.sendMail('22','Encore','Bonjour',undefined,'101')});assert.equal(r.ok,false);act(()=>{r=api.setPrivacy('projects')});assert.equal(r.ok,false);cleanup();
// Réglages corrompus et stockage indisponible : ne jamais contourner ni écraser.
session(d);localStorage.setItem('rise_mail_privacy','{bad');mount();await screen.findByRole('alert');act(()=>{r=api.sendMail('11','Objet','Texte')});assert.equal(r.ok,false);act(()=>{r=api.setPrivacy('nobody')});assert.equal(r.ok,false);assert.equal(localStorage.getItem('rise_mail_privacy'),'{bad');cleanup();
console.log('OK confidentialité : demandes, consentement, refus, projet, blocage, signalement local et erreurs');}
main().catch(e=>{console.error(e);process.exit(1)});
