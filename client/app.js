Accounts.ui.config({

});

Template.body.onCreated( function() {
    this.currentTab = new ReactiveVar( "dashboard" );
});

Template.body.events({
    'click .nav-item': function( event, template ) {
        var currentTab = event.target;

        template.currentTab.set( currentTab.getAttribute( "template" ) );
        document.getElementById("toggler").checked = false;

    },
    'click #options': function( event, template ) {
        var currentTab = event.target;

        template.currentTab.set( "options" );

    }
});

Template.body.helpers({
    tab: function () {
        return Template.instance().currentTab.get();
    },
});

Template.dashboard.helpers({
    lacksinfo: function(){
        var loc =Meteor.user().location;

        if(loc == null){ return true;}
        return false;
    },
    lackgroup: function(){
        var loc =Meteor.user().group;

        if(loc == undefined || loc == undefined ){ return true;}
        return false;
    },

    printDates: function(){

        var group = getGroup(Meteor.user());
        var dates = group.days;

        var str = ""
       for( var i = 0; i < 7; i++){
           if(dates[i].people) {

               str += dates[i].people;

           }

           else{
               str += "vacant";
           }
           if(dates[i].needers){
               var count = 0;
               for( var j = 0; j< dates[i].needers.length; j++){
                   console.log(Meteor.users.findOne({_id: dates[i].needers[j]}));
                   count += Meteor.users.findOne({_id: dates[i].needers[j]}).numberChildren;
               }
               str += count;

           }
           str += "  /  ";
       }
        return str;
    }


});

Template.guidelines.helpers({
   "getallusers" : function(group){

   }
});

Template.weekslider.helpers({
    "personcare" : function(day){
        var group = getGroup(Meteor.user());
        var dates = group.days;
        if(dates[day].people) {
            if (dates[day].people[0]) {
                return dates[day].people[0];
            }
        }
        return "No one!"
    },

    "numchildren" : function(day){
        var group = getGroup(Meteor.user());
        var dates = group.days;
        if(dates[day].needers) {
            if (dates[day].needers[0]) {
                var count = 0;

                for( var i = 0; i< dates[day].needers.length; i++){
                    var user = Meteor.users.findOne({_id: dates[day].needers[i]});
                    count += user.numberChildren;
                }

                return count;
            }
        }
        return "No one!"
    },

    "cost" : function(day){
        var group = getGroup(Meteor.user());
        var dates = group.days;

        if(dates[day].people) {
            if (dates[day].people[0]) {

                return Meteor.users.findOne({username:dates[day].people[0]}).fees;
            }

        }
        return "0";
    },

    "othercare" : function(day){
        var group = getGroup(Meteor.user());
        var dates = group.days;
        if(dates[day].people) {
            if (dates[day].people[1]) {
                return dates[day].people[1];
            }
        }
        return "No others";
    }
});

function getGroup(user){
    return Groups.findOne({name: user.groupname});
}

function validateGroup(name){
    return Groups.find({ name : name}).count();
}

Template.schedule.events({
   "submit #setday" : function(e,t){
       e.preventDefault();
       var form = e.target;
       var elements = form.elements;
       var ret = [];
       for(var i = 0; i< elements.length; i++){
           if(elements[i].tagName == "INPUT"){
               ret.push(elements[i].checked);
           }
       }
       Meteor.call("userdays", Meteor.userId(), ret);
       var ok = Meteor.call("setGroupDays", Meteor.user(), ret );
       alert("Success");
   },

    "submit #needday" : function(e,t){
        e.preventDefault();
        var form = e.target;
        var elements = form.elements;
        var ret = [];
        for(var i = 0; i< elements.length; i++){
            if(elements[i].tagName == "INPUT"){
                ret.push(elements[i].checked);
            }
        }
        Meteor.call("userneeds", Meteor.userId(), ret);
        var ok = Meteor.call("setNeedDays", Meteor.user(), ret );
        alert("Success");
    },

    "submit #setride" : function(e,t){
        e.preventDefault();
        var form = e.target;
        var elements = form.elements;
        var ret = [];
        for(var i = 0; i< elements.length; i++){
            if(elements[i].tagName == "INPUT"){
                ret.push(elements[i].checked);
            }
        }
        Meteor.call("userrides", Meteor.userId(), ret);
        var ok = Meteor.call("setGroupRides", Meteor.user(), ret );
        alert("Success");
    },

    "submit #needride" : function(e,t){
        e.preventDefault();
        var form = e.target;
        var elements = form.elements;
        var ret = [];
        for(var i = 0; i< elements.length; i++){
            if(elements[i].tagName == "INPUT"){
                ret.push(elements[i].checked);
            }
        }
        Meteor.call("needsride", Meteor.userId(), ret);
        var ok = Meteor.call("setNeedRides", Meteor.user(), ret );
        alert("Success");
    }

});



