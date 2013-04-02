var setDataKeys = function () {

    var geoms = topojson.object(constituencies, constituencies.objects.constituencies).geometries;
    var output = {};
    for (var j = 0; j < qualifications.length; j++) {
        for (var i = 0; i < geoms.length; i++) {

            if (geoms[i].properties.name == (qualifications[j].constituency + " Co Const")) {
                output[geoms[i].id] = qualifications[j];
            }

        }
    }
    console.log(output);
    var joutput = JSON.stringify(output);
    document.getElementById("myjson").textContent = joutput;
}

var getMapConsNames = function () {
    var geoms = topojson.object(constituencies, constituencies.objects.constituencies).geometries;
    var output = "";
    for (var i = 0; i < geoms.length; i++) {

        output += geoms[i].properties.name + "|";

    }
    document.getElementById("myjson").textContent = output;
}

var showLogConsDat = function()
{
    var counter = 0;
    for (var v in cons) {
        counter++;
    }
    console.log(counter);
    console.log(cons);

}

var getConstituencyRegions = function () {
    for (var v in cons) {
        var url = "http://mapit.mysociety.org/area/" + v + "/covered?type=EUR";
        $.ajax({
            dataType: "json",
            url: url,
            data: {},
            success: function (d) {

                console.log(d);
                //console.log(v + "|" + json.name);
            }
        });
        break;
    }
}

var setUneducatedDataKeys = function () {

    var output = {};
    for (var j = 0; j < uneducated.length; j++) {
        var beingProcessed = uneducated[j];

        output[beingProcessed.ons_id] = {
            name: beingProcessed.constituency,
            number_unqual: beingProcessed.number,
            denominator: beingProcessed.denominator,
            percent_unqual: beingProcessed.percent_no_quals,
            party: beingProcessed.party,
            rank: beingProcessed.rank
        };

    }
    console.log(output);
    var joutput = JSON.stringify(output);
    document.getElementById("myjson").textContent = joutput;
}

