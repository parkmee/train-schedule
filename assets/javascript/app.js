$(document).ready(function(){
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDJ9v4tSZ43vWLLUkVfsKXo2hURB36EczQ",
        authDomain: "fir-demo20180922.firebaseapp.com",
        databaseURL: "https://fir-demo20180922.firebaseio.com",
        projectId: "fir-demo20180922",
        storageBucket: "fir-demo20180922.appspot.com",
        messagingSenderId: "954494375323"
    };

    firebase.initializeApp(config);

    const db = firebase.database();

    // Set initial variables
    var trainName = "";
    var destination = "";
    var trainStart = "";
    var trainFreq = "";
    var trainDetails = [];
    
    // On click of submit button, store input values to cloud storage
    $("#submit").on("click", function () {
    
        trainName = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        trainStart = $("#train-start").val().trim();
        trainFreq = $("#train-freq").val().trim();
    
        db.ref('train-schedule').push({
            trainName,
            destination,
            trainStart,
            trainFreq,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    });

    // On addition of value to cloud storage, calculate next arrival and minutes away and populate train schedule table
    db.ref('train-schedule').on("child_added", function(childSnapshot){
        const sv = childSnapshot.val();
        
        console.log(sv.trainName);
        trainName = sv.trainName;
        destination = sv.destination;
        trainFreq = sv.trainFreq;
        trainStart = sv.trainStart;

        startConvert = moment(trainStart, "HH:mm");
        const now = moment();
        const diffTime = now.diff(moment(startConvert), "minutes");
        const minAway = trainFreq - (diffTime % trainFreq);
        const nextArrival = now.add(minAway, "minutes").format("hh:mm");
    
        $("tbody").prepend(
            `
            <tr>
                <td class="text-center">${trainName}</td>
                <td class="text-center">${destination}</td>
                <td class="text-center">${trainFreq}</td>
                <td class="text-center">${nextArrival}</td>
                <td class="text-center">${minAway}</td>
            </tr>
            `
        );
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

});