Template.infoform.events({
    "submit #userinfo": function (e, t) {

        e.preventDefault();

        var form = e.target;


        if (validateGroup(form.groupname.value) === 0) {
            alert("group not found");
            return;
        }
        ;

        Meteor.call("addData", Meteor.userId(),
            {

                name: form.name.value,
                location: {
                    city: form.city.value,
                    street: form.street.value,
                },
                groupid: form.groupname.value,
                fees: form.fees.value
            });

    },
});
Template.creategroup.events({
    "submit #creategroup" :function(e,t){

        e.preventDefault();

        var form = e.target;

        Meteor.call("addGroup",
            {

                name : form.name.value,
                location : {
                    city: form.city.value

                },
                users : [
                    Meteor.userId()
                ]
            });

    }
});

Template.addChildren.events({
    "submit #addkids" :function(e,t){

        e.preventDefault();
        var user = Meteor.user();

        var form = e.target;


           var data= {

                name : form.childname.value,
                age: form.childage.value,
                info: form.extra.value
            };
        if(user.children){
            children.push(data);
        }
        else{
            user.children = [data];
        }
        Meteor.call("addChild", user);

        return user;

    }
});



Deps.autorun(function(){
    Meteor.subscribe('userData');
    Meteor.subscribe('groupData');
});


Template.weekslider.events({
    "click .slide-left" : function(e,t){
        var ret = event.target;
        if (ret.tagName != 'DIV') {
            ret = ret.parentElement();
        }

        slider(-1, ret.nextElementSibling.nextElementSibling);

    },

    "click .slide-right" : function(e,t){
        var ret = event.target;
        if (ret.tagName != 'DIV') {
            ret = ret.parentElement();
        }

        slider(1, ret.nextElementSibling);

    }
})



function slider(dir, container) {
    console.log(container.className);
    var contain = container;

    var current = parseInt(container.getAttribute("current"));

    var max = parseInt(container.getAttribute("max")) - 1;

    if ((dir < 0 && current <= 0) || (dir > 0 && current >= max)) {

        return;
    }
    if (dir > 0) {
        current++;
        container.setAttribute("current", current);
    }
    if (dir < 0) {
        current--;
        container.setAttribute("current", current);
    }
    container.setAttribute("style", "margin-left : -" + current*80 + "vw;");

    if (current == max) {
        removeClass(container.previousElementSibling, "slide-active");
    } else if (current == 0) {
        removeClass(container.previousElementSibling.previousElementSibling, "slide-active");
    } else {
        addClass(container.previousElementSibling,"slide-active");
        addClass(container.previousElementSibling.previousElementSibling,"slide-active");

    }

    function addClass(el, className) {
        if (el.classList)
            el.classList.add(className)
        else if (!hasClass(el, className)) el.className += " " + className
    }

    function removeClass(el, className) {
        if (el.classList)
            el.classList.remove(className)
        else if (hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
            el.className=el.className.replace(reg, ' ')
        }
    }

}

Template.chatRoom.helpers({
    said : function(){

        return Texts.find({}, {sort: {created: -1}});

    }
});

Template.chatRoom.events({
    "submit .chatter": function(event) {

        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        var text = event.target.say.value;

        // Insert a task into the collection
        var user = Meteor.user().username;
        var res = Meteor.call("pushquote", [text, user]);
        // Clear form

            event.target.say.value = "";


    },
    "click .clearer": function(e){
        var valid = prompt("enter code");
        Meteor.call("removeAll",valid);

    }
});