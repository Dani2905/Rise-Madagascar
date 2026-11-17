import {JSDOM} from 'jsdom';
import assert from 'node:assert/strict';
import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {AuthProvider} from '../context/AuthContext';
import {SubscriptionProvider} from '../context/SubscriptionContext';
import SubscriptionCard from '../components/subscription/SubscriptionCard';
import AdminDashboard from '../pages/AdminDashboard';
import {addCalendarMonth, canPerformAction, formatSubscriptionRemaining, getSubscriptionStatus, isSubscriptionActive} from '../utils/subscription';
import {getAdminOverview} from '../utils/adminOverview';
const dom=new JSDOM('<html><body></body></html>',{url:'http://localhost/'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,navigator:dom.window.navigator,localStorage:dom.window.localStorage,HTMLElement:dom.window.HTMLElement,FormData:dom.window.FormData,StorageEvent:dom.window.StorageEvent,IS_REACT_ACT_ENVIRONMENT:true});
assert.equal(addCalendarMonth(new Date('2025-01-31T10:00:00Z')).toISOString(),'2025-02-28T10:00:00.000Z');
assert.equal(addCalendarMonth(new Date('2024-01-31T10:00:00Z')).toISOString(),'2024-02-29T10:00:00.000Z');
const fixed=Date.parse('2026-01-01T00:00:00Z');
for(const role of ['student','company','individual']) {
 const u={role,hasSubscription:true,subscription:{role,mode:'demo',startsAt:new Date(fixed).toISOString(),expiresAt:new Date(fixed+86400000+3600000+120000).toISOString()}};
 assert.equal(getSubscriptionStatus(u,fixed-1),'scheduled');assert.equal(getSubscriptionStatus(u,fixed),'active');assert.equal(formatSubscriptionRemaining(u.subscription.expiresAt,fixed),'1 j 1 h');assert.equal(getSubscriptionStatus(u,Date.parse(u.subscription.expiresAt)),'expired');assert.equal(isSubscriptionActive(u,Date.parse(u.subscription.expiresAt)),false);
 assert.equal(canPerformAction(u,role==='student'?'publishProject':'publishOffer',fixed),true);assert.equal(canPerformAction(u,role==='student'?'publishProject':'publishOffer',Date.parse(u.subscription.expiresAt)),false);
}
assert.equal(formatSubscriptionRemaining(new Date(fixed+3600000+120000).toISOString(),fixed),'1 h 2 min');assert.equal(formatSubscriptionRemaining(new Date(fixed+500).toISOString(),fixed),'moins d’une minute');assert.equal(getSubscriptionStatus({role:'student',hasSubscription:true,subscription:{role:'student',mode:'demo',startsAt:'erreur',expiresAt:'erreur'}},fixed),'invalid');assert.equal(getSubscriptionStatus({role:'student',hasSubscription:false},fixed),'inactive');
async function main(){const {render,screen,cleanup,waitFor,within,fireEvent}=await import('@testing-library/react');let now=Date.now();const student={id:50,role:'student',firstName:'Aina',lastName:'R',email:'a@test.mg',hasSubscription:true,subscription:{role:'student',mode:'demo',startsAt:new Date(now-60000).toISOString(),expiresAt:new Date(now+700).toISOString()}};localStorage.clear();localStorage.setItem('rise_db_users',JSON.stringify([student]));localStorage.setItem('rise_user_data',JSON.stringify(student));localStorage.setItem('rise_session_token','token');
render(React.createElement(MemoryRouter,null,React.createElement(AuthProvider,null,React.createElement(SubscriptionProvider,null,React.createElement(SubscriptionCard,{data:student,onUpdate:()=>{}})))));assert.ok(screen.getByText('Démonstration active'));assert.ok(screen.getByText(/Temps restant : moins d’une minute/));await waitFor(()=>assert.ok(screen.getByText('Démonstration expirée')),{timeout:3000});assert.ok(screen.getByText(/Expirée le/));assert.equal(canPerformAction(student,'publishProject'),false);cleanup();
// Le tableau admin reste agrégé et change à l'échéance sans recharger la page.
now=Date.now();const adminStudent={...student,subscription:{...student.subscription,startsAt:new Date(now-60000).toISOString(),expiresAt:new Date(now+700).toISOString()}};localStorage.setItem('rise_db_users',JSON.stringify([adminStudent]));const summary=getAdminOverview();assert.equal(summary.accounts.active,1);assert.equal(summary.accounts.expiringSoon,1);assert.equal(summary.accounts.expired,0);render(React.createElement(MemoryRouter,null,React.createElement(AdminDashboard)));assert.ok(screen.getByRole('button',{name:/Abonnements actifs : 1/}));await waitFor(()=>assert.ok(screen.getByRole('button',{name:/Abonnements actifs : 0/})),{timeout:3000});const nav=screen.getByRole('navigation',{name:'Navigation administration'});fireEvent.click(within(nav).getByRole('button',{name:'Abonnements'}));await waitFor(()=>assert.ok(screen.getByText('Abonnements expirés')));assert.equal(getAdminOverview().accounts.expired,1);cleanup();console.log('OK échéances : mois calendaire, rôles, seuil exact, compte à rebours, renouvellement et statistiques locales');}
main().catch(e=>{console.error(e);process.exit(1)});
