import {JSDOM} from 'jsdom';
import assert from 'node:assert/strict';
import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import UserMenu from '../components/navbar/UserMenu';
import MobileMenu from '../components/navbar/MobileMenu';
const dom = new JSDOM('<html><body></body></html>',{url:'https://localhost/'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,navigator:dom.window.navigator,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true});
async function main(){
 const {render,screen,cleanup}=await import('@testing-library/react');
 const user={role:'admin',firstName:'Administration',lastName:'',email:'test@example.com'};
 const common={isLoggedIn:true,user,unreadTotal:0,handleLogout:()=>{},getInitials:()=> 'AD',getSettingsLink:()=>'/dashboard?tab=settings'};
 render(React.createElement(MemoryRouter,null,React.createElement(UserMenu,{...common,isProfileOpen:true,profileRef:React.createRef(),toggleProfileMenu:()=>{},closeProfileMenu:()=>{}})));
 assert.ok(screen.getByText('Administrateur'));assert.ok(screen.getByText('Administration CRM'));assert.equal(screen.queryByText('Particulier'),null);assert.equal(screen.queryByText('Messagerie'),null);assert.equal(screen.queryByText('Paramètres'),null);assert.equal(screen.getByText('Administration CRM').closest('a').getAttribute('href'),'/admin');cleanup();
 render(React.createElement(MemoryRouter,null,React.createElement(MobileMenu,{...common,isOpen:true,onClose:()=>{}})));
 assert.ok(screen.getByText('Administrateur'));assert.ok(screen.getByText('Administration CRM'));assert.equal(screen.queryByText('Particulier'),null);assert.equal(screen.queryByText('Messagerie'),null);assert.equal(screen.queryByText('Paramètres'),null);cleanup();
 console.log('OK compte administratif : menus ordinateur et mobile sans profil particulier');
}
main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)});
