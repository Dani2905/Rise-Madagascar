import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { MessagingProvider } from '../context/MessagingContext';
import Resources from '../pages/Resources';
import ProjectDetails from '../pages/ProjectDetails';
import { getPublicProjects } from '../utils/projects';
const dom=new JSDOM('<html><body></body></html>',{url:'http://localhost/'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,navigator:dom.window.navigator,localStorage:dom.window.localStorage,HTMLElement:dom.window.HTMLElement,FormData:dom.window.FormData,StorageEvent:dom.window.StorageEvent,IS_REACT_ACT_ENVIRONMENT:true});window.scrollTo=()=>{};
async function main(){const {render,screen,fireEvent,cleanup}=await import('@testing-library/react');localStorage.clear();localStorage.setItem('rise_custom_projects',JSON.stringify([{id:123,ownerId:55,title:'Projet local',student:'Porteur',fundraising:{enabled:true,goal:1000,methods:[{provider:'MVola',number:'0340000000'}]}}]));assert.equal(getPublicProjects().find(p=>p.id===123).fundraising,undefined);render(React.createElement(MemoryRouter,{initialEntries:['/resources?q=test']},React.createElement(AuthProvider,null,React.createElement(MessagingProvider,null,React.createElement(Routes,null,React.createElement(Route,{path:'/resources',element:React.createElement(Resources)}),React.createElement(Route,{path:'/projects/:id',element:React.createElement(ProjectDetails)}))))));
await screen.findByRole('heading',{name:'Projets étudiants'});fireEvent.click(screen.getByRole('link',{name:'Voir un exemple complet'}));await screen.findByRole('heading',{name:'Mada Potager'});assert.ok(screen.getByText(/Projet fictif présenté/));for(const heading of ['Présentation du projet','Le Problème','La Solution','Roadmap','L’équipe'])assert.ok(screen.getByRole('heading',{name:heading}));assert.ok(screen.getByText(/Budget fictif/));assert.equal(screen.queryByText(/cagnotte/i),null);assert.equal(screen.queryByText(/Mobile Money/i),null);assert.equal(screen.queryByRole('button',{name:'Proposer un soutien'}),null);fireEvent.click(screen.getByRole('link',{name:'Retour aux projets'}));await screen.findByRole('heading',{name:'Projets étudiants'});assert.equal(screen.getByLabelText('Rechercher un projet').value,'test');cleanup();console.log('OK exemple complet sans cagnotte et retour ; anciennes données non exposées');}
main().catch(e=>{console.error(e);process.exit(1)});
