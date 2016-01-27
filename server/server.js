Meteor.methods({
    "addData" : function(id,info){
        var result = Meteor.users.update({ _id: id },
            {$set: {

                username : info.name,
                location : info.location,
                groupname : info.groupid,
                daystoWork : info.days,
                children : info.children,
                numberChildren: 0,
                fees : info.fees,
            }});
        return result;
    },
    "addGroup" : function(info){
        var result = Groups.insert({

                name : info.name,
                location : info.location,
                users: info.users,
                days: [{}, {}, {}, {}, {}, {}, {}],
                ridedays: [{}, {}, {}, {}, {}, {}, {}]
            });

    },
    "userdays" : function(id, days){
        Meteor.users.update( {_id:id},
            {$set: {
                daystoWork: days
            }}
        );

    },

    "userrides" : function(id, days){
        Meteor.users.update( {_id:id},
            {$set: {
                daystoDrive: days
            }}
        );

    },

    "userneeds" : function(id, days){
        Meteor.users.update( {_id:id},
            {$set: {
                daysNeeded: days
            }}
        );

    },

    "needsride" : function(id, days){
        Meteor.users.update( {_id:id},
            {$set: {
                ridesNeeded: days
            }}
        );

    },

    "addChild" :function(user){
        Meteor.users.update( {_id: user._id},
            {$set: {
                numberChildren: user.numberChildren + 1
            }}
        );
    },

    "setGroupDays" : function(person, input){
        var group = Groups.findOne({name: person.groupname});
        var ret = [];
        for( var i =0; i< 7; i++){

                var obj = group.days[i];
                if(input[i] ) {
                    if (obj.people && obj.people.indexOf(person.username)< 0) {
                        obj.people.push(person.username);
                    }

                    else {
                        obj.people = [person.username];
                    }
                }
                if(!input[i] ) {
                     if (obj.people && obj.people.indexOf(person.username)> -1) {
                            obj.people.splice(obj.people.indexOf(person.username),1);
                      }
                    else{

                     }

                 }
                ret.push(obj);

        }


        return Groups.update( { name: person.groupname },
            {$set: {
                days: ret
            }}
        );


    },

    "setNeedDays" : function(person, input) {
        var group = Groups.findOne({name: person.groupname});
        var ret = [];
        for( var i =0; i< 7; i++){

            var obj = group.days[i];
            if(input[i] ) {
                if (obj.needers && obj.needers.indexOf(person._id)< 0) {
                    obj.needers.push(person._id);
                }

                else {
                    obj.needers = [person._id];
                }
            }
            if(!input[i] ) {
                if (obj.needers && obj.needers.indexOf(person._id)> -1) {
                    obj.needers.splice(obj.needers.indexOf(person._id),1);
                }
                else{

                }

            }
            ret.push(obj);

        }

        return Groups.update( { name: person.groupname },
            {$set: {
                days: ret
            }}
        );
    },

    "setGroupRides" : function(person, input){
        var group = Groups.findOne({name: person.groupname});
        var ret = [];
        for( var i =0; i< 7; i++){

            var obj = group.ridedays[i];
            if(input[i] ) {
                if (obj.people && obj.people.indexOf(person.username)< 0) {
                    obj.people.push(person.username);
                }

                else {
                    obj.people = [person.username];
                }
            }
            if(!input[i] ) {
                if (obj.people && obj.people.indexOf(person.username)> -1) {
                    obj.people.splice(obj.people.indexOf(person.username),1);
                }
                else{

                }

            }
            ret.push(obj);

        }


        return Groups.update( { name: person.groupname },
            {$set: {
                ridedays: ret
            }}
        );


    },

    "setNeedRides" : function(person, input) {
        var group = Groups.findOne({name: person.groupname});
        var ret = [];
        for( var i =0; i< 7; i++){

            var obj = group.ridedays[i];
            if(input[i] ) {
                if (obj.needers && obj.needers.indexOf(person._id)< 0) {
                    obj.needers.push(person._id);
                }

                else {
                    obj.needers = [person._id];
                }
            }
            if(!input[i] ) {
                if (obj.needers && obj.needers.indexOf(person._id)> -1) {
                    obj.needers.splice(obj.needers.indexOf(person._id),1);
                }
                else{

                }

            }
            ret.push(obj);

        }

        return Groups.update( { name: person.groupname },
            {$set: {
                ridedays: ret
            }}
        );
    },

    "getNumKids" :function(day){
        return day;

        var arr = day;

        var count = 0;
        for( var i = 0; i< arr.length; i++){
            count += Meteor.users.findOne({_id: arr[i]}).numberChildren;
        }
        return count;
    },
    "removeAll" : function(code){
        if(code === "unlockme"){
            Texts.remove({});
        }
    },
    "pushquote" : function(info){
        if(info[0] !== ""){
            Texts.insert({
                quote: info[0],
                person : info[1] ,
                created: new Date()// current time
            });
            return true;
        }

    }
});






Meteor.publish('userData', function() {
    if(!this.userId) return null;
    return Meteor.users.find(this.userId, {fields: {

        location: 1,
        groupname: 1,
        daystoWork: 1,
        children: 1,
        numberChildren: 1,
        fees : 1,
        daystoDrive: 1,
        ridesNeeded:1,
    }});
});

Meteor.publish('groupData', function() {
    if(!this.userId) return null;
    return Groups.find({}, {fields: {
        data: 1,
        location: 1,
        groupid: 1,
        daystoWork: 1,
        children: 1,
        fees : 1,
        ridedays : 1,
    }});
});