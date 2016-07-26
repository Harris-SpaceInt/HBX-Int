"use strict";var app=angular.module("email",["myApp"]);app.controller("emailCtrl",function(a,e,n,t,r,d){a.addManager=[{email:"",name:"",unit:"",department:"",phone:""}],a.database=t,a.sharedData=n,a.dropdown=r,a.validate=d,a.managerExists=!1,a.createAccount=!1,a.pageInit=function(){a.sharedData.loggedIn()&&(a.sharedData.checkAdmin()?e.location.href="#!/display":e.location.href="#!/previous"),a.database.getManagersFromDatabase()},a.create=function(){a.createAccount=!0},a.cancel=function(){a.clearManager(),a.createAccount=!1},a.autoFill=function(){var e=a.addManager[0].email;if(null!=e){e===n.adminString&&(a.sharedData.setAdmin(),a.submit(a.sharedData.globalManager[0]));var t=a.findManager(e);a.managerExists=!(-1===t),a.managerExists?(a.addManager[0].name=a.database.managers[t].name,a.addManager[0].unit=a.database.managers[t].unit,a.addManager[0].department=a.database.managers[t].department,a.addManager[0].phone=a.database.managers[t].phone):(a.addManager[0].name="",a.addManager[0].unit="",a.addManager[0].department="",a.addManager[0].phone="")}},a.findManager=function(e){for(var n=0;n<a.database.managers.length;n++)if(a.database.managers[n].email.toLowerCase()===e.toLowerCase())return n;return-1},a.clearManager=function(){a.addManager[0].email="",a.addManager[0].name="",a.addManager[0].unit="",a.addManager[0].department="",a.addManager[0].phone=""},a.redirect=function(){var r=t.getManagerByEmail(n.globalManager[0].email);r.then(function(n){a.managerExists=null!==n,a.managerExists?e.location.href="#!/previous":e.location.href="#!/entry"})},a.submit=function(){if(a.sharedData.checkAdmin())e.location.href="#!/display";else{a.addManager[0].email=a.addManager[0].email.toLowerCase();var n=a.addManager[0];if(a.validate.validateField(n.name))if(a.validate.validateField(n.unit))if(a.validate.validateField(n.department)){var t=n.email,r=n.phone;a.validate.validatePhone(r)&&a.validate.validateEmail(t)?(a.sharedData.setGlobalManager(angular.copy(n)),a.addManager.splice(0,1),a.redirect()):a.validatePhone(r)?alert("Invalid email"):alert("Invalid phone")}else alert("Invalid department");else alert("Invalid unit");else alert("Invalid name")}},a.pageInit()});