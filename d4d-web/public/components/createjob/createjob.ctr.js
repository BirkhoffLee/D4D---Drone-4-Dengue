(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('createjobController', function (auth, $state, $mdToast, NgMap) {
        
        var vm = this;
        
        vm.capturing_area = "";
        vm.selectedValue = "";
        vm.capturing_date = "";
        vm.showToast = showToast;
        vm.saveSelectedValue = saveSelectedValue;
        vm.sendData = sendData;
        vm.getPolygonCoords = getPolygonCoords;
        vm.map;
        vm.latitudeArray = [];
        vm.longitudeArray = [];
        vm.requestingTypeList = [{id:0,name:"Dengue Monitoring"},{id:1,name:"Other"}];
        vm.triangleCoords = [
            new google.maps.LatLng(7.0873, 80.0144),
            new google.maps.LatLng(6.8018, 79.9227),
            new google.maps.LatLng(6.0535, 80.2210),     
            new google.maps.LatLng(7.2906, 80.6337)              
        ];
        
        // Styling & Controls
        vm.myPolygon = new google.maps.Polygon({
            paths: vm.triangleCoords,
            draggable: true, // turn off if it gets annoying
            editable: true,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });
        
        function getPolygonCoords() {
            var len = vm.myPolygon.getPath().getLength();
            vm.latitudeArray = [];
            vm.longitudeArray = [];
            
            for (var i = 0; i < len; i++) {
                var tempString = vm.myPolygon.getPath().getAt(i).toUrlValue(5);
                var tempArray = tempString.split(",");
                vm.latitudeArray.push(tempArray[0]);
                vm.longitudeArray.push(tempArray[1]);
            }
            console.log(vm.latitudeArray);
            console.log(vm.longitudeArray);
        }
        
        //vm.ne, vm.sw, vm.a1, vm.a2;
        NgMap.getMap().then(function(map) {
            //console.log('map', map);
            vm.myPolygon.setMap(map);
            vm.map = map;
        });
  
        /*vm.boundsChanged = function() {
            vm.ne = this.getBounds().getNorthEast();
            vm.sw = this.getBounds().getSouthWest();
            console.log(this.getBounds());
            console.log(this);
            // alert(this.getBounds());
            //vm.map.showInfoWindow('foo', this.getBounds());
        };*/
        
        function showToast(message) {
            $mdToast.show(
                $mdToast.simple()
                .content(message)
                .hideDelay(3000)
            );
        }
        
        console.log("createjobController");
        
        function saveSelectedValue(selectValue) {
            console.log(selectValue);
        }
        
        function sendData(selectedValue, capturing_date) {
            vm.selectedValue = selectedValue;
            vm.capturing_date = capturing_date;
            
            if(vm.selectedValue != null && vm.capturing_date != null) {
                vm.showToast("Send the request"); 
                vm.getPolygonCoords();
                
                /*Get the highest job id*/
                var processingJobsData = firebase.database().ref('jobs/processingjobs');
                var processingNumArray = [];
                processingJobsData.on('value', function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        processingNumArray.push((childSnapshot.key).substr(1));
                        console.log(processingNumArray);
                    });
                });
                
                /*firebase.database().ref('jobs/processingjobs/p010').set({
                    Area: "Piliyandala",
                    Job_ID: "p010",
                    Requester_ID: "dp1"
                });*/
            } else {
                vm.showToast("Fill all fields");
            }            
        }
        
       /* vm.onMapOverlayCompleted = function(e){
            console.log(e.type);
        }*/
        
        /*function saveSelectedValue(selectValue) {
            console.log(selectValue);

            firebase.database().ref('users/' + vm.gettingID).set({
                username: vm.gettingName,
                profile: selectValue
            });

            var siteURL = (window.location.href).replace("profile", "");
            window.location = siteURL;
            location.reload();
        }*/
    });

})();